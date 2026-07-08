import { describe, expect, it } from 'vitest';
import { createTestCampaign, validAppointmentPayload } from '../helpers/factories.js';
import { setDayStatus, updateCampaignConfig } from '../../src/services/slotAdmin.service.js';
import { createAppointment } from '../../src/services/appointment.service.js';
import { createAppointmentSchema } from '../../src/validators/appointment.validators.js';
import { Campaign } from '../../src/models/Campaign.model.js';

describe('campaign day status + config guards', () => {
  it('closing a day blocks new public bookings for that date only', async () => {
    const campaign = await createTestCampaign();
    const [dayOne, dayTwo] = campaign.dates;

    await setDayStatus(campaign, dayOne, 'closed');
    const updated = (await Campaign.findById(campaign._id).lean())!;

    const closedInput = createAppointmentSchema.parse(validAppointmentPayload({ appointmentDate: dayOne, slotNumber: 1 }));
    await expect(createAppointment(updated as never, closedInput, { source: 'public' })).rejects.toMatchObject({
      errorCode: 'DAY_CLOSED',
    });

    const openInput = createAppointmentSchema.parse(validAppointmentPayload({ appointmentDate: dayTwo, slotNumber: 1 }));
    const appointment = await createAppointment(updated as never, openInput, { source: 'public' });
    expect(appointment.appointmentDate).toBe(dayTwo);
  });

  it('rejects reducing maxSlotsPerDay below an already-booked slot number', async () => {
    const campaign = await createTestCampaign({ maxSlotsPerDay: 10 });
    const input = createAppointmentSchema.parse(
      validAppointmentPayload({ appointmentDate: campaign.dates[0], slotNumber: 8 })
    );
    await createAppointment(campaign, input, { source: 'public' });

    await expect(updateCampaignConfig(campaign, { maxSlotsPerDay: 5 })).rejects.toMatchObject({
      errorCode: 'CAPACITY_CONFLICT',
    });
  });

  it('locks slotDurationMinutes once any active appointment exists', async () => {
    const campaign = await createTestCampaign();
    const input = createAppointmentSchema.parse(
      validAppointmentPayload({ appointmentDate: campaign.dates[0], slotNumber: 1 })
    );
    await createAppointment(campaign, input, { source: 'public' });

    const locked = (await Campaign.findById(campaign._id).lean())!;
    expect(locked.slotDurationLocked).toBe(true);

    await expect(updateCampaignConfig(locked as never, { slotDurationMinutes: 10 })).rejects.toMatchObject({
      errorCode: 'DURATION_LOCKED',
    });
  });
});
