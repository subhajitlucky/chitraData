import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { DEFAULT_TITLE_HEIGHT } from './constants';
import type { ColorScheme, LayoutId, PaddingPreset, StateData } from './types';
import { useMapLayout } from './hooks/useMapLayout';
import { useGeoData } from './hooks/useGeoData';
import { useLabelMetadata } from './hooks/useLabelMetadata';
import { drawTitle } from './renderers/drawTitle';
import { drawStates } from './renderers/drawStates';
import { drawLabels } from './renderers/drawLabels';

type UseIndiaMapRendererProps = {
  mapData: StateData[];
  mapTitle: string;
  dataSource: string;
  layoutId: LayoutId;
  paddingPreset: PaddingPreset;
  colorScheme: ColorScheme;
  getStateFillColor: (stateData: StateData) => string;
};

export const useIndiaMapRenderer = ({
  mapData,
  mapTitle,
  dataSource,
  layoutId,
  paddingPreset,
  // colorScheme, // Not directly used in hook, logic in getStateFillColor
  getStateFillColor
}: UseIndiaMapRendererProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const mapTopMarginRef = useRef<number>(DEFAULT_TITLE_HEIGHT);
  const mapTranslateRef = useRef<number>(0);
  const mapBoundsRef = useRef<[[number, number], [number, number]] | null>(null);

  const {
    margins,
    viewBoxWidth,
    viewBoxHeight,
    titleAnchorOffset,
    computeMapTopMargin
  } = useMapLayout(layoutId, paddingPreset);

  const geoJson = useGeoData();
  const { labelMetaRef, calculateMetadata } = useLabelMetadata();
  const mapLoaded = !!geoJson;

  const currentMapData = mapData;
  const mapDataLookup = useMemo(() => new Map(currentMapData.map(item => [item.state, item])), [currentMapData]);

  // Main Rendering Effect
  useEffect(() => {
    if (!geoJson || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`);

    const g = svg.append('g').attr('class', 'map-geo');

    // 1. Draw Title to calculate margins
    drawTitle({
      svg,
      mapTitle,
      viewBoxWidth,
      viewBoxHeight,
      margins,
      mapBottomMargin: margins.bottom,
      titleAnchorOffset,
      mapBounds: mapBoundsRef.current,
      computeMapTopMargin,
      mapTopMarginRef,
      mapTranslateRef
    });

    // 2. Projection and Path
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projection = d3.geoMercator()
      .fitExtent([
        [margins.left, mapTopMarginRef.current],
        [viewBoxWidth - margins.right, viewBoxHeight - margins.bottom]
      ], geoJson as any);

    const path = d3.geoPath().projection(projection);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapBoundsRef.current = path.bounds(geoJson as any);

    // Re-draw Title with updated bounds
    drawTitle({
      svg,
      mapTitle,
      viewBoxWidth,
      viewBoxHeight,
      margins,
      mapBottomMargin: margins.bottom,
      titleAnchorOffset,
      mapBounds: mapBoundsRef.current, // Now available
      computeMapTopMargin,
      mapTopMarginRef,
      mapTranslateRef
    });

    // 3. Metadata
    calculateMetadata(geoJson.features, path);

    // 4. Draw Map Elements
    drawStates({
      g,
      geoData: geoJson,
      path,
      currentMapData,
      getStateFillColor
    });

    drawLabels({
      g,
      labelMetadata: labelMetaRef.current,
      mapDataLookup
    });

    // 5. Source
    if (dataSource && dataSource.trim()) {
      svg.append('text')
        .attr('class', 'map-source')
        .attr('x', viewBoxWidth / 2)
        .attr('y', viewBoxHeight - 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', '#6b7280')
        .text(`Source: ${dataSource}`);
    }

  }, [
    geoJson,
    viewBoxWidth,
    viewBoxHeight,
    margins,
    mapTitle,
    dataSource,
    currentMapData,
    getStateFillColor,
    // Add implicit dependencies if needed, usually stable or captured
    paddingPreset, layoutId // Trigger re-render on layout change
  ]);

  return { svgRef, mapLoaded, viewBoxWidth, viewBoxHeight };
};
