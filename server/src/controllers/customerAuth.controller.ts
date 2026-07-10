import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import * as customerAuthService from '../services/customerAuth.service.js';
import { registerSchema, customerLoginSchema, updateCustomerProfileSchema } from '../validators/customerAuth.validators.js';
import { env, isProduction } from '../config/env.js';
import { Unauthorized } from '../errors/httpErrors.js';

const REFRESH_COOKIE_NAME = 'customerRefreshToken';
const REFRESH_COOKIE_PATH = '/api/customer/auth';

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: REFRESH_COOKIE_PATH,
    domain: env.COOKIE_DOMAIN,
    maxAge: env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  };
}

function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, refreshCookieOptions());
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH, domain: env.COOKIE_DOMAIN });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);
  const result = await customerAuthService.register(input, req.headers['user-agent']);
  setRefreshCookie(res, result.refreshToken);
  res.status(201).json({ success: true, message: 'Account created', data: { customer: result.customer, accessToken: result.accessToken } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = customerLoginSchema.parse(req.body);
  const result = await customerAuthService.login(input.email, input.password, req.headers['user-agent']);
  setRefreshCookie(res, result.refreshToken);
  res.status(200).json({ success: true, message: 'Logged in', data: { customer: result.customer, accessToken: result.accessToken } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) throw Unauthorized('No active session');

  const result = await customerAuthService.refresh(token, req.headers['user-agent']);
  setRefreshCookie(res, result.refreshToken);
  res.status(200).json({ success: true, message: 'Session refreshed', data: { customer: result.customer, accessToken: result.accessToken } });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (token) await customerAuthService.logout(token);
  clearRefreshCookie(res);
  res.status(200).json({ success: true, message: 'Logged out' });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerAuthService.getCustomerById(req.customer!.sub);
  res.status(200).json({ success: true, data: { customer } });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const updates = updateCustomerProfileSchema.parse(req.body);
  const customer = await customerAuthService.updateProfile(req.customer!.sub, updates);
  res.status(200).json({ success: true, message: 'Profile updated', data: { customer } });
});
