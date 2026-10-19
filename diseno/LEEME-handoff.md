# Apollo Dynamics — Web (handoff para Claude Code)

## Qué es
Sitio de Apollo Dynamics, agencia que construye paneles de gestión, agentes de WhatsApp con IA y automatizaciones para negocios. Tres páginas: **Home**, **Servicios**, **Casos**. Diseño final, alta fidelidad: colores, tipografía, espaciados, textos e imágenes están aprobados.

## Cómo abrir el diseño
Los archivos `diseno/*.dc.html` son la referencia de diseño. Se abren en el navegador **sirviendo la carpeta** (no con doble clic, porque cargan `support.js` y las imágenes con rutas relativas):

```
cd diseno
npx serve .        # o: python3 -m http.server
```

Abrir `http://localhost:3000/Apollo Dynamics.dc.html`.

Formato: cada `.dc.html` tiene el marcado entre `<x-dc>…</x-dc>` con **estilos inline** y holes `{{ }}` mínimos; `support.js` es el runtime que lo renderiza. No es código para producción: es la fuente exacta de estilos y contenido.

## Tarea sugerida para Claude Code
Recrear el sitio como sitio estático de producción (recomendado: **Astro** o HTML + CSS plano; alternativamente Next.js), pixel-perfect respecto a los `.dc.html`:
1. Extraer los estilos inline a CSS (variables para los tokens de abajo).
2. Una ruta por página: `/`, `/servicios`, `/casos`. Los links internos hoy apuntan a `Servicios.dc.html#id` / `Casos.dc.html#id` → convertir a `/servicios#id`, `/casos#id`.
3. Optimizar imágenes (WebP/AVIF, `srcset`, `loading="lazy"` salvo el hero).
4. Agregar meta tags, Open Graph y favicon (pendiente; usar `assets/brand/mark.png`).
5. Mantener todos los textos **verbatim**.

## Tokens de diseño
Colores base:
- Fondo: `#121312` · Superficie: `#171A18` · Superficie profunda: `#0B0C0B`
- Bordes: `#262A28`
- Acento menta: `#3FBE94`
- Texto principal: `#F7F1F1` · secundario: `#C0B9B9` · terciario: `#ADA6A6`

Tarjetas de servicios (Home) — degradado `linear-gradient(155deg, A 0%, B 100%)`, borde `1px solid rgba(255,255,255,.09)`, sombra `inset 0 1px 0 rgba(255,255,255,.14), 0 18px 40px -24px rgba(0,0,0,.6)`, texto `#F4FAF8`:
1. Consultoría y control de calidad (`#qa`): `#248C73` → `#1A6D5A`
2. Paneles y CRM (`#paneles`): `#27A383` → `#1B7D65`
3. Agentes de WhatsApp (`#agentes`): `#1C9BA6` → `#147682`
4. Automatización interna (`#n8n`): `#2486B6` → `#196790`
5. Calificación de clientes (`#leads`): `#2A69B2` → `#1D4F8B`
6. Sitios web (`#web`): `#3762A8` → `#274A85`

Este orden de servicios es el mismo en Home y en Servicios (chips y secciones; en Servicios las secciones alternan fondo `#171A18` / transparente).

Tipografía (Google Fonts):
- Títulos: **DM Serif Display** 400 (h2: `clamp(34px, 4.6vw, 56px)/1.02`, letter-spacing `-.022em`)
- Texto/UI: **Archivo** 400/500/600/700 (párrafos 15px/1.7)

Radios: tarjetas 10px. Ancho máximo de contenido: 1200px. Padding lateral: `clamp(20px, 5vw, 56px)`. Layouts responsivos con `grid` + `auto-fit/minmax`.

## Contenido y decisiones a respetar
- Hero: bajada "Sistemas que potencian tu negocio." y "Construimos paneles de gestión, agentes de WhatsApp con IA y automatizaciones para…".
- Dato destacado: **9 s** "de respuesta mediana sobre 1.742 respuestas, medido por el propio panel del sistema." (sale de `sanatorio-metricas-v2.png`; no inventar cifras).
- Método: título arriba y descripción abajo (una columna); fase 05 = "Puesta en marcha".
- Botones principales con ícono de WhatsApp en negro. Sin número de teléfono visible.
- Tarjetas de casos con altura igual; encuadres: agenda Sanatorio y panel Sfoglia con `object-position: center 10%`; Toba Cars usa `toba-hero.png` con `object-position: top`.
- Casos → La Sfoglia: carta a la izquierda, panel a la derecha.
- Sección "No es otro chatbot" quitada a propósito; está guardada en `diseno/ref/diferenciales-guardado.html` por si vuelve.

## Assets (`diseno/assets/`)
- `brand/`: logo, mark (isotipo), wordmark.
- `space/`: fotos espaciales usadas como fondos (aurora verde, vía láctea, luna).
- `casos/`: capturas reales de Sanatorio del Plata (agenda, conversaciones, métricas, resumen), Pastas La Sfoglia (panel, carta) y Toba Cars (portada, catálogo). `sanatorio-resumen.png` no está en uso.

## Pendientes
- Captura real de Voltra Nimbus (hoy es un esquema).
- Demo funcional de un asistente (ideal La Sfoglia).
- Metadatos, Open Graph y favicon.
- FAQ o modelo de cobro.
