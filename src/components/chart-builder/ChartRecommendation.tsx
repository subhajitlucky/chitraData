import { motion } from 'framer-motion';
import { FiTrendingUp, FiBarChart2, FiPieChart, FiActivity } from 'react-icons/fi';
import type { GraphType } from '../../types';
import type { ChartRecommendation } from '../../utils/chartRecommendations';

interface ChartRecommendationProps {
  recommendations: ChartRecommendation[];
  onSelect: (type: GraphType) => void;
  currentType: GraphType;
}

const CHART_TYPE_INFO = {
  bar: { icon: FiBarChart2, name: 'Bar Chart', color: '#3b82f6' },
  line: { icon: FiTrendingUp, name: 'Line Chart', color: '#8b5cf6' },
  area: { icon: FiActivity, name: 'Area Chart', color: '#10b981' },
  pie: { icon: FiPieChart, name: 'Pie Chart', color: '#ec4899' },
  doughnut: { icon: FiPieChart, name: 'Doughnut Chart', color: '#f59e0b' }
};

export default function ChartRecommendationUI({
  recommendations,
  onSelect,
  currentType
}: ChartRecommendationProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl shadow-sm border border-blue-200 dark:border-gray-700 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">✨ Smart Recommendations</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Based on your data, we suggest these chart types</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {recommendations.map((rec, idx) => {
          const info = CHART_TYPE_INFO[rec.type];
          const Icon = info.icon;
          const isSelected = currentType === rec.type;

          return (
            <motion.button
              key={rec.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelect(rec.type)}
              className={`p-4 rounded-lg text-left transition-all border-2 ${
                isSelected
                  ? 'border-blue-500 bg-white dark:bg-gray-800 shadow-lg'
                  : 'border-transparent bg-white/70 dark:bg-gray-800/70 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${info.color}20` }}
                >
                  <Icon size={20} style={{ color: info.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
                    {info.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {rec.description}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${rec.confidence * 100}%` }}
                        transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: info.color }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {Math.round(rec.confidence * 100)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                    {rec.reason}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
