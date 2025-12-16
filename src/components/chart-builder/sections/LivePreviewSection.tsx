import { FiDownload } from 'react-icons/fi';
import { ChartPreview } from '../ChartPreview';
import type { GraphType } from '../../../types';
import type { RefObject } from 'react';

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

interface LivePreviewSectionProps {
  config: GraphConfig;
  onOpenExport: () => void;
  chartRef: RefObject<any>;
}

export function LivePreviewSection({ config, onOpenExport, chartRef }: LivePreviewSectionProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live preview</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Every change is rendered instantly for review.</p>
        </div>
        <button
          onClick={onOpenExport}
          className="inline-flex items-center gap-2 rounded-lg border border-blue-500 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-500/10"
        >
          <FiDownload className="h-4 w-4" />
          Export options
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
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
  );
}

