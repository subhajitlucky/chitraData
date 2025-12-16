import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import type { IndiaGeoJSON } from '../types/geoTypes';

export const useGeoData = () => {
    const [geoJson, setGeoJson] = useState<IndiaGeoJSON | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            try {
                const data = await d3.json('/india-govt-map.geojson');
                if (!cancelled && data && (data as Record<string, unknown>).features) {
                    setGeoJson(data as IndiaGeoJSON);
                }
            } catch (error) {
                console.error('Error loading map:', error);
            }
        };

        const idleCb =
            (typeof (window as Window & { requestIdleCallback?: (cb: () => void, opts: { timeout: number }) => number }).requestIdleCallback === 'function'
                ? (window as Window & { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => number }).requestIdleCallback(loadData, { timeout: 500 })
                : setTimeout(loadData, 150));

        return () => {
            cancelled = true;
            if (typeof (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback === 'function') {
                try {
                    (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleCb as number);
                } catch {
                    /* ignore */
                }
            } else {
                clearTimeout(idleCb as ReturnType<typeof setTimeout>);
            }
        };
    }, []);

    return geoJson;
};
