/**
 * js/sitio.js — lo propio de la web de Apollo: el formulario que abre WhatsApp.
 * La navegación móvil y el resto de los componentes los maneja css/orbita/orbita.js (COPIA
 * generada desde HANGAR). Módulo ES, sin build. Nada de innerHTML.
 *
 * Por qué WhatsApp y no un servicio de formularios: el canal real de la agencia es WhatsApp, y un
 * formulario que manda a un tercero exige confirmar cuentas, aguantar spam y guardar datos de la
 * gente en algún lado. Acá el mensaje se arma con lo que escribió la persona y se abre en su
 * WhatsApp, ya redactado. No se guarda nada en el sitio (y la web lo dice).
 */

const NUMERO = "5492996353269";

const form = document.getElementById("formulario");
if (form) {
  const ok = document.getElementById("form-ok");
  const error = document.getElementById("form-error");
  const enlaceRespaldo = document.getElementById("form-respaldo");

  function mostrar(cual) {
    ok.hidden = cual !== "ok";
    error.hidden = cual !== "error";
  }

  // Validación en cliente con los mensajes del HTML: marca el campo, muestra su error y enfoca el primero.
  function validar() {
    let primero = null;
    for (const control of form.querySelectorAll(".campo__control[required]")) {
      const campo = control.closest(".campo");
      const invalido = !control.value.trim();
      campo.classList.toggle("campo--invalido", invalido);
      control.setAttribute("aria-invalid", invalido ? "true" : "false");
      if (invalido && !primero) primero = control;
    }
    if (primero) primero.focus();
    return !primero;
  }

  function armarMensaje() {
    const nombre = form.elements.nombre.value.trim();
    const negocio = form.elements.negocio.value.trim();
    const mensaje = form.elements.mensaje.value.trim();
    const lineas = [`Hola Franco, soy ${nombre}.`];
    if (negocio) lineas.push(`Negocio: ${negocio}.`);
    lineas.push(mensaje);
    return lineas.join("\n");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validar()) return;
    const url = `https://wa.me/${NUMERO}?text=${encodeURIComponent(armarMensaje())}`;
    // Si el navegador bloquea la pestaña nueva, el enlace de respaldo lleva al mismo lugar.
    enlaceRespaldo.href = url;
    const pestana = window.open(url, "_blank", "noopener");
    mostrar(pestana ? "ok" : "error");
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
