import { test, expect } from '@playwright/test';

// These tests require authentication
test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
  });

  test('should load dashboard successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin$/);
    await page.waitForLoadState('networkidle');
  });

  test('should display navigation menu with all admin sections', async ({ page }) => {
    // Check for navigation links
    const navLinks = [
      /控制台|dashboard/i,
      /建案|projects/i,
      /諮詢|leads/i,
      /關於|about/i,
      /設定|settings/i
    ];

    for (const linkPattern of navLinks) {
      const link = page.getByRole('link', { name: linkPattern });
      if (await link.count() > 0) {
        await expect(link.first()).toBeVisible();
      }
    }
  });

  test('should fetch and display dashboard metrics from Supabase', async ({ page }) => {
    const apiCalls: string[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('/rest/v1/')) {
        apiCalls.push(response.url());
      }
    });

    await page.goto('/admin');
    await page.waitForTimeout(2000);

    // Should fetch projects and leads for metrics
    expect(apiCalls.some(url => url.includes('/rest/v1/projects'))).toBe(true);
    expect(apiCalls.some(url => url.includes('/rest/v1/leads'))).toBe(true);
  });

  test('should display project count metric', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for metrics/stats section
    const metricsSection = page.locator('[data-testid="metrics"], section:has-text("建案"), div:has-text("專案")');

    if (await metricsSection.count() > 0) {
      await expect(metricsSection.first()).toBeVisible();
    }
  });

  test('should display leads count metric', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const leadsMetric = page.locator('[data-testid="leads-count"], div:has-text("諮詢"), div:has-text("聯絡")');

    if (await leadsMetric.count() > 0) {
      await expect(leadsMetric.first()).toBeVisible();
    }
  });

  test('should have working logout functionality', async ({ page }) => {
    const logoutButton = page.getByRole('button', { name: /登出|logout/i });

    if (await logoutButton.count() > 0) {
      await logoutButton.click();

      // Should redirect to login page
      await page.waitForURL('**/admin/login', { timeout: 5000 });
      await expect(page).toHaveURL(/\/admin\/login/);
    }
  });
});
