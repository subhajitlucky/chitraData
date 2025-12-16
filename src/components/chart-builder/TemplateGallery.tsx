import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLayout } from 'react-icons/fi';
import type { ChartTemplate } from '../../utils/chartTemplates';
import { ChartRenderer } from '../../utils/chartRenderer';

interface TemplateGalleryProps {
  templates: ChartTemplate[];
  onSelectTemplate: (template: ChartTemplate) => void;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: '🌟' },
  { id: 'dashboard', label: 'Dashboards', icon: '📊' },
  { id: 'report', label: 'Reports', icon: '📄' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'comparison', label: 'Comparisons', icon: '⚖️' },
  { id: 'trend', label: 'Trends', icon: '📉' }
];

const getChartIcon = (_type: string) => {
  return FiLayout;
};

export default function TemplateGallery({
  templates,
  onSelectTemplate,
  onClose
}: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const filteredTemplates = activeCategory === 'all'
    ? templates
    : templates.filter(t => t.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                <FiLayout size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Chart Templates</h2>
                <p className="text-gray-600 dark:text-gray-400">Start with professionally designed templates</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              return (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={() => setHoveredTemplate(template.id)}
                  onHoverEnd={() => setHoveredTemplate(null)}
                  onClick={() => onSelectTemplate(template)}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">{template.name}</h3>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium mt-1 inline-block">
                          {CATEGORIES.find(c => c.id === template.category)?.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{template.description}</p>

                  <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 mb-4">
                    <div className="h-32">
                      <ChartRenderer
                        data={{
                          title: template.name,
                          labels: template.config.labels,
                          datasets: template.config.datasets.map((d, i) => ({
                            label: d.label || `Series ${i + 1}`,
                            data: d.data,
                            color: d.color
                          })),
                          chartType: template.config.chartType
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Chart Types:</div>
                    <div className="flex gap-2 flex-wrap">
                      {template.recommendedTypes.map((type) => {
                        const Icon = getChartIcon(type);
                        return (
                          <div
                            key={type}
                            className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
                          >
                            <Icon size={12} />
                            <span className="capitalize">{type}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {hoveredTemplate === template.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-3"
                    >
                      <div className="flex items-center justify-between">
                        <span>Labels: {template.dataStructure.labelCount}</span>
                        <span>Datasets: {template.dataStructure.datasetCount}</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
