const API_URL = 'api/agenda.php';
let citas = [];
let fechaActual = new Date();

document.addEventListener('DOMContentLoaded', () => { verificarPermisos(); cargarDatos(); renderizarCalendario(); });

function verificarPermisos() {
    const userData = JSON.parse(localStorage.getItem('usuario_logueado') || 'null');
    if (!userData || !userData.loggedIn) { alert('Debes iniciar sesión'); window.location.href = 'index.html'; }
}

async function cargarDatos() {
    await Promise.all([cargarCitas(), cargarClientes(), cargarTecnicos(), cargarServicios()]);
}

async function cargarCitas() {
    const response = await fetch(`${API_URL}?action=listar`);
    const data = await response.json();
    if (data.success) { citas = data.data; renderizarCalendario(); renderizarListaCitas(); }
}

async function cargarClientes() {
    const response = await fetch(`${API_URL}?action=obtener_clientes`);
    const data = await response.json();
    if (data.success) {
        const select = document.getElementById('id_cliente');
        select.innerHTML = '<option value="">Seleccione...</option>' + data.data.map(c => `<option value="${c.id_cliente}">${c.nombre}</option>`).join('');
    }
}

async function cargarTecnicos() {
    const response = await fetch(`${API_URL}?action=obtener_tecnicos`);
    const data = await response.json();
    if (data.success) {
        const select = document.getElementById('id_tecnico');
        select.innerHTML = '<option value="">Sin asignar</option>' + data.data.map(t => `<option value="${t.id_usuario}">${t.nombre}</option>`).join('');
    }
}

async function cargarServicios() {
    const response = await fetch('api/servicios-crud.php?action=listar');
    const data = await response.json();
    if (data.success) {
        const select = document.getElementById('id_servicio');
        select.innerHTML = '<option value="">Seleccione...</option>' + data.data.map(s => `<option value="${s.id_servicio}">${s.tipo_servicio}</option>`).join('');
    }
}

function renderizarCalendario() {
    const year = fechaActual.getFullYear();
    const month = fechaActual.getMonth();
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    document.getElementById('mesActual').textContent = `${meses[month]} ${year}`;
    
    const primerDia = new Date(year, month, 1).getDay();
    const ultimoDia = new Date(year, month + 1, 0).getDate();
    const hoy = new Date();
    
    let html = '';
    let dia = 1;
    
    for (let i = 0; i < 42; i++) {
        if (i < primerDia || dia > ultimoDia) {
            html += '<div class="calendar-day other-month"></div>';
        } else {
            const fecha = `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            const esHoy = dia === hoy.getDate() && month === hoy.getMonth() && year === hoy.getFullYear();
            const citasDelDia = citas.filter(c => c.fecha === fecha);
            
            html += `<div class="calendar-day ${esHoy ? 'today' : ''}" onclick="seleccionarDia('${fecha}')">
                <div class="day-number">${dia}</div>
                ${citasDelDia.map(c => `<div class="cita-item" onclick="event.stopPropagation(); editarCita(${c.id_cita})">${c.hora} - ${c.cliente}</div>`).join('')}
            </div>`;
            dia++;
        }
    }
    
    document.getElementById('calendarDays').innerHTML = html;
}

function renderizarListaCitas() {
    const hoy = new Date().toISOString().split('T')[0];
    const proximasCitas = citas.filter(c => c.fecha >= hoy && c.estado !== 'cancelada').slice(0, 10);
    
    const html = proximasCitas.length ? proximasCitas.map(c => `
        <div class="cita-card">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <strong>${c.cliente}</strong> - ${c.tipo_servicio || 'Servicio'}<br>
                    <small>${formatFecha(c.fecha)} a las ${c.hora}</small><br>
                    <span class="badge badge-${c.estado}">${c.estado}</span>
                </div>
                <div>
                    <button class="btn btn-primary btn-sm" onclick="editarCita(${c.id_cita})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-secondary btn-sm" onclick="eliminarCita(${c.id_cita})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `).join('') : '<p style="text-align: center; color: #6b7280;">No hay citas próximas</p>';
    
    document.getElementById('citasList').innerHTML = html;
}

function abrirModalNuevaCita() {
    document.getElementById('modalTitle').textContent = 'Nueva Cita';
    document.getElementById('formCita').reset();
    document.getElementById('citaId').value = '';
    document.getElementById('modalCita').classList.add('active');
}

function seleccionarDia(fecha) {
    abrirModalNuevaCita();
    document.getElementById('fecha').value = fecha;
}

function editarCita(id) {
    const c = citas.find(x => x.id_cita == id);
    if (!c) return;
    document.getElementById('modalTitle').textContent = 'Editar Cita';
    document.getElementById('citaId').value = c.id_cita;
    document.getElementById('id_cliente').value = c.id_cliente;
    document.getElementById('id_servicio').value = c.id_servicio;
    document.getElementById('id_tecnico').value = c.id_tecnico || '';
    document.getElementById('fecha').value = c.fecha;
    document.getElementById('hora').value = c.hora;
    document.getElementById('duracion').value = c.duracion || 60;
    document.getElementById('notas').value = c.notas || '';
    document.getElementById('estado').value = c.estado;
    document.getElementById('modalCita').classList.add('active');
}

async function guardarCita(event) {
    event.preventDefault();
    const id = document.getElementById('citaId').value;
    const formData = {
        id_cliente: document.getElementById('id_cliente').value,
        id_servicio: document.getElementById('id_servicio').value,
        id_tecnico: document.getElementById('id_tecnico').value || null,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        duracion: document.getElementById('duracion').value,
        notas: document.getElementById('notas').value,
        estado: document.getElementById('estado').value
    };
    if (id) formData.id_cita = id;
    
    const response = await fetch(`${API_URL}?action=${id ? 'actualizar' : 'crear'}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    if (data.success) { alert('✅ ' + data.message); cerrarModal(); cargarCitas(); } else { alert('❌ ' + data.message); }
}

async function eliminarCita(id) {
    if (!confirm('¿Eliminar esta cita?')) return;
    const response = await fetch(`${API_URL}?action=eliminar`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id_cita: id })
    });
    const data = await response.json();
    if (data.success) { alert('✅ Cita eliminada'); cargarCitas(); }
}

function cerrarModal() { document.getElementById('modalCita').classList.remove('active'); }
function mesAnterior() { fechaActual.setMonth(fechaActual.getMonth() - 1); renderizarCalendario(); }
function mesSiguiente() { fechaActual.setMonth(fechaActual.getMonth() + 1); renderizarCalendario(); }
function hoy() { fechaActual = new Date(); renderizarCalendario(); }

function formatFecha(fecha) {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

document.getElementById('modalCita').addEventListener('click', function(e) { if (e.target === this) cerrarModal(); });
