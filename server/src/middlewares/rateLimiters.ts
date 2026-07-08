/**
 * Rate limiters using express-rate-limit with the default in-memory store.
 *
 * SERVERLESS NOTE: On Vercel, each function invocation may run in a fresh
 * sandbox, so in-memory counters reset per cold-start. This still provides
 * meaningful protection within a single warm container's lifetime and will
 * naturally catch rapid burst attacks targeting the same warm instance.
 * For stateful, cross-invocation rate limiting a Redis store (e.g. @upstash/ratelimit)
 * would be required — that is an optional future enhancement.
 *
 * The trust proxy setting in app.ts ensures req.ip reflects the real client
 * IP from Vercel's X-Forwarded-For header, not the internal proxy IP.
 */
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
