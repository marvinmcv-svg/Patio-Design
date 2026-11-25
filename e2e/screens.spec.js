// Full-page screenshots of key pages for every device profile (written to e2e-screens/<project>/).
import { test } from '@playwright/test'
import { prep, gotoApp } from './helpers.js'

const pages = [['home', '/'], ['tiendas', '/tiendas'], ['store', '/tiendas/pretty'], ['gastronomia', '/gastronomia'], ['restaurant', '/gastronomia/kao-by-sacha'], ['legal', '/legal/terminos'], ['ayuda', '/ayuda'], ['404', '/x']]
for (const [name, url] of pages) {
  test(`screenshot ${name}`, async ({ page }, info) => {
    await prep(page)
    await gotoApp(page, url)
    // trigger lazy content / reveals top to bottom
    const h = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < h; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(120) }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800)
    await page.screenshot({ path: `e2e-screens/${info.project.name}/${name}.png`, fullPage: name !== 'home', animations: 'disabled' })
  })
}
