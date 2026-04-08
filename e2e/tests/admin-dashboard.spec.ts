import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  const baseURL = process.env.ADMIN_URL || 'http://localhost:3002';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
  });

  test('should load admin dashboard home', async ({ page }) => {
    await expect(page).toHaveTitle(/Admin/);
    await expect(page.getByText(/Dashboard/i).first()).toBeVisible();
  });

  test('should navigate to users management', async ({ page }) => {
    await page.click('text=Users');
    await expect(page.getByText(/Users/i).first()).toBeVisible();
    // Should show user table
    await expect(page.getByText(/Email|Role|Status/i).first()).toBeVisible();
  });

  test('should navigate to facilities page', async ({ page }) => {
    await page.click('text=Facilities');
    await expect(page.getByText(/Facilit/i).first()).toBeVisible();
  });

  test('should navigate to billing page', async ({ page }) => {
    await page.click('text=Billing');
    await expect(page.getByText(/Billing|Revenue|Plan/i).first()).toBeVisible();
  });

  test('should navigate to compliance page', async ({ page }) => {
    await page.click('text=Compliance');
    await expect(page.getByText(/Compliance|HIPAA|Audit/i).first()).toBeVisible();
  });

  test('should navigate to audit log', async ({ page }) => {
    await page.click('text=Audit Log');
    await expect(page.getByText(/Audit|Event|Action/i).first()).toBeVisible();
  });

  test('should navigate to tenants page', async ({ page }) => {
    await page.click('text=Tenants');
    await expect(page.getByText(/Tenant|Organization/i).first()).toBeVisible();
  });

  test('should navigate to system health page', async ({ page }) => {
    await page.click('text=System Health');
    await expect(page.getByText(/System|Status|Service/i).first()).toBeVisible();
  });

  test('should filter users by role', async ({ page }) => {
    await page.click('text=Users');
    // Click on a role filter tab
    await page.click('text=Clinicians');
    // Verify filter applied
    await expect(page.getByText(/clinician/i).first()).toBeVisible();
  });

  test('should display API keys management', async ({ page }) => {
    await page.click('text=API Keys');
    await expect(page.getByText(/API|Key|Secret/i).first()).toBeVisible();
  });
});
