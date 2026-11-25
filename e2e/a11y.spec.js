import { test, expect } from '@playwright/test'
import { prep, gotoApp } from './helpers.js'

for (const url of ['/', '/tiendas', '/tiendas/arezzo', '/gastronomia/jarana', '/legal/privacidad']) {
  test(`basic accessibility on ${url}`, async ({ page }) => {
    await prep(page)
    await gotoApp(page, url)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-BO')
    await expect(page.locator('h1')).toHaveCount(1)
    // every image has an alt attribute (decorative ones are alt="")
    expect(await page.locator('img:not([alt])').count()).toBe(0)
    // every button/link has an accessible name
    const unnamed = await page.evaluate(() => [...document.querySelectorAll('a[href], button')].filter((el) => {
      if (el.closest('[hidden]') || el.closest('[aria-hidden="true"]')) return false
      const name = (el.getAttribute('aria-label') || el.textContent || el.querySelector('img[alt]')?.alt || '').trim()
      return !name
    }).map((el) => el.outerHTML.slice(0, 80)))
    expect(unnamed).toEqual([])
    // skip link targets main content
    await expect(page.locator('a.skip')).toHaveAttribute('href', '#app')
    // JSON-LD is valid
    const ld = await page.locator('script[type="application/ld+json"]').textContent()
    expect(JSON.parse(ld)['@type']).toBe('ShoppingCenter')
  })
}

test('reduced motion: content is visible without animations', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.addInitScript(() => localStorage.setItem('pd-cookies', '1'))
  await page.goto('/tiendas')
  await expect(page.locator('.dir-grid .pcard').first()).toHaveCSS('opacity', '1')
  await ctx.close()
})
