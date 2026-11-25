import { mall, faqs, BOT } from '../data.js'
import { esc } from '../ui.js'
import { legalNavLinks } from './cards.js'
import notfound from './notfound.js'

const UPDATED = '25 de noviembre de 2026'
const C = `<a href="${mall.phoneHref}">${mall.phone}</a>`

const pages = {
  terminos: {
    title: 'Términos y condiciones',
    body: `
<h2>1. Objeto del sitio</h2><p>Este sitio presenta ${mall.fullName} (${mall.address}, ${mall.city}, ${mall.country}): sus tiendas, restaurantes, eventos y servicios. Su uso es gratuito y no requiere registro.</p>
<h2>2. Información de los locales</h2><p>La información sobre tiendas y restaurantes (productos, precios, promociones, horarios) es referencial y proviene de publicaciones oficiales en redes sociales. Cada local es el único responsable de sus productos, precios, stock, promociones y atención. Ante cualquier duda, confirmá directamente con el local.</p>
<h2>3. Reservas por WhatsApp</h2><p>Los botones "Reservar" abren una conversación de WhatsApp con el restaurante. La reserva es un acuerdo entre vos y el restaurante; este sitio no la gestiona ni la garantiza.</p>
<h2>4. Recepcionista virtual (${BOT.name})</h2><p>${BOT.name} es un asistente de inteligencia artificial que responde con la información publicada en este sitio. Puede cometer errores y sus respuestas no son vinculantes. No le compartas datos personales sensibles.</p>
<h2>5. Promociones y sorteos</h2><p>Las promociones del centro comercial (por ejemplo, sorteos) se rigen por sus propias bases y condiciones, enlazadas en cada publicación.</p>
<h2>6. Uso permitido</h2><p>Podés navegar y compartir enlaces del sitio. No está permitido usarlo para fines ilícitos, intentar vulnerar su seguridad, ni extraer su contenido de forma masiva o automatizada.</p>
<h2>7. Propiedad intelectual y marcas</h2><p>El diseño y los textos del sitio pertenecen a sus titulares. Las marcas, logotipos y nombres comerciales de los locales pertenecen a sus respectivos dueños y se mencionan solo con fines informativos. Las fotos provienen de las cuentas oficiales indicadas en cada página.</p>
<h2>8. Enlaces a terceros</h2><p>El sitio enlaza a Instagram, Facebook, WhatsApp, Google Maps y otros servicios que tienen sus propias condiciones y políticas.</p>
<h2>9. Responsabilidad</h2><p>Se procura que la información esté actualizada, pero no se garantiza que sea completa o exacta en todo momento. Nada en estos términos limita los derechos que te reconoce la normativa boliviana de protección a consumidores y usuarios.</p>
<h2>10. Cambios</h2><p>Estos términos pueden actualizarse. La versión vigente es la publicada en esta página.</p>
<h2>11. Ley aplicable y jurisdicción</h2><p>Se rigen por las leyes del Estado Plurinacional de Bolivia. Cualquier controversia se someterá a los tribunales competentes de ${mall.city}.</p>
<h2>12. Contacto</h2><p>Administración: ${C}.</p>`,
  },
  privacidad: {
    title: 'Política de privacidad',
    body: `
<h2>1. Responsable</h2><p>${mall.fullName}, ${mall.address}, ${mall.city}, ${mall.country}. Contacto: ${C}.</p>
<h2>2. Qué datos se tratan</h2><ul>
<li><b>Datos técnicos de navegación</b>: el proveedor de hosting registra datos como dirección IP, navegador y páginas visitadas para operar y proteger el servicio.</li>
<li><b>Mensajes al asistente ${BOT.name}</b>: el texto que escribís se envía al proveedor de inteligencia artificial para generar la respuesta. Este sitio no guarda esas conversaciones.</li>
<li><b>WhatsApp, teléfono y redes</b>: si hacés clic en esos enlaces, la comunicación ocurre en esos servicios, bajo sus políticas.</li>
<li><b>Almacenamiento local</b>: guardamos en tu navegador una marca para no volver a mostrarte el aviso de cookies.</li></ul>
<h2>3. Finalidades</h2><p>Mostrar el sitio, responder consultas a través del asistente, mejorar la seguridad y el funcionamiento.</p>
<h2>4. Encargados y terceros</h2><p>Vercel (hosting), el proveedor de IA configurado para el asistente, Google (Maps y Fonts), Meta (Instagram, Facebook, WhatsApp).</p>
<h2>5. Conservación</h2><p>Los registros técnicos se conservan el tiempo que defina el proveedor de hosting. Las conversaciones con ${BOT.name} no se almacenan en este sitio.</p>
<h2>6. Tus derechos</h2><p>La Constitución Política del Estado reconoce el derecho a la intimidad y a la privacidad, y la acción de protección de privacidad (art. 130) para conocer, objetar, rectificar o eliminar datos personales. Podés ejercerlos contactando a la administración.</p>
<h2>7. Menores</h2><p>El sitio no está dirigido a menores y no recopila sus datos de forma intencional.</p>
<h2>8. Cambios</h2><p>Esta política puede actualizarse; la versión vigente es la publicada aquí.</p>`,
  },
  cookies: {
    title: 'Política de cookies',
    body: `
<h2>Cookies propias</h2><p>Este sitio <b>no usa cookies propias de seguimiento ni de publicidad</b>. Solo guarda en el almacenamiento local de tu navegador una marca que indica que ya viste el aviso.</p>
<h2>Cookies de terceros</h2><p>Algunos contenidos integrados pueden instalar cookies propias de sus servicios cuando los usás: el mapa de Google Maps, las fuentes de Google Fonts y los enlaces a Instagram, Facebook o WhatsApp.</p>
<h2>Cómo gestionarlas</h2><p>Podés borrar el almacenamiento local y bloquear cookies de terceros desde la configuración de tu navegador. El sitio seguirá funcionando.</p>`,
  },
  'aviso-legal': {
    title: 'Aviso legal',
    body: `
<h2>Titular</h2><p>${mall.fullName}. ${mall.address}, ${mall.city}, ${mall.country}. Teléfono ${C}.</p>
<p class="muted">Los datos registrales de la sociedad titular serán incorporados por su asesoría legal.</p>
<h2>Hosting</h2><p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, EE. UU.</p>
<h2>Marcas de terceros</h2><p>Las marcas de las tiendas y restaurantes pertenecen a sus titulares; su mención es informativa y no implica patrocinio.</p>
<h2>Créditos de imágenes</h2><p>Fotografías y videos: cuenta oficial @patiodesignlifestylecenter en Instagram y cuentas oficiales de cada marca indicadas en sus páginas.</p>
<h2>Retiro de contenido</h2><p>Si sos titular de un contenido y querés que se retire o corrija, comunicate al ${C}.</p>`,
  },
  accesibilidad: {
    title: 'Accesibilidad',
    body: `
<h2>Objetivo</h2><p>Buscamos cumplir el nivel AA de las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2.</p>
<h2>Qué hicimos</h2><ul><li>Enlace para saltar al contenido, estructura semántica y foco visible.</li><li>Textos alternativos en las fotos.</li><li>Navegación completa con teclado, incluida la galería (Esc y flechas).</li><li>Respeto de la preferencia de movimiento reducido del sistema.</li><li>El chat anuncia las respuestas a lectores de pantalla.</li></ul>
<h2>Limitaciones conocidas</h2><ul><li>Los videos de Instagram no tienen subtítulos propios.</li><li>El mapa integrado de Google puede no ser accesible por completo; ofrecemos un enlace alternativo.</li><li>El título de partículas del inicio es decorativo; el texto equivalente está disponible para lectores de pantalla.</li></ul>
<h2>Contacto</h2><p>Si encontrás una barrera, avisanos al ${C}.</p>`,
  },
}

