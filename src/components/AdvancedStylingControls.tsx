import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiType, FiCircle, FiSquare, FiRotateCw } from 'react-icons/fi';

interface StylingOptions {
  fontSize: number;
  fontFamily: string;
  showGrid: boolean;
  showLegend: boolean;
  legendPosition: 'top' | 'bottom' | 'left' | 'right';
  showDataLabels: boolean;
  tension: number;
  borderWidth: number;
  borderRadius: number;
  backgroundColor: string;
}

interface AdvancedStylingControlsProps {
  options: StylingOptions;
  onChange: (options: StylingOptions) => void;
  chartType: string;
}

const FONT_FAMILIES = [
  { value: 'system-ui', label: 'System UI' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' }
];

export default function AdvancedStylingControls({
  options,
  onChange,
  chartType
}: AdvancedStylingControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateOption = (key: keyof StylingOptions, value: any) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg text-white">
            <FiSettings size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Advanced Styling</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Customize appearance and layout</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiRotateCw className="text-gray-400" size={20} />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-6">
          {/* Typography Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <FiType size={16} />
              Typography
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Font Family
                </label>
                <select
                  value={options.fontFamily}
                  onChange={(e) => updateOption('fontFamily', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-800 dark:text-white"
                >
                  {FONT_FAMILIES.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Font Size: {options.fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={options.fontSize}
                  onChange={(e) => updateOption('fontSize', parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Chart Appearance Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <FiCircle size={16} />
              Appearance
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Border Width: {options.borderWidth}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={options.borderWidth}
                    onChange={(e) => updateOption('borderWidth', parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Border Radius: {options.borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={options.borderRadius}
                    onChange={(e) => updateOption('borderRadius', parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>

              {(chartType === 'line' || chartType === 'area') && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Line Smoothness: {options.tension}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.1"
                    value={options.tension}
                    onChange={(e) => updateOption('tension', parseFloat(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Display Options Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <FiSquare size={16} />
              Display Options
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Show Grid Lines</label>
                <button
                  onClick={() => updateOption('showGrid', !options.showGrid)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    options.showGrid ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      options.showGrid ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Show Legend</label>
                <button
                  onClick={() => updateOption('showLegend', !options.showLegend)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    options.showLegend ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      options.showLegend ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Show Data Labels</label>
                <button
                  onClick={() => updateOption('showDataLabels', !options.showDataLabels)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    options.showDataLabels ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      options.showDataLabels ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {options.showLegend && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Legend Position
                  </label>
                  <select
                    value={options.legendPosition}
                    onChange={(e) => updateOption('legendPosition', e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-800 dark:text-white"
                  >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
