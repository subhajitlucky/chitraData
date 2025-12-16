import * as d3 from 'd3';
import { getFeatureStateName } from '../utils';
import type { StateData } from '../types';
import type { IndiaGeoJSON, GeoJSONFeature } from '../types/geoTypes';
import { handleTooltip } from './tooltipHandlers';

type DrawStatesParams = {
    g: d3.Selection<SVGGElement, unknown, null, undefined>;
    geoData: IndiaGeoJSON;
    path: d3.GeoPath;
    currentMapData: StateData[];
    getStateFillColor: (stateData: StateData) => string;
};

export const drawStates = ({
    g,
    geoData,
    path,
    currentMapData,
    getStateFillColor
}: DrawStatesParams) => {
    const { mouseOver, mouseMove, mouseOut } = handleTooltip(currentMapData);

    // Bind data using a unique key function for stability
    const paths = g.selectAll<SVGPathElement, GeoJSONFeature>('.state')
        .data(geoData.features, (d: GeoJSONFeature) => getFeatureStateName(d));

    // Enter
    paths.enter()
        .append('path')
        .attr('class', 'state')
        .attr('d', path as d3.ValueFn<SVGPathElement, GeoJSONFeature, string | null>)
        .attr('data-export-role', 'state-path')
        .style('cursor', 'pointer')
        .style('transition', 'all 0.3s ease')
        .merge(paths) // Update + Enter
        .attr('fill', (d: GeoJSONFeature) => {
            const stateName = getFeatureStateName(d);
            const stateData = currentMapData.find(s => s.state === stateName);
            return stateData ? getStateFillColor(stateData) : '#e5e7eb';
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .on('mouseover', mouseOver)
        .on('mousemove', mouseMove)
        .on('mouseout', mouseOut);

    paths.exit().remove();
};
