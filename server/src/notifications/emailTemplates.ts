import type { AppointmentDoc } from '../models/Appointment.model.js';
import type { CampaignDoc } from '../models/Campaign.model.js';

const BRAND_GREEN = '#1a3d1a';
const BRAND_ORANGE = '#E86A10';

/** Guards against HTML injection when interpolating user-supplied free text
 *  (guardianName, petName, etc.) into outbound email bodies. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function wrapper(title: string, bodyHtml: string): string {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #222;">
    <div style="background: ${BRAND_GREEN}; padding: 24px; border-radius: 12px 12px 0 0;">
      <h1 style="color: #fff; font-size: 18px; margin: 0;">${escapeHtml(title)}</h1>
    </div>
    <div style="border: 1px solid #eee; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
      ${bodyHtml}
      <p style="margin-top: 24px; font-size: 12px; color: #888;">
        PriyoPet Khulna — এই ইমেইলটি স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে, উত্তর দেওয়ার প্রয়োজন নেই।
      </p>
    </div>
  </div>`;
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding: 4px 12px 4px 0; color: #666; font-size: 13px;">${escapeHtml(label)}</td>
    <td style="padding: 4px 0; font-size: 13px; font-weight: 600;">${escapeHtml(value)}</td>
  </tr>`;
}

export function bookingReceivedTemplate(appointment: AppointmentDoc): { subject: string; html: string } {
  const body = `
    <p>Thank you for submitting your appointment request.</p>
    <p>We have received your application successfully. Our team will verify your payment and application within <strong>24 hours</strong>. After verification, you will receive another confirmation email.</p>
    <table style="margin-top: 16px; border-collapse: collapse;">
      ${detailRow('Applicant Name', appointment.guardianName)}
      ${detailRow('Appointment Date', appointment.appointmentDate)}
      ${detailRow('Appointment Time', appointment.appointmentTime)}
      ${detailRow('Payment Reference', appointment.paymentReference)}
      ${detailRow('Booking ID', String(appointment._id))}
    </table>`;
  return { subject: 'Appointment Request Received', html: wrapper('Appointment Request Received', body) };
}

export function paymentVerifiedTemplate(
  appointment: AppointmentDoc,
  campaign: CampaignDoc
): { subject: string; html: string } {
  const body = `
    <p>Great news — your payment has been verified and your appointment is now <strong style="color:${BRAND_GREEN}">confirmed</strong>.</p>
    <p>Your appointment confirmation ticket is attached to this email as a PDF. Please bring it (printed or on your phone) along with your pet.</p>
    <table style="margin-top: 16px; border-collapse: collapse;">
      ${detailRow('Applicant Name', appointment.guardianName)}
      ${detailRow('Appointment Date', appointment.appointmentDate)}
      ${detailRow('Reporting Time', appointment.appointmentTime)}
      ${detailRow('Booking ID', String(appointment._id))}
      ${detailRow('Campaign', campaign.title)}
      ${detailRow('Venue', campaign.venue)}
    </table>`;
  return {
    subject: 'Your Appointment Has Been Confirmed',
    html: wrapper('Your Appointment Has Been Confirmed', body),
  };
}

export function paymentRejectedTemplate(
  appointment: AppointmentDoc,
  reason?: string
): { subject: string; html: string } {
  const body = `
    <p>We were unable to verify the bKash payment for your appointment request.</p>
    ${reason ? `<p style="color:${BRAND_ORANGE};"><strong>Reason:</strong> ${escapeHtml(reason)}</p>` : ''}
    <p>Please contact us so we can help resolve this, or submit a new appointment request with a correct payment reference.</p>
    <table style="margin-top: 16px; border-collapse: collapse;">
      ${detailRow('Applicant Name', appointment.guardianName)}
      ${detailRow('Payment Reference Submitted', appointment.paymentReference)}
      ${detailRow('Booking ID', String(appointment._id))}
    </table>`;
  return { subject: 'Appointment Payment Could Not Be Verified', html: wrapper('Payment Verification Failed', body) };
}
