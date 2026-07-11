import type { PaymentStatus, OrderStatus } from '@/lib/api/types';

/** Soft-pill badge palette for customer-facing order statuses, matching the public site's
 *  brand colors — mirrors the same color logic used in the admin dashboard's statusStyles. */
const AMBER = 'bg-[#FFF4E8] text-[#B5580A] border-transparent';
const GREEN = 'bg-[#EAF7EA] text-[#1a3d1a] border-transparent';
const GREEN_SOLID = 'bg-[#1a3d1a] text-white border-transparent';
const RED = 'bg-red-50 text-red-600 border-transparent';
const BLUE = 'bg-sky-50 text-sky-700 border-transparent';
const VIOLET = 'bg-violet-50 text-violet-700 border-transparent';

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
