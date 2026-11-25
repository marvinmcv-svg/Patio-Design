import { expect } from '@playwright/test'
import { stores, restaurants } from '../src/data.js'

export { stores, restaurants }
export const isMobile = (testInfo) => /mobile/.test(testInfo.project.name)
export const isTouch = (testInfo) => /mobile|tablet/.test(testInfo.project.name)

/** Collects page errors + console errors (ignores 3rd-party noise and the expected /api/chat 404 in preview). */
export function watchErrors(page) {
  const errors = []
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    const t = m.text()
    if (/api\/chat|maps\.google|google\.com|gstatic|ERR_BLOCKED|Failed to load resource/.test(t)) return
    errors.push('console: ' + t)
  })
  return errors
}

export async function prep(page) {
  await page.addInitScript(() => { try { localStorage.setItem('pd-cookies', '1') } catch {} })
}

/** Scrolls the full page; returns broken / stuck-invisible images and overflow. */
export async function sweep(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const vh = page.viewportSize().height
  const problems = new Set()
  let overflow = false
  for (let y = 0; y <= height; y += Math.round(vh * 0.6)) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(350)
    const r = await page.evaluate(() => {
      const out = []
      for (const im of document.querySelectorAll('#app img')) {
        const b = im.getBoundingClientRect()
        if (b.bottom < 80 || b.top > innerHeight - 80 || b.width < 4 || b.right < 0 || b.left > innerWidth) continue
        if (im.closest('.hero-slide:not(.on)')) continue
        if (im.complete && im.naturalWidth === 0) { out.push('broken ' + im.getAttribute('src')); continue }
        let el = im, op = 1
        while (el && el !== document.body) { op *= +getComputedStyle(el).opacity; el = el.parentElement }
        if (op < 0.05) out.push('invisible ' + im.getAttribute('src'))
      }
      return { out, ov: document.documentElement.scrollWidth > innerWidth + 1 }
    })
    r.out.forEach((x) => problems.add(x))
    overflow ||= r.ov
  }
  // re-check "invisible" ones after reveal transitions settle
  const still = []
  for (const p of problems) {
    if (p.startsWith('broken')) { still.push(p); continue }
    const src = p.slice('invisible '.length)
    const ok = await page.evaluate(async (src) => {
      const im = document.querySelector(`#app img[src="${src}"]`); if (!im) return true
      im.scrollIntoView({ block: 'center' }); await new Promise((r) => setTimeout(r, 1200))
      let el = im, op = 1; while (el && el !== document.body) { op *= +getComputedStyle(el).opacity; el = el.parentElement }
      return op > 0.05
    }, src)
    if (!ok) still.push(p)
  }
  return { problems: still, overflow }
}

export async function expectNoOverflow(page) {
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  expect(ov, 'horizontal overflow (px)').toBeLessThanOrEqual(1)
}

export async function gotoApp(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await expect(page.locator('#app h1').first()).toBeVisible({ timeout: 15_000 })
}
