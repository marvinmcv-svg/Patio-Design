import { test, expect } from '@playwright/test'
import { prep, gotoApp, stores } from './helpers.js'

test('category chips filter the directory and sync the URL', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/tiendas')
  await expect(page.locator('.dir-grid .pcard')).toHaveCount(stores.length)
  await page.locator('[data-cat="deportes"]').click()
  const n = stores.filter((s) => s.cat === 'deportes').length
  await expect(page.locator('.dir-grid .pcard')).toHaveCount(n)
  await expect(page).toHaveURL(/cat=deportes/)
  await expect(page.locator('.dir-count')).toHaveText(`${n} tiendas`)
  await expect(page.locator('[data-cat="deportes"]')).toHaveAttribute('aria-pressed', 'true')
  await page.locator('[data-cat=""]').click()
  await expect(page.locator('.dir-grid .pcard')).toHaveCount(stores.length)
})

test('search finds brands (accent-insensitive) and shows an empty state', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/tiendas')
  await page.locator('.search input').fill('optica')
  await expect(page.locator('.dir-grid .pcard')).toHaveCount(1)
  await expect(page.locator('.dir-grid .pcard h3')).toHaveText('Ópticas Pauker')
  await expect(page).toHaveURL(/q=optica/)
  await page.locator('.search input').fill('zzzz')
  await expect(page.locator('.empty')).toBeVisible()
})

test('deep link ?cat= opens filtered; home category cards link correctly', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/tiendas?cat=belleza')
  await expect(page.locator('.dir-grid .pcard')).toHaveCount(stores.filter((s) => s.cat === 'belleza').length)
  await gotoApp(page, '/')
  const hrefs = await page.locator('.cat-card').evaluateAll((els) => els.map((e) => e.getAttribute('href')))
  expect(hrefs).toContain('/gastronomia')
  expect(hrefs.filter((h) => h.startsWith('/tiendas?cat=')).length).toBe(7)
})
