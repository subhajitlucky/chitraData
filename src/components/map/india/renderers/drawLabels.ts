import * as d3 from 'd3';
import { getValueFontSize, getValueLineOffset } from '../utils';
import type { LabelMeta, StateData } from '../types';

type DrawLabelsParams = {
    g: d3.Selection<SVGGElement, unknown, null, undefined>;
    labelMetadata: LabelMeta[];
    mapDataLookup: Map<string, StateData>;
};

export const drawLabels = ({
    g,
    labelMetadata,
    mapDataLookup
}: DrawLabelsParams) => {
    // --- Connectors ---
    const connectors = g.selectAll<SVGLineElement, LabelMeta>('.state-label-connector')
        .data(labelMetadata.filter(meta => meta.hasConnector), d => d.stateName);

    connectors.enter()
        .append('line')
        .attr('class', 'state-label-connector')
        .attr('data-export-role', 'state-connector')
        .style('stroke', '#6b7280')
        .style('stroke-width', '1.5px')
        .style('stroke-dasharray', '4,4')
        .style('pointer-events', 'none')
        .merge(connectors)
        .attr('x1', d => d.labelPosition.x + d.connectorOffset.x)
        .attr('y1', d => d.labelPosition.y + d.connectorOffset.y)
        .attr('x2', d => d.centroid[0])
        .attr('y2', d => d.centroid[1]);

    connectors.exit().remove();


    // --- Groups ---
    const labelGroups = g.selectAll<SVGGElement, LabelMeta>('.state-label-group')
        .data(labelMetadata, d => d.stateName);

    const groupsEnter = labelGroups.enter()
        .append('g')
        .attr('class', 'state-label-group');

    // Append initial text elements for Enter selection
    groupsEnter.append('text')
        .attr('class', 'state-label-name state-label')
        .attr('data-export-role', 'state-label-name')
        .attr('dominant-baseline', 'middle')
        .style('pointer-events', 'none')
        .style('font-weight', '700')
        .style('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
        .style('fill', '#1f2937')
        .style('stroke', '#ffffff')
        .style('stroke-width', '4px')
        .style('paint-order', 'stroke fill')
        .style('letter-spacing', '0.5px');

    groupsEnter.append('text')
        .attr('class', 'state-label-value')
        .attr('data-export-role', 'state-label-value')
        .attr('dominant-baseline', 'hanging')
        .style('pointer-events', 'none')
        .style('font-weight', '600')
        .style('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
        .style('fill', '#1f2937')
        .style('stroke', '#ffffff')
        .style('stroke-width', '3px')
        .style('paint-order', 'stroke fill')
        .style('letter-spacing', '0.3px');

    const groupsUpdate = groupsEnter.merge(labelGroups);

    groupsUpdate.attr('transform', d => `translate(${d.labelPosition.x}, ${d.labelPosition.y})`);

    // Update Name
    groupsUpdate.select('.state-label-name')
        .attr('text-anchor', d => d.anchor)
        .style('font-size', d => `${d.fontSize}px`)
        .attr('y', d => -(Math.max(d.fontSize * 0.35, 4)))
        .text(d => d.stateName);

    // Update Value
    groupsUpdate.select('.state-label-value')
        .attr('text-anchor', d => d.anchor)
        .style('font-size', d => {
            const entry = mapDataLookup.get(d.stateName);
            return `${getValueFontSize(d, entry)}px`;
        })
        .attr('y', d => getValueLineOffset(d))
        .text(d => {
            const entry = mapDataLookup.get(d.stateName);
            if (!entry) return '';
            if (entry.numericValue !== null && Number.isFinite(entry.numericValue)) {
                return entry.numericValue?.toLocaleString() || '';
            }
            return entry.rawValue.trim();
        });

    labelGroups.exit().remove();
};
