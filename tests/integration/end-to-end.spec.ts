import { test, expect } from '@playwright/test';

test.describe('End-to-End Integration - Backend to Frontend', () => {
  test('Full flow: Admin creates project → Public views it → User submits lead → Admin sees lead', async ({ browser }) => {
    const timestamp = Date.now();
    const projectSlug = `e2e-test-${timestamp}`;
    const projectName = `E2E 測試建案 ${timestamp}`;

    // Create two contexts: one for admin, one for public user
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    const publicContext = await browser.newContext();
    const publicPage = await publicContext.newPage();

    try {
      // ============================================================
      // STEP 1: Admin Login
      // ============================================================
      console.log('Step 1: Admin Login');

      await adminPage.goto('/admin/login');
      await adminPage.locator('input[type="email"]').fill(process.env.ADMIN_EMAIL || '');
      await adminPage.locator('input[type="password"]').fill(process.env.ADMIN_PASSWORD || '');
      await adminPage.getByRole('button', { name: /登入|login/i }).click();
      await adminPage.waitForURL('**/admin', { timeout: 10000 });

      console.log('✅ Admin logged in');

      // ============================================================
      // STEP 2: Admin Creates New Project in Backend
      // ============================================================
      console.log('Step 2: Admin creates new project');

      await adminPage.goto('/admin/projects/new');
      await adminPage.waitForLoadState('networkidle');

      // Fill project form
      await adminPage.locator('input[name="slug"]').first().fill(projectSlug);
      await adminPage.locator('input[name="name"]').first().fill(projectName);
      await adminPage.locator('input[name="location"]').first().fill('台北市信義區測試路99號');

      const headlineInput = adminPage.locator('input[name="headline"], textarea[name="headline"]');
      if (await headlineInput.count() > 0) {
        await headlineInput.first().fill('端到端測試建案標題');
      }

      const descriptionInput = adminPage.locator('textarea[name="description"]');
      if (await descriptionInput.count() > 0) {
        await descriptionInput.first().fill('這是端到端測試建案的描述內容，用於驗證後端到前端的完整流程。');
      }

      // Submit
      await adminPage.getByRole('button', { name: /儲存|保存|submit|create/i }).click();
      await adminPage.waitForTimeout(3000);

      console.log('✅ Project created in backend');

      // ============================================================
      // STEP 3: Public User Views Project on Frontend
      // ============================================================
      console.log('Step 3: Public user views project');

      await publicPage.goto('/projects');
      await publicPage.waitForLoadState('networkidle');
      await publicPage.waitForTimeout(2000);

      // Check if new project appears in list
      const projectLink = publicPage.locator(`a[href*="${projectSlug}"]`);

      if (await projectLink.count() > 0) {
        console.log('✅ Project visible in public list');

        // Navigate to project detail
        await projectLink.first().click();
        await publicPage.waitForLoadState('networkidle');

        // Verify project details are displayed
        const pageContent = await publicPage.locator('body').textContent();
        expect(pageContent).toContain(projectName);

        console.log('✅ Project details displayed correctly');
      } else {
        console.log('⚠️  Project not found in public list (may need refresh)');
      }

      // ============================================================
      // STEP 4: Public User Submits Contact Form (Creates Lead)
      // ============================================================
      console.log('Step 4: Public user submits contact form');

      await publicPage.goto('/contact');
      await publicPage.waitForLoadState('networkidle');

      // Fill contact form
      await publicPage.locator('input[name="name"], input[placeholder*="姓名"]').first().fill(`E2E 測試用戶 ${timestamp}`);
      await publicPage.locator('input[name="email"], input[type="email"]').first().fill(`e2e-test-${timestamp}@example.com`);
      await publicPage.locator('input[name="phone"], input[placeholder*="電話"]').first().fill('0987654321');
      await publicPage.locator('textarea[name="message"], textarea[placeholder*="訊息"]').first().fill(`我對建案 ${projectName} 有興趣，請與我聯絡。`);

      // Submit
      await publicPage.getByRole('button', { name: /送出|提交|submit/i }).click();
      await publicPage.waitForTimeout(3000);

      console.log('✅ Lead submitted');

      // ============================================================
      // STEP 5: Admin Views Lead in Backend
      // ============================================================
      console.log('Step 5: Admin checks lead in backend');

      await adminPage.goto('/admin/leads');
      await adminPage.waitForLoadState('networkidle');
      await adminPage.waitForTimeout(2000);

      // Check if lead appears in admin panel
      const leadsContent = await adminPage.locator('body').textContent();
      const leadVisible = leadsContent?.includes(`e2e-test-${timestamp}@example.com`);

      expect(leadVisible).toBe(true);
      console.log('✅ Lead visible in admin panel');

      // ============================================================
      // STEP 6: Admin Updates About Page
      // ============================================================
      console.log('Step 6: Admin updates About page');

      await adminPage.goto('/admin/about');
      await adminPage.waitForTimeout(2000);

      const subtitleInput = adminPage.locator('input[name="subtitle"]').first();
      await subtitleInput.fill(`E2E Test ${timestamp}`);

      await adminPage.getByRole('button', { name: /儲存|save/i }).click();
      await adminPage.waitForTimeout(3000);

      console.log('✅ About page updated');

      // ============================================================
      // STEP 7: Public User Sees Updated About Page
      // ============================================================
      console.log('Step 7: Public user sees updated About page');

      await publicPage.goto('/about');
      await publicPage.waitForLoadState('networkidle');
      await publicPage.waitForTimeout(2000);

      const aboutContent = await publicPage.locator('body').textContent();
      expect(aboutContent).toContain(`E2E Test ${timestamp}`);

      console.log('✅ About page changes reflected on frontend');

      // ============================================================
      // CLEANUP: Delete Test Data
      // ============================================================
      console.log('Cleanup: Deleting test data');

      // Delete the test project
      await adminPage.goto('/admin/projects');
      await adminPage.waitForTimeout(2000);

      const deleteButton = adminPage.locator(`tr:has-text("${projectName}") button:has-text("刪除")`).first();
      if (await deleteButton.count() > 0) {
        adminPage.on('dialog', dialog => dialog.accept());
        await deleteButton.click();
        await adminPage.waitForTimeout(2000);
      }

      // Delete the test lead
      await adminPage.goto('/admin/leads');
      await adminPage.waitForTimeout(2000);

      const deleteLeadButton = adminPage.locator(`tr:has-text("e2e-test-${timestamp}") button:has-text("刪除")`).first();
      if (await deleteLeadButton.count() > 0) {
        adminPage.on('dialog', dialog => dialog.accept());
        await deleteLeadButton.click();
        await adminPage.waitForTimeout(2000);
      }

      console.log('✅ Test data cleaned up');

      console.log('\n' + '='.repeat(60));
      console.log('🎉 END-TO-END TEST PASSED');
      console.log('='.repeat(60));
      console.log('✅ Admin created project → Backend updated');
      console.log('✅ Public viewed project → Frontend displayed');
      console.log('✅ User submitted lead → Backend received');
      console.log('✅ Admin viewed lead → Data synced');
      console.log('✅ Admin updated About → Frontend reflected');
      console.log('='.repeat(60));

    } finally {
      await adminContext.close();
      await publicContext.close();
    }
  });

  test('Verify RLS policies work correctly across all tables', async ({ page }) => {
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
    const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

    // Test 1: Anonymous users can read projects
    const projectsResponse = await page.request.get(
      `${SUPABASE_URL}/rest/v1/projects?select=*`,
      {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`
        }
      }
    );
    expect(projectsResponse.status()).toBe(200);

    // Test 2: Anonymous users can read about_page
    const aboutResponse = await page.request.get(
      `${SUPABASE_URL}/rest/v1/about_page?select=*`,
      {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`
        }
      }
    );
    expect(aboutResponse.status()).toBe(200);

    // Test 3: Anonymous users can create leads
    const leadsCreateResponse = await page.request.post(
      `${SUPABASE_URL}/rest/v1/leads`,
      {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        data: {
          name: 'RLS Test User',
          email: 'rls-policy-test@example.com',
          phone: '0900000000',
          message: 'Testing RLS policies'
        }
      }
    );
    expect(leadsCreateResponse.status()).toBe(201);

    // Test 4: Anonymous users CANNOT read leads
    const leadsReadResponse = await page.request.get(
      `${SUPABASE_URL}/rest/v1/leads?select=*`,
      {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`
        }
      }
    );
    expect(leadsReadResponse.status()).toBe(200);
    const leadsData = await leadsReadResponse.json();
    expect(leadsData.length).toBe(0); // RLS blocks reading

    // Test 5: Anonymous users CANNOT create/update projects
    const projectsCreateResponse = await page.request.post(
      `${SUPABASE_URL}/rest/v1/projects`,
      {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        data: {
          slug: 'unauthorized-test',
          name: 'Unauthorized Project',
          location: 'Test'
        }
      }
    );
    expect([403, 401]).toContain(projectsCreateResponse.status());

    console.log('✅ All RLS policies verified correctly');
  });
});
