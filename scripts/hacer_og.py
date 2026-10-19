# -*- coding: utf-8 -*-
"""Genera sitio/og.jpg (1200x630): la imagen que muestran WhatsApp, LinkedIn y compañía al
compartir el link. Se dibuja desde scripts/og.html con las mismas fuentes y colores del sitio.

Uso:  python scripts/hacer_og.py
"""
import functools, http.server, os, shutil, subprocess, tempfile, threading

AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(AQUI)


class Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def main():
    s = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Silencioso, directory=REPO))
    threading.Thread(target=s.serve_forever, daemon=True).start()
    salida = os.path.join(REPO, 'sitio', 'og.png').replace('\\', '/')
    codigo = f'''async pagina => {{
      const ctx = await pagina.context().browser().newContext({{ viewport: {{ width: 1200, height: 630 }} }});
      const page = await ctx.newPage();
      await page.goto('http://127.0.0.1:{s.server_port}/scripts/og.html', {{ waitUntil: 'networkidle' }});
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({{ path: '{salida}' }});
      await ctx.close();
      return 'ok';
    }}'''
    pw = shutil.which('playwright-cli') or 'playwright-cli'
    cwd = tempfile.gettempdir()
    try:
        subprocess.run([pw, '-s=apollo-og', 'open', 'about:blank'], capture_output=True, cwd=cwd, check=True)
        archivo = os.path.join(cwd, 'apollo-og.js')
        open(archivo, 'w', encoding='utf-8').write(codigo)  # en Windows, como argumento se rompe
        r = subprocess.run([pw, '-s=apollo-og', '--raw', 'run-code', f'--filename={archivo}'], capture_output=True, text=True, cwd=cwd)
        # JPEG y no PNG: la foto de fondo en PNG pesa casi 600 KB; en JPEG, unos 70
        from PIL import Image
        Image.open(salida).convert('RGB').save(salida[:-4] + '.jpg', 'JPEG', quality=86, optimize=True, progressive=True)
        os.remove(salida)
        print(r.stdout.strip() or r.stderr.strip(), '->', salida[:-4] + '.jpg')
    finally:
        subprocess.run([pw, '-s=apollo-og', 'close'], capture_output=True, cwd=cwd)
        s.shutdown()


if __name__ == '__main__':
    main()
