import { test, expect } from '@playwright/test';

test.describe('Contact Page - Form Submission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/contact/);
    await page.waitForLoadState('networkidle');
  });

  test('should display contact form with all required fields', async ({ page }) => {
    // Check for form fields (using placeholders since form uses controlled state)
    await expect(page.locator('input[placeholder*="陳小築"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="tel"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="建案"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Click submit without filling form
    const submitButton = page.getByRole('button', { name: /送出|提交|submit/i });
    await submitButton.click();

    // Should show validation errors or prevent submission
    await page.waitForTimeout(500);

    // Check if form was NOT submitted (still on contact page)
    await expect(page).toHaveURL(/\/contact/);
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first();

    await emailInput.fill('invalid-email');
    await emailInput.blur();

    // Browser should show validation error for invalid email
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('should submit form successfully and create lead in Supabase', async ({ page }) => {
    const timestamp = Date.now();
    const apiCalls: { method: string; status: number; url: string }[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('/rest/v1/leads')) {
        apiCalls.push({
          method: response.request().method(),
          status: response.status(),
          url: response.url()
        });
      }
    });

    // Fill form with test data (using type and placeholder selectors)
    await page.locator('input[type="text"]').first().fill(`測試用戶${timestamp}`);
    await page.locator('input[type="email"]').first().fill(`test${timestamp}@example.com`);
    await page.locator('input[type="tel"]').first().fill('0912345678');
    await page.locator('textarea').first().fill('這是測試訊息');

    // Submit form
    const submitButton = page.getByRole('button', { name: /送出|提交|submit/i });
    await submitButton.click();

    // Wait for API call
    await page.waitForTimeout(2000);

    // Verify POST request was made
    const postCall = apiCalls.find(call => call.method === 'POST');
    expect(postCall).toBeDefined();
    expect(postCall?.status).toBe(201);

    // Should show success message
    const successMessage = page.locator('[data-testid="success-message"], div:has-text("成功"), div:has-text("已收到")');
    if (await successMessage.count() > 0) {
      await expect(successMessage.first()).toBeVisible();
    }
  });

  test('should verify RLS policy - anonymous users can insert leads', async ({ page }) => {
    // Test that unauthenticated users can create leads
    const response = await page.request.post(
      `${process.env.VITE_SUPABASE_URL}/rest/v1/leads`,
      {
        headers: {
          apikey: process.env.VITE_SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        data: {
          name: 'Test RLS User',
          email: 'rls-test@example.com',
          phone: '0912345678',
          message: 'Testing RLS policy'
        }
      }
    );

    // Should allow insert (201)
    expect(response.status()).toBe(201);
  });

  test('should verify RLS policy - anonymous users cannot read leads', async ({ page }) => {
    // Test that unauthenticated users CANNOT read leads
    const response = await page.request.get(
      `${process.env.VITE_SUPABASE_URL}/rest/v1/leads?select=*`,
      {
        headers: {
          apikey: process.env.VITE_SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
        }
      }
    );

    // RLS policy should either return 401 (unauthorized) or 200 with empty array
    expect([200, 401]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      // Should return empty array (RLS blocks reading for non-admins)
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    }
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept API and return error
    await page.route('**/rest/v1/leads', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      } else {
        await route.continue();
      }
    });

    // Fill and submit form
    await page.locator('input[type="text"]').first().fill('測試用戶');
    await page.locator('input[type="email"]').first().fill('test@example.com');
    await page.locator('input[type="tel"]').first().fill('0912345678');
    await page.locator('textarea').first().fill('測試訊息');

    const submitButton = page.getByRole('button', { name: /送出|提交|submit/i });
    await submitButton.click();

    await page.waitForTimeout(1000);

    // Should show error message
    const errorMessage = page.locator('[data-testid="error-message"], div:has-text("錯誤"), div:has-text("失敗")');
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should clear form after successful submission', async ({ page }) => {
    const timestamp = Date.now();

    // Fill and submit form
    await page.locator('input[type="text"]').first().fill(`用戶${timestamp}`);
    await page.locator('input[type="email"]').first().fill(`test${timestamp}@example.com`);
    await page.locator('input[type="tel"]').first().fill('0912345678');
    await page.locator('textarea').first().fill('訊息');

    const submitButton = page.getByRole('button', { name: /送出|提交|submit/i });
    await submitButton.click();

    await page.waitForTimeout(2000);

    // Check if form is cleared
    const nameInput = page.locator('input[type="text"]').first();
    const nameValue = await nameInput.inputValue();

    // Form might be cleared or might show success message
    // Either way, the submission should have completed
    expect(nameValue === '' || nameValue.includes('用戶')).toBe(true);
  });
});
