import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDatabase } from 'react-icons/fi';

interface SampleData {
  id: string;
  title: string;
  description: string;
  labels: string[];
  datasets: Array<{ label: string; data: number[]; color: string }>;
  category: 'business' | 'analytics' | 'marketing' | 'finance' | 'health';
  chartTypes: string[];
}

interface SampleDataLibraryProps {
  onSelectSample: (data: SampleData) => void;
  onClose: () => void;
}

const SAMPLE_DATASETS: SampleData[] = [
  {
    id: 'sales-2024',
    title: 'Monthly Sales 2024',
    description: 'Track monthly sales performance across different product categories',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      { label: 'Electronics', data: [120, 150, 180, 140, 200, 220, 190, 240, 210, 230, 250, 280], color: '#3b82f6' },
      { label: 'Clothing', data: [80, 90, 110, 100, 130, 140, 120, 150, 160, 170, 180, 200], color: '#ec4899' },
      { label: 'Accessories', data: [50, 60, 70, 80, 90, 100, 95, 110, 120, 130, 140, 160], color: '#10b981' }
    ],
    category: 'business',
    chartTypes: ['bar', 'line', 'area']
  },
  {
    id: 'website-traffic',
    title: 'Website Traffic Analytics',
    description: 'Daily visitors and page views over a 30-day period',
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      { label: 'Unique Visitors', data: [450, 520, 480, 610, 580, 720, 680, 750, 820, 780, 900, 850, 920, 880, 950, 1020, 980, 1100, 1050, 1150, 1200, 1180, 1250, 1300, 1280, 1350, 1400, 1380, 1450, 1500], color: '#8b5cf6' },
      { label: 'Page Views', data: [1200, 1350, 1280, 1580, 1520, 1850, 1780, 1920, 2100, 2050, 2300, 2200, 2400, 2350, 2500, 2680, 2600, 2800, 2750, 2900, 3100, 3050, 3200, 3350, 3300, 3450, 3600, 3580, 3700, 3850], color: '#f59e0b' }
    ],
    category: 'analytics',
    chartTypes: ['line', 'area']
  },
  {
    id: 'customer-satisfaction',
    title: 'Customer Satisfaction Survey',
    description: 'Customer satisfaction scores across different service categories',
    labels: ['Support', 'Delivery', 'Product Quality', 'Pricing', 'User Experience', 'Website'],
    datasets: [
      { label: 'Satisfaction Score', data: [4.2, 4.5, 4.0, 3.8, 4.3, 4.6], color: '#10b981' }
    ],
    category: 'business',
    chartTypes: ['bar', 'radar']
  },
  {
    id: 'social-media',
    title: 'Social Media Engagement',
    description: 'Engagement rates across different social media platforms',
    labels: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok'],
    datasets: [
      { label: 'Engagement %', data: [3.2, 2.8, 5.6, 2.1, 4.3, 6.8], color: '#ef4444' },
      { label: 'Growth %', data: [12, 8, 25, 15, 18, 32], color: '#3b82f6' }
    ],
    category: 'marketing',
    chartTypes: ['bar', 'line']
  },
  {
    id: 'revenue-breakdown',
    title: 'Revenue Breakdown by Region',
    description: 'Quarterly revenue distribution across different regions',
    labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'],
    datasets: [
      { label: 'Q1', data: [850, 620, 480, 290, 180], color: '#3b82f6' },
      { label: 'Q2', data: [920, 680, 540, 320, 210], color: '#8b5cf6' },
      { label: 'Q3', data: [1050, 750, 620, 360, 240], color: '#ec4899' }
    ],
    category: 'business',
    chartTypes: ['bar', 'area']
  },
  {
    id: 'expense-tracker',
    title: 'Monthly Expenses',
    description: 'Track monthly expenses across different categories',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Housing', data: [1200, 1200, 1200, 1200, 1200, 1200], color: '#3b82f6' },
      { label: 'Food', data: [450, 480, 520, 490, 510, 550], color: '#10b981' },
      { label: 'Transportation', data: [200, 220, 250, 230, 240, 260], color: '#f59e0b' },
      { label: 'Entertainment', data: [150, 180, 200, 170, 190, 220], color: '#ec4899' },
      { label: 'Others', data: [100, 120, 130, 110, 140, 170], color: '#8b5cf6' }
    ],
    category: 'finance',
    chartTypes: ['pie', 'doughnut', 'bar']
  },
  {
    id: 'health-metrics',
    title: 'Health Metrics Tracking',
    description: 'Weekly health and fitness metrics over 12 weeks',
    labels: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`),
    datasets: [
      { label: 'Weight (kg)', data: [75, 74.5, 74, 73.8, 73.5, 73.2, 73, 72.8, 72.5, 72.3, 72, 71.8], color: '#ef4444' },
      { label: 'Exercise (hrs)', data: [2, 3, 3.5, 4, 3, 4.5, 5, 4, 5, 5.5, 5, 6], color: '#10b981' },
      { label: 'Sleep (hrs)', data: [6, 6.5, 7, 7.5, 7, 7.5, 8, 7.5, 8, 8, 7.5, 8], color: '#8b5cf6' }
    ],
    category: 'health',
    chartTypes: ['line', 'area']
  },
  {
    id: 'product-sales',
    title: 'Product Category Performance',
    description: 'Sales performance by product category',
    labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
    datasets: [
      { label: 'Sales ($1000s)', data: [45, 68, 32, 75, 58], color: '#3b82f6' }
    ],
    category: 'business',
    chartTypes: ['pie', 'doughnut', 'bar']
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🌟' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'marketing', label: 'Marketing', icon: '📈' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'health', label: 'Health', icon: '❤️' }
];

export default function SampleDataLibrary({ onSelectSample, onClose }: SampleDataLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredData = selectedCategory === 'all'
    ? SAMPLE_DATASETS
    : SAMPLE_DATASETS.filter(d => d.category === selectedCategory);

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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                <FiDatabase size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sample Data Library</h2>
                <p className="text-gray-600 dark:text-gray-400">Choose from professionally prepared datasets</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === category.id
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData.map((sample) => (
              <motion.div
                key={sample.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg"
                onClick={() => onSelectSample(sample)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{sample.title}</h3>
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                    {CATEGORIES.find(c => c.id === sample.category)?.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{sample.description}</p>

                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Data Preview:</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <div className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {sample.labels.length} labels, {sample.datasets.length} dataset{sample.datasets.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {sample.chartTypes.map((type) => (
                    <span
                      key={type}
                      className="text-xs px-2 py-1 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-600"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
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
