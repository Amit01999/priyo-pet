import type { NotificationProvider } from './NotificationProvider.js';
import type { AppointmentDoc } from '../models/Appointment.model.js';
import { logger } from '../utils/logger.js';

/**
 * Console-only stand-in until a real email/SMS/WhatsApp provider is wired in.
 * Deliberately swallows its own errors — a notification failure must never fail a booking.
 */
export class NoopNotificationProvider implements NotificationProvider {
  async sendBookingConfirmation(appointment: AppointmentDoc): Promise<void> {
    try {
      logger.info('Notification (booking confirmation) — no provider configured', {
        appointmentId: String(appointment._id),
        email: appointment.email,
      });
    } catch {
      // never let a notification failure affect the booking flow
    }
  }

  async sendStatusChange(appointment: AppointmentDoc, previousStatus: string): Promise<void> {
    try {
      logger.info('Notification (status change) — no provider configured', {
        appointmentId: String(appointment._id),
        from: previousStatus,
        to: appointment.bookingStatus,
      });
    } catch {
      // never let a notification failure affect the booking flow
    }
  }

  async sendPaymentVerified(appointment: AppointmentDoc): Promise<void> {
    try {
      logger.info('Notification (payment verified) — no provider configured', {
        appointmentId: String(appointment._id),
        email: appointment.email,
      });
    } catch {
      // never let a notification failure affect the booking flow
    }
  }

  async sendPaymentRejected(appointment: AppointmentDoc, reason?: string): Promise<void> {
    try {
      logger.info('Notification (payment rejected) — no provider configured', {
        appointmentId: String(appointment._id),
        email: appointment.email,
        reason,
      });
    } catch {
      // never let a notification failure affect the booking flow
    }
  }
}
