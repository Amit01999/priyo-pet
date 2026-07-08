import type { NextFunction, Request, Response } from 'express';
import { getCampaignBySlug } from '../services/campaign.service.js';
import { asyncHandler } from './asyncHandler.js';

export const resolveCampaign = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const campaign = await getCampaignBySlug(req.params.slug);
  req.campaign = campaign;
  next();
});
