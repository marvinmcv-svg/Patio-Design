import { icon } from '../ui.js'
export default function notfound() {
  return {
    page: '404',
    title: 'Te perdiste en el Patio · Patio Design',
    description: 'Página no encontrada.',
    html: `<section class="nf wrap"><p class="kicker">( Error 404 )</p><h1 class="h1">Te perdiste <em>en el Patio</em></h1>
      <p class="lead">Esta página no existe. Pero hay mucho para ver.</p>
      <div class="hero-cta"><a class="btn btn-primary" href="/">Volver al inicio ${icon.arrow}</a><a class="btn btn-ghost" href="/tiendas">Ver tiendas</a><button class="btn btn-ghost" data-open-chat>Preguntale a Hoja</button></div></section>`,
  }
}
