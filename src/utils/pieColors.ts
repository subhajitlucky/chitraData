import { COLOR_PALETTES } from './colorPalettes';

const SLICE_PALETTE =
  COLOR_PALETTES.find((palette) => palette.id === 'colorblind-safe') ?? COLOR_PALETTES[0];

export const getPieSliceColors = (count: number, preferredColors?: string[]): string[] => {
  const palette = preferredColors && preferredColors.length > 0 ? preferredColors : SLICE_PALETTE.colors;
  return Array.from({ length: count }, (_, index) => palette[index % palette.length]);
};
