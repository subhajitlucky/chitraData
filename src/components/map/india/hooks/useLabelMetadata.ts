import { useRef } from 'react';
import * as d3 from 'd3';
import { STATE_LABEL_OFFSETS } from '../constants';
import {
    computeAutoConnectorOffset,
    getFeatureStateName,
    getLabelFontSize
} from '../utils';
import type { LabelMeta } from '../types';
import type { GeoJSONFeature } from '../types/geoTypes';

export const useLabelMetadata = () => {
    const labelMetaRef = useRef<LabelMeta[]>([]);

    const calculateMetadata = (
        features: GeoJSONFeature[],
        path: d3.GeoPath
    ): LabelMeta[] => {
        const metadata = features.map((feature: GeoJSONFeature) => {
            const stateName = getFeatureStateName(feature);
            const centroidRaw = path.centroid(feature as d3.GeoPermissibleObjects) as [number, number];
            const centroid: [number, number] =
                centroidRaw && Number.isFinite(centroidRaw[0]) && Number.isFinite(centroidRaw[1])
                    ? centroidRaw
                    : [0, 0];
            const config = STATE_LABEL_OFFSETS[stateName];
            const labelX = centroid[0] + (config?.x ?? 0);
            const labelY = centroid[1] + (config?.y ?? 0);
            const fontSize = config?.fontSize ?? getLabelFontSize(stateName);
            const labelHalfWidth = (stateName.length * fontSize * 0.6) / 2;
            const labelHalfHeight = fontSize / 2;
            const autoConnectorOffset = computeAutoConnectorOffset(
                labelX,
                labelY,
                centroid,
                labelHalfWidth,
                labelHalfHeight
            );

            let hasConnector = false;
            let connectorOffset = { x: 0, y: 0 };

            if (config) {
                if (config.connectorOffset === null) {
                    hasConnector = false;
                } else {
                    hasConnector = true;
                    const manual = config.connectorOffset;
                    connectorOffset = manual
                        ? {
                            x: autoConnectorOffset.x + manual.x,
                            y: autoConnectorOffset.y + manual.y
                        }
                        : autoConnectorOffset;
                }
            }

            return {
                stateName,
                centroid,
                labelPosition: { x: labelX, y: labelY },
                anchor: config?.anchor ?? 'middle',
                fontSize,
                labelHalfWidth,
                labelHalfHeight,
                connectorOffset,
                hasConnector
            };
        });

        labelMetaRef.current = metadata;
        return metadata;
    };

    return { labelMetaRef, calculateMetadata };
};
