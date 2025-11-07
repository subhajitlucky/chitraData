import type { GraphType } from '../types';

export interface ChartRecommendation {
  type: GraphType;
  confidence: number;
  reason: string;
  description: string;
}

export const analyzeDataStructure = (labels: string[], datasets: Array<{ data: number[] }>): {
  dataCount: number;
  datasetCount: number;
  valueRange: { min: number; max: number };
  hasNegative: boolean;
  isTimeSeries: boolean;
  isPercentage: boolean;
  totalSum: number;
} => {
  const dataCount = labels.length;
  const datasetCount = datasets.length;

  const allValues = datasets.flatMap(d => d.data);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const hasNegative = min < 0;
  const totalSum = allValues.reduce((sum, val) => sum + val, 0);

  // Check if data might be percentages (values between 0-100)
  const isPercentage = max <= 100 && min >= 0;

  // Simple time series detection (labels look like dates/months)
  const timePatterns = [/^\d{4}$/, /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i, /^(Q[1-4])/i];
  const isTimeSeries = timePatterns.some(pattern =>
    labels.some(label => pattern.test(label))
  );

  return {
    dataCount,
    datasetCount,
    valueRange: { min, max },
    hasNegative,
    isTimeSeries,
    isPercentage,
    totalSum
  };
};

export const getChartRecommendations = (
  labels: string[],
  datasets: Array<{ data: number[] }>
): ChartRecommendation[] => {
  const analysis = analyzeDataStructure(labels, datasets);
  const recommendations: ChartRecommendation[] = [];

  // Time series data
  if (analysis.isTimeSeries && analysis.datasetCount <= 3) {
    recommendations.push({
      type: 'line',
      confidence: 0.95,
      reason: 'Time-based data detected',
      description: 'Line charts are perfect for showing trends over time'
    });

    recommendations.push({
      type: 'area',
      confidence: 0.9,
      reason: 'Time-based data with multiple series',
      description: 'Area charts visualize trends and show volume over time'
    });
  }

  // Multiple datasets comparison
  if (analysis.datasetCount > 1 && analysis.datasetCount <= 5) {
    recommendations.push({
      type: 'bar',
      confidence: 0.9,
      reason: 'Multiple datasets for comparison',
      description: 'Bar charts excel at comparing values across categories'
    });
  }

  // Single dataset
  if (analysis.datasetCount === 1) {
    // Check if data might be parts of a whole (close to 100)
    if (analysis.isPercentage || (analysis.totalSum > 95 && analysis.totalSum < 105)) {
      recommendations.push({
        type: 'pie',
        confidence: 0.85,
        reason: 'Data appears to represent parts of a whole',
        description: 'Pie charts show proportions and percentages'
      });

      recommendations.push({
        type: 'doughnut',
        confidence: 0.8,
        reason: 'Modern alternative to pie charts',
        description: 'Doughnut charts are cleaner and often more readable'
      });
    } else {
      recommendations.push({
        type: 'bar',
        confidence: 0.8,
        reason: 'Single dataset distribution',
        description: 'Bar charts clearly show data distribution'
      });
    }
  }

  // Many categories (more than 10)
  if (analysis.dataCount > 10) {
    recommendations.push({
      type: 'line',
      confidence: 0.7,
      reason: 'Many data points benefit from line charts',
      description: 'Line charts handle many points better than bars'
    });
  }

  // Sort by confidence
  recommendations.sort((a, b) => b.confidence - a.confidence);

  return recommendations.slice(0, 3); // Return top 3 recommendations
};

export const getRecommendedColors = (
  chartType: GraphType,
  datasetCount: number
): string[] => {
  // Pre-defined color schemes for different scenarios
  const schemes = {
    business: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    vibrant: ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
    pastel: ['#fce7f3', '#ddd6fe', '#bfdbfe', '#bae6fd', '#a7f3d0'],
    monochrome: ['#374151', '#6b7280', '#9ca3af', '#d1d5db']
  };

  // Choose scheme based on chart type
  let scheme: string[] = [];

  if (chartType === 'pie' || chartType === 'doughnut') {
    scheme = schemes.vibrant;
  } else if (chartType === 'area') {
    scheme = schemes.pastel;
  } else {
    scheme = schemes.business;
  }

  // Return required number of colors
  const colors = [];
  for (let i = 0; i < datasetCount; i++) {
    colors.push(scheme[i % scheme.length]);
  }
  return colors;
};
