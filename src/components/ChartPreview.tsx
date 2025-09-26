import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import type { GraphData } from '../types';
import { forwardRef } from 'react';

interface ChartPreviewProps {
  data: GraphData;
  id?: string; // Add an optional id prop to identify the chart
}

export const ChartPreview = forwardRef<any, ChartPreviewProps>(({ data, id }, ref) => {
  // Validate data
  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">📊</div>
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

  // Prepare chart data
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => {
      const backgroundColor = dataset.backgroundColor || dataset.color + '80';
      const borderColor = dataset.borderColor || dataset.color;
      return {
        label: dataset.label,
        data: dataset.data,
        backgroundColor: (data.type === 'doughnut' || data.type === 'pie') 
          ? data.datasets.map(d => d.color + '80')
          : backgroundColor,
        borderColor: (data.type === 'doughnut' || data.type === 'pie')
          ? data.datasets.map(d => d.color)
          : borderColor,
        borderWidth: dataset.borderWidth || 2,
        tension: 0.3, // For smooth line charts
        fill: data.type === 'area' ? true : false,
        pointBackgroundColor: borderColor,
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2,
        borderSkipped: false, // For bar charts to show all borders
        borderRadius: 4, // For rounded bar corners
        borderAlign: 'inner' // For inner border alignment
      };
    })
  };

  // Chart options with modern styling
  const options: any = {
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
            family: 'system-ui, -apple-system, sans-serif'
          },
          color: '#4b5563', // Tailwind gray-600
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 6,
          textAlign: 'center' as const,
        }
      },
      title: {
        display: true,
        text: data.title,
        font: {
          size: 16,
          weight: 'bold',
          family: 'system-ui, -apple-system, sans-serif'
        },
        color: '#374151', // Tailwind gray-700
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)', // Tailwind gray-900 with opacity
        titleColor: '#f9fafb', // Tailwind gray-50
        bodyColor: '#f9fafb',
        borderColor: '#d1d5db', // Tailwind gray-300
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        displayColors: true,
        boxWidth: 12,
        boxHeight: 12,
        boxPadding: 4,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== undefined) {
              label += new Intl.NumberFormat('en-US', { 
                maximumFractionDigits: 2 
              }).format(context.parsed.y);
            } else if (context.parsed !== undefined) {
              // For pie/doughnut charts
              label += new Intl.NumberFormat('en-US', { 
                maximumFractionDigits: 2 
              }).format(context.parsed);
            }
            return label;
          },
          title: function(tooltipItems: any) {
            // Customize tooltip title
            return tooltipItems[0].label || '';
          }
        }
      },
      datalabels: {
        display: false // Disable default datalabels plugin if installed
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)', // Light grid for x-axis
          drawBorder: false,
          zeroLineWidth: 1,
          zeroLineColor: 'rgba(156, 163, 175, 0.3)',
          tickLength: 0
        },
        ticks: {
          color: '#6b7280', // Tailwind gray-500
          maxRotation: 45,
          font: {
            size: 11,
            family: 'system-ui, -apple-system, sans-serif'
          },
          padding: 8
        },
        title: {
          display: true,
          text: 'Categories',
          color: '#4b5563',
          font: {
            size: 12,
            weight: 'bold',
            family: 'system-ui, -apple-system, sans-serif'
          },
          padding: {
            top: 10,
            bottom: 5
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)', // Light grid for y-axis
          drawBorder: false,
          zeroLineWidth: 1,
          zeroLineColor: 'rgba(156, 163, 175, 0.3)',
          tickLength: 0
        },
        ticks: {
          color: '#6b7280', // Tailwind gray-500
          font: {
            size: 11,
            family: 'system-ui, -apple-system, sans-serif'
          },
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value);
          },
          padding: 8
        },
        title: {
          display: true,
          text: 'Values',
          color: '#4b5563',
          font: {
            size: 12,
            weight: 'bold',
            family: 'system-ui, -apple-system, sans-serif'
          },
          padding: {
            top: 5,
            bottom: 10
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    hover: {
      mode: 'index' as const,
      intersect: false
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6
      },
      line: {
        borderWidth: 3
      },
      bar: {
        borderRadius: 6,
        borderSkipped: false
      }
    }
  };

  // Render appropriate chart based on type
  switch (data.type) {
    case 'bar':
      return (
        <div 
          className="chart-preview-container w-full h-full p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          role="img" 
          aria-label={`${data.title} bar chart showing ${data.datasets.length} dataset${data.datasets.length !== 1 ? 's' : ''}`}
        >
          <Bar data={chartData} options={options} ref={ref} />
        </div>
      );
    case 'line':
      return (
        <div 
          className="chart-preview-container w-full h-full p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          role="img" 
          aria-label={`${data.title} line chart showing ${data.datasets.length} dataset${data.datasets.length !== 1 ? 's' : ''}`}
        >
          <Line data={chartData} options={options} ref={ref} />
        </div>
      );
    case 'pie':
      return (
        <div 
          className="chart-preview-container w-full h-full p-4 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          role="img" 
          aria-label={`${data.title} pie chart showing ${data.datasets[0]?.data?.length || 0} categories`}
        >
          <div className="w-full max-w-xs h-64 md:h-80">
            <Pie 
              data={{ 
                labels: data.labels, 
                datasets: [{
                  label: 'Values',
                  data: data.datasets[0]?.data || [],
                  backgroundColor: data.datasets.map(d => d.color + '80'),
                  borderColor: data.datasets.map(d => d.color),
                  borderWidth: 2
                }] 
              }} 
              options={{
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
                        family: 'system-ui, -apple-system, sans-serif'
                      },
                      color: '#4b5563',
                      boxWidth: 12,
                      boxHeight: 12,
                      borderRadius: 6
                    }
                  },
                  title: {
                    display: true,
                    text: data.title,
                    font: {
                      size: 16,
                      weight: 'bold',
                      family: 'system-ui, -apple-system, sans-serif'
                    },
                    color: '#374151',
                    padding: {
                      top: 10,
                      bottom: 20
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f9fafb',
                    bodyColor: '#f9fafb',
                    borderColor: '#d1d5db',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                      label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                          label += ': ';
                        }
                        if (context.parsed !== undefined) {
                          label += new Intl.NumberFormat('en-US', { 
                            maximumFractionDigits: 2 
                          }).format(context.parsed);
                        }
                        return label;
                      }
                    }
                  }
                },
                animation: {
                  duration: 1000,
                  easing: 'easeOutQuart'
                }
              }} 
              ref={ref}
            />
          </div>
        </div>
      );
    case 'area':
      return (
        <div 
          className="chart-preview-container w-full h-full p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          role="img" 
          aria-label={`${data.title} area chart showing ${data.datasets.length} dataset${data.datasets.length !== 1 ? 's' : ''}`}
        >
          <Line 
            data={chartData} 
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                legend: {
                  ...options.plugins.legend,
                  labels: {
                    ...options.plugins.legend.labels,
                    filter: () => {
                      // Filter out any legend items that need to be hidden
                      return true;
                    }
                  }
                }
              }
            }} 
            ref={ref}
          />
        </div>
      );
    case 'doughnut':
      return (
        <div 
          className="chart-preview-container w-full h-full p-4 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          role="img" 
          aria-label={`${data.title} doughnut chart showing ${data.datasets[0]?.data?.length || 0} categories`}
        >
          <div className="w-full max-w-xs h-64 md:h-80">
            <Doughnut 
              data={{ 
                labels: data.labels, 
                datasets: [{
                  label: 'Values',
                  data: data.datasets[0]?.data || [],
                  backgroundColor: data.datasets.map(d => d.color + '80'),
                  borderColor: data.datasets.map(d => d.color),
                  borderWidth: 2
                }] 
              }} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%', // Creates the doughnut effect
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      padding: 15,
                      usePointStyle: true,
                      font: {
                        size: 13,
                        family: 'system-ui, -apple-system, sans-serif'
                      },
                      color: '#4b5563',
                      boxWidth: 12,
                      boxHeight: 12,
                      borderRadius: 6
                    }
                  },
                  title: {
                    display: true,
                    text: data.title,
                    font: {
                      size: 16,
                      weight: 'bold',
                      family: 'system-ui, -apple-system, sans-serif'
                    },
                    color: '#374151',
                    padding: {
                      top: 10,
                      bottom: 20
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f9fafb',
                    bodyColor: '#f9fafb',
                    borderColor: '#d1d5db',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                      label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                          label += ': ';
                        }
                        if (context.parsed !== undefined) {
                          label += new Intl.NumberFormat('en-US', { 
                            maximumFractionDigits: 2 
                          }).format(context.parsed);
                        }
                        return label;
                      }
                    }
                  }
                },
                animation: {
                  duration: 1000,
                  easing: 'easeOutQuart'
                }
              }} 
              ref={ref}
            />
          </div>
        </div>
      );
    default:
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {data.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Unsupported chart type
            </p>
          </div>
        </div>
      );
  }
});

// Required for forwardRef
ChartPreview.displayName = 'ChartPreview';