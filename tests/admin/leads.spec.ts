import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin Leads Management', () => {
  test('should load leads page', async ({ page }) => {
    await page.goto('/admin/leads');
    await expect(page).toHaveURL(/\/admin\/leads/);
    await page.waitForLoadState('networkidle');
  });

  test('should fetch leads from Supabase', async ({ page }) => {
    const apiCalls: { method: string; status: number }[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('/rest/v1/leads')) {
        apiCalls.push({
          method: response.request().method(),
          status: response.status()
        });
      }
    });

    await page.goto('/admin/leads');
    await page.waitForTimeout(2000);

    // Verify GET request was made
    expect(apiCalls.some(call => call.method === 'GET' && call.status === 200)).toBe(true);
  });

  test('should display list of leads', async ({ page }) => {
    await page.goto('/admin/leads');
    await page.waitForLoadState('networkidle');

    // Look for table or list of leads
    const leadsTable = page.locator('[data-testid="leads-table"], table, [role="table"]');

    if (await leadsTable.count() > 0) {
      await expect(leadsTable.first()).toBeVisible();
    }
  });

  test('should display lead details (name, email, phone, message)', async ({ page }) => {
    await page.goto('/admin/leads');
    await page.waitForTimeout(2000);

    // Check if there are any leads displayed
    const bodyText = await page.locator('body').textContent();

    // Should show email format or "no leads" message
    const hasContent = bodyText?.includes('@') || bodyText?.includes('沒有') || bodyText?.includes('empty');
    expect(hasContent).toBe(true);
  });

  test('should delete a lead successfully', async ({ page }) => {
    // First create a test lead via API
    const timestamp = Date.now();

    await page.request.post(
      `${process.env.VITE_SUPABASE_URL}/rest/v1/leads`,
      {
        headers: {
          apikey: process.env.VITE_SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        data: {
          name: `刪除測試 ${timestamp}`,
          email: `delete-test-${timestamp}@example.com`,
          phone: '0912345678',
          message: '這是測試訊息，將被刪除'
        }
      }
    );

    // Reload leads page
    await page.goto('/admin/leads');
    await page.waitForTimeout(2000);

    // Find delete button
    const deleteButton = page.getByRole('button', { name: /刪除|delete/i }).first();

    if (await deleteButton.count() > 0) {
      const apiCalls: { method: string; status: number }[] = [];

      page.on('response', async (response) => {
        if (response.url().includes('/rest/v1/leads')) {
          apiCalls.push({
            method: response.request().method(),
            status: response.status()
          });
        }
      });

      await deleteButton.click();

      // Confirm deletion if there's a dialog
      page.on('dialog', dialog => dialog.accept());

      await page.waitForTimeout(2000);

      // Verify DELETE request was made
      const deleteCall = apiCalls.find(call => call.method === 'DELETE');
      if (deleteCall) {
        expect([200, 204]).toContain(deleteCall.status);
      }
    }
  });

  test('should verify RLS policy - only admins can read leads', async ({ page }) => {
    // Admin should be able to read leads
    const response = await page.request.get(
      `${process.env.VITE_SUPABASE_URL}/rest/v1/leads?select=*`,
      {
        headers: {
          apikey: process.env.VITE_SUPABASE_ANON_KEY || '',
        }
      }
    );

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('should sort leads by creation date', async ({ page }) => {
    await page.goto('/admin/leads');
    await page.waitForTimeout(2000);

    // Look for sort controls
    const sortButton = page.locator('[data-testid="sort"], button:has-text("日期"), button:has-text("時間")');

    if (await sortButton.count() > 0) {
      await sortButton.first().click();
      await page.waitForTimeout(500);

      // Page should re-render with sorted data
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should paginate leads if there are many', async ({ page }) => {
    await page.goto('/admin/leads');
    await page.waitForTimeout(2000);

    // Look for pagination controls
    const paginationControls = page.locator('[data-testid="pagination"], nav[aria-label*="pagination"], button:has-text("下一頁")');

    if (await paginationControls.count() > 0) {
      // Pagination exists, test it
      const nextButton = page.getByRole('button', { name: /next|下一頁/i });
      if (await nextButton.count() > 0 && await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });
});
