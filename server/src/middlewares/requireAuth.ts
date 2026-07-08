import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../services/auth.service.js';
import { Unauthorized } from '../errors/httpErrors.js';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(Unauthorized('Missing access token'));
    return;
  }
  const token = header.slice('Bearer '.length);
  try {
    req.admin = verifyAccessToken(token);
    next();
  } catch (err) {
    next(err);
  }
}
