import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import type { AppointmentDoc } from '../models/Appointment.model.js';
import type { CampaignDoc } from '../models/Campaign.model.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// server/assets/logo1.png — a copy of the frontend's public/logo1.png. The Express process has
// no access to the frontend's static assets, so this is a small deliberate duplication.
const LOGO_PATH = path.join(__dirname, '../../assets/logo1.png');

// PDFKit's built-in fonts (Helvetica etc.) only cover WinAnsi/Latin-1 — any Bengali text (campaign
// title, venue, etc. are admin-entered and often Bengali) renders as garbled glyphs under them.
// Noto Sans Bengali covers both Bengali and Latin/digits in one font, so it's used for everything.
const FONT_REGULAR_PATH = path.join(__dirname, '../../assets/fonts/NotoSansBengali-Regular.ttf');
const FONT_BOLD_PATH = path.join(__dirname, '../../assets/fonts/NotoSansBengali-Bold.ttf');
const FONT_REGULAR = 'NotoBengali';
const FONT_BOLD = 'NotoBengali-Bold';

const BRAND_GREEN = '#1a3d1a';
const BRAND_ORANGE = '#E86A10';
const LOGO_HEIGHT = 56;
const LOGO_ASPECT_RATIO = 436 / 251; // native server/assets/logo1.png dimensions
const LOGO_WIDTH = LOGO_HEIGHT * LOGO_ASPECT_RATIO;

/** Renders a professional-looking appointment ticket as a PDF buffer, for email attachment or
 *  admin manual download. Not a live lookup system — the embedded QR is a visual verification
 *  aid only (encodes the booking id), there is no scan endpoint behind it. */
export async function generateTicketPdf(
  appointment: AppointmentDoc,
  campaign: CampaignDoc
): Promise<Buffer> {
  const qrDataUrl = await QRCode.toBuffer(`PRIYOPET-TICKET:${String(appointment._id)}`, {
    margin: 1,
    width: 220,
    color: { dark: BRAND_GREEN, light: '#FFFFFF' },
  });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.registerFont(FONT_REGULAR, FONT_REGULAR_PATH);
    doc.registerFont(FONT_BOLD, FONT_BOLD_PATH);
    doc.font(FONT_REGULAR);

    const pageWidth = doc.page.width;
    const margin = 40;
    const headerHeight = 110;
    const textX = margin + LOGO_WIDTH + 16;

    // Header band
    doc.rect(0, 0, pageWidth, headerHeight).fill(BRAND_GREEN);
    if (fs.existsSync(LOGO_PATH)) {
      doc.image(LOGO_PATH, margin, (headerHeight - LOGO_HEIGHT) / 2, { height: LOGO_HEIGHT });
    }
    doc
      .font(FONT_BOLD)
      .fillColor('#FFFFFF')
      .fontSize(18)
      .text('Appointment Confirmation Ticket', textX, 28, { width: pageWidth - margin - textX })
      .font(FONT_REGULAR)
      .fontSize(11)
      .fillColor('#D9E8D9')
      .text(campaign.title, textX, 56, { width: pageWidth - margin - textX })
      .text(`${campaign.sponsor} × ${campaign.organizer}`, textX, 76, {
        width: pageWidth - margin - textX,
      });

    let y = headerHeight + 30;

    doc
      .font(FONT_BOLD)
      .fillColor(BRAND_GREEN)
      .fontSize(13)
      .text('Booking Details', margin, y);
    doc.font(FONT_REGULAR);
    y += 22;

    const row = (label: string, value: string) => {
      doc.fontSize(10).fillColor('#666666').text(label, margin, y, { continued: false });
      doc.fontSize(12).fillColor('#111111').text(value, margin, y + 13);
      y += 38;
    };

    row('Booking ID', String(appointment._id));
    row('Applicant Name', appointment.guardianName);
    row('Phone Number', appointment.mobileNumber);
    row('Pet Name', appointment.petName);
    row('Appointment Date', appointment.appointmentDate);
    row('Reporting Time', appointment.appointmentTime);
    row('Payment Reference (bKash)', appointment.paymentReference);

    // QR code, right-aligned within the details column
    doc.image(qrDataUrl, pageWidth - margin - 120, 140, { width: 120 });
    doc
      .fontSize(8)
      .fillColor('#888888')
      .text('Scan for verification', pageWidth - margin - 120, 264, { width: 120, align: 'center' });

    y += 10;
    doc
      .moveTo(margin, y)
      .lineTo(pageWidth - margin, y)
      .strokeColor('#DDDDDD')
      .stroke();
    y += 20;

    doc.font(FONT_BOLD).fontSize(13).fillColor(BRAND_GREEN).text('Venue', margin, y);
    doc.font(FONT_REGULAR);
    y += 20;
    doc.fontSize(11).fillColor('#333333').text(campaign.venue, margin, y, { width: pageWidth - margin * 2 });
    y += 40;

    doc.font(FONT_BOLD).fontSize(13).fillColor(BRAND_ORANGE).text('Important Instructions', margin, y);
    doc.font(FONT_REGULAR);
    y += 20;
    const instructions = [
      'Please arrive at least 10 minutes before your reporting time.',
      'Bring this ticket (printed or on your phone) along with your pet.',
      'Keep your pet on a leash or in a carrier at all times.',
      'This vaccination service is completely free of charge.',
    ];
    for (const line of instructions) {
      doc.fontSize(10).fillColor('#333333').text(`•  ${line}`, margin, y, { width: pageWidth - margin * 2 });
      y += 18;
    }

    y += 15;
    doc
      .font(FONT_BOLD)
      .fontSize(12)
      .fillColor(BRAND_GREEN)
      .text(
        'Your appointment is confirmed. We look forward to seeing you and your pet!',
        margin,
        y,
        { width: pageWidth - margin * 2 }
      );

    doc.end();
  });
}
