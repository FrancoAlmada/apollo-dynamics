# apollo-dynamics — la web de la agencia

Se hereda `TRABAJO/CLAUDE.md`. Mapa del repo, cómo cambiar algo y cómo publicar: `README.md`.

## Reglas

- **Se publica solo `sitio/`.** `diseno/` es la referencia aprobada (textos y estilos): no se
  edita y no se sirve.
- **Sin terceros:** nada de CDNs, Google Fonts ni scripts externos. El servidor manda una CSP que
  solo deja cargar cosas del propio sitio; un recurso externo se rompe en producción aunque ande
  en la compu.
- **Sin estilos en línea** (`style="..."`): la misma CSP los bloquea. Todo va en `sitio/css/sitio.css`.
- **Imágenes:** nunca a mano en `sitio/img/`. Fuente en `diseno/assets/` o `capturas/` y
  `python scripts/optimizar_imagenes.py`.
- **Cifras:** ningún número de negocio inventado. Las métricas que se muestran salen de los
  paneles de los casos (por ejemplo, los 9 s de mediana del Sanatorio).
- **Antes de dar algo por terminado:** `python scripts/revisar_sitio.py` en verde, y mirar las
  capturas de `.capturas/` (sobre todo 390 de ancho).
- Nada de `HANGAR/`: el sitio es autónomo.
