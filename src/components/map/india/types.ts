export type LayoutId = 'widescreen' | 'print43';

export type ColorScheme =
  | 'sequential'
  | 'diverging'
  | 'viridis'
  | 'plasma'
  | 'turbo'
  | 'grayscale';

export interface StateData {
  state: string;
  rawValue: string;
  numericValue: number | null;
  pathId: string;
}

export interface LayoutOption {
  id: LayoutId;
  label: string;
  description: string;
  viewBox: { width: number; height: number };
  margins: { top: number; right: number; bottom: number; left: number };
  titleAnchorOffset: { x: number; y: number };
  aspectLabel: string;
}

export interface TitleLayoutMetrics {
  width: number;
  height: number;
  fontSize: number;
  lineCount: number;
}

export interface LabelMeta {
  stateName: string;
  labelPosition: { x: number; y: number };
  centroid: [number, number];
  anchor: 'start' | 'middle' | 'end';
  fontSize: number;
  labelHalfWidth: number;
  labelHalfHeight: number;
  connectorOffset: { x: number; y: number };
  hasConnector: boolean;
}

export interface LegendTick {
  label: string;
  position: number;
}

export type ResolutionPreset = '2k' | '4k' | '8k';

export type PaddingPreset = 'tight' | 'balanced' | 'roomy';

