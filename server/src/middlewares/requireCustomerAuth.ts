import type { NextFunction, Request, Response } from 'express';
import { verifyCustomerAccessToken } from '../services/customerAuth.service.js';
import { Unauthorized } from '../errors/httpErrors.js';

export function requireCustomerAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(Unauthorized('Missing access token'));
    return;
  }
  const token = header.slice('Bearer '.length);
  try {
    req.customer = verifyCustomerAccessToken(token);
    next();
  } catch (err) {
    next(err);
  }
}
