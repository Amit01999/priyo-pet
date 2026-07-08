import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../config/constants.js';
import { isProduction } from '../config/env.js';
import { logger } from '../utils/logger.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      ...(err.errors ? { errors: err.errors } : {}),
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errorCode: ERROR_CODES.VALIDATION_ERROR,
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  logger.error('Unhandled error', {
    path: req.path,
    message: err instanceof Error ? err.message : String(err),
    stack: !isProduction && err instanceof Error ? err.stack : undefined,
  });

  res.status(500).json({
    success: false,
    message: isProduction ? 'Something went wrong' : (err as Error)?.message || 'Something went wrong',
    errorCode: ERROR_CODES.INTERNAL_ERROR,
  });
}
