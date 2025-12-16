import { FiBarChart2 } from 'react-icons/fi';
import type { ChartData } from './charts/types';
import { BarChart } from './charts/BarChart';
import { LineChart } from './charts/LineChart';
import { PieChart } from './charts/PieChart';
import { AreaChart } from './charts/AreaChart';
import { ScatterPlot } from './charts/ScatterPlot';

export interface ChartRendererProps {
  data: ChartData;
}

export const ChartRenderer = ({ data }: ChartRendererProps) => {
  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <FiBarChart2 className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {data?.title || 'Chart Preview'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No data available to display
          </p>
        </div>
      </div>
    );
  }

  const renderComponent = () => {
    switch (data.chartType) {
      case 'bar': return <BarChart data={data} />;
      case 'line': return <LineChart data={data} />;
      case 'pie':
      case 'doughnut': return <PieChart data={data} />;
      case 'area': return <AreaChart data={data} />;
      case 'scatter': return <ScatterPlot data={data} />;
      default: return null;
    }
  };

  const component = renderComponent();

  if (!component) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <FiBarChart2 className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {data.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Unknown Chart Preview
          </p>
        </div>
      </div>
    );
  }

  return component;
};