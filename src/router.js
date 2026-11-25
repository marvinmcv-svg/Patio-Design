// Tiny History-API router with brand curtain transition and per-page gsap.context cleanup.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reduced, reveal, tilt, magnetic, lightbox } from './ui.js'

const routes = [
  [/^\/$/, () => import('./views/home.js')],
  [/^\/tiendas\/?$/, () => import('./views/directory.js')],
  [/^\/tiendas\/([\w-]+)\/?$/, () => import('./views/place.js'), 'store'],
  [/^\/gastronomia\/?$/, () => import('./views/food.js')],
  [/^\/gastronomia\/([\w-]+)\/?$/, () => import('./views/place.js'), 'food'],
  [/^\/legal\/([\w-]+)\/?$/, () => import('./views/legal.js')],
  [/^\/ayuda\/?$/, () => import('./views/legal.js'), 'faq'],
]

let ctx = null, cleanups = [], busy = false, first = true

function scrollToHash(hash, tries = 0) {
  const el = hash && document.querySelector(hash)
  if (!el) return
  if (tries === 0) ScrollTrigger.refresh()
  const smooth = !reduced && tries === 0
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -70, immediate: !smooth, duration: 1.2 })
  else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 70, behavior: smooth ? 'smooth' : 'auto' })
  // smooth scrolls can be cut short by late layout work; verify and correct
  if (tries < 3) setTimeout(() => { if (Math.abs(el.getBoundingClientRect().top - 70) > 60) scrollToHash(hash, tries + 1) }, smooth ? 1500 : 300)
}
const app = () => document.getElementById('app')
const curtain = () => document.getElementById('curtain')

function match(path) {
  for (const [re, load, kind] of routes) {
    const m = path.match(re)
    if (m) return { load, params: m.slice(1), kind }
  }
  return { load: () => import('./views/notfound.js'), params: [] }
}

async function render(url, { push = true, scroll = true } = {}) {
  if (busy) return
  busy = true
  const u = new URL(url, location.origin)
  const { load, params, kind } = match(u.pathname.replace(/\/+$/, '') || '/')
  const modP = load()
  if (!first && !reduced) {
    await gsap.fromTo(curtain(), { y: 0, yPercent: 100, autoAlpha: 1 }, { y: 0, yPercent: 0, duration: 0.55, ease: 'expo.inOut' })
  }
  const mod = await modP
  const view = await mod.default({ params, kind, query: u.searchParams })
  // teardown previous page
  cleanups.forEach((f) => { try { f() } catch {} })
  cleanups = []
  ctx?.revert()
  ScrollTrigger.getAll().forEach((t) => t.kill())
  lightbox.close?.()
  document.body.classList.remove('menu-open', 'no-scroll')
  if (push) history.pushState({}, '', u.pathname + u.search + u.hash)
  document.title = view.title
  document.querySelector('meta[name=description]')?.setAttribute('content', view.description || '')
  app().innerHTML = view.html
  app().dataset.page = view.page || ''
  updateNav(u.pathname)
  if (scroll) {
    window.__lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }
  ctx = gsap.context(() => {
    const c = view.mount?.(app())
    if (typeof c === 'function') cleanups.push(c)
  }, app())
  cleanups.push(tilt(app()), magnetic(app()))
  reveal(app())
  if (u.hash) setTimeout(() => scrollToHash(u.hash), first ? 400 : 750)
  if (!first && !reduced) gsap.to(curtain(), { y: 0, yPercent: -100, duration: 0.6, ease: 'expo.inOut', delay: 0.05, onComplete: () => gsap.set(curtain(), { autoAlpha: 0, yPercent: 100 }) })
  if (!first) app().focus({ preventScroll: true })
  first = false
  busy = false
  ScrollTrigger.refresh()
}

function updateNav(path) {
  document.querySelectorAll('[data-nav]').forEach((a) => {
    const href = a.getAttribute('href')
    const on = href === '/' ? path === '/' : path.startsWith(href)
    a.toggleAttribute('aria-current', on)
    if (on) a.setAttribute('aria-current', 'page')
  })
}

export function navigate(url) { return render(url) }

export function startRouter() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]')
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return
    const href = a.getAttribute('href')
    if (!href.startsWith('/') || href.startsWith('//') || /\.(webp|jpg|png|mp4|pdf)$/.test(href)) return
    e.preventDefault()
    const u = new URL(href, location.origin)
    if (u.pathname === location.pathname && u.search === location.search && u.hash) {
      scrollToHash(u.hash)
      history.replaceState({}, '', href)
      document.body.classList.remove('menu-open')
      return
    }
    render(href)
  })
  window.addEventListener('popstate', () => render(location.href, { push: false }))
  return render(location.href, { push: false })
}
