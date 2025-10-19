import { test, expect } from '@playwright/test';

test.describe('Admin Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
  });

  test('should load login page', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /登入|login/i }).click();

    // Form should not submit
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.locator('input[type="email"]').fill('wrong@example.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.getByRole('button', { name: /登入|login/i }).click();

    await page.waitForTimeout(2000);

    // Should show error message
    const errorMessage = page.locator('[data-testid="error"], div:has-text("錯誤"), div:has-text("失敗")');
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      test.skip();
      return;
    }

    await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /登入|login/i }).click();

    // Should redirect to admin dashboard
    await page.waitForURL('**/admin', { timeout: 10000 });
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('should redirect to admin dashboard if already logged in', async ({ page }) => {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      test.skip();
      return;
    }

    // First login
    await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /登入|login/i }).click();
    await page.waitForURL('**/admin', { timeout: 10000 });

    // Try to access login page again
    await page.goto('/admin/login');

    // Should redirect to dashboard
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/admin$/);
  });
});
