// ALL site content as plain data (also imported by scripts/build-knowledge.mjs for the AI receptionist).
// Source tags:  [IG:CODE] = post on instagram.com/p/CODE by @patiodesignlifestylecenter
//               [MC] = mundocamba.com/place/patio-design-lifestyle-center (listing, mod. 2025-06-25)
//               [TA] = TripAdvisor attraction page d17630343 (hours, official description)
//               [FB-KAO] = facebook.com/kaobysacha   [IG-BIO:handle] = that account's public Instagram bio
// Rule: nothing here is invented. If a fact has no source it is not on the site.

export const SITE = 'patiodesign' // used in WhatsApp prefill ("vengo desde la web de Patio Design")

export const mall = {
  name: 'Patio Design',
  fullName: 'Patio Design Lifestyle Center',
  wordmark: ['PATIO', 'DESIGN'],
  tagline: 'Un lugar de estar para Santa Cruz', // paraphrase of official description [TA]
  hashtag: '#PatioDesign #LifeStyleCenter', // [IG:*]
  description:
    'Un punto de encuentro en el que las plantas y fuentes de agua se funden con la moda y la oferta gastronómica.', // [TA]
  address: 'Av. Busch esquina Tercer Anillo Interno', // [IG:Df5qtbBBMFd] [MC]
  city: 'Santa Cruz de la Sierra',
  country: 'Bolivia',
  geo: { lat: -17.77149933272407, lng: -63.20198722940447 }, // [MC]
  timezone: 'America/La_Paz', // UTC-4, no DST
  phone: '+591 3 3364141', // [MC] (also Yandex Maps / Snapchat place listings)
  phoneHref: 'tel:+59133364141',
  // General hours of the complex as published on TripAdvisor [TA]. Individual stores may differ.
  hours: [
    { days: 'Lunes a sábado', open: '07:00', close: '22:00', dow: [1, 2, 3, 4, 5, 6] },
    { days: 'Domingo', open: '08:00', close: '21:00', dow: [0] },
  ],
  socials: {
    instagram: { handle: '@patiodesignlifestylecenter', url: 'https://www.instagram.com/patiodesignlifestylecenter/', followers: 33490 }, // follower count read 2026-11-25
    facebook: { handle: 'PatioDesignLifestyleCenter', url: 'https://www.facebook.com/PatioDesignLifestyleCenter/' },
  },
  mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=-17.77149933272407,-63.20198722940447',
  mapEmbed: 'https://maps.google.com/maps?q=-17.77149933272407,-63.20198722940447&z=17&output=embed',
}

export const categories = [
  { slug: 'moda', name: 'Moda', blurb: 'Colecciones locales e internacionales para cada ocasión.', cover: 'DfKsneKivQ9:0' },
  { slug: 'calzado-accesorios', name: 'Calzado & Accesorios', blurb: 'Zapatos, carteras y cuero.', cover: 'DgI-pvqE1wM:0' },
  { slug: 'belleza', name: 'Belleza & Fragancias', blurb: 'Perfumería y maquillaje.', cover: 'De9cuUUDXnE:0' },
  { slug: 'joyeria-optica', name: 'Joyería & Óptica', blurb: 'Joyas y lentes con estilo.', cover: 'DfAelCwgSt4:0' },
  { slug: 'deportes', name: 'Deportes', blurb: 'Zapatillas y ropa deportiva.', cover: 'DgGgpxCAODU:0' },
  { slug: 'hogar-regalos', name: 'Hogar & Regalos', blurb: 'Decoración y detalles para regalar.', cover: 'DfkgAaukyuy:0' },
  { slug: 'servicios', name: 'Servicios', blurb: 'Banco y agencia de viajes.', cover: 'DffWbgfDOoL:0' },
  { slug: 'gastronomia', name: 'Gastronomía', blurb: 'Restaurantes, cafés y heladería.', cover: 'DfxDQZpm-6v:0', href: '/gastronomia' },
]

