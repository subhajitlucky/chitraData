import type { ChartConfigInput } from '../schemas/chartSchemas';
import { hexToRgb, relativeLuminance, contrastRatio } from './colorUtils';

export type IssueSeverity = 'info' | 'warn' | 'error';

export interface ChartIssue {
  id: string;
  severity: IssueSeverity;
  message: string;
  suggestion?: string;
}

const hasNegativeValues = (config: ChartConfigInput): boolean => {
  return config.datasets.some((ds) => ds.data.some((v) => v < 0));
};

const maxSliceCount = 8;
const maxLabelsBeforeDensityWarn = 20;
const maxDatasetsBeforeClutter = 5;
const genericDatasetNames = ['dataset', 'series', 'data', 'value'];

export const getChartIssues = (config: ChartConfigInput): ChartIssue[] => {
  const issues: ChartIssue[] = [];

  if (!config.labels.length || !config.datasets.length) {
    issues.push({
      id: 'empty-data',
      severity: 'error',
      message: 'Add at least one label and one dataset to render a chart.',
      suggestion: 'Load a sample or paste data to get started quickly.'
    });
    return issues;
  }

  if (config.chartType === 'pie' || config.chartType === 'doughnut') {
    if (config.labels.length > maxSliceCount) {
      issues.push({
        id: 'pie-slice-count',
        severity: 'warn',
        message: `Too many slices (${config.labels.length}). Readability drops past ${maxSliceCount}.`,
        suggestion: 'Group long tails into “Other” or switch to bar/line.'
      });
    }
    if (hasNegativeValues(config)) {
      issues.push({
        id: 'pie-negative',
        severity: 'warn',
        message: 'Negative values do not render well in pie/doughnut charts.',
        suggestion: 'Use bar/line or remove negative entries.'
      });
    }
  }

  if (config.labels.length > maxLabelsBeforeDensityWarn) {
    issues.push({
      id: 'label-density',
      severity: 'info',
      message: `High label count (${config.labels.length}) may crowd the axis.`,
      suggestion: 'Consider trimming labels, aggregating, or switching to line with fewer ticks.'
    });
  }

  if (config.chartType === 'bar' && config.datasets.length > maxDatasetsBeforeClutter) {
    issues.push({
      id: 'dataset-clutter',
      severity: 'info',
      message: `Bar charts with ${config.datasets.length} datasets can be hard to read.`,
      suggestion: 'Try line/area for many series or reduce series count.'
    });
  }

  const zeroOnly = config.datasets.every((ds) => ds.data.every((v) => v === 0));
  if (zeroOnly) {
    issues.push({
      id: 'all-zero',
      severity: 'warn',
      message: 'All data points are zero, so comparisons will be unclear.',
      suggestion: 'Check your input values or choose a different sample.'
    });
  }

  if (!config.title || config.title.trim().length < 3) {
    issues.push({
      id: 'missing-title',
      severity: 'info',
      message: 'Add a descriptive title so exports and gallery cards are clear.',
      suggestion: 'E.g., “Monthly Revenue (USD)” or “Engagement Rate by Channel”.'
    });
  }

  const hasGenericDatasetNames = config.datasets.some((ds) =>
    genericDatasetNames.some((g) => ds.label?.toLowerCase().trim().startsWith(g))
  );
  if (hasGenericDatasetNames) {
    issues.push({
      id: 'generic-series-names',
      severity: 'info',
      message: 'Rename series to something meaningful.',
      suggestion: 'Use names like “North”, “South”, “Target”, “Actual”.'
    });
  }

  const valueRange = (() => {
    const values = config.datasets.flatMap((ds) => ds.data);
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  })();

  const maybeNeedsUnits =
    !/\(|%|usd|inr|\$|€|£/i.test(config.title) && (valueRange.max > 100 || valueRange.min < -100);
  if (maybeNeedsUnits) {
    issues.push({
      id: 'missing-units',
      severity: 'info',
      message: 'Consider adding units to the title or labels.',
      suggestion: 'E.g., “Revenue (USD)”, “Engagement (%)”, or “Load Time (ms)”.'
    });
  }

  const whiteLum = relativeLuminance({ r: 255, g: 255, b: 255 });
  const darkLum = relativeLuminance({ r: 17, g: 24, b: 39 }); // near text-gray-900
  const lowContrast = config.datasets.some((ds) => {
    const rgb = hexToRgb(ds.color);
    if (!rgb) return false;
    const lum = relativeLuminance(rgb);
    const ratioLight = contrastRatio(lum, whiteLum);
    const ratioDark = contrastRatio(lum, darkLum);
    return Math.max(ratioLight, ratioDark) < 3; // WCAG minimum for non-text-like strokes
  });

  if (lowContrast) {
    issues.push({
      id: 'low-contrast',
      severity: 'warn',
      message: 'Some series colors may be too light for light/dark backgrounds.',
      suggestion: 'Choose a darker palette (e.g., colorblind-safe) or deepen the colors.'
    });
  }

  return issues;
};

