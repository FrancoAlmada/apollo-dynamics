# Apollo Dynamics — sitio web

Sitio de la agencia, reescrito desde cero en HTML, CSS y JavaScript puro.
Reemplaza la versión que estaba en Webflow. Sin build, sin dependencias, sin frameworks.

## Correrlo localmente

No necesita instalación. Podés abrir `index.html` directamente en el navegador,
aunque conviene levantar un servidor local para que todo se comporte igual que en producción:

```bash
python -m http.server 8899
```

Y abrir http://127.0.0.1:8899

## Estructura

```
index.html              Toda la página (one-page con anclas)
css/styles.css          Estilos, organizados en 15 secciones numeradas
js/main.js              Nav móvil, reveal en scroll, parallax, formulario
assets/brand/           Logos y favicon
assets/hero/            Fotos del mosaico
assets/servicios/       Ilustraciones de las tarjetas
```

## Datos de contacto configurados

| Qué | Valor | Dónde |
|---|---|---|
| WhatsApp | `5492996353269` | `index.html`, botón del form y botón flotante |
| Email | `francoivanalmada@gmail.com` | `index.html` footer, y endpoint del form en `js/main.js` |

El número va en formato internacional sin `+` ni espacios: `54` + `9` + área sin el 0 +
número sin el 15. Para Neuquén (299): `549` + `299` + `6353269`.
**El `9` es obligatorio** para celulares argentinos — sin él, WhatsApp no encuentra el contacto.

## Pendiente antes de publicar

Solo queda uno: la **URL real del sitio**, en `index.html` — el `<link rel="canonical">`
y las metas `og:image` / `twitter:image`. Recién importa cuando haya dominio propio;
mientras tanto el sitio funciona igual.

## Activar el formulario

Usa [FormSubmit](https://formsubmit.co): gratis, sin registro y sin tarjeta.
Ya está configurado en `js/main.js` (constante `ENDPOINT`).

**Un solo paso, y hay que hacerlo con el sitio ya publicado:**

1. Entrá al sitio online y mandá una consulta de prueba desde el formulario.
2. Te llega un mail de FormSubmit pidiendo confirmar la casilla. Aceptalo.
3. Desde ahí en adelante, todas las consultas te llegan por mail.

Hasta que confirmes, los envíos no se reenvían. Probarlo desde `localhost` no sirve:
FormSubmit valida el dominio de origen, así que la prueba tiene que ser sobre el sitio publicado.

### Si querés ocultar el email del código

FormSubmit te da un alias aleatorio (tipo `a1b2c3d4...`) en su panel, después del primer envío.
Reemplazando el email por ese alias en `ENDPOINT`, tu casilla deja de estar visible en el
código fuente de la página.

### Alternativa si deployás en Netlify

Netlify tiene formularios propios, gratis hasta 100 envíos por mes y sin servicios de terceros.
Se activa agregando `netlify` y `name="contacto"` al `<form>` y sacando el `fetch` del JS.
Decidilo según dónde termines hosteando.

## Deploy

Cualquier hosting estático sirve. Las dos opciones más simples:

- **Netlify** — arrastrás la carpeta a [app.netlify.com/drop](https://app.netlify.com/drop) y ya está online.
- **GitHub Pages** — subís el repo, y en Settings → Pages elegís la rama `main`.

## Decisiones de diseño

- **Paleta y tipografías** heredadas del sitio original (verde `#3fbe94`, fondo `#0e0f0e`,
  DM Serif Display + Inter) para no perder la identidad de marca.
- **Tarjetas de servicio alternadas** izquierda/derecha, en lugar de todas del mismo lado.
- **Mosaico con máscara degradada** al pie, en lugar del corte seco del original.
- **Contenido unificado en español** — el original mezclaba inglés y español.
- **Sin terceros**: se sacaron jQuery, Webflow.js, Meta Pixel, reCAPTCHA y Google Analytics.
  El antispam del formulario es un honeypot (`_honey`), no un captcha.
- **Imágenes optimizadas**: las ilustraciones pasaron de hasta 5157px a 1200px (~100 KB cada una).

## Accesibilidad

- Navegación por teclado completa, con foco visible y skip-link.
- El menú móvil cierra con `Escape` y bloquea el scroll de fondo.
- Errores de formulario anunciados por `aria-live`.
- Respeta `prefers-reduced-motion`: sin animaciones ni parallax si el sistema lo pide.

## Referencia

Los archivos del Webflow original quedaron en la carpeta de arriba
(`Apollo Dynamics Agency.html` y `Apollo Dynamics Agency_files/`) por si hace falta consultarlos.
No los usa este proyecto.
