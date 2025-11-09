import { useState, useRef, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import type { GraphType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiDatabase,
  FiLayout,
  FiSettings,
  FiSave,
  FiCopy,
  FiRotateCcw,
  FiDownload
} from 'react-icons/fi';
import { ChartPreview } from './ChartPreview';
import DataEditor from './DataEditor';
import SampleDataLibrary from './SampleDataLibrary';
import ColorPaletteSelector from './ColorPaletteSelector';
import ChartRecommendationUI from './ChartRecommendation';
import TemplateGallery from './TemplateGallery';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { COLOR_PALETTES, type ColorPalette } from '../utils/colorPalettes';
import { getChartRecommendations } from '../utils/chartRecommendations';
import { CHART_TEMPLATES } from '../utils/chartTemplates';
import ExportDialog from './ExportDialog';
import { exportChartWithQuality } from '../utils/exportUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GraphCreationProps {
  // No navigation props needed - using main header
}

interface DatasetConfig {
  label: string;
  data: number[];
  color: string;
}

interface GraphConfig {
  title: string;
  labels: string[];
  datasets: DatasetConfig[];
  chartType: GraphType;
}

interface SaveStatus {
  type: 'success' | 'error' | 'info';
  message: string;
}

const GraphCreationNew = ({}: GraphCreationProps) => {
  const [config, setConfig] = useState<GraphConfig>({
    title: 'My Chart',
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      { label: 'Dataset 1', data: [65, 59, 80, 81, 56], color: '#3b82f6' },
      { label: 'Dataset 2', data: [28, 48, 40, 19, 86], color: '#ef4444' }
    ],
    chartType: 'bar'
  });

  const [activePanel, setActivePanel] = useState<'data' | 'style' | 'settings'>('data');
  const [showSampleData, setShowSampleData] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(COLOR_PALETTES[0]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const chartRef = useRef<any>(null);
  const { setValue, undo, redo, canUndo, canRedo } = useUndoRedo(config);

  const handleConfigChange = useCallback((newConfig: GraphConfig) => {
    setConfig(newConfig);
    setValue(newConfig);
  }, [setValue]);

  const handleDataChange = (labels: string[], datasets: Array<{ label: string; data: number[] }>) => {
    const newConfig = {
      ...config,
      labels,
      datasets: datasets.map((d, i) => ({
        ...d,
        color: config.datasets[i]?.color || selectedPalette.colors[i % selectedPalette.colors.length]
      }))
    };
    handleConfigChange(newConfig);
  };

  const handleTitleChange = (title: string) => {
    handleConfigChange({ ...config, title });
  };

  const handleChartTypeChange = (chartType: GraphType) => {
    handleConfigChange({ ...config, chartType });
  };

  const handlePaletteChange = (palette: ColorPalette) => {
    setSelectedPalette(palette);
    const newDatasets = config.datasets.map((d, i) => ({
      ...d,
      color: palette.colors[i % palette.colors.length]
    }));
    handleConfigChange({ ...config, datasets: newDatasets });
  };

  const handleSelectSampleData = (data: any) => {
    const newConfig = {
      title: data.title,
      labels: data.labels,
      datasets: data.datasets.map((d: any) => ({
        label: d.label,
        data: d.data,
        color: d.color
      })),
      chartType: data.chartType || 'bar'
    };
    handleConfigChange(newConfig);
    setShowSampleData(false);
    setSaveStatus({ type: 'success', message: 'Sample data loaded successfully!' });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSelectTemplate = (template: any) => {
    const newConfig = {
      title: template.name,
      labels: template.config.labels,
      datasets: template.config.datasets.map((d: any) => ({
        label: d.label,
        data: d.data.split(',').map((v: string) => parseFloat(v.trim())),
        color: d.color
      })),
      chartType: template.config.chartType
    };
    handleConfigChange(newConfig);
    setShowTemplates(false);
    setSaveStatus({ type: 'success', message: 'Template applied successfully!' });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleDuplicate = () => {
    const newConfig = {
      ...config,
      title: `${config.title} (Copy)`
    };
    handleConfigChange(newConfig);
    setSaveStatus({ type: 'success', message: 'Chart duplicated!' });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const recommendations = getChartRecommendations(config.labels, config.datasets);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      {/* Hero */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-blue-200/70 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                Chart studio
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
                Design precision charts without leaving your browser.
              </h1>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
                Load sample data, apply executive-ready templates, and iterate safely with undo/redo. The live preview keeps pace while you fine-tune palettes, labels, and annotations.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowSampleData(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:border-blue-400"
                >
                  <FiDatabase className="h-4 w-4" />
                  Sample data library
                </button>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 transition hover:border-purple-300 hover:bg-purple-100 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-200 dark:hover:border-purple-400"
                >
                  <FiLayout className="h-4 w-4" />
                  Template gallery
                </button>
                <button
                  onClick={() => setIsExportDialogOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400"
                >
                  <FiDownload className="h-4 w-4" />
                  Export settings
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                  canUndo
                    ? 'border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200'
                    : 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500'
                }`}
              >
                <FiRotateCcw className="h-4 w-4" />
                Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                  canRedo
                    ? 'border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200'
                    : 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500'
                }`}
              >
                <FiRotateCcw className="h-4 w-4 rotate-180" />
                Redo
              </button>
              <div className="hidden h-6 w-px bg-gray-200 dark:bg-gray-700 lg:block" aria-hidden />
              <button
                onClick={handleDuplicate}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
              >
                <FiCopy className="h-4 w-4" />
                Duplicate
              </button>
              <button
                onClick={() => {
                  const event = new KeyboardEvent('keydown', {
                    key: 's',
                    code: 'KeyS',
                    keyCode: 83,
                    ctrlKey: true
                  });
                  document.dispatchEvent(event);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
              >
                <FiSave className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={() => setIsExportDialogOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <FiDownload className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                  <FiDatabase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Spreadsheet-friendly data editor</h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Paste labels and values, add datasets, and keep colours consistent with palette memory.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                  <FiLayout className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Template-driven storytelling</h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Start from executive-ready templates, then switch chart types without losing polish.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <FiDownload className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">HD to 8K exports</h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Pick aspect ratios, export queues, and keep every chart deck-ready in seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {recommendations.length > 0 && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-500/30 dark:bg-blue-500/10">
            <ChartRecommendationUI
              recommendations={recommendations}
              onSelect={handleChartTypeChange}
              currentType={config.chartType}
            />
          </div>
        )}

        <div className="space-y-8">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex overflow-hidden rounded-t-2xl border-b border-gray-200 dark:border-gray-800">
              {[{ id: 'data', label: 'Data', icon: FiDatabase }, { id: 'style', label: 'Style', icon: FiLayout }, { id: 'settings', label: 'Settings', icon: FiSettings }].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePanel(tab.id as any)}
                    className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
                      activePanel === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
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
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/40 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder="Enter chart title"
                      />
                    </div>
                    <DataEditor
                      labels={config.labels}
                      datasets={config.datasets}
                      onChange={handleDataChange}
                    />
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
                            onClick={() => handleChartTypeChange(type as GraphType)}
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
                    <ColorPaletteSelector
                      selectedPalette={selectedPalette}
                      onSelect={handlePaletteChange}
                    />
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
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live preview</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Every change is rendered instantly for review.</p>
              </div>
              <button
                onClick={() => setIsExportDialogOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-500 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-500/10"
              >
                <FiDownload className="h-4 w-4" />
                Export options
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <ChartPreview
                data={{
                  id: 'preview',
                  title: config.title,
                  type: config.chartType,
                  labels: config.labels,
                  datasets: config.datasets.map((ds) => ({
                    label: ds.label,
                    data: ds.data,
                    color: ds.color,
                    backgroundColor: ds.color,
                    borderColor: ds.color,
                    borderWidth: 2
                  })),
                  createdAt: new Date().toISOString()
                }}
                ref={chartRef}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Save Status */}
      <AnimatePresence>
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed bottom-4 right-4 z-50 rounded-lg p-4 shadow-xl ${
              saveStatus.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/90 dark:text-green-200'
                : saveStatus.type === 'error'
                ? 'bg-red-100 text-red-800 dark:bg-red-900/90 dark:text-red-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/90 dark:text-blue-200'
            }`}
          >
            {saveStatus.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {showSampleData && (
        <SampleDataLibrary
          onSelectSample={handleSelectSampleData}
          onClose={() => setShowSampleData(false)}
        />
      )}

      {showTemplates && (
        <TemplateGallery
          templates={CHART_TEMPLATES}
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Export Dialog for chart preview */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={async (format, quality, size) => {
          try {
            if (!chartRef.current) {
              throw new Error('Chart preview not available for export');
            }

            const element =
              (chartRef.current as any).container ||
              (chartRef.current as any).canvas ||
              (chartRef.current as HTMLElement);

            if (!element || !(element instanceof HTMLElement)) {
              throw new Error('Chart element not found');
            }

            await exportChartWithQuality(element, format, quality, size, {
              filename: config.title || 'chart'
            });

            setSaveStatus({ type: 'success', message: 'Chart exported successfully!' });
          } catch (error) {
            console.error('Export failed:', error);
            setSaveStatus({ type: 'error', message: 'Failed to export chart' });
          } finally {
            setTimeout(() => setSaveStatus(null), 3000);
          }
        }}
      />
    </div>
  );
};

export default GraphCreationNew;
