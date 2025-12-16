export interface GeoJSONFeature {
    type: string;
    properties: Record<string, unknown>;
    geometry: unknown;
}

export interface IndiaGeoJSON {
    type: string;
    features: GeoJSONFeature[];
}
