import type { ResolutionPreset } from './types';

type ExportOptions = {
  svgElement: SVGSVGElement;
  resolution: ResolutionPreset;
  resolutionPresets: Record<ResolutionPreset, { label: string; description: string; longEdge: number }>;
  viewBoxWidth: number;
  viewBoxHeight: number;
};

export const exportSvgAsPng = async ({
  svgElement,
  resolution,
  resolutionPresets,
  viewBoxWidth,
  viewBoxHeight
}: ExportOptions): Promise<string> => {
  const preset = resolutionPresets[resolution];
  const width = preset.longEdge;
  const height = Math.round(width * (viewBoxHeight / viewBoxWidth));
  const label = `${preset.label} (${width}×${height})`;

  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  svgClone.setAttribute('width', width.toString());
  svgClone.setAttribute('height', height.toString());
  svgClone.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  const exportScale = width / viewBoxWidth;

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

  scaleAttribute('[data-export-role="map-title-text"]', 'font-size', exportScale);
  scaleStyleProperty('[data-export-role="map-title-text"]', 'letter-spacing', exportScale);
  scaleAttribute('[data-export-role="map-source"]', 'font-size', exportScale);
  scaleStyleProperty('[data-export-role="state-label-name"]', 'font-size', exportScale);
  scaleStyleProperty('[data-export-role="state-label-value"]', 'font-size', exportScale);
  scaleStyleProperty('[data-export-role="state-connector"]', 'stroke-width', exportScale);
  scaleAttribute('[data-export-role="state-path"]', 'stroke-width', exportScale);

  const svgData = new XMLSerializer().serializeToString(svgClone);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const img = new Image();

  canvas.width = width;
  canvas.height = height;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        const marginX = Math.round(width * 0.045);
        const marginY = Math.round(height * 0.05);
        ctx.drawImage(img, marginX, marginY, width - marginX * 2, height - marginY * 2);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.download = `india-map-${resolution}-${Date.now()}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
          resolve(label);
          return;
        }
        reject(new Error('Failed to create image blob'));
      }, 'image/png', 1.0);
    };

    img.onerror = () => {
      reject(new Error('Export failed'));
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  });
};

