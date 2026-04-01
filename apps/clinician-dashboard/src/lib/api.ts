const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const IS_DEMO = !process.env.NEXT_PUBLIC_API_URL;

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (IS_DEMO) {
    console.log(`[API Demo] ${endpoint} - returning mock data`);
    return {} as T;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const json: any = await response.json();
  return json.data as T;
}
