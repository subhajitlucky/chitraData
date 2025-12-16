import * as d3 from 'd3';
import { STATE_INFO } from '../constants';
import { escapeHtml, getFeatureStateName } from '../utils';
import type { StateData } from '../types';
import type { GeoJSONFeature } from '../types/geoTypes';

export const handleTooltip = (
  currentMapData: StateData[]
) => {
  const mouseOver = function (this: SVGPathElement, _: MouseEvent, d: GeoJSONFeature) {
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
  };

  const mouseMove = (event: MouseEvent) => {
    const tooltipSelection = d3.select('.map-tooltip');
    const tooltipNode = tooltipSelection.node() as HTMLElement;
    const tooltipHeight = tooltipNode?.offsetHeight || 0;
    tooltipSelection
      .style('top', (event.pageY - 10 - tooltipHeight) + 'px')
      .style('left', (event.pageX + 15) + 'px');
  };

  const mouseOut = function (this: SVGPathElement) {
    d3.select(this)
      .attr('stroke-width', 2)
      .attr('stroke', '#fff')
      .style('filter', 'brightness(1)');
    d3.select('.map-tooltip').style('visibility', 'hidden');
  };

  return { mouseOver, mouseMove, mouseOut };
};
