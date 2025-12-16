import * as d3 from 'd3';
import {
  DEFAULT_TITLE_HEIGHT,
  NAME_MAPPING,
  STATE_LABEL_OFFSETS,
  TITLE_CONSTANTS
} from './constants';
import type { LabelMeta, StateData, TitleLayoutMetrics } from './types';

export const getFeatureStateName = (feature: unknown): string => {
  const anyFeature = feature as { properties?: { ST_NM?: string; NAME_1?: string; name?: string } };
  const geoName = anyFeature?.properties?.ST_NM || anyFeature?.properties?.NAME_1 || anyFeature?.properties?.name || '';
  return NAME_MAPPING[geoName] || geoName;
};

export const getLabelFontSize = (stateName: string): number => {
  const config = STATE_LABEL_OFFSETS[stateName];
  if (config?.fontSize) return config.fontSize;
  if (stateName.length > 16) return 10;
  if (stateName.length > 14) return 11;
  if (stateName.length > 12) return 12;
  return 13;
};

export const computeAutoConnectorOffset = (
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

export const parseNumericValue = (input: string): number | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(/,/g, '');
  if (!/^[-+]?(\\d+\\.?\\d*|\\.\\d+)$/.test(normalized)) {
    return null;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const wrapTitleText = (
  textSelection: d3.Selection<SVGTextElement, unknown, null, undefined>,
  titleValue: string
): TitleLayoutMetrics => {
  if (textSelection.empty()) {
    return {
      width: TITLE_CONSTANTS.MIN_WIDTH,
      height: DEFAULT_TITLE_HEIGHT,
      fontSize: TITLE_CONSTANTS.FONT_SIZE,
      lineCount: 0
    };
  }

  const sanitized = titleValue?.trim() ?? '';
  const words = sanitized.length > 0 ? sanitized.split(/\s+/) : [''];

  textSelection.attr('transform', 'translate(0, 0)');
  textSelection.selectAll('tspan').remove();

  let fontSize = TITLE_CONSTANTS.FONT_SIZE;
  const minFontSize = 16;

  const measure = textSelection.append('tspan')
    .attr('x', 0)
    .attr('y', 0)
    .attr('font-size', fontSize)
    .text('');

  const computeLinesForWidth = (innerWidth: number) => {
    measure.attr('font-size', fontSize);
    const lines: string[] = [];
    let currentWords: string[] = [];

    words.forEach(word => {
      const candidate = currentWords.length ? `${currentWords.join(' ')} ${word}` : word;
      measure.text(candidate);
      const length = measure.node()?.getComputedTextLength() ?? 0;
      if (length <= innerWidth || currentWords.length === 0) {
        currentWords.push(word);
      } else {
        lines.push(currentWords.join(' '));
        currentWords = [word];
      }
    });

    if (currentWords.length) {
      lines.push(currentWords.join(' '));
    }

    let maxLineWidth = 0;
    lines.forEach(line => {
      measure.text(line);
      const length = measure.node()?.getComputedTextLength() ?? 0;
      if (length > maxLineWidth) {
        maxLineWidth = length;
      }
    });

    return {
      lines: lines.length ? lines : [''],
      maxLineWidth
    };
  };

  let longestWordWidth = 0;
  words.forEach(word => {
    measure.text(word);
    const length = measure.node()?.getComputedTextLength() ?? 0;
    if (length > longestWordWidth) {
      longestWordWidth = length;
    }
  });

  let boxWidth = clamp(
    longestWordWidth + TITLE_CONSTANTS.HORIZONTAL_PADDING * 2,
    TITLE_CONSTANTS.MIN_WIDTH,
    TITLE_CONSTANTS.MAX_WIDTH
  );

  let linesResult = computeLinesForWidth(
    Math.max(60, boxWidth - TITLE_CONSTANTS.HORIZONTAL_PADDING * 2)
  );

  const reduceFontIfNeeded = () => {
    while (linesResult.lines.length > TITLE_CONSTANTS.MAX_LINES && fontSize > minFontSize) {
      fontSize -= 2;
      linesResult = computeLinesForWidth(
        Math.max(60, boxWidth - TITLE_CONSTANTS.HORIZONTAL_PADDING * 2)
      );
    }
  };

  reduceFontIfNeeded();

  for (let i = 0; i < 5; i++) {
    const desiredWidth = linesResult.maxLineWidth + TITLE_CONSTANTS.HORIZONTAL_PADDING * 2;
    const clampedWidth = clamp(desiredWidth, TITLE_CONSTANTS.MIN_WIDTH, TITLE_CONSTANTS.MAX_WIDTH);

    if (Math.abs(clampedWidth - boxWidth) < 1) {
      boxWidth = clampedWidth;
      break;
    }

    boxWidth = clampedWidth;
    linesResult = computeLinesForWidth(
      Math.max(60, boxWidth - TITLE_CONSTANTS.HORIZONTAL_PADDING * 2)
    );
    reduceFontIfNeeded();
  }

  measure.remove();

  const lineHeightPx = fontSize * TITLE_CONSTANTS.LINE_HEIGHT;

  const textSelectionWithFont = textSelection
    .attr('font-size', fontSize)
    .attr('text-anchor', 'middle');

  const tspans = textSelectionWithFont
    .selectAll<SVGTextElement, string>('tspan')
    .data(linesResult.lines);

  tspans.exit().remove();

  const merged = tspans
    .enter()
    .append('tspan')
    .merge(tspans);

  merged
    .attr('x', 0)
    .attr('y', (_, index) => index * lineHeightPx)
    .text(d => d);

  const textNode = textSelection.node();
  const bbox = textNode?.getBBox();

  const fallbackContentWidth =
    linesResult.maxLineWidth > 0 ? linesResult.maxLineWidth : fontSize;
  const fallbackContentHeight =
    linesResult.lines.length > 1
      ? (linesResult.lines.length - 1) * lineHeightPx + fontSize
      : fontSize;

  const contentWidth = bbox?.width ?? fallbackContentWidth;
  const contentHeight = bbox?.height ?? fallbackContentHeight;

  const finalWidth = clamp(
    Math.max(boxWidth, contentWidth + TITLE_CONSTANTS.HORIZONTAL_PADDING * 2),
    TITLE_CONSTANTS.MIN_WIDTH,
    TITLE_CONSTANTS.MAX_WIDTH
  );
  const finalHeight = Math.max(
    contentHeight + TITLE_CONSTANTS.VERTICAL_PADDING * 2,
    TITLE_CONSTANTS.VERTICAL_PADDING * 2 + fontSize
  );

  const innerCenterX =
    TITLE_CONSTANTS.HORIZONTAL_PADDING + (finalWidth - TITLE_CONSTANTS.HORIZONTAL_PADDING * 2) / 2;
  const innerCenterY =
    TITLE_CONSTANTS.VERTICAL_PADDING + (finalHeight - TITLE_CONSTANTS.VERTICAL_PADDING * 2) / 2;

  if (bbox) {
    const offsetX = innerCenterX - (bbox.x + bbox.width / 2);
    const offsetY = innerCenterY - (bbox.y + bbox.height / 2);
    textSelection.attr('transform', `translate(${offsetX}, ${offsetY})`);
  } else {
    textSelection.attr('transform', `translate(${innerCenterX}, ${innerCenterY})`);
  }

  return {
    width: finalWidth,
    height: finalHeight,
    fontSize,
    lineCount: linesResult.lines.length
  };
};

export const getValueLineOffset = (meta: LabelMeta) => Math.max(meta.fontSize * 0.9, 10);

export const getValueFontSize = (meta: LabelMeta, stateData?: StateData) => {
  const numericBase = Math.max(meta.fontSize - 5, 9);
  if (!stateData) return numericBase;
  if (stateData.numericValue !== null && Number.isFinite(stateData.numericValue)) {
    return numericBase;
  }
  return Math.max(meta.fontSize - 3, numericBase + 1);
};

export { DEFAULT_TITLE_HEIGHT };