// Stores: every entry appears in an official @patiodesignlifestylecenter post tagging the brand "en Patio".
export const stores = [
  { slug: 'pretty', name: 'Pretty', cat: 'moda', ig: 'prettybolivia', posts: ['Df90yValtvq'], cover: 'Df90yValtvq:0',
    about: 'Tienda multimarca de moda femenina.', lines: ['Cris Barros', 'Mixed', 'Animale', 'Pretty Ballerinas'] }, // lines: [IG-BIO:prettybolivia]
  { slug: 'purificacion-garcia', name: 'Purificación García', cat: 'moda', ig: 'fanspgbolivia', posts: ['DfI0el8FMDM', 'DfHs-CWFQYX'], cover: 'DfI0el8FMDM:0',
    about: 'Firma española de moda y accesorios.', lines: ['Moda mujer', 'Carteras', 'Accesorios'] }, // [IG:DfI0el8FMDM] [IG:DfHs-CWFQYX]
  { slug: 'plaza-moda', name: 'Plaza Moda', cat: 'moda', ig: 'plazamoda.bo', posts: ['DfKsneKivQ9'], cover: 'DfKsneKivQ9:0',
    about: 'Moda femenina.', lines: ['Vestidos de lino'] }, // [IG:DfKsneKivQ9]
  { slug: 'samsara', name: 'Samsara', cat: 'moda', ig: 'samsarabo', posts: ['DgAgI_Okocr', 'DfHzNjllPtE'], cover: 'DfHzNjllPtE:0',
    about: 'Moda femenina.', lines: ['Colección primavera', 'Ideas para regalar'] },
  { slug: 'emporio-spitz', name: 'Emporio Spitz', cat: 'moda', ig: 'emporiospitz', posts: ['DfzkcsHG4fS', 'De94EyXDK-0'], cover: 'De94EyXDK-0:0',
    about: 'Moda femenina.', lines: ['Rojo para diciembre', 'Lunares'] },
  { slug: 'indigo', name: 'Indigo', cat: 'moda', ig: 'indigorethinkfashion', posts: ['Dfs039lmXjZ'], cover: 'Dfs039lmXjZ:0',
    about: 'Moda femenina.', lines: ['Vestidos de fiesta'] },
  { slug: 'vickys-casual', name: "Vicky's Casual", cat: 'moda', ig: 'vickyscasual', posts: ['DgDFASIgctn'], cover: 'DgDFASIgctn:0',
    about: 'Moda para fiestas, eventos y cenas.', lines: ['Outfits de fiesta'] },
  { slug: 'levis', name: "Levi's", cat: 'moda', ig: 'levis', posts: ['DfuYlWFhw-1'], cover: 'DfuYlWFhw-1:0',
    about: 'Marca estadounidense de jeans fundada en 1853.', lines: ['Jeans', 'Básicas'] },
  { slug: 'dockers', name: 'Dockers', cat: 'moda', ig: 'dockersbo', posts: ['DgKsdJwDUD1'], cover: 'DgKsdJwDUD1:0',
    about: 'Moda masculina casual.', lines: ['Camisas', 'Fin de año'] },
  { slug: 'impulse', name: 'Impulse', cat: 'moda', ig: 'impulse_oficial', posts: ['De_6jjJjaJN'], cover: 'De_6jjJjaJN:0',
    about: 'Moda denim.', lines: ['Jeans', 'Denim total'] },
  { slug: 'casa-elena', name: 'Casa Elena', cat: 'calzado-accesorios', ig: 'casaelenaoficial', posts: ['DfVDO0_ioaG', 'DfHs-CWFQYX'], cover: 'DfVDO0_ioaG:0',
    about: 'Calzado femenino.', lines: ['Charol', 'Tacos cómodos'] },
  { slug: 'vis-curtiembre', name: 'Vis Curtiembre', cat: 'calzado-accesorios', ig: 'vis_curtiembre', posts: ['DgI-pvqE1wM', 'DfM5ZFuDGdH'], cover: 'DfM5ZFuDGdH:0',
    about: 'Carteras y artículos de cuero.', lines: ['Carteras', 'Cuero'] },
  { slug: 'cosmet', name: 'Cosmet', cat: 'belleza', ig: 'cosmet_oficial', posts: ['DfCYeY3jA4Z', 'De9cuUUDXnE'], cover: 'De9cuUUDXnE:0',
    about: 'Maquillaje y fragancias.', lines: ['MAC', 'Fix+ Stay Over', 'Perfumes'] }, // [IG:DfCYeY3jA4Z]
  { slug: 'perfumeria-first', name: 'Perfumería First', cat: 'belleza', ig: 'perfumeriafirstbolivia', posts: ['DfpE9lbjmk-'], cover: 'DfpE9lbjmk-:0',
    about: 'Perfumería.', lines: ['Perfumes para regalar'] },
  { slug: 'livi-luxe', name: 'Livi Luxe', cat: 'joyeria-optica', ig: 'liviluxejewels', posts: ['Df5i332lgJb', 'DfAelCwgSt4', 'DfHs-CWFQYX'], cover: 'DfAelCwgSt4:0',
    about: 'Joyería.', lines: ['Anillos', 'Cadenas'] },
  { slug: 'opticas-pauker', name: 'Ópticas Pauker', cat: 'joyeria-optica', ig: 'opticaspaukerbolivia', posts: ['DfGIyh3D8V9', 'DfHs-CWFQYX'], cover: 'DfGIyh3D8V9:0',
    about: 'Óptica: lentes de sol y recetados.', lines: ['Lentes de sol'] },
  { slug: 'adidas', name: 'adidas', cat: 'deportes', ig: 'adidas', posts: ['DgGgpxCAODU'], cover: 'DgGgpxCAODU:0',
    about: 'Marca alemana de ropa y calzado deportivo.', lines: ['Zapatillas'] },
  { slug: 'casa-moda', name: 'Casa Moda', cat: 'hogar-regalos', ig: 'casamodabolivia', posts: ['DfkgAaukyuy'], cover: 'DfkgAaukyuy:0',
    about: 'Decoración para el hogar.', lines: ['Adornos navideños', 'Detalles para la casa'] },
  { slug: 'mariposa', name: 'Mariposa Gift Shop', cat: 'hogar-regalos', ig: 'mariposagiftshop.scz', posts: ['DfCtFXgjKdc'], cover: 'DfCtFXgjKdc:0',
    about: 'Tienda de regalos.', lines: ['Para regalar o regalarte'] },
  { slug: 'bnb', name: 'BNB', cat: 'servicios', ig: 'banconacionaldeboliviasa', posts: ['DffWbgfDOoL'], cover: 'DffWbgfDOoL:0',
    about: 'Banco Nacional de Bolivia: cajero y agencia en Patio.', lines: ['Cajero automático', 'QR y tarjetas'] },
  { slug: 'estropical', name: 'Estropical', cat: 'servicios', ig: 'estropicalcom', posts: ['De7WtLkDw6M'], cover: 'De7WtLkDw6M:0',
    about: 'Agencia de viajes.', lines: ['Pasajes'] },
]

