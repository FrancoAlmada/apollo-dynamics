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

## Pendientes antes de publicar

Están marcados con `TODO` en el código. Son cuatro:

| Qué | Dónde |
|---|---|
| Access key de Web3Forms | `index.html`, campo `access_key` |
| Número de WhatsApp (3 lugares) | `index.html`, buscar `5490000000000` |
| Email de contacto | `index.html`, footer |
| URL real del sitio | `index.html`, `<link rel="canonical">` y metas `og:` |

### Conectar el formulario

1. Entrá a [web3forms.com](https://web3forms.com) y poné tu email — te mandan una access key gratis.
2. Pegala en el campo `access_key` del formulario en `index.html`.
3. Listo. No hace falta backend: los mensajes te llegan por mail.

Mientras la key no esté puesta, el formulario avisa al visitante que use WhatsApp
en vez de fallar en silencio.

### Número de WhatsApp

Formato internacional sin `+` ni espacios. Para un celular argentino:
`549` + código de área sin el 0 + número sin el 15.
Ejemplo para Buenos Aires: `5491123456789`.

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
  El antispam del formulario es un honeypot.
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
