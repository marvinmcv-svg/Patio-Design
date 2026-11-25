// Shared UI helpers: images, icons, reveal, tilt, magnetic, lightbox, videos.
import { sm } from './content.js'

export const isPhone = matchMedia('(max-width:760px), (hover:none) and (pointer:coarse)').matches
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/** responsive <img> using the -sm variant */
export function img(im, { alt = '', sizes = '(max-width:760px) 50vw, 360px', cls = '', eager = false } = {}) {
  if (!im) return ''
  const w = im.w || 1200
  return `<img class="${cls}" src="${im.src}" srcset="${sm(im.src)} 640w, ${im.src} ${w}w" sizes="${sizes}" width="${im.w || ''}" height="${im.h || ''}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`
}
export const bgSrc = (im) => (im ? (isPhone ? sm(im.src) : im.src) : '')

/** typographic wordmark tile (used when no usable logo exists — never a fake logo) */
export function wordmark(name, cls = '') {
  const words = name.replace(/[^A-Za-zÀ-ÿ0-9' ]/g, ' ').split(/\s+/).filter(Boolean)
  const small = /wm-(xs|sm)/.test(cls)
  const text = small ? words.slice(0, 2).map((w) => w[0].toUpperCase()).join('') : name
  const fs = small ? '' : ` style="--len:${Math.max(4, name.length)}"`
  return `<span class="wm ${cls}"${fs} aria-hidden="true"><span>${esc(text)}</span></span>`
}

const P = (d) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`
export const icon = {
  arrow: P('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  arrowL: P('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  ig: P('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>'),
  fb: P('<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>'),
  wa: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>`,
  phone: P('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
  pin: P('<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
  clock: P('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  sound: P('<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>'),
  mute: P('<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/>'),
  play: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`,
  close: P('<path d="M6 6l12 12M18 6L6 18"/>'),
  search: P('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
  send: P('<path d="M4 12l16-8-6 16-2-6-8-2z"/>'),
  ext: P('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
}

/** IntersectionObserver reveal — never leaves content invisible (see master prompt §11.1) */
let io
export function reveal(root = document) {
  const els = root.querySelectorAll('.rv:not(.is-in)')
  if (reduced || !('IntersectionObserver' in window)) return els.forEach((e) => e.classList.add('is-in'))
  io ||= new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('is-in'); io.unobserve(e.target) }
    }),
    { rootMargin: '0px 0px -6% 0px', threshold: 0.01 },
  )
  els.forEach((el) => {
    if (el.getBoundingClientRect().bottom < 0) el.classList.add('is-in')
    else io.observe(el)
  })
}

/** 3D tilt + moving glare (fine pointer only) */
export function tilt(root) {
  if (isPhone || reduced) return () => {}
  const cards = root.querySelectorAll('[data-tilt]')
  const offs = []
  cards.forEach((c) => {
    const move = (e) => {
      const r = c.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
      c.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(0)`
      c.style.setProperty('--gx', `${(x + 0.5) * 100}%`); c.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
    }
    const leave = () => (c.style.transform = '')
    c.addEventListener('pointermove', move); c.addEventListener('pointerleave', leave)
    offs.push(() => { c.removeEventListener('pointermove', move); c.removeEventListener('pointerleave', leave) })
  })
  return () => offs.forEach((f) => f())
}

export function magnetic(root) {
  if (isPhone || reduced) return () => {}
  const offs = []
  root.querySelectorAll('[data-magnetic]').forEach((b) => {
    const move = (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)` }
    const leave = () => (b.style.transform = '')
    b.addEventListener('pointermove', move); b.addEventListener('pointerleave', leave)
    offs.push(() => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave) })
  })
  return () => offs.forEach((f) => f())
}

/** Lightbox with keyboard + swipe */
export function lightbox(items, start = 0) {
  let i = start
  const el = document.getElementById('lightbox')
  const fig = el.querySelector('.lb-fig')
  const show = () => {
    const it = items[i]
    fig.innerHTML = `<img src="${it.src}" alt="${esc(it.title || '')}"><figcaption>${esc(it.title || '')}<span>${i + 1} / ${items.length}</span></figcaption>`
  }
  const close = () => { el.hidden = true; document.removeEventListener('keydown', key); document.body.classList.remove('no-scroll'); last?.focus() }
  const go = (d) => { i = (i + d + items.length) % items.length; show() }
  const key = (e) => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }
  const last = document.activeElement
  el.querySelector('.lb-close').onclick = close
  el.querySelector('.lb-prev').onclick = () => go(-1)
  el.querySelector('.lb-next').onclick = () => go(1)
  el.onclick = (e) => { if (e.target === el) close() }
  let sx = 0
  el.ontouchstart = (e) => (sx = e.touches[0].clientX)
  el.ontouchend = (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1) }
  document.addEventListener('keydown', key)
  document.body.classList.add('no-scroll')
  el.hidden = false; show(); el.querySelector('.lb-close').focus()
  lightbox.close = close
}

/** Video cards: src assigned only when visible; one autoplaying video at a time; hover-play on desktop */
export function videoCards(root) {
  const vids = [...root.querySelectorAll('video[data-src]')]
  if (!vids.length) return () => {}
  let current = null
  const playOnly = (v) => { if (current && current !== v) current.pause(); current = v; v.play().catch(() => {}) }
  const ob = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target
    if (e.isIntersecting && !v.src) { v.src = v.dataset.src }
    if (!e.isIntersecting && !v.paused) v.pause()
  }), { rootMargin: '200px' })
  const offs = []
  vids.forEach((v) => {
    ob.observe(v)
    const card = v.closest('.vcard')
    const enter = () => { if (!v.src) v.src = v.dataset.src; playOnly(v) }
    const leave = () => v.pause()
    if (!isPhone) { card.addEventListener('pointerenter', enter); card.addEventListener('pointerleave', leave); offs.push(() => { card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', leave) }) }
    const btn = card.querySelector('.vplay')
    btn?.addEventListener('click', (e) => { e.preventDefault(); if (v.paused) { enter(); card.classList.add('playing') } else { v.pause(); card.classList.remove('playing') } })
    const snd = card.querySelector('.vsound')
    snd?.addEventListener('click', (e) => { e.preventDefault(); v.muted = !v.muted; snd.innerHTML = v.muted ? icon.mute : icon.sound; snd.setAttribute('aria-label', v.muted ? 'Activar sonido' : 'Silenciar'); if (!v.muted) playOnly(v) })
  })
  return () => { ob.disconnect(); offs.forEach((f) => f()); vids.forEach((v) => v.pause()) }
}

export function videoCard(p, { label = '' } = {}) {
  if (!p) return ''
  const poster = p.poster || p.images?.[0]?.src
  return `<article class="vcard" data-cursor="Ver">
    <div class="vmedia">
      <video muted playsinline loop preload="none" poster="${poster ? (isPhone ? poster.replace('.webp', '-sm.webp') : poster) : ''}" data-src="${p.video}"></video>
      <button class="vplay" aria-label="Reproducir">${icon.play}</button>
      <button class="vsound" aria-label="Activar sonido">${icon.mute}</button>
      ${p.plays ? `<span class="vviews">${p.plays.toLocaleString('es-BO')} vistas</span>` : ''}
    </div>
    <div class="vmeta"><p>${esc(label)}</p><a href="https://www.instagram.com/reel/${p.code}/" target="_blank" rel="noopener">Ver en Instagram ${icon.ext}</a></div>
  </article>`
}

let refreshT
export function debouncedRefresh(ST) {
  clearTimeout(refreshT)
  refreshT = setTimeout(() => ST?.refresh(), 200)
}
