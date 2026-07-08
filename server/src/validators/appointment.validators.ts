import { z } from 'zod';
import {
  ANIMAL_TYPES,
  GENDERS,
  AGE_BUCKETS,
  HEALTH_STATUSES,
  HEAR_ABOUT_OPTIONS,
  BOOKING_STATUS,
} from '../config/constants.js';
import { isValidBdPhone, normalizeBdPhone } from '../utils/phone.js';

const bdPhone = z
  .string()
  .trim()
  .min(1, 'Mobile number is required')
  .refine(isValidBdPhone, 'Enter a valid Bangladeshi mobile number (e.g. 01712345678)')
  .transform(normalizeBdPhone);

const optionalBdPhone = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || isValidBdPhone(v), 'Enter a valid Bangladeshi mobile number')
  .transform((v) => (v ? normalizeBdPhone(v) : v));

/** Public submission schema — mirrors the source Google Form's 15 fields, in order, plus the
 *  slot picker and consent checkbox this system adds on top (see plan deviations #1 and #2). */
export const createAppointmentSchema = z.object({
  guardianName: z.string().trim().min(2, 'Please enter the guardian’s full name'),
  mobileNumber: bdPhone,
  alternateMobileNumber: optionalBdPhone,
  email: z.string().trim().email('Enter a valid email address'),

  petName: z.string().trim().min(1, "Please enter your pet's name"),
  animalType: z
    .array(z.enum(ANIMAL_TYPES))
    .min(1, 'Select at least one animal type'),
  breed: z.string().trim().optional(),
  gender: z.enum(GENDERS, { errorMap: () => ({ message: 'Select a gender' }) }),
  age: z.enum(AGE_BUCKETS, { errorMap: () => ({ message: "Select your pet's age" }) }),
  weight: z.string().trim().min(1, 'Please enter approximate weight'),
  colorMarkings: z.string().trim().min(1, 'Please describe color/distinguishing marks'),

  previousVaccinationInfo: z
    .string()
    .trim()
    .min(1, 'Please answer the previous vaccination question')
    .max(2000, 'Please keep this under 2000 characters'),
  currentHealthStatus: z.enum(HEALTH_STATUSES, {
    errorMap: () => ({ message: "Select your pet's current health status" }),
  }),

  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Select a valid date'),
  hearAboutCampaign: z.enum(HEAR_ABOUT_OPTIONS, {
    errorMap: () => ({ message: 'Let us know how you heard about this campaign' }),
  }),

  slotNumber: z.coerce.number().int().min(1, 'Select an appointment slot'),

  consentAcknowledged: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the consent terms to proceed' }),
  }),
});
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

export const adminCreateAppointmentSchema = createAppointmentSchema.extend({
  bookingStatus: z.enum(BOOKING_STATUS).optional(),
});

export const updateStatusSchema = z.object({
  bookingStatus: z.enum(BOOKING_STATUS),
});

export const updateNotesSchema = z.object({
  notes: z.string().trim().max(4000).default(''),
});

export const listAppointmentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  status: z.enum(BOOKING_STATUS).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sortBy: z.enum(['createdAt', 'appointmentDate', 'guardianName', 'bookingStatus']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type ListAppointmentsQuery = z.infer<typeof listAppointmentsQuerySchema>;

export const exportQuerySchema = z.object({
  format: z.enum(['csv', 'xlsx']).default('csv'),
  status: z.enum(BOOKING_STATUS).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
