import { describe, expect, it } from 'vitest';
import { createTestCampaign, validAppointmentPayload } from '../helpers/factories.js';
import { createAppointment, updateAppointmentStatus } from '../../src/services/appointment.service.js';
import { createAppointmentSchema } from '../../src/validators/appointment.validators.js';

describe('duplicate appointment prevention', () => {
  it('rejects a second active booking for the same guardian + pet', async () => {
    const campaign = await createTestCampaign();
    const date = campaign.dates[0];
    const payload = { appointmentDate: date, mobileNumber: '01712345678', petName: 'Tommy' };

    const first = createAppointmentSchema.parse(validAppointmentPayload({ ...payload, slotNumber: 1 }));
    await createAppointment(campaign, first, { source: 'public' });

    const second = createAppointmentSchema.parse(validAppointmentPayload({ ...payload, slotNumber: 2 }));
    await expect(createAppointment(campaign, second, { source: 'public' })).rejects.toMatchObject({
      errorCode: 'DUPLICATE_APPOINTMENT',
    });
  });

  it('allows the same guardian to book a different pet', async () => {
    const campaign = await createTestCampaign();
    const date = campaign.dates[0];

    const first = createAppointmentSchema.parse(
      validAppointmentPayload({ appointmentDate: date, mobileNumber: '01712345678', petName: 'Tommy', slotNumber: 1 })
    );
    await createAppointment(campaign, first, { source: 'public' });

    const second = createAppointmentSchema.parse(
      validAppointmentPayload({ appointmentDate: date, mobileNumber: '01712345678', petName: 'Milo', slotNumber: 2 })
    );
    const appointment = await createAppointment(campaign, second, { source: 'public' });
    expect(appointment.petName).toBe('Milo');
  });

  it('allows rebooking the same guardian + pet once the earlier appointment is cancelled', async () => {
    const campaign = await createTestCampaign();
    const date = campaign.dates[0];
    const payload = { appointmentDate: date, mobileNumber: '01712345678', petName: 'Tommy' };

    const first = createAppointmentSchema.parse(validAppointmentPayload({ ...payload, slotNumber: 1 }));
    const created = await createAppointment(campaign, first, { source: 'public' });
    await updateAppointmentStatus(String(created._id), 'Cancelled');

    const second = createAppointmentSchema.parse(validAppointmentPayload({ ...payload, slotNumber: 2 }));
    const appointment = await createAppointment(campaign, second, { source: 'public' });
    expect(appointment.bookingStatus).toBe('Pending');
  });
});
