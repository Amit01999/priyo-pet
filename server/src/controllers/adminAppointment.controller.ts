import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import {
  adminCreateAppointmentSchema,
  exportQuerySchema,
  listAppointmentsQuerySchema,
  rejectPaymentSchema,
  updateNotesSchema,
  updateStatusSchema,
} from '../validators/appointment.validators.js';
import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  listAppointments,
  updateAppointmentNotes,
  updateAppointmentStatus,
} from '../services/appointment.service.js';
import { verifyPayment, rejectPayment } from '../services/payment.service.js';
import { generateTicketPdf } from '../services/pdf.service.js';
import { buildCsv, buildXlsx } from '../services/export.service.js';
import { Appointment, type AppointmentDoc } from '../models/Appointment.model.js';
import { NotFound } from '../errors/httpErrors.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = listAppointmentsQuerySchema.parse(req.query);
  const result = await listAppointments(String(req.campaign!._id), query);
  res.status(200).json({ success: true, data: result });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await getAppointmentById(req.params.id);
  res.status(200).json({ success: true, data: appointment });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = adminCreateAppointmentSchema.parse(req.body);
  const appointment = await createAppointment(req.campaign!, input, { source: 'admin-walkin' });
  res.status(201).json({ success: true, message: 'Walk-in appointment recorded', data: appointment });
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { bookingStatus } = updateStatusSchema.parse(req.body);
  const appointment = await updateAppointmentStatus(req.params.id, bookingStatus);
  res.status(200).json({ success: true, message: 'Status updated', data: appointment });
});

export const updateNotes = asyncHandler(async (req: Request, res: Response) => {
  const { notes } = updateNotesSchema.parse(req.body);
  const appointment = await updateAppointmentNotes(req.params.id, notes);
  res.status(200).json({ success: true, message: 'Notes updated', data: appointment });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await deleteAppointment(req.params.id);
  res.status(200).json({ success: true, message: 'Appointment deleted' });
});

export const verifyPaymentHandler = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await verifyPayment(req.params.id, req.admin!.sub);
  res.status(200).json({ success: true, message: 'Payment verified, appointment confirmed', data: appointment });
});

export const rejectPaymentHandler = asyncHandler(async (req: Request, res: Response) => {
  const { reason } = rejectPaymentSchema.parse(req.body);
  const appointment = await rejectPayment(req.params.id, req.admin!.sub, reason);
  res.status(200).json({ success: true, message: 'Payment rejected, appointment cancelled', data: appointment });
});

export const getTicketPdf = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await Appointment.findById(req.params.id).lean<AppointmentDoc>();
  if (!appointment) throw NotFound('Appointment not found');

  const buffer = await generateTicketPdf(appointment, req.campaign!);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="ticket-${req.params.id}.pdf"`);
  res.send(buffer);
});

export const exportAppointments = asyncHandler(async (req: Request, res: Response) => {
  const query = exportQuerySchema.parse(req.query);
  const filter: Record<string, unknown> = { campaignId: req.campaign!._id };
  if (query.status) filter.bookingStatus = query.status;
  if (query.date) filter.appointmentDate = query.date;

  const appointments = await Appointment.find(filter).sort({ createdAt: -1 }).lean<AppointmentDoc[]>();

  const filenameBase = `appointments-${req.campaign!.slug}-${new Date().toISOString().slice(0, 10)}`;

  if (query.format === 'xlsx') {
    const buffer = await buildXlsx(appointments);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.xlsx"`);
    res.send(buffer);
    return;
  }

  const csv = buildCsv(appointments);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.csv"`);
  res.send(csv);
});
