export interface ChartDataset {
    label: string;
    data: string;
    color: string;
}

export interface ChartData {
    title: string;
    labels: string[];
    datasets: ChartDataset[];
    chartType: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'doughnut';
}

export interface ChartProps {
    data: ChartData;
}
