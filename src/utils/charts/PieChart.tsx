import type { ChartProps } from './types';
import { parseData } from './utils';

export const PieChart = ({ data }: ChartProps) => {
    const dataset = data.datasets[0];
    if (!dataset) return null;

    const parsedData = parseData(dataset.data);
    const total = parsedData.reduce((sum, value) => sum + value, 0);

    if (total === 0) return null;

    let startAngle = 0;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    {parsedData.map((value, index) => {
                        const percentage = (value / total) * 100;
                        const angle = (percentage / 100) * 360;
                        const endAngle = startAngle + angle;

                        const startX = 50 + 40 * Math.cos((Math.PI / 180) * (startAngle - 90));
                        const startY = 50 + 40 * Math.sin((Math.PI / 180) * (startAngle - 90));
                        const endX = 50 + 40 * Math.cos((Math.PI / 180) * (endAngle - 90));
                        const endY = 50 + 40 * Math.sin((Math.PI / 180) * (endAngle - 90));

                        const largeArcFlag = angle > 180 ? 1 : 0;
                        const pathData = `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

                        startAngle = endAngle;

                        return (
                            <path key={index} d={pathData} fill={dataset.color} stroke="#ffffff" strokeWidth="1" />
                        );
                    })}
                    <circle cx="50" cy="50" r="15" fill="#ffffff" />
                </svg>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                {data.labels.map((label, index) => {
                    const value = parsedData[index] || 0;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                    return (
                        <div key={index} className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: dataset.color }} />
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                                {label}: {percentage}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
