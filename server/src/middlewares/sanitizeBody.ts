import type { NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';

/**
 * Applies NoSQL-injection sanitization to req.body ONLY, using the library's manual
 * `.sanitize()` utility rather than mounting it as a blanket middleware. The blanket
 * middleware also tries to sanitize req.query, which is a getter-only property in some
 * Express/Node combinations and throws — query/params are already fully covered by zod
 * validation (which builds new objects, not in-place mutation), so this is the only place
 * it's actually needed.
 */
export function sanitizeBody(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = mongoSanitize.sanitize(req.body);
  }
  next();
}
