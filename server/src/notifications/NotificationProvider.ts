import type { AppointmentDoc } from '../models/Appointment.model.js';

/**
 * Extensibility point for real email/SMS/WhatsApp providers later.
 * Wired into services now; no real provider is implemented yet (out of scope).
 */
export interface NotificationProvider {
  sendBookingConfirmation(appointment: AppointmentDoc): Promise<void>;
  sendStatusChange(appointment: AppointmentDoc, previousStatus: string): Promise<void>;
}
