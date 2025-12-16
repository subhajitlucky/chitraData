import type { ColorScheme } from './types';

export const colorFromScheme = (value: number, maxValue: number, scheme: ColorScheme) => {
  if (maxValue === 0) return '#e5e7eb';
  const intensity = value / maxValue;

  switch (scheme) {
    case 'sequential':
      return `rgb(${Math.round(59 + 196 * intensity)}, ${Math.round(130 + 50 * intensity)}, ${Math.round(246 - 146 * intensity)})`;

    case 'diverging':
      return intensity > 0.5
        ? `rgb(${Math.round(59 + 196 * (intensity - 0.5) * 2)}, ${Math.round(130 + 50 * (1 - (intensity - 0.5) * 2))}, ${Math.round(246 - 146 * (1 - (intensity - 0.5) * 2))})`
        : `rgb(${Math.round(239)}, ${Math.round(68 - 68 * intensity)}, ${Math.round(100 + 146 * intensity)})`;

    case 'viridis': {
      const viridisColors = [
        [68, 1, 84],
        [59, 82, 139],
        [33, 145, 140],
        [94, 201, 98],
        [253, 231, 37]
      ];
      const vIdx = Math.min(Math.floor(intensity * 4), 3);
      const vFrac = (intensity * 4) - vIdx;
      const vC1 = viridisColors[vIdx];
      const vC2 = viridisColors[vIdx + 1];
      return `rgb(${Math.round(vC1[0] + (vC2[0] - vC1[0]) * vFrac)}, ${Math.round(vC1[1] + (vC2[1] - vC1[1]) * vFrac)}, ${Math.round(vC1[2] + (vC2[2] - vC1[2]) * vFrac)})`;
    }

    case 'plasma': {
      const plasmaColors = [
        [13, 8, 135],
        [126, 3, 168],
        [204, 71, 120],
        [248, 149, 64],
        [240, 249, 33]
      ];
      const pIdx = Math.min(Math.floor(intensity * 4), 3);
      const pFrac = (intensity * 4) - pIdx;
      const pC1 = plasmaColors[pIdx];
      const pC2 = plasmaColors[pIdx + 1];
      return `rgb(${Math.round(pC1[0] + (pC2[0] - pC1[0]) * pFrac)}, ${Math.round(pC1[1] + (pC2[1] - pC1[1]) * pFrac)}, ${Math.round(pC1[2] + (pC2[2] - pC1[2]) * pFrac)})`;
    }

    case 'turbo': {
      const turboColors = [
        [48, 18, 59],
        [33, 102, 172],
        [68, 191, 193],
        [144, 215, 67],
        [253, 231, 37],
        [234, 51, 35]
      ];
      const tIdx = Math.min(Math.floor(intensity * 5), 4);
      const tFrac = (intensity * 5) - tIdx;
      const tC1 = turboColors[tIdx];
      const tC2 = turboColors[tIdx + 1];
      return `rgb(${Math.round(tC1[0] + (tC2[0] - tC1[0]) * tFrac)}, ${Math.round(tC1[1] + (tC2[1] - tC1[1]) * tFrac)}, ${Math.round(tC1[2] + (tC2[2] - tC1[2]) * tFrac)})`;
    }

    case 'grayscale': {
      const gray = Math.round(255 * intensity);
      return `rgb(${gray}, ${gray}, ${gray})`;
    }

    default:
      return '#e5e7eb';
  }
};

