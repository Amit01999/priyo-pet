import { Appointment, type AppointmentDoc } from '../models/Appointment.model.js';
import { updateAppointmentStatus } from './appointment.service.js';
import { NotFound, Conflict } from '../errors/httpErrors.js';
import { ERROR_CODES } from '../config/constants.js';
import { notificationProvider } from '../notifications/index.js';

function assertPendingVerification(appointment: Pick<AppointmentDoc, 'paymentStatus'>): void {
  if (appointment.paymentStatus !== 'Pending Verification') {
    throw Conflict(
      `Payment has already been marked "${appointment.paymentStatus}" for this appointment.`,
      ERROR_CODES.PAYMENT_ALREADY_RESOLVED
    );
  }
}

export async function verifyPayment(appointmentId: string, adminId: string): Promise<AppointmentDoc> {
  const current = await Appointment.findById(appointmentId).lean<AppointmentDoc>();
  if (!current) throw NotFound('Appointment not found');
  assertPendingVerification(current);

  // Reuses the existing bookingStatus transition-legality + isActive toggling logic instead of
  // duplicating it — e.g. an already-cancelled appointment correctly rejects this with a 400.
  await updateAppointmentStatus(appointmentId, 'Confirmed');

  const updated = await Appointment.findByIdAndUpdate(
    appointmentId,
    { $set: { paymentStatus: 'Verified', verifiedBy: adminId, verifiedAt: new Date() } },
    { new: true }
  ).lean<AppointmentDoc>();
  if (!updated) throw NotFound('Appointment not found');

  await notificationProvider.sendPaymentVerified(updated);
  return updated;
}

export async function rejectPayment(
  appointmentId: string,
  adminId: string,
  reason?: string
): Promise<AppointmentDoc> {
  const current = await Appointment.findById(appointmentId).lean<AppointmentDoc>();
  if (!current) throw NotFound('Appointment not found');
  assertPendingVerification(current);

  // 'Cancelled' frees the slot via the same isActive toggle every other cancellation uses.
  await updateAppointmentStatus(appointmentId, 'Cancelled');

  const updated = await Appointment.findByIdAndUpdate(
    appointmentId,
    {
      $set: {
        paymentStatus: 'Rejected',
        paymentRejectionReason: reason ?? '',
        verifiedBy: adminId,
        verifiedAt: new Date(),
      },
    },
    { new: true }
  ).lean<AppointmentDoc>();
  if (!updated) throw NotFound('Appointment not found');

  await notificationProvider.sendPaymentRejected(updated, reason);
  return updated;
}
