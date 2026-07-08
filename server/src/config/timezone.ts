/**
 * Bangladesh has used a single fixed UTC+6 offset year-round since 2009 (no DST),
 * so a hardcoded offset is correct here and avoids pulling in a timezone library.
 */
const BD_UTC_OFFSET_MINUTES = 6 * 60;

export function nowInDhaka(): Date {
  const utcNow = Date.now();
  return new Date(utcNow + BD_UTC_OFFSET_MINUTES * 60 * 1000);
}

/** Returns the current date in Dhaka as "YYYY-MM-DD". */
export function todayInDhaka(): string {
  return nowInDhaka().toISOString().slice(0, 10);
}

/** Converts a "HH:mm" (Dhaka local) + "YYYY-MM-DD" (Dhaka local) pair to a real UTC Date instant. */
export function dhakaDateTimeToUtc(date: string, time: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const utcMillis = Date.UTC(year, month - 1, day, hour, minute) - BD_UTC_OFFSET_MINUTES * 60 * 1000;
  return new Date(utcMillis);
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function formatDhakaTime(date: Date): string {
  const dhaka = new Date(date.getTime() + BD_UTC_OFFSET_MINUTES * 60 * 1000);
  const hours = dhaka.getUTCHours();
  const minutes = dhaka.getUTCMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
}
