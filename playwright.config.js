// End-to-end suite: `npm run test:e2e` (builds, serves dist/ and runs every device profile).
import { defineConfig, devices } from '@playwright/test'

const chromium = { browserName: 'chromium' }
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'e2e-report' }]],
  use: { baseURL: 'http://localhost:4174', trace: 'off', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop-1440', use: { ...chromium, viewport: { width: 1440, height: 900 } } },
    { name: 'laptop-1280', use: { ...chromium, viewport: { width: 1280, height: 720 } } },
    { name: 'tablet-ipad', use: { ...devices['iPad Mini'], ...chromium } },
    { name: 'mobile-iphone13', use: { ...devices['iPhone 13'], ...chromium } },
    { name: 'mobile-small', use: { ...devices['Galaxy S9+'], ...chromium, viewport: { width: 360, height: 740 } } },
  ],
  webServer: { command: 'npx vite preview --port 4174 --strictPort', url: 'http://localhost:4174', reuseExistingServer: true, timeout: 60_000 },
})
