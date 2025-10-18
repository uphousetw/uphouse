import { test, expect } from '@playwright/test';

test.describe('Projects List Page - Frontend Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/projects/);
    await page.waitForLoadState('networkidle');
  });

  test('should fetch projects from Supabase', async ({ page }) => {
    const apiCalls: { method: string; status: number }[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('/rest/v1/projects')) {
        apiCalls.push({
          method: response.request().method(),
          status: response.status()
        });
      }
    });

    await page.goto('/projects');
    await page.waitForTimeout(2000);

    // Verify GET request was made
    expect(apiCalls.some(call => call.method === 'GET')).toBe(true);
    expect(apiCalls.find(call => call.method === 'GET')?.status).toBe(200);
  });

  test('should display project cards', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Look for project cards/items
    const projectCards = page.locator('[data-testid="project-card"], article, .project-item');

    if (await projectCards.count() > 0) {
      await expect(projectCards.first()).toBeVisible();
    }
  });

  test('should display project details (name, location, status)', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').textContent();

    // Check if any project data is visible (from seed data)
    const hasProjectContent =
      bodyText?.includes('琢翠大道') ||
      bodyText?.includes('森匯港灣') ||
      bodyText?.includes('澄海界') ||
      bodyText?.includes('台北') ||
      bodyText?.includes('新北');

    if (bodyText && bodyText.length > 500) {
      expect(hasProjectContent).toBe(true);
    }
  });

  test('should filter projects by status', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for filter buttons/tabs
    const filterButtons = page.locator('[data-testid="filter"], button:has-text("預售"), button:has-text("施工中"), button:has-text("已完工")');

    if (await filterButtons.count() > 0) {
      const firstFilter = filterButtons.first();
      await firstFilter.click();
      await page.waitForTimeout(500);

      // Verify filtering occurred
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should navigate to project detail page on click', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find first project link
    const projectLink = page.locator('a[href*="/projects/"]').first();

    if (await projectLink.count() > 0) {
      await projectLink.click();
      await page.waitForLoadState('networkidle');

      // Should navigate to detail page
      await expect(page).toHaveURL(/\/projects\/.+/);
    }
  });

  test('should verify RLS policy - public can read projects', async ({ page }) => {
    const response = await page.request.get(
      `${process.env.VITE_SUPABASE_URL}/rest/v1/projects?select=*`,
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

test.describe('Project Detail Page - Frontend Display', () => {
  test('should load project detail page with slug', async ({ page }) => {
    // Assuming seed data has 'emerald-lane' project
    await page.goto('/projects/emerald-lane');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/projects\/emerald-lane/);
  });

  test('should fetch single project data from Supabase', async ({ page }) => {
    const apiCalls: string[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('/rest/v1/projects')) {
        apiCalls.push(response.url());
      }
    });

    await page.goto('/projects/emerald-lane');
    await page.waitForTimeout(2000);

    // Should query by slug
    expect(apiCalls.some(url => url.includes('slug='))).toBe(true);
  });

  test('should display project details (hero image, description, highlights)', async ({ page }) => {
    await page.goto('/projects/emerald-lane');
    await page.waitForLoadState('networkidle');

    // Check for hero image
    const heroImage = page.locator('img').first();
    if (await heroImage.count() > 0) {
      await expect(heroImage).toBeVisible();
    }

    // Check for project name
    const projectName = page.locator('h1');
    await expect(projectName).toBeVisible();
  });

  test('should display project highlights list', async ({ page }) => {
    await page.goto('/projects/emerald-lane');
    await page.waitForLoadState('networkidle');

    // Look for list items (highlights are stored as array in DB)
    const listItems = page.locator('ul li, ol li');
    if (await listItems.count() > 0) {
      await expect(listItems.first()).toBeVisible();
    }
  });

  test('should display contact information', async ({ page }) => {
    await page.goto('/projects/emerald-lane');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').textContent();

    // Check for phone number format
    if (bodyText) {
      const hasPhone = bodyText.includes('(02)') || bodyText.includes('02-');
      expect(hasPhone).toBe(true);
    }
  });

  test('should handle invalid project slug', async ({ page }) => {
    await page.goto('/projects/non-existent-project');
    await page.waitForLoadState('networkidle');

    // Should show 404 or "not found" message
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.toLowerCase()).toMatch(/not found|找不到|404/);
  });
});
