// "Hoja" — AI receptionist widget (streams from /api/chat, local rule-based fallback).
import { mall, stores, restaurants, events, BOT, categories } from './data.js'
import { isOpen, todayHours, catName } from './content.js'
import { esc, icon } from './ui.js'
import { navigate } from './router.js'

const history = []
let apiDownUntil = 0

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/['’]/g, '')

function findPlace(q) {
  const n = norm(q)
  return [...stores.map((s) => ({ ...s, kind: 'store' })), ...restaurants.map((r) => ({ ...r, kind: 'food' }))]
    .find((p) => n.includes(norm(p.name).replace(/['’]/g, '')) || n.includes(norm(p.slug.replace(/-/g, ' '))) || n.includes(norm(p.ig)))
}

export function localAnswer(q) {
  const n = norm(q), th = todayHours(), open = isOpen()
  const p = findPlace(q)
  const path = p ? (p.kind === 'food' ? `/gastronomia/${p.slug}` : `/tiendas/${p.slug}`) : ''
  if (p && /(menu|carta|comer|plato|probar)/.test(n) && p.kind === 'food')
    return `Según lo que publicó ${p.name}: ${p.menu.join(', ')}. No es el menú completo${p.wa ? `; pedí la carta por WhatsApp al ${p.phone}` : `; consultales por Instagram @${p.ig}`}. Más en ${path}`
  if (p && /(reserv)/.test(n))
    return p.wa ? `Podés reservar en ${p.name} por WhatsApp al ${p.phone}. Abrí ${path} y tocá "Reservar por WhatsApp".` : `${p.name} no publicó un número de reservas. Escribiles por Instagram @${p.ig} o mirá ${path}.`
  if (p) return `${p.name} está en Patio Design (${p.kind === 'food' ? p.cuisine : catName(p.cat)}). ${p.about} Más info en ${path}`
  if (/(abiert|horario|hora|cierra|abre)/.test(n))
    return `${open ? 'Sí, ahora está abierto' : 'Ahora está cerrado'}. Horario general: lunes a sábado 07:00–22:00, domingo 08:00–21:00${th ? ` (hoy ${th.open}–${th.close})` : ''}. Cada local puede tener su propio horario.`
  if (/(donde|direccion|ubicac|llegar|queda)/.test(n)) return `Estamos en ${mall.address}, ${mall.city}. Indicaciones: ${mall.mapsUrl}`
  if (/(reserv)/.test(n)) return `Podés reservar por WhatsApp en: ${restaurants.filter((r) => r.wa).map((r) => `${r.name} (${r.phone})`).join(', ')}. Para el resto, escribiles por Instagram. Todo en /gastronomia`
  if (/(evento|musica|agenda|sorteo|navidad|black)/.test(n)) return events.slice(0, 4).map((e) => `• ${e.title} — ${e.when}`).join('\n')
  if (/(comer|restaurant|gastronom|cafe|sushi|hamburg|helad)/.test(n)) return `Gastronomía en Patio:\n${restaurants.slice(0, 6).map((r) => `• ${r.name} — ${r.cuisine}`).join('\n')}\nTodos en /gastronomia`
  const cat = categories.find((c) => n.includes(norm(c.name.split(' ')[0])))
  if (cat) return `En ${cat.name}: ${stores.filter((s) => s.cat === cat.slug).map((s) => s.name).join(', ') || 'mirá /gastronomia'}. Directorio: /tiendas?cat=${cat.slug}`
  if (/(cookie|privacidad|legal|termin|accesib)/.test(n)) return 'Encontrás todo en /legal/terminos, /legal/privacidad, /legal/cookies y /legal/accesibilidad.'
  if (/(telefono|contacto|llamar|whatsapp|perdi|objeto)/.test(n)) return `Podés llamar a la administración al ${mall.phone}.`
  return `Puedo ayudarte con horarios, tiendas, restaurantes, reservas y eventos de Patio Design. Para otras consultas llamá al ${mall.phone}.`
}

function tidy(t) {
  return t.replace(/\*\*/g, '').replace(/^#+\s*/gm, '').replace(/^\s*[-*]\s+/gm, '• ').trim()
}
function linkify(t) {
  return esc(t)
    .replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/(^|[\s(])(\/(?:tiendas|gastronomia|legal|ayuda)[\w\-/?=&]*)/g, '$1<a href="$2" data-internal>$2</a>')
    .replace(/\n/g, '<br>')
}

export function initChat() {
  const panel = document.getElementById('chat')
  const log = panel.querySelector('.chat-log')
  const form = panel.querySelector('form')
  const input = form.querySelector('input')
  const fab = document.getElementById('chat-fab')

  const add = (role, html) => {
    const d = document.createElement('div')
    d.className = `msg ${role}`
    d.innerHTML = html
    log.append(d)
    log.scrollTop = log.scrollHeight
    return d
  }
  const open = () => { panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); document.getElementById('wa-panel').hidden = true; setTimeout(() => input.focus(), 50) }
  const close = () => { panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); fab.focus() }
  fab.addEventListener('click', () => (panel.hidden ? open() : close()))
  panel.querySelector('.chat-close').addEventListener('click', close)
  document.addEventListener('click', (e) => { if (e.target.closest('[data-open-chat]')) open() })
  panel.addEventListener('keydown', (e) => e.key === 'Escape' && close())
  log.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-internal]')
    if (a) { e.preventDefault(); navigate(a.getAttribute('href')); if (matchMedia('(max-width:760px)').matches) close() }
  })

  add('bot', `¡Hola! Soy ${BOT.name}, la recepcionista virtual de Patio Design. ¿En qué te ayudo?`)
  const chips = panel.querySelector('.chat-chips')
  const sugg = ['¿Está abierto ahora?', "¿Qué hay en el menú de KAO by Sach'a?", '¿Dónde queda Patio?', 'Quiero reservar en Jarana']
  chips.innerHTML = sugg.map((s) => `<button type="button">${esc(s)}</button>`).join('')
  chips.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) send(b.textContent) })

  form.addEventListener('submit', (e) => { e.preventDefault(); const v = input.value.trim(); if (v) send(v); input.value = '' })

  async function send(text) {
    chips.hidden = true
    add('user', esc(text))
    history.push({ role: 'user', content: text.slice(0, 1200) })
    const el = add('bot typing', '<span class="dots"><i></i><i></i><i></i></span>')
    let out = ''
    try {
      if (Date.now() < apiDownUntil) throw new Error('down')
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-16) }) })
      if (!res.ok || !res.body) throw new Error('http ' + res.status)
      const reader = res.body.getReader(), dec = new TextDecoder()
      el.classList.remove('typing')
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        out += dec.decode(value, { stream: true })
        el.innerHTML = linkify(out)
        log.scrollTop = log.scrollHeight
      }
      if (!out.trim()) throw new Error('empty')
    } catch {
      apiDownUntil = Date.now() + 60e3
      out = localAnswer(text)
    }
    out = tidy(out)
    el.classList.remove('typing')
    el.innerHTML = linkify(out)
    history.push({ role: 'assistant', content: out.slice(0, 1200) })
    log.scrollTop = log.scrollHeight
  }
}

