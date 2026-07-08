import jwt from 'jsonwebtoken';
import { Admin, type AdminDoc } from '../models/Admin.model.js';
import { RefreshToken } from '../models/RefreshToken.model.js';
import { env } from '../config/env.js';
import { comparePassword } from '../utils/password.js';
import { generateOpaqueToken, hashToken } from '../utils/tokens.js';
import { Unauthorized } from '../errors/httpErrors.js';
import type { Types } from 'mongoose';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthResult {
  admin: { id: string; name: string; email: string; role: string };
  accessToken: string;
  refreshToken: string;
}

function signAccessToken(admin: { _id: Types.ObjectId; email: string; role: string }): string {
  const payload: AccessTokenPayload = { sub: String(admin._id), email: admin.email, role: admin.role };
  const options: jwt.SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

async function issueRefreshToken(adminId: Types.ObjectId, userAgent?: string): Promise<string> {
  const rawToken = generateOpaqueToken();
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ adminId, tokenHash: hashToken(rawToken), userAgent, expiresAt });
  return rawToken;
}

function toAuthAdmin(admin: AdminDoc & { _id: Types.ObjectId }) {
  return { id: String(admin._id), name: admin.name, email: admin.email, role: admin.role };
}

export async function login(email: string, password: string, userAgent?: string): Promise<AuthResult> {
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin || !admin.isActive) throw Unauthorized('Invalid email or password');

  const valid = await comparePassword(password, admin.passwordHash);
  if (!valid) throw Unauthorized('Invalid email or password');

  const accessToken = signAccessToken(admin);
  const refreshToken = await issueRefreshToken(admin._id, userAgent);

  return { admin: toAuthAdmin(admin), accessToken, refreshToken };
}

export async function refresh(rawToken: string, userAgent?: string): Promise<AuthResult> {
  const tokenHash = hashToken(rawToken);
  const stored = await RefreshToken.findOne({ tokenHash });
  if (!stored) throw Unauthorized('Session expired, please log in again');

  if (stored.revokedAt) {
    // Reuse of an already-rotated-away token is a theft signal — kill every session for this admin.
    await RefreshToken.updateMany(
      { adminId: stored.adminId, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );
    throw Unauthorized('Session invalidated for security reasons, please log in again');
  }

  if (stored.expiresAt < new Date()) throw Unauthorized('Session expired, please log in again');

  const admin = await Admin.findById(stored.adminId);
  if (!admin || !admin.isActive) throw Unauthorized('Account is no longer active');

  stored.revokedAt = new Date();
  await stored.save();

  const accessToken = signAccessToken(admin);
  const newRefreshToken = await issueRefreshToken(admin._id, userAgent);

  return { admin: toAuthAdmin(admin), accessToken, refreshToken: newRefreshToken };
}

export async function logout(rawToken: string): Promise<void> {
  const tokenHash = hashToken(rawToken);
  await RefreshToken.updateOne({ tokenHash, revokedAt: null }, { $set: { revokedAt: new Date() } });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as unknown as AccessTokenPayload;
  } catch {
    throw Unauthorized('Invalid or expired access token');
  }
}

export async function getAdminById(id: string) {
  const admin = await Admin.findById(id).lean();
  if (!admin || !admin.isActive) throw Unauthorized('Account is no longer active');
  return toAuthAdmin(admin as AdminDoc & { _id: Types.ObjectId });
}
