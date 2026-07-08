import type { NextFunction, Request, Response } from 'express';
import type { AdminRole } from '../config/constants.js';
import { Forbidden, Unauthorized } from '../errors/httpErrors.js';

export function requireRole(...roles: AdminRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.admin) {
      next(Unauthorized());
      return;
    }
    if (!roles.includes(req.admin.role as AdminRole)) {
      next(Forbidden('You do not have permission to perform this action'));
      return;
    }
    next();
  };
}
