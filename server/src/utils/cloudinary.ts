import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../config/constants.js';
import { logger } from './logger.js';

const isConfigured = Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);

if (isConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const PRODUCT_IMAGE_FOLDER = 'priyopet/products';

export interface UploadedImage {
  url: string;
  publicId: string;
}

/** Streams a buffer straight to Cloudinary — never touches disk, which matters because the API
 *  runs as a Vercel serverless function with a read-only filesystem (see server/api/index.js). */
export function uploadImageBuffer(buffer: Buffer, folder = PRODUCT_IMAGE_FOLDER): Promise<UploadedImage> {
  if (!isConfigured) {
    throw new AppError(500, 'Image upload is not configured on this server', ERROR_CODES.INTERNAL_ERROR);
  }
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (err, result) => {
      if (err || !result) {
        logger.error('Cloudinary upload failed', { message: err?.message });
        reject(new AppError(502, 'Could not upload image. Please try again.', ERROR_CODES.INTERNAL_ERROR));
        return;
      }
      resolve({ url: result.secure_url, publicId: result.public_id });
    });
    uploadStream.end(buffer);
  });
}

/** Best-effort cleanup — a failed delete (e.g. already gone, transient network error) must never
 *  block the product create/update/delete flow that triggered it, so errors are logged, not thrown. */
export async function deleteImage(publicId: string): Promise<void> {
  if (!isConfigured || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    logger.error('Failed to delete Cloudinary image', {
      publicId,
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
