import ExcelJS from 'exceljs';
import type { AppointmentDoc } from '../models/Appointment.model.js';
import { toCsv, escapeForSpreadsheet } from '../utils/csv.js';

const COLUMNS: { key: keyof AppointmentDoc | 'animalTypeJoined'; header: string }[] = [
  { key: 'guardianName', header: 'Guardian Name' },
  { key: 'mobileNumber', header: 'Mobile Number' },
  { key: 'alternateMobileNumber', header: 'Alternate Mobile' },
  { key: 'email', header: 'Email' },
  { key: 'petName', header: 'Pet Name' },
  { key: 'animalTypeJoined', header: 'Animal Type' },
  { key: 'breed', header: 'Breed' },
  { key: 'gender', header: 'Gender' },
  { key: 'age', header: 'Age' },
  { key: 'weight', header: 'Weight' },
  { key: 'colorMarkings', header: 'Color/Markings' },
  { key: 'previousVaccinationInfo', header: 'Previous Vaccination Info' },
  { key: 'currentHealthStatus', header: 'Current Health Status' },
  { key: 'hearAboutCampaign', header: 'Heard About Campaign Via' },
  { key: 'appointmentDate', header: 'Appointment Date' },
  { key: 'appointmentTime', header: 'Appointment Time' },
  { key: 'slotNumber', header: 'Slot #' },
  { key: 'bookingStatus', header: 'Status' },
  { key: 'notes', header: 'Notes' },
  { key: 'source', header: 'Source' },
  { key: 'paymentMethod', header: 'Payment Method' },
  { key: 'paymentAmount', header: 'Payment Amount (BDT)' },
  { key: 'paymentReference', header: 'Payment Reference' },
  { key: 'paymentStatus', header: 'Payment Status' },
  { key: 'verifiedAt', header: 'Payment Verified/Rejected At' },
  { key: 'createdAt', header: 'Submitted At' },
];

function toRow(appointment: AppointmentDoc): Record<string, unknown> {
  return {
    ...appointment,
    animalTypeJoined: appointment.animalType?.join(', '),
    createdAt: new Date(appointment.createdAt).toISOString(),
    verifiedAt: appointment.verifiedAt ? new Date(appointment.verifiedAt).toISOString() : '',
  };
}

export function buildCsv(appointments: AppointmentDoc[]): string {
  const rows = appointments.map(toRow);
  return toCsv(rows, COLUMNS as { key: string; header: string }[]);
}

export async function buildXlsx(appointments: AppointmentDoc[]): Promise<ExcelJS.Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Appointments');

  sheet.columns = COLUMNS.map((c) => ({ header: c.header, key: c.key, width: 22 }));
  sheet.getRow(1).font = { bold: true };

  for (const appointment of appointments) {
    const row = toRow(appointment);
    const escapedRow: Record<string, unknown> = {};
    for (const col of COLUMNS) {
      escapedRow[col.key] = escapeForSpreadsheet(row[col.key]);
    }
    sheet.addRow(escapedRow);
  }

  return workbook.xlsx.writeBuffer();
}