export function initWhatsApp() {
  const panel = document.getElementById('wa-panel'), fab = document.getElementById('wa-fab'), body = panel.querySelector('.wa-body')
  const withWa = restaurants.filter((r) => r.wa)
  const msg = (t) => encodeURIComponent(`${t} Vengo desde la web de Patio Design.`)
  const home = () => {
    body.innerHTML = `<p>¿En qué te ayudamos?</p>
      <button data-step="reservar">${icon.wa} Reservar en un restaurante</button>
      <button data-step="eventos">Eventos y agenda</button>
      <button data-step="tienda">Consultar a una tienda</button>
      <button data-step="info">Información general</button>`
  }
  const steps = {
    reservar: () => `<p>Restaurantes con reservas por WhatsApp:</p>${withWa.map((r) => `<a class="wa-opt" href="https://wa.me/${r.wa}?text=${msg(`Hola ${r.name}, quiero hacer una reserva.`)}" target="_blank" rel="noopener">${esc(r.name)} <small>${esc(r.cuisine)}</small></a>`).join('')}<p class="muted small">Para los demás, escribiles por Instagram desde <a href="/gastronomia">Gastronomía</a>.</p>`,
    eventos: () => `<p>Los eventos se anuncian en Instagram.</p><a class="wa-opt" href="/#agenda">Ver agenda en la web</a><a class="wa-opt" href="${mall.socials.instagram.url}" target="_blank" rel="noopener">@patiodesignlifestylecenter</a>`,
    tienda: () => `<p>Cada tienda atiende por su Instagram oficial. Buscala en el directorio:</p><a class="wa-opt" href="/tiendas">Ir al directorio</a>`,
    info: () => `<p>Administración de Patio Design:</p><a class="wa-opt" href="${mall.phoneHref}">${icon.phone} Llamar al ${esc(mall.phone)}</a><button data-open-chat class="wa-opt">Preguntale a ${BOT.name}</button>`,
  }
  body.addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]')
    if (b) { body.innerHTML = steps[b.dataset.step]() + '<button class="wa-back">← Volver</button>'; return }
    if (e.target.closest('.wa-back')) return home()
    if (e.target.closest('a,[data-open-chat]')) panel.hidden = true
  })
  const toggle = (show) => { panel.hidden = !show; fab.setAttribute('aria-expanded', String(show)); if (show) { home(); document.getElementById('chat').hidden = true } }
  fab.addEventListener('click', () => toggle(panel.hidden))
  panel.querySelector('.wa-close').addEventListener('click', () => toggle(false))
  document.addEventListener('click', (e) => { if (e.target.closest('[data-open-wa]')) toggle(true) })
}
