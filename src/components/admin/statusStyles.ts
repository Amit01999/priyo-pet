import type { BookingStatus } from '@/lib/api/types';

/** badge.tsx's stock variants cover Pending(secondary)/Cancelled(destructive)/Confirmed(default);
 *  Completed needs an ad hoc override rather than touching the vendored component. */
export const STATUS_BADGE_CLASSES: Record<BookingStatus, string> = {
  Pending: 'bg-secondary/15 text-secondary border-transparent hover:bg-secondary/20',
  Confirmed: 'bg-primary/15 text-primary border-transparent hover:bg-primary/20',
  Cancelled: 'bg-destructive/15 text-destructive border-transparent hover:bg-destructive/20',
  Completed: 'bg-green-100 text-green-700 border-transparent hover:bg-green-200',
};
