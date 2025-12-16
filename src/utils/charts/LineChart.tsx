import type { ChartProps } from './types';
import { parseData } from './utils';

export const LineChart = ({ data }: ChartProps) => {
    const maxValue = Math.max(...data.datasets.flatMap(ds => parseData(ds.data)));

    const createPoints = (datasetIndex: number) => {
        const dataset = data.datasets[datasetIndex];
        const parsedData = parseData(dataset.data);

        return data.labels.map((_, labelIndex) => {
            const value = parsedData[labelIndex] || 0;
            const y = maxValue > 0 ? 100 - (value / maxValue) * 80 : 100;
            const x = (labelIndex / (data.labels.length - 1 || 1)) * 100;
            return `${x}% ${y}%`;
        }).join(', ');
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 relative">
                <div className="absolute inset-0">
                    {data.datasets.map((dataset, datasetIndex) => {
                        const points = createPoints(datasetIndex);
                        return (
                            <div key={datasetIndex} className="absolute inset-0">
                                <div
                                    className="absolute top-0 left-0 w-full h-full"
                                    style={{
                                        clipPath: `polygon(${points}, 100% 100%, 0% 100%)`,
                                        backgroundColor: `${dataset.color}20`,
                                    }}
                                />
                                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <polyline points={points} fill="none" stroke={dataset.color} strokeWidth="1" />
                                    {data.labels.map((_, labelIndex) => {
                                        const parsedData = parseData(dataset.data);
                                        const value = parsedData[labelIndex] || 0;
                                        const y = maxValue > 0 ? 100 - (value / maxValue) * 80 : 100;
                                        const x = (labelIndex / (data.labels.length - 1 || 1)) * 100;
                                        return (
                                            <circle key={labelIndex} cx={`${x}%`} cy={`${y}%`} r="1.5" fill={dataset.color} />
                                        );
                                    })}
                                </svg>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-between px-2">
                {data.labels.map((label, index) => (
                    <div key={index} className="text-xs text-gray-500 dark:text-gray-400 truncate"
                        style={{ width: `${100 / data.labels.length}%` }}>
                        {label}
                    </div>
                ))}
            </div>

            <div className="flex justify-center space-x-4 mt-4">
                {data.datasets.map((dataset, index) => (
                    <div key={index} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: dataset.color }} />
                        <span className="text-xs text-gray-600 dark:text-gray-300">{dataset.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
