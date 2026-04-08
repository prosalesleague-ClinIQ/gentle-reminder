/**
 * API client for the Family Dashboard.
 * In production, this calls the real API.
 * In demo mode, returns mock data.
 */

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
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const json: any = await response.json();
  return json.data as T;
}

export async function fetchPatient(id: string) {
  return fetchApi(`/patients/${id}`);
}

export async function fetchCognitiveScores(patientId: string, days = 30) {
  return fetchApi(`/analytics/cognitive-trends?patientId=${patientId}&days=${days}`);
}

export async function fetchMessages(threadId?: string) {
  const query = threadId ? `?threadId=${threadId}` : '';
  return fetchApi(`/messages${query}`);
}

export async function sendMessage(threadId: string, content: string) {
  return fetchApi('/messages', {
    method: 'POST',
    body: JSON.stringify({ threadId, content }),
  });
}

export async function fetchMedications(patientId: string) {
  return fetchApi(`/patients/${patientId}/medications`);
}

export async function fetchInvoices() {
  return fetchApi('/billing/invoices');
}
