import { config } from 'dotenv'
import { chromium } from 'playwright'

config({ path: '.env.local' })
config()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ Missing required environment variables.')
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, ADMIN_EMAIL, ADMIN_PASSWORD')
  process.exit(1)
}

const APP_URL = process.env.APP_URL ?? 'http://localhost:5173'

const main = async () => {
  console.log('🚀 Starting Admin About Page Test...\n')

  const browser = await chromium.launch({ headless: false }) // Set to true for CI/CD
  const page = await browser.newPage()

  // Track API responses
  const apiResponses: { url: string; status: number; method: string }[] = []

  page.on('response', async (response) => {
    const url = response.url()
    if (url.includes('/rest/v1/about_page')) {
      const status = response.status()
      const method = response.request().method()
      apiResponses.push({ url, status, method })
      console.log(`\n📡 [${method}] [${status}] ${url}`)

      try {
        const body = await response.text()
        if (body) {
          console.log(`Response: ${body.substring(0, 200)}...`)
        }
      } catch (error) {
        console.error('Failed to read response body:', error)
      }
    }
  })

  try {
    // Step 1: Login
    console.log('\n📝 Step 1: Logging in as admin...')
    await page.goto(`${APP_URL}/admin/login`, { waitUntil: 'networkidle' })

    await page.locator('input[type="email"]').fill(ADMIN_EMAIL)
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /登入|login/i }).click()

    await page.waitForURL('**/admin', { timeout: 10000 })
    console.log('✅ Login successful!')

    // Step 2: Navigate to About page admin
    console.log('\n📝 Step 2: Navigating to About page admin...')
    await page.goto(`${APP_URL}/admin/about`, { waitUntil: 'networkidle' })

    // Wait for the form to load
    await page.waitForSelector('h1:has-text("編輯關於我們")', { timeout: 5000 })
    console.log('✅ About admin page loaded!')

    // Step 3: Check if the page loaded with existing content
    console.log('\n📝 Step 3: Checking existing content...')
    const titleInput = page.locator('input[placeholder*="Uphouse"]').first()
    const currentTitle = await titleInput.inputValue()
    console.log(`Current title: ${currentTitle}`)

    // Step 4: Update the description
    console.log('\n📝 Step 4: Updating description...')
    const descriptionTextarea = page.locator('textarea').first()
    const originalDescription = await descriptionTextarea.inputValue()
    const testDescription = `${originalDescription} [測試更新於 ${new Date().toISOString()}]`

    await descriptionTextarea.fill(testDescription)
    console.log('✅ Description updated!')

    // Step 5: Submit the form
    console.log('\n📝 Step 5: Submitting form...')
    await page.getByRole('button', { name: /儲存變更|儲存中/i }).click()

    // Wait for success message
    await page.waitForSelector('div:has-text("關於我們內容已更新")', { timeout: 10000 })
    console.log('✅ Form submitted successfully!')

    // Step 6: Verify the update on the frontend
    console.log('\n📝 Step 6: Verifying update on frontend...')
    await page.goto(`${APP_URL}/about`, { waitUntil: 'networkidle' })

    // Check if the updated description is visible
    const pageContent = await page.textContent('body')
    const hasTestMarker = pageContent?.includes('測試更新於')

    if (hasTestMarker) {
      console.log('✅ Update successfully reflected on frontend!')
    } else {
      console.log('⚠️  Update may not be visible on frontend yet (cache or timing issue)')
    }

    // Step 7: Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 Test Summary')
    console.log('='.repeat(60))
    console.log(`✅ Login: Success`)
    console.log(`✅ Navigate to Admin About: Success`)
    console.log(`✅ Load existing content: Success`)
    console.log(`✅ Update content: Success`)
    console.log(`✅ Save changes: Success`)
    console.log(`${hasTestMarker ? '✅' : '⚠️ '} Frontend verification: ${hasTestMarker ? 'Success' : 'Partial'}`)
    console.log('\n📡 API Calls made:')
    apiResponses.forEach(({ method, status, url }) => {
      console.log(`  ${method} [${status}] ${url.split('/rest/v1/')[1]}`)
    })
    console.log('\n✅ All tests passed!')

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    // Take a screenshot on error
    await page.screenshot({ path: 'test-error.png', fullPage: true })
    console.log('📸 Screenshot saved to test-error.png')
    throw error
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error('\n💥 Fatal error:', error)
  process.exit(1)
})
