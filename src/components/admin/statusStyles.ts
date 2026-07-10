import type { BookingStatus, PaymentStatus, OrderStatus } from '@/lib/api/types';

/** Shared soft-pill badge palette for the admin dashboard, matching the public site's
 *  dark-green / warm-orange brand instead of badge.tsx's generic default/secondary/destructive
 *  variants (kept vendored/untouched — these are ad hoc overrides via className). */
const AMBER = 'bg-[#FFF4E8] text-[#B5580A] border-transparent hover:bg-[#FFECD9]';
const GREEN = 'bg-[#EAF7EA] text-[#1a3d1a] border-transparent hover:bg-[#DFF2DF]';
const GREEN_SOLID = 'bg-[#1a3d1a] text-white border-transparent hover:bg-[#2a5a2a]';
const RED = 'bg-red-50 text-red-600 border-transparent hover:bg-red-100';
const BLUE = 'bg-sky-50 text-sky-700 border-transparent hover:bg-sky-100';
const VIOLET = 'bg-violet-50 text-violet-700 border-transparent hover:bg-violet-100';
const GRAY = 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200';

export const STATUS_BADGE_CLASSES: Record<BookingStatus, string> = {
  Pending: AMBER,
  Confirmed: GREEN,
  Cancelled: RED,
  Completed: GREEN_SOLID,
};

export const PAYMENT_STATUS_BADGE_CLASSES: Record<PaymentStatus, string> = {
  'Pending Verification': AMBER,
  Verified: GREEN,
  Rejected: RED,
};

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  Pending: AMBER,
  Approved: BLUE,
  Processing: VIOLET,
  Shipped: BLUE,
  Delivered: GREEN_SOLID,
  Cancelled: RED,
};

export const ENABLED_BADGE_CLASSES = {
  enabled: GREEN,
  disabled: GRAY,
} as const;
