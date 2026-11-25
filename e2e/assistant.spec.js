// Hoja (AI receptionist) — runs against the local rule-based fallback, since preview has no /api/chat.
import { test, expect } from '@playwright/test'
import { prep, gotoApp } from './helpers.js'

test('chat opens, answers suggestion chips and typed questions, links navigate', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/')
  await page.locator('#chat-fab').click()
  const chat = page.locator('#chat')
  await expect(chat).toBeVisible()
  await expect(chat.locator('.msg.bot').first()).toContainText('Hoja')
  await chat.locator('.chat-chips button').first().click() // "¿Está abierto ahora?"
  await expect(chat.locator('.msg.bot').nth(1)).toContainText(/abierto|cerrado/i)
  await page.locator('#chat-in').fill("¿Qué hay en el menú de KAO by Sach'a?")
  await page.locator('#chat-in').press('Enter')
  await expect(chat.locator('.msg.bot').nth(2)).toContainText('Sushi')
  await expect(chat.locator('.msg.bot').nth(2)).toContainText('62116555')
  await page.locator('#chat-in').fill('¿Dónde queda Aldo?')
  await page.locator('#chat-in').press('Enter')
  const link = chat.locator('.msg.bot').nth(3).locator('a[data-internal]')
  await expect(link).toHaveAttribute('href', '/tiendas/aldo')
  await link.click()
  await expect(page).toHaveURL(/\/tiendas\/aldo$/)
})

test('chat closes with Escape and the close button', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/')
  await page.locator('#chat-fab').click()
  await expect(page.locator('#chat')).toBeVisible()
  await page.locator('#chat-in').press('Escape')
  await expect(page.locator('#chat')).toBeHidden()
  await page.locator('#chat-fab').click()
  await page.locator('.chat-close').click()
  await expect(page.locator('#chat')).toBeHidden()
})

test('WhatsApp / contact panel offers only verified numbers', async ({ page }) => {
  await prep(page)
  await gotoApp(page, '/')
  await page.locator('#wa-fab').click()
  const panel = page.locator('#wa-panel')
  await expect(panel).toBeVisible()
  await panel.locator('[data-step="reservar"]').click()
  const hrefs = await panel.locator('a.wa-opt').evaluateAll((as) => as.map((a) => a.href))
  expect(hrefs.sort()).toEqual(expect.arrayContaining([expect.stringMatching(/wa\.me\/59162116555/), expect.stringMatching(/wa\.me\/59169231010/)]))
  await panel.locator('.wa-back').click()
  await panel.locator('[data-step="info"]').click()
  await expect(panel.locator('a[href="tel:+59133364141"]')).toBeVisible()
  await panel.locator('.wa-close').click()
  await expect(panel).toBeHidden()
})
