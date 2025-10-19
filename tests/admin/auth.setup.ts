import { test as setup } from '@playwright/test';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });
config();

const authFile = 'playwright/.auth/admin.json';

/**
 * Setup authentication for admin tests
 * This runs once before all admin tests
 */
setup('authenticate as admin', async ({ page }) => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
  }

  // Navigate to login page
  await page.goto('/admin/login');

  // Fill in credentials
  await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);

  // Click login button
  await page.getByRole('button', { name: /登入|login/i }).click();

  // Wait for redirect to admin dashboard
  await page.waitForURL('**/admin', { timeout: 10000 });

  // Save authenticated state
  await page.context().storageState({ path: authFile });

  console.log('✅ Admin authentication setup complete');
});
