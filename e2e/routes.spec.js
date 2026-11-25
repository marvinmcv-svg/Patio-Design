// Every route renders, has correct meta, no errors, no broken/stuck images, no horizontal overflow.
import { test, expect } from '@playwright/test'
import { stores, restaurants, watchErrors, prep, sweep, gotoApp } from './helpers.js'

const core = [
  ['/', /Patio Design Lifestyle Center/],
  ['/tiendas', /Tiendas · Patio Design/],
  ['/gastronomia', /Gastronomía · Patio Design/],
  ['/legal/terminos', /Términos y condiciones/],
  ['/legal/privacidad', /Política de privacidad/],
  ['/legal/cookies', /Política de cookies/],
  ['/legal/aviso-legal', /Aviso legal/],
  ['/legal/accesibilidad', /Accesibilidad/],
  ['/ayuda', /Preguntas frecuentes/],
]

test.describe('core pages', () => {
  for (const [url, title] of core) {
    test(`${url} renders cleanly`, async ({ page }) => {
      const errors = watchErrors(page); await prep(page)
      await gotoApp(page, url)
      await expect(page).toHaveTitle(title)
      await expect(page.locator('meta[name=description]')).toHaveAttribute('content', /.{20,}/)
      await expect(page.locator('#app h1')).toHaveCount(1)
      const { problems, overflow } = await sweep(page)
      expect(problems, 'broken or invisible images').toEqual([])
      expect(overflow, 'horizontal overflow').toBe(false)
      expect(errors).toEqual([])
    })
  }
})

test.describe('every store and restaurant page', () => {
  const places = [...stores.map((s) => [`/tiendas/${s.slug}`, s]), ...restaurants.map((r) => [`/gastronomia/${r.slug}`, r])]
  for (const [url, p] of places) {
    test(`${url}`, async ({ page }, info) => {
      const errors = watchErrors(page); await prep(page)
      await gotoApp(page, url)
      await expect(page.locator('.place-title')).toHaveText(p.name)
      await expect(page).toHaveTitle(new RegExp(p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      await expect(page.locator('.place-meta .status')).toHaveText(/Abierto ahora|Cerrado ahora/)
      const ig = page.locator('.place-actions a[href*="instagram.com"]')
      await expect(ig).toHaveAttribute('href', p.ig ? `https://www.instagram.com/${p.ig}/` : /instagram\.com\/p\//)
      if (p.wa) await expect(page.locator('.place-actions a.btn-wa')).toHaveAttribute('href', new RegExp(`^https://wa\\.me/${p.wa}\\?text=`))
      // the cover image is the post the data says it is
      if (p.cover) await expect(page.locator('.place-figure img')).toHaveAttribute('src', `/media/ig/${p.cover.replace(':', '-')}.webp`)
      // only sweep the full page on two profiles to keep the run fast
      if (['desktop-1440', 'mobile-iphone13'].includes(info.project.name)) {
        const { problems, overflow } = await sweep(page)
        expect(problems).toEqual([])
        expect(overflow).toBe(false)
      }
      expect(errors).toEqual([])
    })
  }
})

test('unknown URL shows the 404 page', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/esto-no-existe')
  await expect(page.locator('h1')).toContainText('Te perdiste')
  await expect(page).toHaveTitle(/Te perdiste/)
  await gotoApp(page, '/tiendas/no-existe')
  await expect(page.locator('h1')).toContainText('Te perdiste')
})
