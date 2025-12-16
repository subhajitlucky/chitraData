import type { ChartProps } from './types';
import { parseData } from './utils';

export const BarChart = ({ data }: ChartProps) => {
    const maxValue = Math.max(...data.datasets.flatMap(ds => parseData(ds.data)));

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 flex items-end justify-between space-x-2 px-2">
                {data.labels.map((label, labelIndex) => (
                    <div key={labelIndex} className="flex flex-col items-center flex-1">
                        <div className="flex items-end justify-center space-x-1 w-full">
                            {data.datasets.map((dataset, datasetIndex) => {
                                const parsedData = parseData(dataset.data);
                                const value = parsedData[labelIndex] || 0;
                                const heightPercentage = maxValue > 0 ? (value / maxValue) * 80 : 0;

                                return (
                                    <div
                                        key={datasetIndex}
                                        className="flex-1 rounded-t flex items-center justify-center"
                                        style={{
                                            height: `${heightPercentage}%`,
                                            backgroundColor: dataset.color,
                                            minHeight: '4px'
                                        }}
                                    />
                                );
                            })}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate w-full text-center">
                            {label}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center space-x-4 mt-4">
                {data.datasets.map((dataset, index) => (
                    <div key={index} className="flex items-center">
                        <div
                            className="w-3 h-3 rounded-full mr-1"
                            style={{ backgroundColor: dataset.color }}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-300">{dataset.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
