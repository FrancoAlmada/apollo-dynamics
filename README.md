# Apollo Dynamics — la web

Sitio de **Apollo Dynamics**, agencia de IA y automatización para PyMEs, emprendedores y agencias
de Argentina y LatAm. Tres páginas: **Inicio** (`/`), **Servicios** (`/servicios/`) y **Casos**
(`/casos/`).

HTML y CSS estáticos, con unas pocas líneas de JavaScript para el formulario. Sin frameworks, sin
build y sin terceros: las fuentes, las imágenes y todo lo demás se sirven desde el mismo sitio.

## Qué hay acá

| Carpeta | Qué es |
|---|---|
| `sitio/` | **Lo que se publica.** Es lo único que sirve el servidor |
| `sitio/css/sitio.css` | Todos los estilos. Los tokens de color y tipografía están arriba de todo |
| `sitio/js/sitio.js` | El formulario de contacto: arma el mensaje y abre WhatsApp. No guarda nada |
| `sitio/img/` | Imágenes en WebP, generadas. **No se editan a mano** (ver abajo) |
| `sitio/fuentes/` | DM Serif Display y Archivo (licencia OFL), auto-alojadas |
| `diseno/` | El diseño final aprobado (`*.dc.html` + `LEEME-handoff.md`). Es la referencia de textos y estilos; no se publica |
| `capturas/` | Capturas fuente de los casos que no vienen del diseño (Sáenz, carta de La Sfoglia) |
| `scripts/` | Capturas, optimización de imágenes, revisión del sitio, imagen para compartir y publicación |

## Verlo en la compu

```powershell
cd sitio
python -m http.server 8080
```

Abrir `http://localhost:8080`. Tiene que servirse desde `sitio/` (los links son absolutos: `/casos/`).

## Cambiar algo

- **Un texto:** directo en el `index.html` de la página.
- **Un estilo:** `sitio/css/sitio.css`. Lo que cambió respecto del diseño original está marcado con
  `Ajuste:`. El bloque `@media (max-width: 760px)` es el celular.
- **Una captura de un caso:** la fuente va en `diseno/assets/casos/` o en `capturas/`, y después:
  ```powershell
  python scripts/capturar_casos.py      # rehace las de Sáenz y la carta de La Sfoglia
  python scripts/optimizar_imagenes.py  # pasa todo a WebP en sitio/img/ e imprime las medidas
  ```
  Las medidas que imprime van en los `width`/`height` del `<img>` (así la página no salta al cargar).
- **La imagen para compartir el link** (`sitio/og.jpg`): `python scripts/hacer_og.py`.

## Antes de publicar

```powershell
python scripts/revisar_sitio.py
```

Recorre las tres páginas a 360, 390, 768, 1024 y 1440 de ancho y frena si hay scroll horizontal,
errores, imágenes que no cargan, links o anclas rotas, o algo pedido a otro dominio. Deja capturas
en `.capturas/` para mirarlas.

## Publicar

El sitio vive en el VPS (`apollodynamics.tech`): el servidor tiene un clon de este repo y Caddy sirve
`sitio/`. Publicar un cambio es:

```powershell
git add . ; git commit -m "..." ; git push
.\scripts\publicar.ps1
```

`publicar.ps1` revisa que todo esté commiteado y subido, y hace `git pull` en el VPS. No hay que
reiniciar nada: Caddy sirve lo nuevo al instante. La infraestructura está en el repo `SERVIDOR`.

## Los casos

Los cuatro casos son proyectos propios con marcas y datos ficticios, y la web lo dice. Cada uno vive
en su repo:

| Caso | Repo |
|---|---|
| Sanatorio del Plata | `AUTOMATIZACIONES/casos/sanatorio_multiagente` |
| Pastas La Sfoglia | `AUTOMATIZACIONES/casos/restaurante_pastas` |
| Distribuidora Sáenz | `AUTOMATIZACIONES/casos/distribuidora_cobranzas` |
| Toba Cars | `PROYECTOS/Toba Cars (v2)` |
