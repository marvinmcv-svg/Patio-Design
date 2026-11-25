# Patio Design Lifestyle Center — sitio web

Sitio premium multi-página para Patio Design (Av. Busch esq. 3er Anillo Interno, Santa Cruz de la Sierra).
Vite + GSAP/ScrollTrigger + Lenis + Three.js · Vercel (estático + `api/chat.js`).

```bash
npm install
npm run dev      # desarrollo
npm run build    # regenera api/_knowledge.js y compila a dist/
```

- Contenido: `src/data.js` (cada dato con su fuente). Medios: `public/media/` + `src/media.json`.
- Asistente "Hoja": configurar en Vercel → Settings → Environment Variables (tipo *Sensitive*)
  `ANTHROPIC_API_KEY` (Claude, `claude-opus-5-5`) o `NVIDIA_API_KEY`. Sin clave, el chat usa respuestas locales.
  `GET /api/chat` informa el proveedor configurado.
- Scripts de una sola vez: `scripts/extract-ig.mjs`, `scripts/fetch-media.mjs` (descarga/optimiza medios de Instagram).
