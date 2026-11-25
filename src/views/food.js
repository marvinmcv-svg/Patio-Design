import { restaurants, events } from '../data.js'
import { pic } from '../content.js'
import { img, esc, icon, wordmark } from '../ui.js'
import { foodCard } from './cards.js'

export default function food() {
  const layout = ['big', '', '', '', '', '', '', 'big', '', '', '', '', 'big']
  const nightEvents = events.filter((e) => /acústico|Tardeo|First Call/i.test(e.title))
  return {
    page: 'food',
    title: 'Gastronomía · Patio Design',
    description: `Restaurantes, cafés y heladería en Patio Design: ${restaurants.map((r) => r.name).join(', ')}.`,
    html: `
    <section class="page-hero wrap">
      <nav class="crumbs" aria-label="Migas de pan"><a href="/">Inicio</a><span>/</span><span aria-current="page">Gastronomía</span></nav>
      <p class="kicker">( Gastronomía )</p>
      <h1 class="h1">Comer, brindar <em>y quedarse</em></h1>
      <p class="lead">Sushi, cocina peruana, hamburguesas, café y helados alrededor de la plaza. Reservá directo con cada restaurante.</p>
    </section>
    <section class="wrap logo-wall" aria-label="Restaurantes">
      ${restaurants.map((r) => `<a href="/gastronomia/${r.slug}" class="logo-tile">${wordmark(r.name, 'wm-sm')}<span><b>${esc(r.name)}</b><small>${esc(r.cuisine)}</small></span></a>`).join('')}
    </section>
    <section class="wrap bento">${restaurants.map((r, i) => foodCard(r, i, layout[i] || '')).join('')}</section>
    <section class="wrap events" id="noches">
      <div class="sec-head"><p class="kicker">( Noches en Patio )</p><h2 class="h2">Música <em>en vivo</em></h2></div>
      <div class="events-grid">${nightEvents.map((e) => `<article class="ecard rv"><div class="ecard-media">${img(pic(e.post + ':0'), { alt: e.title })}</div>
        <div class="ecard-body"><span class="chip">${esc(e.when)}</span><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p>
        <div class="ecard-links"><a href="https://www.instagram.com/p/${e.post}/" target="_blank" rel="noopener">Ver publicación ${icon.ext}</a></div></div></article>`).join('')}</div>
    </section>`,
  }
}
