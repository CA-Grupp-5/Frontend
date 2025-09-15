import Constants from 'expo-constants';

export type LngLat = [number, number]; // [lon, lat]

export type GeocodeOptions = {
  country?: string; // e.g., 'SE'
  proximity?: LngLat; // [lon, lat]
  limit?: number; // default 5
  types?: string; // e.g., 'address,poi,place'
};

export type GeocodeFeature = {
  id: string;
  place_name: string;
  center: LngLat;
  place_type: string[];
};

export async function geocodeAddress(query: string, opts: GeocodeOptions = {}): Promise<GeocodeFeature | null> {
  const token = (Constants?.expoConfig?.extra as any)?.MAPBOX_ACCESS_TOKEN as string | undefined;
  if (!token || !query) return null;

  const params = new URLSearchParams();
  params.set('access_token', token);
  params.set('autocomplete', 'false');
  params.set('limit', String(opts.limit ?? 5));
  params.set('types', opts.types ?? 'address,poi,place');
  if (opts.country) params.set('country', opts.country);
  if (opts.proximity) params.set('proximity', `${opts.proximity[0]},${opts.proximity[1]}`);

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const features: GeocodeFeature[] = json?.features ?? [];
    if (!features.length) return null;

    // Prefer address > poi > place
    const byPreference = [...features].sort((a, b) => rankType(a) - rankType(b));
    return byPreference[0];
  } catch (e) {
    console.warn('geocodeAddress failed', e);
    return null;
  }
}

function rankType(f: GeocodeFeature): number {
  const t = f.place_type?.[0] ?? '';
  if (t === 'address') return 0;
  if (t === 'poi') return 1;
  if (t === 'place' || t === 'locality' || t === 'neighborhood') return 2;
  return 3;
}
