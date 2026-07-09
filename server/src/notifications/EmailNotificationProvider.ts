import nodemailer, { type Transporter } from 'nodemailer';
import type { NotificationProvider } from './NotificationProvider.js';
import type { AppointmentDoc } from '../models/Appointment.model.js';
import { Campaign, type CampaignDoc } from '../models/Campaign.model.js';
import { generateTicketPdf } from '../services/pdf.service.js';
import { bookingReceivedTemplate, paymentVerifiedTemplate, paymentRejectedTemplate } from './emailTemplates.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export interface MailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

/** Real Nodemailer-backed provider. Every method swallows its own errors — a notification
 *  failure must never fail a booking or an admin verify/reject action (same philosophy as
 *  NoopNotificationProvider). Only instantiated by ./index.ts when fully configured and never
 *  in tests — see that file for the selection logic. */
export class EmailNotificationProvider implements NotificationProvider {
  private transporter: Transporter;
  private from: string;

  constructor(config: MailConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: { user: config.user, pass: config.pass },
    });
    this.from = config.from;
  }

  async sendBookingConfirmation(appointment: AppointmentDoc): Promise<void> {
    try {
      const { subject, html } = bookingReceivedTemplate(appointment);
      await this.transporter.sendMail({ from: this.from, to: appointment.email, subject, html });
    } catch (err) {
      logger.error('Failed to send booking-received email', {
        appointmentId: String(appointment._id),
        error: (err as Error).message,
      });
    }
  }

  async sendStatusChange(): Promise<void> {
    // Generic status changes (e.g. an admin manually marking Completed) don't have a dedicated
    // template today — payment-specific emails are handled by sendPaymentVerified/Rejected below.
  }

  async sendPaymentVerified(appointment: AppointmentDoc): Promise<void> {
    try {
      const campaign = await this.loadCampaign(appointment);
      if (!campaign) return;
      const { subject, html } = paymentVerifiedTemplate(appointment, campaign);
      const pdfBuffer = await generateTicketPdf(appointment, campaign);
      await this.transporter.sendMail({
        from: this.from,
        to: appointment.email,
        subject,
        html,
        attachments: [
          {
            filename: `appointment-ticket-${String(appointment._id)}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
    } catch (err) {
      logger.error('Failed to send payment-verified email', {
        appointmentId: String(appointment._id),
        error: (err as Error).message,
      });
    }
  }

  async sendPaymentRejected(appointment: AppointmentDoc, reason?: string): Promise<void> {
    try {
      const { subject, html } = paymentRejectedTemplate(appointment, reason);
      await this.transporter.sendMail({ from: this.from, to: appointment.email, subject, html });
    } catch (err) {
      logger.error('Failed to send payment-rejected email', {
        appointmentId: String(appointment._id),
        error: (err as Error).message,
      });
    }
  }

  private async loadCampaign(appointment: AppointmentDoc): Promise<CampaignDoc | null> {
    return Campaign.findById(appointment.campaignId).lean<CampaignDoc>();
  }
}

export function buildMailConfigFromEnv(): MailConfig | null {
  if (!env.MAIL_HOST || !env.MAIL_PORT || !env.MAIL_USER || !env.MAIL_PASS) return null;
  return {
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
    from: env.MAIL_FROM ?? env.MAIL_USER,
  };
}
