import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { FiDownload, FiSave, FiRotateCcw, FiInfo } from 'react-icons/fi';

interface StateData {
  state: string;
  value: number;
  color: string;
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

const IndiaMapPageClean = () => {
  const [mapData, setMapData] = useState<StateData[]>(
    INDIAN_STATES.map(state => ({
      state,
      value: 0,
      color: '#e5e7eb',
      pathId: state.toLowerCase().replace(/\s+/g, '-')
    }))
  );
  const [colorScheme, setColorScheme] = useState<'sequential' | 'diverging' | 'viridis' | 'plasma' | 'turbo' | 'grayscale'>('sequential');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [mapTitle, setMapTitle] = useState('India Map Visualization');
  const [dataSource, setDataSource] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleValueChange = (stateName: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setMapData(prev => prev.map(d => d.state === stateName ? { ...d, value: numValue } : d));
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

  const maxValue = Math.max(...mapData.map(d => d.value), 1);

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
      value: 0,
      color: '#e5e7eb',
      pathId: state.toLowerCase().replace(/\s+/g, '-')
    })));
    setSaveStatus('Map reset');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const generateRandomData = () => {
    setMapData(prev => prev.map(d => ({
      ...d,
      value: Math.round(Math.random() * 1000)
    })));
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
          ctx.drawImage(img, 0, 0, width, height);
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
    if (maxValue === 0) {
      return [
        { min: 0, max: 0, color: '#e5e7eb', label: '0' }
      ];
    }

    const ranges = [
      { min: 0, max: maxValue * 0.1, color: generateColor(maxValue * 0.05, maxValue), label: `0-${Math.round(maxValue * 0.1)}` },
      { min: maxValue * 0.1, max: maxValue * 0.3, color: generateColor(maxValue * 0.2, maxValue), label: `${Math.round(maxValue * 0.1)}-${Math.round(maxValue * 0.3)}` },
      { min: maxValue * 0.3, max: maxValue * 0.5, color: generateColor(maxValue * 0.4, maxValue), label: `${Math.round(maxValue * 0.3)}-${Math.round(maxValue * 0.5)}` },
      { min: maxValue * 0.5, max: maxValue * 0.7, color: generateColor(maxValue * 0.6, maxValue), label: `${Math.round(maxValue * 0.5)}-${Math.round(maxValue * 0.7)}` },
      { min: maxValue * 0.7, max: maxValue, color: generateColor(maxValue * 0.85, maxValue), label: `${Math.round(maxValue * 0.7)}-${maxValue}` }
    ];

    return ranges;
  };

  const colorScaleRanges = generateColorScaleLegend();

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

        const width = 1000;
        const height = 1100; // Increased height to accommodate title and source

        svg.attr('viewBox', `0 0 ${width} ${height}`);

        // Add title at the top
        svg.append('text')
          .attr('class', 'map-title')
          .attr('x', width / 2)
          .attr('y', 40)
          .attr('text-anchor', 'middle')
          .attr('font-size', '32px')
          .attr('font-weight', 'bold')
          .attr('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
          .attr('fill', '#1f2937')
          .text(mapTitle);

        const projection = d3.geoMercator()
          .fitExtent([[20, 70], [width - 20, height - 80]], geoData); // Adjusted for title and source space

        const path = d3.geoPath().projection(projection);

        const g = svg.append('g');

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

        const currentMaxValue = maxValue;
        const currentMapData = mapData;

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
            return stateData ? generateColor(stateData.value, currentMaxValue) : '#e5e7eb';
          })
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .attr('class', 'state')
          .style('cursor', 'pointer')
          .style('transition', 'all 0.3s ease');

        // Add text labels for state values
        g.selectAll<SVGTextElement, any>('.state-label')
          .data(geoData.features)
          .enter()
          .append('text')
          .attr('class', 'state-label')
          .attr('transform', (d: any) => {
            const centroid = path.centroid(d as any);
            return `translate(${centroid[0]}, ${centroid[1]})`;
          })
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('pointer-events', 'none')
          .style('font-size', (d: any) => {
            const geoName = d.properties?.ST_NM || d.properties?.NAME_1 || d.properties?.name || '';
            const stateName = NAME_MAPPING[geoName] || geoName;
            // Smaller font for very small states/UTs
            if (['Delhi', 'Chandigarh', 'Lakshadweep'].includes(stateName)) {
              return '14px';
            }
            return '18px';
          })
          .style('font-weight', '700')
          .style('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
          .style('fill', '#1f2937')
          .style('stroke', '#ffffff')
          .style('stroke-width', '4px')
          .style('paint-order', 'stroke fill')
          .style('letter-spacing', '0.5px')
          .text((d: any) => {
            const geoName = d.properties?.ST_NM || d.properties?.NAME_1 || d.properties?.name || '';
            const stateName = NAME_MAPPING[geoName] || geoName;
            const stateData = currentMapData.find(s => s.state === stateName);
            return stateData && stateData.value > 0 ? stateData.value.toLocaleString() : '';
          });

        // Add name labels for island territories (Lakshadweep and Andaman & Nicobar)
        const islandLabels = [
          { name: 'Lakshadweep', offset: { x: -80, y: 40 } },
          { name: 'Andaman & Nicobar', offset: { x: 100, y: 0 } }
        ];

        islandLabels.forEach(island => {
          const feature = geoData.features.find((f: any) => {
            const geoName = f.properties?.ST_NM || f.properties?.NAME_1 || f.properties?.name || '';
            const stateName = NAME_MAPPING[geoName] || geoName;
            return stateName === island.name;
          });

          if (feature) {
            const centroid = path.centroid(feature);
            g.append('text')
              .attr('class', 'island-name-label')
              .attr('x', centroid[0] + island.offset.x)
              .attr('y', centroid[1] + island.offset.y)
              .attr('text-anchor', 'middle')
              .style('pointer-events', 'none')
              .style('font-size', '16px')
              .style('font-weight', '700')
              .style('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
              .style('fill', '#374151')
              .style('stroke', '#ffffff')
              .style('stroke-width', '3px')
              .style('paint-order', 'stroke fill')
              .text(island.name);

            // Add an arrow/line pointing to the island
            g.append('line')
              .attr('class', 'island-pointer')
              .attr('x1', centroid[0] + island.offset.x)
              .attr('y1', centroid[1] + island.offset.y - 10)
              .attr('x2', centroid[0])
              .attr('y2', centroid[1])
              .style('stroke', '#6b7280')
              .style('stroke-width', '2px')
              .style('stroke-dasharray', '4,4')
              .style('pointer-events', 'none');
          }
        });

        paths

        // Add data source footer at the bottom
        if (dataSource && dataSource.trim()) {
          svg.append('text')
            .attr('class', 'map-source')
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
    const currentMaxValue = maxValue;
    const currentMapData = mapData;

    // Update title
    svg.select('.map-title')
      .text(mapTitle);

    // Update or create source
    const existingSource = svg.select('.map-source');
    if (dataSource && dataSource.trim()) {
      if (existingSource.empty()) {
        svg.append('text')
          .attr('class', 'map-source')
          .attr('x', 500)
          .attr('y', 1080)
          .attr('text-anchor', 'middle')
          .attr('font-size', '14px')
          .attr('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
          .attr('fill', '#6b7280')
          .text(`Source: ${dataSource}`);
      } else {
        existingSource.text(`Source: ${dataSource}`);
      }
    } else {
      existingSource.remove();
    }

    // Update state colors
    svg.selectAll<SVGPathElement, any>('.state')
      .attr('fill', function(d: any) {
        const geoName = d.properties?.ST_NM || d.properties?.NAME_1 || d.properties?.name || '';
        const stateName = NAME_MAPPING[geoName] || geoName;
        const stateData = currentMapData.find(s => s.state === stateName);
        return stateData ? generateColor(stateData.value, currentMaxValue) : '#e5e7eb';
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
        tooltip
          .style('visibility', 'visible')
          .html(`
            <div style="font-weight: 600; font-size: 15px; margin-bottom: 8px; color: #60a5fa;">
              ${stateName}
            </div>
            <div style="opacity: 0.95; font-size: 13px;">
              <div style="margin: 4px 0;">
                <span style="font-weight: 500; color: #93c5fd;">Value:</span>
                <span style="font-weight: 600; margin-left: 8px;">${stateData?.value?.toLocaleString() || 0}</span>
              </div>
              ${info ? `
                <div style="margin: 4px 0;">
                  <span style="font-weight: 500; color: #93c5fd;">Capital:</span>
                  <span style="margin-left: 8px;">${info.capital}</span>
                </div>
                <div style="margin: 4px 0;">
                  <span style="font-weight: 500; color: #93c5fd;">Region:</span>
                  <span style="margin-left: 8px;">${info.region}</span>
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
    svg.selectAll<SVGTextElement, any>('.state-label')
      .style('font-size', '18px')
      .style('font-weight', '700')
      .style('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
      .style('stroke', '#ffffff')
      .style('stroke-width', '4px')
      .style('paint-order', 'stroke fill')
      .style('letter-spacing', '0.5px')
      .text(function(d: any) {
        const geoName = d.properties?.ST_NM || d.properties?.NAME_1 || d.properties?.name || '';
        const stateName = NAME_MAPPING[geoName] || geoName;
        const stateData = currentMapData.find(s => s.state === stateName);
        return stateData && stateData.value > 0 ? stateData.value.toLocaleString() : '';
      });
  }, [mapData, maxValue, mapLoaded, colorScheme, mapTitle, dataSource]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={generateRandomData}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Random Data
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiSave size={18} />
              <span>Save</span>
            </button>
            <button
              onClick={() => setShowExportDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiDownload size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowExportDialog(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Export Map</h3>
              <button
                onClick={() => setShowExportDialog(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Choose your export resolution. Higher resolutions provide better quality for printing and large displays.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleExport('2k')}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <div className="text-left">
                  <div className="font-bold text-lg">2K Quality</div>
                  <div className="text-sm opacity-90">2560 × 1440 pixels - Good for web & presentations</div>
                </div>
              </button>
              <button
                onClick={() => handleExport('4k')}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <div className="text-left">
                  <div className="font-bold text-lg">4K Quality</div>
                  <div className="text-sm opacity-90">3840 × 2160 pixels - Great for HD displays & printing</div>
                </div>
              </button>
              <button
                onClick={() => handleExport('8k')}
                className="w-full p-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
              >
                <div className="text-left">
                  <div className="font-bold text-lg">8K Quality</div>
                  <div className="text-sm opacity-90">7680 × 4320 pixels - Best for large format printing</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            {/* Map Title & Source */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Map Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Map Title
                  </label>
                  <input
                    type="text"
                    value={mapTitle}
                    onChange={(e) => setMapTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white"
                    placeholder="e.g., GDP by State 2024"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This will appear at the top of your map
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Source
                  </label>
                  <input
                    type="text"
                    value={dataSource}
                    onChange={(e) => setDataSource(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white"
                    placeholder="e.g., World Bank, 2024 or https://data.gov.in"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Add source citation (text or link) - appears at bottom
                  </p>
                </div>
              </div>
            </div>

            {/* Map Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">India Map</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create a color-coded map of India with custom data values for each state and union territory
              </p>

              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <FiInfo size={16} className="text-blue-600" />
                <span className="text-xs text-blue-700 dark:text-blue-300">
                  28 States + 8 Union Territories (2024)
                </span>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Color Scheme</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setColorScheme('sequential')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    colorScheme === 'sequential'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-r from-blue-200 to-blue-600"></div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white text-xs">Blue</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Classic</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setColorScheme('diverging')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    colorScheme === 'diverging'
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 ring-2 ring-pink-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-pink-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-r from-red-400 via-purple-300 to-blue-500"></div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white text-xs">Diverging</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Red-Blue</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setColorScheme('viridis')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    colorScheme === 'viridis'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-r from-purple-800 via-teal-500 to-yellow-400"></div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white text-xs">Viridis</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Scientific</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setColorScheme('plasma')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    colorScheme === 'plasma'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-r from-purple-900 via-pink-500 to-yellow-300"></div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white text-xs">Plasma</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">ML/AI</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setColorScheme('turbo')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    colorScheme === 'turbo'
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 ring-2 ring-cyan-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-cyan-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-r from-blue-900 via-green-400 via-yellow-300 to-red-500"></div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white text-xs">Turbo</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Rainbow</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setColorScheme('grayscale')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    colorScheme === 'grayscale'
                      ? 'border-gray-500 bg-gray-50 dark:bg-gray-900/20 ring-2 ring-gray-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-r from-black to-white"></div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white text-xs">Grayscale</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Print</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* State Data Input */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">State Data</h3>
              <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                {mapData.map((stateData) => {
                  const info = STATE_INFO[stateData.state];
                  const color = generateColor(stateData.value, maxValue);

                  return (
                    <div
                      key={stateData.state}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-5 h-5 rounded border"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {stateData.state}
                          </div>
                          {info && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {info.capital} • {info.region}
                            </div>
                          )}
                        </div>
                      </div>
                      <input
                        type="number"
                        value={stateData.value}
                        onChange={(e) => handleValueChange(stateData.state, e.target.value)}
                        className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white"
                        placeholder="Value"
                      />
                    </div>
                  );
                })}
              </div>
              <button
                onClick={handleReset}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FiRotateCcw size={16} />
                Reset All
              </button>
            </div>
          </div>

          {/* Right Side - Map Preview */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">India Map</h2>
              <div ref={mapContainerRef} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[600px] flex items-center justify-center relative">
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
                  </div>
                )}
                <svg
                  ref={svgRef}
                  className="w-full max-w-4xl"
                  xmlns="http://www.w3.org/2000/svg"
                />
              </div>

              {/* Color Scale Legend */}
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Color Scale</h5>
                <div className="space-y-2">
                  {colorScaleRanges.map((range, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: range.color }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {range.label}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Max Value:</span> {maxValue}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className="fixed bottom-4 right-4 p-4 bg-green-100 text-green-800 dark:bg-green-900/90 dark:text-green-200 rounded-lg shadow-xl">
          {saveStatus}
        </div>
      )}
    </div>
  );
};

export default IndiaMapPageClean;
