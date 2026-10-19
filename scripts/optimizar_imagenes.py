# -*- coding: utf-8 -*-
"""Pasa las imágenes fuente a WebP livianas para el sitio (sitio/img/).

Fuentes:
  diseno/assets/   las del diseño original (marca, fondos espaciales, capturas de casos)
  capturas/        las que saca scripts/capturar_casos.py (Sáenz, carta de La Sfoglia)

Cada captura sale en dos anchos (800 y 1600, nunca más que el original) para el srcset:
el celular baja la chica y una pantalla grande o retina, la grande. Al final imprime las
medidas reales, que son las que van en los width/height del HTML (así no salta el layout).

Uso:  python scripts/optimizar_imagenes.py
"""
import os
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(AQUI)
DISENO = os.path.join(REPO, 'diseno', 'assets')
CAPTURAS = os.path.join(REPO, 'capturas')
SALIDA = os.path.join(REPO, 'sitio', 'img')

# nombre de salida: (fuente, anchos)
CASOS = {
    'sanatorio-metricas': (os.path.join(DISENO, 'casos', 'sanatorio-metricas-v2.png'), (800, 1600)),
    'sanatorio-agenda': (os.path.join(DISENO, 'casos', 'sanatorio-agenda-v2.png'), (800, 1600)),
    'sanatorio-conversacion': (os.path.join(DISENO, 'casos', 'sanatorio-conversacion-v2.png'), (800, 1600)),
    'sfoglia-panel': (os.path.join(DISENO, 'casos', 'sfoglia-panel.png'), (800, 1600)),
    'sfoglia-carta': (os.path.join(CAPTURAS, 'sfoglia-carta.png'), (800, 1600)),
    'toba-portada': (os.path.join(DISENO, 'casos', 'toba-hero.png'), (800, 1600)),
    'toba-catalogo': (os.path.join(DISENO, 'casos', 'toba-catalogo.png'), (800, 1600)),
    'saenz-conciliacion': (os.path.join(CAPTURAS, 'saenz-conciliacion.png'), (800, 1600)),
    'saenz-saldos': (os.path.join(CAPTURAS, 'saenz-saldos.png'), (800, 1600)),
    'saenz-mora': (os.path.join(CAPTURAS, 'saenz-mora.png'), (800, 1600)),
    'fondo-aurora': (os.path.join(DISENO, 'space', 'aurora-verde.jpg'), (800, 1280)),
    'fondo-via-lactea': (os.path.join(DISENO, 'space', 'via-lactea.jpg'), (800, 1280)),
    'fondo-luna': (os.path.join(DISENO, 'space', 'luna.jpg'), (800, 1280)),
}
# Marca: un solo tamaño, a 3x de lo que se muestra (se ve nítida en cualquier pantalla)
MARCA = {
    'isotipo': (os.path.join(DISENO, 'brand', 'mark.png'), {'alto': 128}),
    'logotipo': (os.path.join(DISENO, 'brand', 'wordmark.png'), {'alto': 96}),
}


def guardar(im, ruta, calidad=82):
    im.save(ruta, 'WEBP', quality=calidad, method=6)
    return os.path.getsize(ruta) // 1024


def main():
    os.makedirs(SALIDA, exist_ok=True)
    print(f'{"archivo":34} {"medidas":>11}  peso')
    for nombre, (fuente, anchos) in CASOS.items():
        im = Image.open(fuente)
        im = im.convert('RGB')
        for ancho in anchos:
            ancho = min(ancho, im.width)
            alto = round(im.height * ancho / im.width)
            ruta = os.path.join(SALIDA, f'{nombre}-{ancho}.webp')
            # Los fondos van atenuados (opacidad .3 a .78): aguantan bastante menos calidad
            kb = guardar(im.resize((ancho, alto), Image.LANCZOS), ruta, 66 if nombre.startswith('fondo-') else 82)
            print(f'{os.path.basename(ruta):34} {ancho:>5}x{alto:<5}  {kb} KB')
    for nombre, (fuente, cfg) in MARCA.items():
        im = Image.open(fuente).convert('RGBA')
        alto = cfg['alto']
        ancho = round(im.width * alto / im.height)
        ruta = os.path.join(SALIDA, f'{nombre}.webp')
        kb = guardar(im.resize((ancho, alto), Image.LANCZOS), ruta, calidad=90)
        print(f'{os.path.basename(ruta):34} {ancho:>5}x{alto:<5}  {kb} KB')
    # Íconos: favicon y el de pantalla de inicio del celular, en PNG (los piden así)
    mark = Image.open(MARCA['isotipo'][0]).convert('RGBA')
    for lado, nombre in ((32, 'favicon-32.png'), (180, 'apple-touch-icon.png')):
        mark.resize((lado, lado), Image.LANCZOS).save(os.path.join(REPO, 'sitio', nombre))
    print('favicon-32.png, apple-touch-icon.png')


if __name__ == '__main__':
    main()
