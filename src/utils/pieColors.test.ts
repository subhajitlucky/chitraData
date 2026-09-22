import { describe, expect, it } from 'vitest';
import { getPieSliceColors } from './pieColors';

describe('getPieSliceColors', () => {
  it('returns one color per slice', () => {
    expect(getPieSliceColors(5)).toHaveLength(5);
  });

  it('cycles when there are more slices than palette colors', () => {
    const colors = getPieSliceColors(12);
    expect(colors).toHaveLength(12);
    expect(colors[5]).toBe(colors[0]);
    expect(colors[10]).toBe(colors[0]);
    expect(new Set(colors.slice(0, 5)).size).toBe(5);
  });

  it('prefers an explicit palette when provided', () => {
    const palette = ['#111111', '#222222'];
    expect(getPieSliceColors(3, palette)).toEqual(['#111111', '#222222', '#111111']);
  });

  it('falls back to the built-in palette for empty preferences', () => {
    expect(getPieSliceColors(2, [])).toEqual(getPieSliceColors(2));
  });
});
