import { z } from 'zod';

export const blockSlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  slotNumber: z.coerce.number().int().min(1),
  reason: z.string().trim().max(500).optional().default(''),
});
export type BlockSlotInput = z.infer<typeof blockSlotSchema>;

export const unblockSlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  slotNumber: z.coerce.number().int().min(1),
});
export type UnblockSlotInput = z.infer<typeof unblockSlotSchema>;
