import { useState, useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { FiDownload, FiSave, FiRotateCcw, FiInfo, FiSliders, FiMap } from 'react-icons/fi';

interface StateData {
  state: string;
  rawValue: string;
  numericValue: number | null;
  pathId: string;
}

// Current Indian States and Union Territories (36 entities as per 2024)
// Includes Ladakh as separate UT (post-2019) and Telangana (post-2014)
const INDIAN_STATES = [
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
const NAME_MAPPING: Record<string, string> = {
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

const STATE_INFO: Record<string, { capital: string; region: string }> = {
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

const CATEGORY_COLORS = [
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

type StateLabelConfig = {
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
  fontSize?: number;
  connectorOffset?: { x: number; y: number } | null;
};

const STATE_LABEL_OFFSETS: Record<string, StateLabelConfig> = {
  'Delhi': { x: 20, y: -10, anchor: 'start', fontSize: 12 },
  'Chandigarh': { x: 0, y: -6, anchor: 'start', fontSize: 12 },
  'Goa': { x: -52, y: 8, anchor: 'end', fontSize: 12 },
  'Sikkim': { x: 40, y: -10, anchor: 'middle', fontSize: 12, connectorOffset: {x: 10, y:0} },
  'Tripura': { x: -40, y: 40, anchor: 'start', fontSize: 11 },
  'Manipur': { x: 10, y: 52, anchor: 'start', fontSize: 11 },
  'Mizoram': { x: 10, y: 70, anchor: 'start', fontSize: 11 },
  'Nagaland': { x: 60, y: 0, anchor: 'middle', fontSize: 12, connectorOffset: {x: 30, y:0} },
  'Meghalaya': { x: -30, y: 30, anchor: 'start', fontSize: 11 },
  'Assam': { x: 1, y: -1, anchor: 'start', fontSize: 12 },
  'Puducherry': { x: 60, y: 24, anchor: 'start', fontSize: 12, connectorOffset: {x: 40, y:0} },
  'Dadra and Nagar Haveli and Daman and Diu': { x: -74, y: 0, anchor: 'end', fontSize: 12, connectorOffset: {x: -180, y:0} },
  'Lakshadweep': { x: -30, y: 38, anchor: 'end', fontSize: 12, connectorOffset: {x: -40, y:0} },
  'Andaman & Nicobar': { x: 10, y: 0, anchor: 'start', fontSize: 12, connectorOffset: {x: 40, y:0} },
  'Jharkhand': { x: -25, y: 0, anchor: 'start', fontSize: 12 },
  'West Bengal': { x: -10, y: 20, anchor: 'start', fontSize: 12 },
  'Kerala': { x: -50, y: 20, anchor: 'start', fontSize: 12, connectorOffset: {x: 5, y:0} },
  'Arunachal Pradesh': { x: -25, y: -65, anchor: 'middle', fontSize: 12 }
};

interface LabelMeta {
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

const getFeatureStateName = (feature: any): string => {
  const geoName = feature?.properties?.ST_NM || feature?.properties?.NAME_1 || feature?.properties?.name || '';
  return NAME_MAPPING[geoName] || geoName;
};

const getLabelFontSize = (stateName: string): number => {
  const config = STATE_LABEL_OFFSETS[stateName];
  if (config?.fontSize) return config.fontSize;
  if (stateName.length > 16) return 11;
  if (stateName.length > 14) return 12;
  if (stateName.length > 12) return 13;
  return 14;
};

const computeAutoConnectorOffset = (
  labelX: number,
  labelY: number,
  centroid: [number, number],
  labelHalfWidth: number,
  labelHalfHeight: number
) => {
  const dx = centroid[0] - labelX;
  const dy = centroid[1] - labelY;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;
  const normX = dx / distance;
  const normY = dy / distance;

  return {
    x: normX * labelHalfWidth,
    y: normY * labelHalfHeight
  };
};

const getValueLineOffset = (meta: LabelMeta) => Math.max(meta.fontSize * 0.9, 10);

const getValueFontSize = (meta: LabelMeta, stateData?: StateData) => {
  const numericBase = Math.max(meta.fontSize - 4, 10);
  if (!stateData) return numericBase;
  if (stateData.numericValue !== null && Number.isFinite(stateData.numericValue)) {
    return numericBase;
  }
  return Math.max(meta.fontSize - 2, numericBase + 2);
};

const parseNumericValue = (input: string): number | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(/,/g, '');
  if (!/^[-+]?(\\d+\\.?\\d*|\\.\\d+)$/.test(normalized)) {
    return null;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const MAP_BASE_WIDTH = 1000;
const MAP_BASE_HEIGHT = 1100;

const IndiaMapPageClean = () => {
  const [mapData, setMapData] = useState<StateData[]>(
    INDIAN_STATES.map(state => ({
      state,
      rawValue: '',
      numericValue: null,
      pathId: state.toLowerCase().replace(/\s+/g, '-')
    }))
  );
  const [colorScheme, setColorScheme] = useState<'sequential' | 'diverging' | 'viridis' | 'plasma' | 'turbo' | 'grayscale'>('sequential');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [mapTitle, setMapTitle] = useState('Map Visualization');
  const [dataSource, setDataSource] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const labelMetaRef = useRef<LabelMeta[]>([]);

  const handleValueChange = (stateName: string, value: string) => {
    const numericValue = parseNumericValue(value);
    setMapData(prev =>
      prev.map(d =>
        d.state === stateName
          ? {
              ...d,
              rawValue: value,
              numericValue
            }
          : d
      )
    );
  };

  const generateColor = (value: number, maxValue: number) => {
    if (maxValue === 0) return '#e5e7eb';
    const intensity = value / maxValue;

    switch (colorScheme) {
      case 'sequential':
        // Blue gradient (classic choropleth)
        return `rgb(${Math.round(59 + 196 * intensity)}, ${Math.round(130 + 50 * intensity)}, ${Math.round(246 - 146 * intensity)})`;
      
      case 'diverging':
        // Red to Blue (diverging scale for showing positive/negative or extremes)
        return intensity > 0.5
          ? `rgb(${Math.round(59 + 196 * (intensity - 0.5) * 2)}, ${Math.round(130 + 50 * (1 - (intensity - 0.5) * 2))}, ${Math.round(246 - 146 * (1 - (intensity - 0.5) * 2))})`
          : `rgb(${Math.round(239)}, ${Math.round(68 - 68 * intensity)}, ${Math.round(100 + 146 * intensity)})`;
      
      case 'viridis':
        // Viridis - Professional colorblind-friendly gradient (Purple to Yellow-Green)
        // Widely used in scientific visualization
        const viridisColors = [
          [68, 1, 84],      // Dark purple
          [59, 82, 139],    // Blue-purple
          [33, 145, 140],   // Teal
          [94, 201, 98],    // Green
          [253, 231, 37]    // Yellow
        ];
        const vIdx = Math.min(Math.floor(intensity * 4), 3);
        const vFrac = (intensity * 4) - vIdx;
        const vC1 = viridisColors[vIdx];
        const vC2 = viridisColors[vIdx + 1];
        return `rgb(${Math.round(vC1[0] + (vC2[0] - vC1[0]) * vFrac)}, ${Math.round(vC1[1] + (vC2[1] - vC1[1]) * vFrac)}, ${Math.round(vC1[2] + (vC2[2] - vC1[2]) * vFrac)})`;
      
      case 'plasma':
        // Plasma - Another professional colorblind-friendly gradient (Purple to Pink to Yellow)
        // Popular in data science and machine learning visualizations
        const plasmaColors = [
          [13, 8, 135],     // Dark purple
          [126, 3, 168],    // Purple
          [204, 71, 120],   // Pink
          [248, 149, 64],   // Orange
          [240, 249, 33]    // Yellow
        ];
        const pIdx = Math.min(Math.floor(intensity * 4), 3);
        const pFrac = (intensity * 4) - pIdx;
        const pC1 = plasmaColors[pIdx];
        const pC2 = plasmaColors[pIdx + 1];
        return `rgb(${Math.round(pC1[0] + (pC2[0] - pC1[0]) * pFrac)}, ${Math.round(pC1[1] + (pC2[1] - pC1[1]) * pFrac)}, ${Math.round(pC1[2] + (pC2[2] - pC1[2]) * pFrac)})`;
      
      case 'turbo':
        // Turbo - Google's rainbow gradient (Blue to Cyan to Green to Yellow to Red)
        // Designed to replace jet colormap with better perceptual uniformity
        const turboColors = [
          [48, 18, 59],     // Dark blue
          [33, 102, 172],   // Blue
          [68, 191, 193],   // Cyan
          [144, 215, 67],   // Green
          [253, 231, 37],   // Yellow
          [234, 51, 35]     // Red
        ];
        const tIdx = Math.min(Math.floor(intensity * 5), 4);
        const tFrac = (intensity * 5) - tIdx;
        const tC1 = turboColors[tIdx];
        const tC2 = turboColors[tIdx + 1];
        return `rgb(${Math.round(tC1[0] + (tC2[0] - tC1[0]) * tFrac)}, ${Math.round(tC1[1] + (tC2[1] - tC1[1]) * tFrac)}, ${Math.round(tC1[2] + (tC2[2] - tC1[2]) * tFrac)})`;
      
      case 'grayscale':
        // Grayscale - Professional black to white gradient
        // Perfect for printing and formal documents
        const gray = Math.round(255 * intensity);
        return `rgb(${gray}, ${gray}, ${gray})`;
      
      default:
        return '#e5e7eb';
    }
  };

  const numericValues = useMemo(
    () =>
      mapData
        .map(d => d.numericValue)
        .filter((value): value is number => value !== null && Number.isFinite(value)),
    [mapData]
  );

  const maxNumericValue = Math.max(0, ...numericValues);
  const hasNumericValues = numericValues.length > 0;

  const categoryLegendItems = useMemo(() => {
    const categoryMap = new Map<string, string>();
    mapData.forEach(item => {
      if (item.numericValue === null) {
        const trimmed = item.rawValue.trim();
        if (trimmed) {
          const key = trimmed.toLowerCase();
          if (!categoryMap.has(key)) {
            categoryMap.set(key, trimmed);
          }
        }
      }
    });
    return Array.from(categoryMap.entries()).map(([key, label]) => ({ key, label }));
  }, [mapData]);

  const categoryColorLookup = useMemo(() => {
    const lookup = new Map<string, string>();
    categoryLegendItems.forEach((item, index) => {
      lookup.set(item.key, CATEGORY_COLORS[index % CATEGORY_COLORS.length]);
    });
    return lookup;
  }, [categoryLegendItems]);

  const hasCategoricalValues = categoryLegendItems.length > 0;

  const getStateFillColor = (stateData: StateData) => {
    if (stateData.numericValue !== null && Number.isFinite(stateData.numericValue)) {
      return generateColor(stateData.numericValue, maxNumericValue);
    }
    const trimmed = stateData.rawValue.trim();
    if (!trimmed) {
      return '#e5e7eb';
    }
    const color = categoryColorLookup.get(trimmed.toLowerCase());
    return color ?? '#9ca3af';
  };

  const handleSave = () => {
    try {
      const savedMaps = JSON.parse(localStorage.getItem('chitradata_maps') || '[]');
      const newMap = {
        id: Date.now().toString(),
        data: mapData,
        title: mapTitle,
        source: dataSource,
        colorScheme: colorScheme,
        createdAt: new Date().toISOString()
      };
      savedMaps.push(newMap);
      localStorage.setItem('chitradata_maps', JSON.stringify(savedMaps));
      setSaveStatus('Map saved successfully!');
    } catch (error) {
      setSaveStatus('Failed to save map');
    }
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleReset = () => {
    setMapData(INDIAN_STATES.map(state => ({
      state,
      rawValue: '',
      numericValue: null,
      pathId: state.toLowerCase().replace(/\s+/g, '-')
    })));
    setSaveStatus('Map reset');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const generateRandomData = () => {
    setMapData(prev =>
      prev.map(d => {
        const randomValue = Math.round(Math.random() * 1000);
        return {
          ...d,
          numericValue: randomValue,
          rawValue: randomValue.toString()
        };
      })
    );
    setSaveStatus('Random data generated');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleExport = async (resolution: '2k' | '4k' | '8k') => {
    if (!svgRef.current) return;

    try {
      // Resolution settings
      const resolutions = {
        '2k': { width: 2560, height: 1440, label: '2K (2560×1440)' },
        '4k': { width: 3840, height: 2160, label: '4K (3840×2160)' },
        '8k': { width: 7680, height: 4320, label: '8K (7680×4320)' }
      };

      const { width, height, label } = resolutions[resolution];
      
      setSaveStatus(`Exporting ${label}...`);

      // Clone SVG and scale it
      const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;
      svgClone.setAttribute('width', width.toString());
      svgClone.setAttribute('height', height.toString());
      svgClone.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      const exportScale = width / MAP_BASE_WIDTH;

      const scaleNumericString = (value: string, factor: number) => {
        const match = value.match(/(-?\\d*\\.?\\d+)([a-z%]*)/i);
        if (!match) {
          return value;
        }
        const [, numberPart, unit] = match;
        const parsed = parseFloat(numberPart);
        if (!Number.isFinite(parsed)) {
          return value;
        }
        const scaledNumber = parseFloat((parsed * factor).toFixed(2));
        return `${scaledNumber}${unit}`;
      };

      const scaleStyleProperty = (selector: string, property: string, factor: number) => {
        svgClone.querySelectorAll<SVGElement>(selector).forEach((element) => {
          const current = element.style.getPropertyValue(property);
          if (current) {
            element.style.setProperty(property, scaleNumericString(current, factor));
          }
        });
      };

      const scaleAttribute = (selector: string, attribute: string, factor: number) => {
        svgClone.querySelectorAll<SVGElement>(selector).forEach((element) => {
          const current = element.getAttribute(attribute);
          if (current) {
            element.setAttribute(attribute, scaleNumericString(current, factor));
          }
        });
      };

      scaleAttribute('[data-export-role=\"map-title\"]', 'font-size', exportScale);
      scaleAttribute('[data-export-role=\"map-source\"]', 'font-size', exportScale);
      scaleStyleProperty('[data-export-role=\"state-label-name\"]', 'font-size', exportScale);
      scaleStyleProperty('[data-export-role=\"state-label-value\"]', 'font-size', exportScale);
      scaleStyleProperty('[data-export-role=\"state-connector\"]', 'stroke-width', exportScale);
      scaleAttribute('[data-export-role=\"state-path\"]', 'stroke-width', exportScale);

      
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: false });
      const img = new Image();

      canvas.width = width;
      canvas.height = height;

      img.onload = () => {
        if (ctx) {
          // White background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Draw the image
          const marginX = Math.round(width * 0.045);
          const marginY = Math.round(height * 0.05);
          ctx.drawImage(img, marginX, marginY, width - marginX * 2, height - marginY * 2);
        }

        // Export as PNG with maximum quality
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement('a');
            link.download = `india-map-${resolution}-${Date.now()}.png`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            setSaveStatus(`Map exported as ${label}!`);
            setShowExportDialog(false);
          }
        }, 'image/png', 1.0);
      };

      img.onerror = () => {
        setSaveStatus('Export failed');
        setTimeout(() => setSaveStatus(null), 3000);
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error('Export error:', error);
      setSaveStatus('Export failed');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Color scale legend generation
  const generateColorScaleLegend = () => {
    if (!hasNumericValues) {
      return [];
    }

    if (maxNumericValue === 0) {
      return [
        { min: 0, max: 0, color: '#e5e7eb', label: '0' }
      ];
    }

    const ranges = [
      { min: 0, max: maxNumericValue * 0.1, color: generateColor(maxNumericValue * 0.05, maxNumericValue), label: `0-${Math.round(maxNumericValue * 0.1)}` },
      { min: maxNumericValue * 0.1, max: maxNumericValue * 0.3, color: generateColor(maxNumericValue * 0.2, maxNumericValue), label: `${Math.round(maxNumericValue * 0.1)}-${Math.round(maxNumericValue * 0.3)}` },
      { min: maxNumericValue * 0.3, max: maxNumericValue * 0.5, color: generateColor(maxNumericValue * 0.4, maxNumericValue), label: `${Math.round(maxNumericValue * 0.3)}-${Math.round(maxNumericValue * 0.5)}` },
      { min: maxNumericValue * 0.5, max: maxNumericValue * 0.7, color: generateColor(maxNumericValue * 0.6, maxNumericValue), label: `${Math.round(maxNumericValue * 0.5)}-${Math.round(maxNumericValue * 0.7)}` },
      { min: maxNumericValue * 0.7, max: maxNumericValue, color: generateColor(maxNumericValue * 0.85, maxNumericValue), label: `${Math.round(maxNumericValue * 0.7)}-${maxNumericValue}` }
    ];

    return ranges;
  };

  const colorScaleRanges = generateColorScaleLegend();
  const legendGradientStops =
    colorScaleRanges.length > 1
      ? colorScaleRanges
          .map((range, index) => {
            const position =
              colorScaleRanges.length === 1
                ? 0
                : (index / (colorScaleRanges.length - 1)) * 100;
            return `${range.color} ${position}%`;
          })
          .join(', ')
      : `${colorScaleRanges[0]?.color ?? '#e5e7eb'} 0%`;
  const legendTickPositions = colorScaleRanges.map((range, index) => ({
    label: range.label,
    position:
      colorScaleRanges.length === 1
        ? 0
        : (index / (colorScaleRanges.length - 1)) * 100
  }));

  // Load and render map with D3
  useEffect(() => {
    const loadMap = async () => {
      try {
        // Load the official India map with all 36 states/UTs (including Ladakh and Telangana)
        const geoData = await d3.json('/india-govt-map.geojson') as any;
        
        if (!geoData || !geoData.features) {
          console.error('Failed to load map data');
          return;
        }

        console.log('India map loaded:', geoData.features.length, 'regions');

        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = MAP_BASE_WIDTH;
        const height = MAP_BASE_HEIGHT; // Increased height to accommodate title and source

        svg.attr('viewBox', `0 0 ${width} ${height}`);

        // Add title at the top-right
        svg.append('text')
          .attr('class', 'map-title')
          .attr('data-export-role', 'map-title')
          .attr('x', width - 150)
          .attr('y', 90)
          .attr('text-anchor', 'end')
          .attr('font-size', '28px')
          .attr('font-weight', 'bold')
          .attr('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
          .attr('fill', '#1f2937')
          .text(mapTitle);

        const projection = d3.geoMercator()
          .fitExtent([[20, 70], [width - 20, height - 80]], geoData); // Adjusted for title and source space

        const path = d3.geoPath().projection(projection);

        const g = svg.append('g');

        const labelMetadata: LabelMeta[] = geoData.features.map((feature: any) => {
          const stateName = getFeatureStateName(feature);
          const centroidRaw = path.centroid(feature as any) as [number, number];
          const centroid: [number, number] =
            centroidRaw && Number.isFinite(centroidRaw[0]) && Number.isFinite(centroidRaw[1])
              ? centroidRaw
              : [0, 0];
          const config = STATE_LABEL_OFFSETS[stateName];
          const labelX = centroid[0] + (config?.x ?? 0);
          const labelY = centroid[1] + (config?.y ?? 0);
          const fontSize = config?.fontSize ?? getLabelFontSize(stateName);
          const labelHalfWidth = (stateName.length * fontSize * 0.6) / 2;
          const labelHalfHeight = fontSize / 2;
          const autoConnectorOffset = computeAutoConnectorOffset(
            labelX,
            labelY,
            centroid,
            labelHalfWidth,
            labelHalfHeight
          );

          let hasConnector = false;
          let connectorOffset = { x: 0, y: 0 };

          if (config) {
            if (config.connectorOffset === null) {
              hasConnector = false;
            } else {
              hasConnector = true;
              const manual = config.connectorOffset;
              connectorOffset = manual
                ? {
                    x: autoConnectorOffset.x + manual.x,
                    y: autoConnectorOffset.y + manual.y
                  }
                : autoConnectorOffset;
            }
          }

          return {
            stateName,
            centroid,
            labelPosition: { x: labelX, y: labelY },
            anchor: config?.anchor ?? 'middle',
            fontSize,
            labelHalfWidth,
            labelHalfHeight,
            connectorOffset,
            hasConnector
          };
        });
        labelMetaRef.current = labelMetadata;

        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'map-tooltip')
          .style('position', 'absolute')
          .style('visibility', 'hidden')
          .style('background-color', 'rgba(0, 0, 0, 0.95)')
          .style('color', 'white')
          .style('padding', '12px 16px')
          .style('border-radius', '8px')
          .style('font-size', '14px')
          .style('pointer-events', 'none')
          .style('z-index', '9999')
          .style('box-shadow', '0 8px 24px rgba(0,0,0,0.5)')
          .style('font-family', 'system-ui, -apple-system, sans-serif')
          .style('line-height', '1.5');

        const currentMapData = mapData;
        const mapDataLookup = new Map(currentMapData.map(item => [item.state, item]));

        // Draw state/UT boundaries
        const paths = g.selectAll<SVGPathElement, any>('.state')
          .data(geoData.features)
          .enter()
          .append('path')
          .attr('d', path as any)
          .attr('fill', (d: any) => {
            const geoName = d.properties?.ST_NM || d.properties?.NAME_1 || d.properties?.name || '';
            const stateName = NAME_MAPPING[geoName] || geoName;
            const stateData = currentMapData.find(s => s.state === stateName);
            return stateData ? getStateFillColor(stateData) : '#e5e7eb';
          })
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .attr('class', 'state')
          .attr('data-export-role', 'state-path')
          .style('cursor', 'pointer')
          .style('transition', 'all 0.3s ease');

        // Connectors for compact states
        g.selectAll<SVGLineElement, LabelMeta>('.state-label-connector')
          .data(labelMetadata.filter(meta => meta.hasConnector))
          .enter()
          .append('line')
          .attr('class', 'state-label-connector')
          .attr('data-export-role', 'state-connector')
          .attr('x1', d => d.labelPosition.x + d.connectorOffset.x)
          .attr('y1', d => d.labelPosition.y + d.connectorOffset.y)
          .attr('x2', d => d.centroid[0])
          .attr('y2', d => d.centroid[1])
          .style('stroke', '#6b7280')
          .style('stroke-width', '1.5px')
          .style('stroke-dasharray', '4,4')
          .style('pointer-events', 'none');

        // Add grouped labels for state names and values
        const labelGroups = g.selectAll<SVGGElement, LabelMeta>('.state-label-group')
          .data(labelMetadata)
          .enter()
          .append('g')
          .attr('class', 'state-label-group')
          .attr('transform', d => `translate(${d.labelPosition.x}, ${d.labelPosition.y})`);

        labelGroups.append('text')
          .attr('class', 'state-label-name state-label')
          .attr('data-export-role', 'state-label-name')
          .attr('text-anchor', d => d.anchor)
          .attr('dominant-baseline', 'middle')
          .style('pointer-events', 'none')
          .style('font-size', d => `${d.fontSize}px`)
          .style('font-weight', '700')
          .style('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
          .style('fill', '#1f2937')
          .style('stroke', '#ffffff')
          .style('stroke-width', '4px')
          .style('paint-order', 'stroke fill')
          .style('letter-spacing', '0.5px')
          .attr('y', d => -(Math.max(d.fontSize * 0.35, 4)))
          .text(d => d.stateName);

        labelGroups.append('text')
          .attr('class', 'state-label-value')
          .attr('data-export-role', 'state-label-value')
          .attr('text-anchor', d => d.anchor)
          .attr('dominant-baseline', 'hanging')
          .style('pointer-events', 'none')
          .style('font-size', d => {
            const entry = mapDataLookup.get(d.stateName);
            return `${getValueFontSize(d, entry)}px`;
          })
          .style('font-weight', '600')
          .style('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
          .style('fill', '#1f2937')
          .style('stroke', '#ffffff')
          .style('stroke-width', '3px')
          .style('paint-order', 'stroke fill')
          .style('letter-spacing', '0.3px')
          .attr('y', d => getValueLineOffset(d))
          .text(d => {
            const entry = mapDataLookup.get(d.stateName);
            if (!entry) {
              return '';
            }
            if (entry.numericValue !== null && Number.isFinite(entry.numericValue)) {
              return entry.numericValue.toLocaleString();
            }
            return entry.rawValue.trim();
          });

        paths

        // Add data source footer at the bottom
        if (dataSource && dataSource.trim()) {
          svg.append('text')
            .attr('class', 'map-source')
            .attr('data-export-role', 'map-source')
            .attr('x', width / 2)
            .attr('y', height - 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
            .attr('fill', '#6b7280')
            .text(`Source: ${dataSource}`);
        }

        setMapLoaded(true);

        return () => {
          tooltip.remove();
        };
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    loadMap();
  }, []);

  // Update colors and labels when data or color scheme changes
  useEffect(() => {
    if (!mapLoaded || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const currentMapData = mapData;
    const mapDataLookup = new Map(currentMapData.map(item => [item.state, item]));

    // Update title
    svg.select('.map-title')
      .text(mapTitle);

    // Update or create source
    const existingSource = svg.select('.map-source');
    if (dataSource && dataSource.trim()) {
      if (existingSource.empty()) {
        svg.append('text')
          .attr('class', 'map-source')
          .attr('data-export-role', 'map-source')
          .attr('x', MAP_BASE_WIDTH / 2)
          .attr('y', MAP_BASE_HEIGHT - 20)
          .attr('text-anchor', 'middle')
          .attr('font-size', '14px')
          .attr('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
          .attr('fill', '#6b7280')
          .text(`Source: ${dataSource}`);
      } else {
        existingSource
          .attr('x', MAP_BASE_WIDTH / 2)
          .attr('y', MAP_BASE_HEIGHT - 20)
          .text(`Source: ${dataSource}`);
      }
    } else {
      existingSource.remove();
    }

    svg.selectAll<SVGGElement, LabelMeta>('.state-label-group')
      .attr('transform', d => `translate(${d.labelPosition.x}, ${d.labelPosition.y})`);

    // Update state colors
    svg.selectAll<SVGPathElement, any>('.state')
      .attr('fill', function(d: any) {
        const geoName = d.properties?.ST_NM || d.properties?.NAME_1 || d.properties?.name || '';
        const stateName = NAME_MAPPING[geoName] || geoName;
        const stateData = currentMapData.find(s => s.state === stateName);
        return stateData ? getStateFillColor(stateData) : '#e5e7eb';
      })
      // Update tooltip handlers to use current data
      .on('mouseover', function(this: SVGPathElement, _: MouseEvent, d: any) {
        d3.select(this)
          .attr('stroke-width', 4)
          .attr('stroke', '#1f2937')
          .style('filter', 'brightness(1.15)');

        const geoName = d.properties?.ST_NM || d.properties?.NAME_1 || d.properties?.name || '';
        const stateName = NAME_MAPPING[geoName] || geoName;
        const stateData = currentMapData.find(s => s.state === stateName);
        const info = STATE_INFO[stateName];

        const tooltip = d3.select('.map-tooltip');
        const isNumeric = stateData && stateData.numericValue !== null && Number.isFinite(stateData.numericValue);
        const valueLabel = isNumeric ? 'Value' : 'Category';
        const displayValue = stateData
          ? isNumeric
            ? stateData.numericValue!.toLocaleString()
            : (stateData.rawValue.trim() || '—')
          : '—';
        const safeStateName = escapeHtml(stateName);
        const safeDisplayValue = escapeHtml(displayValue);
        const safeCapital = info ? escapeHtml(info.capital) : '';
        const safeRegion = info ? escapeHtml(info.region) : '';

        tooltip
          .style('visibility', 'visible')
          .html(`
            <div style="font-weight: 600; font-size: 15px; margin-bottom: 8px; color: #60a5fa;">
              ${safeStateName}
            </div>
            <div style="opacity: 0.95; font-size: 13px;">
              <div style="margin: 4px 0;">
                <span style="font-weight: 500; color: #93c5fd;">${valueLabel}:</span>
                <span style="font-weight: 600; margin-left: 8px;">${safeDisplayValue}</span>
              </div>
              ${info ? `
                <div style="margin: 4px 0;">
                  <span style="font-weight: 500; color: #93c5fd;">Capital:</span>
                  <span style="margin-left: 8px;">${safeCapital}</span>
                </div>
                <div style="margin: 4px 0;">
                  <span style="font-weight: 500; color: #93c5fd;">Region:</span>
                  <span style="margin-left: 8px;">${safeRegion}</span>
                </div>
              ` : ''}
            </div>
          `);
      })
      .on('mousemove', function(event: MouseEvent) {
        const tooltip = d3.select('.map-tooltip');
        const tooltipNode = tooltip.node() as HTMLElement;
        const tooltipHeight = tooltipNode?.offsetHeight || 0;
        tooltip
          .style('top', (event.pageY - 10 - tooltipHeight) + 'px')
          .style('left', (event.pageX + 15) + 'px');
      })
      .on('mouseout', function(this: SVGPathElement) {
        d3.select(this)
          .attr('stroke-width', 2)
          .attr('stroke', '#fff')
          .style('filter', 'brightness(1)');
        d3.select('.map-tooltip').style('visibility', 'hidden');
      });

    // Update state value labels
    svg.selectAll<SVGTextElement, LabelMeta>('.state-label')
      .attr('text-anchor', d => d.anchor)
      .attr('y', d => -(Math.max(d.fontSize * 0.35, 4)))
      .style('font-size', d => `${d.fontSize}px`)
      .style('font-weight', '700')
      .style('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
      .style('stroke', '#ffffff')
      .style('stroke-width', '4px')
      .style('paint-order', 'stroke fill')
      .style('letter-spacing', '0.5px')
      .text(d => d.stateName);

    svg.selectAll<SVGTextElement, LabelMeta>('.state-label-value')
      .attr('text-anchor', d => d.anchor)
      .attr('y', d => getValueLineOffset(d))
      .style('font-size', d => {
        const entry = mapDataLookup.get(d.stateName);
        return `${getValueFontSize(d, entry)}px`;
      })
      .style('font-weight', '600')
      .style('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
      .style('stroke', '#ffffff')
      .style('stroke-width', '3px')
      .style('paint-order', 'stroke fill')
      .text(d => {
        const entry = mapDataLookup.get(d.stateName);
        if (!entry) {
          return '';
        }
        if (entry.numericValue !== null && Number.isFinite(entry.numericValue)) {
          return entry.numericValue.toLocaleString();
        }
        return entry.rawValue.trim();
      });

    svg.selectAll<SVGLineElement, LabelMeta>('.state-label-connector')
      .attr('x1', d => d.labelPosition.x + d.connectorOffset.x)
      .attr('y1', d => d.labelPosition.y + d.connectorOffset.y)
      .attr('x2', d => d.centroid[0])
      .attr('y2', d => d.centroid[1]);
  }, [mapData, maxNumericValue, mapLoaded, colorScheme, mapTitle, dataSource, categoryColorLookup]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      {/* Hero */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-green-200/70 bg-green-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-200">
                Map studio
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
                Transform regional data into publication-ready maps.
              </h1>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
                Colour every state and union territory with precision palettes, auto-aligned labels, and 2K–8K exports optimised for slides, dashboards, and print.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={generateRandomData}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                >
                  Random data
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400"
                >
                  <FiRotateCcw className="h-4 w-4" />
                  Reset map
                </button>
                <button
                  onClick={() => setShowExportDialog(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400"
                >
                  <FiDownload className="h-4 w-4" />
                  Export settings
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
              >
                <FiSave className="h-4 w-4" />
                Save to browser
              </button>
              <button
                onClick={() => setShowExportDialog(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <FiDownload className="h-4 w-4" />
                Export map
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                  <FiSliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Palette families built-in</h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Sequential, diverging, Viridis, Plasma, Turbo, and grayscale sets tuned for accessibility and print.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <FiMap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Label intelligence</h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Auto offsets, connector lines, and capital metadata keep compact regions legible at any resolution.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                  <FiDownload className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">2K, 4K and 8K exports</h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Produce map PNGs with smoothing optimised for large displays, slide decks, and wide-format print.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      {showExportDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowExportDialog(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/60">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export map</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Choose the resolution that matches your presentation or print needs.</p>
              </div>
              <button
                onClick={() => setShowExportDialog(false)}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <span className="sr-only">Close export dialog</span>
                ×
              </button>
            </div>
            <div className="space-y-3 px-6 py-6">
              <button
                onClick={() => handleExport('2k')}
                className="w-full rounded-xl bg-blue-600 px-4 py-4 text-left text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <div className="text-base font-semibold">2K Quality</div>
                <div className="text-xs text-blue-100">2560 × 1440 • Ideal for slides and dashboards</div>
              </button>
              <button
                onClick={() => handleExport('4k')}
                className="w-full rounded-xl bg-purple-600 px-4 py-4 text-left text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700"
              >
                <div className="text-base font-semibold">4K Quality</div>
                <div className="text-xs text-purple-100">3840 × 2160 • Perfect for HD displays and reports</div>
              </button>
              <button
                onClick={() => handleExport('8k')}
                className="w-full rounded-xl bg-pink-600 px-4 py-4 text-left text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700"
              >
                <div className="text-base font-semibold">8K Quality</div>
                <div className="text-xs text-pink-100">7680 × 4320 • Ready for large-format and print</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workspace */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Map information</h3>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Add the title and source that accompany your export.
                  </p>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Map title
                      </label>
                      <input
                        type="text"
                        value={mapTitle}
                        onChange={(e) => setMapTitle(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/40 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder="e.g., GDP by State 2024"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Displayed above the map preview and export.</p>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Data source
                      </label>
                      <input
                        type="text"
                        value={dataSource}
                        onChange={(e) => setDataSource(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/40 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder="e.g., World Bank, 2024 or https://data.gov.in"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Appears below the legend for attribution.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                      <FiInfo className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">Coverage</h2>
                      <p className="text-xs text-gray-600 dark:text-gray-400">28 states + 8 union territories (2024)</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    Input a number or category for each region. Leave blank to show a neutral colour.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Colour scheme</h3>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Choose a palette that fits your story. Switch anytime.</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {/* colour buttons retained */}
                  <button
                    onClick={() => setColorScheme('sequential')}
                    className={`rounded-lg border p-3 text-left transition ${
                      colorScheme === 'sequential'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-gradient-to-r from-blue-200 to-blue-600" />
                      <div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white">Blue</div>
                        <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Sequential</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setColorScheme('diverging')}
                    className={`rounded-lg border p-3 text-left transition ${
                      colorScheme === 'diverging'
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 ring-2 ring-pink-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-pink-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-gradient-to-r from-red-400 via-purple-300 to-blue-500" />
                      <div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white">Diverging</div>
                        <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Red ↔ Blue</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setColorScheme('viridis')}
                    className={`rounded-lg border p-3 text-left transition ${
                      colorScheme === 'viridis'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-green-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-gradient-to-r from-purple-800 via-teal-500 to-yellow-400" />
                      <div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white">Viridis</div>
                        <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Scientific</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setColorScheme('plasma')}
                    className={`rounded-lg border p-3 text-left transition ${
                      colorScheme === 'plasma'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-gradient-to-r from-purple-900 via-pink-500 to-yellow-300" />
                      <div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white">Plasma</div>
                        <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">ML/AI</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setColorScheme('turbo')}
                    className={`rounded-lg border p-3 text-left transition ${
                      colorScheme === 'turbo'
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 ring-2 ring-cyan-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-cyan-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-gradient-to-r from-blue-900 via-green-400 via-yellow-300 to-red-500" />
                      <div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white">Turbo</div>
                        <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Rainbow</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setColorScheme('grayscale')}
                    className={`rounded-lg border p-3 text-left transition ${
                      colorScheme === 'grayscale'
                        ? 'border-gray-500 bg-gray-50 dark:bg-gray-900/20 ring-2 ring-gray-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-gradient-to-r from-black to-white" />
                      <div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white">Grayscale</div>
                        <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Print</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">State values</h3>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Scroll through the list and update values inline.</p>
              <div className="mt-4 max-h-96 space-y-2 overflow-y-auto pr-2">
                {mapData.map((stateData) => {
                  const info = STATE_INFO[stateData.state];
                  const color = getStateFillColor(stateData);

                  return (
                    <div
                      key={stateData.state}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className="h-5 w-5 rounded border border-white/20"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{stateData.state}</div>
                          {info && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {info.capital} • {info.region}
                            </div>
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={stateData.rawValue}
                        onChange={(e) => handleValueChange(stateData.state, e.target.value)}
                        className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                        placeholder="Value or category"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live preview</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Full SVG render with zoom-friendly detail.</p>
            </div>
            <button
              onClick={() => setShowExportDialog(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-500 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-500/10"
            >
              <FiDownload className="h-4 w-4" />
              Export options
            </button>
          </div>

          <div ref={mapContainerRef} className="relative mt-5 flex min-h-[620px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-950">
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                Loading map…
              </div>
            )}
            <svg
              ref={svgRef}
              className="w-full max-w-4xl"
              xmlns="http://www.w3.org/2000/svg"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            {hasNumericValues ? (
              <>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <span>Low</span>
                  <span>High</span>
                </div>
                <div
                  className="relative mt-4 h-4 rounded-full shadow-inner"
                  style={{ background: `linear-gradient(90deg, ${legendGradientStops})` }}
                >
                  {legendTickPositions.map((tick, index) => (
                    <div
                      key={index}
                      className="absolute top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-gray-600 dark:text-gray-400"
                      style={{ left: `${tick.position}%` }}
                    >
                      {tick.label}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Add numeric values to see a continuous legend.
              </div>
            )}

            {hasCategoricalValues && (
              <div className={`mt-${hasNumericValues ? '6' : '4'} space-y-3`}>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Categories
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {categoryLegendItems.map(item => (
                    <div key={item.key} className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                      <span
                        className="inline-block h-3 w-3 rounded-full border border-white/40 shadow"
                        style={{ backgroundColor: categoryColorLookup.get(item.key) ?? '#9ca3af' }}
                      />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={`${hasNumericValues || hasCategoricalValues ? 'mt-6' : 'mt-4'} border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400`}>
              {hasNumericValues ? (
                <span>
                  <span className="font-semibold">Max value:</span> {maxNumericValue.toLocaleString()}
                </span>
              ) : (
                <span>
                  <span className="font-semibold">Numeric data:</span> None yet
                </span>
              )}
              {hasCategoricalValues && (
                <span className="ml-2">
                  • <span className="font-semibold">Categories:</span> {categoryLegendItems.length}
                </span>
              )}
              {dataSource && (
                <span className="ml-2">
                  • <span className="font-semibold">Source:</span> {dataSource}
                </span>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-green-100 p-4 text-green-800 shadow-xl dark:bg-green-900/90 dark:text-green-200">
          {saveStatus}
        </div>
      )}
    </div>
  );
};

export default IndiaMapPageClean;
