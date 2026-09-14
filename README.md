# Apollo Dynamics — la web

Sitio de **Apollo Dynamics**, agencia de IA y automatización para PyMEs, emprendedores y agencias
de Argentina y LatAm. Una sola página: hero, evidencia (la captura de un panel real), métricas,
servicios, diferenciales, método, casos y contacto por WhatsApp.

HTML, CSS y JavaScript puro. Sin frameworks, sin build step, sin dependencias en tiempo de
ejecución ni servicios de terceros. Las fuentes están autoalojadas.

## De dónde sale la identidad

La identidad es la que Franco definió para la marca (tema oscuro, verde Apollo, DM Serif Display
para titulares, Archivo para el texto, su logo con la A pincelada) y vive como configuración en
`HANGAR/marca.json`. Este sitio **consume Órbita**, el sistema de diseño de la agencia:

```
css/orbita/          ← COPIAS generadas por HANGAR/scripts/generar.py. NO se editan acá.
  tokens.css           variables (colores, tipografía, espaciado) generadas desde marca.json
  base.css             reset, tipografía en tres roles, foco, regla graduada
  orbita.css           componentes: botón, campo, métrica, badge, panel, estados…
  orbita.js            navegación móvil, tabs, modales, toasts
  fuentes.css + fuentes/   DM Serif Display, Archivo, JetBrains Mono (woff2, subset latino)
assets/marca/        ← COPIAS: isotipo, logotipo, favicon (SVG) y la imagen OG (PNG)
assets/img/          ← fotos de cielo de las tres secciones y capturas reales de los sistemas (WebP)
css/sitio.css        ← lo propio de esta web (layout de cada sección). Sin colores a mano.
js/sitio.js          ← el formulario: arma el mensaje y abre WhatsApp
index.html
vercel.json          ← cabeceras de seguridad y caché para Vercel
docs/capturas/       ← lo que Prevuelo generó la última vez: capturas por ancho, informe, prevuelo.json
```

**Cambiar un color o una fuente de la marca es editar `HANGAR/marca.json` y correr el generador**:
las copias de `css/orbita/` y `assets/marca/` se reescriben solas (y las fuentes que salieron de
la marca se borran). Editarlas acá es perder el cambio en la próxima regeneración.

## Verificación

Antes de publicar, la página pasa **Prevuelo** (`HANGAR/prevuelo/prevuelo.mjs`): capturas a 360,
390, 768 y 1440 px, cero scroll horizontal, contraste AA de todo texto contra su fondo computado,
foco visible recorriendo con Tab, fuentes cargadas de verdad, ningún color fuera de los tokens, y
Lighthouse en mobile y desktop. Es la etapa 2.3 de `HANGAR/scripts/verificar.ps1`.

```powershell
# desde HANGAR
node prevuelo/prevuelo.mjs ../PROYECTOS/apollo-dynamics/index.html --capturas ../PROYECTOS/apollo-dynamics/docs/capturas --anchos 360,390,768,1440 --fuentes "DM Serif Display,Archivo,JetBrains Mono"
```

El resultado de la última corrida está en `docs/capturas/informe.html` y `docs/capturas/prevuelo.json`.

## Correrlo localmente

```bash
python -m http.server 8899
```

Abrir http://127.0.0.1:8899. El formulario funciona igual que publicado: arma el mensaje con lo que
escribiste y abre WhatsApp. No hay backend ni servicio de formularios: **el sitio no guarda nada**.

## Deploy

Pensado para **Vercel**: importar el repo, raíz del proyecto = raíz del repo, sin build command.
`vercel.json` ya trae `cleanUrls`, cabeceras de seguridad (CSP sin terceros) y caché larga para las
fuentes. Cada `git push` a `main` republica.

Pendiente, y depende de Franco:

- [ ] Importar el repo en Vercel y apuntar el dominio (`<link rel="canonical">` y las metas `og:`
      ya dicen `apollodynamics.com`; si el dominio final es otro, cambiar esas líneas).
- [ ] Confirmar que el número de WhatsApp de `HANGAR/marca.json` (`identidad.whatsapp_e164`) es el
      que quiere recibir las consultas: es el que usan todos los botones y el formulario.

## Honestidad sobre los casos

Los casos de la web fueron construidos por la agencia como demostración de capacidad, con negocios
y datos ficticios. La página lo dice arriba de la sección, a propósito. Las capturas son de los
sistemas reales corriendo; los números de la sección de métricas salen de sus propios paneles.

## Fotos

Las tres fotos de cielo nocturno (`assets/img/hero-nebulosa.webp`, `metodo-via-lactea.webp`,
`contacto-luna.webp`) son las que Franco eligió para su versión del sitio, recomprimidas a WebP a
1280 px de ancho. Las capturas de los paneles son de los propios sistemas de la agencia.

## Licencia

Código bajo [MIT](LICENSE). Los activos de marca (`assets/marca/`) y las fotos están excluidos.
