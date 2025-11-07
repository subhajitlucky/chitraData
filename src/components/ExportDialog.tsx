import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiImage, FiFileText, FiMaximize2 } from 'react-icons/fi';
import { getPresetSizes } from '../utils/exportUtils';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'png' | 'pdf', quality: 'standard' | 'hd' | '2k' | '4k' | '8k', size: string) => void;
}

const QUALITY_PRESETS = {
  standard: { name: 'Standard (1080p)', scale: 1, description: 'Good for web and social media' },
  hd: { name: 'HD (1440p)', scale: 2, description: 'Better quality for presentations' },
  '2k': { name: '2K QHD (1440p)', scale: 2, description: 'High quality for reports' },
  '4k': { name: '4K UHD (2160p)', scale: 3, description: 'Ultra sharp - Perfect for printing' },
  '8k': { name: '8K UHD (4320p)', scale: 4, description: 'Maximum quality - Professional use' }
};

export default function ExportDialog({ isOpen, onClose, onExport }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'pdf'>('png');
  const [selectedQuality, setSelectedQuality] = useState<keyof typeof QUALITY_PRESETS>('4k');
  const [selectedSize, setSelectedSize] = useState('presentation');
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);
  const [useCustomSize, setUseCustomSize] = useState(false);

  const sizes = getPresetSizes();

  const handleExport = () => {
    if (useCustomSize) {
      onExport(selectedFormat, selectedQuality, `${customWidth}x${customHeight}`);
    } else {
      onExport(selectedFormat, selectedQuality, selectedSize);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                <FiDownload size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Export Chart</h2>
                <p className="text-gray-600 dark:text-gray-400">Choose quality, size, and format</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
            {/* Format Selection */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Format</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedFormat('png')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedFormat === 'png'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                  }`}
                >
                  <FiImage className="mx-auto mb-2 text-blue-600" size={24} />
                  <div className="font-semibold text-gray-800 dark:text-white">PNG</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Best for web & images</div>
                </button>
                <button
                  onClick={() => setSelectedFormat('pdf')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedFormat === 'pdf'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                  }`}
                >
                  <FiFileText className="mx-auto mb-2 text-red-600" size={24} />
                  <div className="font-semibold text-gray-800 dark:text-white">PDF</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Best for printing</div>
                </button>
              </div>
            </div>

            {/* Quality Selection */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quality</h3>
              <div className="space-y-2">
                {Object.entries(QUALITY_PRESETS).map(([key, quality]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedQuality(key as keyof typeof QUALITY_PRESETS)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      selectedQuality === key
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-white">{quality.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{quality.description}</div>
                      </div>
                      <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                        {quality.scale}x scale
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Size</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useCustom"
                    checked={useCustomSize}
                    onChange={(e) => setUseCustomSize(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="useCustom" className="text-sm text-gray-700 dark:text-gray-300">
                    Use custom size
                  </label>
                </div>

                {useCustomSize ? (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1920)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(parseInt(e.target.value) || 1080)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(sizes as any).map(([key, size]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedSize(key)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedSize === key
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                        }`}
                      >
                        <div className="font-semibold text-gray-800 dark:text-white text-sm">{(size as any).name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {(size as any).width}×{(size as any).height}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-lg border border-blue-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <FiMaximize2 size={16} className="text-blue-600" />
                <span className="font-semibold text-gray-800 dark:text-white">Export Summary</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div>Format: <span className="font-semibold text-gray-800 dark:text-white">{selectedFormat.toUpperCase()}</span></div>
                <div>
                  Quality: <span className="font-semibold text-gray-800 dark:text-white">
                    {QUALITY_PRESETS[selectedQuality].name}
                  </span>
                </div>
                <div>
                  Size: <span className="font-semibold text-gray-800 dark:text-white">
                    {useCustomSize
                      ? `${customWidth}×${customHeight}px`
                      : `${(sizes as any)[selectedSize].width}×${(sizes as any)[selectedSize].height}px`
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FiDownload size={18} />
              <span>Export {selectedFormat.toUpperCase()}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
