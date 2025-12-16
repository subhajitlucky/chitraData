import * as d3 from 'd3';
import { TITLE_CONSTANTS } from '../constants';
import { clamp, wrapTitleText } from '../utils';

type DrawTitleParams = {
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    mapTitle: string;
    viewBoxWidth: number;
    viewBoxHeight: number;
    margins: { left: number; right: number; top: number; bottom: number };
    mapBottomMargin: number;
    titleAnchorOffset: { x: number; y: number };
    mapBounds: [[number, number], [number, number]] | null;
    computeMapTopMargin: (height: number) => number;
    mapTopMarginRef: React.MutableRefObject<number>;
    mapTranslateRef: React.MutableRefObject<number>;
};

export const drawTitle = ({
    svg,
    mapTitle,
    viewBoxWidth,
    viewBoxHeight,
    margins,
    mapBottomMargin,
    titleAnchorOffset,
    mapBounds,
    computeMapTopMargin,
    mapTopMarginRef,
    mapTranslateRef
}: DrawTitleParams) => {
    let titleGroup = svg.select<SVGGElement>('.map-title-group');

    if (titleGroup.empty()) {
        titleGroup = svg.append('g').attr('class', 'map-title-group');

        titleGroup.append('text')
            .attr('class', 'map-title-text')
            .attr('data-export-role', 'map-title-text')
            .attr('fill', '#1f2937')
            .attr('font-family', 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif')
            .attr('font-weight', '700')
            .style('letter-spacing', '0.35px')
            .style('pointer-events', 'none');

        titleGroup.insert('rect', ':first-child')
            .attr('class', 'map-title-box')
            .attr('data-export-role', 'map-title-box')
            .attr('fill', 'transparent')
            .attr('pointer-events', 'none');
    }

    const titleTextSelection = titleGroup.select<SVGTextElement>('.map-title-text');
    const titleMetrics = wrapTitleText(titleTextSelection, mapTitle);

    // Position Logic
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

        titleGroup.attr('transform', `translate(${anchorX}, ${anchorY})`);
    }

    titleGroup.select<SVGRectElement>('.map-title-box')
        .attr('width', titleMetrics.width)
        .attr('height', titleMetrics.height);

    // Update margins if needed
    const nextTopMargin = computeMapTopMargin(titleMetrics.height);
    if (Math.abs(nextTopMargin - mapTopMarginRef.current) > 0.5) {
        const diff = nextTopMargin - mapTopMarginRef.current;
        mapTopMarginRef.current = nextTopMargin;
        mapTranslateRef.current += diff;
        svg.select<SVGGElement>('.map-geo')
            .attr('transform', `translate(0, ${mapTranslateRef.current})`);
    }

    return titleMetrics;
};
