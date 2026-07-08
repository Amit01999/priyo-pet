import { Appointment, type AppointmentDoc } from '../models/Appointment.model.js';
import { Campaign, type CampaignDoc } from '../models/Campaign.model.js';
import { SlotBlock } from '../models/SlotBlock.model.js';
import type { CreateAppointmentInput, ListAppointmentsQuery } from '../validators/appointment.validators.js';
import {
  assertDayOpen,
  assertRegistrationOpen,
  assertSlotNumberInRange,
  assertValidCampaignDate,
  computeSlotTime,
} from './campaign.service.js';
import { Conflict, NotFound, BadRequest } from '../errors/httpErrors.js';
import { ERROR_CODES, type AppointmentSource, type BookingStatus } from '../config/constants.js';
import { buildPageResult, type PageResult } from '../utils/pagination.js';
import { notificationProvider } from '../notifications/NoopNotificationProvider.js';

const CONSENT_TEXT_VERSION = 1;

const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Completed', 'Cancelled'],
  Cancelled: ['Pending'],
  Completed: [],
};

interface CreateOptions {
  source: AppointmentSource;
}

export async function createAppointment(
  campaign: CampaignDoc,
  input: CreateAppointmentInput,
  options: CreateOptions
): Promise<AppointmentDoc> {
  assertValidCampaignDate(campaign, input.appointmentDate);
  assertSlotNumberInRange(campaign, input.slotNumber);

  if (options.source === 'public') {
    assertRegistrationOpen(campaign);
    assertDayOpen(campaign, input.appointmentDate);
  }

  const slotTime = computeSlotTime(campaign, input.appointmentDate, input.slotNumber);
  if (options.source === 'public' && slotTime.isPast) {
    throw Conflict('That slot time has already passed', ERROR_CODES.SLOT_TIME_PASSED);
  }

  const blocked = await SlotBlock.findOne({
    campaignId: campaign._id,
    date: input.appointmentDate,
    slotNumber: input.slotNumber,
  }).lean();
  if (blocked) {
    throw Conflict('That slot is currently blocked by the organizers', ERROR_CODES.SLOT_BLOCKED);
  }

  try {
    const appointment = await Appointment.create({
      campaignId: campaign._id,
      guardianName: input.guardianName,
      mobileNumber: input.mobileNumber,
      alternateMobileNumber: input.alternateMobileNumber,
      email: input.email,
      petName: input.petName,
      animalType: input.animalType,
      breed: input.breed,
      gender: input.gender,
      age: input.age,
      weight: input.weight,
      colorMarkings: input.colorMarkings,
      previousVaccinationInfo: input.previousVaccinationInfo,
      currentHealthStatus: input.currentHealthStatus,
      hearAboutCampaign: input.hearAboutCampaign,
      consentAcknowledged: input.consentAcknowledged,
      consentTextVersion: CONSENT_TEXT_VERSION,
      appointmentDate: input.appointmentDate,
      appointmentTime: slotTime.startTime,
      slotNumber: input.slotNumber,
      bookingStatus: 'Pending',
      source: options.source,
      isActive: true,
    });

    if (!campaign.slotDurationLocked) {
      await Campaign.updateOne({ _id: campaign._id }, { $set: { slotDurationLocked: true } });
    }

    await notificationProvider.sendBookingConfirmation(appointment.toObject() as unknown as AppointmentDoc);
    return appointment.toObject() as unknown as AppointmentDoc;
  } catch (err) {
    throw mapDuplicateKeyError(err);
  }
}

function mapDuplicateKeyError(err: unknown): Error {
  const mongoErr = err as { code?: number; keyPattern?: Record<string, number> };
  if (mongoErr?.code === 11000) {
    if (mongoErr.keyPattern && 'slotNumber' in mongoErr.keyPattern) {
      return Conflict('That slot was just booked by someone else — please choose another.', ERROR_CODES.SLOT_TAKEN);
    }
    if (mongoErr.keyPattern && 'petName' in mongoErr.keyPattern) {
      return Conflict(
        'An active appointment already exists for this pet and mobile number.',
        ERROR_CODES.DUPLICATE_APPOINTMENT
      );
    }
    return Conflict('This appointment could not be booked due to a conflict.', ERROR_CODES.SLOT_TAKEN);
  }
  return err as Error;
}

export async function listAppointments(
  campaignId: string,
  query: ListAppointmentsQuery
): Promise<PageResult<AppointmentDoc>> {
  const filter: Record<string, unknown> = { campaignId };
  if (query.status) filter.bookingStatus = query.status;
  if (query.date) filter.appointmentDate = query.date;
  if (query.search) {
    filter.$or = [
      { guardianName: { $regex: escapeRegex(query.search), $options: 'i' } },
      { petName: { $regex: escapeRegex(query.search), $options: 'i' } },
      { mobileNumber: { $regex: escapeRegex(query.search), $options: 'i' } },
    ];
  }

  const sort: Record<string, 1 | -1> = { [query.sortBy]: query.sortOrder === 'asc' ? 1 : -1 };
  const skip = (query.page - 1) * query.limit;

  const [data, total] = await Promise.all([
    Appointment.find(filter).sort(sort).skip(skip).limit(query.limit).lean<AppointmentDoc[]>(),
    Appointment.countDocuments(filter),
  ]);

  return buildPageResult(data, total, query.page, query.limit);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function getAppointmentById(id: string): Promise<AppointmentDoc> {
  const appointment = await Appointment.findById(id).lean<AppointmentDoc>();
  if (!appointment) throw NotFound('Appointment not found');
  return appointment;
}

export async function updateAppointmentStatus(id: string, nextStatus: BookingStatus): Promise<AppointmentDoc> {
  const current = await Appointment.findById(id);
  if (!current) throw NotFound('Appointment not found');

  const currentStatus = current.bookingStatus as BookingStatus;
  const allowed = STATUS_TRANSITIONS[currentStatus] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw BadRequest(`Cannot move an appointment from ${currentStatus} to ${nextStatus}`, {
      bookingStatus: [`Illegal transition: ${currentStatus} -> ${nextStatus}`],
    });
  }

  current.bookingStatus = nextStatus;
  current.isActive = nextStatus !== 'Cancelled';

  try {
    await current.save();
  } catch (err) {
    // Reopening a cancelled appointment can lose the race if the slot/pet was rebooked meanwhile.
    throw mapDuplicateKeyError(err);
  }

  const saved = current.toObject() as unknown as AppointmentDoc;
  await notificationProvider.sendStatusChange(saved, currentStatus);
  return saved;
}

export async function updateAppointmentNotes(id: string, notes: string): Promise<AppointmentDoc> {
  const appointment = await Appointment.findByIdAndUpdate(id, { $set: { notes } }, { new: true }).lean<AppointmentDoc>();
  if (!appointment) throw NotFound('Appointment not found');
  return appointment;
}

export async function deleteAppointment(id: string): Promise<void> {
  const result = await Appointment.findByIdAndDelete(id);
  if (!result) throw NotFound('Appointment not found');
}
