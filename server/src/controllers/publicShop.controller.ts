import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { listProductsQuerySchema } from '../validators/shopCatalog.validators.js';
import * as productService from '../services/product.service.js';
import * as categoryService from '../services/category.service.js';
import { getShopSettings } from '../services/shopSettings.service.js';
import { env } from '../config/env.js';

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = listProductsQuerySchema.parse(req.query);
  const result = await productService.listProducts(query);
  res.status(200).json({ success: true, data: result });
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductBySlug(req.params.slug);
  const related = await productService.getRelatedProducts(product);
  res.status(200).json({ success: true, data: { product, related } });
});

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.listCategories(true);
  res.status(200).json({ success: true, data: categories });
});

export const getPaymentInfo = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getShopSettings();
  res.status(200).json({
    success: true,
    data: {
      method: 'bKash' as const,
      bkashNumber: env.BKASH_MERCHANT_NUMBER ?? '',
      deliveryChargeBdt: settings.deliveryChargeBdt,
    },
  });
});
