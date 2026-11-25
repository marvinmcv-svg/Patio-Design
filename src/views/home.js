import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mall, stores, restaurants, categories, events, experiences, heroSlides, reels } from '../data.js'
import { pic, post, posts, fmtK, isOpen, todayHours, captionBody, fmtDate } from '../content.js'
import { img, bgSrc, esc, icon, isPhone, reduced, videoCards, videoCard, debouncedRefresh, wordmark } from '../ui.js'
import { splitChars, splitWords } from '../split.js'
import { storeCard, foodCard } from './cards.js'

gsap.registerPlugin(ScrollTrigger)

export default function home() {
  const featured = ['pretty', 'purificacion-garcia', 'levis', 'adidas', 'livi-luxe', 'vis-curtiembre', 'cosmet', 'samsara', 'opticas-pauker', 'casa-elena']
    .map((s) => stores.find((x) => x.slug === s)).filter(Boolean)
  const open = isOpen(), th = todayHours()
  const foodLayout = ['big', 'wide', '', '', 'big', 'wide', '', '', '', '', '']
  const ringPics = Object.values(posts).filter((p) => p.images.length && p.type !== 2).slice(0, 14)

  const html = `
  <section class="hero" id="inicio" aria-label="Inicio">
    <div class="hero-bg" aria-hidden="true">
      ${heroSlides.map((s, i) => { const im = pic(s.img); return `<div class="hero-slide${i === 0 ? ' on' : ''}" data-i="${i}"><img src="${bgSrc(im)}" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>` }).join('')}
      <div class="hero-vignette"></div>
    </div>
    <canvas class="hero-canvas" aria-hidden="true"></canvas>
    <div class="hero-ui">
      <div class="hero-cap"><span class="hero-cap-t">01 · ${esc(heroSlides[0].caption)}</span>
        <div class="hero-bars">${heroSlides.map((s, i) => `<button aria-label="Foto ${i + 1}: ${esc(s.caption)}" data-go="${i}"><i></i></button>`).join('')}</div>
      </div>
      <div class="hero-copy">
        <p class="eyebrow rv">${icon.pin} ${esc(mall.address)} · ${esc(mall.city)}</p>
        <h1 class="hero-title"><span class="ht-a">Un lugar de</span> <em class="ht-b">estar</em></h1>
        <p class="hero-pitch rv" style="--d:200ms">Moda, gastronomía y vida social entre plantas y fuentes de agua. ${open ? `<span class="status on">Abierto ahora · hasta ${th.close}</span>` : `<span class="status">Cerrado ahora · abre ${th?.open || ''}</span>`}</p>
        <div class="hero-cta rv" style="--d:320ms">
          <a class="btn btn-primary" href="/tiendas" data-magnetic>Ver tiendas ${icon.arrow}</a>
          <a class="btn btn-ghost" href="/gastronomia" data-magnetic>Gastronomía</a>
        </div>
      </div>
      <a class="scroll-hint" href="#manifiesto" aria-label="Bajar"><span></span>Scroll</a>
    </div>
  </section>

  <section class="manifesto" id="manifiesto">
    <p class="kicker">( Bienvenidos )</p>
    <p class="manifesto-text">Patio Design introduce un nuevo concepto en Santa Cruz: un punto de encuentro donde las plantas y las fuentes de agua se funden con la moda y la gastronomía. No es solo un lugar para comprar, es un lugar de estar.</p>
  </section>

  <section class="facts" aria-label="En cifras">
    <div class="facts-bg" aria-hidden="true"><img src="${bgSrc(pic('DfKsneKivQ9:0'))}" alt="" loading="lazy"></div>
    <div class="wrap facts-grid">
      <div class="fact rv"><b data-count="${stores.length}">0</b><span>tiendas destacadas en esta web</span></div>
      <div class="fact rv" style="--d:80ms"><b data-count="${restaurants.length}">0</b><span>restaurantes, cafés y heladería</span></div>
      <div class="fact rv" style="--d:160ms"><b data-count="15" data-suffix=" h">0</b><span>abierto de lunes a sábado (07–22)</span></div>
      <div class="fact rv" style="--d:240ms"><b data-count="${Math.round(mall.socials.instagram.followers / 100) / 10}" data-dec="1" data-suffix="K">0</b><span>seguidores en Instagram</span></div>
    </div>
  </section>

  <section class="cats" id="categorias">
    <div class="wrap sec-head"><p class="kicker">( Explorá )</p><h2 class="h2">Todo lo que querés, <em>en un patio</em></h2></div>
    <div class="cats-pin"><div class="cats-track">
      ${categories.map((c, i) => {
        const inCat = c.slug === 'gastronomia' ? restaurants : stores.filter((s) => s.cat === c.slug)
        const im = pic(c.cover)
        return `<a class="cat-card" href="${c.href || `/tiendas?cat=${c.slug}`}" data-cursor="Ver" data-tilt>
          <div class="cat-media">${img(im, { alt: c.name, sizes: '(max-width:760px) 85vw, 46vw' })}<i class="glare"></i></div>
          <div class="cat-body"><span class="cat-n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p>
          <div class="cat-logos">${inCat.slice(0, 5).map((s) => wordmark(s.name, 'wm-xs')).join('')}${inCat.length > 5 ? `<span class="more">+${inCat.length - 5}</span>` : ''}</div></div>
        </a>`
      }).join('')}
    </div></div>
  </section>

  <section class="featured wrap" id="tiendas">
    <div class="sec-head row"><div><p class="kicker">( Tiendas )</p><h2 class="h2">Marcas que <em>te esperan</em></h2></div>
      <a class="btn btn-ghost" href="/tiendas" data-magnetic>Ver las ${stores.length} tiendas ${icon.arrow}</a></div>
    <div class="grid-stores">${featured.map(storeCard).join('')}</div>
  </section>

  <section class="food" id="gastronomia">
    <div class="wrap sec-head row"><div><p class="kicker">( Gastronomía )</p><h2 class="h2">Sobremesas <em>que se alargan</em></h2></div>
      <a class="btn btn-ghost" href="/gastronomia" data-magnetic>Todos los restaurantes ${icon.arrow}</a></div>
    <div class="wrap bento">${restaurants.map((r, i) => foodCard(r, i, foodLayout[i] || '')).join('')}</div>
  </section>

  <section class="reels" id="reels">
    <div class="wrap sec-head row"><div><p class="kicker">( Reels )</p><h2 class="h2">Patio <em>en movimiento</em></h2></div>
      <a class="btn btn-ghost" href="${mall.socials.instagram.url}reels/" target="_blank" rel="noopener">${icon.ig} Ver en Instagram</a></div>
    <div class="rail" tabindex="0" aria-label="Reels de Instagram">${reels.map((c) => post(c)).filter((p) => p?.video).map((p) => videoCard(p, { label: captionBody(p.caption).slice(0, 80) })).join('')}</div>
  </section>

  <section class="events wrap" id="agenda">
    <div class="sec-head"><p class="kicker">( Agenda )</p><h2 class="h2">Lo que <em>está pasando</em></h2></div>
    <div class="events-grid">
      ${events.map((e, i) => { const im = pic(e.post + ':0'); return `<article class="ecard rv" style="--d:${(i % 3) * 80}ms">
        <div class="ecard-media">${img(im, { alt: e.title })}</div>
        <div class="ecard-body"><span class="chip">${esc(e.when)}</span><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p>
        <div class="ecard-links">${e.link ? `<a href="${e.link}" target="_blank" rel="noopener">${esc(e.linkLabel)} ${icon.ext}</a>` : ''}<a href="https://www.instagram.com/p/${e.post}/" target="_blank" rel="noopener">Ver publicación ${icon.ext}</a></div></div>
      </article>` }).join('')}
    </div>
  </section>

  <section class="exp" id="experiencias" aria-label="Experiencias">
    ${experiences.map((x, i) => `<div class="exp-card" style="z-index:${i + 1}">
      <div class="exp-media"><img src="${bgSrc(pic(x.img))}" alt="" loading="lazy"></div>
      <div class="exp-body wrap"><p class="kicker">( ${esc(x.kicker)} )</p><h3 class="h2">${esc(x.title)}</h3><p>${esc(x.text)}</p></div>
    </div>`).join('')}
  </section>

  <section class="community" id="comunidad">
    <div class="wrap community-grid">
      <div class="community-copy"><p class="kicker">( Comunidad )</p><h2 class="h2">Seguinos en <em>@patio</em></h2>
        <p>Novedades de tiendas, eventos, sorteos y la serie Personal Shopper, todos los días.</p>
        <div class="social-btns">
          <a class="btn btn-primary" href="${mall.socials.instagram.url}" target="_blank" rel="noopener" data-magnetic>${icon.ig} Instagram · ${fmtK(mall.socials.instagram.followers)}</a>
          <a class="btn btn-ghost" href="${mall.socials.facebook.url}" target="_blank" rel="noopener" data-magnetic>${icon.fb} Facebook</a>
        </div>
      </div>
      <div class="ring-wrap" aria-hidden="true">${isPhone ? `<div class="mosaic">${ringPics.slice(0, 6).map((p) => img(p.images[0], { sizes: '33vw' })).join('')}</div>` : `<div class="ring">${ringPics.map((p, i) => `<figure style="--i:${i};--n:${ringPics.length}">${img(p.images[0], { sizes: '200px' })}</figure>`).join('')}</div>`}</div>
    </div>
  </section>

  <section class="visit wrap" id="visitanos">
    <div class="sec-head"><p class="kicker">( Visitanos )</p><h2 class="h2">Av. Busch <em>&amp;</em> 3er anillo</h2></div>
    <div class="visit-grid">
      <div class="visit-info rv">
        <h3>${icon.clock} Horario general</h3>
        <table class="hours">${mall.hours.map((h) => `<tr><th>${h.days}</th><td>${h.open} – ${h.close}</td></tr>`).join('')}</table>
        <p class="muted small">Cada tienda y restaurante puede tener su propio horario.</p>
        <h3>${icon.pin} Dirección</h3><p>${esc(mall.address)}<br>${esc(mall.city)}, ${esc(mall.country)}</p>
        <h3>${icon.phone} Contacto</h3><p><a href="${mall.phoneHref}">${esc(mall.phone)}</a></p>
        <div class="visit-cta"><a class="btn btn-primary" href="${mall.mapsUrl}" target="_blank" rel="noopener" data-magnetic>Cómo llegar ${icon.arrow}</a>
          <button class="btn btn-ghost" type="button" data-open-wa>${icon.wa} WhatsApp</button></div>
      </div>
      <div class="visit-map rv" style="--d:120ms">
        <iframe title="Mapa de Patio Design" src="${mall.mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        <a class="map-fallback" href="${mall.mapsUrl}" target="_blank" rel="noopener">Abrir en Google Maps ${icon.ext}</a>
      </div>
    </div>
  </section>`

  return {
    page: 'home',
    title: 'Patio Design Lifestyle Center · Santa Cruz de la Sierra',
    description: 'Moda, gastronomía y vida social entre plantas y fuentes de agua. Av. Busch esq. 3er Anillo Interno, Santa Cruz de la Sierra.',
    html,
    mount(root) {
      const offs = []
      // hero title chars
      const chars = splitChars(root.querySelector('.hero-title'))
      if (!reduced) gsap.from(chars, { yPercent: 110, opacity: 0, rotate: 6, stagger: 0.035, duration: 1.1, ease: 'expo.out', delay: window.__firstLoad ? 1.6 : 0.4 })

      // carousel
      const slides = [...root.querySelectorAll('.hero-slide')], bars = [...root.querySelectorAll('.hero-bars button')]
      const cap = root.querySelector('.hero-cap-t')
      let cur = 0, timer, heroVisible = true
      const DUR = reduced ? 9000 : 6500
      const go = (n) => {
        slides[cur].classList.remove('on'); bars[cur].classList.remove('on', 'done')
        bars.forEach((b, i) => b.classList.toggle('done', i < n))
        cur = (n + slides.length) % slides.length
        slides[cur].classList.add('on'); slides[cur].classList.toggle('alt', cur % 2 === 1)
        bars[cur].classList.remove('on'); void bars[cur].offsetWidth; bars[cur].classList.add('on')
        bars[cur].style.setProperty('--dur', DUR + 'ms')
        cap.textContent = `${String(cur + 1).padStart(2, '0')} · ${slides[cur].dataset.i && pickCaption(cur)}`
        clearTimeout(timer); if (heroVisible && !document.hidden) timer = setTimeout(() => go(cur + 1), DUR)
      }
      const pickCaption = (i) => heroSlides[i].caption
      bars.forEach((b, i) => b.addEventListener('click', () => go(i)))
      bars[0].style.setProperty('--dur', DUR + 'ms'); bars[0].classList.add('on')
      timer = setTimeout(() => go(1), DUR)
      const heroEl = root.querySelector('.hero')
      const hio = new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; clearTimeout(timer); if (heroVisible) timer = setTimeout(() => go(cur + 1), DUR) })
      hio.observe(heroEl)
      const vis = () => { clearTimeout(timer); if (!document.hidden && heroVisible) timer = setTimeout(() => go(cur + 1), DUR) }
      document.addEventListener('visibilitychange', vis)
      offs.push(() => { clearTimeout(timer); hio.disconnect(); document.removeEventListener('visibilitychange', vis) })

      // particles (code split)
      let hero
      const canvas = root.querySelector('.hero-canvas')
      const startHero = () => import('../hero.js').then(({ createHero }) => {
        if (!canvas.isConnected) return
        hero = createHero(canvas, { lines: mall.wordmark, phone: isPhone })
      })
      const kick = () => ('requestIdleCallback' in window ? requestIdleCallback(startHero, { timeout: 1500 }) : setTimeout(startHero, 300))
      setTimeout(kick, window.__firstLoad ? (isPhone ? 2600 : 900) : 200) // let the preloader finish first on phones
      offs.push(() => hero?.destroy())

      if (!reduced) {
        ScrollTrigger.create({ trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => hero?.setScroll(s.progress * 1.4) })
        gsap.to('.hero-bg', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } })
        gsap.to('.hero-ui', { yPercent: -12, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'center center', end: 'bottom top', scrub: true } })
      }

      // manifesto words light up
      const words = splitWords(root.querySelector('.manifesto-text'))
      if (!reduced) gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'bottom 55%', scrub: true } })

      // counters
      const cio = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return
        const b = e.target, to = +b.dataset.count, dec = +(b.dataset.dec || 0), suf = b.dataset.suffix || ''
        const o = { v: 0 }
        gsap.to(o, { v: to, duration: reduced ? 0 : 1.8, ease: 'expo.out', onUpdate: () => (b.textContent = o.v.toFixed(dec) + suf) })
        cio.unobserve(b)
      }), { threshold: 0.5 })
      root.querySelectorAll('[data-count]').forEach((b) => cio.observe(b))
      offs.push(() => cio.disconnect())
      if (!reduced) gsap.fromTo('.facts-bg img', { yPercent: -12 }, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.facts', start: 'top bottom', end: 'bottom top', scrub: true } })

      // categories: pinned horizontal scroll on desktop
      if (!isPhone && !reduced) {
        const track = root.querySelector('.cats-track')
        const dist = () => track.scrollWidth - innerWidth + 64
        gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.cats-pin', start: 'top top+=80', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true } })
        root.querySelectorAll('.cat-media img').forEach((im) => gsap.fromTo(im, { xPercent: -3 }, { xPercent: 3, ease: 'none', scrollTrigger: { trigger: '.cats-pin', start: 'top top+=80', end: () => '+=' + dist(), scrub: true } }))
      }

      // stacked experiences
      if (!reduced) {
        const cards = gsap.utils.toArray('.exp-card')
        cards.forEach((c, i) => {
          if (i === cards.length - 1) return
          gsap.to(c, { scale: 0.9, borderRadius: 28, ...(isPhone ? {} : { filter: 'brightness(.45)' }), ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top top', scrub: true } })
        })
      }

      // ring
      const ring = root.querySelector('.ring')
      if (ring && !reduced) gsap.to(ring, { rotateY: -360, ease: 'none', scrollTrigger: { trigger: '.community', start: 'top bottom', end: 'bottom top', scrub: 1 } })

      offs.push(videoCards(root))

      // refresh ScrollTrigger when images/fonts load
      const onLoad = () => debouncedRefresh(ScrollTrigger)
      root.querySelectorAll('img').forEach((im) => im.complete || im.addEventListener('load', onLoad, { once: true }))
      document.fonts?.ready.then(onLoad)
      return () => offs.forEach((f) => f())
    },
  }
}
