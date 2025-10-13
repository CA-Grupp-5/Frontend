import Constants from 'expo-constants';

export type LoginResponse = {
  token?: string;
  message?: string;
  [key: string]: any;
};

function withHttps(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const endpointRaw = (Constants?.expoConfig?.extra as any)?.POSTGRES_URL as string | undefined;
  const endpoint = withHttps(endpointRaw ?? '');
  if (!endpoint) throw new Error('POSTGRES_URL is not configured');

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

