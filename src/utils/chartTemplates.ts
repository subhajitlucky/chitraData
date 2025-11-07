import type { GraphConfig, GraphType } from '../types';

export interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  category: 'dashboard' | 'report' | 'analytics' | 'comparison' | 'trend';
  icon: string;
  config: Omit<GraphConfig, 'title'>;
  recommendedTypes: GraphType[];
  colorPalette: string;
  dataStructure: {
    labelCount: number;
    datasetCount: number;
  };
}

export const CHART_TEMPLATES: ChartTemplate[] = [
  {
    id: 'sales-dashboard',
    name: 'Sales Dashboard',
    description: 'Track sales performance with monthly data',
    category: 'dashboard',
    icon: '📈',
    config: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        { label: 'Sales', data: '120, 150, 180, 140, 200, 220, 190, 240, 210, 230, 250, 280', color: '#3b82f6' },
        { label: 'Target', data: '150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150', color: '#ef4444' }
      ],
      chartType: 'bar'
    },
    recommendedTypes: ['bar', 'line', 'area'],
    colorPalette: 'corporate-blue',
    dataStructure: { labelCount: 12, datasetCount: 2 }
  },
  {
    id: 'website-traffic',
    name: 'Website Traffic',
    description: 'Monitor website visitors and page views',
    category: 'analytics',
    icon: '🌐',
    config: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [
        { label: 'Visitors', data: '450, 520, 610, 720, 850, 920', color: '#8b5cf6' },
        { label: 'Page Views', data: '1200, 1580, 1850, 2100, 2450, 2680', color: '#f59e0b' }
      ],
      chartType: 'line'
    },
    recommendedTypes: ['line', 'area', 'bar'],
    colorPalette: 'vibrant-rainbow',
    dataStructure: { labelCount: 6, datasetCount: 2 }
  },
  {
    id: 'revenue-breakdown',
    name: 'Revenue Breakdown',
    description: 'Show revenue distribution by category',
    category: 'report',
    icon: '💰',
    config: {
      labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
      datasets: [
        { label: 'Revenue ($1000s)', data: '450, 680, 320, 750, 580', color: '#3b82f6' }
      ],
      chartType: 'pie'
    },
    recommendedTypes: ['pie', 'doughnut', 'bar'],
    colorPalette: 'colorblind-safe',
    dataStructure: { labelCount: 5, datasetCount: 1 }
  },
  {
    id: 'social-engagement',
    name: 'Social Media Engagement',
    description: 'Compare engagement across platforms',
    category: 'comparison',
    icon: '📱',
    config: {
      labels: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok'],
      datasets: [
        { label: 'Engagement %', data: '3.2, 2.8, 5.6, 2.1, 4.3, 6.8', color: '#10b981' }
      ],
      chartType: 'bar'
    },
    recommendedTypes: ['bar', 'doughnut', 'line'],
    colorPalette: 'tropical',
    dataStructure: { labelCount: 6, datasetCount: 1 }
  },
  {
    id: 'trend-analysis',
    name: 'Trend Analysis',
    description: 'Track growth trends over time',
    category: 'trend',
    icon: '📊',
    config: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1 (Next Year)', 'Q2 (Next Year)'],
      datasets: [
        { label: 'Users', data: '1200, 1580, 2100, 2800, 3500, 4200', color: '#3b82f6' },
        { label: 'Revenue', data: '8500, 11200, 15800, 21000, 26500, 32000', color: '#10b981' }
      ],
      chartType: 'line'
    },
    recommendedTypes: ['line', 'area', 'bar'],
    colorPalette: 'ocean',
    dataStructure: { labelCount: 6, datasetCount: 2 }
  },
  {
    id: 'kpi-dashboard',
    name: 'KPI Dashboard',
    description: 'Display key performance indicators',
    category: 'dashboard',
    icon: '🎯',
    config: {
      labels: ['Sales', 'Marketing', 'Support', 'Development', 'Operations'],
      datasets: [
        { label: 'Target', data: '100, 100, 100, 100, 100', color: '#9ca3af' },
        { label: 'Achievement', data: '125, 88, 110, 95, 102', color: '#3b82f6' }
      ],
      chartType: 'bar'
    },
    recommendedTypes: ['bar', 'area', 'line'],
    colorPalette: 'modern-gray',
    dataStructure: { labelCount: 5, datasetCount: 2 }
  },
  {
    id: 'market-share',
    name: 'Market Share',
    description: 'Visualize market share distribution',
    category: 'report',
    icon: '🥧',
    config: {
      labels: ['Our Company', 'Competitor A', 'Competitor B', 'Competitor C', 'Others'],
      datasets: [
        { label: 'Market Share %', data: '35, 25, 18, 12, 10', color: '#3b82f6' }
      ],
      chartType: 'doughnut'
    },
    recommendedTypes: ['doughnut', 'pie', 'bar'],
    colorPalette: 'sunset',
    dataStructure: { labelCount: 5, datasetCount: 1 }
  },
  {
    id: 'user-growth',
    name: 'User Growth',
    description: 'Track user acquisition over months',
    category: 'trend',
    icon: '👥',
    config: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        { label: 'New Users', data: '45, 62, 78, 95, 118, 142', color: '#10b981' }
      ],
      chartType: 'area'
    },
    recommendedTypes: ['area', 'line', 'bar'],
    colorPalette: 'forest',
    dataStructure: { labelCount: 6, datasetCount: 1 }
  },
  {
    id: 'budget-allocation',
    name: 'Budget Allocation',
    description: 'Show budget distribution across departments',
    category: 'report',
    icon: '💵',
    config: {
      labels: ['R&D', 'Marketing', 'Sales', 'Operations', 'HR', 'IT'],
      datasets: [
        { label: 'Budget %', data: '30, 20, 25, 15, 5, 5', color: '#3b82f6' }
      ],
      chartType: 'pie'
    },
    recommendedTypes: ['pie', 'doughnut', 'bar'],
    colorPalette: 'soft-pastel',
    dataStructure: { labelCount: 6, datasetCount: 1 }
  },
  {
    id: 'performance-comparison',
    name: 'Performance Comparison',
    description: 'Compare team or product performance',
    category: 'comparison',
    icon: '⚡',
    config: {
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      datasets: [
        { label: 'Efficiency', data: '85, 92, 78, 95, 88', color: '#8b5cf6' },
        { label: 'Quality', data: '90, 88, 85, 92, 90', color: '#ec4899' }
      ],
      chartType: 'bar'
    },
    recommendedTypes: ['bar', 'area', 'line'],
    colorPalette: 'neon',
    dataStructure: { labelCount: 5, datasetCount: 2 }
  }
];

export const getTemplatesByCategory = (category: string): ChartTemplate[] => {
  if (category === 'all') return CHART_TEMPLATES;
  return CHART_TEMPLATES.filter(t => t.category === category);
};

export const getTemplateById = (id: string): ChartTemplate | undefined => {
  return CHART_TEMPLATES.find(t => t.id === id);
};

export const createConfigFromTemplate = (
  template: ChartTemplate,
  customTitle?: string
): GraphConfig => {
  return {
    title: customTitle || template.name,
    labels: [...template.config.labels],
    datasets: [...template.config.datasets],
    chartType: template.config.chartType
  };
};
