import { Chart as ChartJS, type ChartConfiguration, type ChartType } from 'chart.js';
import type { GraphType } from '../types';
import {
  downloadCanvas,
  resolveExportDimensions,
  type ExportFormat,
  type ExportQuality
} from './exportUtils';
import { getPieSliceColors } from './pieColors';

export const buildChartJsConfig = (
  type: GraphType,
  labels: string[],
  datasets: Array<{ label: string; data: number[]; color: string }>,
  title: string,
  scale: number
): ChartConfiguration<ChartType, number[], string> => {
  const resolvedType: ChartType = type === 'area' ? 'line' : (type as ChartType);
  const scaled = (value: number) => Math.max(1, Math.round(value * scale));

  const baseOptions: ChartConfiguration<ChartType, number[], string>['options'] = {
    responsive: false,
    maintainAspectRatio: false,
    animation: false,
    layout: {
      padding: {
        top: scaled(48),
        right: scaled(48),
        bottom: scaled(64),
        left: scaled(64)
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: scaled(20),
          usePointStyle: true,
          font: { size: scaled(18), weight: 600 },
          color: '#111827'
        }
      },
      title: {
        display: Boolean(title),
        text: title,
        font: { size: scaled(28), weight: 700 },
        color: '#111827',
        padding: { top: scaled(24), bottom: scaled(32) }
      },
      tooltip: {
        enabled: false
      }
    }
  };

  if (type === 'pie' || type === 'doughnut') {
    const firstDataset = datasets[0];
    const backgroundColours = getPieSliceColors(labels.length);

    return {
      type,
      data: {
        labels,
        datasets: [
          {
            label: firstDataset?.label ?? '',
            data: firstDataset?.data ?? [],
            backgroundColor: backgroundColours,
            borderColor: '#ffffff',
            borderWidth: scaled(4)
          }
        ]
      },
      options: {
        ...baseOptions,
        cutout: type === 'doughnut' ? '55%' : undefined
      }
    } as ChartConfiguration<ChartType, number[], string>;
  }

  return {
    type: resolvedType,
    data: {
      labels,
      datasets: datasets.map((dataset) => {
        const datasetConfig: Record<string, unknown> = {
          label: dataset.label,
          data: dataset.data,
          backgroundColor: type === 'area' ? `${dataset.color}33` : dataset.color,
          borderColor: dataset.color,
          fill: type === 'area',
          borderWidth: type === 'bar' ? scaled(3) : scaled(4),
          pointRadius: type === 'line' || type === 'area' ? scaled(6) : 0,
          pointHoverRadius: type === 'line' || type === 'area' ? scaled(8) : 0,
          tension: type === 'line' || type === 'area' ? 0.4 : 0
        };

        if (type === 'bar') {
          datasetConfig.borderRadius = scaled(10);
          datasetConfig.barPercentage = 0.65;
          datasetConfig.categoryPercentage = 0.7;
          datasetConfig.borderSkipped = false;
        }

        return datasetConfig as unknown as ChartConfiguration<
          ChartType,
          number[],
          string
        >['data']['datasets'][number];
      })
    },
    options: {
      ...baseOptions,
      scales: {
        x: {
          grid: {
            display: true,
            color: 'rgba(17, 24, 39, 0.06)'
          },
          ticks: {
            color: '#1f2937',
            font: { size: scaled(16) },
            maxRotation: 0,
            padding: scaled(16)
          }
        },
        y: {
          grid: {
            display: true,
            color: 'rgba(17, 24, 39, 0.06)'
          },
          ticks: {
            color: '#1f2937',
            font: { size: scaled(16) },
            beginAtZero: true,
            padding: scaled(12)
          }
        }
      }
    }
  } as ChartConfiguration<ChartType, number[], string>;
};

export interface ChartExportInput {
  title: string;
  labels: string[];
  datasets: Array<{ label: string; data: number[]; color: string }>;
  chartType: GraphType;
}

export const renderChartToCanvas = (
  { title, labels, datasets, chartType }: ChartExportInput,
  quality: ExportQuality,
  size: string | null | undefined
): HTMLCanvasElement => {
  const { width, height } = resolveExportDimensions(quality, size);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to acquire rendering context for export');
  }

  const scale = Math.max(width / 1920, height / 1080);
  const config = buildChartJsConfig(chartType, labels, datasets, title, scale);

  const chart = new ChartJS(context, config);
  chart.update();

  context.save();
  context.globalCompositeOperation = 'destination-over';
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();

  chart.destroy();

  return canvas;
};

export const exportChartFile = async (
  input: ChartExportInput,
  {
    format,
    quality,
    size,
    filename
  }: {
    format: ExportFormat;
    quality: ExportQuality;
    size: string | null | undefined;
    filename: string;
  }
) => {
  const canvas = renderChartToCanvas(input, quality, size);
  await downloadCanvas(canvas, filename, format);
};

