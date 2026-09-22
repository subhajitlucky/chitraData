import { describe, expect, it } from 'vitest';
import { parseNumericValue } from './utils';

describe('parseNumericValue', () => {
  it('parses plain integers and decimals', () => {
    expect(parseNumericValue('42')).toBe(42);
    expect(parseNumericValue('3.14')).toBe(3.14);
    expect(parseNumericValue('.5')).toBe(0.5);
    expect(parseNumericValue('-12.75')).toBe(-12.75);
    expect(parseNumericValue('+8')).toBe(8);
  });

  it('accepts thousands separators and surrounding whitespace', () => {
    expect(parseNumericValue(' 1,234 ')).toBe(1234);
    expect(parseNumericValue('12,345.67')).toBe(12345.67);
  });

  it('rejects categories, empty values, and malformed numbers', () => {
    expect(parseNumericValue('')).toBeNull();
    expect(parseNumericValue('   ')).toBeNull();
    expect(parseNumericValue('High')).toBeNull();
    expect(parseNumericValue('12abc')).toBeNull();
    expect(parseNumericValue('1.2.3')).toBeNull();
    expect(parseNumericValue('--4')).toBeNull();
  });
});
