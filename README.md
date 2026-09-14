# Apollo Dynamics — la web

Sitio de **Apollo Dynamics**, agencia boutique de IA y automatización para PyMEs de Argentina y
LatAm. Una sola página: hero con números, diferenciales, servicios, método, casos, "por dentro"
(una conversación real con su traza) y contacto por WhatsApp.

HTML, CSS y JavaScript puro. Sin frameworks, sin build step, sin dependencias en tiempo de
ejecución. Las fuentes están autoalojadas.

## De dónde sale la identidad

Este sitio **consume Órbita**, el sistema de diseño de la agencia, que vive en el repo `HANGAR`:

```
css/orbita/          ← COPIAS generadas por HANGAR/scripts/generar.py. NO se editan acá.
  tokens.css           variables (colores, tipografía, espaciado) generadas desde marca.json
  base.css             reset, tipografía en tres roles, foco, regla graduada
  orbita.css           componentes: botón, campo, métrica, badge, chat, traza, estados…
  orbita.js            navegación móvil, tabs, modales, toasts
  fuentes.css + fuentes/   Familjen Grotesk, Instrument Sans, JetBrains Mono (woff2, subset latino)
assets/marca/        ← COPIAS: isotipo, logotipo, favicon (SVG) y la imagen OG (PNG)
css/sitio.css        ← lo propio de esta web (layout de cada sección). Sin colores a mano.
js/sitio.js          ← el formulario de contacto (fetch a FormSubmit, tres estados)
index.html
vercel.json          ← cabeceras de seguridad y caché para Vercel
docs/capturas/       ← lo que Prevuelo generó la última vez: capturas por ancho, informe, prevuelo.json
```

**Cambiar un color de la marca es editar `HANGAR/marca.json` y correr el generador**: las copias
de `css/orbita/` y `assets/marca/` se reescriben solas. Editarlas acá es perder el cambio en la
próxima regeneración.

## Verificación

Antes de publicar, la página pasa **Prevuelo** (`HANGAR/prevuelo/prevuelo.mjs`): capturas a 360,
390, 768 y 1440 px, cero scroll horizontal, contraste AA de todo texto contra su fondo computado,
foco visible recorriendo con Tab, fuentes cargadas de verdad, ningún color fuera de los tokens, y
Lighthouse en mobile y desktop.

Última corrida (2026-09-14): sin hallazgos. Lighthouse mobile 99 / 100 / 100 / 100, desktop
100 / 100 / 100 / 100 (rendimiento, accesibilidad, buenas prácticas, SEO). El detalle está en
`docs/capturas/informe.html`.

```powershell
# desde HANGAR
node prevuelo/prevuelo.mjs ../PROYECTOS/apollo-dynamics/index.html --capturas ../PROYECTOS/apollo-dynamics/docs/capturas --fuentes "Familjen Grotesk,Instrument Sans,JetBrains Mono"
```

## Correrlo localmente

```bash
python -m http.server 8899
```

Abrir http://127.0.0.1:8899. El formulario **no envía desde local**: FormSubmit solo acepta el
dominio publicado. La página lo detecta y lo dice en pantalla.

## Deploy

Pensado para **Vercel**: importar el repo, raíz del proyecto = raíz del repo, sin build command.
`vercel.json` ya trae `cleanUrls`, cabeceras de seguridad (CSP incluida) y caché larga para las
fuentes. Cada `git push` a `main` republica.

Pendiente, y depende de Franco:

- [ ] Importar el repo en Vercel y apuntar el dominio (`<link rel="canonical">` y las metas `og:`
      ya dicen `apollodynamics.com`; si el dominio final es otro, cambiar esas cuatro líneas).
- [ ] Confirmar la casilla en FormSubmit con el primer envío desde el dominio publicado.

## Honestidad sobre los casos

Los casos de la web fueron construidos por la agencia como demostración de capacidad, con
negocios y datos ficticios. La página lo dice arriba de la sección, a propósito. Los números que
se muestran (pruebas en verde, horas atendidas, comparaciones del motor) salen de las corridas
reales de `verificar.ps1` de cada caso.

## Licencia

Código bajo [MIT](LICENSE). Los activos de marca (`assets/marca/`) están excluidos.
