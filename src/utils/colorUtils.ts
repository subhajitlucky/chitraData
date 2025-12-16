export const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '');
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16);
    const g = parseInt(normalized[1] + normalized[1], 16);
    const b = parseInt(normalized[2] + normalized[2], 16);
    return { r, g, b };
  }
  if (normalized.length === 6) {
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
};

export const relativeLuminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
  const toLinear = (c: number) => {
    const channel = c / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  };
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

export const contrastRatio = (lum1: number, lum2: number) => {
  const [L1, L2] = lum1 >= lum2 ? [lum1, lum2] : [lum2, lum1];
  return (L1 + 0.05) / (L2 + 0.05);
};

