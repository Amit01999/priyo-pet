import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { toPublicCampaignView } from '../services/campaign.service.js';
import { getSlotsForDate } from '../services/slot.service.js';
import { slotsQuerySchema } from '../validators/campaign.validators.js';

export const getCampaign = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: toPublicCampaignView(req.campaign!) });
});

export const getSlots = asyncHandler(async (req: Request, res: Response) => {
  const { date } = slotsQuerySchema.parse(req.query);
  const result = await getSlotsForDate(req.campaign!, date);
  res.status(200).json({ success: true, data: result });
});
