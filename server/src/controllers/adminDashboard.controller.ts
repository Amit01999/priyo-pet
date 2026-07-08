import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { getDashboardStats } from '../services/dashboard.service.js';
import { Campaign } from '../models/Campaign.model.js';

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getDashboardStats(req.campaign!);
  res.status(200).json({ success: true, data: stats });
});

export const listCampaigns = asyncHandler(async (_req: Request, res: Response) => {
  const campaigns = await Campaign.find({ isActive: true }).select('slug title dates isActive').lean();
  res.status(200).json({ success: true, data: campaigns });
});
