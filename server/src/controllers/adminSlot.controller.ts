import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { getSlotsForDate } from '../services/slot.service.js';
import { blockSlot, setDayStatus, unblockSlot, updateCampaignConfig } from '../services/slotAdmin.service.js';
import { slotsQuerySchema, updateCampaignConfigSchema, updateDayStatusSchema } from '../validators/campaign.validators.js';
import { blockSlotSchema, unblockSlotSchema } from '../validators/slot.validators.js';

export const getSlots = asyncHandler(async (req: Request, res: Response) => {
  const { date } = slotsQuerySchema.parse(req.query);
  const result = await getSlotsForDate(req.campaign!, date);
  res.status(200).json({ success: true, data: result });
});

export const block = asyncHandler(async (req: Request, res: Response) => {
  const input = blockSlotSchema.parse(req.body);
  await blockSlot(req.campaign!, input.date, input.slotNumber, input.reason, req.admin!.sub);
  res.status(200).json({ success: true, message: 'Slot blocked' });
});

export const unblock = asyncHandler(async (req: Request, res: Response) => {
  const input = unblockSlotSchema.parse(req.body);
  await unblockSlot(String(req.campaign!._id), input.date, input.slotNumber);
  res.status(200).json({ success: true, message: 'Slot unblocked' });
});

export const updateDayStatus = asyncHandler(async (req: Request, res: Response) => {
  const input = updateDayStatusSchema.parse(req.body);
  await setDayStatus(req.campaign!, input.date, input.status);
  res.status(200).json({ success: true, message: `Day marked ${input.status}` });
});

export const updateConfig = asyncHandler(async (req: Request, res: Response) => {
  const input = updateCampaignConfigSchema.parse(req.body);
  const updated = await updateCampaignConfig(req.campaign!, input);
  res.status(200).json({ success: true, message: 'Campaign updated', data: updated });
});
