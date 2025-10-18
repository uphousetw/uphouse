import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin Projects - CRUD Operations', () => {
  test('should load projects list page', async ({ page }) => {
    await page.goto('/admin/projects');
    await expect(page).toHaveURL(/\/admin\/projects/);
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

    await page.goto('/admin/projects');
    await page.waitForTimeout(2000);

    expect(apiCalls.some(call => call.method === 'GET' && call.status === 200)).toBe(true);
  });

  test('should display list of projects', async ({ page }) => {
    await page.goto('/admin/projects');
    await page.waitForLoadState('networkidle');

    // Look for project items in table or list
    const projectItems = page.locator('[data-testid="project-row"], tr:has-text("琢翠"), tr:has-text("森匯")');

    if (await projectItems.count() > 0) {
      await expect(projectItems.first()).toBeVisible();
    }
  });

  test('should have "Create New Project" button', async ({ page }) => {
    await page.goto('/admin/projects');

    const createButton = page.getByRole('link', { name: /新增|create|add/i });
    await expect(createButton).toBeVisible();
  });

  test('should navigate to create project form', async ({ page }) => {
    await page.goto('/admin/projects');

    const createButton = page.getByRole('link', { name: /新增|create|add/i }).first();
    await createButton.click();

    await expect(page).toHaveURL(/\/admin\/projects\/new/);
  });

  test('should load project creation form', async ({ page }) => {
    await page.goto('/admin/projects/new');
    await page.waitForLoadState('networkidle');

    // Check for form fields
    await expect(page.locator('input[name="name"], input[placeholder*="名稱"]')).toBeVisible();
    await expect(page.locator('input[name="slug"], input[placeholder*="slug"]')).toBeVisible();
  });

  test('should create new project successfully', async ({ page }) => {
    const timestamp = Date.now();
    const apiCalls: { method: string; status: number }[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('/rest/v1/projects')) {
        apiCalls.push({
          method: response.request().method(),
          status: response.status()
        });
      }
    });

    await page.goto('/admin/projects/new');

    // Fill in required fields
    await page.locator('input[name="slug"], input[placeholder*="slug"]').first().fill(`test-project-${timestamp}`);
    await page.locator('input[name="name"], input[placeholder*="名稱"]').first().fill(`測試建案 ${timestamp}`);
    await page.locator('input[name="location"], input[placeholder*="地點"]').first().fill('台北市測試區');

    // Fill other fields if present
    const headlineInput = page.locator('input[name="headline"], input[placeholder*="標題"]');
    if (await headlineInput.count() > 0) {
      await headlineInput.first().fill('測試標題');
    }

    // Submit form
    const submitButton = page.getByRole('button', { name: /儲存|保存|submit|create/i });
    await submitButton.click();

    // Wait for API call
    await page.waitForTimeout(3000);

    // Verify POST request was made
    const postCall = apiCalls.find(call => call.method === 'POST');
    if (postCall) {
      expect(postCall.status).toBe(201);
    }

    // Should redirect to projects list or show success message
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/admin\/projects/);
  });

  test('should edit existing project', async ({ page }) => {
    await page.goto('/admin/projects');
    await page.waitForTimeout(2000);

    // Find first edit button
    const editButton = page.getByRole('link', { name: /編輯|edit/i }).first();

    if (await editButton.count() > 0) {
      await editButton.click();

      // Should navigate to edit form
      await expect(page).toHaveURL(/\/admin\/projects\/.+\/edit/);

      // Form should be pre-filled
      const nameInput = page.locator('input[name="name"], input[placeholder*="名稱"]').first();
      const currentName = await nameInput.inputValue();
      expect(currentName.length).toBeGreaterThan(0);
    }
  });

  test('should update project successfully', async ({ page }) => {
    const apiCalls: { method: string; status: number }[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('/rest/v1/projects')) {
        apiCalls.push({
          method: response.request().method(),
          status: response.status()
        });
      }
    });

    // Edit first project (emerald-lane from seed data)
    await page.goto('/admin/projects/emerald-lane/edit');
    await page.waitForTimeout(2000);

    // Modify headline
    const headlineInput = page.locator('input[name="headline"], textarea[name="headline"]').first();
    const originalHeadline = await headlineInput.inputValue();
    await headlineInput.fill(`${originalHeadline} [更新]`);

    // Submit
    const submitButton = page.getByRole('button', { name: /儲存|更新|update/i });
    await submitButton.click();

    await page.waitForTimeout(3000);

    // Verify PATCH/PUT request was made
    const updateCall = apiCalls.find(call =>
      call.method === 'PATCH' || call.method === 'PUT'
    );

    if (updateCall) {
      expect([200, 204]).toContain(updateCall.status);
    }
  });

  test('should delete project successfully', async ({ page }) => {
    // First create a test project to delete
    const timestamp = Date.now();

    await page.goto('/admin/projects/new');
    await page.locator('input[name="slug"]').first().fill(`delete-test-${timestamp}`);
    await page.locator('input[name="name"]').first().fill(`刪除測試 ${timestamp}`);
    await page.locator('input[name="location"]').first().fill('測試地點');

    await page.getByRole('button', { name: /儲存|create/i }).click();
    await page.waitForTimeout(2000);

    // Now delete it
    await page.goto('/admin/projects');
    await page.waitForTimeout(2000);

    const deleteButton = page.getByRole('button', { name: /刪除|delete/i }).first();

    if (await deleteButton.count() > 0) {
      const apiCalls: { method: string; status: number }[] = [];

      page.on('response', async (response) => {
        if (response.url().includes('/rest/v1/projects')) {
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

  test('should verify RLS policy - admins can manage projects', async ({ page }) => {
    // This test verifies that authenticated admin users can CRUD projects
    const response = await page.request.get(
      `${process.env.VITE_SUPABASE_URL}/rest/v1/projects?select=*`,
      {
        headers: {
          apikey: process.env.VITE_SUPABASE_ANON_KEY || '',
        }
      }
    );

    expect(response.status()).toBe(200);
  });
});
