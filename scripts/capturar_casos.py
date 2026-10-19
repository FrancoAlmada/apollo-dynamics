# -*- coding: utf-8 -*-
"""Saca las capturas de los casos que no vienen del diseño original.

  - Distribuidora Sáenz: conciliación, antigüedad de saldos y "a quién le escribo hoy",
    desde su modo demostración (AUTOMATIZACIONES/casos/distribuidora_cobranzas/web).
  - Pastas La Sfoglia: la carta, servida desde su repo (lee los platos de su Supabase).

Las sirve en la compu con un servidor local, las abre con playwright-cli a 1440 de ancho y
escala 2x, y deja los PNG en capturas/. Después: python scripts/optimizar_imagenes.py.

El cartel "Modo demostración" de Sáenz se esconde solo en la captura: la web ya aclara que
los casos usan datos ficticios.

Uso:  python scripts/capturar_casos.py
"""
import functools, http.server, io, json, os, shutil, subprocess, tempfile, threading

AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(AQUI)
TRABAJO = os.path.dirname(os.path.dirname(REPO))
SALIDA = os.path.join(REPO, 'capturas')
SITIOS = {
    'saenz': os.path.join(TRABAJO, 'AUTOMATIZACIONES', 'casos', 'distribuidora_cobranzas', 'web'),
    'sfoglia': os.path.join(TRABAJO, 'AUTOMATIZACIONES', 'casos', 'restaurante_pastas', 'web'),
}
SESION = 'apollo-capturas'

# Lo que corre en el navegador. Los recortes salen de la página, no de números fijos.
CODIGO = r'''async pagina => {
  const C = __CONFIG__;
  const ancho = 1440;
  // Un contexto propio a escala 2x (nítido en pantallas retina) y sin caché: la demo de
  // Sáenz importa módulos, y un caché viejo mostraría datos viejos
  const ctx = await pagina.context().browser().newContext({ viewport: { width: ancho, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  const tamano = (alto) => page.setViewportSize({ width: ancho, height: alto });
  const hechas = [];
  const foto = async (nombre, clip) => {
    await page.screenshot({ path: `${C.salida}/${nombre}.png`, clip, fullPage: !!clip });
    hechas.push(nombre);
  };
  const abajo = (sel, extra = 32) => page.evaluate(([s, e]) => {
    const r = document.querySelector(s).getBoundingClientRect();
    return Math.round(r.bottom + scrollY + e);
  }, [sel, extra]);
  const arriba = (sel, extra = 0) => page.evaluate(([s, e]) => {
    const r = document.querySelector(s).getBoundingClientRect();
    return Math.round(r.top + scrollY - e);
  }, [sel, extra]);
  const sinAviso = () => page.addStyleTag({ content: '#aviso{display:none!important}' });

  // --- Sáenz: conciliación ---------------------------------------------------------
  await tamano(900);
  await page.goto(`${C.saenz}/conciliacion.html`, { waitUntil: 'networkidle' });
  await page.waitForSelector("body[data-listo='1']");
  await sinAviso();
  await foto('saenz-conciliacion', { x: 0, y: 0, width: ancho, height: await abajo('#filas', 20) });

  // --- Sáenz: cobranzas (antigüedad de saldos y cola de mora) ------------------------
  await page.goto(`${C.saenz}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForSelector("body[data-listo='1']");
  await sinAviso();
  await foto('saenz-saldos', { x: 0, y: 0, width: ancho, height: await abajo('#filas-antiguedad', 20) });
  // La cola de mora: del título de la sección hasta la quinta fila (corta justo en un borde)
  const desde = await page.evaluate(() => {
    const t = document.querySelector('#filas-mora').closest('table').parentElement.previousElementSibling.previousElementSibling;
    return Math.round(t.getBoundingClientRect().top + scrollY - 10);
  });
  const hasta = await page.evaluate(() => {
    const filas = document.querySelectorAll('#filas-mora tr');
    const f = filas[Math.min(4, filas.length - 1)];
    return Math.round(f.getBoundingClientRect().bottom + scrollY);
  });
  await foto('saenz-mora', { x: 0, y: desde, width: ancho, height: hasta - desde });

  // --- La Sfoglia: la carta (el encuadre de la captura original: portada y primeras secciones)
  await tamano(1064);
  await page.goto(`${C.sfoglia}/carta/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await foto('sfoglia-carta');

  await ctx.close();
  return hechas.join(', ');
}'''


class Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def servir(carpeta):
    manejador = functools.partial(Silencioso, directory=carpeta)
    s = http.server.ThreadingHTTPServer(('127.0.0.1', 0), manejador)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s


def main():
    os.makedirs(SALIDA, exist_ok=True)
    servidores = {k: servir(v) for k, v in SITIOS.items()}
    config = {k: f'http://127.0.0.1:{s.server_port}' for k, s in servidores.items()}
    config['salida'] = SALIDA.replace('\\', '/')
    codigo = os.path.join(tempfile.gettempdir(), 'apollo-capturar-casos.js')
    io.open(codigo, 'w', encoding='utf-8').write(CODIGO.replace('__CONFIG__', json.dumps(config)))
    pw = shutil.which('playwright-cli') or 'playwright-cli'
    cwd = tempfile.gettempdir()  # playwright-cli deja sus archivos en la carpeta actual
    try:
        subprocess.run([pw, f'-s={SESION}', 'open', 'about:blank'], capture_output=True, cwd=cwd, check=True)
        r = subprocess.run([pw, f'-s={SESION}', '--raw', 'run-code', f'--filename={codigo}'],
                           capture_output=True, text=True, encoding='utf-8', cwd=cwd)
        print(r.stdout.strip() or r.stderr.strip())
    finally:
        subprocess.run([pw, f'-s={SESION}', 'close'], capture_output=True, cwd=cwd)
        for s in servidores.values():
            s.shutdown()


if __name__ == '__main__':
    main()
