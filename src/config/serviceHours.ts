/**
 * Clinic service hours — the single source for every place the site shows them
 * (footer, contact section, hero badges, About list). Edit here to update them all.
 */
export interface ServiceHoursEntry {
  day: string;
  hours: string;
  closed?: boolean;
}

export const SERVICE_HOURS_TITLE = 'সেবার সময়';

export const SERVICE_HOURS: ServiceHoursEntry[] = [
  { day: 'শনিবার থেকে বৃহস্পতিবার', hours: 'বিকাল ৫:০০টা থেকে রাত ৮:৩০টা পর্যন্ত' },
  { day: 'শুক্রবার', hours: 'সকাল ১১:০০টা থেকে দুপুর ১২:৩০টা পর্যন্ত' },
  { day: 'শুক্রবার বিকাল', hours: 'বন্ধ', closed: true },
];

/** Compact wording of SERVICE_HOURS for tight spots such as the hero badges. */
export const SERVICE_HOURS_SHORT: ServiceHoursEntry[] = [
  { day: 'শনি–বৃহস্পতিবার', hours: 'বিকাল ৫:০০ – রাত ৮:৩০' },
  { day: 'শুক্রবার', hours: 'সকাল ১১:০০ – দুপুর ১২:৩০' },
  { day: 'শুক্রবার বিকাল', hours: 'বন্ধ', closed: true },
];

/** One-sentence form of SERVICE_HOURS for running text and lists. */
export const SERVICE_HOURS_SUMMARY =
  'সেবার সময়: শনিবার থেকে বৃহস্পতিবার বিকাল ৫:০০টা থেকে রাত ৮:৩০টা পর্যন্ত; শুক্রবার সকাল ১১:০০টা থেকে দুপুর ১২:৩০টা পর্যন্ত, বিকাল বন্ধ';
