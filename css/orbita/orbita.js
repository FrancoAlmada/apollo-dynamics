/* COPIA generada por HANGAR/scripts/generar.py — no editar acá: editá HANGAR/orbita (o marca.json) y regenerá */
/**
 * orbita/orbita.js — el JavaScript de los componentes que lo necesitan. Módulo ES, sin build.
 *
 *   import { iniciarOrbita, mostrarToast } from "./orbita/orbita.js";
 *   iniciarOrbita();   // tabs, tema, modales, nav móvil: todo por data-attributes
 *
 * Reglas: nada de innerHTML con datos (solo textContent y nodos creados a mano); todo lo
 * interactivo funciona con teclado; si JS no carga, el HTML sigue siendo usable (los tabs
 * muestran el primer panel, el acordeón es <details>, el modal es <dialog>).
 */

// ─── Tema ─────────────────────────────────────────────────────────────────────
// El interruptor gana sobre el sistema en los dos sentidos: escribe data-theme en <html>.
export function temaActual() {
  const raiz = document.documentElement;
  const fijado = raiz.getAttribute("data-theme");
  if (fijado) return fijado;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function fijarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);
  try { localStorage.setItem("tema", tema); } catch (e) { /* modo privado: no pasa nada */ }
  document.querySelectorAll("[data-tema]").forEach(pintarBotonTema);
}

function pintarBotonTema(boton) {
  const oscuro = temaActual() === "dark";
  boton.textContent = oscuro ? (boton.dataset.textoClaro || "Modo claro") : (boton.dataset.textoOscuro || "Modo consola");
  boton.setAttribute("aria-pressed", oscuro ? "true" : "false");
}

export function iniciarTema(raiz = document) {
  // Aplicar lo guardado antes de pintar evita el parpadeo claro→oscuro. Si la página lo hizo
  // en un <script> inline en el <head>, esto no cambia nada.
  try {
    const guardado = localStorage.getItem("tema");
    if (guardado && !document.documentElement.getAttribute("data-theme")) {
      document.documentElement.setAttribute("data-theme", guardado);
    }
  } catch (e) { /* idem */ }
  raiz.querySelectorAll("[data-tema]").forEach((boton) => {
    pintarBotonTema(boton);
    boton.addEventListener("click", () => fijarTema(temaActual() === "dark" ? "light" : "dark"));
  });
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
// <div data-tabs>
//   <div class="tabs__lista" role="tablist"><button class="tabs__tab" role="tab" aria-controls="p1">…</button>…</div>
//   <div class="tabs__panel" id="p1" role="tabpanel">…</div>…
// </div>
export function iniciarTabs(contenedor) {
  const tabs = Array.from(contenedor.querySelectorAll('[role="tab"]'));
  const paneles = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
  if (!tabs.length) return;

  function activar(indice, enfocar = true) {
    tabs.forEach((t, i) => {
      const activo = i === indice;
      t.setAttribute("aria-selected", activo ? "true" : "false");
      t.tabIndex = activo ? 0 : -1;
      if (paneles[i]) paneles[i].hidden = !activo;
    });
    if (enfocar) tabs[indice].focus();
  }

  tabs.forEach((t, i) => {
    t.addEventListener("click", () => activar(i, false));
    // Flechas para moverse, Home/End para los extremos: el patrón WAI-ARIA de tabs.
    t.addEventListener("keydown", (e) => {
      const teclas = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in teclas)) return;
      e.preventDefault();
      activar((teclas[e.key] + tabs.length) % tabs.length);
    });
  });
  const inicial = Math.max(0, tabs.findIndex((t) => t.getAttribute("aria-selected") === "true"));
  activar(inicial, false);
}

