/**
 * A future campaign = a new file like this one + `npm run seed:campaign -- <this-file>`.
 * No code changes needed elsewhere — this is the "config-driven" story in practice.
 */
export const rabiesVaccination2026 = {
  slug: 'rabies-vaccination-2026',
  title: '🐾 ফ্রি র‍্যাবিস টিকাদান ক্যাম্পেইন ২০২৬',
  sponsor: 'JCI Dhaka North',
  organizer: 'PriyoPet Khulna',
  venue: 'House 113/5, Road 02, Nirjon Residential Area, Nirala, Khulna, Bangladesh',
  venueMapQuery: 'House 113/5, Road 02, Nirjon Residential Area, Nirala, Khulna, Bangladesh',
  dates: ['2026-07-17', '2026-07-18'],
  dailyStartTime: '16:00',
  slotDurationMinutes: 5,
  maxSlotsPerDay: 50,
  // Registration window is intentionally wide open well before/after the event dates;
  // organizers can tighten it later via PATCH /admin/campaigns/:slug/config.
  registrationOpensAt: new Date('2026-01-01T00:00:00.000Z'),
  registrationClosesAt: new Date('2026-07-18T14:10:00.000Z'), // 2026-07-18 20:10 Dhaka (last slot end)
  isActive: true,
};
