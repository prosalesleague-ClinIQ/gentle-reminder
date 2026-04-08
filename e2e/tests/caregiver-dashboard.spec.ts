import { test, expect } from '@playwright/test';

test.describe('Caregiver Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the dashboard home page', async ({ page }) => {
    await expect(page).toHaveTitle(/Gentle Reminder/);
    // Dashboard should show patient overview section
    await expect(page.getByText(/Patient Overview|Dashboard/i)).toBeVisible();
  });

  test('should navigate to care tasks page', async ({ page }) => {
    await page.click('text=Care Tasks');
    await expect(page.getByText(/Tasks|Urgent|Daily/i)).toBeVisible();
  });

  test('should navigate to patients page', async ({ page }) => {
    await page.click('text=Patients');
    await expect(page.getByText(/Patient|Score|Status/i)).toBeVisible();
  });

  test('should navigate to alerts page', async ({ page }) => {
    await page.click('text=Alerts');
    await expect(page.getByText(/Alert|Risk|Notification/i)).toBeVisible();
  });

  test('should navigate to analytics page', async ({ page }) => {
    await page.click('text=Analytics');
    await expect(page.getByText(/Trend|Score|Engagement/i)).toBeVisible();
  });

  test('should navigate to shift handoff page', async ({ page }) => {
    await page.click('text=Shift Handoff');
    await expect(page.getByText(/Handoff|Shift|Notes/i)).toBeVisible();
  });

  test('should navigate to messaging page', async ({ page }) => {
    await page.click('text=Messages');
    await expect(page.getByText(/Message|Conversation|Send/i)).toBeVisible();
  });

  test('should display sidebar navigation items', async ({ page }) => {
    const sidebar = page.locator('aside, nav').first();
    await expect(sidebar).toBeVisible();
    // Should have key navigation items
    for (const item of ['Dashboard', 'Patients', 'Alerts']) {
      await expect(page.getByText(item).first()).toBeVisible();
    }
  });

  test('should have responsive layout on iPad', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    await expect(page.getByText(/Gentle Reminder/i).first()).toBeVisible();
  });
});

test.describe('Caregiver Dashboard - Patient Detail', () => {
  test('should show patient cognitive scores', async ({ page }) => {
    await page.goto('/');
    // Navigate to a patient
    await page.click('text=Patients');
    // Click first patient row (demo data)
    const patientRow = page.locator('tr, [data-testid="patient-row"]').nth(1);
    if (await patientRow.isVisible()) {
      await patientRow.click();
      // Should show patient detail with scores
      await expect(page.getByText(/Score|Cognitive|Session/i)).toBeVisible();
    }
  });
});

test.describe('Caregiver Dashboard - Accessibility', () => {
  test('should have no missing alt text on images', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // Should have a focused element
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});
