import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { GraphData } from '../types';
import { motion } from 'framer-motion';
import { 
  FiDownload, 
  FiSave, 
  FiRefreshCw, 
  FiArrowLeft,
  FiBarChart2
} from 'react-icons/fi';

interface GraphCreationProps {
  setActiveTab: (tab: 'landing' | 'create' | 'gallery') => void;
}

const GraphCreation = ({ setActiveTab }: GraphCreationProps) => {
  interface DatasetConfig {
    label: string;
    data: string;
    color: string;
  }

  interface GraphConfig {
    title: string;
    labels: string[];
    datasets: DatasetConfig[];
    chartType: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  }

  const [config, setConfig] = useState<GraphConfig>({
    title: 'My Chart',
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      { label: 'Dataset 1', data: '65, 59, 80, 81, 56', color: '#3b82f6' },
      { label: 'Dataset 2', data: '28, 48, 40, 19, 86', color: '#ef4444' },
    ],
    chartType: 'bar',
  });

  interface SaveStatus {
    type: 'success' | 'error';
    message: string;
  }

  const [saveStatus, setSaveStatus] = useState<SaveStatus | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('dataset-')) {
      const [, index, field] = name.split('-');
      const datasetIndex = parseInt(index, 10);
      const newDatasets = [...config.datasets];
      
      if (field === 'label') {
        newDatasets[datasetIndex].label = value;
      } else if (field === 'data') {
        newDatasets[datasetIndex].data = value;
      } else if (field === 'color') {
        newDatasets[datasetIndex].color = value;
      }
      
      setConfig({ ...config, datasets: newDatasets });
    } else if (name.startsWith('label-')) {
      const index = parseInt(name.split('-')[1]);
      const newLabels = [...config.labels];
      newLabels[index] = value;
      setConfig({ ...config, labels: newLabels });
    } else {
      setConfig({ ...config, [name]: value });
    }
  };

  const addDataset = () => {
    setConfig({
      ...config,
      datasets: [
        ...config.datasets,
        { 
          label: `Dataset ${config.datasets.length + 1}`, 
          data: '0, 0, 0, 0, 0', 
          color: `#${Math.floor(Math.random()*16777215).toString(16)}` 
        }
      ],
    });
  };

  const addLabel = () => {
    setConfig({
      ...config,
      labels: [...config.labels, `Label ${config.labels.length + 1}`],
    });
  };

  const removeDataset = (index: number) => {
    if (config.datasets.length > 1) {
      const newDatasets = [...config.datasets];
      newDatasets.splice(index, 1);
      setConfig({ ...config, datasets: newDatasets });
    }
  };

  const removeLabel = (index: number) => {
    if (config.labels.length > 1) {
      const newLabels = [...config.labels];
      newLabels.splice(index, 1);
      setConfig({ ...config, labels: newLabels });
    }
  };

  const renderChartPreview = () => {
    // Simple preview component that shows chart type and data structure
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <FiBarChart2 className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {config.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {config.chartType.charAt(0).toUpperCase() + config.chartType.slice(1)} Chart Preview
          </p>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Labels: {config.labels.join(', ')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Datasets: {config.datasets.length}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const downloadGraph = () => {
    setSaveStatus({ type: 'success', message: 'Graph download functionality would be implemented here!' });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const saveGraph = () => {
    try {
      // Prepare data for saving
      const graphToSave: GraphData = {
        id: Date.now().toString(),
        title: config.title,
        type: config.chartType,
        labels: config.labels,
        datasets: config.datasets.map(ds => ({
          label: ds.label,
          data: ds.data
            .split(',')
            .map(value => Number(value.trim()))
            .filter(value => !Number.isNaN(value)),
          color: ds.color
        })),
        createdAt: new Date().toISOString()
      };
      
      // Get existing saved graphs from localStorage
      const savedGraphsRaw = JSON.parse(localStorage.getItem('chitradata_graphs') || '[]');
      const savedGraphs: GraphData[] = Array.isArray(savedGraphsRaw) ? savedGraphsRaw : [];
      
      // Add the new graph
      savedGraphs.push(graphToSave);
      
      // Save back to localStorage
      localStorage.setItem('chitradata_graphs', JSON.stringify(savedGraphs));
      
      setSaveStatus({ type: 'success', message: 'Graph saved successfully!' });
    } catch (error) {
      console.error('Failed to save graph configuration', error);
      setSaveStatus({ type: 'error', message: 'Failed to save graph' });
    }
    
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Panel */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Configure Graph</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Graph Title
            </label>
            <input
              type="text"
              name="title"
              value={config.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Chart Type
            </label>
            <select
              name="chartType"
              value={config.chartType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="area">Area Chart</option>
              <option value="scatter">Scatter Plot</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Labels
              </label>
              <button
                type="button"
                onClick={addLabel}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                + Add Label
              </button>
            </div>
            <div className="space-y-2">
              {config.labels.map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        name={`label-${index}`}
                        value={label}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeLabel(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Datasets
              </label>
              <button
                type="button"
                onClick={addDataset}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                + Add Dataset
              </button>
            </div>
            <div className="space-y-4">
              {config.datasets.map((dataset, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        name={`dataset-${index}-label`}
                        value={dataset.label}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          name={`dataset-${index}-color`}
                          value={dataset.color}
                          onChange={handleInputChange}
                          className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          name={`dataset-${index}-color`}
                          value={dataset.color}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data (comma separated)
                    </label>
                    <input
                      type="text"
                      name={`dataset-${index}-data`}
                      value={dataset.data}
                      onChange={handleInputChange}
                      placeholder="e.g., 65, 59, 80, 81, 56"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  {config.datasets.length > 1 && (
                    <div className="mt-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeDataset(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Dataset
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <FiArrowLeft />
              <span>Back</span>
            </button>
            <button
              onClick={downloadGraph}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiDownload />
              <span>Download</span>
            </button>
            <button
              onClick={saveGraph}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiSave />
              <span>Save</span>
            </button>
            <button
              onClick={() => setConfig({
                title: 'My Chart',
                labels: ['January', 'February', 'March', 'April', 'May'],
                datasets: [
                  { label: 'Dataset 1', data: '65, 59, 80, 81, 56', color: '#3b82f6' },
                  { label: 'Dataset 2', data: '28, 48, 40, 19, 86', color: '#ef4444' },
                ],
                chartType: 'bar',
              })}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiRefreshCw />
              <span>Reset</span>
            </button>
          </div>
          
          {saveStatus && (
            <div className={`mt-4 p-3 rounded-lg ${saveStatus.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'}`}>
              {saveStatus.message}
            </div>
          )}
        </div>
      </motion.div>

      {/* Preview Panel */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Preview</h2>
        
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="w-full h-full max-h-[500px]">
            {renderChartPreview()}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GraphCreation;