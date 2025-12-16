import type { LayoutId, PaddingPreset, ResolutionPreset } from './types';

// Current Indian States and Union Territories (36 entities as per 2024)
// Includes Ladakh as separate UT (post-2019) and Telangana (post-2014)
export const INDIAN_STATES = [
  // States (28)
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union Territories (8)
  'Andaman & Nicobar', 'Chandigarh', 'Delhi',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

// Map GeoJSON names to standard names
export const NAME_MAPPING: Record<string, string> = {
  'Andaman & Nicobar': 'Andaman & Nicobar',
  'Andaman and Nicobar': 'Andaman & Nicobar',
  'Andhra Pradesh': 'Andhra Pradesh',
  'Arunachal Pradesh': 'Arunachal Pradesh',
  'Assam': 'Assam',
  'Bihar': 'Bihar',
  'Chandigarh': 'Chandigarh',
  'Chhattisgarh': 'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu': 'Dadra and Nagar Haveli and Daman and Diu',
  'Dadra and Nagar Haveli': 'Dadra and Nagar Haveli and Daman and Diu',
  'Daman and Diu': 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi': 'Delhi',
  'Goa': 'Goa',
  'Gujarat': 'Gujarat',
  'Haryana': 'Haryana',
  'Himachal Pradesh': 'Himachal Pradesh',
  'Jammu & Kashmir': 'Jammu & Kashmir',
  'Jammu and Kashmir': 'Jammu & Kashmir',
  'Jharkhand': 'Jharkhand',
  'Karnataka': 'Karnataka',
  'Kerala': 'Kerala',
  'Ladakh': 'Ladakh',
  'Lakshadweep': 'Lakshadweep',
  'Madhya Pradesh': 'Madhya Pradesh',
  'Maharashtra': 'Maharashtra',
  'Manipur': 'Manipur',
  'Meghalaya': 'Meghalaya',
  'Mizoram': 'Mizoram',
  'Nagaland': 'Nagaland',
  'Orissa': 'Odisha',
  'Odisha': 'Odisha',
  'Puducherry': 'Puducherry',
  'Punjab': 'Punjab',
  'Rajasthan': 'Rajasthan',
  'Sikkim': 'Sikkim',
  'Tamil Nadu': 'Tamil Nadu',
  'Telangana': 'Telangana',
  'Tripura': 'Tripura',
  'Uttar Pradesh': 'Uttar Pradesh',
  'Uttaranchal': 'Uttarakhand',
  'Uttarakhand': 'Uttarakhand',
  'West Bengal': 'West Bengal'
};

export const STATE_INFO: Record<string, { capital: string; region: string }> = {
  'Andhra Pradesh': { capital: 'Amaravati', region: 'South' },
  'Arunachal Pradesh': { capital: 'Itanagar', region: 'Northeast' },
  'Assam': { capital: 'Dispur', region: 'Northeast' },
  'Bihar': { capital: 'Patna', region: 'East' },
  'Chhattisgarh': { capital: 'Raipur', region: 'Central' },
  'Goa': { capital: 'Panaji', region: 'West' },
  'Gujarat': { capital: 'Gandhinagar', region: 'West' },
  'Haryana': { capital: 'Chandigarh', region: 'North' },
  'Himachal Pradesh': { capital: 'Shimla', region: 'North' },
  'Jharkhand': { capital: 'Ranchi', region: 'East' },
  'Karnataka': { capital: 'Bengaluru', region: 'South' },
  'Kerala': { capital: 'Thiruvananthapuram', region: 'South' },
  'Madhya Pradesh': { capital: 'Bhopal', region: 'Central' },
  'Maharashtra': { capital: 'Mumbai', region: 'West' },
  'Manipur': { capital: 'Imphal', region: 'Northeast' },
  'Meghalaya': { capital: 'Shillong', region: 'Northeast' },
  'Mizoram': { capital: 'Aizawl', region: 'Northeast' },
  'Nagaland': { capital: 'Kohima', region: 'Northeast' },
  'Odisha': { capital: 'Bhubaneswar', region: 'East' },
  'Punjab': { capital: 'Chandigarh', region: 'North' },
  'Rajasthan': { capital: 'Jaipur', region: 'West' },
  'Sikkim': { capital: 'Gangtok', region: 'Northeast' },
  'Tamil Nadu': { capital: 'Chennai', region: 'South' },
  'Telangana': { capital: 'Hyderabad', region: 'South' },
  'Tripura': { capital: 'Agartala', region: 'Northeast' },
  'Uttar Pradesh': { capital: 'Lucknow', region: 'North' },
  'Uttarakhand': { capital: 'Dehradun (Winter), Gairsain (Summer)', region: 'North' },
  'West Bengal': { capital: 'Kolkata', region: 'East' },
  'Andaman & Nicobar': { capital: 'Port Blair', region: 'Islands' },
  'Chandigarh': { capital: 'Chandigarh', region: 'North' },
  'Delhi': { capital: 'New Delhi', region: 'North' },
  'Dadra and Nagar Haveli and Daman and Diu': { capital: 'Daman', region: 'West' },
  'Jammu & Kashmir': { capital: 'Srinagar (Summer), Jammu (Winter)', region: 'North' },
  'Ladakh': { capital: 'Leh', region: 'North' },
  'Lakshadweep': { capital: 'Kavaratti', region: 'Islands' },
  'Puducherry': { capital: 'Puducherry', region: 'South' }
};

export const CATEGORY_COLORS = [
  '#2563eb',
  '#16a34a',
  '#f97316',
  '#a855f7',
  '#ef4444',
  '#0ea5e9',
  '#f59e0b',
  '#10b981',
  '#f472b6',
  '#6366f1',
  '#fb7185',
  '#14b8a6',
  '#dc2626',
  '#22c55e',
  '#facc15',
  '#7c3aed',
  '#9333ea',
  '#1d4ed8'
];

export type StateLabelConfig = {
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
  fontSize?: number;
  connectorOffset?: { x: number; y: number } | null;
};

export const STATE_LABEL_OFFSETS: Record<string, StateLabelConfig> = {
  'Delhi': { x: 20, y: -10, anchor: 'start', fontSize: 12 },
  'Chandigarh': { x: 120, y: -50, anchor: 'middle', fontSize: 12, connectorOffset: { x: 30, y: 0 } },
  'Goa': { x: -52, y: 8, anchor: 'end', fontSize: 12 },
  'Sikkim': { x: 40, y: -10, anchor: 'middle', fontSize: 12, connectorOffset: {x: 10, y:0} },
  'Tripura': { x: -40, y: 40, anchor: 'start', fontSize: 11 },
  'Manipur': { x: 10, y: 52, anchor: 'start', fontSize: 11, connectorOffset: {x: 30, y:0} },
  'Mizoram': { x: 10, y: 70, anchor: 'start', fontSize: 11, connectorOffset: {x: 30, y:0} },
  'Nagaland': { x: 60, y: 0, anchor: 'middle', fontSize: 12, connectorOffset: {x: 40, y:0} },
  'Meghalaya': { x: -40, y: 30, anchor: 'start', fontSize: 11 },
  'Assam': { x: 1, y: -1, anchor: 'start', fontSize: 12, connectorOffset: {x: 0, y:0} },
  'Puducherry': { x: 60, y: 24, anchor: 'start', fontSize: 12, connectorOffset: {x: 40, y:0} },
  'Dadra and Nagar Haveli and Daman and Diu': { x: -74, y: 0, anchor: 'end', fontSize: 12, connectorOffset: {x: -180, y:0} },
  'Lakshadweep': { x: -30, y: 38, anchor: 'end', fontSize: 12, connectorOffset: {x: -40, y:0} },
  'Andaman & Nicobar': { x: 10, y: 0, anchor: 'start', fontSize: 12, connectorOffset: {x: 40, y:0} },
  'Jharkhand': { x: -10, y: 0, anchor: 'middle', fontSize: 12 },
  'West Bengal': { x: -25, y: 20, anchor: 'start', fontSize: 12 },
  'Kerala': { x: -50, y: 20, anchor: 'start', fontSize: 12, connectorOffset: {x: 5, y:0} },
  'Arunachal Pradesh': { x: -25, y: -65, anchor: 'middle', fontSize: 12, connectorOffset: {x: 0, y:0} },
  'Andhra Pradesh': { x: -50, y: 20, anchor: 'start', fontSize: 12, connectorOffset: {x: 0, y:0} },
  'Karnataka': { x: -15, y: 20, anchor: 'middle', fontSize: 12, connectorOffset: {x: 0, y:0} },
};

export const TITLE_CONSTANTS = {
  BOX_MARGIN_TOP: 16,
  MIN_WIDTH: 320,
  MAX_WIDTH: 420,
  HORIZONTAL_PADDING: 12,
  VERTICAL_PADDING: 10,
  MAX_LINES: 4,
  FONT_SIZE: 26,
  LINE_HEIGHT: 1.25
};

export const DEFAULT_TITLE_HEIGHT =
  TITLE_CONSTANTS.VERTICAL_PADDING * 2 + TITLE_CONSTANTS.FONT_SIZE * TITLE_CONSTANTS.LINE_HEIGHT;

export const MAP_BOTTOM_MARGIN_BASE = 80;

export const LAYOUT_CONFIGS: Record<LayoutId, {
  id: LayoutId;
  label: string;
  description: string;
  viewBox: { width: number; height: number };
  margins: { top: number; right: number; bottom: number; left: number };
  titleAnchorOffset: { x: number; y: number };
  aspectLabel: string;
}> = {
  widescreen: {
    id: 'widescreen',
    label: 'Widescreen',
    description: '16:9 • slides, dashboards, displays',
    viewBox: { width: 1365, height: 768 },
    margins: { top: 36, right: 60, bottom: 96, left: 60 },
    titleAnchorOffset: { x: 32, y: 18 },
    aspectLabel: '16:9'
  },
  print43: {
    id: 'print43',
    label: 'Print-friendly',
    description: '4:3 • reports, posters, PDF',
    viewBox: { width: 1200, height: 900 },
    margins: { top: 32, right: 44, bottom: 100, left: 44 },
    titleAnchorOffset: { x: 28, y: 22 },
    aspectLabel: '4:3'
  }
};

export const PADDING_PRESETS: Record<PaddingPreset, { label: string; description: string; scale: number }> = {
  tight: { label: 'Tight', description: 'Maximise map area', scale: 0.75 },
  balanced: { label: 'Balanced', description: 'Default margins', scale: 1 },
  roomy: { label: 'Roomy', description: 'Extra breathing space', scale: 1.25 }
};

export const RESOLUTION_PRESETS: Record<ResolutionPreset, { label: string; description: string; longEdge: number }> = {
  '2k': { label: '2K', description: 'Slides & dashboards', longEdge: 2560 },
  '4k': { label: '4K', description: 'HD presentations & print', longEdge: 3840 },
  '8k': { label: '8K', description: 'Poster & large-format', longEdge: 7680 }
};

export const RESOLUTION_BUTTON_STYLES = {
  '2k': { base: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20', text: 'text-blue-100' },
  '4k': { base: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20', text: 'text-purple-100' },
  '8k': { base: 'bg-pink-600 hover:bg-pink-700 shadow-pink-600/20', text: 'text-pink-100' }
};

