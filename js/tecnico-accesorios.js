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
  // Eliminar botón anterior si existe
  const oldBtn = document.getElementById('btnNuevaReparacion');
  if (oldBtn) oldBtn.remove();
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
  `;
  // Añadir y asociar evento al botón
  const btnNuevaReparacion = document.getElementById('btnNuevaReparacion');
  btnNuevaReparacion.onclick = () => { mostrarModalNuevaReparacion(); };
  function mostrarModalNuevaReparacion() {
    // Eliminar modal anterior si existe
    let oldModal = document.getElementById('modalNuevaReparacion');
    if (oldModal) oldModal.remove();
    let modal = document.createElement('div');
    modal.id = 'modalNuevaReparacion';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class='modal-content' style='max-width:500px;width:95%;overflow-y:auto;'>
        <div class='modal-header'>
          <h2>Nueva Reparación</h2>
          <span class='close' id='cerrarModalNuevaReparacion'>&times;</span>
        </div>
        <form id='formNuevaReparacionModal'>
          <div class='form-group' style='width:100%'>
            <label for='clienteModal'>Cliente</label>
            <input type='text' id='clienteModal' name='cliente' class='form-control' required style='width:100%'>
          </div>
          <div class='form-group' style='width:100%'>
            <label for='equipoModal'>Equipo</label>
            <input type='text' id='equipoModal' name='equipo' class='form-control' required style='width:100%'>
          </div>
          <div class='form-group' style='width:100%'>
            <label for='problemaModal'>Problema</label>
            <input type='text' id='problemaModal' name='problema' class='form-control' required style='width:100%'>
          </div>
          <div class='form-group' style='width:100%'>
            <label for='descripcionModal'>Descripción</label>
            <textarea id='descripcionModal' name='descripcion' class='form-control' required style='width:100%' rows='3'></textarea>
          </div>
          <div class='form-group' style='width:100%'>
            <label for='fechaModal'>Fecha</label>
            <input type='date' id='fechaModal' name='fecha' class='form-control' required style='width:100%'>
          </div>
          <div class='form-group' style='width:100%'>
            <label for='tecnicoModal'>Técnico</label>
            <input type='text' id='tecnicoModal' name='tecnico' class='form-control' required style='width:100%'>
          </div>
          <div class='form-actions' style='width:100%;display:flex;gap:1rem;justify-content:flex-end;'>
            <button type='submit' class='btn primary' style='flex:1'><i class='fas fa-save'></i> Registrar</button>
            <button type='button' class='btn secondary' id='cancelarNuevaReparacionModal' style='flex:1'><i class='fas fa-times'></i> Cancelar</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    document.getElementById('cerrarModalNuevaReparacion').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('cancelarNuevaReparacionModal').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('formNuevaReparacionModal').onsubmit = function(e) {
      e.preventDefault();
      let valido = true;
      this.querySelectorAll('.error-message').forEach(el => el.remove());
      this.querySelectorAll('.form-control').forEach(el => el.classList.remove('input-error'));
      function mostrarError(nombre, mensaje) {
        const input = document.getElementById(nombre+'Modal');
        input.classList.add('input-error');
        let error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = mensaje;
        error.style.marginLeft = '2px';
        input.parentNode.appendChild(error);
        valido = false;
      }
      const cliente = this.cliente.value.trim();
      const equipo = this.equipo.value.trim();
      const problema = this.problema.value.trim();
      const descripcion = this.descripcion.value.trim();
      const fecha = this.fecha.value;
      const tecnico = this.tecnico.value.trim();
      // Cliente: solo letras y espacios
      if (!cliente) mostrarError('cliente', 'El cliente es obligatorio.');
      else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(cliente)) mostrarError('cliente', 'Solo letras y espacios.');
      // Equipo: mínimo 3 caracteres
      if (!equipo) mostrarError('equipo', 'El equipo es obligatorio.');
      else if (equipo.length < 3) mostrarError('equipo', 'Mínimo 3 caracteres.');
      // Problema: mínimo 3 caracteres
      if (!problema) mostrarError('problema', 'El problema es obligatorio.');
      else if (problema.length < 3) mostrarError('problema', 'Mínimo 3 caracteres.');
      // Descripción: mínimo 5 caracteres
      if (!descripcion) mostrarError('descripcion', 'La descripción es obligatoria.');
      else if (descripcion.length < 5) mostrarError('descripcion', 'Mínimo 5 caracteres.');
      // Fecha: no futura ni anterior a 2020-01-01
      if (!fecha) mostrarError('fecha', 'La fecha es obligatoria.');
      else {
        const hoy = new Date();
        const fechaIngresada = new Date(fecha);
        hoy.setHours(0,0,0,0);
        const minFecha = new Date('2020-01-01');
        if (fechaIngresada > hoy) mostrarError('fecha', 'La fecha no puede ser futura.');
        else if (fechaIngresada < minFecha) mostrarError('fecha', 'No se permiten fechas antes de 2020.');
      }
      // Técnico: solo letras y espacios
      if (!tecnico) mostrarError('tecnico', 'El técnico es obligatorio.');
      else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(tecnico)) mostrarError('tecnico', 'Solo letras y espacios.');
      if (!valido) return;
      const data = Object.fromEntries(new FormData(this));
      reparaciones.push({
        id: reparaciones.length+1,
        ...data,
        estado: "pendiente"
      });
      modal.style.display = 'none';
      reparacionesView();
    };
  }
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
  `;
  document.getElementById('btnNuevoAccesorio').onclick = () => {
    // Eliminar modal anterior si existe
    let oldModal = document.getElementById('modalNuevoAccesorio');
    if (oldModal) oldModal.remove();
    let modal = document.createElement('div');
    modal.id = 'modalNuevoAccesorio';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class='modal-content' style='max-width:500px;width:95%;overflow-y:auto;'>
        <div class='modal-header'>
          <h2>Nuevo Accesorio</h2>
          <span class='close' id='cerrarModalNuevoAccesorio'>&times;</span>
        </div>
        <form id='formNuevoAccesorioModal'>
          <style>
            #formNuevoAccesorioModal .form-control {
              width: 100%;
              max-width: 100%;
              box-sizing: border-box;
            }
          </style>
          <div class='form-group' style='width:100%'>
            <label for='nombreAccesorio'>Nombre</label>
            <input type='text' id='nombreAccesorio' name='nombre' class='form-control' required>
          </div>
          <div class='form-group' style='width:100%'>
            <label for='tipoAccesorio'>Tipo</label>
            <input type='text' id='tipoAccesorio' name='tipo' class='form-control' required>
          </div>
          <div class='form-group' style='width:100%'>
            <label for='cantidadAccesorio'>Cantidad</label>
            <input type='number' id='cantidadAccesorio' name='cantidad' class='form-control' required>
          </div>
          <div class='form-group' style='width:100%'>
            <label for='proveedorAccesorio'>Proveedor</label>
            <input type='text' id='proveedorAccesorio' name='proveedor' class='form-control' required>
          </div>
          <div class='form-group' style='width:100%'>
            <label for='precioAccesorio'>Precio</label>
            <input type='number' id='precioAccesorio' name='precio' class='form-control' required>
          </div>
          <div class='form-actions' style='width:100%;display:flex;gap:1rem;justify-content:flex-end;'>
            <button type='submit' class='btn primary' style='flex:1'><i class='fas fa-save'></i> Registrar</button>
            <button type='button' class='btn secondary' id='cancelarNuevoAccesorioModal' style='flex:1'><i class='fas fa-times'></i> Cancelar</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    document.getElementById('cerrarModalNuevoAccesorio').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('cancelarNuevoAccesorioModal').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('formNuevoAccesorioModal').onsubmit = function(e) {
      e.preventDefault();
      let valido = true;
      this.querySelectorAll('.error-message').forEach(el => el.remove());
      this.querySelectorAll('.form-control').forEach(el => el.classList.remove('input-error'));
      function mostrarError(nombre, mensaje) {
        const input = document.getElementById(nombre+'Accesorio');
        input.classList.add('input-error');
        let error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = mensaje;
        error.style.marginLeft = '2px';
        input.parentNode.appendChild(error);
        valido = false;
      }
      const nombre = this.nombre.value.trim();
      const tipo = this.tipo.value.trim();
      const cantidad = this.cantidad.value.trim();
      const proveedor = this.proveedor.value.trim();
      const precio = this.precio.value.trim();
      // Nombre: mínimo 3, solo letras/números/espacios
      if (!nombre) mostrarError('nombre', 'El nombre es obligatorio.');
      else if (nombre.length < 3) mostrarError('nombre', 'Mínimo 3 caracteres.');
      else if (!/^[\wáéíóúÁÉÍÓÚñÑ0-9 ]+$/i.test(nombre)) mostrarError('nombre', 'Solo letras, números y espacios.');
      // Tipo: mínimo 3, solo letras/números/espacios
      if (!tipo) mostrarError('tipo', 'El tipo es obligatorio.');
      else if (tipo.length < 3) mostrarError('tipo', 'Mínimo 3 caracteres.');
      else if (!/^[\wáéíóúÁÉÍÓÚñÑ0-9 ]+$/i.test(tipo)) mostrarError('tipo', 'Solo letras, números y espacios.');
      // Cantidad: entero positivo
      if (!cantidad) mostrarError('cantidad', 'La cantidad es obligatoria.');
      else if (!/^\d+$/.test(cantidad) || parseInt(cantidad) <= 0) mostrarError('cantidad', 'Debe ser un número entero positivo.');
      // Proveedor: mínimo 3 caracteres
      if (!proveedor) mostrarError('proveedor', 'El proveedor es obligatorio.');
      else if (proveedor.length < 3) mostrarError('proveedor', 'Mínimo 3 caracteres.');
      // Precio: mayor a 0, máximo dos decimales
      if (!precio) mostrarError('precio', 'El precio es obligatorio.');
      else if (isNaN(precio) || parseFloat(precio) <= 0) mostrarError('precio', 'Debe ser mayor a 0.');
      else if (!/^\d+(\.\d{1,2})?$/.test(precio)) mostrarError('precio', 'Máximo dos decimales.');
      if (!valido) return;
      const data = Object.fromEntries(new FormData(this));
      inventario.push({
        id: inventario.length+1,
        ...data
      });
      modal.style.display = 'none';
      inventarioView();
    };
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