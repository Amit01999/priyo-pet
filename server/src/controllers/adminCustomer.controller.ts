import { z } from 'zod';
import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import * as customerAdminService from '../services/customerAdmin.service.js';

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = listQuerySchema.parse(req.query);
  const result = await customerAdminService.listCustomersAdmin(query);
  res.status(200).json({ success: true, data: result });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const profile = await customerAdminService.getCustomerProfileWithStats(req.params.id);
  res.status(200).json({ success: true, data: profile });
});
