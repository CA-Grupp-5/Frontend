import type { LngLat } from './mapbox';
// reusing mapbox coord types instead of redefining it

export type Bounds = { ne: LngLat; sw: LngLat };

export type LineStringGeometry = { type: 'LineString'; coordinates: LngLat[] };

export function computeBoundsFromRoute(routeGeom: LineStringGeometry): Bounds | null {
  const coords = (routeGeom?.coordinates ?? []) as LngLat[];
  if (!Array.isArray(coords) || coords.length < 2) return null;

  const longitudes = coords.map(([lon]) => lon);
  const latitudes = coords.map(([, lat]) => lat);

  return {
    ne: [Math.max(...longitudes), Math.max(...latitudes)] as LngLat,
    sw: [Math.min(...longitudes), Math.min(...latitudes)] as LngLat,
  };
}

export function expandBoundsAround(center: LngLat, dLon: number, dLat: number): Bounds {
  const [lon, lat] = center;
  return {
    ne: [lon + dLon, lat + dLat] as LngLat,
    sw: [lon - dLon, lat - dLat] as LngLat,
  };
}