// Restaurants / cafés: each tagged "en Patio" by the mall [IG:*]; reservation numbers only where officially published.
export const restaurants = [
  { slug: 'kao-by-sacha', name: "KAO by Sach'a", cuisine: 'Japonesa · Sushi', ig: 'kaobysacha', posts: ['Df2T50Lm9Xf'], cover: 'Df2T50Lm9Xf:0',
    phone: '+591 62116555', wa: '59162116555', // "Delivery y reservas al: 62116555" [FB-KAO]
    about: 'Cocina japonesa: sushi, tragos y postres.', menu: ['Sushi', 'Tragos de autor', 'Postre sorpresa'] }, // [IG:Df2T50Lm9Xf]
  { slug: 'sacha-huaska', name: "Sach'a Huaska", cuisine: 'Peruana', ig: 'sacha_huaska', posts: ['DfPeL-llDqC'], cover: 'DfPeL-llDqC:0',
    about: 'Cocina peruana. La recomendación del mall: guardar espacio para el postre.', menu: ['Postres'] }, // [IG:DfPeL-llDqC] [TA]
  { slug: 'jarana', name: 'Jarana by Inés España', cuisine: 'Restaurante & bar', ig: 'jaranabyinesespana', posts: ['DfxDQZpm-6v'], cover: 'DfxDQZpm-6v:0',
    phone: '+591 69231010', wa: '59169231010', // "Reservas: +59169231010" [IG-BIO:jaranabyinesespana]
    about: '"Animada, bulliciosa, con excesos. Una fiesta de sabor en Patio Design."', menu: ['Tragos'] },
  { slug: 'factory', name: 'Factory', cuisine: 'Restaurante', ig: 'factorybolivia', posts: ['Dfmwid0m9EA'], cover: 'Dfmwid0m9EA:0',
    about: 'Restaurante en Patio Design.', menu: ['Pastas'] },
  { slug: 'bistecca', name: 'Bistecca', cuisine: 'Sándwiches & papas', ig: 'bistecca_santacruz', posts: ['DfiWqZtjYfO'], cover: 'DfiWqZtjYfO:0',
    about: 'Lo que viene entre panes, y unas papas espectaculares.', menu: ['Sándwiches', 'Papas'] },
  { slug: 'lola-burgers', name: 'Lola Burgers', cuisine: 'Hamburguesas', ig: 'lola.bolivia', posts: ['DfcdDv4GpZV'], cover: 'DfcdDv4GpZV:0',
    about: 'Hamburguesas.', menu: ['Hamburguesas', 'Papas'] },
  { slug: 'big-baby', name: 'Big Baby', cuisine: 'Hamburguesas', ig: 'bigbaby.bo', posts: ['DgIjKT1CsRJ'], cover: null,
    about: 'Hamburguesas para comer con las dos manos.', menu: ['Hamburguesas'] },
  { slug: 'pan-pino', name: 'Pan Pino Café', cuisine: 'Café & pastelería', ig: 'panpino.cafe', posts: ['Df7SeGpAJwz', 'DfKG4zaiXvz'], cover: 'DfKG4zaiXvz:0',
    about: 'Café para el próximo junte: café, postres y platos.', menu: ['Café latte', 'Postres'] },
  { slug: 'alto-tostado', name: 'Alto Tostado', cuisine: 'Café & brunch', ig: 'altotostado', posts: ['DfSecMOlUXt'], cover: 'DfSecMOlUXt:0',
    about: 'Mimosas, brunch y charlas que se alargan.', menu: ['Mimosas', 'Brunch'] },
  { slug: 'rokani', name: 'Rokani', cuisine: 'Restaurante & café', ig: 'rokani_santacruz', posts: ['DfFR3VAgdcD'], cover: 'DfFR3VAgdcD:0',
    about: 'La respuesta a "¿dónde comemos?" en Patio.', menu: ['Café'] },
  { slug: 'manjar-de-oro', name: 'Manjar de Oro', cuisine: 'Heladería', ig: 'manjardeoro', posts: ['DfTY_veDvXL'], cover: 'DfTY_veDvXL:0',
    about: 'Helados artesanales.', menu: ['Chocolate y pistacho con crocante', 'Menta con chispas de chocolate'] }, // [IG:DfTY_veDvXL]
]

