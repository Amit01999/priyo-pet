import { Campaign, type CampaignDoc } from '../models/Campaign.model.js';
import { SlotBlock } from '../models/SlotBlock.model.js';
import { Appointment } from '../models/Appointment.model.js';
import type { UpdateCampaignConfigInput } from '../validators/campaign.validators.js';
import { Conflict, BadRequest, NotFound } from '../errors/httpErrors.js';
import { ERROR_CODES, type DayStatus } from '../config/constants.js';

export async function blockSlot(
  campaign: CampaignDoc,
  date: string,
  slotNumber: number,
  reason: string,
  blockedByAdminId: string
): Promise<void> {
  const alreadyBooked = await Appointment.findOne({
    campaignId: campaign._id,
    appointmentDate: date,
    slotNumber,
    isActive: true,
  }).lean();
  if (alreadyBooked) {
    throw Conflict('This slot already has an active appointment — cancel it first.', ERROR_CODES.SLOT_TAKEN);
  }

  await SlotBlock.findOneAndUpdate(
    { campaignId: campaign._id, date, slotNumber },
    { $set: { reason, blockedByAdminId } },
    { upsert: true, new: true }
  );
}

export async function unblockSlot(campaignId: string, date: string, slotNumber: number): Promise<void> {
  await SlotBlock.findOneAndDelete({ campaignId, date, slotNumber });
}

export async function setDayStatus(campaign: CampaignDoc, date: string, status: DayStatus): Promise<void> {
  if (!campaign.dates.includes(date)) {
    throw BadRequest('That date is not part of this campaign', { date: ['Invalid date'] });
  }
  await Campaign.updateOne({ _id: campaign._id }, { $set: { [`dayStatus.${date}`]: status } });
}

export async function updateCampaignConfig(
  campaign: CampaignDoc,
  updates: UpdateCampaignConfigInput
): Promise<CampaignDoc> {
  if (updates.slotDurationMinutes !== undefined && campaign.slotDurationLocked) {
    throw Conflict(
      'Slot duration is locked because appointments already exist for this campaign.',
      ERROR_CODES.DURATION_LOCKED
    );
  }

  if (updates.maxSlotsPerDay !== undefined && updates.maxSlotsPerDay < campaign.maxSlotsPerDay) {
    const overflowing = await Appointment.findOne({
      campaignId: campaign._id,
      isActive: true,
      slotNumber: { $gt: updates.maxSlotsPerDay },
    }).lean();
    if (overflowing) {
      throw Conflict(
        'Cannot reduce the daily slot limit below an already-booked slot number.',
        ERROR_CODES.CAPACITY_CONFLICT
      );
    }
  }

  const updated = await Campaign.findByIdAndUpdate(campaign._id, { $set: updates }, { new: true }).lean<CampaignDoc>();
  if (!updated) throw NotFound('Campaign not found');
  return updated;
}
