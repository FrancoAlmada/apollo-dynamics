/**
 * js/sitio.js — lo propio de la web de Apollo: el formulario de contacto.
 * La navegación móvil y el resto de los componentes los maneja css/orbita/orbita.js (COPIA
 * generada desde HANGAR). Módulo ES, sin build. Nada de innerHTML.
 *
 * El formulario manda a FormSubmit por fetch (sin recargar) y muestra los tres estados
 * diseñados: cargando, ok y error. Si JS no carga, el <form> sigue funcionando por POST normal.
 */

const ENDPOINT = "https://formsubmit.co/ajax/francoivanalmada@gmail.com";

const form = document.getElementById("formulario");
if (form) {
  const estados = {
    cargando: document.getElementById("form-cargando"),
    ok: document.getElementById("form-ok"),
    error: document.getElementById("form-error"),
  };
  const textoError = document.getElementById("form-error-texto");
  const boton = form.querySelector('button[type="submit"]');

  function mostrar(cual) {
    for (const [k, el] of Object.entries(estados)) el.hidden = k !== cual;
  }

  // Validación en cliente con los mensajes del HTML: marca el campo, muestra su error y enfoca el primero.
  function validar() {
    let primero = null;
    for (const control of form.querySelectorAll(".campo__control[required]")) {
      const campo = control.closest(".campo");
      const vacio = !control.value.trim();
      const telMalo = control.type === "tel" && !vacio && control.value.replace(/\D/g, "").length < 8;
      const invalido = vacio || telMalo;
      campo.classList.toggle("campo--invalido", invalido);
      control.setAttribute("aria-invalid", invalido ? "true" : "false");
      if (invalido && !primero) primero = control;
    }
    if (primero) primero.focus();
    return !primero;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validar()) return;
    // El honeypot: si un bot lo completó, se hace como que se envió y no se manda nada.
    if (form.elements["_honey"] && form.elements["_honey"].value) { mostrar("ok"); form.reset(); return; }

    mostrar("cargando");
    boton.disabled = true;
    try {
      const datos = new FormData(form);
      const r = await fetch(ENDPOINT, { method: "POST", body: datos, headers: { Accept: "application/json" } });
      const cuerpo = await r.json().catch(() => ({}));
      if (!r.ok || cuerpo.success === "false" || cuerpo.success === false) {
        throw new Error(cuerpo.message || `HTTP ${r.status}`);
      }
      mostrar("ok");
      form.reset();
      form.querySelectorAll(".campo--invalido").forEach((c) => c.classList.remove("campo--invalido"));
    } catch (err) {
      // FormSubmit rechaza envíos desde localhost: decirlo en vez de mostrar un error genérico.
      const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
      textoError.textContent = local
        ? "Desde una máquina local el formulario no envía (FormSubmit solo acepta el dominio publicado). Probá desde la web publicada o escribinos por WhatsApp."
        : "Escribinos directo por WhatsApp mientras lo arreglamos.";
      mostrar("error");
    } finally {
      boton.disabled = false;
    }
  });

  // Al corregir un campo, el error se va solo.
  form.addEventListener("input", (e) => {
    const campo = e.target.closest(".campo");
    if (campo && campo.classList.contains("campo--invalido") && e.target.value.trim()) {
      campo.classList.remove("campo--invalido");
      e.target.setAttribute("aria-invalid", "false");
    }
  });
}
