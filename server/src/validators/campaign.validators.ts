import { z } from 'zod';
import { DAY_STATUS } from '../config/constants.js';

export const updateCampaignConfigSchema = z
  .object({
    maxSlotsPerDay: z.coerce.number().int().min(1).optional(),
    slotDurationMinutes: z.coerce.number().int().min(1).optional(),
    registrationOpensAt: z.coerce.date().optional(),
    registrationClosesAt: z.coerce.date().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, 'Provide at least one field to update');
export type UpdateCampaignConfigInput = z.infer<typeof updateCampaignConfigSchema>;

export const updateDayStatusSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  status: z.enum(DAY_STATUS),
});
export type UpdateDayStatusInput = z.infer<typeof updateDayStatusSchema>;

export const slotsQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
});
