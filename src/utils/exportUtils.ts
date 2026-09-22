export type ExportQuality = 'standard' | 'hd' | '2k' | '4k' | '8k';
export type ExportFormat = 'png' | 'pdf';

export interface ExportDimensions {
  width: number;
  height: number;
}

export const QUALITY_PRESETS: Record<
  ExportQuality,
  { name: string; description: string; longEdge: number }
> = {
  standard: { name: 'Standard (720p)', description: 'Good for web and social media', longEdge: 1280 },
  hd: { name: 'HD (1080p)', description: 'Better quality for presentations', longEdge: 1920 },
  '2k': { name: '2K QHD (1440p)', description: 'High quality for reports', longEdge: 2560 },
  '4k': { name: '4K UHD (2160p)', description: 'Ultra sharp, ideal for printing', longEdge: 3840 },
  '8k': { name: '8K UHD (4320p)', description: 'Maximum quality for large formats', longEdge: 7680 }
};

export const SIZE_PRESETS = [
  { id: 'presentation', name: 'Presentation', ratioLabel: '16:9', ratio: [16, 9] as const },
  { id: 'social-square', name: 'Social square', ratioLabel: '1:1', ratio: [1, 1] as const },
  { id: 'print-4-3', name: 'Print', ratioLabel: '4:3', ratio: [4, 3] as const },
  { id: 'a4', name: 'A4 portrait', ratioLabel: '1:1.41', ratio: [1240, 1754] as const }
];

const parseCustomSize = (size: string | null | undefined): ExportDimensions | null => {
  if (!size) return null;
  const match = size.match(/^(\d+)x(\d+)$/i);
  if (!match) return null;

  const width = parseInt(match[1], 10);
  const height = parseInt(match[2], 10);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }

  return { width, height };
};

export const resolveExportDimensions = (
  quality: ExportQuality,
  size: string | null | undefined
): ExportDimensions => {
  const custom = parseCustomSize(size);
  if (custom) return custom;

  const preset = SIZE_PRESETS.find((candidate) => candidate.id === size) ?? SIZE_PRESETS[0];
  const [ratioWidth, ratioHeight] = preset.ratio;
  const longEdge = QUALITY_PRESETS[quality].longEdge;
  const ratio = ratioWidth / ratioHeight;

  if (ratio >= 1) {
    return { width: longEdge, height: Math.round(longEdge / ratio) };
  }

  return { width: Math.round(longEdge * ratio), height: longEdge };
};

const downloadDataUrl = async (dataUrl: string, filename: string) => {
  const blob = await (await fetch(dataUrl)).blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = url;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const downloadAsPdf = async (
  dataUrl: string,
  { width, height }: ExportDimensions,
  filename: string
) => {
  const { jsPDF } = await import('jspdf');
  const orientation = width >= height ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [width, height],
    hotfixes: ['px_scaling']
  });

  pdf.addImage(dataUrl, 'JPEG', 0, 0, width, height);
  pdf.save(`${filename}.pdf`);
};

export const downloadCanvas = async (
  canvas: HTMLCanvasElement,
  filename: string,
  format: ExportFormat
) => {
  if (format === 'pdf') {
    const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    await downloadAsPdf(jpegDataUrl, { width: canvas.width, height: canvas.height }, filename);
    return;
  }

  await downloadDataUrl(canvas.toDataURL('image/png', 1), filename);
};
