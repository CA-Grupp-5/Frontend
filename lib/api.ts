
export type LoginResponse = {
  token?: string;
  message?: string;
  [key: string]: any;
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
