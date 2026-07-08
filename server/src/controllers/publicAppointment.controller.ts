import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { createAppointmentSchema } from '../validators/appointment.validators.js';
import { createAppointment } from '../services/appointment.service.js';

export const submitAppointment = asyncHandler(async (req: Request, res: Response) => {
  const input = createAppointmentSchema.parse(req.body);
  const appointment = await createAppointment(req.campaign!, input, { source: 'public' });
  res.status(201).json({
    success: true,
    message: 'Appointment request submitted',
    data: {
      id: appointment._id,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      slotNumber: appointment.slotNumber,
      bookingStatus: appointment.bookingStatus,
    },
  });
});
