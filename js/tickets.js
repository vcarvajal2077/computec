const API_URL = 'api/tickets.php';
let tickets = [];
let ticketActual = null;

document.addEventListener('DOMContentLoaded', () => { verificarPermisos(); cargarDatos(); });

function verificarPermisos() {
    const userData = JSON.parse(localStorage.getItem('usuario_logueado') || 'null');
    if (!userData || !userData.loggedIn) { alert('Debes iniciar sesión'); window.location.href = 'index.html'; }
}

async function cargarDatos() {
    await Promise.all([cargarTickets(), cargarEstadisticas(), cargarClientes(), cargarTecnicos()]);
}

async function cargarTickets() {
    const response = await fetch(`${API_URL}?action=listar`);
    const data = await response.json();
    if (data.success) { tickets = data.data; renderizarTabla(); }
}

async function cargarEstadisticas() {
    const response = await fetch(`${API_URL}?action=estadisticas`);
    const data = await response.json();
    if (data.success) {
        document.getElementById('statAbiertos').textContent = data.data.abiertos;
        document.getElementById('statProceso').textContent = data.data.proceso;
        document.getElementById('statResueltos').textContent = data.data.resueltos;
    }
}

async function cargarClientes() {
    const response = await fetch('api/agenda.php?action=obtener_clientes');
    const data = await response.json();
    if (data.success) {
        const select = document.getElementById('id_cliente');
        select.innerHTML = '<option value="">Seleccione...</option>' + data.data.map(c => `<option value="${c.id_cliente}">${c.nombre}</option>`).join('');
    }
}

async function cargarTecnicos() {
    const response = await fetch('api/agenda.php?action=obtener_tecnicos');
    const data = await response.json();
    if (data.success) {
        const select = document.getElementById('id_asignado');
        select.innerHTML = '<option value="">Sin asignar</option>' + data.data.map(t => `<option value="${t.id_usuario}">${t.nombre}</option>`).join('');
    }
}

function renderizarTabla() {
    const tbody = document.getElementById('ticketsTable');
    tbody.innerHTML = tickets.length ? tickets.map(t => `<tr>
        <td>#${t.id_ticket}</td>
        <td>${t.cliente || 'N/A'}</td>
        <td>${t.asunto}</td>
        <td><span class="badge badge-${t.prioridad}">${t.prioridad}</span></td>
        <td><span class="badge badge-${t.estado}">${t.estado.replace('_', ' ')}</span></td>
        <td>${formatFecha(t.fecha_creacion)}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="verTicket(${t.id_ticket})"><i class="fas fa-eye"></i></button>
            <button class="btn btn-secondary btn-sm" onclick="eliminarTicket(${t.id_ticket})"><i class="fas fa-trash"></i></button>
        </td>
    </tr>`).join('') : '<tr><td colspan="7" style="text-align: center;">No hay tickets</td></tr>';
}

function aplicarFiltros() {
    const estado = document.getElementById('filterEstado').value;
    const prioridad = document.getElementById('filterPrioridad').value;
    let filtrados = tickets;
    if (estado) filtrados = filtrados.filter(t => t.estado === estado);
    if (prioridad) filtrados = filtrados.filter(t => t.prioridad === prioridad);
    
    const tbody = document.getElementById('ticketsTable');
    tbody.innerHTML = filtrados.map(t => `<tr>
        <td>#${t.id_ticket}</td>
        <td>${t.cliente || 'N/A'}</td>
        <td>${t.asunto}</td>
        <td><span class="badge badge-${t.prioridad}">${t.prioridad}</span></td>
        <td><span class="badge badge-${t.estado}">${t.estado.replace('_', ' ')}</span></td>
        <td>${formatFecha(t.fecha_creacion)}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="verTicket(${t.id_ticket})"><i class="fas fa-eye"></i></button>
            <button class="btn btn-secondary btn-sm" onclick="eliminarTicket(${t.id_ticket})"><i class="fas fa-trash"></i></button>
        </td>
    </tr>`).join('');
}

function abrirModalNuevo() {
    document.getElementById('modalTitle').textContent = 'Nuevo Ticket';
    document.getElementById('formTicket').reset();
    document.getElementById('ticketId').value = '';
    document.getElementById('comentariosSection').style.display = 'none';
    document.getElementById('modalTicket').classList.add('active');
}

async function verTicket(id) {
    const t = tickets.find(x => x.id_ticket == id);
    if (!t) return;
    ticketActual = id;
    
    document.getElementById('modalTitle').textContent = `Ticket #${id}`;
    document.getElementById('ticketId').value = t.id_ticket;
    document.getElementById('id_cliente').value = t.id_cliente;
    document.getElementById('asunto').value = t.asunto;
    document.getElementById('descripcion').value = t.descripcion;
    document.getElementById('prioridad').value = t.prioridad;
    document.getElementById('id_asignado').value = t.id_asignado || '';
    
    document.getElementById('comentariosSection').style.display = 'block';
    await cargarComentarios(id);
    document.getElementById('modalTicket').classList.add('active');
}

async function cargarComentarios(id) {
    const response = await fetch(`${API_URL}?action=obtener_comentarios`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id_ticket: id })
    });
    const data = await response.json();
    if (data.success) {
        const html = data.data.map(c => `<div class="comentario">
            <strong>${c.usuario}</strong> - <small>${formatFecha(c.fecha_creacion)}</small><br>
            ${c.comentario}
        </div>`).join('');
        document.getElementById('comentariosList').innerHTML = html || '<p style="text-align: center; color: #6b7280;">No hay comentarios</p>';
    }
}

async function agregarComentario() {
    const comentario = document.getElementById('nuevoComentario').value;
    if (!comentario) return;
    
    const response = await fetch(`${API_URL}?action=agregar_comentario`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id_ticket: ticketActual, comentario })
    });
    
    const data = await response.json();
    if (data.success) {
        document.getElementById('nuevoComentario').value = '';
        cargarComentarios(ticketActual);
    }
}

async function guardarTicket(event) {
    event.preventDefault();
    const id = document.getElementById('ticketId').value;
    const formData = {
        id_cliente: document.getElementById('id_cliente').value,
        asunto: document.getElementById('asunto').value,
        descripcion: document.getElementById('descripcion').value,
        prioridad: document.getElementById('prioridad').value,
        id_asignado: document.getElementById('id_asignado').value || null
    };
    if (id) { formData.id_ticket = id; formData.estado = 'en_proceso'; }
    
    const response = await fetch(`${API_URL}?action=${id ? 'actualizar' : 'crear'}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    if (data.success) { alert('✅ ' + data.message); cerrarModal(); cargarDatos(); } else { alert('❌ ' + data.message); }
}

async function eliminarTicket(id) {
    if (!confirm('¿Eliminar este ticket?')) return;
    const response = await fetch(`${API_URL}?action=eliminar`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id_ticket: id })
    });
    const data = await response.json();
    if (data.success) { alert('✅ Ticket eliminado'); cargarDatos(); }
}

function cerrarModal() { document.getElementById('modalTicket').classList.remove('active'); }

function formatFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

document.getElementById('modalTicket').addEventListener('click', function(e) { if (e.target === this) cerrarModal(); });
