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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Quick Actions Toolbar - simple horizontal toolbar, not sticky */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-colors ${
                canUndo ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' : 'text-gray-400 cursor-not-allowed'
              }`}
              title="Undo"
            >
              <FiRotateCcw size={18} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-2 rounded-lg transition-colors ${
                canRedo ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' : 'text-gray-400 cursor-not-allowed'
              }`}
              title="Redo"
            >
              <FiRotateCcw size={18} className="rotate-180" />
            </button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <button
              onClick={handleDuplicate}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiCopy size={18} />
              <span>Duplicate</span>
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
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiSave size={18} />
              <span>Save</span>
            </button>
            <button
              onClick={() => setIsExportDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiDownload size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Quick Start Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Start:</span>
            <button
              onClick={() => setShowSampleData(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
            >
              <FiDatabase size={16} />
              Sample Data
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm font-medium"
            >
              <FiLayout size={16} />
              Templates
            </button>
            {recommendations.length > 0 && (
              <div className="ml-auto">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  💡 AI suggests: {recommendations[0].type.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Smart Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-6">
            <ChartRecommendationUI
              recommendations={recommendations}
              onSelect={handleChartTypeChange}
              currentType={config.chartType}
            />
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-4 space-y-4">
            {/* Panel Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {[
                  { id: 'data', label: 'Data', icon: FiDatabase },
                  { id: 'style', label: 'Style', icon: FiLayout },
                  { id: 'settings', label: 'Settings', icon: FiSettings }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePanel(tab.id as any)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-colors ${
                        activePanel === tab.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4">
                <AnimatePresence mode="wait">
                  {activePanel === 'data' && (
                    <motion.div
                      key="data"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Chart Title
                        </label>
                        <input
                          type="text"
                          value={config.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white"
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
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Chart Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['bar', 'line', 'area', 'pie', 'doughnut'].map((type) => (
                            <button
                              key={type}
                              onClick={() => handleChartTypeChange(type as GraphType)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                config.chartType === type
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                      className="space-y-4"
                    >
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FiSettings size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Advanced settings coming soon</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Preview</h2>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[500px]">
                <ChartPreview
                  data={{
                    id: 'preview',
                    title: config.title,
                    type: config.chartType,
                    labels: config.labels,
                    datasets: config.datasets.map(ds => ({
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
            </div>
          </div>
        </div>
      </div>

      {/* Save Status */}
      <AnimatePresence>
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-xl z-50 ${
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
