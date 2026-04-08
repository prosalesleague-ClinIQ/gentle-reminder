import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_URL || 'http://localhost:3000';

test.describe('API Health Endpoints', () => {
  test('GET /health should return healthy status', async ({ request }) => {
    const response = await request.get(`${API_BASE}/health`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('healthy');
    expect(body.timestamp).toBeTruthy();
    expect(typeof body.uptime).toBe('number');
  });

  test('GET /api/v1/health/ready should return readiness status', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/v1/health/ready`);
    const body = await response.json();
    expect(body.status).toMatch(/ready|degraded/);
    expect(body.checks).toBeTruthy();
    expect(body.checks.database).toBeTruthy();
    expect(body.checks.memory).toBeTruthy();
  });

  test('GET /api/v1/health/metrics should return Prometheus metrics', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/v1/health/metrics`);
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text).toContain('process_uptime_seconds');
    expect(text).toContain('process_heap_used_bytes');
    expect(text).toContain('process_rss_bytes');
  });

  test('GET /api/v1/health/version should return version info', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/v1/health/version`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.name).toBe('gentle-reminder-api');
    expect(body.version).toBeTruthy();
    expect(body.nodeVersion).toBeTruthy();
  });
});

test.describe('API Notification Endpoints', () => {
  test('GET /api/v1/notifications should require auth', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/v1/notifications`);
    expect(response.status()).toBe(401);
  });

  test('GET /api/v1/notifications/preferences should require auth', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/v1/notifications/preferences`);
    expect(response.status()).toBe(401);
  });
});
