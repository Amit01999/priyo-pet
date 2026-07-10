import nodemailer from 'nodemailer';
import type { OrderDoc } from '../models/Order.model.js';
import type { CustomerDoc } from '../models/Customer.model.js';
import { buildMailConfigFromEnv } from './EmailNotificationProvider.js';
import { generateInvoicePdf } from '../services/pdf.service.js';
import { escapeHtml } from './emailTemplates.js';
import { logger } from '../utils/logger.js';
import { isTest } from '../config/env.js';

function wrapper(title: string, bodyHtml: string): string {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #222;">
    <div style="background: #1a3d1a; padding: 24px; border-radius: 12px 12px 0 0;">
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

function itemsSummaryHtml(order: OrderDoc): string {
  const rows = order.items
    .map((item) => {
      const label = item.variantLabel ? `${item.name} (${item.variantLabel})` : item.name;
      return `<tr>
        <td style="padding: 3px 0; font-size: 13px;">${escapeHtml(label)} × ${item.quantity}</td>
        <td style="padding: 3px 0; font-size: 13px; text-align: right;">৳${item.lineTotal}</td>
      </tr>`;
    })
    .join('');
  return `<table style="width: 100%; border-collapse: collapse; margin: 12px 0;">${rows}</table>`;
}

function getTransporter() {
  if (isTest) return null;
  const config = buildMailConfigFromEnv();
  if (!config) return null;
  return {
    transporter: nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: { user: config.user, pass: config.pass },
    }),
    from: config.from,
  };
}

export async function sendOrderReceived(order: OrderDoc, customer: CustomerDoc): Promise<void> {
  const mail = getTransporter();
  if (!mail) {
    logger.info('Notification (order received) — no provider configured', { orderNumber: order.orderNumber });
    return;
  }
  try {
    const body = `
      <p>Thank you for your order! We have received your order successfully.</p>
      <p>Our team will verify your payment within <strong>24 hours</strong>. After verification, you will receive another confirmation email with your invoice.</p>
      ${itemsSummaryHtml(order)}
      <table style="border-collapse: collapse;">
        ${detailRow('Order Number', order.orderNumber)}
        ${detailRow('Total', `৳${order.total}`)}
        ${detailRow('Payment Reference', order.paymentReference)}
      </table>`;
    await mail.transporter.sendMail({
      from: mail.from,
      to: customer.email,
      subject: `Order Received — ${order.orderNumber}`,
      html: wrapper('Order Received', body),
    });
  } catch (err) {
    logger.error('Failed to send order-received email', { orderNumber: order.orderNumber, error: (err as Error).message });
  }
}

export async function sendOrderPaymentVerified(order: OrderDoc, customer: CustomerDoc): Promise<void> {
  const mail = getTransporter();
  if (!mail) {
    logger.info('Notification (order payment verified) — no provider configured', { orderNumber: order.orderNumber });
    return;
  }
  try {
    const body = `
      <p>Your payment has been verified and your order is now <strong style="color:#1a3d1a">confirmed</strong>.</p>
      <p>Your invoice is attached to this email as a PDF.</p>
      ${itemsSummaryHtml(order)}
      <table style="border-collapse: collapse;">
        ${detailRow('Order Number', order.orderNumber)}
        ${detailRow('Shipping Address', `${order.shippingAddress}, ${order.shippingDistrict}`)}
        ${detailRow('Total', `৳${order.total}`)}
      </table>`;
    const pdfBuffer = await generateInvoicePdf(order, customer);
    await mail.transporter.sendMail({
      from: mail.from,
      to: customer.email,
      subject: `Order Confirmed — ${order.orderNumber}`,
      html: wrapper('Your Order Has Been Confirmed', body),
      attachments: [{ filename: `invoice-${order.orderNumber}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }],
    });
  } catch (err) {
    logger.error('Failed to send order-payment-verified email', { orderNumber: order.orderNumber, error: (err as Error).message });
  }
}

export async function sendOrderPaymentRejected(order: OrderDoc, customer: CustomerDoc, reason?: string): Promise<void> {
  const mail = getTransporter();
  if (!mail) {
    logger.info('Notification (order payment rejected) — no provider configured', { orderNumber: order.orderNumber });
    return;
  }
  try {
    const body = `
      <p>We were unable to verify the bKash payment for your order.</p>
      ${reason ? `<p style="color:#E86A10;"><strong>Reason:</strong> ${escapeHtml(reason)}</p>` : ''}
      <p>Please contact us so we can help resolve this, or place a new order with a correct payment reference.</p>
      <table style="border-collapse: collapse;">
        ${detailRow('Order Number', order.orderNumber)}
        ${detailRow('Payment Reference Submitted', order.paymentReference)}
      </table>`;
    await mail.transporter.sendMail({
      from: mail.from,
      to: customer.email,
      subject: `Order Payment Could Not Be Verified — ${order.orderNumber}`,
      html: wrapper('Payment Verification Failed', body),
    });
  } catch (err) {
    logger.error('Failed to send order-payment-rejected email', { orderNumber: order.orderNumber, error: (err as Error).message });
  }
}
