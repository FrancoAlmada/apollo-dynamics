// Apollo Dynamics — lo único que necesita JavaScript: el formulario de contacto.
// No manda nada a ningún servidor: arma el mensaje y abre WhatsApp con el texto ya escrito.
// Sin JavaScript el sitio se ve y navega igual; solo este formulario deja de funcionar.
'use strict';

const WHATSAPP = '5492996353269';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario-contacto');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valor = (nombre) => (form.elements[nombre].value || '').trim();
    const partes = [
      'Hola Apollo Dynamics, soy ' + valor('nombre') + '.',
      valor('negocio') ? 'Negocio: ' + valor('negocio') + '.' : '',
      valor('mensaje') ? 'Lo que me pasa: ' + valor('mensaje') : '',
    ].filter(Boolean);
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(partes.join(' ')), '_blank', 'noopener');
  });
});