export default function legal({ params, kind }) {
  const key = kind === 'faq' ? 'faq' : params[0]
  const nav = `<nav class="legal-nav" aria-label="Información legal">${legalNavLinks().map(([h, t]) => `<a href="${h}" ${h.endsWith('/' + key) || (key === 'faq' && h === '/ayuda') ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</nav>`
  if (key === 'faq') {
    return {
      page: 'legal', title: 'Preguntas frecuentes · Patio Design', description: 'Horarios, ubicación, reservas y contacto de Patio Design.',
      html: `<section class="page-hero wrap"><nav class="crumbs" aria-label="Migas de pan"><a href="/">Inicio</a><span>/</span><span aria-current="page">Ayuda</span></nav><p class="kicker">( Ayuda )</p><h1 class="h1">Preguntas <em>frecuentes</em></h1></section>
      <section class="wrap legal">${nav}<article class="legal-body">${faqs.map((f) => `<details class="faq"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
      <p><button class="btn btn-primary" data-open-chat>Preguntale a ${BOT.name}</button></p><p class="muted small">Última actualización: ${UPDATED}</p></article></section>`,
    }
  }
  const pg = pages[key]
  if (!pg) return notfound()
  return {
    page: 'legal', title: `${pg.title} · Patio Design`, description: `${pg.title} del sitio de ${mall.fullName}.`,
    html: `<section class="page-hero wrap"><nav class="crumbs" aria-label="Migas de pan"><a href="/">Inicio</a><span>/</span><span>Legal</span><span>/</span><span aria-current="page">${pg.title}</span></nav><p class="kicker">( Legal )</p><h1 class="h1">${pg.title}</h1></section>
    <section class="wrap legal">${nav}<article class="legal-body">${pg.body}<p class="muted small">Última actualización: ${UPDATED}</p></article></section>`,
  }
}
