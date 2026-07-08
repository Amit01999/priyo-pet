import { describe, expect, it } from 'vitest';
import { createTestCampaign, validAppointmentPayload } from '../helpers/factories.js';
import { createAppointment } from '../../src/services/appointment.service.js';
import { createAppointmentSchema } from '../../src/validators/appointment.validators.js';
import { Appointment } from '../../src/models/Appointment.model.js';

describe('appointment booking concurrency', () => {
  it('only lets exactly one of N concurrent requests claim the same slot', async () => {
    const campaign = await createTestCampaign();
    const date = campaign.dates[0];

    const attempts = Array.from({ length: 8 }, (_, i) =>
      createAppointmentSchema.parse(
        validAppointmentPayload({
          appointmentDate: date,
          slotNumber: 1,
          mobileNumber: `017123400${String(i).padStart(2, '0')}`,
          petName: `Pet${i}`,
        })
      )
    );

    const results = await Promise.allSettled(
      attempts.map((input) => createAppointment(campaign, input, { source: 'public' }))
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled');
    const failed = results.filter((r) => r.status === 'rejected');

    expect(succeeded).toHaveLength(1);
    expect(failed).toHaveLength(attempts.length - 1);

    for (const failure of failed) {
      if (failure.status === 'rejected') {
        expect((failure.reason as { errorCode?: string }).errorCode).toBe('SLOT_TAKEN');
      }
    }

    const activeCount = await Appointment.countDocuments({
      campaignId: campaign._id,
      appointmentDate: date,
      slotNumber: 1,
      isActive: true,
    });
    expect(activeCount).toBe(1);
  });

  it('rejects a slot number outside the campaign range', async () => {
    const campaign = await createTestCampaign({ maxSlotsPerDay: 3 });
    const input = createAppointmentSchema.parse(
      validAppointmentPayload({ appointmentDate: campaign.dates[0], slotNumber: 99 })
    );

    await expect(createAppointment(campaign, input, { source: 'public' })).rejects.toMatchObject({
      errorCode: 'SLOT_OUT_OF_RANGE',
    });
  });

  it('rejects booking on a date outside the campaign', async () => {
    const campaign = await createTestCampaign();
    const input = createAppointmentSchema.parse(
      validAppointmentPayload({ appointmentDate: '2099-01-01', slotNumber: 1 })
    );

    await expect(createAppointment(campaign, input, { source: 'public' })).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it('rejects booking when the day is closed', async () => {
    const campaign = await createTestCampaign();
    const date = campaign.dates[0];
    const { Campaign } = await import('../../src/models/Campaign.model.js');
    await Campaign.updateOne({ _id: campaign._id }, { $set: { [`dayStatus.${date}`]: 'closed' } });
    const updated = await Campaign.findById(campaign._id).lean();

    const input = createAppointmentSchema.parse(validAppointmentPayload({ appointmentDate: date, slotNumber: 1 }));

    await expect(
      createAppointment(updated as never, input, { source: 'public' })
    ).rejects.toMatchObject({ errorCode: 'DAY_CLOSED' });
  });

  it('allows an admin walk-in to bypass the day-closed gate', async () => {
    const campaign = await createTestCampaign();
    const date = campaign.dates[0];
    const { Campaign } = await import('../../src/models/Campaign.model.js');
    await Campaign.updateOne({ _id: campaign._id }, { $set: { [`dayStatus.${date}`]: 'closed' } });
    const updated = await Campaign.findById(campaign._id).lean();

    const input = createAppointmentSchema.parse(validAppointmentPayload({ appointmentDate: date, slotNumber: 2 }));

    const appointment = await createAppointment(updated as never, input, { source: 'admin-walkin' });
    expect(appointment.source).toBe('admin-walkin');
  });
});
