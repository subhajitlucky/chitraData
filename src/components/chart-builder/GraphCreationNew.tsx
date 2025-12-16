import { useState, useRef, useCallback, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import type { GraphType } from '../../types';
import { AnimatePresence, motion } from 'framer-motion';
import SampleDataLibrary from './SampleDataLibrary';
import TemplateGallery from './TemplateGallery';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { COLOR_PALETTES, type ColorPalette } from '../../utils/colorPalettes';
import { CHART_TEMPLATES } from '../../utils/chartTemplates';
import ExportDialog from './ExportDialog';
import { exportChartWithQuality } from '../../utils/exportUtils';
import { exportChartConfigImage } from '../../utils/chartExport';
import { chartConfigSchema, type ChartConfigInput } from '../../schemas/chartSchemas';
import { HeroSection } from './sections/HeroSection';
import { BuilderTabs } from './sections/BuilderTabs';
import { LivePreviewSection } from './sections/LivePreviewSection';
import { ActionToolbar } from './sections/ActionToolbar';

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
  const handleSaveChart = useCallback(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('chitradata_graphs') || '[]');
      const chartToSave = {
        id: Date.now().toString(),
        title: config.title || 'Untitled chart',
        type: config.chartType,
        labels: config.labels,
        datasets: config.datasets.map((dataset) => ({
          label: dataset.label || 'Series',
          data: dataset.data,
          color: dataset.color
        })),
        createdAt: new Date().toISOString()
      };

      const updated = Array.isArray(existing) ? [chartToSave, ...existing] : [chartToSave];
      localStorage.setItem('chitradata_graphs', JSON.stringify(updated));
      setSaveStatus({ type: 'success', message: 'Chart saved to gallery!' });
    } catch (error) {
      console.error('Chart save failed:', error);
      setSaveStatus({ type: 'error', message: 'Unable to save chart' });
    } finally {
      setTimeout(() => setSaveStatus(null), 3000);
    }
  }, [config]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        handleSaveChart();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [handleSaveChart]);

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

  const validateExternalConfig = useCallback((candidate: ChartConfigInput) => {
    const parsed = chartConfigSchema.safeParse(candidate);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || 'Invalid configuration';
      setSaveStatus({ type: 'error', message: firstIssue });
      setTimeout(() => setSaveStatus(null), 3000);
      return null;
    }
    return parsed.data;
  }, []);

  const handleSelectSampleData = (data: any) => {
    const newConfig: ChartConfigInput = {
      title: data.title,
      labels: data.labels,
      datasets: data.datasets.map((d: any) => ({
        label: d.label,
        data: d.data,
        color: d.color
      })),
      chartType: data.chartType || data.chartTypes?.[0] || 'bar'
    };

    const validated = validateExternalConfig(newConfig);
    if (!validated) return;

    handleConfigChange(validated);
    setShowSampleData(false);
    setSaveStatus({ type: 'success', message: 'Sample data loaded successfully!' });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSelectTemplate = (template: any) => {
    const newConfig: ChartConfigInput = {
      title: template.name,
      labels: template.config.labels,
      datasets: template.config.datasets.map((d: any) => ({
        label: d.label,
        data: d.data.split(',').map((v: string) => parseFloat(v.trim())),
        color: d.color
      })),
      chartType: template.config.chartType
    };

    const validated = validateExternalConfig(newConfig);
    if (!validated) return;

    handleConfigChange(validated);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <HeroSection
        onOpenSamples={() => setShowSampleData(true)}
        onOpenTemplates={() => setShowTemplates(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <ActionToolbar
          onUndo={undo}
          onRedo={redo}
          onDuplicate={handleDuplicate}
          onSave={handleSaveChart}
          canUndo={canUndo}
          canRedo={canRedo}
        />

        <BuilderTabs
          activePanel={activePanel}
          onTabChange={setActivePanel}
          config={config}
          selectedPalette={selectedPalette}
          onTitleChange={handleTitleChange}
          onDataChange={handleDataChange}
          onChartTypeChange={handleChartTypeChange}
          onPaletteChange={handlePaletteChange}
        />

        <LivePreviewSection config={config} onOpenExport={() => setIsExportDialogOpen(true)} chartRef={chartRef} />
      </div>

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

      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={async (format, quality, size) => {
          try {
            if (format === 'png') {
              await exportChartConfigImage(
                {
                  title: config.title,
                  labels: config.labels,
                  datasets: config.datasets.map((dataset) => ({
                    label: dataset.label || 'Series',
                    data: dataset.data,
                    color: dataset.color
                  })),
                  chartType: config.chartType
                },
                quality,
                size,
                config.title || 'chart'
              );
            } else {
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
            }

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
