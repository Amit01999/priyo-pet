import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { createCategorySchema, updateCategorySchema } from '../validators/shopCatalog.validators.js';
import * as categoryService from '../services/category.service.js';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.listCategories(false);
  res.status(200).json({ success: true, data: categories });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = createCategorySchema.parse(req.body);
  const category = await categoryService.createCategory(input);
  res.status(201).json({ success: true, message: 'Category created', data: category });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const input = updateCategorySchema.parse(req.body);
  const category = await categoryService.updateCategory(req.params.id, input);
  res.status(200).json({ success: true, message: 'Category updated', data: category });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json({ success: true, message: 'Category deleted' });
});
