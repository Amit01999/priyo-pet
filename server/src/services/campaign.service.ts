import { Campaign, type CampaignDoc } from '../models/Campaign.model.js';
import { NotFound, Conflict, BadRequest } from '../errors/httpErrors.js';
import { ERROR_CODES } from '../config/constants.js';
import { addMinutes, dhakaDateTimeToUtc } from '../config/timezone.js';

export async function getCampaignBySlug(slug: string): Promise<CampaignDoc> {
  const campaign = await Campaign.findOne({ slug, isActive: true }).lean<CampaignDoc>();
  if (!campaign) throw NotFound('Campaign not found');
  return campaign;
}

export async function getCampaignById(id: string): Promise<CampaignDoc> {
  const campaign = await Campaign.findById(id).lean<CampaignDoc>();
  if (!campaign) throw NotFound('Campaign not found');
  return campaign;
}

/**
 * Mongoose Map-typed fields come back differently depending on the query: a hydrated document
 * gives a real `Map`, but `.lean()` (used everywhere here for read performance) gives a plain
 * object instead — never both, and plain objects aren't iterable, so `Object.fromEntries`
 * throws on them. This normalizes either shape to a plain object.
 */
function dayStatusToObject(dayStatus: CampaignDoc['dayStatus'] | undefined): Record<string, string> {
  if (!dayStatus) return {};
  if (dayStatus instanceof Map) return Object.fromEntries(dayStatus);
  return dayStatus as unknown as Record<string, string>;
}

/** Public-facing subset — nothing sensitive lives on Campaign, but this keeps the wire shape intentional. */
export function toPublicCampaignView(campaign: CampaignDoc) {
  return {
    slug: campaign.slug,
    title: campaign.title,
    sponsor: campaign.sponsor,
    organizer: campaign.organizer,
    venue: campaign.venue,
    venueMapQuery: campaign.venueMapQuery,
    dates: campaign.dates,
    dailyStartTime: campaign.dailyStartTime,
    slotDurationMinutes: campaign.slotDurationMinutes,
    maxSlotsPerDay: campaign.maxSlotsPerDay,
    dayStatus: dayStatusToObject(campaign.dayStatus),
    registrationOpensAt: campaign.registrationOpensAt,
    registrationClosesAt: campaign.registrationClosesAt,
  };
}

export function assertValidCampaignDate(campaign: CampaignDoc, date: string): void {
  if (!campaign.dates.includes(date)) {
    throw BadRequest('That date is not part of this campaign', { appointmentDate: ['Invalid date'] });
  }
}

export function assertRegistrationOpen(campaign: CampaignDoc): void {
  const now = new Date();
  if (now < campaign.registrationOpensAt || now > campaign.registrationClosesAt) {
    throw Conflict('Registration is not currently open for this campaign', ERROR_CODES.REGISTRATION_CLOSED);
  }
}

export function assertDayOpen(campaign: CampaignDoc, date: string): void {
  const dayStatus = dayStatusToObject(campaign.dayStatus)[date];
  if (dayStatus === 'closed') {
    throw Conflict('Bookings are closed for this day', ERROR_CODES.DAY_CLOSED);
  }
}

export interface SlotTime {
  slotNumber: number;
  startTime: string; // "HH:mm" Dhaka local
  startUtc: Date;
  endUtc: Date;
  isPast: boolean;
}

export function computeSlotTime(campaign: CampaignDoc, date: string, slotNumber: number): SlotTime {
  const offsetMinutes = (slotNumber - 1) * campaign.slotDurationMinutes;
  const [startHour, startMinute] = campaign.dailyStartTime.split(':').map(Number);
  const totalMinutes = startHour * 60 + startMinute + offsetMinutes;
  const hh = String(Math.floor(totalMinutes / 60) % 24).padStart(2, '0');
  const mm = String(totalMinutes % 60).padStart(2, '0');
  const startTime = `${hh}:${mm}`;

  const startUtc = dhakaDateTimeToUtc(date, startTime);
  const endUtc = addMinutes(startUtc, campaign.slotDurationMinutes);
  // startUtc is a true UTC instant (dhakaDateTimeToUtc already applied the +6h conversion),
  // so comparing it directly against Date.now() is correct — no further offsetting needed.
  const isPast = startUtc.getTime() < Date.now();

  return { slotNumber, startTime, startUtc, endUtc, isPast };
}

export function assertSlotNumberInRange(campaign: CampaignDoc, slotNumber: number): void {
  if (slotNumber < 1 || slotNumber > campaign.maxSlotsPerDay) {
    throw Conflict('That slot number does not exist for this campaign', ERROR_CODES.SLOT_OUT_OF_RANGE);
  }
}
