import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import {
  createProductSchema,
  updateProductSchema,
  adminListProductsQuerySchema,
} from '../validators/shopCatalog.validators.js';
import * as productService from '../services/product.service.js';
import { uploadImageBuffer, deleteImage } from '../utils/cloudinary.js';
import { BadRequest } from '../errors/httpErrors.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = adminListProductsQuerySchema.parse(req.query);
  const result = await productService.listProductsAdmin(query);
  res.status(200).json({ success: true, data: result });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductByIdAdmin(req.params.id);
  res.status(200).json({ success: true, data: product });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = createProductSchema.parse(req.body);
  const product = await productService.createProduct(input);
  res.status(201).json({ success: true, message: 'Product created', data: product });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const input = updateProductSchema.parse(req.body);
  const product = await productService.updateProduct(req.params.id, input);
  res.status(200).json({ success: true, message: 'Product updated', data: product });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.id);
  res.status(200).json({ success: true, message: 'Product deleted' });
});

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw BadRequest('No image file provided');
  const result = await uploadImageBuffer(req.file.buffer);
  res.status(201).json({ success: true, message: 'Image uploaded', data: result });
});

// Best-effort cleanup for an image the admin uploaded and then removed before saving the
// product — the still-referenced case (replacing/removing a saved product's image) is instead
// handled inside productService.updateProduct/deleteProduct once the product itself is saved.
export const removeUploadedImage = asyncHandler(async (req: Request, res: Response) => {
  const publicId = typeof req.query.publicId === 'string' ? req.query.publicId : undefined;
  if (!publicId) throw BadRequest('publicId is required');
  await deleteImage(publicId);
  res.status(200).json({ success: true, message: 'Image deleted' });
});
