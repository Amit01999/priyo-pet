import { describe, expect, it } from 'vitest';
import { escapeForSpreadsheet, toCsv } from '../../src/utils/csv.js';

describe('csv utils', () => {
  it('escapes formula-injection-prone leading characters', () => {
    expect(escapeForSpreadsheet('=SUM(A1:A9)')).toBe("'=SUM(A1:A9)");
    expect(escapeForSpreadsheet('+1234')).toBe("'+1234");
    expect(escapeForSpreadsheet('-1234')).toBe("'-1234");
    expect(escapeForSpreadsheet('@mention')).toBe("'@mention");
  });

  it('leaves normal text untouched', () => {
    expect(escapeForSpreadsheet('Tommy the cat')).toBe('Tommy the cat');
  });

  it('handles null/undefined as empty string', () => {
    expect(escapeForSpreadsheet(null)).toBe('');
    expect(escapeForSpreadsheet(undefined)).toBe('');
  });

  it('builds a CSV with quoted cells containing commas/quotes', () => {
    const csv = toCsv([{ name: 'Doe, John', note: 'says "hi"' }], [
      { key: 'name', header: 'Name' },
      { key: 'note', header: 'Note' },
    ]);
    expect(csv).toContain('"Doe, John"');
    expect(csv).toContain('"says ""hi"""');
  });
});
