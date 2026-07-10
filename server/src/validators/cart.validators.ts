import { z } from 'zod';

export const addCartItemSchema = z.object({
  productId: z.string().trim().min(1),
  variantId: z.string().trim().min(1).nullable().optional(),
  quantity: z.coerce.number().int().min(1).default(1),
});

export const updateCartItemSchema = z.object({
  productId: z.string().trim().min(1),
  variantId: z.string().trim().min(1).nullable().optional(),
  quantity: z.coerce.number().int().min(1),
});

export const removeCartItemSchema = z.object({
  productId: z.string().trim().min(1),
  variantId: z.string().trim().min(1).nullable().optional(),
});
