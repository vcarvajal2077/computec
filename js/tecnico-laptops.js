// Navegación entre secciones
const navLinks = document.querySelectorAll('.sidebar-nav a');
const sections = document.querySelectorAll('.dashboard-section');

navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    const section = this.getAttribute('data-section');
    sections.forEach(sec => {
      sec.classList.remove('active');
      if (sec.id === section) sec.classList.add('active');
    });
  });
});

// Botón logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    window.location.href = 'login.html';
  });
}

// Placeholder para agregar componente
const btnNuevoComponente = document.getElementById('btnNuevoComponente');
if (btnNuevoComponente) {
  btnNuevoComponente.addEventListener('click', () => {
    alert('Funcionalidad para agregar nuevo componente (por implementar)');
  });
}

// --- Inventario de Componentes ---
const inventarioList = document.querySelector('.inventario-list');
let inventario = [
  { id: 1, nombre: 'Disco SSD 512GB', cantidad: 3 },
  { id: 2, nombre: 'Memoria RAM 8GB DDR4', cantidad: 5 },
  { id: 3, nombre: 'Pantalla 15.6" FHD', cantidad: 2 }
];
function renderInventario() {
  if (!inventarioList) return;
  inventarioList.innerHTML = `
    <table class="mini-table">
      <thead><tr><th>Componente</th><th>Cantidad</th><th>Acciones</th></tr></thead>
      <tbody>
        ${inventario.map(item => `
          <tr>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td><button class="btn btn-del" data-id="${item.id}"><i class="fas fa-trash"></i></button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <form id="formNuevoComponente" class="mini-form">
      <input type="text" id="nuevoComponente" placeholder="Nombre del componente" required />
      <input type="number" id="cantidadComponente" placeholder="Cantidad" min="1" value="1" required />
      <button type="submit" class="btn primary"><i class="fas fa-plus"></i> Agregar</button>
    </form>
  `;
  // Eliminar componente
  inventarioList.querySelectorAll('.btn-del').forEach(btn => {
    btn.onclick = function() {
      const id = Number(this.getAttribute('data-id'));
      inventario = inventario.filter(item => item.id !== id);
      renderInventario();
    };
  });
  // Agregar componente
  const form = document.getElementById('formNuevoComponente');
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      const nombre = document.getElementById('nuevoComponente').value.trim();
      const cantidad = Number(document.getElementById('cantidadComponente').value);
      if (nombre && cantidad > 0) {
        inventario.push({ id: Date.now(), nombre, cantidad });
        renderInventario();
      }
      form.reset();
    };
  }
}
renderInventario();

// --- Historial de Servicios ---
const historialList = document.querySelector('.historial-list');
let historial = [
  { id: 1, equipo: 'Laptop HP', servicio: 'Cambio de pantalla', fecha: '2024-06-18' },
  { id: 2, equipo: 'Lenovo ThinkPad', servicio: 'Reemplazo de teclado', fecha: '2024-06-17' }
];
function renderHistorial() {
  if (!historialList) return;
  historialList.innerHTML = `
    <table class="mini-table">
      <thead><tr><th>Equipo</th><th>Servicio</th><th>Fecha</th></tr></thead>
      <tbody>
        ${historial.map(item => `
          <tr>
            <td>${item.equipo}</td>
            <td>${item.servicio}</td>
            <td>${item.fecha}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <form id="formNuevoServicio" class="mini-form">
      <input type="text" id="equipoServicio" placeholder="Equipo" required />
      <input type="text" id="descServicio" placeholder="Servicio realizado" required />
      <input type="date" id="fechaServicio" required />
      <button type="submit" class="btn primary"><i class="fas fa-plus"></i> Agregar</button>
    </form>
  `;
  // Agregar servicio
  const form = document.getElementById('formNuevoServicio');
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      const equipo = document.getElementById('equipoServicio').value.trim();
      const servicio = document.getElementById('descServicio').value.trim();
      const fecha = document.getElementById('fechaServicio').value;
      if (equipo && servicio && fecha) {
        historial.push({ id: Date.now(), equipo, servicio, fecha });
        renderHistorial();
      }
      form.reset();
    };
  }
}
renderHistorial();

// --- Comunicación ---
const comunicacionList = document.querySelector('.comunicacion-list');
let mensajes = [
  { id: 1, remitente: 'Cliente', mensaje: '¿Cuándo estará lista mi laptop?', fecha: '2024-06-18' },
  { id: 2, remitente: 'Técnico', mensaje: 'La reparación estará lista mañana.', fecha: '2024-06-18' }
];
function renderComunicacion() {
  if (!comunicacionList) return;
  comunicacionList.innerHTML = `
    <div class="mensajes-box">
      ${mensajes.map(msg => `
        <div class="mensaje-item"><b>${msg.remitente}:</b> ${msg.mensaje} <span class="fecha">${msg.fecha}</span></div>
      `).join('')}
    </div>
    <form id="formNuevoMensaje" class="mini-form">
      <input type="text" id="remitenteMensaje" placeholder="Remitente" required />
      <input type="text" id="contenidoMensaje" placeholder="Mensaje" required />
      <input type="date" id="fechaMensaje" required />
      <button type="submit" class="btn primary"><i class="fas fa-paper-plane"></i> Enviar</button>
    </form>
  `;
  // Agregar mensaje
  const form = document.getElementById('formNuevoMensaje');
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      const remitente = document.getElementById('remitenteMensaje').value.trim();
      const mensaje = document.getElementById('contenidoMensaje').value.trim();
      const fecha = document.getElementById('fechaMensaje').value;
      if (remitente && mensaje && fecha) {
        mensajes.push({ id: Date.now(), remitente, mensaje, fecha });
        renderComunicacion();
      }
      form.reset();
    };
  }
}
renderComunicacion(); 