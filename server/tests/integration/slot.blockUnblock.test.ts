import { describe, expect, it } from 'vitest';
import { createTestCampaign, createTestAdmin, validAppointmentPayload } from '../helpers/factories.js';
import { blockSlot, unblockSlot } from '../../src/services/slotAdmin.service.js';
import { createAppointment } from '../../src/services/appointment.service.js';
import { createAppointmentSchema } from '../../src/validators/appointment.validators.js';
import { getSlotsForDate } from '../../src/services/slot.service.js';

describe('slot blocking', () => {
  it('blocks a slot so it is reported as blocked and cannot be booked', async () => {
    const campaign = await createTestCampaign();
    const { admin } = await createTestAdmin();
    const date = campaign.dates[0];

    await blockSlot(campaign, date, 1, 'Reserved for VIP', String(admin._id));

    const view = await getSlotsForDate(campaign, date);
    expect(view.slots.find((s) => s.slotNumber === 1)?.status).toBe('blocked');

    const input = createAppointmentSchema.parse(validAppointmentPayload({ appointmentDate: date, slotNumber: 1 }));
    await expect(createAppointment(campaign, input, { source: 'public' })).rejects.toMatchObject({
      errorCode: 'SLOT_BLOCKED',
    });
  });

  it('unblocking makes the slot available again', async () => {
    const campaign = await createTestCampaign();
    const { admin } = await createTestAdmin();
    const date = campaign.dates[0];

    await blockSlot(campaign, date, 1, 'temp', String(admin._id));
    await unblockSlot(String(campaign._id), date, 1);

    const view = await getSlotsForDate(campaign, date);
    expect(view.slots.find((s) => s.slotNumber === 1)?.status).toBe('available');
  });

  it('refuses to block a slot that already has an active appointment', async () => {
    const campaign = await createTestCampaign();
    const { admin } = await createTestAdmin();
    const date = campaign.dates[0];

    const input = createAppointmentSchema.parse(validAppointmentPayload({ appointmentDate: date, slotNumber: 1 }));
    await createAppointment(campaign, input, { source: 'public' });

    await expect(blockSlot(campaign, date, 1, 'oops', String(admin._id))).rejects.toMatchObject({
      errorCode: 'SLOT_TAKEN',
    });
  });
});
