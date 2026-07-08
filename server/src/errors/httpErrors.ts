import { AppError } from './AppError.js';
import { ERROR_CODES, type ErrorCode } from '../config/constants.js';

export function BadRequest(message: string, errors?: Record<string, string[]>): AppError {
  return new AppError(400, message, ERROR_CODES.VALIDATION_ERROR, errors);
}

export function Unauthorized(message = 'Unauthorized'): AppError {
  return new AppError(401, message, ERROR_CODES.UNAUTHORIZED);
}

export function Forbidden(message = 'Forbidden'): AppError {
  return new AppError(403, message, ERROR_CODES.FORBIDDEN);
}

export function NotFound(message = 'Not found'): AppError {
  return new AppError(404, message, ERROR_CODES.NOT_FOUND);
}

export function Conflict(message: string, errorCode: ErrorCode): AppError {
  return new AppError(409, message, errorCode);
}

export function TooManyRequests(message = 'Too many requests'): AppError {
  return new AppError(429, message, ERROR_CODES.RATE_LIMITED);
}
