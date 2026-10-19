# -*- coding: utf-8 -*-
"""Revisa el sitio antes de publicarlo. No toca nada: lo sirve en la compu y lo mira.

Para cada página (/, /servicios/, /casos/) y cada ancho (360, 390, 768, 1024, 1440):
  - que no haya scroll horizontal (el problema que tenía el diseño en el celular)
  - que no haya errores de JavaScript ni archivos que no cargan (404)
  - que no se pida nada a otro dominio (ni fuentes, ni scripts: todo es propio)
  - una captura de página entera en .capturas/ para mirarla a ojo
Y una vez: que cada link interno y cada ancla (#algo) exista de verdad.

Uso:  python scripts/revisar_sitio.py            (sale con error si algo falla)
"""
import functools, http.server, io, json, os, shutil, subprocess, sys, tempfile, threading

AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(AQUI)
SITIO = os.path.join(REPO, 'sitio')
SALIDA = os.path.join(REPO, '.capturas')
SESION = 'apollo-revision'

CODIGO = r'''async pagina => {
  const C = __CONFIG__;
  const ctx = await pagina.context().browser().newContext();
  const page = await ctx.newPage();
  const problemas = [];
  const externos = new Set();
  let actual = '';
  page.on('pageerror', (e) => problemas.push(`${actual}: error JS: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') problemas.push(`${actual}: consola: ${m.text()}`); });
  page.on('response', (r) => { if (r.status() >= 400) problemas.push(`${actual}: ${r.status()} ${r.url()}`); });
  page.on('request', (r) => { if (!r.url().startsWith(C.base) && !r.url().startsWith('data:')) externos.add(r.url()); });

  const filas = [];
  const links = new Set();
  for (const ruta of C.rutas) {
    for (const ancho of C.anchos) {
      actual = `${ruta} @${ancho}`;
      await page.setViewportSize({ width: ancho, height: 900 });
      await page.goto(C.base + ruta, { waitUntil: 'networkidle' });
      // Que carguen ya las imágenes diferidas (si no, la captura de página entera sale con huecos)
      await page.evaluate(async () => {
        const imgs = [...document.images];
        imgs.forEach((i) => { i.loading = 'eager'; });
        await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
      });
      await page.waitForTimeout(300);
      const m = await page.evaluate(() => ({
        desborde: document.documentElement.scrollWidth - innerWidth,
        cabecera: Math.round(document.querySelector('.cabecera').getBoundingClientRect().height),
        rotas: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')),
      }));
      if (m.desborde > 0) problemas.push(`${actual}: scroll horizontal de ${m.desborde}px`);
      if (m.rotas.length) problemas.push(`${actual}: imágenes que no cargan: ${m.rotas.join(', ')}`);
      filas.push(`${actual.padEnd(20)} cabecera ${m.cabecera}px`);
      const nombre = (ruta === '/' ? 'inicio' : ruta.replace(/\//g, '')) + '-' + ancho;
      await page.screenshot({ path: `${C.salida}/${nombre}.png`, fullPage: true });
      if (ancho === 1440) {
        (await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.href)))
          .forEach((h) => links.add(h));
      }
    }
  }

  // Links internos y anclas
  for (const h of links) {
    if (!h.startsWith(C.base)) continue;
    // (el entorno de run-code no tiene URL: se separa a mano)
    const [ruta, ancla] = h.split('#');
    const r = await page.goto(ruta, { waitUntil: 'domcontentloaded' });
    if (!r || r.status() >= 400) { problemas.push(`link roto: ${h}`); continue; }
    if (ancla && !(await page.evaluate((id) => !!document.getElementById(id), decodeURIComponent(ancla)))) {
      problemas.push(`ancla que no existe: ${h}`);
    }
  }
  await ctx.close();
  return JSON.stringify({ filas, problemas, externos: [...externos], links: links.size });
}'''


class Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def main():
    os.makedirs(SALIDA, exist_ok=True)
    servidor = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Silencioso, directory=SITIO))
    threading.Thread(target=servidor.serve_forever, daemon=True).start()
    config = {'base': f'http://127.0.0.1:{servidor.server_port}', 'rutas': ['/', '/servicios/', '/casos/'],
              'anchos': [360, 390, 768, 1024, 1440], 'salida': SALIDA.replace('\\', '/')}
    codigo = os.path.join(tempfile.gettempdir(), 'apollo-revisar.js')
    io.open(codigo, 'w', encoding='utf-8').write(CODIGO.replace('__CONFIG__', json.dumps(config)))
    pw = shutil.which('playwright-cli') or 'playwright-cli'
    cwd = tempfile.gettempdir()
    try:
        subprocess.run([pw, f'-s={SESION}', 'open', 'about:blank'], capture_output=True, cwd=cwd, check=True)
        r = subprocess.run([pw, f'-s={SESION}', '--raw', 'run-code', f'--filename={codigo}'],
                           capture_output=True, text=True, encoding='utf-8', cwd=cwd)
    finally:
        subprocess.run([pw, f'-s={SESION}', 'close'], capture_output=True, cwd=cwd)
        servidor.shutdown()
    try:
        res = json.loads(json.loads(r.stdout.strip()))
    except Exception:
        print(r.stdout, r.stderr)
        sys.exit(1)
    for f in res['filas']:
        print('  ' + f)
    print(f"\n  {res['links']} links revisados")
    print('  pedidos a otros dominios: ' + (', '.join(res['externos']) or 'ninguno'))
    if res['problemas'] or res['externos']:
        print('\nPROBLEMAS:')
        for p in res['problemas']:
            print('  - ' + p)
        sys.exit(1)
    print(f'\nTodo en verde. Capturas en {SALIDA}')


if __name__ == '__main__':
    main()
