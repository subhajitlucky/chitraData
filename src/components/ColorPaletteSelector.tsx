import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDroplet } from 'react-icons/fi';
import type { ColorPalette } from '../utils/colorPalettes';
import { COLOR_PALETTES } from '../utils/colorPalettes';

interface ColorPaletteSelectorProps {
  selectedPalette?: ColorPalette;
  onSelect: (palette: ColorPalette) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'business', label: 'Business' },
  { id: 'vibrant', label: 'Vibrant' },
  { id: 'pastel', label: 'Pastel' },
  { id: 'monochrome', label: 'Monochrome' },
  { id: 'colorblind', label: 'Colorblind' },
  { id: 'warm', label: 'Warm' },
  { id: 'cool', label: 'Cool' }
];

export default function ColorPaletteSelector({ selectedPalette, onSelect }: ColorPaletteSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showPreview, setShowPreview] = useState<string | null>(null);

  const filteredPalettes = activeCategory === 'all'
    ? COLOR_PALETTES
    : COLOR_PALETTES.filter(p => p.category === activeCategory);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg text-white">
          <FiDroplet size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Color Palette</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Choose a professional color scheme</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {selectedPalette && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-lg border border-blue-200 dark:border-gray-600">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected:</div>
          <div className="font-semibold text-gray-800 dark:text-white">{selectedPalette.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedPalette.description}</div>
          <div className="flex gap-2 mt-3">
            {selectedPalette.colors.map((color, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded border-2 border-white dark:border-gray-800 shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
        {filteredPalettes.map((palette) => (
          <motion.div
            key={palette.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelect(palette)}
            onMouseEnter={() => setShowPreview(palette.id)}
            onMouseLeave={() => setShowPreview(null)}
            className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
              selectedPalette?.id === palette.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold text-gray-800 dark:text-white text-sm">{palette.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{palette.description}</div>
              </div>
            </div>

            <div className="flex gap-1.5 mt-3">
              {palette.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="w-7 h-7 rounded border-2 border-white dark:border-gray-800 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {showPreview === palette.id && (
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
                {palette.category} palette • {palette.colors.length} colors
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
