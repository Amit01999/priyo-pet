import { Campaign, type CampaignDoc } from '../../src/models/Campaign.model.js';
import { Admin } from '../../src/models/Admin.model.js';
import { hashPassword } from '../../src/utils/password.js';

function futureDateStr(daysFromNow: number): string {
  const d = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

export async function createTestCampaign(overrides: Partial<CampaignDoc> = {}): Promise<CampaignDoc> {
  const dates = [futureDateStr(10), futureDateStr(11)];
  const doc = await Campaign.create({
    slug: 'test-campaign',
    title: 'Test Vaccination Campaign',
    sponsor: 'Test Sponsor',
    organizer: 'Test Organizer',
    venue: 'Test Venue',
    venueMapQuery: 'Test Venue',
    dates,
    dailyStartTime: '09:00',
    slotDurationMinutes: 5,
    maxSlotsPerDay: 10,
    registrationOpensAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    registrationClosesAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    ...overrides,
  });
  return doc.toObject() as unknown as CampaignDoc;
}

export async function createTestAdmin(overrides: { email?: string; password?: string } = {}) {
  const email = overrides.email ?? 'admin@test.com';
  const password = overrides.password ?? 'SuperSecret123!';
  const passwordHash = await hashPassword(password);
  const admin = await Admin.create({ name: 'Test Admin', email, passwordHash, role: 'superadmin' });
  return { admin, email, password };
}

let paymentReferenceCounter = 0;

export function validAppointmentPayload(overrides: Record<string, unknown> = {}) {
  paymentReferenceCounter += 1;
  return {
    guardianName: 'Rahim Uddin',
    mobileNumber: '01712345678',
    email: 'rahim@example.com',
    petName: 'Tommy',
    animalType: ['dog'],
    gender: 'male',
    age: 'y1_3',
    weight: '10 kg',
    colorMarkings: 'Brown with white patch',
    previousVaccinationInfo: 'না',
    currentHealthStatus: 'healthy',
    hearAboutCampaign: 'facebook',
    consentAcknowledged: true,
    slotNumber: 1,
    // Unique per call by default so unrelated tests never collide on the paymentReference
    // uniqueness index — override explicitly when a test specifically wants a collision.
    paymentReference: `TEST-TXN-${paymentReferenceCounter}`,
    paymentConfirmedByUser: true,
    ...overrides,
  };
}
