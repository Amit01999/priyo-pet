/**
 * Master switch for the public campaign appointment booking form.
 *
 * Set to `true` to reopen booking — that single change restores the form, the hero's
 * "book appointment" CTA, and the booking-deadline badge. Nothing else needs editing:
 * the form, its validation, the API layer, and all backend/admin logic are untouched
 * and stay fully intact while this is `false`.
 *
 * NOTE: this gates the UI only. The public booking endpoint itself stays open — to close
 * bookings server-side, use the existing admin panel (Slot Management → Close Day, or the
 * campaign's registration window), which is the system's real enforcement mechanism.
 */
export const IS_APPOINTMENT_BOOKING_OPEN = false;

export const BOOKING_CLOSED_TITLE =
  'Appointment booking is currently closed. Please stay tuned for the next booking schedule.';

export const BOOKING_CLOSED_SUBTITLE =
  'Thank you for your interest. We will announce the next appointment schedule soon.';
