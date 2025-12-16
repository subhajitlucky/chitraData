import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import type { GraphData } from '../../types';
import { forwardRef } from 'react';
import { COLOR_PALETTES } from '../../utils/colorPalettes';

interface ChartPreviewProps {
  data: GraphData;
}

export const ChartPreview = forwardRef<HTMLDivElement, ChartPreviewProps>(({ data }, ref) => {
  // Validate data
  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {data?.title || 'Chart Preview'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">No data available to display</p>
        </div>
      </div>
    );
  }

  // Prepare chart data based on type
  let chartData: any;
  let chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 13,
          },
          color: '#4b5563',
        }
      },
      title: {
        display: true,
        text: data.title,
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#374151',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: '#d1d5db',
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
      }
    }
  };

  if (data.type === 'pie' || data.type === 'doughnut') {
    const firstDataset = data.datasets[0];
    const palette = COLOR_PALETTES.find((p) => p.id === 'colorblind-safe') || COLOR_PALETTES[0];
    const sliceColors = data.labels.map((_, i) => palette.colors[i % palette.colors.length]);

    chartData = {
      labels: data.labels,
      datasets: [
        {
          label: firstDataset.label,
          data: firstDataset.data,
          backgroundColor: sliceColors.map((color) => `${color}80`),
          borderColor: sliceColors,
          borderWidth: 2,
        },
      ],
    };

    if (data.type === 'doughnut') {
      chartOptions = {
        ...chartOptions,
        cutout: '60%',
      };
    }
  } else {
    chartData = {
      labels: data.labels,
      datasets: data.datasets.map((dataset) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: (dataset.backgroundColor || dataset.color) + '80',
        borderColor: dataset.borderColor || dataset.color,
        borderWidth: 2,
        tension: data.type === 'line' || data.type === 'area' ? 0.3 : 0,
        fill: data.type === 'area',
        pointRadius: data.type === 'line' || data.type === 'area' ? 4 : 0,
        pointHoverRadius: data.type === 'line' || data.type === 'area' ? 6 : 0,
        borderRadius: data.type === 'bar' ? 4 : 0,
        borderSkipped: data.type === 'bar' ? false : undefined,
      })),
    };

    chartOptions = {
      ...chartOptions,
      scales: {
        x: {
          grid: {
            display: true,
            color: 'rgba(156, 163, 175, 0.1)',
          },
          ticks: {
            color: '#6b7280',
            maxRotation: 45,
          },
        },
        y: {
          grid: {
            display: true,
            color: 'rgba(156, 163, 175, 0.1)',
          },
          ticks: {
            color: '#6b7280',
          },
        },
      },
    };
  }

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      options: chartOptions,
    };

    switch (data.type) {
      case 'bar':
        return <Bar {...commonProps} />;
      case 'line':
        return <Line {...commonProps} />;
      case 'area':
        return <Line {...commonProps} />;
      case 'pie':
        return <Pie {...commonProps} />;
      case 'doughnut':
        return <Doughnut {...commonProps} />;
      default:
        return <Bar {...commonProps} />;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center" ref={ref}>
      <div className="w-full h-[450px]">
        {renderChart()}
      </div>
    </div>
  );
});

ChartPreview.displayName = 'ChartPreview';
