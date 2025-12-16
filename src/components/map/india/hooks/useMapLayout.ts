import { useMemo, useCallback } from 'react';
import {
    LAYOUT_CONFIGS,
    MAP_BOTTOM_MARGIN_BASE,
    PADDING_PRESETS
} from '../constants';
import type { LayoutId, PaddingPreset } from '../types';

export const useMapLayout = (layoutId: LayoutId, paddingPreset: PaddingPreset) => {
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

    const computeMapTopMargin = useCallback(
        () => margins.top,
        [margins.top]
    );

    return {
        layoutConfig,
        margins,
        viewBoxWidth: layoutConfig.viewBox.width,
        viewBoxHeight: layoutConfig.viewBox.height,
        titleAnchorOffset: layoutConfig.titleAnchorOffset,
        computeMapTopMargin
    };
};
