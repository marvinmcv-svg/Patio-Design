import { pic, catName } from '../content.js'
import { img, esc, icon, wordmark } from '../ui.js'

export function storeCard(s, i = 0) {
  const im = pic(s.cover)
  return `<a class="pcard rv" style="--d:${(i % 5) * 60}ms" href="/tiendas/${s.slug}" data-tilt data-cursor="Ver">
    <div class="pcard-media">${im ? img(im, { alt: `${s.name} en Patio Design` }) : wordmark(s.name, 'wm-fill')}<i class="glare"></i></div>
    <div class="pcard-body">${wordmark(s.name, 'wm-sm')}<div><h3>${esc(s.name)}</h3><p>${esc(catName(s.cat))}</p></div>${icon.arrow}</div>
  </a>`
}

export function foodCard(r, i = 0, cls = '') {
  const im = pic(r.cover)
  return `<article class="fcard rv ${cls}" style="--d:${(i % 4) * 70}ms" data-tilt>
    <a class="fcard-link" href="/gastronomia/${r.slug}" data-cursor="Ver" aria-label="${esc(r.name)}"></a>
    <div class="fcard-media">${im ? img(im, { alt: `${r.name}: ${r.cuisine}`, sizes: '(max-width:760px) 100vw, 50vw' }) : wordmark(r.name, 'wm-fill')}<i class="glare"></i></div>
    <div class="fcard-body">
      <span class="chip">${esc(r.cuisine)}</span>
      <h3>${esc(r.name)}</h3>
      <div class="fcard-actions">
        ${r.wa ? `<a class="btn btn-sm btn-wa" href="https://wa.me/${r.wa}?text=${encodeURIComponent(`Hola ${r.name}, quiero hacer una reserva. Vengo desde la web de Patio Design.`)}" target="_blank" rel="noopener">${icon.wa} Reservar</a>` : `<a class="btn btn-sm btn-ghost" href="${r.ig ? `https://www.instagram.com/${r.ig}/` : `https://www.instagram.com/p/${r.posts[0]}/`}" target="_blank" rel="noopener">${icon.ig} Instagram</a>`}
        <a class="btn btn-sm btn-ghost" href="/gastronomia/${r.slug}">Ver más</a>
      </div>
    </div>
  </article>`
}

export function legalNavLinks() {
  return [
    ['/legal/terminos', 'Términos y condiciones'],
    ['/legal/privacidad', 'Privacidad'],
    ['/legal/cookies', 'Cookies'],
    ['/legal/aviso-legal', 'Aviso legal'],
    ['/legal/accesibilidad', 'Accesibilidad'],
    ['/ayuda', 'Preguntas frecuentes'],
  ]
}
