import { describe, expect, it } from 'vitest';
import { createTestCampaign, createTestAdmin, validAppointmentPayload } from '../helpers/factories.js';
import { createAppointment } from '../../src/services/appointment.service.js';
import { verifyPayment, rejectPayment } from '../../src/services/payment.service.js';
import { createAppointmentSchema } from '../../src/validators/appointment.validators.js';

describe('bKash payment verification', () => {
  it('rejects a booking submission missing payment fields', () => {
    const payload = validAppointmentPayload({ appointmentDate: '2099-01-01', slotNumber: 1 }) as Record<
      string,
      unknown
    >;
    delete payload.paymentReference;
    delete payload.paymentConfirmedByUser;

    expect(() => createAppointmentSchema.parse(payload)).toThrow();
  });

  it('rejects a duplicate payment reference on another active appointment in the same campaign', async () => {
    const campaign = await createTestCampaign();
    const date = campaign.dates[0];

    const first = createAppointmentSchema.parse(
      validAppointmentPayload({ appointmentDate: date, slotNumber: 1, paymentReference: 'DUP-REF-1' })
    );
    await createAppointment(campaign, first, { source: 'public' });

    const second = createAppointmentSchema.parse(
      validAppointmentPayload({
        appointmentDate: date,
        slotNumber: 2,
        mobileNumber: '01712345679',
        petName: 'Milo',
        paymentReference: 'DUP-REF-1',
      })
    );
    await expect(createAppointment(campaign, second, { source: 'public' })).rejects.toMatchObject({
      errorCode: 'DUPLICATE_PAYMENT_REFERENCE',
    });
  });

  it('verifies payment: sets paymentStatus/verifiedBy/verifiedAt and confirms the booking', async () => {
    const campaign = await createTestCampaign();
    const { admin } = await createTestAdmin();
    const input = createAppointmentSchema.parse(
      validAppointmentPayload({ appointmentDate: campaign.dates[0], slotNumber: 1 })
    );
    const created = await createAppointment(campaign, input, { source: 'public' });

    const verified = await verifyPayment(String(created._id), String(admin._id));
    expect(verified.paymentStatus).toBe('Verified');
    expect(verified.bookingStatus).toBe('Confirmed');
    expect(String(verified.verifiedBy)).toBe(String(admin._id));
    expect(verified.verifiedAt).toBeTruthy();
  });

  it('rejects payment: sets paymentStatus/bookingStatus and frees the slot for a new booking', async () => {
    const campaign = await createTestCampaign();
    const { admin } = await createTestAdmin();
    const date = campaign.dates[0];
    const input = createAppointmentSchema.parse(validAppointmentPayload({ appointmentDate: date, slotNumber: 1 }));
    const created = await createAppointment(campaign, input, { source: 'public' });

    const rejected = await rejectPayment(String(created._id), String(admin._id), 'Reference not found in statement');
    expect(rejected.paymentStatus).toBe('Rejected');
    expect(rejected.bookingStatus).toBe('Cancelled');
    expect(rejected.paymentRejectionReason).toBe('Reference not found in statement');

    const second = createAppointmentSchema.parse(
      validAppointmentPayload({ appointmentDate: date, slotNumber: 1, mobileNumber: '01712345680', petName: 'Rex' })
    );
    const rebooked = await createAppointment(campaign, second, { source: 'public' });
    expect(rebooked.slotNumber).toBe(1);
  });

  it('rejects verifying a payment that has already been resolved', async () => {
    const campaign = await createTestCampaign();
    const { admin } = await createTestAdmin();
    const input = createAppointmentSchema.parse(
      validAppointmentPayload({ appointmentDate: campaign.dates[0], slotNumber: 1 })
    );
    const created = await createAppointment(campaign, input, { source: 'public' });
    await verifyPayment(String(created._id), String(admin._id));

    await expect(verifyPayment(String(created._id), String(admin._id))).rejects.toMatchObject({
      errorCode: 'PAYMENT_ALREADY_RESOLVED',
    });
  });
});
