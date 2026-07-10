import { z } from 'zod';
import { ORDER_STATUS } from '../config/constants.js';
import { isValidBdPhone, normalizeBdPhone } from '../utils/phone.js';

const bdPhone = z
  .string()
  .trim()
  .min(1, 'Phone number is required')
  .refine(isValidBdPhone, 'Enter a valid Bangladeshi mobile number')
  .transform(normalizeBdPhone);

export const checkoutSchema = z.object({
  shippingName: z.string().trim().min(2, 'Please enter the recipient name'),
  shippingPhone: bdPhone,
  shippingAddress: z.string().trim().min(5, 'Please enter a complete address'),
  shippingDistrict: z.string().trim().min(2, 'Please select a district'),
  notes: z.string().trim().max(500).optional(),
  paymentReference: z.string().trim().min(4, 'সঠিক বিকাশ ট্রানজেকশন আইডি দিন').max(40),
  paymentConfirmedByUser: z.literal(true, {
    errorMap: () => ({ message: 'অনুগ্রহ করে পেমেন্ট নিশ্চিত করুন' }),
  }),
});
export type CheckoutValidatedInput = z.infer<typeof checkoutSchema>;

export const listMyOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const adminListOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  orderStatus: z.enum(ORDER_STATUS).optional(),
  paymentStatus: z.string().trim().optional(),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(ORDER_STATUS),
});

export const rejectOrderPaymentSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});
