import { Chart as ChartJS, type ChartConfiguration, type ChartType } from 'chart.js';
import type { GraphType } from '../types';
import { getPresetSizes } from './exportUtils';

type QualityPreset = 'standard' | 'hd' | '2k' | '4k' | '8k';

const QUALITY_DIMENSIONS: Record<QualityPreset, { width: number; height: number }> = {
  standard: { width: 1280, height: 720 },
  hd: { width: 1920, height: 1080 },
  '2k': { width: 2560, height: 1440 },
  '4k': { width: 3840, height: 2160 },
  '8k': { width: 7680, height: 4320 }
};

const parseSizeString = (size: string | null | undefined) => {
  if (!size) return null;

  if (size.includes('x')) {
    const [w, h] = size.split('x').map((value) => parseInt(value.trim(), 10));
    if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
      return { width: w, height: h };
    }
  }

  const preset = getPresetSizes()[size as keyof ReturnType<typeof getPresetSizes>];
  if (preset) {
    return { width: preset.width, height: preset.height };
  }

  return null;
};

const resolveDimensions = (
  quality: QualityPreset,
  size: string | null | undefined
): { width: number; height: number } => {
  const parsed = parseSizeString(size);
  if (parsed) {
    return parsed;
  }

  return QUALITY_DIMENSIONS[quality] ?? QUALITY_DIMENSIONS.hd;
};

const buildChartJsConfig = (
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
    const backgroundColours = labels.map((_, index) => datasets[index]?.color || '#3b82f6');

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

        return datasetConfig;
      }) as any
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

export const exportChartConfigImage = async (
  {
    title,
    labels,
    datasets,
    chartType
  }: {
    title: string;
    labels: string[];
    datasets: Array<{ label: string; data: number[]; color: string }>;
    chartType: GraphType;
  },
  quality: QualityPreset,
  size: string | null | undefined,
  filename: string
) => {
  const { width, height } = resolveDimensions(quality, size);
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

  const dataUrl = canvas.toDataURL('image/png', 1);
  chart.destroy();

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
};

