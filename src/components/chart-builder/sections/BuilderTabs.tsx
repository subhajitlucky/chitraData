import { AnimatePresence, motion } from 'framer-motion';
import { FiDatabase, FiLayout, FiSettings } from 'react-icons/fi';
import type { GraphType } from '../../../types';
import type { ColorPalette } from '../../../utils/colorPalettes';
import DataEditor from '../DataEditor';
import ColorPaletteSelector from '../ColorPaletteSelector';

interface DatasetInput {
  label: string;
  data: number[];
}

interface GraphConfig {
  title: string;
  labels: string[];
  datasets: Array<DatasetInput & { color: string }>;
  chartType: GraphType;
}

interface BuilderTabsProps {
  activePanel: 'data' | 'style' | 'settings';
  onTabChange: (panel: 'data' | 'style' | 'settings') => void;
  config: GraphConfig;
  selectedPalette: ColorPalette;
  onTitleChange: (title: string) => void;
  onDataChange: (labels: string[], datasets: DatasetInput[]) => void;
  onChartTypeChange: (type: GraphType) => void;
  onPaletteChange: (palette: ColorPalette) => void;
}

export function BuilderTabs({
  activePanel,
  onTabChange,
  config,
  selectedPalette,
  onTitleChange,
  onDataChange,
  onChartTypeChange,
  onPaletteChange
}: BuilderTabsProps) {
  return (
    <section className="grid gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/70">
          {[{ id: 'data', label: 'Data', icon: FiDatabase }, { id: 'style', label: 'Style', icon: FiLayout }, { id: 'settings', label: 'Settings', icon: FiSettings }].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as 'data' | 'style' | 'settings')}
                className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
                  activePanel === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-white dark:text-gray-400 dark:hover:bg-gray-900/60'
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="p-5">
          <AnimatePresence mode="wait">
            {activePanel === 'data' && (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Chart title
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/40 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter chart title"
                  />
                </div>
                <DataEditor labels={config.labels} datasets={config.datasets} onChange={onDataChange} />
              </motion.div>
            )}

            {activePanel === 'style' && (
              <motion.div
                key="style"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Chart type
                  </label>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
                    {['bar', 'line', 'area', 'pie', 'doughnut'].map((type) => (
                      <button
                        key={type}
                        onClick={() => onChartTypeChange(type as GraphType)}
                        className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                          config.chartType === type
                            ? 'bg-blue-600 text-white shadow'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <ColorPaletteSelector selectedPalette={selectedPalette} onSelect={onPaletteChange} />
              </motion.div>
            )}

            {activePanel === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                <FiSettings className="mx-auto h-10 w-10 opacity-60" />
                <p>Advanced settings are on the roadmap. Let us know what you need most.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