// ─── Modal (<dialog>) ─────────────────────────────────────────────────────────
// <button data-abre-modal="id-del-dialog">…</button>   <dialog id="…" class="modal">… <button data-cierra-modal>…
export function abrirModal(id) {
  const d = document.getElementById(id);
  if (d && typeof d.showModal === "function" && !d.open) d.showModal();
}
export function cerrarModal(elemento) {
  const d = elemento.closest ? elemento.closest("dialog") : document.getElementById(elemento);
  if (d && d.open) d.close();
}
function iniciarModales(raiz = document) {
  raiz.querySelectorAll("[data-abre-modal]").forEach((b) => b.addEventListener("click", () => abrirModal(b.dataset.abreModal)));
  raiz.querySelectorAll("[data-cierra-modal]").forEach((b) => b.addEventListener("click", () => cerrarModal(b)));
  // Click en el fondo cierra: el <dialog> recibe el click cuando el objetivo es él mismo, no su contenido.
  raiz.querySelectorAll("dialog.modal").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));
}

// ─── Toast ────────────────────────────────────────────────────────────────────
// mostrarToast({ texto: "Guardado", tipo: "ok" | "rechazo" | "aviso" | "neutro", duracion: 5000 })
export function mostrarToast({ texto, tipo = "neutro", duracion = 5000 }) {
  let region = document.querySelector(".toasts");
  if (!region) {
    region = document.createElement("div");
    region.className = "toasts";
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
    document.body.appendChild(region);
  }
  const toast = document.createElement("div");
  toast.className = "toast" + (tipo !== "neutro" ? ` toast--${tipo}` : "");
  const p = document.createElement("p");
  p.className = "toast__texto";
  p.textContent = texto;
  const cerrar = document.createElement("button");
  cerrar.className = "toast__cerrar";
  cerrar.type = "button";
  cerrar.setAttribute("aria-label", "Cerrar aviso");
  cerrar.textContent = "×";
  cerrar.addEventListener("click", () => toast.remove());
  toast.append(p, cerrar);
  region.appendChild(toast);
  if (duracion > 0) setTimeout(() => toast.remove(), duracion);
  return toast;
}

// ─── Navegación móvil ─────────────────────────────────────────────────────────
// <header class="nav-superior" data-nav> … <button class="nav-superior__hamburguesa" aria-expanded="false" aria-controls="menu">
function iniciarNav(raiz = document) {
  raiz.querySelectorAll("[data-nav]").forEach((nav) => {
    const boton = nav.querySelector(".nav-superior__hamburguesa");
    if (!boton) return;
    const alternar = (abrir) => {
      nav.classList.toggle("nav-superior--abierta", abrir);
      boton.setAttribute("aria-expanded", abrir ? "true" : "false");
      boton.textContent = abrir ? "Cerrar" : (boton.dataset.texto || "Menú");
    };
    boton.addEventListener("click", () => alternar(!nav.classList.contains("nav-superior--abierta")));
    nav.addEventListener("keydown", (e) => { if (e.key === "Escape") alternar(false); });
    nav.querySelectorAll(".nav-superior__enlace").forEach((a) => a.addEventListener("click", () => alternar(false)));
  });
}

// ─── Copiar código (styleguide) ───────────────────────────────────────────────
// <button data-copiar="#id-del-pre">Copiar</button>
function iniciarCopiar(raiz = document) {
  raiz.querySelectorAll("[data-copiar]").forEach((b) => {
    b.addEventListener("click", async () => {
      const origen = document.querySelector(b.dataset.copiar);
      if (!origen) return;
      try {
        await navigator.clipboard.writeText(origen.textContent);
        const anterior = b.textContent;
        b.textContent = "Copiado";
        setTimeout(() => { b.textContent = anterior; }, 1400);
      } catch (e) {
        mostrarToast({ texto: "No se pudo copiar: seleccioná el código a mano.", tipo: "aviso" });
      }
    });
  });
}

// ─── Todo junto ───────────────────────────────────────────────────────────────
export function iniciarOrbita(raiz = document) {
  iniciarTema(raiz);
  raiz.querySelectorAll("[data-tabs]").forEach(iniciarTabs);
  iniciarModales(raiz);
  iniciarNav(raiz);
  iniciarCopiar(raiz);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => iniciarOrbita());
} else {
  iniciarOrbita();
}
