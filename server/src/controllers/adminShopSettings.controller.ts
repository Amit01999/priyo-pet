import { z } from 'zod';
import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import * as shopSettingsService from '../services/shopSettings.service.js';

const updateSettingsSchema = z.object({
  deliveryChargeBdt: z.coerce.number().min(0),
});

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await shopSettingsService.getShopSettings();
  res.status(200).json({ success: true, data: settings });
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const input = updateSettingsSchema.parse(req.body);
  const settings = await shopSettingsService.updateShopSettings(input);
  res.status(200).json({ success: true, message: 'Settings updated', data: settings });
});
