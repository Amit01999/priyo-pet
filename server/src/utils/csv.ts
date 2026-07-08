/**
 * Excel/Sheets treats any cell starting with = + - @ as a formula. Prefixing with a
 * single quote neutralizes it without changing what the user sees when the file opens.
 * exceljs does NOT do this automatically, so every free-text export cell must go through this.
 */
export function escapeForSpreadsheet(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@]/.test(str)) return `'${str}`;
  return str;
}

export function toCsv(rows: Record<string, unknown>[], columns: { key: string; header: string }[]): string {
  const headerLine = columns.map((c) => csvCell(c.header)).join(',');
  const lines = rows.map((row) =>
    columns.map((c) => csvCell(escapeForSpreadsheet(row[c.key]))).join(',')
  );
  return [headerLine, ...lines].join('\r\n');
}

function csvCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
