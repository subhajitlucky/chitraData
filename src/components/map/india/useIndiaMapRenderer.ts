import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  DEFAULT_TITLE_HEIGHT,
  LAYOUT_CONFIGS,
  MAP_BOTTOM_MARGIN_BASE,
  PADDING_PRESETS,
  STATE_LABEL_OFFSETS,
  STATE_INFO,
  TITLE_CONSTANTS
} from './constants';
import {
  clamp,
  computeAutoConnectorOffset,
  escapeHtml,
  getFeatureStateName,
  getLabelFontSize,
  getValueFontSize,
  getValueLineOffset,
  wrapTitleText
} from './utils';
import type { ColorScheme, LabelMeta, LayoutId, PaddingPreset, StateData } from './types';

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
  colorScheme,
  getStateFillColor
}: UseIndiaMapRendererProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const labelMetaRef = useRef<LabelMeta[]>([]);
  const mapTopMarginRef = useRef<number>(DEFAULT_TITLE_HEIGHT);
  const mapTranslateRef = useRef<number>(0);
  const mapBoundsRef = useRef<[[number, number], [number, number]] | null>(null);
  const [geoJson, setGeoJson] = useState<any | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const layoutConfig = useMemo(() => LAYOUT_CONFIGS[layoutId], [layoutId]);
  const paddingScale = useMemo(() => PADDING_PRESETS[paddingPreset].scale, [paddingPreset]);

  const margins = useMemo(() => {
    const top = Math.max(layoutConfig.margins.top * paddingScale, 16);
    const left = Math.max(layoutConfig.margins.left * paddingScale, 16);
    const right = Math.max(layoutConfig.margins.right * paddingScale, 16);
    const bottom = Math.max(
      layoutConfig.margins.bottom * paddingScale,
      MAP_BOTTOM_MARGIN_BASE * 0.75
    );
    return { top, right, bottom, left };
  }, [layoutConfig, paddingScale]);

  const viewBoxWidth = layoutConfig.viewBox.width;
  const viewBoxHeight = layoutConfig.viewBox.height;
  const mapBottomMargin = margins.bottom;
  const titleAnchorOffset = layoutConfig.titleAnchorOffset;

  const computeMapTopMargin = useCallback(
    (_titleHeight: number) => margins.top,
    [margins.top]
  );

  // Load GeoJSON lazily after first paint/idling
  useEffect(() => {
    let cancelled = false;
    setMapLoaded(false);

    const loadData = async () => {
      try {
        const data = await d3.json('/india-govt-map.geojson');
        if (!cancelled && data && (data as any).features) {
          setGeoJson(data as any);
        }
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    const idleCb =
      (typeof (window as any).requestIdleCallback === 'function'
        ? (window as any).requestIdleCallback(loadData, { timeout: 500 })
        : setTimeout(loadData, 150));

    return () => {
      cancelled = true;
      if (typeof (window as any).cancelIdleCallback === 'function') {
        try {
          (window as any).cancelIdleCallback(idleCb);
        } catch {
          /* ignore */
        }
      } else {
        clearTimeout(idleCb as any);
      }
    };
  }, []);

  // Render map with D3 when geoJson is available
  useEffect(() => {
    if (!geoJson) return;

    const loadMap = async () => {
      try {
        const geoData = geoJson;

        if (!geoData || !geoData.features) {
          console.error('Failed to load map data');
          return;
        }

        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = viewBoxWidth;
        const height = viewBoxHeight;

        svg.attr('viewBox', `0 0 ${width} ${height}`);

        // Add title box at the top-right
        const titleGroup = svg.append('g')
          .attr('class', 'map-title-group');

        const titleTextSelection = titleGroup.append('text')
          .attr('class', 'map-title-text')
          .attr('data-export-role', 'map-title-text')
          .attr('fill', '#1f2937')
          .attr('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
          .attr('font-weight', '700')
          .style('letter-spacing', '0.35px')
          .style('pointer-events', 'none');

        const titleMetrics = wrapTitleText(titleTextSelection, mapTitle);

        const mapTopMargin = computeMapTopMargin(titleMetrics.height);
        mapTopMarginRef.current = mapTopMargin;
        mapTranslateRef.current = 0;

        const projection = d3.geoMercator()
          .fitExtent([[margins.left, mapTopMargin], [width - margins.right, height - mapBottomMargin]], geoData);

        const path = d3.geoPath().projection(projection);

        const mapBounds = path.bounds(geoData);
        mapBoundsRef.current = mapBounds;
        const [, minY] = mapBounds[0];
        const [maxX] = mapBounds[1];

        const anchorX = clamp(
          maxX - titleMetrics.width - titleAnchorOffset.x,
          margins.left,
          width - titleMetrics.width - margins.right
        );
        const desiredAnchorY = minY - titleMetrics.height - titleAnchorOffset.y;
        const anchorY = clamp(
          desiredAnchorY,
          TITLE_CONSTANTS.BOX_MARGIN_TOP,
          height - mapBottomMargin - titleMetrics.height
        );

        titleGroup.attr('transform', `translate(${anchorX}, ${anchorY})`);

        titleGroup.insert('rect', ':first-child')
          .attr('class', 'map-title-box')
          .attr('data-export-role', 'map-title-box')
          .attr('width', titleMetrics.width)
          .attr('height', titleMetrics.height)
          .attr('fill', 'transparent')
          .attr('pointer-events', 'none');

        const g = svg.append('g')
          .attr('class', 'map-geo')
          .attr('transform', 'translate(0, 0)');

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
            const stateName = getFeatureStateName(d);
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
          .on('mouseover', function(this: SVGPathElement, _: MouseEvent, d: any) {
            d3.select(this)
              .attr('stroke-width', 4)
              .attr('stroke', '#1f2937')
              .style('filter', 'brightness(1.15)');

            const stateName = getFeatureStateName(d);
            const stateData = currentMapData.find(s => s.state === stateName);
            const info = STATE_INFO[stateName];

            const tooltipSelection = d3.select('.map-tooltip');
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

            tooltipSelection
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
            const tooltipSelection = d3.select('.map-tooltip');
            const tooltipNode = tooltipSelection.node() as HTMLElement;
            const tooltipHeight = tooltipNode?.offsetHeight || 0;
            tooltipSelection
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
  }, [
    geoJson,
    layoutId,
    paddingPreset,
    margins.left,
    margins.right,
    margins.top,
    margins.bottom,
    titleAnchorOffset.x,
    titleAnchorOffset.y,
    viewBoxWidth,
    viewBoxHeight,
    mapTitle,
    dataSource,
    mapBottomMargin,
    computeMapTopMargin,
    getStateFillColor,
    mapData
  ]);

  // Update colors and labels when data or color scheme changes
  useEffect(() => {
    if (!mapLoaded || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const currentMapData = mapData;
    const mapDataLookup = new Map(currentMapData.map(item => [item.state, item]));

    const titleGroup = svg.select<SVGGElement>('.map-title-group');
    const titleTextSelection = titleGroup.select<SVGTextElement>('.map-title-text');
    if (!titleTextSelection.empty()) {
      const titleMetrics = wrapTitleText(titleTextSelection, mapTitle);

      const mapBounds = mapBoundsRef.current;
      if (mapBounds) {
        const [, minY] = mapBounds[0];
        const [maxX] = mapBounds[1];
        const anchorX = clamp(
          maxX - titleMetrics.width - titleAnchorOffset.x,
          margins.left,
          viewBoxWidth - titleMetrics.width - margins.right
        );
        const desiredAnchorY = minY - titleMetrics.height - titleAnchorOffset.y;
        const anchorY = clamp(
          desiredAnchorY,
          TITLE_CONSTANTS.BOX_MARGIN_TOP,
          viewBoxHeight - mapBottomMargin - titleMetrics.height
        );

        titleGroup.attr(
          'transform',
          `translate(${anchorX}, ${anchorY})`
        );
      }

      titleGroup.select<SVGRectElement>('.map-title-box')
        .attr('width', titleMetrics.width)
        .attr('height', titleMetrics.height);

      const previousTopMargin = mapTopMarginRef.current;
      const nextTopMargin = computeMapTopMargin(titleMetrics.height);
      if (Math.abs(nextTopMargin - previousTopMargin) > 0.5) {
        mapTopMarginRef.current = nextTopMargin;
        mapTranslateRef.current += nextTopMargin - previousTopMargin;
        svg.select<SVGGElement>('.map-geo')
          .attr('transform', `translate(0, ${mapTranslateRef.current})`);
      }
    }

    // Update or create source
    const existingSource = svg.select('.map-source');
    if (dataSource && dataSource.trim()) {
      if (existingSource.empty()) {
        svg.append('text')
          .attr('class', 'map-source')
          .attr('data-export-role', 'map-source')
          .attr('x', viewBoxWidth / 2)
          .attr('y', viewBoxHeight - 20)
          .attr('text-anchor', 'middle')
          .attr('font-size', '14px')
          .attr('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
          .attr('fill', '#6b7280')
          .text(`Source: ${dataSource}`);
      } else {
        existingSource
          .attr('x', viewBoxWidth / 2)
          .attr('y', viewBoxHeight - 20)
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
        const stateName = getFeatureStateName(d);
        const stateData = currentMapData.find(s => s.state === stateName);
        return stateData ? getStateFillColor(stateData) : '#e5e7eb';
      })
      // Update tooltip handlers to use current data
      .on('mouseover', function(this: SVGPathElement, _: MouseEvent, d: any) {
        d3.select(this)
          .attr('stroke-width', 4)
          .attr('stroke', '#1f2937')
          .style('filter', 'brightness(1.15)');

        const stateName = getFeatureStateName(d);
        const stateData = currentMapData.find(s => s.state === stateName);
        const info = STATE_INFO[stateName];

        const tooltipSelection = d3.select('.map-tooltip');
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

        tooltipSelection
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
        const tooltipSelection = d3.select('.map-tooltip');
        const tooltipNode = tooltipSelection.node() as HTMLElement;
        const tooltipHeight = tooltipNode?.offsetHeight || 0;
        tooltipSelection
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
  }, [
    mapData,
    mapLoaded,
    colorScheme,
    mapTitle,
    dataSource,
    layoutId,
    paddingPreset,
    margins.left,
    margins.right,
    margins.top,
    margins.bottom,
    titleAnchorOffset.x,
    titleAnchorOffset.y,
    viewBoxWidth,
    viewBoxHeight,
    mapBottomMargin,
    computeMapTopMargin,
    getStateFillColor
  ]);

  return { svgRef, mapLoaded, viewBoxWidth, viewBoxHeight };
};

