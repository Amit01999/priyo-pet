import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import * as authService from '../services/auth.service.js';
import { loginSchema } from '../validators/auth.validators.js';
import { env, isProduction } from '../config/env.js';
import { Unauthorized } from '../errors/httpErrors.js';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_PATH = '/api/admin/auth';

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

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input.email, input.password, req.headers['user-agent']);
  setRefreshCookie(res, result.refreshToken);
  res.status(200).json({ success: true, message: 'Logged in', data: { admin: result.admin, accessToken: result.accessToken } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) throw Unauthorized('No active session');

  const result = await authService.refresh(token, req.headers['user-agent']);
  setRefreshCookie(res, result.refreshToken);
  res.status(200).json({ success: true, message: 'Session refreshed', data: { admin: result.admin, accessToken: result.accessToken } });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (token) await authService.logout(token);
  clearRefreshCookie(res);
  res.status(200).json({ success: true, message: 'Logged out' });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const admin = await authService.getAdminById(req.admin!.sub);
  res.status(200).json({ success: true, data: { admin } });
});
