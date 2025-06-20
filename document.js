document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-contacto');
  const mensajeExito = document.getElementById('mensaje-exito');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Validación simple
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (nombre && correo && mensaje) {
      mensajeExito.textContent = '¡Mensaje enviado correctamente!';
      form.reset();
      setTimeout(() => mensajeExito.textContent = '', 3000);
    } else {
      mensajeExito.textContent = 'Por favor, completa todos los campos.';
      setTimeout(() => mensajeExito.textContent = '', 3000);
    }
  });
});