export const events = [
  { title: 'El Cherry de la Navidad', when: '10 nov 2026 – 10 ene 2027', post: 'Df5qtbBBMFd',
    text: 'Por cada Bs. 500 en compras pedí tu cupón y participá del sorteo de Bs. 150.000 en shopping. Sorteo el 10 de enero de 2027, 20:00, en la plaza central. El ganador debe estar presente.',
    link: 'https://bit.ly/Elcherrydelanavidad', linkLabel: 'Términos y condiciones' },
  { title: 'Black Week', when: '25 – 29 nov 2026', post: 'DgJg6-UGWII',
    text: 'Tus tiendas favoritas con hasta 70% de descuento y cupones dobles: 2 cupones por cada Bs. 500 en compras.' }, // [IG:DgKetwPjTvb]
  { title: 'Sábado acústico con David Dionich', when: 'Sábado · en vivo', post: 'DgI2ND_mO2-',
    text: 'Música en vivo en tu Patio favorito. Hacé tu reserva en tu restaurante favorito.' },
  { title: 'Viernes de Tardeo', when: 'Viernes de noviembre · desde 18:00', post: 'DfYY_Aalmnv',
    text: 'Todos los viernes de noviembre con DJ Vertygo.' },
  { title: 'Comenzó la Navidad en Patio', when: 'Noviembre 2026', post: 'DgFzkvGGIoq',
    text: 'Show navideño, actividades para niños y concierto navideño en vivo.' },
  { title: 'First Call 2027', when: 'Año Nuevo', post: 'DgGnhffColh',
    text: 'Recibí el Año Nuevo en Patio: hacé tu reserva en tu restaurante favorito.' },
]

