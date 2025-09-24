export type GraphType = 'line' | 'bar' | 'pie' | 'area' | 'scatter';

export interface GraphData {
  id: string;
  title: string;
  type: GraphType;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
  options?: any;
  createdAt: Date;
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