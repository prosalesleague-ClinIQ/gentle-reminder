import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Gentle Reminder E2E tests.
 *
 * Tests cover:
 * - Caregiver dashboard critical flows
 * - Clinician dashboard data views
 * - Admin dashboard management pages
 * - Family dashboard portal
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['github']]
    : [['html', { open: 'on-failure' }]],
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'ipad',
      use: { ...devices['iPad Pro 11'] },
    },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev --workspace=apps/caregiver-dashboard',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
