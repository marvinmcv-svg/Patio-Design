import { stores, restaurants, mall } from '../data.js'
import { pic, placeGallery, placeVideos, placeNews, captionTitle, captionBody, fmtDate, catName, isOpen, todayHours, sm } from '../content.js'
import { img, esc, icon, wordmark, lightbox, videoCards, videoCard } from '../ui.js'
import { storeCard, foodCard } from './cards.js'
import notfound from './notfound.js'

export default function place({ params, kind }) {
  const list = kind === 'food' ? restaurants : stores
  const idx = list.findIndex((x) => x.slug === params[0])
  if (idx < 0) return notfound()
  const p = list[idx], food = kind === 'food'
  const base = food ? '/gastronomia' : '/tiendas'
  const next = list[(idx + 1) % list.length]
  const cover = pic(p.cover)
  const gallery = placeGallery(p), vids = placeVideos(p), news = placeNews(p)
  const related = food ? restaurants.filter((r) => r.slug !== p.slug).slice(0, 4) : stores.filter((s) => s.cat === p.cat && s.slug !== p.slug).concat(stores.filter((s) => s.cat !== p.cat)).slice(0, 5)
  const open = isOpen(), th = todayHours()
  const igUrl = p.ig ? `https://www.instagram.com/${p.ig}/` : `https://www.instagram.com/p/${p.posts[0]}/`
  const waText = encodeURIComponent(food ? `Hola ${p.name}, quiero hacer una reserva. Vengo desde la web de Patio Design.` : `Hola ${p.name}, tengo una consulta. Vengo desde la web de Patio Design.`)
  const where = food ? 'Patio Design · área gastronómica' : 'Patio Design'

  return {
    page: 'place',
    title: `${p.name} · ${food ? p.cuisine : catName(p.cat)} · Patio Design`,
    description: `${p.name} en Patio Design Lifestyle Center, Santa Cruz de la Sierra. ${p.about}`,
    html: `
    <section class="place-hero">
      <div class="wrap place-hero-in">
        <div class="place-copy">
          <nav class="crumbs" aria-label="Migas de pan"><a href="/">Inicio</a><span>/</span><a href="${base}">${food ? 'Gastronomía' : 'Tiendas'}</a><span>/</span><span aria-current="page">${esc(p.name)}</span></nav>
          <div class="place-badge">${wordmark(p.name, 'wm-lg')}</div>
          <p class="place-meta"><span class="status ${open ? 'on' : ''}">${open ? 'Abierto ahora' : 'Cerrado ahora'}</span><span>${esc(food ? p.cuisine : catName(p.cat))}</span><span>${esc(where)}</span></p>
          <h1 class="place-title">${esc(p.name)}</h1>
          <p class="place-lead">${esc(p.about)}</p>
          <div class="place-actions">
            ${p.wa ? `<a class="btn btn-wa" href="https://wa.me/${p.wa}?text=${waText}" target="_blank" rel="noopener" data-magnetic>${icon.wa} ${food ? 'Reservar por WhatsApp' : 'WhatsApp'}</a>` : ''}
            ${p.phone ? `<a class="btn btn-ghost" href="tel:${p.phone.replace(/\s/g, '')}" data-magnetic>${icon.phone} ${esc(p.phone)}</a>` : ''}
            <a class="btn ${p.wa ? 'btn-ghost' : 'btn-primary'}" href="${igUrl}" target="_blank" rel="noopener" data-magnetic>${icon.ig} ${p.ig ? '@' + esc(p.ig) : 'Ver en Instagram'}</a>
          </div>
        </div>
        <figure class="place-figure">${cover ? img(cover, { alt: `${p.name} en Patio Design`, sizes: '(max-width:760px) 100vw, 44vw', eager: true }) : wordmark(p.name, 'wm-fill')}</figure>
      </div>
    </section>

    <section class="wrap info-cards">
      <div class="info rv"><h2>${icon.pin} Ubicación</h2><p>${esc(where)}<br>${esc(mall.address)}</p><a href="${mall.mapsUrl}" target="_blank" rel="noopener">Cómo llegar ${icon.arrow}</a></div>
      <div class="info rv" style="--d:60ms"><h2>${icon.clock} Horario</h2><p>Horario general del centro hoy: ${th ? `${th.open} – ${th.close}` : '—'}</p><p class="muted small">El local puede tener horario propio; confirmalo en su Instagram.</p></div>
      <div class="info rv" style="--d:120ms"><h2>${icon.phone} ${food ? 'Reservas' : 'Contacto'}</h2>${p.phone ? `<p><a href="tel:${p.phone.replace(/\s/g, '')}">${esc(p.phone)}</a></p>` : `<p>Escribiles por Instagram o llamá a la administración: <a href="${mall.phoneHref}">${esc(mall.phone)}</a></p>`}</div>
      <div class="info rv" style="--d:180ms"><h2>${icon.ig} Redes</h2><p><a href="${igUrl}" target="_blank" rel="noopener">${p.ig ? '@' + esc(p.ig) : 'Publicación en Patio'}</a></p></div>
    </section>

    <section class="wrap about">
      <div class="about-copy rv"><p class="kicker">( Sobre ${esc(p.name)} )</p><p class="about-text">${esc(p.name)} ${food ? 'te espera' : 'está'} en Patio Design, ${esc(mall.address)}. ${esc(p.about)}</p></div>
      <div class="about-chips rv" style="--d:100ms"><h3>${food ? 'Para probar' : 'Qué encontrás'}</h3><div class="chips">${(food ? p.menu : p.lines).map((l) => `<span class="chip">${esc(l)}</span>`).join('')}</div>
      ${food ? '<p class="muted small">Según lo que publicaron, no es el menú completo. Pedí la carta por WhatsApp o Instagram.</p>' : ''}</div>
    </section>

    ${news.length ? `<section class="wrap news">
      <div class="sec-head"><p class="kicker">( Novedades en Patio Design )</p><h2 class="h2">${esc(p.name)} <em>en Patio</em></h2></div>
      <div class="news-list">${news.map((n) => `<article class="news-item rv"><time datetime="${n.date}">${fmtDate(n.date)}</time><div><h3>${esc(captionTitle(n.caption))}</h3><p>${esc(captionBody(n.caption))}</p>
        <a href="https://www.instagram.com/p/${n.code}/" target="_blank" rel="noopener">Ver en Instagram ${icon.ext}</a></div></article>`).join('')}</div>
    </section>` : ''}

    ${gallery.length ? `<section class="wrap gallery-sec">
      <div class="sec-head"><p class="kicker">( ${food ? 'Platos' : 'Productos'} )</p><h2 class="h2">En <em>fotos</em></h2></div>
      <div class="masonry">${gallery.map((g, i) => `<button class="m-item rv" data-lb="${i}" data-cursor="Ver" aria-label="Ampliar foto: ${esc(g.title)}">${img(g, { alt: g.title, sizes: '(max-width:760px) 50vw, 33vw' })}</button>`).join('')}</div>
      <p class="credit muted small">Fotos: @patiodesignlifestylecenter en Instagram.</p>
    </section>` : ''}

    ${vids.length ? `<section class="reels"><div class="wrap sec-head"><p class="kicker">( Videos )</p></div><div class="rail">${vids.map((v) => videoCard(v, { label: captionTitle(v.caption) })).join('')}</div></section>` : ''}

    <section class="wrap related">
      <div class="sec-head"><p class="kicker">( También te puede gustar )</p></div>
      <div class="${food ? 'bento small' : 'grid-stores'}">${related.map((r, i) => (food ? foodCard(r, i) : storeCard(r, i))).join('')}</div>
    </section>

    <a class="next-link wrap" href="${base}/${next.slug}" data-cursor="Siguiente">
      <span class="kicker">Siguiente</span><span class="next-name">${esc(next.name)} →</span>
      ${pic(next.cover) ? `<img class="next-prev" src="${sm(pic(next.cover).src)}" alt="" loading="lazy">` : ''}
    </a>`,
    mount(root) {
      root.querySelectorAll('[data-lb]').forEach((b) => b.addEventListener('click', () => lightbox(gallery, +b.dataset.lb)))
      const nl = root.querySelector('.next-link'), prev = root.querySelector('.next-prev')
      const mv = (e) => { if (prev) prev.style.transform = `translate(${e.clientX - nl.getBoundingClientRect().left}px, ${e.clientY - nl.getBoundingClientRect().top}px) translate(-50%,-50%)` }
      nl.addEventListener('pointermove', mv)
      return videoCards(root)
    },
  }
}
