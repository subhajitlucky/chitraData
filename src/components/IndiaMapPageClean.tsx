import { useCallback, useMemo, useState } from 'react';
import { FiDownload, FiInfo, FiMap, FiSliders } from 'react-icons/fi';
import { ActionBar } from './map/india/ActionBar';
import { ExportDialog } from './map/india/ExportDialog';
import { LayoutPaddingPanel } from './map/india/LayoutPaddingPanel';
import { MapInfoPanel } from './map/india/MapInfoPanel';
import { PalettePanel } from './map/india/PalettePanel';
import { ValueTable } from './map/india/ValueTable';
import { MapPreviewSection } from './map/india/MapPreviewSection';
import { LegendPanel } from './map/india/LegendPanel';
import {
  CATEGORY_COLORS,
  INDIAN_STATES,
  LAYOUT_CONFIGS,
  PADDING_PRESETS,
  RESOLUTION_BUTTON_STYLES,
  RESOLUTION_PRESETS,
  STATE_INFO
} from './map/india/constants';
import { colorFromScheme } from './map/india/colorScales';
import { exportSvgAsPng } from './map/india/exportHelpers';
import { useIndiaMapRenderer } from './map/india/useIndiaMapRenderer';
import { parseNumericValue } from './map/india/utils';
import type {
  ColorScheme,
  LayoutId,
  PaddingPreset,
  ResolutionPreset,
  StateData
} from './map/india/types';

const buildInitialData = (): StateData[] =>
  INDIAN_STATES.map(state => ({
    state,
    rawValue: '',
    numericValue: null,
    pathId: state.toLowerCase().replace(/\s+/g, '-')
  }));

const createLegendRanges = (
  hasNumericValues: boolean,
  maxNumericValue: number,
  generateColor: (value: number) => string
) => {
  if (!hasNumericValues) return [] as { min: number; max: number; color: string; label: string }[];
  if (maxNumericValue === 0) {
    return [{ min: 0, max: 0, color: '#e5e7eb', label: '0' }];
  }
  const ranges = [0.1, 0.3, 0.5, 0.7].map((end, idx, arr) => ({
    min: maxNumericValue * (idx === 0 ? 0 : arr[idx - 1]),
    max: maxNumericValue * end,
    color: generateColor(maxNumericValue * ((idx === 0 ? 0.05 : arr[idx - 1] + end) / 2)),
    label: `${Math.round(maxNumericValue * (idx === 0 ? 0 : arr[idx - 1]))}-${Math.round(maxNumericValue * end)}`
  }));
  ranges.push({
    min: maxNumericValue * 0.7,
    max: maxNumericValue,
    color: generateColor(maxNumericValue * 0.85),
    label: `${Math.round(maxNumericValue * 0.7)}-${maxNumericValue}`
  });
  return ranges;
};

