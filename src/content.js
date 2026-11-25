// Media helpers on top of data.js + media.json
import media from './media.json'
import { stores, restaurants, categories, mall } from './data.js'

export const posts = media.posts

export function post(code) { return posts[code] || null }

/** 'CODE:i' -> image object {src,w,h} */
export function pic(ref) {
  if (!ref) return null
  const [code, i = 0] = ref.split(':')
  const p = posts[code]
  return p?.images?.[+i] || p?.images?.[0] || null
}

export const sm = (src) => src.replace(/\.webp$/, '-sm.webp')

/** first line of a caption, cleaned of handles/hashtags */
export function captionTitle(text = '') {
  const first = text.split(' / ')[0]
  return clean(first).slice(0, 90)
}
export function clean(text = '') {
  return text.replace(/#[\wÀ-ÿ]+/g, '').replace(/\s+\/\s+/g, ' ').replace(/\s{2,}/g, ' ').trim()
}
export function captionBody(text = '') {
  return text.split(' / ').map(clean).filter(Boolean).filter((l) => !/^@[\w.]+$/.test(l)).join(' ')
}

export function placeGallery(place) {
  const out = []
  for (const code of place.posts || []) {
    const p = posts[code]
    if (!p) continue
    p.images.forEach((im) => out.push({ ...im, code, title: captionTitle(p.caption), date: p.date }))
  }
  return out
}
export function placeVideos(place) {
  return (place.posts || []).map((c) => posts[c]).filter((p) => p?.video)
}
export function placeNews(place) {
  return (place.posts || []).map((c) => posts[c]).filter(Boolean).sort((a, b) => b.date.localeCompare(a.date))
}

export const allPlaces = () => [
  ...stores.map((s) => ({ ...s, kind: 'store', href: `/tiendas/${s.slug}` })),
  ...restaurants.map((r) => ({ ...r, kind: 'food', href: `/gastronomia/${r.slug}` })),
]
export const catName = (slug) => categories.find((c) => c.slug === slug)?.name || slug

/** Open-now in the mall's time zone (America/La_Paz, UTC-4, no DST) */
export function mallNow() {
  const d = new Date(Date.now() - 4 * 3600e3)
  return { dow: d.getUTCDay(), mins: d.getUTCHours() * 60 + d.getUTCMinutes() }
}
export function isOpen(hours = mall.hours) {
  const { dow, mins } = mallNow()
  const h = hours.find((x) => x.dow.includes(dow))
  if (!h) return false
  const t = (s) => +s.slice(0, 2) * 60 + +s.slice(3)
  return mins >= t(h.open) && mins < t(h.close)
}
export function todayHours() {
  const { dow } = mallNow()
  return mall.hours.find((x) => x.dow.includes(dow))
}

export const fmtDate = (iso) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('es-BO', { day: 'numeric', month: 'short', year: 'numeric' })
export const fmtK = (n) => (n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 1 : 1).replace('.0', '') + 'K' : String(n))
