import type { AppointmentDoc } from '../models/Appointment.model.js';

/**
 * Extensibility point for real email/SMS/WhatsApp providers.
 * A real Nodemailer-backed implementation is wired in via ./index.ts when SMTP env vars are
 * configured (and never in tests) — see EmailNotificationProvider.ts.
 */
export interface NotificationProvider {
  sendBookingConfirmation(appointment: AppointmentDoc): Promise<void>;
  sendStatusChange(appointment: AppointmentDoc, previousStatus: string): Promise<void>;
  sendPaymentVerified(appointment: AppointmentDoc): Promise<void>;
  sendPaymentRejected(appointment: AppointmentDoc, reason?: string): Promise<void>;
}
