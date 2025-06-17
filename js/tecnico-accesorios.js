// SPA Navigation
const navLinks = document.querySelectorAll('.sidebar-nav a');
const sections = document.querySelectorAll('.dashboard-section');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    const section = this.getAttribute('data-section');
    sections.forEach(sec => {
      sec.classList.toggle('active', sec.id === section);
    });
    // Cargar contenido dinámico
    if (window[section + 'View']) window[section + 'View']();
  });
});
// Logout
document.getElementById('logoutBtn').onclick = () => {
  window.location.href = 'login.html';
};
// --- Datos simulados ---
let reparaciones = [
  {id: 1, cliente: "Juan Pérez", equipo: "iPhone 12", problema: "Pantalla rota", estado: "en reparación", fecha: "2024-06-12", tecnico: "Carlos"},
  {id: 2, cliente: "María García", equipo: "Galaxy Tab S7", problema: "Batería defectuosa", estado: "pendiente", fecha: "2024-06-11", tecnico: "Carlos"}
];
let inventario = [
  {id: 1, nombre: "Pantalla iPhone 12", tipo: "Pantalla", cantidad: 5, proveedor: "Apple", precio: 150},
  {id: 2, nombre: "Batería Galaxy Tab S7", tipo: "Batería", cantidad: 3, proveedor: "Samsung", precio: 80}
];
let historial = [
  {id: 1, cliente: "Juan Pérez", equipo: "iPhone 12", tipo: "Reparación", estado: "finalizado", fecha: "2024-06-10"},
  {id: 2, cliente: "María García", equipo: "Galaxy Tab S7", tipo: "Reparación", estado: "entregado", fecha: "2024-06-09"}
];
let mensajes = [
  {de: "Cliente: Juan Pérez", fecha: "12/06/2024 10:30", texto: "¿Cuándo estará lista mi reparación?"},
  {de: "Cliente: María García", fecha: "11/06/2024 16:15", texto: "¿Puedo pasar a retirar mi tablet?"}
];
let calendario = [
  {fecha: "2024-06-15", evento: "Entrega iPhone 12"},
  {fecha: "2024-06-16", evento: "Cita diagnóstico Galaxy Tab"}
];
// --- Vistas dinámicas ---
function reparacionesView() {
  const section = document.getElementById('reparaciones');
  section.innerHTML = `
    <h2>Gestión de Reparaciones</h2>
    <button class="btn primary" id="btnNuevaReparacion"><i class="fas fa-plus"></i> Nueva Reparación</button>
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Cliente</th><th>Equipo</th><th>Problema</th><th>Estado</th><th>Fecha</th><th>Técnico</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${reparaciones.map(r => `
          <tr>
            <td>${r.id}</td>
            <td>${r.cliente}</td>
            <td>${r.equipo}</td>
            <td>${r.problema}</td>
            <td>
              <select class="estado-select" data-id="${r.id}">
                <option value="pendiente" ${r.estado==="pendiente"?"selected":""}>Pendiente</option>
                <option value="en reparación" ${r.estado==="en reparación"?"selected":""}>En reparación</option>
                <option value="finalizado" ${r.estado==="finalizado"?"selected":""}>Finalizado</option>
                <option value="entregado" ${r.estado==="entregado"?"selected":""}>Entregado</option>
                <option value="cancelado" ${r.estado==="cancelado"?"selected":""}>Cancelado</option>
              </select>
            </td>
            <td>${r.fecha}</td>
            <td>${r.tecnico}</td>
            <td><button class="btn secondary btnVerReparacion" data-id="${r.id}">Ver</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div id="formNuevaReparacion" style="display:none;">
      <h3>Nueva Reparación</h3>
      <form id="nuevaReparacionForm">
        <label>Cliente<input name="cliente" required></label>
        <label>Equipo<input name="equipo" required></label>
        <label>Problema<input name="problema" required></label>
        <label>Fecha<input name="fecha" type="date" required></label>
        <label>Técnico<input name="tecnico" required></label>
        <button class="btn primary" type="submit">Registrar</button>
        <button class="btn secondary" type="button" id="cancelarNuevaReparacion">Cancelar</button>
      </form>
    </div>
  `;
  // Eventos
  document.getElementById('btnNuevaReparacion').onclick = () => {
    document.getElementById('formNuevaReparacion').style.display = 'block';
  };
  document.getElementById('cancelarNuevaReparacion').onclick = () => {
    document.getElementById('formNuevaReparacion').style.display = 'none';
  };
  document.getElementById('nuevaReparacionForm').onsubmit = function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    reparaciones.push({
      id: reparaciones.length+1,
      ...data,
      estado: "pendiente"
    });
    reparacionesView();
  };
  document.querySelectorAll('.estado-select').forEach(sel => {
    sel.onchange = function() {
      const id = +this.getAttribute('data-id');
      const r = reparaciones.find(x => x.id === id);
      r.estado = this.value;
    };
  });
}
function inventarioView() {
  const section = document.getElementById('inventario');
  section.innerHTML = `
    <h2>Inventario de Accesorios</h2>
    <button class="btn primary" id="btnNuevoAccesorio"><i class="fas fa-plus"></i> Nuevo Accesorio</button>
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Nombre</th><th>Tipo</th><th>Cantidad</th><th>Proveedor</th><th>Precio</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${inventario.map(i => `
          <tr>
            <td>${i.id}</td>
            <td>${i.nombre}</td>
            <td>${i.tipo}</td>
            <td>${i.cantidad}</td>
            <td>${i.proveedor}</td>
            <td>$${i.precio}</td>
            <td>
              <button class="btn secondary btnEditarAccesorio" data-id="${i.id}">Editar</button>
              <button class="btn danger btnEliminarAccesorio" data-id="${i.id}">Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div id="formNuevoAccesorio" style="display:none;">
      <h3>Nuevo Accesorio</h3>
      <form id="nuevoAccesorioForm">
        <label>Nombre<input name="nombre" required></label>
        <label>Tipo<input name="tipo" required></label>
        <label>Cantidad<input name="cantidad" type="number" required></label>
        <label>Proveedor<input name="proveedor" required></label>
        <label>Precio<input name="precio" type="number" required></label>
        <button class="btn primary" type="submit">Registrar</button>
        <button class="btn secondary" type="button" id="cancelarNuevoAccesorio">Cancelar</button>
      </form>
    </div>
  `;
  document.getElementById('btnNuevoAccesorio').onclick = () => {
    document.getElementById('formNuevoAccesorio').style.display = 'block';
  };
  document.getElementById('cancelarNuevoAccesorio').onclick = () => {
    document.getElementById('formNuevoAccesorio').style.display = 'none';
  };
  document.getElementById('nuevoAccesorioForm').onsubmit = function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    inventario.push({
      id: inventario.length+1,
      ...data
    });
    inventarioView();
  };
  document.querySelectorAll('.btnEliminarAccesorio').forEach(btn => {
    btn.onclick = function() {
      const id = +this.getAttribute('data-id');
      inventario = inventario.filter(x => x.id !== id);
      inventarioView();
    };
  });
}
function historialView() {
  const section = document.getElementById('historial');
  section.innerHTML = `
    <h2>Historial de Servicios</h2>
    <input id="buscarHistorial" placeholder="Buscar por cliente, equipo, estado...">
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Cliente</th><th>Equipo</th><th>Tipo</th><th>Estado</th><th>Fecha</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${historial.map(h => `
          <tr>
            <td>${h.id}</td>
            <td>${h.cliente}</td>
            <td>${h.equipo}</td>
            <td>${h.tipo}</td>
            <td><span class="badge badge-${h.estado}">${h.estado.charAt(0).toUpperCase()+h.estado.slice(1)}</span></td>
            <td>${h.fecha}</td>
            <td><button class="btn secondary btnVerHistorial" data-id="${h.id}">Ver</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div id="detalleHistorial" style="display:none;"></div>
  `;
  document.getElementById('buscarHistorial').oninput = function() {
    const val = this.value.toLowerCase();
    const filtered = historial.filter(h =>
      h.cliente.toLowerCase().includes(val) ||
      h.equipo.toLowerCase().includes(val) ||
      h.tipo.toLowerCase().includes(val) ||
      h.estado.toLowerCase().includes(val)
    );
    historialView.filtered = filtered;
    historialView();
  };
  document.querySelectorAll('.btnVerHistorial').forEach(btn => {
    btn.onclick = function() {
      const id = +this.getAttribute('data-id');
      const h = historial.find(x => x.id === id);
      const detalle = document.getElementById('detalleHistorial');
      detalle.style.display = 'block';
      detalle.innerHTML = `
        <h4>Detalle del Servicio</h4>
        <p><b>Cliente:</b> ${h.cliente}</p>
        <p><b>Equipo:</b> ${h.equipo}</p>
        <p><b>Tipo:</b> ${h.tipo}</p>
        <p><b>Estado:</b> ${h.estado}</p>
        <p><b>Fecha:</b> ${h.fecha}</p>
        <button class="btn secondary" onclick="document.getElementById('detalleHistorial').style.display='none'">Cerrar</button>
      `;
    };
  });
}
historialView.filtered = null;
function calendarioView() {
  const section = document.getElementById('calendario');
  // Simple calendario mensual
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  let days = '';
  for(let i=0; i<firstDay; i++) days += '<td></td>';
  for(let d=1; d<=daysInMonth; d++) {
    const fecha = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const evento = calendario.find(ev => ev.fecha === fecha);
    days += `<td${evento?' style="background:#dbeafe;"':''}>${d}${evento?'<br><small>'+evento.evento+'</small>':''}</td>`;
    if((i+firstDay+d)%7===0) days += '</tr><tr>';
  }
  section.innerHTML = `
    <h2>Calendario</h2>
    <table>
      <thead><tr><th colspan="7">${now.toLocaleString('es-ES',{month:'long',year:'numeric'})}</th></tr>
      <tr><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th><th>Dom</th></tr></thead>
      <tbody><tr>${days}</tr></tbody>
    </table>
    <h3>Próximos eventos</h3>
    <ul>
      ${calendario.map(ev => `<li>${ev.fecha}: ${ev.evento}</li>`).join('')}
    </ul>
  `;
}
function comunicacionView() {
  const section = document.getElementById('comunicacion');
  section.innerHTML = `
    <h2>Comunicación</h2>
    <div class="mensajes-list">
      ${mensajes.map(m => `
        <div style="background:#fff; border-radius:8px; padding:1rem; margin-bottom:1rem;">
          <strong>${m.de}</strong><br>
          <span style="color:#888; font-size:0.95em;">${m.fecha}</span>
          <p>${m.texto}</p>
        </div>
      `).join('')}
    </div>
    <form id="formMensaje" style="margin-top:1rem;">
      <input name="mensaje" placeholder="Escribe un mensaje..." required style="width:70%;">
      <button class="btn primary" type="submit">Enviar</button>
    </form>
  `;
  document.getElementById('formMensaje').onsubmit = function(e) {
    e.preventDefault();
    const texto = this.mensaje.value;
    mensajes.push({de:"Técnico", fecha: new Date().toLocaleString(), texto});
    comunicacionView();
  };
}
// Inicializar la vista por defecto
reparacionesView(); 