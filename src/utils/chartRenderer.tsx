import { FiBarChart2 } from 'react-icons/fi';

interface ChartData {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: string;
    color: string;
  }[];
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
}

// Parse data string to array of numbers
const parseData = (dataStr: string): number[] => {
  return dataStr.split(',')
    .map(item => parseFloat(item.trim()))
    .filter(item => !isNaN(item));
};

// Bar Chart Component
const BarChart = ({ data }: { data: ChartData }) => {
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

// Line Chart Component
const LineChart = ({ data }: { data: ChartData }) => {
  const maxValue = Math.max(...data.datasets.flatMap(ds => parseData(ds.data)));
  
  // Create points for the line
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
                {/* Line */}
                <div 
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    clipPath: `polygon(${points}, 100% 100%, 0% 100%)`,
                    backgroundColor: `${dataset.color}20`,
                  }}
                />
                {/* Line stroke */}
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline 
                    points={points} 
                    fill="none" 
                    stroke={dataset.color} 
                    strokeWidth="1" 
                  />
                  {/* Points */}
                  {data.labels.map((_, labelIndex) => {
                    const parsedData = parseData(dataset.data);
                    const value = parsedData[labelIndex] || 0;
                    const y = maxValue > 0 ? 100 - (value / maxValue) * 80 : 100;
                    const x = (labelIndex / (data.labels.length - 1 || 1)) * 100;
                    
                    return (
                      <circle 
                        key={labelIndex}
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r="1.5"
                        fill={dataset.color}
                      />
                    );
                  })}
                </svg>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between px-2">
        {data.labels.map((label, index) => (
          <div 
            key={index} 
            className="text-xs text-gray-500 dark:text-gray-400 truncate"
            style={{ width: `${100 / data.labels.length}%` }}
          >
            {label}
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

// Pie Chart Component
const PieChart = ({ data }: { data: ChartData }) => {
  // For simplicity, we'll use only the first dataset for pie chart
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
            
            // Calculate coordinates for the arc
            const startX = 50 + 40 * Math.cos((Math.PI / 180) * (startAngle - 90));
            const startY = 50 + 40 * Math.sin((Math.PI / 180) * (startAngle - 90));
            const endX = 50 + 40 * Math.cos((Math.PI / 180) * (endAngle - 90));
            const endY = 50 + 40 * Math.sin((Math.PI / 180) * (endAngle - 90));
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M 50 50`,
              `L ${startX} ${startY}`,
              `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ');
            
            const color = dataset.color;
            
            startAngle = endAngle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={color}
                stroke="#ffffff"
                strokeWidth="1"
              />
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
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: dataset.color }}
              />
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

// Area Chart Component
const AreaChart = ({ data }: { data: ChartData }) => {
  const maxValue = Math.max(...data.datasets.flatMap(ds => parseData(ds.data)));
  
  // Create points for the area
  const createAreaPoints = (datasetIndex: number) => {
    const dataset = data.datasets[datasetIndex];
    const parsedData = parseData(dataset.data);
    
    let points = data.labels.map((_, labelIndex) => {
      const value = parsedData[labelIndex] || 0;
      const y = maxValue > 0 ? 100 - (value / maxValue) * 80 : 100;
      const x = (labelIndex / (data.labels.length - 1 || 1)) * 100;
      return `${x}% ${y}%`;
    }).join(', ');
    
    // Close the polygon by adding bottom corners
    points += `, 100% 100%, 0% 100%`;
    
    return points;
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          {data.datasets.map((dataset, datasetIndex) => {
            const areaPoints = createAreaPoints(datasetIndex);
            
            return (
              <div 
                key={datasetIndex}
                className="absolute inset-0"
                style={{
                  clipPath: `polygon(${areaPoints})`,
                  backgroundColor: `${dataset.color}40`,
                }}
              >
                {/* Line on top of area */}
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {(() => {
                    const parsedData = parseData(dataset.data);
                    const points = data.labels.map((_, labelIndex) => {
                      const value = parsedData[labelIndex] || 0;
                      const y = maxValue > 0 ? 100 - (value / maxValue) * 80 : 100;
                      const x = (labelIndex / (data.labels.length - 1 || 1)) * 100;
                      return `${x}% ${y}%`;
                    }).join(', ');
                    
                    return (
                      <polyline 
                        points={points} 
                        fill="none" 
                        stroke={dataset.color} 
                        strokeWidth="1" 
                      />
                    );
                  })()}
                </svg>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between px-2">
        {data.labels.map((label, index) => (
          <div 
            key={index} 
            className="text-xs text-gray-500 dark:text-gray-400 truncate"
            style={{ width: `${100 / data.labels.length}%` }}
          >
            {label}
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

// Scatter Plot Component
const ScatterPlot = ({ data }: { data: ChartData }) => {
  // Using first two datasets for X and Y axes
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
            
            // Normalize to 0-100 range
            const normalizedX = ((x - minX) / rangeX) * 100;
            const normalizedY = 100 - ((y - minY) / rangeY) * 100; // Flip Y axis
            
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
          <div 
            className="w-3 h-3 rounded-full mr-1"
            style={{ backgroundColor: datasetX.color }}
          />
          <span className="text-xs text-gray-600 dark:text-gray-300">{datasetX.label} (X-axis)</span>
        </div>
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-1"
            style={{ backgroundColor: datasetY.color }}
          />
          <span className="text-xs text-gray-600 dark:text-gray-300">{datasetY.label} (Y-axis)</span>
        </div>
      </div>
    </div>
  );
};

// Main Chart Renderer Component
export const ChartRenderer = ({ data }: { data: ChartData }) => {
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

  switch (data.chartType) {
    case 'bar':
      return <BarChart data={data} />;
    case 'line':
      return <LineChart data={data} />;
    case 'pie':
      return <PieChart data={data} />;
    case 'area':
      return <AreaChart data={data} />;
    case 'scatter':
      return <ScatterPlot data={data} />;
    default:
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
};