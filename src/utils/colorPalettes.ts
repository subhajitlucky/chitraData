export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: string[];
  category: 'business' | 'vibrant' | 'pastel' | 'monochrome' | 'colorblind' | 'warm' | 'cool';
}

export const COLOR_PALETTES: ColorPalette[] = [
  // Business Palettes
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional and trustworthy, perfect for business reports',
    colors: ['#3b82f6', '#1e40af', '#60a5fa', '#1e3a8a', '#93c5fd'],
    category: 'business'
  },
  {
    id: 'modern-gray',
    name: 'Modern Gray',
    description: 'Clean and minimal grayscale palette',
    colors: ['#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6'],
    category: 'business'
  },
  {
    id: 'professional-teal',
    name: 'Professional Teal',
    description: 'Modern and sophisticated teal tones',
    colors: ['#0d9488', '#14b8a6', '#5eead4', '#2dd4bf', '#99f6e4'],
    category: 'business'
  },

  // Vibrant Palettes
  {
    id: 'vibrant-rainbow',
    name: 'Vibrant Rainbow',
    description: 'Bold and eye-catching colors for presentations',
    colors: ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
    category: 'vibrant'
  },
  {
    id: 'tropical',
    name: 'Tropical',
    description: 'Bright tropical colors',
    colors: ['#06b6d4', '#f97316', '#22c55e', '#eab308', '#ef4444'],
    category: 'vibrant'
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'High-energy neon colors',
    colors: ['#ff006e', '#ffbe0b', '#00f5ff', '#7b2cbf', '#00ff87'],
    category: 'vibrant'
  },

  // Pastel Palettes
  {
    id: 'soft-pastel',
    name: 'Soft Pastel',
    description: 'Gentle and calming pastel colors',
    colors: ['#fce7f3', '#ddd6fe', '#bfdbfe', '#bae6fd', '#a7f3d0'],
    category: 'pastel'
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    description: 'Sweet and light pastel palette',
    colors: ['#f9a8d4', '#fbcfe8', '#c4b5fd', '#a5b4fc', '#93c5fd'],
    category: 'pastel'
  },
  {
    id: 'mint-cream',
    name: 'Mint Cream',
    description: 'Fresh mint and cream tones',
    colors: ['#99f6e4', '#a7f3d0', '#d1fae5', '#ecfdf5', '#6ee7b7'],
    category: 'pastel'
  },

  // Monochrome Palettes
  {
    id: 'classic-gray',
    name: 'Classic Gray',
    description: 'Timeless grayscale',
    colors: ['#111827', '#374151', '#6b7280', '#9ca3af', '#d1d5db'],
    category: 'monochrome'
  },
  {
    id: 'slate',
    name: 'Slate',
    description: 'Modern slate tones',
    colors: ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'],
    category: 'monochrome'
  },

  // Colorblind-Friendly Palettes
  {
    id: 'colorblind-safe',
    name: 'Colorblind Safe',
    description: 'Accessible colors for all types of color vision deficiency',
    colors: ['#0d9488', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'],
    category: 'colorblind'
  },
  {
    id: 'okabe-ito',
    name: 'Okabe-Ito',
    description: 'Scientifically designed colorblind-safe palette',
    colors: ['#000000', '#e69f00', '#56b4e9', '#009e73', '#f0e442', '#0072b2', '#d55e00', '#cc79a7'],
    category: 'colorblind'
  },

  // Warm Palettes
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm sunset colors',
    colors: ['#dc2626', '#ea580c', '#d97706', '#f59e0b', '#fbbf24'],
    category: 'warm'
  },
  {
    id: 'autumn',
    name: 'Autumn',
    description: 'Cozy autumn colors',
    colors: ['#92400e', '#b45309', '#d97706', '#eab308', '#f59e0b'],
    category: 'warm'
  },
  {
    id: 'fire',
    name: 'Fire',
    description: 'Intense warm colors',
    colors: ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#f97316'],
    category: 'warm'
  },

  // Cool Palettes
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep ocean blues',
    colors: ['#0c4a6e', '#075985', '#0369a1', '#0284c7', '#0ea5e9'],
    category: 'cool'
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Nature-inspired greens',
    colors: ['#14532d', '#166534', '#16a34a', '#22c55e', '#4ade80'],
    category: 'cool'
  },
  {
    id: 'arctic',
    name: 'Arctic',
    description: 'Cool arctic blues and grays',
    colors: ['#1e3a8a', '#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd'],
    category: 'cool'
  }
];

export const getPaletteById = (id: string): ColorPalette | undefined => {
  return COLOR_PALETTES.find(p => p.id === id);
};

export const getPalettesByCategory = (category: string): ColorPalette[] => {
  if (category === 'all') return COLOR_PALETTES;
  return COLOR_PALETTES.filter(p => p.category === category);
};

export const getRandomColor = (palette: string[]): string => {
  return palette[Math.floor(Math.random() * palette.length)];
};

export const assignColorsFromPalette = (datasetCount: number, palette: ColorPalette): string[] => {
  const colors = [];
  for (let i = 0; i < datasetCount; i++) {
    colors.push(palette.colors[i % palette.colors.length]);
  }
  return colors;
};
