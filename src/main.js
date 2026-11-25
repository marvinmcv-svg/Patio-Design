import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { startRouter } from './router.js'
import { initChat, initWhatsApp } from './chat.js'
import { isPhone, reduced } from './ui.js'

gsap.registerPlugin(ScrollTrigger)
document.documentElement.classList.toggle('is-phone', isPhone)
window.__firstLoad = true

// Smooth scroll (desktop)
if (!isPhone && !reduced) {
  const lenis = new Lenis({ lerp: 0.11, smoothWheel: true })
  window.__lenis = lenis
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

// Nav: hide on scroll down, solid after hero
const nav = document.querySelector('.nav')
let lastY = 0
addEventListener('scroll', () => {
  const y = scrollY
  nav.classList.toggle('solid', y > 40)
  nav.classList.toggle('hide', y > lastY && y > 400 && !document.body.classList.contains('menu-open'))
  lastY = y
}, { passive: true })

// Mobile menu
document.querySelector('.menu-btn').addEventListener('click', (e) => {
  const open = document.body.classList.toggle('menu-open')
  e.currentTarget.setAttribute('aria-expanded', String(open))
})

// Custom cursor with labels
if (!isPhone && !reduced) {
  const cur = document.getElementById('cursor'), lab = cur.querySelector('span')
  const xTo = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' }), yTo = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' })
  addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY) })
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor], a, button')
    cur.classList.toggle('big', !!t?.dataset.cursor)
    cur.classList.toggle('link', !!t && !t.dataset.cursor)
    lab.textContent = t?.dataset.cursor || ''
  })
} else document.getElementById('cursor').remove()

// Cookie notice
try {
  if (!localStorage.getItem('pd-cookies')) {
    const c = document.getElementById('cookie')
    c.hidden = false
    c.querySelector('button').addEventListener('click', () => { try { localStorage.setItem('pd-cookies', '1') } catch {} c.hidden = true })
  }
} catch {}

// Footer giant wordmark rises letter by letter
const fw = document.querySelector('.foot-word')
if (fw && !reduced) {
  fw.innerHTML = [...fw.textContent].map((c, i) => `<span style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join('')
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { fw.classList.add('in'); io.disconnect() } }, { threshold: 0.3 })
  io.observe(fw)
}
document.getElementById('year').textContent = new Date().getFullYear()

// Preloader
const loader = document.getElementById('loader')
const pct = loader.querySelector('.ld-pct')
const o = { v: 0 }
const imgs = () => [...document.querySelectorAll('#app img')].slice(0, 6)
const finish = () => {
  gsap.timeline({ onComplete: () => { loader.remove(); window.__firstLoad = false } })
    .to(o, { v: 100, duration: 0.4, onUpdate: () => (pct.textContent = Math.round(o.v)) })
    .to('.ld-logo, .ld-pct', { opacity: 0, y: -20, duration: 0.4 })
    .to('.ld-panel', { yPercent: (i) => (i ? 100 : -100), duration: 0.9, ease: 'expo.inOut' }, '<0.1')
}
gsap.to(o, { v: 70, duration: reduced ? 0.2 : 1.2, ease: 'power2.out', onUpdate: () => (pct.textContent = Math.round(o.v)) })

startRouter().then(() => {
  initChat()
  initWhatsApp()
  const waitImgs = Promise.all(imgs().map((im) => (im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r }))))
  Promise.race([waitImgs, new Promise((r) => setTimeout(r, 2200))]).then(() => setTimeout(finish, reduced ? 0 : 500))
})
