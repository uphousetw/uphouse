import { config } from 'dotenv'
import { chromium } from 'playwright'

config({ path: '.env.local' })
config()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Missing required environment variables.')
  process.exit(1)
}

const APP_URL = process.env.APP_URL ?? 'http://localhost:5173'

const main = async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  page.on('response', async (response) => {
    const url = response.url()
    if (url.includes('/rest/v1/profiles') || url.includes('/rest/v1/projects') || url.includes('/rest/v1/leads')) {
      const status = response.status()
      console.log(`\n[${status}] ${url}`)
      try {
        const body = await response.text()
        console.log(body || '<empty body>')
      } catch (error) {
        console.error('Failed to read body:', error)
      }
    }
  })

  console.log('Navigating to login page...')
  await page.goto(`${APP_URL}/admin/login`, { waitUntil: 'networkidle' })

  console.log('Filling login form...')
  await page.locator('input[type="email"]').fill(ADMIN_EMAIL)
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: /登入|login/i }).click()

  await page.waitForURL('**/admin', { timeout: 10000 })
  console.log('Login successful, waiting for data fetch...')

  await page.waitForTimeout(4000)

  await browser.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
