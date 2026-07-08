import { describe, expect, it } from 'vitest';
import { isValidBdPhone, normalizeBdPhone } from '../../src/utils/phone.js';

describe('phone utils', () => {
  it('accepts a plain local number', () => {
    expect(isValidBdPhone('01712345678')).toBe(true);
  });

  it('normalizes +880 and 880 prefixes to local form', () => {
    expect(normalizeBdPhone('+8801712345678')).toBe('01712345678');
    expect(normalizeBdPhone('8801712345678')).toBe('01712345678');
  });

  it('validates numbers after normalization', () => {
    expect(isValidBdPhone('+8801912345678')).toBe(true);
    expect(isValidBdPhone('8801812345678')).toBe(true);
  });

  it('rejects invalid numbers', () => {
    expect(isValidBdPhone('123456')).toBe(false);
    expect(isValidBdPhone('02712345678')).toBe(false); // must start 01[3-9]
    expect(isValidBdPhone('01112345678')).toBe(false); // 01+1 is not a valid BD operator prefix
  });
});
