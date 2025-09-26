export type GraphType = 'line' | 'bar' | 'pie' | 'area' | 'doughnut';

export interface GraphDataset {
  label: string;
  data: number[];
  color?: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface GraphData {
  id: string;
  title: string;
  type: GraphType;
  labels: string[];
  datasets: GraphDataset[];
  options?: Record<string, unknown>;
  createdAt: string;
}

export interface GraphConfig {
  title: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: string;
    color: string;
  }>;
  chartType: GraphType;
}