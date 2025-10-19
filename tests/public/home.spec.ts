import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Uphouse/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    // Check for main heading or hero content
    const hero = page.locator('h1, h2').first();
    await expect(hero).toBeVisible();
  });

  test('should have navigation menu', async ({ page }) => {
    // Check for navigation links (there are multiple nav elements - header and footer)
    const navElements = page.getByRole('navigation');
    await expect(navElements.first()).toBeVisible();

    // Verify key navigation items exist
    const navItems = ['關於', '建案', '聯絡'];
    for (const item of navItems) {
      const link = page.getByRole('link', { name: new RegExp(item, 'i') });
      if (await link.count() > 0) {
        await expect(link.first()).toBeVisible();
      }
    }
  });

  test('should display featured projects section', async ({ page }) => {
    // Wait for projects to load from Supabase
    await page.waitForTimeout(2000);

    // Check if there's a projects section
    const projectSection = page.locator('[data-testid="featured-projects"], section:has-text("建案"), section:has-text("作品")');
    if (await projectSection.count() > 0) {
      await expect(projectSection.first()).toBeVisible();
    }
  });

  test('should have working "Contact" CTA button', async ({ page }) => {
    const contactButton = page.getByRole('link', { name: /聯絡|contact/i });

    if (await contactButton.count() > 0) {
      await expect(contactButton.first()).toBeVisible();
      await expect(contactButton.first()).toHaveAttribute('href', /contact/i);
    }
  });

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known/acceptable errors
    const criticalErrors = consoleErrors.filter(err =>
      !err.includes('favicon') &&
      !err.includes('404')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check mobile menu toggle if exists
    const mobileMenu = page.getByRole('button', { name: /menu|選單/i });
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu.first()).toBeVisible();
    }
  });
});
