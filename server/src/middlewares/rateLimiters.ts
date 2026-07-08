import rateLimit from 'express-rate-limit';
import { TooManyRequests } from '../errors/httpErrors.js';

const limitHandler = (_req: unknown, _res: unknown, next: (err?: unknown) => void) => {
  next(TooManyRequests());
};

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler,
});

export const publicSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler,
});

export const publicReadLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler,
});
