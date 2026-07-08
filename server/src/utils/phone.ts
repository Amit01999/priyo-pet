const BD_LOCAL_PATTERN = /^01[3-9]\d{8}$/;

/** Normalizes +880/880-prefixed numbers to local 01XXXXXXXXX form; leaves everything else untouched. */
export function normalizeBdPhone(raw: string): string {
  const trimmed = raw.trim().replace(/[\s-]/g, '');
  if (trimmed.startsWith('+880')) return `0${trimmed.slice(4)}`;
  if (trimmed.startsWith('880')) return `0${trimmed.slice(3)}`;
  return trimmed;
}

export function isValidBdPhone(raw: string): boolean {
  return BD_LOCAL_PATTERN.test(normalizeBdPhone(raw));
}
