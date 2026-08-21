/* ============================================================
   APOLLO DYNAMICS — interacciones
   Sin dependencias. Todo se degrada bien si algo falla.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. NAVBAR: compactar al scrollear ---------- */
  var nav = document.getElementById('nav');

  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  // passive: el navegador no espera a este handler para scrollear
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. MENU MOVIL ---------- */
  var toggle = document.getElementById('nav-toggle');
  var menu   = document.getElementById('nav-menu');

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    // Bloquea el scroll del fondo mientras el panel esta abierto
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Al tocar un link del menu, cerrarlo para ver la seccion
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  // Si se agranda la ventana con el menu abierto, volver al estado de escritorio
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) setMenu(false);
  });

  /* ---------- 3. REVEAL EN SCROLL ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // Sin animacion: mostrar todo de una
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);   // una sola vez por elemento
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach(function (el, i) {
      // Escalonado suave entre hermanos, tope de 240ms para no demorar la lectura
      el.style.transitionDelay = Math.min(i % 4, 3) * 80 + 'ms';
      observer.observe(el);
    });
  }

  /* ---------- 4. PARALLAX SUTIL DEL MOSAICO ---------- */
  var mosaico = document.querySelector('.mosaico__grid');

  if (mosaico && !reduceMotion) {
    var ticking = false;

    function parallax() {
      var rect = mosaico.getBoundingClientRect();
      // Solo calcular mientras el mosaico esta en pantalla
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        var progreso = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        var imgs = mosaico.children;
        for (var i = 0; i < imgs.length; i++) {
          // Columnas alternas se mueven en sentidos opuestos
          var dir = (i % 3 === 1) ? -1 : 1;
          imgs[i].style.transform = 'translateY(' + (progreso - 0.5) * 22 * dir + 'px)';
        }
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(parallax);
    }, { passive: true });

    parallax();
  }

  /* ---------- 5. CTA DE SERVICIO PRESELECCIONA EL SELECT ---------- */
  var selectServicio = document.getElementById('servicio');

  document.querySelectorAll('[data-servicio]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (selectServicio) selectServicio.value = link.dataset.servicio;
    });
  });

  /* ---------- 6. FORMULARIO ---------- */
  var form   = document.getElementById('form-contacto');
  var status = document.getElementById('form-status');
  var submit = document.getElementById('submit-btn');

  // FormSubmit: gratis y sin registro. El primer envio dispara un mail de
  // confirmacion a esta casilla; hasta que se acepte, no reenvia nada.
  // Ojo: solo acepta envios desde un dominio publico, nunca desde localhost.
  var ENDPOINT = 'https://formsubmit.co/ajax/francoivanalmada@gmail.com';

  function esEntornoLocal() {
    var host = location.hostname;
    return location.protocol === 'file:' ||
           host === 'localhost' || host === '0.0.0.0' ||
           host === '::1' || host === '[::1]' ||
           host.indexOf('127.') === 0 ||
           /\.local$/.test(host);
  }

  var MENSAJES = {
    nombre:  'Escribí tu nombre.',
    email:   'Necesitamos un email válido para responderte.',
    mensaje: 'Contanos un poco sobre tu proyecto.'
  };

  function setError(campo, texto) {
    var field = campo.closest('.field');
    var slot  = form.querySelector('[data-error-for="' + campo.id + '"]');
    field.classList.toggle('has-error', Boolean(texto));
    if (slot) slot.textContent = texto || '';
  }

  function validar(campo) {
    // Usa la validacion nativa del navegador y le pone nuestro texto
    var ok = campo.checkValidity();
    setError(campo, ok ? '' : MENSAJES[campo.name]);
    return ok;
  }

  // Limpia el error apenas el usuario corrige
  form.querySelectorAll('input[required], textarea[required]').forEach(function (campo) {
    campo.addEventListener('blur',  function () { validar(campo); });
    campo.addEventListener('input', function () {
      if (campo.closest('.field').classList.contains('has-error')) validar(campo);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var campos = form.querySelectorAll('input[required], textarea[required]');
    var valido = true;
    campos.forEach(function (campo) { if (!validar(campo)) valido = false; });

    if (!valido) {
      status.textContent = 'Revisá los campos marcados.';
      status.className = 'form__status is-error';
      form.querySelector('.has-error input, .has-error textarea').focus();
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Enviando…';
    status.textContent = '';
    status.className = 'form__status';

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        // FormSubmit devuelve success como string "true", no como booleano
        if (data.success !== true && data.success !== 'true') {
          throw new Error(data.message || 'Error del servidor');
        }
        status.textContent = '¡Listo! Recibimos tu consulta y te respondemos dentro de las 24 horas hábiles.';
        status.className = 'form__status is-ok';
        form.reset();
      })
      .catch(function (err) {
        // FormSubmit exige un dominio publico: desde localhost o abriendo el
        // archivo directo siempre rechaza. Sin este aviso el error parece un
        // bug del sitio y se pierde tiempo buscando donde no hay nada.
        if (esEntornoLocal()) {
          status.textContent = 'El formulario no funciona en local: FormSubmit solo acepta envíos desde el sitio publicado. Ver README.';
          console.warn('[form] FormSubmit rechaza envíos locales.', err.message);
        } else {
          status.textContent = 'No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp.';
        }
        status.className = 'form__status is-error';
      })
      .finally(function () {
        submit.disabled = false;
        submit.textContent = 'Enviar consulta';
      });
  });

  /* ---------- 7. ANIO DEL FOOTER ---------- */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
