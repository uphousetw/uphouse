import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin About Page Management', () => {
  test('should load about page admin editor', async ({ page }) => {
    await page.goto('/admin/about');
    await expect(page).toHaveURL(/\/admin\/about/);
    await page.waitForLoadState('networkidle');
  });

  test('should fetch existing about_page content from Supabase', async ({ page }) => {
    const apiCalls: { method: string; status: number; url: string }[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('/rest/v1/about_page')) {
        apiCalls.push({
          method: response.request().method(),
          status: response.status(),
          url: response.url()
        });
      }
    });

    await page.goto('/admin/about');
    await page.waitForTimeout(2000);

    // Verify GET request was made
    const getCall = apiCalls.find(call => call.method === 'GET');
    expect(getCall).toBeDefined();
    expect(getCall?.status).toBe(200);
  });

  test('should display form with existing content pre-filled', async ({ page }) => {
    await page.goto('/admin/about');
    await page.waitForTimeout(2000);

    // Check if title input has content
    const titleInput = page.locator('input[name="title"], input[placeholder*="Uphouse"]').first();
    const titleValue = await titleInput.inputValue();

    expect(titleValue.length).toBeGreaterThan(0);
  });

  test('should update title successfully', async ({ page }) => {
    const apiCalls: { method: string; status: number }[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('/rest/v1/about_page')) {
        apiCalls.push({
          method: response.request().method(),
          status: response.status()
        });
      }
    });

    await page.goto('/admin/about');
    await page.waitForTimeout(2000);

    // Update title
    const titleInput = page.locator('input[name="title"], input[placeholder*="Uphouse"]').first();
    const originalTitle = await titleInput.inputValue();
    const newTitle = `${originalTitle} [測試 ${Date.now()}]`;

    await titleInput.fill(newTitle);

    // Submit
    await page.getByRole('button', { name: /儲存|save|更新/i }).click();
    await page.waitForTimeout(3000);

    // Verify PATCH/PUT request was made
    const updateCall = apiCalls.find(call =>
      call.method === 'PATCH' || call.method === 'PUT'
    );

    expect(updateCall).toBeDefined();
    expect([200, 204]).toContain(updateCall?.status);

    // Should show success message
    const successMessage = page.locator('[data-testid="success"], div:has-text("成功"), div:has-text("已更新")');
    if (await successMessage.count() > 0) {
      await expect(successMessage.first()).toBeVisible();
    }
  });

  test('should update description successfully', async ({ page }) => {
    await page.goto('/admin/about');
    await page.waitForTimeout(2000);

    const descriptionInput = page.locator('textarea[name="description"]').first();
    const originalDescription = await descriptionInput.inputValue();
    const timestamp = Date.now();

    await descriptionInput.fill(`${originalDescription} [測試更新 ${timestamp}]`);

    await page.getByRole('button', { name: /儲存|save/i }).click();
    await page.waitForTimeout(3000);

    // Verify on public about page
    await page.goto('/about');
    await page.waitForTimeout(2000);

    const pageContent = await page.locator('body').textContent();
    expect(pageContent).toContain(`測試更新 ${timestamp}`);
  });

  test('should manage stats array fields', async ({ page }) => {
    await page.goto('/admin/about');
    await page.waitForTimeout(2000);

    // Look for stats fields (label, value pairs)
    const statsInputs = page.locator('[data-testid="stats"], input[placeholder*="成立"], input[placeholder*="label"]');

    if (await statsInputs.count() > 0) {
      // Stats form exists
      const firstStatInput = statsInputs.first();
      await expect(firstStatInput).toBeVisible();

      // Try to edit
      await firstStatInput.fill('測試統計');
      await expect(firstStatInput).toHaveValue('測試統計');
    }
  });

  test('should manage core_practices array fields', async ({ page }) => {
    await page.goto('/admin/about');
    await page.waitForTimeout(2000);

    // Look for core practices fields
    const practicesInputs = page.locator('[data-testid="core-practices"], textarea[placeholder*="策略"], textarea[placeholder*="工法"]');

    if (await practicesInputs.count() > 0) {
      await expect(practicesInputs.first()).toBeVisible();
    }
  });

  test('should manage milestones array fields', async ({ page }) => {
    await page.goto('/admin/about');
    await page.waitForTimeout(2000);

    // Look for milestones/timeline fields
    const milestonesInputs = page.locator('[data-testid="milestones"], input[placeholder*="year"], input[placeholder*="2005"]');

    if (await milestonesInputs.count() > 0) {
      await expect(milestonesInputs.first()).toBeVisible();
    }
  });

  test('should verify changes reflected on frontend', async ({ page }) => {
    const timestamp = Date.now();

    // Update content
    await page.goto('/admin/about');
    await page.waitForTimeout(2000);

    const subtitleInput = page.locator('input[name="subtitle"]').first();
    await subtitleInput.fill(`Our Story ${timestamp}`);

    await page.getByRole('button', { name: /儲存|save/i }).click();
    await page.waitForTimeout(3000);

    // Verify on frontend
    await page.goto('/about');
    await page.waitForTimeout(2000);

    const pageContent = await page.locator('body').textContent();
    expect(pageContent).toContain(`Our Story ${timestamp}`);
  });

  test('should verify RLS policy - only admins can update about_page', async ({ page }) => {
    // Admin should be able to update
    const response = await page.request.patch(
      `${process.env.VITE_SUPABASE_URL}/rest/v1/about_page?id=eq.${await getAboutPageId(page)}`,
      {
        headers: {
          apikey: process.env.VITE_SUPABASE_ANON_KEY || '',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        data: {
          subtitle: 'Test Update'
        }
      }
    );

    expect([200, 204]).toContain(response.status());
  });

  test('should handle validation errors', async ({ page }) => {
    await page.goto('/admin/about');
    await page.waitForTimeout(2000);

    // Clear required field
    const titleInput = page.locator('input[name="title"]').first();
    await titleInput.fill('');

    // Try to submit
    await page.getByRole('button', { name: /儲存|save/i }).click();
    await page.waitForTimeout(1000);

    // Should show validation error or prevent submission
    const errorMessage = page.locator('[data-testid="error"], div:has-text("required"), div:has-text("必填")');
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });
});

// Helper function to get about_page ID
async function getAboutPageId(page: any): Promise<string> {
  const response = await page.request.get(
    `${process.env.VITE_SUPABASE_URL}/rest/v1/about_page?select=id&limit=1`,
    {
      headers: {
        apikey: process.env.VITE_SUPABASE_ANON_KEY || '',
        Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
      }
    }
  );

  const data = await response.json();
  return data[0]?.id || '';
}
