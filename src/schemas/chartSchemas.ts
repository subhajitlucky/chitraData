import { z } from 'zod';

export const graphTypeSchema = z.enum(['line', 'bar', 'pie', 'area', 'doughnut']);

export const datasetSchema = z.object({
  label: z.string().trim().min(1, 'Dataset label is required'),
  data: z.array(z.number().finite()).min(1, 'Dataset must have at least one value'),
  color: z.string().trim().min(1, 'Color is required')
});

export const chartConfigSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  labels: z.array(z.string().trim()).min(1, 'At least one label is required'),
  datasets: z.array(datasetSchema).min(1, 'At least one dataset is required'),
  chartType: graphTypeSchema
});

export type ChartConfigInput = z.infer<typeof chartConfigSchema>;
export type DatasetInput = z.infer<typeof datasetSchema>;

