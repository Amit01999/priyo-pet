import { z } from 'zod';
import { isValidBdPhone, normalizeBdPhone } from '../utils/phone.js';

const optionalBdPhone = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || isValidBdPhone(v), 'Enter a valid Bangladeshi mobile number')
  .transform((v) => (v ? normalizeBdPhone(v) : v));

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: optionalBdPhone,
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const customerLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, 'Password is required'),
});

export const updateCustomerProfileSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: optionalBdPhone,
  address: z.string().trim().max(300).optional(),
  district: z.string().trim().max(100).optional(),
});
