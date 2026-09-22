import { describe, expect, it } from 'vitest';
import { scaleNumericString } from './exportHelpers';

describe('scaleNumericString', () => {
  it('scales pixel values while preserving the unit', () => {
    expect(scaleNumericString('26px', 3)).toBe('78px');
    expect(scaleNumericString('13px', 2)).toBe('26px');
  });

  it('scales unitless values', () => {
    expect(scaleNumericString('1.5', 4)).toBe('6');
    expect(scaleNumericString('0.25', 2)).toBe('0.5');
  });

  it('scales decimal and negative values', () => {
    expect(scaleNumericString('-2.5px', 2)).toBe('-5px');
    expect(scaleNumericString('1.25em', 4)).toBe('5em');
  });

  it('returns the original value when no number is present', () => {
    expect(scaleNumericString('auto', 3)).toBe('auto');
    expect(scaleNumericString('', 3)).toBe('');
  });

  it('rounds to two decimal places', () => {
    expect(scaleNumericString('1.111px', 3)).toBe('3.33px');
  });
});
