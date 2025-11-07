import html2canvas from 'html2canvas';

export interface ExportOptions {
  filename?: string;
  scale?: number;
  quality?: number;
  backgroundColor?: string;
  width?: number;
  height?: number;
}

export const exportAsPNG = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    filename = 'chart',
    scale = 3,
    quality = 0.95,
    backgroundColor = '#ffffff',
    width,
    height
  } = options;

  try {
    // Store original dimensions
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;

    // Apply custom size if provided
    if (width && height) {
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
    }

    const canvas = await html2canvas(element, {
      scale,
      backgroundColor,
      useCORS: true,
      logging: false,
      allowTaint: true,
      width: width || undefined,
      height: height || undefined
    });

    // Restore original dimensions
    if (width && height) {
      element.style.width = originalWidth;
      element.style.height = originalHeight;
    }

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png', quality);
    link.click();
  } catch (error) {
    console.error('Error exporting PNG:', error);
    throw new Error('Failed to export chart as PNG');
  }
};

export const exportAsJPEG = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    filename = 'chart',
    scale = 3,
    quality = 0.95,
    backgroundColor = '#ffffff'
  } = options;

  try {
    const canvas = await html2canvas(element, {
      scale,
      backgroundColor,
      useCORS: true,
      logging: false,
      allowTaint: true
    });

    const link = document.createElement('a');
    link.download = `${filename}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', quality);
    link.click();
  } catch (error) {
    console.error('Error exporting JPEG:', error);
    throw new Error('Failed to export chart as JPEG');
  }
};

export const exportAsPDF = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> => {
  // For PDF export, we can use html2canvas + jsPDF or just html2canvas for now
  // Simplified implementation - in production, you'd want to use jsPDF
  await exportAsPNG(element, options);
};

export const exportChart = async (
  element: HTMLElement,
  format: 'png' | 'jpeg' | 'pdf',
  options: ExportOptions = {}
): Promise<void> => {
  const filename = options.filename || `chart-${Date.now()}`;

  switch (format) {
    case 'png':
      return exportAsPNG(element, { ...options, filename });
    case 'jpeg':
      return exportAsJPEG(element, { ...options, filename });
    case 'pdf':
      return exportAsPDF(element, { ...options, filename });
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

export const exportChartWithQuality = async (
  element: HTMLElement,
  format: 'png' | 'pdf',
  quality: 'standard' | 'hd' | '2k' | '4k' | '8k',
  size: string,
  options: Omit<ExportOptions, 'scale' | 'width' | 'height'> = {}
): Promise<void> => {
  const sizes = getPresetSizes();
  const qualityPresets = {
    standard: { scale: 1 },
    hd: { scale: 2 },
    '2k': { scale: 2 },
    '4k': { scale: 3 },
    '8k': { scale: 4 }
  };

  const sizeConfig = sizes[size as keyof typeof sizes] || sizes.presentation;
  const qualityConfig = qualityPresets[quality];

  const exportOptions: ExportOptions = {
    ...options,
    scale: qualityConfig.scale,
    width: sizeConfig.width,
    height: sizeConfig.height
  };

  return exportChart(element, format, exportOptions);
};

export const getPresetSizes = () => {
  return {
    'social-square': { name: 'Social Media Square', width: 1080, height: 1080, scale: 1 },
    'social-wide': { name: 'Social Media Wide (HD 1080p)', width: 1920, height: 1080, scale: 1 },
    'presentation': { name: 'Presentation (Full HD 1080p)', width: 1920, height: 1080, scale: 1 },
    '2k': { name: '2K QHD', width: 2560, height: 1440, scale: 2 },
    '4k': { name: '4K UHD', width: 3840, height: 2160, scale: 3 },
    '8k': { name: '8K UHD', width: 7680, height: 4320, scale: 4 },
    'a4': { name: 'A4 Print', width: 1240, height: 1754, scale: 1 },
    'custom': { name: 'Custom Size', width: 1200, height: 800, scale: 1 }
  };
};

export const applyExportSize = (element: HTMLElement, width: number, height: number) => {
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
};

export const resetExportSize = (element: HTMLElement) => {
  element.style.width = '';
  element.style.height = '';
};
