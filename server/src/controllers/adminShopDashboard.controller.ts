import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { getShopDashboardStats } from '../services/order.service.js';

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await getShopDashboardStats();
  res.status(200).json({ success: true, data: stats });
});
