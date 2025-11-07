import { useState, useCallback } from 'react';
import { FiPlus, FiTrash2, FiCopy } from 'react-icons/fi';

interface DataEditorProps {
  labels: string[];
  datasets: Array<{ label: string; data: number[] }>;
  onChange: (labels: string[], datasets: Array<{ label: string; data: number[] }>) => void;
}

const DataEditor = ({ labels, datasets, onChange }: DataEditorProps) => {
  const [data, setData] = useState<{ labels: string[]; datasets: Array<{ label: string; data: number[] }> }>({
    labels,
    datasets
  });

  const updateData = useCallback((newData: typeof data) => {
    setData(newData);
    onChange(newData.labels, newData.datasets);
  }, [onChange]);

  const updateLabel = (index: number, value: string) => {
    const newLabels = [...data.labels];
    newLabels[index] = value;
    updateData({ ...data, labels: newLabels });
  };

  const updateDatasetLabel = (index: number, value: string) => {
    const newDatasets = [...data.datasets];
    newDatasets[index].label = value;
    updateData({ ...data, datasets: newDatasets });
  };

  const updateDatasetValue = (datasetIndex: number, dataIndex: number, value: string) => {
    const newDatasets = [...data.datasets];
    newDatasets[datasetIndex].data[dataIndex] = parseFloat(value) || 0;
    updateData({ ...data, datasets: newDatasets });
  };

  const addColumn = () => {
    const newLabel = `Column ${data.labels.length + 1}`;
    const newLabels = [...data.labels, newLabel];
    const newDatasets = data.datasets.map(d => ({
      ...d,
      data: [...d.data, 0]
    }));
    updateData({ ...data, labels: newLabels, datasets: newDatasets });
  };

  const removeColumn = (index: number) => {
    if (data.labels.length <= 1) return;
    const newLabels = data.labels.filter((_, i) => i !== index);
    const newDatasets = data.datasets.map(d => ({
      ...d,
      data: d.data.filter((_, i) => i !== index)
    }));
    updateData({ ...data, labels: newLabels, datasets: newDatasets });
  };

  const addRow = () => {
    const newDatasets = [
      ...data.datasets,
      { label: `Dataset ${data.datasets.length + 1}`, data: new Array(data.labels.length).fill(0) }
    ];
    updateData({ ...data, datasets: newDatasets });
  };

  const removeRow = (index: number) => {
    if (data.datasets.length <= 1) return;
    const newDatasets = data.datasets.filter((_, i) => i !== index);
    updateData({ ...data, datasets: newDatasets });
  };

  const duplicateRow = (index: number) => {
    const rowToCopy = data.datasets[index];
    const newDatasets = [
      ...data.datasets,
      {
        label: `${rowToCopy.label} Copy`,
        data: [...rowToCopy.data]
      }
    ];
    updateData({ ...data, datasets: newDatasets });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Data Editor</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Edit your data directly in the table below</p>
        </div>

        <div className="p-4 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 min-w-[100px]">
                  Labels
                </th>
                {data.labels.map((label, index) => (
                  <th key={index} className="p-2 border-b border-gray-200 dark:border-gray-600 min-w-[80px]">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={label}
                        onChange={(e) => updateLabel(index, e.target.value)}
                        className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-800 dark:text-white"
                      />
                      {data.labels.length > 1 && (
                        <button
                          onClick={() => removeColumn(index)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Remove column"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.datasets.map((dataset, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={dataset.label}
                        onChange={(e) => updateDatasetLabel(rowIndex, e.target.value)}
                        className="flex-1 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-800 dark:text-white"
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => duplicateRow(rowIndex)}
                          className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="Duplicate row"
                        >
                          <FiCopy size={14} />
                        </button>
                        {data.datasets.length > 1 && (
                          <button
                            onClick={() => removeRow(rowIndex)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Remove row"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  {dataset.data.map((value, colIndex) => (
                    <td key={colIndex} className="p-2 border-b border-gray-200 dark:border-gray-600">
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => updateDatasetValue(rowIndex, colIndex, e.target.value)}
                        className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-800 dark:text-white text-center"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
          <button
            onClick={addColumn}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <FiPlus size={16} />
            Add Column
          </button>
          <button
            onClick={addRow}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <FiPlus size={16} />
            Add Dataset
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataEditor;
