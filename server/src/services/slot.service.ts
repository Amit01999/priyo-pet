import { Appointment } from '../models/Appointment.model.js';
import { SlotBlock } from '../models/SlotBlock.model.js';
import type { CampaignDoc } from '../models/Campaign.model.js';
import { computeSlotTime } from './campaign.service.js';

export type SlotStatus = 'available' | 'booked' | 'blocked' | 'past';

export interface SlotView {
  slotNumber: number;
  startTime: string;
  status: SlotStatus;
  blockReason?: string;
}

export interface SlotsForDateResult {
  date: string;
  total: number;
  remaining: number;
  slots: SlotView[];
}

/**
 * There is no persisted `Slot` collection (see plan) — availability is composed on read from
 * the campaign's config (the virtual grid) merged against active Appointments and SlotBlocks.
 */
export async function getSlotsForDate(campaign: CampaignDoc, date: string): Promise<SlotsForDateResult> {
  const [bookedAppointments, blocks] = await Promise.all([
    Appointment.find({ campaignId: campaign._id, appointmentDate: date, isActive: true })
      .select('slotNumber')
      .lean(),
    SlotBlock.find({ campaignId: campaign._id, date }).select('slotNumber reason').lean(),
  ]);

  const bookedSet = new Set(bookedAppointments.map((a) => a.slotNumber));
  const blockedMap = new Map(blocks.map((b) => [b.slotNumber, b.reason]));

  const slots: SlotView[] = [];
  let remaining = 0;

  for (let slotNumber = 1; slotNumber <= campaign.maxSlotsPerDay; slotNumber += 1) {
    const { startTime, isPast } = computeSlotTime(campaign, date, slotNumber);
    let status: SlotStatus;
    if (bookedSet.has(slotNumber)) status = 'booked';
    else if (blockedMap.has(slotNumber)) status = 'blocked';
    else if (isPast) status = 'past';
    else status = 'available';

    if (status === 'available') remaining += 1;
    slots.push({ slotNumber, startTime, status, blockReason: blockedMap.get(slotNumber) });
  }

  return { date, total: campaign.maxSlotsPerDay, remaining, slots };
}
