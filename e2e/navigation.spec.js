import { test, expect } from '@playwright/test'
import { prep, gotoApp, isMobile, isTouch, watchErrors, expectNoOverflow } from './helpers.js'

test('home → store card → back → menu → gastronomía (SPA navigation)', async ({ page }, info) => {
  const errors = watchErrors(page); await prep(page)
  await gotoApp(page, '/')
  const card = page.locator('.grid-stores .pcard').first()
  await card.scrollIntoViewIfNeeded()
  const href = await card.getAttribute('href')
  await card.click()
  await expect(page).toHaveURL(new RegExp(href + '$'))
  await expect(page.locator('.place-title')).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.locator('.hero-title')).toBeVisible()
  if (isMobile(info) || info.project.name === 'tablet-ipad') {
    await page.locator('.menu-btn').click()
    await expect(page.locator('body')).toHaveClass(/menu-open/)
    await page.locator('#mmenu a[href="/gastronomia"]').click()
  } else {
    await page.locator('.nav-links a[href="/gastronomia"]').click()
  }
  await expect(page).toHaveURL(/\/gastronomia$/)
  await expect(page.locator('body')).not.toHaveClass(/menu-open/)
  await expect(page.locator('h1')).toContainText('Comer')
  await expectNoOverflow(page)
  expect(errors).toEqual([])
})

test('nav marks the current section and the logo goes home', async ({ page }, info) => {
  test.skip(isTouch(info), 'desktop nav only')
  await prep(page)
  await gotoApp(page, '/tiendas')
  await expect(page.locator('.nav-links a[href="/tiendas"]')).toHaveAttribute('aria-current', 'page')
  await page.locator('.brand').click()
  await expect(page).toHaveURL(/\/$/)
})

test('breadcrumbs and "Siguiente" link work on a store page', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/tiendas/pretty')
  const next = page.locator('a.next-link')
  const nextHref = await next.getAttribute('href')
  await next.scrollIntoViewIfNeeded(); await next.click()
  await expect(page).toHaveURL(new RegExp(nextHref + '$'))
  await page.locator('.crumbs a[href="/tiendas"]').click()
  await expect(page).toHaveURL(/\/tiendas$/)
})

test('anchor links from another page land on the right home section', async ({ page }, info) => {
  await prep(page)
  await gotoApp(page, '/ayuda')
  if (isMobile(info) || info.project.name === 'tablet-ipad') { await page.locator('.menu-btn').click(); await page.locator('#mmenu a[href="/#visitanos"]').click() }
  else await page.locator('.nav-links a[href="/#visitanos"]').click()
  await expect(page.locator('#visitanos')).toBeInViewport({ timeout: 10_000 })
})

test('footer legal links all resolve', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/')
  for (const href of ['/legal/terminos', '/legal/privacidad', '/legal/cookies', '/legal/aviso-legal', '/legal/accesibilidad']) {
    const a = page.locator(`.foot-legal a[href="${href}"]`)
    await a.scrollIntoViewIfNeeded(); await a.click()
    await expect(page).toHaveURL(new RegExp(href + '$'))
    await expect(page.locator('.legal-nav a[aria-current="page"]')).toHaveAttribute('href', href)
  }
})

test('mobile menu toggles open/closed', async ({ page }, info) => {
  test.skip(!isTouch(info), 'mobile/tablet only')
  await prep(page)
  await gotoApp(page, '/')
  const btn = page.locator('.menu-btn')
  await btn.click(); await expect(btn).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#mmenu a[href="/tiendas"]')).toBeVisible()
  await btn.click(); await expect(btn).toHaveAttribute('aria-expanded', 'false')
})