export default function IndiaMapPageClean() {
  const [mapData, setMapData] = useState<StateData[]>(buildInitialData);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('sequential');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [mapTitle, setMapTitle] = useState('Map Visualization');
  const [dataSource, setDataSource] = useState('');
  const [layoutId, setLayoutId] = useState<LayoutId>('widescreen');
  const [paddingPreset, setPaddingPreset] = useState<PaddingPreset>('balanced');

  const layoutOptions = useMemo(() => Object.values(LAYOUT_CONFIGS), []);
  const paddingOptions = useMemo(
    () => Object.entries(PADDING_PRESETS) as Array<[
      PaddingPreset,
      { label: string; description: string; scale: number }
    ]>,
    []
  );

  const numericValues = useMemo(
    () =>
      mapData
        .map(d => d.numericValue)
        .filter((value): value is number => value !== null && Number.isFinite(value)),
    [mapData]
  );
  const maxNumericValue = useMemo(() => Math.max(0, ...numericValues), [numericValues]);
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

  const generateColor = useCallback(
    (value: number) => colorFromScheme(value, maxNumericValue, colorScheme),
    [colorScheme, maxNumericValue]
  );

  const getStateFillColor = useCallback(
    (stateData: StateData) => {
      if (stateData.numericValue !== null && Number.isFinite(stateData.numericValue)) {
        return generateColor(stateData.numericValue);
      }
      const trimmed = stateData.rawValue.trim();
      if (!trimmed) return '#e5e7eb';
      return categoryColorLookup.get(trimmed.toLowerCase()) ?? '#9ca3af';
    },
    [categoryColorLookup, generateColor]
  );

  const legendRanges = useMemo(
    () => createLegendRanges(hasNumericValues, maxNumericValue, generateColor),
    [hasNumericValues, maxNumericValue, generateColor]
  );

  const legendGradientStops = legendRanges.length
    ? legendRanges
        .map((range, index) => {
          const position = legendRanges.length === 1 ? 0 : (index / (legendRanges.length - 1)) * 100;
          return `${range.color} ${position}%`;
        })
        .join(', ')
    : '#e5e7eb 0%';

  const legendTickPositions = legendRanges.map((range, index) => ({
    label: range.label,
    position: legendRanges.length === 1 ? 0 : (index / (legendRanges.length - 1)) * 100
  }));

  const getResolutionDimensions = useCallback(
    (preset: ResolutionPreset) => {
      const info = RESOLUTION_PRESETS[preset];
      const width = info.longEdge;
      const height = Math.round(width * (LAYOUT_CONFIGS[layoutId].viewBox.height / LAYOUT_CONFIGS[layoutId].viewBox.width));
      return { width, height };
    },
    [layoutId]
  );

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

  const handleSave = () => {
    try {
      const savedMaps = JSON.parse(localStorage.getItem('chitradata_maps') || '[]');
      const newMap = {
        id: Date.now().toString(),
        data: mapData,
        title: mapTitle,
        source: dataSource,
        colorScheme,
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
    setMapData(buildInitialData());
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

  const handleExport = async (preset: ResolutionPreset) => {
    if (!svgRef.current) return;
    try {
      const label = await exportSvgAsPng({
        svgElement: svgRef.current,
        resolution: preset,
        resolutionPresets: RESOLUTION_PRESETS,
        viewBoxWidth: LAYOUT_CONFIGS[layoutId].viewBox.width,
        viewBoxHeight: LAYOUT_CONFIGS[layoutId].viewBox.height
      });
      setSaveStatus(`Map exported as ${label}!`);
      setShowExportDialog(false);
    } catch (error) {
      setSaveStatus('Export failed');
    }
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const { svgRef, mapLoaded } = useIndiaMapRenderer({
    mapData,
    mapTitle,
    dataSource,
    layoutId,
    paddingPreset,
    colorScheme,
    getStateFillColor
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
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
            </div>
            <div />
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

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        resolutionButtonStyles={RESOLUTION_BUTTON_STYLES}
        getResolutionDimensions={getResolutionDimensions}
        RESOLUTION_PRESETS={RESOLUTION_PRESETS}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <ActionBar
          onRandom={generateRandomData}
          onReset={handleReset}
          onSave={handleSave}
          onExport={() => setShowExportDialog(true)}
        />

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Design controls</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Arrange title, padding, and palette before editing values.
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <MapInfoPanel
                mapTitle={mapTitle}
                dataSource={dataSource}
                onTitleChange={setMapTitle}
                onSourceChange={setDataSource}
              />

              <PalettePanel colorScheme={colorScheme} onChange={setColorScheme} />
            </div>

            <div className="space-y-3">
              <LayoutPaddingPanel
                layoutId={layoutId}
                layoutOptions={layoutOptions}
                onLayoutChange={setLayoutId}
                paddingPreset={paddingPreset}
                paddingOptions={paddingOptions}
                onPaddingChange={setPaddingPreset}
              />

              <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
                <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                  <FiInfo className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Coverage</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    28 states + 8 union territories (2024). Enter a number or category; blank fields stay neutral.
                  </p>
                </div>
              </div>
            </div>

            <ValueTable
              mapData={mapData}
              stateInfo={STATE_INFO}
              getStateFillColor={getStateFillColor}
              onValueChange={handleValueChange}
            />
          </div>
        </section>

        <MapPreviewSection
          mapLoaded={mapLoaded}
          svgRef={svgRef}
        >
          <button
            onClick={() => setShowExportDialog(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-500 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-500/10"
          >
            <FiDownload className="h-4 w-4" />
            Export options
          </button>
        </MapPreviewSection>

        <LegendPanel
          hasNumericValues={hasNumericValues}
          legendGradientStops={legendGradientStops}
          legendTickPositions={legendTickPositions}
          hasCategoricalValues={categoryLegendItems.length > 0}
          categoryLegendItems={categoryLegendItems}
          categoryColorLookup={categoryColorLookup}
          maxNumericValue={maxNumericValue}
          dataSource={dataSource}
        />
      </div>

      {saveStatus && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-green-100 p-4 text-green-800 shadow-xl dark:bg-green-900/90 dark:text-green-200">
          {saveStatus}
        </div>
      )}
    </div>
  );
}
