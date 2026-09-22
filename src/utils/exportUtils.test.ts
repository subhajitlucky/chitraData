import { describe, expect, it } from 'vitest';
import {
  QUALITY_PRESETS,
  SIZE_PRESETS,
  resolveExportDimensions
} from './exportUtils';

describe('resolveExportDimensions', () => {
  it('derives 16:9 dimensions from the quality long edge', () => {
    expect(resolveExportDimensions('4k', 'presentation')).toEqual({ width: 3840, height: 2160 });
    expect(resolveExportDimensions('hd', 'presentation')).toEqual({ width: 1920, height: 1080 });
    expect(resolveExportDimensions('8k', 'presentation')).toEqual({ width: 7680, height: 4320 });
  });

  it('supports square, 4:3, and portrait ratios', () => {
    expect(resolveExportDimensions('2k', 'social-square')).toEqual({ width: 2560, height: 2560 });
    expect(resolveExportDimensions('hd', 'print-4-3')).toEqual({ width: 1920, height: 1440 });
    expect(resolveExportDimensions('4k', 'a4')).toEqual({ width: 2715, height: 3840 });
  });

  it('treats a WxH string as an exact custom size', () => {
    expect(resolveExportDimensions('8k', '1200x800')).toEqual({ width: 1200, height: 800 });
    expect(resolveExportDimensions('standard', '640x480')).toEqual({ width: 640, height: 480 });
  });

  it('ignores invalid custom sizes and falls back to the default ratio', () => {
    expect(resolveExportDimensions('standard', '0x480')).toEqual({ width: 1280, height: 720 });
    expect(resolveExportDimensions('standard', '1200xabc')).toEqual({ width: 1280, height: 720 });
  });

  it('falls back to the first size preset for unknown size ids', () => {
    expect(resolveExportDimensions('hd', 'does-not-exist')).toEqual({ width: 1920, height: 1080 });
  });
});

describe('export presets', () => {
  it('keeps every quality preset on a consistent long edge', () => {
    expect(QUALITY_PRESETS.standard.longEdge).toBe(1280);
    expect(QUALITY_PRESETS.hd.longEdge).toBe(1920);
    expect(QUALITY_PRESETS['2k'].longEdge).toBe(2560);
    expect(QUALITY_PRESETS['4k'].longEdge).toBe(3840);
    expect(QUALITY_PRESETS['8k'].longEdge).toBe(7680);
  });

  it('exposes unique size preset ids', () => {
    const ids = SIZE_PRESETS.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
