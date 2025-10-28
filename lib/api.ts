
export type LoginResponse = {
  token?: string;
  message?: string;
  [key: string]: any;
};

// Packages API DTO (snake_case as returned by backend)NEED BACKEND TO ADD TEMP DIRECTLY IN /PACKAGES
export type ApiPackage = {
  id: number;
  sender_id: number;
  receiver_id: number;
  current_location: string | null;
  status: string;
  assigned_truck_id: number | null;
  expected_temperature_min: number;
  expected_temperature_max: number;
  expected_humidity_min: number;
  expected_humidity_max: number;
  created_at: string;
  updated_at: string | null;
  sender_name: string;
  receiver_name: string;
  // NEED THESE TWO TO BE ADDED DIRECTLY IN /PACKAGES
  current_temperature?: number | null;
  current_humidity?: number | null;
};

function ensureHttps(u: string): string {
  if (!u) return u;
  if (u.startsWith('http://')) {
    throw new Error('API URL must be https');
  }
  return u.startsWith('https://') ? u : `https://${u}`;
}

function readBaseUrl(): string {
  const envUrl = (globalThis as any)?.process?.env?.POSTGRES_URL;
  if (envUrl) return envUrl;

  try {
    const Constants = require('expo-constants').default;
    const extra = Constants?.expoConfig?.extra as Record<string, unknown> | undefined;
    const configUrl = typeof extra?.POSTGRES_URL === 'string' ? extra.POSTGRES_URL : undefined;
    if (configUrl) return configUrl;
  } catch (error) {
    console.log('Error reading POSTGRES_URL:', error);
  }

  return '';
}

function buildUrl(base: string, path: string): string {
  return new URL(path, ensureHttps(base)).toString();
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const baseUrlRaw = readBaseUrl();
  if (!baseUrlRaw) throw new Error('POSTGRES_URL is not configured for the mobile client');
  const endpoint = buildUrl(baseUrlRaw, '/auth/login');

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Login failed: ${res.status} ${text}`);
  }

  const data = (await res.json().catch(() => ({}))) as LoginResponse;
  if (data?.message) {
    console.log('Auth message:', data.message);
  } else {
    console.log('Auth response received');
  }
  return data;
}

export async function register(name: string, email: string, password: string): Promise<LoginResponse> {
  const baseUrlRaw = readBaseUrl();
  if (!baseUrlRaw) throw new Error('POSTGRES_URL is not configured for the mobile client');
  const endpoint = buildUrl(baseUrlRaw, '/auth/register');

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Signup failed: ${res.status} ${text}`);
  }

  const data = (await res.json().catch(() => ({}))) as LoginResponse;
  if (data?.message) {
    console.log('Signup message:', data.message);
  } else {
    console.log('Signup response received');
  }
  return data;
}

export async function fetchPackages(): Promise<ApiPackage[]> {
  const baseUrlRaw = readBaseUrl();
  if (!baseUrlRaw) throw new Error('POSTGRES_URL is not configured for the mobile client');
  const endpoint = buildUrl(baseUrlRaw, '/packages');

  const res = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Fetch packages failed: ${res.status} ${text}`);
  }

  const json: any = await res.json().catch(() => ({}));

  let arr: any = json;
  if (!Array.isArray(arr)) {
    const candidates = ['data', 'packages', 'items', 'rows', 'result'];
    for (const key of candidates) {
      const maybe = json?.[key];
      if (Array.isArray(maybe)) {
        arr = maybe;
        break;
      }
    }
  }

  if (!Array.isArray(arr)) {
    // Surface a meaningful error for UI and dev logs
    const shape = json && typeof json === 'object' ? Object.keys(json).join(',') : typeof json;
    console.log('Unexpected /packages response shape. Keys:', shape);
    throw new Error('Unexpected packages response shape');
  }

  // Normalize numeric fields if backend provides strings
  const toNum = (v: any) => (typeof v === 'string' ? Number(v) : v);
  const normalized: ApiPackage[] = arr.map((p: any) => ({
    id: toNum(p?.id),
    sender_id: toNum(p?.sender_id),
    receiver_id: toNum(p?.receiver_id),
    current_location: p?.current_location ?? null,
    status: String(p?.status ?? ''),
    assigned_truck_id: p?.assigned_truck_id == null ? null : toNum(p?.assigned_truck_id),
    expected_temperature_min: toNum(p?.expected_temperature_min),
    expected_temperature_max: toNum(p?.expected_temperature_max),
    expected_humidity_min: toNum(p?.expected_humidity_min),
    expected_humidity_max: toNum(p?.expected_humidity_max),
    created_at: String(p?.created_at ?? ''),
    updated_at: p?.updated_at == null ? null : String(p?.updated_at),
    sender_name: String(p?.sender_name ?? ''),
    receiver_name: String(p?.receiver_name ?? ''),
    current_temperature: p?.current_temperature == null ? null : toNum(p?.current_temperature),
    current_humidity: p?.current_humidity == null ? null : toNum(p?.current_humidity),
  }));

  return normalized.filter((p) => Number.isFinite(p.id));
}
