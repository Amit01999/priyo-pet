const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const BN_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

export function toBengaliDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => BN_DIGITS[Number(digit)]);
}

function parseIsoDate(iso: string): { year: number; month: number; day: number } {
  const [year, month, day] = iso.split('-').map(Number);
  return { year, month, day };
}

/** "2026-07-17" -> "১৭ জুলাই ২০২৬" */
export function formatBengaliDate(iso: string): string {
  const { year, month, day } = parseIsoDate(iso);
  return `${toBengaliDigits(day)} ${BN_MONTHS[month - 1]} ${toBengaliDigits(year)}`;
}

/** "2026-07-17" -> "১৭ জুলাই" (no year — matches the source Google Form's option label style) */
export function formatBengaliDayMonth(iso: string): string {
  const { month, day } = parseIsoDate(iso);
  return `${toBengaliDigits(day)} ${BN_MONTHS[month - 1]}`;
}

/** Formats a list of campaign dates as a compact range when they share month/year,
 *  e.g. ["2026-07-17","2026-07-18"] -> "১৭–১৮ জুলাই ২০২৬". Falls back to a joined list otherwise. */
export function formatBengaliDateRange(dates: string[]): string {
  if (dates.length === 0) return '';
  if (dates.length === 1) return formatBengaliDate(dates[0]);

  const parsed = dates.map(parseIsoDate);
  const sameMonth = parsed.every((d) => d.month === parsed[0].month && d.year === parsed[0].year);

  if (sameMonth) {
    const days = parsed.map((d) => toBengaliDigits(d.day)).join('–');
    return `${days} ${BN_MONTHS[parsed[0].month - 1]} ${toBengaliDigits(parsed[0].year)}`;
  }

  return dates.map(formatBengaliDate).join(', ');
}

/** "16:00" -> "৪:০০ PM" */
export function formatBengaliTime(time24: string): string {
  const [hourStr, minuteStr] = time24.split(':');
  const hour = Number(hourStr);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${toBengaliDigits(displayHour)}:${toBengaliDigits(minuteStr.padStart(2, '0'))} ${period}`;
}
