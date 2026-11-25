import { test, expect } from '@playwright/test'
import { prep, gotoApp, isTouch, restaurants } from './helpers.js'

test('gallery lightbox opens, navigates with keys/buttons and closes', async ({ page }, info) => {
  await prep(page)
  await gotoApp(page, '/tiendas/vickys-casual')
  const items = page.locator('.m-item')
  const count = await items.count()
  expect(count).toBeGreaterThan(1)
  await items.first().scrollIntoViewIfNeeded(); await items.first().click()
  const lb = page.locator('#lightbox')
  await expect(lb).toBeVisible()
  await expect(lb.locator('figcaption span')).toHaveText(`1 / ${count}`)
  if (isTouch(info)) await lb.locator('.lb-next').click(); else await page.keyboard.press('ArrowRight')
  await expect(lb.locator('figcaption span')).toHaveText(`2 / ${count}`)
  await lb.locator('.lb-prev').click()
  await expect(lb.locator('figcaption span')).toHaveText(`1 / ${count}`)
  await page.keyboard.press('Escape')
  await expect(lb).toBeHidden()
})

test('restaurant reservation buttons use the published WhatsApp numbers', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/gastronomia')
  for (const r of restaurants.filter((r) => r.wa)) {
    const btn = page.locator(`.fcard:has(h3:text-is("${r.name}")) a.btn-wa`)
    await expect(btn).toHaveAttribute('href', new RegExp(`^https://wa\\.me/${r.wa}\\?text=.*Patio%20Design`))
  }
  // restaurants without a published number never show a WhatsApp button
  for (const r of restaurants.filter((r) => !r.wa)) {
    await expect(page.locator(`.fcard:has(h3:text-is("${r.name}")) a.btn-wa`)).toHaveCount(0)
  }
})

test('hero carousel advances and progress bars jump', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/')
  const cap = page.locator('.hero-cap-t')
  await expect(cap).toHaveText(/^01 · /)
  await page.locator('.hero-bars button').nth(3).click()
  await expect(cap).toHaveText(/^04 · /)
  await expect(page.locator('.hero-col').first().locator('.hero-slide.on')).toHaveAttribute('data-i', '3')
  await expect(cap).toHaveText(/^05 · /, { timeout: 9_000 }) // auto-advance
})

test('particle wordmark canvas renders on the home hero', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/')
  const canvas = page.locator('.hero-canvas')
  await expect(canvas).toBeVisible()
  await expect.poll(async () => canvas.evaluate((c) => c.width > 0 && c.height > 0), { timeout: 10_000 }).toBe(true)
})

test('counters animate to their real values', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/')
  const first = page.locator('.fact b').first()
  await first.scrollIntoViewIfNeeded()
  const target = await first.getAttribute('data-count')
  await expect(first).toHaveText(target, { timeout: 6_000 })
})

test('reels load their video only when needed and play', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/')
  const card = page.locator('#reels .vcard').first()
  await card.scrollIntoViewIfNeeded()
  const v = card.locator('video')
  await expect(v).toHaveAttribute('poster', /\/media\/ig\//)
  await expect.poll(() => v.evaluate((el) => !!el.getAttribute('src')), { timeout: 8_000 }).toBe(true)
  await card.locator('.vplay').click({ force: true })
  await expect.poll(() => v.evaluate((el) => !el.paused && el.readyState >= 2), { timeout: 10_000 }).toBe(true)
  await card.locator('.vsound').click({ force: true })
  await expect(card.locator('.vsound')).toHaveAttribute('aria-label', 'Silenciar')
})

test('brand marquee links to real pages', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/')
  const links = await page.locator('.marquee-row').first().locator('a').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
  expect(links.length).toBeGreaterThan(40)
  for (const h of links) expect(h).toMatch(/^\/(tiendas|gastronomia)\/[a-z0-9-]+$/)
})

test('visit section: hours, map embed and directions link', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/')
  const v = page.locator('#visitanos')
  await v.scrollIntoViewIfNeeded()
  await expect(v.locator('.hours tr')).toHaveCount(2)
  await expect(v.locator('iframe')).toHaveAttribute('src', /maps\.google\.com.*-17\.77149933272407,-63\.20198722940447/)
  await expect(v.locator('a', { hasText: 'Cómo llegar' })).toHaveAttribute('href', /google\.com\/maps\/dir/)
  await expect(v.locator('a[href^="tel:"]')).toHaveAttribute('href', 'tel:+59133364141')
})

test('cookie notice shows once and remembers the choice', async ({ page }) => {
  await page.goto('/')
  const c = page.locator('#cookie')
  await expect(c).toBeVisible({ timeout: 10_000 })
  await c.locator('button').click()
  await expect(c).toBeHidden()
  await page.reload()
  await page.waitForTimeout(1500)
  await expect(c).toBeHidden()
})

test('FAQ accordion expands', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/ayuda')
  const d = page.locator('details.faq').first()
  await d.locator('summary').click()
  await expect(d).toHaveAttribute('open', '')
  await expect(d.locator('p')).toContainText('07:00')
})
