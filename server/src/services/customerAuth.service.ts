import jwt from 'jsonwebtoken';
import { Customer, type CustomerDoc } from '../models/Customer.model.js';
import { CustomerRefreshToken } from '../models/CustomerRefreshToken.model.js';
import { env } from '../config/env.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { generateOpaqueToken, hashToken } from '../utils/tokens.js';
import { Unauthorized, Conflict } from '../errors/httpErrors.js';
import { ERROR_CODES } from '../config/constants.js';
import type { Types } from 'mongoose';

export interface CustomerAccessTokenPayload {
  sub: string;
  email: string;
  type: 'customer';
}

export interface CustomerAuthResult {
  customer: { id: string; name: string; email: string; phone?: string; address: string; district: string };
  accessToken: string;
  refreshToken: string;
}

function signAccessToken(customer: { _id: Types.ObjectId; email: string }): string {
  const payload: CustomerAccessTokenPayload = { sub: String(customer._id), email: customer.email, type: 'customer' };
  const options: jwt.SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

async function issueRefreshToken(customerId: Types.ObjectId, userAgent?: string): Promise<string> {
  const rawToken = generateOpaqueToken();
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);
  await CustomerRefreshToken.create({ customerId, tokenHash: hashToken(rawToken), userAgent, expiresAt });
  return rawToken;
}

function toAuthCustomer(customer: CustomerDoc & { _id: Types.ObjectId }) {
  return {
    id: String(customer._id),
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? undefined,
    address: customer.address,
    district: customer.district,
  };
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}, userAgent?: string): Promise<CustomerAuthResult> {
  const existing = await Customer.findOne({ email: input.email.toLowerCase() });
  if (existing) throw Conflict('An account with this email already exists', ERROR_CODES.EMAIL_IN_USE);

  const passwordHash = await hashPassword(input.password);
  const customer = await Customer.create({
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    passwordHash,
  });

  const accessToken = signAccessToken(customer);
  const refreshToken = await issueRefreshToken(customer._id, userAgent);
  return { customer: toAuthCustomer(customer), accessToken, refreshToken };
}

export async function login(email: string, password: string, userAgent?: string): Promise<CustomerAuthResult> {
  const customer = await Customer.findOne({ email: email.toLowerCase() });
  if (!customer || !customer.isActive) throw Unauthorized('Invalid email or password');

  const valid = await comparePassword(password, customer.passwordHash);
  if (!valid) throw Unauthorized('Invalid email or password');

  const accessToken = signAccessToken(customer);
  const refreshToken = await issueRefreshToken(customer._id, userAgent);
  return { customer: toAuthCustomer(customer), accessToken, refreshToken };
}

export async function refresh(rawToken: string, userAgent?: string): Promise<CustomerAuthResult> {
  const tokenHash = hashToken(rawToken);
  const stored = await CustomerRefreshToken.findOne({ tokenHash });
  if (!stored) throw Unauthorized('Session expired, please log in again');

  if (stored.revokedAt) {
    await CustomerRefreshToken.updateMany(
      { customerId: stored.customerId, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );
    throw Unauthorized('Session invalidated for security reasons, please log in again');
  }

  if (stored.expiresAt < new Date()) throw Unauthorized('Session expired, please log in again');

  const customer = await Customer.findById(stored.customerId);
  if (!customer || !customer.isActive) throw Unauthorized('Account is no longer active');

  stored.revokedAt = new Date();
  await stored.save();

  const accessToken = signAccessToken(customer);
  const newRefreshToken = await issueRefreshToken(customer._id, userAgent);
  return { customer: toAuthCustomer(customer), accessToken, refreshToken: newRefreshToken };
}

export async function logout(rawToken: string): Promise<void> {
  const tokenHash = hashToken(rawToken);
  await CustomerRefreshToken.updateOne({ tokenHash, revokedAt: null }, { $set: { revokedAt: new Date() } });
}

export function verifyCustomerAccessToken(token: string): CustomerAccessTokenPayload {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as unknown as CustomerAccessTokenPayload;
    // Guards against an admin access token (same signing secret) being replayed against
    // customer-only routes, since only customer tokens are minted with `type: 'customer'`.
    if (payload.type !== 'customer') throw new Error('wrong token type');
    return payload;
  } catch {
    throw Unauthorized('Invalid or expired access token');
  }
}

export async function getCustomerById(id: string) {
  const customer = await Customer.findById(id).lean();
  if (!customer || !customer.isActive) throw Unauthorized('Account is no longer active');
  return toAuthCustomer(customer as CustomerDoc & { _id: Types.ObjectId });
}

export async function updateProfile(
  id: string,
  updates: { name?: string; phone?: string; address?: string; district?: string }
) {
  const customer = await Customer.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
  if (!customer) throw Unauthorized('Account is no longer active');
  return toAuthCustomer(customer as CustomerDoc & { _id: Types.ObjectId });
}
