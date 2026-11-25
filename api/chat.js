// Hoja — AI receptionist for Patio Design. Streams plain text to the client.
// Provider by env var: NVIDIA_API_KEY (OpenAI-compatible) → else ANTHROPIC_API_KEY (Claude) → else 503.
// Secrets live only in Vercel env vars. Never log them.
import Anthropic from '@anthropic-ai/sdk'
import { KNOWLEDGE } from './_knowledge.js'

const SYSTEM = `Sos Hoja, la recepcionista virtual de Patio Design Lifestyle Center en Santa Cruz de la Sierra, Bolivia.
Hablás en español boliviano cruceño, cálido y cercano, con voseo ("podés", "tenés", "vení").
Reglas:
- Respondé en 1 a 4 oraciones cortas. Si listás, usá viñetas "• " (máximo 6). Texto plano: nada de markdown, asteriscos ni títulos.
- Usá SOLO la información de la BASE DE CONOCIMIENTO. Si algo no está (cartelera de cine, stock, precios no publicados, estacionamiento, objetos perdidos, etc.), decilo con honestidad y sugerí llamar a la administración al +591 3 3364141 o escribir a la cuenta de Instagram del local.
- Cuando corresponda, mencioná rutas del sitio como /tiendas/levis o /gastronomia/jarana (el sitio las convierte en enlaces).
- Menús: solo lo que el restaurante o el mall publicó; aclaralo ("según lo que publicaron, no es el menú completo") y sugerí pedir la carta por WhatsApp o Instagram.
- Promos y eventos: mencioná la fecha de la publicación.
- "¿Está abierto?": calculalo con la fecha y hora actual que te doy y el horario general (cada local puede variar).
- Podés responder sobre el sitio web en sí: páginas, términos, privacidad, cookies, accesibilidad.
- Nunca pidas datos personales. Hablá solo de Patio Design y de este sitio; si te preguntan otra cosa, redirigí amablemente.
- No inventes nada: ni teléfonos, ni horarios, ni precios, ni locales.`

const hits = new Map()
function limited(ip) {
  const now = Date.now(), win = 5 * 60e3
  const arr = (hits.get(ip) || []).filter((t) => now - t < win)
  arr.push(now); hits.set(ip, arr)
  if (hits.size > 5000) hits.clear()
  return arr.length > 30
}

function nowInSantaCruz() {
  return new Date().toLocaleString('es-BO', { timeZone: 'America/La_Paz', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function validate(body) {
  const msgs = Array.isArray(body?.messages) ? body.messages : null
  if (!msgs?.length) return null
  const clean = msgs
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-16)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1200) }))
  while (clean.length && clean[0].role !== 'user') clean.shift()
  if (!clean.length || clean[clean.length - 1].role !== 'user') return null
  return clean
}

// Removes <think>…</think> even when tags are split across chunks.
function thinkStripper() {
  let buf = '', inThink = false
  return (chunk, flush = false) => {
    buf += chunk
    let out = ''
    for (;;) {
      if (inThink) {
        const end = buf.indexOf('</think>')
        if (end < 0) { buf = buf.slice(-8); return out }
        buf = buf.slice(end + 8); inThink = false
      } else {
        const start = buf.indexOf('<think>')
        if (start < 0) {
          let hold = 0 // longest suffix of buf that could begin "<think>"
          if (!flush) for (let k = Math.min(6, buf.length); k > 0; k--) if ('<think>'.startsWith(buf.slice(-k))) { hold = k; break }
          out += buf.slice(0, buf.length - hold); buf = buf.slice(buf.length - hold)
          return out
        }
        out += buf.slice(0, start); buf = buf.slice(start + 7); inThink = true
      }
    }
  }
}

async function streamNvidia(messages, write) {
  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`, 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify({
      model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b',
      stream: true, temperature: 0.5, max_tokens: 1024,
      chat_template_kwargs: { enable_thinking: false },
      messages: [{ role: 'system', content: `${SYSTEM}\n\nBASE DE CONOCIMIENTO:\n${KNOWLEDGE}\n\nAhora en Santa Cruz: ${nowInSantaCruz()}.` }, ...messages],
    }),
  })
  if (!res.ok || !res.body) throw Object.assign(new Error('upstream'), { status: res.status })
  const strip = thinkStripper(), dec = new TextDecoder()
  let pending = '', sent = 0
  for await (const part of res.body) {
    pending += dec.decode(part, { stream: true })
    const lines = pending.split('\n'); pending = lines.pop()
    for (const line of lines) {
      const t = line.trim()
      if (!t.startsWith('data:')) continue
      const data = t.slice(5).trim()
      if (data === '[DONE]') continue
      try {
        const delta = JSON.parse(data).choices?.[0]?.delta?.content
        if (delta) { const o = strip(delta); if (o) { write(o); sent += o.length } }
      } catch {}
    }
  }
  const rest = strip('', true); if (rest) { write(rest); sent += rest.length }
  return sent
}

async function streamClaude(messages, write) {
  const client = new Anthropic()
  const stream = client.beta.messages.stream({
    model: process.env.ANTHROPIC_MODEL || 'claude-opus-5-5',
    max_tokens: 4096,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default', // re-run on a fallback model if a safety classifier declines
    output_config: { effort: 'low' },
    system: [
      { type: 'text', text: `${SYSTEM}\n\nBASE DE CONOCIMIENTO:\n${KNOWLEDGE}`, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: `Fecha y hora actual en Santa Cruz: ${nowInSantaCruz()}.` }, // after the breakpoint: not cached
    ],
    messages,
  })
  let sent = 0
  stream.on('text', (t) => { write(t); sent += t.length })
  const final = await stream.finalMessage()
  if (final.stop_reason === 'refusal' && !sent) {
    const msg = 'Perdón, no puedo ayudarte con eso. Si tenés una consulta sobre Patio Design, llamá al +591 3 3364141.'
    write(msg); sent += msg.length
  }
  return sent
}

export default async function handler(req, res) {
  const provider = process.env.NVIDIA_API_KEY ? 'nvidia' : process.env.ANTHROPIC_API_KEY ? 'anthropic' : null
  if (req.method === 'GET') return res.status(200).json({ configured: !!provider, provider })
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })
  if (!provider) return res.status(503).json({ error: 'not_configured' })
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'anon'
  if (limited(ip)) return res.status(429).json({ error: 'rate_limited' })
  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = null } }
  const messages = validate(body)
  if (!messages) return res.status(400).json({ error: 'invalid_messages' })

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' })
  const write = (t) => res.write(t)
  try {
    const sent = provider === 'nvidia' ? await streamNvidia(messages, write) : await streamClaude(messages, write)
    if (!sent) write('Perdón, no pude responder ahora. Probá de nuevo o llamá al +591 3 3364141.')
  } catch (err) {
    let kind = 'upstream_error'
    if (err instanceof Anthropic.RateLimitError || err?.status === 429) kind = 'rate_limited'
    else if (err instanceof Anthropic.AuthenticationError || err?.status === 401) kind = 'auth_error'
    else if (err instanceof Anthropic.APIConnectionError) kind = 'connection_error'
    console.error('chat error:', kind, err?.status || '') // no message bodies, no secrets
    write('Perdón, tuve un problema para responder. Probá de nuevo en un momento o llamá al +591 3 3364141.')
  }
  res.end()
}
