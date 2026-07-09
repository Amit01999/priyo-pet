export const BOOKING_STATUS = ['Pending', 'Confirmed', 'Cancelled', 'Completed'] as const;
export type BookingStatus = (typeof BOOKING_STATUS)[number];

/** Payment is verified manually (bKash Send Money) — no gateway integration yet.
 *  'Verified' payment moves bookingStatus -> 'Confirmed'; 'Rejected' moves it -> 'Cancelled'
 *  (see payment.service.ts) so the existing slot-freeing/isActive semantics apply for free. */
export const PAYMENT_STATUS = ['Pending Verification', 'Verified', 'Rejected'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const PAYMENT_METHODS = ['bKash'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Fixed campaign fee, server-stamped only — never client-suppliable (same pattern as
 *  CONSENT_TEXT_VERSION in appointment.service.ts). */
export const PAYMENT_AMOUNT_BDT = 70;

export const ADMIN_ROLES = ['admin', 'superadmin'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const APPOINTMENT_SOURCE = ['public', 'admin-walkin'] as const;
export type AppointmentSource = (typeof APPOINTMENT_SOURCE)[number];

export const ANIMAL_TYPES = ['dog', 'cat', 'other'] as const;
export type AnimalType = (typeof ANIMAL_TYPES)[number];

export const GENDERS = ['male', 'female'] as const;
export type Gender = (typeof GENDERS)[number];

export const AGE_BUCKETS = ['lt_3m', 'm3_6', 'm6_12', 'y1_3', 'gt_3y'] as const;
export type AgeBucket = (typeof AGE_BUCKETS)[number];

export const HEALTH_STATUSES = [
  'healthy',
  'sick',
  'pregnant',
  'nursing',
  'under_treatment',
  'other',
] as const;
export type HealthStatus = (typeof HEALTH_STATUSES)[number];

export const HEAR_ABOUT_OPTIONS = [
  'facebook',
  'priyopet_khulna',
  'jci_dhaka_north',
  'friend_relative',
  'vet_doctor',
  'other',
] as const;
export type HearAboutOption = (typeof HEAR_ABOUT_OPTIONS)[number];

export const DAY_STATUS = ['open', 'closed'] as const;
export type DayStatus = (typeof DAY_STATUS)[number];

/** Machine-readable error codes returned in the API's `errorCode` field for 409s and friends. */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RATE_LIMITED: 'RATE_LIMITED',
  SLOT_TAKEN: 'SLOT_TAKEN',
  SLOT_BLOCKED: 'SLOT_BLOCKED',
  SLOT_TIME_PASSED: 'SLOT_TIME_PASSED',
  SLOT_OUT_OF_RANGE: 'SLOT_OUT_OF_RANGE',
  DAY_CLOSED: 'DAY_CLOSED',
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED',
  DUPLICATE_APPOINTMENT: 'DUPLICATE_APPOINTMENT',
  DUPLICATE_PAYMENT_REFERENCE: 'DUPLICATE_PAYMENT_REFERENCE',
  PAYMENT_ALREADY_RESOLVED: 'PAYMENT_ALREADY_RESOLVED',
  INVALID_DATE: 'INVALID_DATE',
  ILLEGAL_STATUS_TRANSITION: 'ILLEGAL_STATUS_TRANSITION',
  CAPACITY_CONFLICT: 'CAPACITY_CONFLICT',
  DURATION_LOCKED: 'DURATION_LOCKED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
