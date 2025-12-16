import type { ChartProps } from './types';
import { parseData } from './utils';

export const ScatterPlot = ({ data }: ChartProps) => {
    if (data.datasets.length < 2) return null;

    const datasetX = data.datasets[0];
    const datasetY = data.datasets[1];

    const parsedDataX = parseData(datasetX.data);
    const parsedDataY = parseData(datasetY.data);

    const maxX = Math.max(...parsedDataX);
    const minX = Math.min(...parsedDataX);
    const maxY = Math.max(...parsedDataY);
    const minY = Math.min(...parsedDataY);
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 relative p-4">
                <div className="absolute inset-0 border-l border-b border-gray-300 dark:border-gray-600">
                    {parsedDataX.map((x, index) => {
                        const y = parsedDataY[index] || 0;
                        const normalizedX = ((x - minX) / rangeX) * 100;
                        const normalizedY = 100 - ((y - minY) / rangeY) * 100;

                        return (
                            <div
                                key={index}
                                className="absolute w-3 h-3 rounded-full"
                                style={{
                                    left: `${normalizedX}%`,
                                    top: `${normalizedY}%`,
                                    backgroundColor: datasetX.color,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: datasetX.color }} />
                    <span className="text-xs text-gray-600 dark:text-gray-300">{datasetX.label} (X-axis)</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: datasetY.color }} />
                    <span className="text-xs text-gray-600 dark:text-gray-300">{datasetY.label} (Y-axis)</span>
                </div>
            </div>
        </div>
    );
};