export const experiences = [
  { title: 'Un jardín para quedarse', kicker: 'Plantas & agua', text: 'Plantas y fuentes de agua se funden con la moda y la gastronomía: un verdadero lugar de estar.', img: 'DfKsneKivQ9:0' },
  { title: 'Sobremesas largas', kicker: 'Gastronomía', text: 'Café por la mañana, brunch con amigas, sushi por la noche.', img: 'DfSecMOlUXt:0' },
  { title: 'Música en vivo', kicker: 'Fines de semana', text: 'Tardeos con DJ los viernes y sábados acústicos en la plaza.', img: 'DgI2ND_mO2-:0' },
  { title: 'Navidad en Patio', kicker: 'Temporada', text: 'El árbol encendido, shows para los más chicos y el sorteo de Bs. 150.000.', img: 'Df8F9Y2GR6B:0' },
]

// Hero carousel — hand-picked from official posts (portrait photos cropped center).
export const heroSlides = [
  { img: 'Df8F9Y2GR6B:0', caption: 'La plaza central en Navidad' },
  { img: 'DfKsneKivQ9:0', caption: 'Entre plantas y fuentes' },
  { img: 'DfI0el8FMDM:0', caption: 'Moda en cada nivel' },
  { img: 'DfSecMOlUXt:0', caption: 'Sobremesas al aire libre' },
  { img: 'DfFR3VAgdcD:0', caption: 'Café en la terraza' },
  { img: 'DgH5658iEgi:0', caption: 'Patio ya brilla' },
]

// Instagram reels (self-hosted 20 s cut; full video = link out).
export const reels = ['DftHX3Ju9wn', 'Df5qtbBBMFd', 'DgK2LJThEsL', 'DgKneKihOlI', 'DgGbDiHOi8Z', 'Df93qfeuBVy', 'Df3RUEIuyRd', 'DfR-2SCh8iw', 'DfF96i_Dia6', 'DfDbPVShDUP', 'Dfj8cTlB55n']

export const faqs = [
  { q: '¿Cuál es el horario de Patio Design?', a: 'El horario general publicado es de lunes a sábado de 07:00 a 22:00 y domingo de 08:00 a 21:00. Cada tienda o restaurante puede tener su propio horario.' },
  { q: '¿Dónde queda?', a: 'Av. Busch esquina Tercer Anillo Interno, Santa Cruz de la Sierra, Bolivia.' },
  { q: '¿Cómo reservo en un restaurante?', a: 'Entrá a la página del restaurante en /gastronomia. Si publicó un número de reservas, vas a ver el botón "Reservar por WhatsApp". Si no, escribiles por Instagram.' },
  { q: '¿Cómo contacto a una tienda?', a: 'Cada tienda tiene su página con su cuenta oficial de Instagram. Para consultas generales llamá al ' + '+591 3 3364141.' },
  { q: '¿Quién es Hoja?', a: 'Hoja es la recepcionista virtual del sitio: una inteligencia artificial que responde con la información publicada en esta web. Puede equivocarse; ante dudas, confirmá con la tienda.' },
  { q: '¿Qué eventos hay?', a: 'Los eventos se anuncian en @patiodesignlifestylecenter. En esta web encontrás los más recientes en la sección Agenda de la página de inicio.' },
  { q: 'Perdí algo, ¿qué hago?', a: 'Comunicate con la administración al +591 3 3364141. Esta web no gestiona objetos perdidos.' },
]

export const BOT = { name: 'Hoja', avatar: '/media/logos/hoja.png' }
