import multer, { MulterError } from 'multer';
import type { NextFunction, Request, Response } from 'express';
import { BadRequest } from '../errors/httpErrors.js';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

// memoryStorage only — the API runs as a Vercel serverless function with a read-only
// filesystem, so files must be held in a buffer and streamed straight to Cloudinary.
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(BadRequest('Only JPG, PNG, and WebP images are allowed'));
      return;
    }
    cb(null, true);
  },
});

/** Wraps multer's single-file middleware so both fileFilter errors (already AppError) and
 *  multer's own errors (e.g. LIMIT_FILE_SIZE, a MulterError) come out through the same
 *  {success:false, message, errorCode} envelope as every other API error. */
export function uploadSingleImage(fieldName: string) {
  const handler = uploader.single(fieldName);
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, (err: unknown) => {
      if (!err) {
        next();
        return;
      }
      if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE') {
        next(BadRequest(`Image must be smaller than ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB`));
        return;
      }
      next(err);
    });
  };
}
