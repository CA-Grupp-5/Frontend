import { z } from 'zod';

export type LoginResponse = {
  token?: string;
  message?: string;
  [key: string]: any;
};


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
  current_temperature?: number | null;
  current_humidity?: number | null;
  last_sensor_at?: string | null;
  driver_position?: unknown | null;
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

// Runtime schema for server responses
const ApiPackageSchema = z
  .object({
    id: z.coerce.number(),
    sender_id: z.coerce.number(),
    receiver_id: z.coerce.number(),
    current_location: z.string().nullable(),
    status: z.string(),
    assigned_truck_id: z.coerce.number().nullable(),
    expected_temperature_min: z.coerce.number(),
    expected_temperature_max: z.coerce.number(),
    expected_humidity_min: z.coerce.number(),
    expected_humidity_max: z.coerce.number(),
    created_at: z.string(),
    updated_at: z.string().nullable(),
    sender_name: z.string(),
    receiver_name: z.string(),
    current_temperature: z.coerce.number().nullable().optional(),
    current_humidity: z.coerce.number().nullable().optional(),
    last_sensor_at: z.string().nullable().optional(),
    driver_position: z.any().nullable().optional(),
  })
  .passthrough();

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

  const ResponseSchema = z
    .object({
      message: z.string(),
      packages: z.array(ApiPackageSchema),
    })
    .passthrough();

  const parsed = ResponseSchema.safeParse(await res.json());
  if (!parsed.success) {
    throw new Error('Unexpected /packages response shape');
  }
  return parsed.data.packages as ApiPackage[];
}

export async function fetchPackageById(id: number | string): Promise<ApiPackage> {
  const baseUrlRaw = readBaseUrl();
  if (!baseUrlRaw) throw new Error('POSTGRES_URL is not configured for the mobile client');
  const endpoint = buildUrl(baseUrlRaw, `/packages/${id}`);

  const res = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Fetch package ${id} failed: ${res.status} ${text}`);
  }

  const ResponseSchema = z
    .object({
      message: z.string(),
      package: ApiPackageSchema,
    })
    .passthrough();

  const parsed = ResponseSchema.safeParse(await res.json());
  if (!parsed.success) {
    throw new Error(`Unexpected /packages/${id} response shape`);
  }
  return parsed.data.package as ApiPackage;
}
export async function updatePackage(pkg: ApiPackage): Promise<ApiPackage> {
  const baseUrlRaw = readBaseUrl();
  if (!baseUrlRaw) throw new Error('POSTGRES_URL is not configured for the mobile client');
  const endpoint = buildUrl(baseUrlRaw, `/packages/${pkg.id}`);

  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pkg),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Update package ${pkg.id} failed: ${res.status} ${text}`);
  }

  // if the expected shape isn't present, fall back to refetching the package.
  const rawJson = await res.json().catch(() => ({} as any));

  const ResponseSchema = z
    .object({
      message: z.string().optional(),
      package: ApiPackageSchema.optional(),
    })
    .passthrough();

  const parsed = ResponseSchema.safeParse(rawJson);
  if (parsed.success && parsed.data.package) {
    return parsed.data.package as ApiPackage;
  }

  
  try {
    const fresh = await fetchPackageById(pkg.id);
    return fresh;
  } catch (e) {
    // If refetch also fails, surface a helpful error.
    throw new Error(
      `Update succeeded but failed to refetch package ${pkg.id}: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
}
