import { stores, categories } from '../data.js'
import { reveal, tilt, icon, esc } from '../ui.js'
import { storeCard } from './cards.js'

export default function directory({ query }) {
  const cats = categories.filter((c) => c.slug !== 'gastronomia' && stores.some((s) => s.cat === c.slug))
  let cat = query.get('cat') || '', q = query.get('q') || ''
  return {
    page: 'directory',
    title: 'Tiendas · Patio Design',
    description: `Directorio de ${stores.length} tiendas en Patio Design Lifestyle Center, Santa Cruz de la Sierra.`,
    html: `
    <section class="page-hero wrap">
      <nav class="crumbs" aria-label="Migas de pan"><a href="/">Inicio</a><span>/</span><span aria-current="page">Tiendas</span></nav>
      <p class="kicker">( Directorio )</p>
      <h1 class="h1">Tiendas <em>en Patio</em></h1>
      <p class="lead">Marcas que @patiodesignlifestylecenter presentó recientemente "en Patio". El directorio completo puede incluir más locales.</p>
    </section>
    <section class="wrap dir">
      <div class="dir-tools">
        <div class="chips" role="group" aria-label="Filtrar por categoría">
          <button class="chip-btn" data-cat="">Todas</button>
          ${cats.map((c) => `<button class="chip-btn" data-cat="${c.slug}">${esc(c.name)}</button>`).join('')}
          <a class="chip-btn" href="/gastronomia">Gastronomía →</a>
        </div>
        <label class="search">${icon.search}<span class="sr-only">Buscar tienda</span><input type="search" placeholder="Buscar marca…" value="${esc(q)}"></label>
      </div>
      <p class="dir-count muted" aria-live="polite"></p>
      <div class="grid-stores dir-grid"></div>
    </section>`,
    mount(root) {
      const grid = root.querySelector('.dir-grid'), count = root.querySelector('.dir-count'), input = root.querySelector('input')
      let offTilt = () => {}
      const draw = () => {
        const n = q.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
        const list = stores.filter((s) => (!cat || s.cat === cat) && (!n || (s.name + ' ' + s.lines.join(' ')).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').includes(n)))
        grid.innerHTML = list.map(storeCard).join('') || `<p class="empty">No encontramos "${esc(q)}". Probá con otra marca o preguntale a Hoja.</p>`
        count.textContent = `${list.length} ${list.length === 1 ? 'tienda' : 'tiendas'}`
        root.querySelectorAll('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)))
        const u = new URL(location.href)
        cat ? u.searchParams.set('cat', cat) : u.searchParams.delete('cat')
        q ? u.searchParams.set('q', q) : u.searchParams.delete('q')
        history.replaceState({}, '', u.pathname + u.search)
        reveal(grid); offTilt(); offTilt = tilt(grid)
      }
      root.querySelectorAll('[data-cat]').forEach((b) => b.addEventListener('click', () => { cat = b.dataset.cat; draw() }))
      input.addEventListener('input', () => { q = input.value; draw() })
      draw()
      return () => offTilt()
    },
  }
}
