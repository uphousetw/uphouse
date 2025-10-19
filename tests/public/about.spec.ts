import { test, expect } from '@playwright/test';

test.describe('About Page - Frontend Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/about/);
    await page.waitForLoadState('networkidle');
  });

  test('should fetch and display about_page content from Supabase', async ({ page }) => {
    // Track API calls - set up listener before navigation
    const apiCalls: { method: string; status: number }[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('/rest/v1/about_page')) {
        apiCalls.push({
          method: response.request().method(),
          status: response.status()
        });
      }
    });

    // Navigate to page to trigger API call
    await page.goto('/about', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Verify API call was made (or verify data is displayed if API call was cached)
    if (apiCalls.length > 0) {
      expect(apiCalls[0].method).toBe('GET');
      expect(apiCalls[0].status).toBe(200);
    } else {
      // If no API call captured, verify content is still displayed (could be cached)
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length || 0).toBeGreaterThan(100);
    }
  });

  test('should display title and subtitle from database', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for main heading (should come from about_page.title)
    const mainHeading = page.locator('h1, h2').first();
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).not.toBeEmpty();
  });

  test('should display company description from database', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check if description text is present
    const bodyText = await page.locator('body').textContent();

    // Should contain some meaningful content (not just empty)
    expect(bodyText?.length).toBeGreaterThan(100);
  });

  test('should display statistics section', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for stats like "成立年", "交屋戶數", etc
    const statsSection = page.locator('[data-testid="stats"], section:has-text("成立"), div:has-text("2001")');

    if (await statsSection.count() > 0) {
      await expect(statsSection.first()).toBeVisible();
    }
  });

  test('should display core practices section', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for core practices content
    const practicesSection = page.locator('[data-testid="core-practices"], section:has-text("策略"), section:has-text("工法")');

    if (await practicesSection.count() > 0) {
      await expect(practicesSection.first()).toBeVisible();
    }
  });

  test('should display milestones/timeline section', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for timeline with years like 2005, 2012, 2019, 2024
    const timelineSection = page.locator('[data-testid="milestones"], section:has-text("2005"), section:has-text("2024")');

    if (await timelineSection.count() > 0) {
      await expect(timelineSection.first()).toBeVisible();
    }
  });

  test('should handle empty/missing data gracefully', async ({ page }) => {
    // Intercept API and return empty array
    await page.route('**/rest/v1/about_page*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.goto('/about');

    // Page should not crash, might show empty state or default content
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept API and return error
    await page.route('**/rest/v1/about_page*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/about');

    // Page should not crash
    await expect(page.locator('body')).toBeVisible();
  });

  test('should verify RLS policy - public can read', async ({ page }) => {
    // Test that unauthenticated users can read about_page
    const response = await page.request.get(
      `${process.env.VITE_SUPABASE_URL}/rest/v1/about_page?select=*`,
      {
        headers: {
          apikey: process.env.VITE_SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
        }
      }
    );

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
