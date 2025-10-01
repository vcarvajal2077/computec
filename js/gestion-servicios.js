/**
 * Gestión de Servicios/Reparaciones - CRUD Completo
 */

const API_URL = 'api/servicios-crud.php';
let servicios = [];
let servicioEditando = null;
let clientes = [];
let tecnicos = [];

document.addEventListener('DOMContentLoaded', function() {
    verificarPermisos();
    cargarDatos();
});

function verificarPermisos() {
    const userData = JSON.parse(localStorage.getItem('usuario_logueado') || 'null');
    
    if (!userData || !userData.loggedIn) {
        alert('Debes iniciar sesión');
        window.location.href = 'index.html';
        return;
    }
    
    const tipoUsuario = parseInt(userData.id_tipo_usuario);
    const esAdmin = userData.rol === 'Administrador' || tipoUsuario === 1;
    const esGestor = userData.rol === 'Gestor de Tienda' || tipoUsuario === 2;
    const esTecnico = userData.rol === 'Técnico' || tipoUsuario === 3;
    
    if (!esAdmin && !esGestor && !esTecnico) {
        alert('No tienes permisos');
        window.location.href = 'panel.html';
    }
}

async function cargarDatos() {
    try {
        await Promise.all([
            cargarServicios(),
            cargarClientes(),
            cargarTecnicos()
        ]);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarServicios() {
    try {
        const response = await fetch(`${API_URL}?action=listar`);
        const data = await response.json();
        
        if (data.success) {
            servicios = data.data;
            renderizarTabla();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarClientes() {
    try {
        const response = await fetch(`${API_URL}?action=obtener_clientes`);
        const data = await response.json();
        
        if (data.success) {
            clientes = data.data;
            llenarSelectClientes();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarTecnicos() {
    try {
        const response = await fetch(`${API_URL}?action=obtener_tecnicos`);
        const data = await response.json();
        
        if (data.success) {
            tecnicos = data.data;
            llenarSelectTecnicos();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function llenarSelectClientes() {
    const select = document.getElementById('id_cliente');
    select.innerHTML = '<option value="">Seleccione un cliente...</option>';
    clientes.forEach(c => {
        select.innerHTML += `<option value="${c.id_cliente}">${c.nombre_completo}</option>`;
    });
}

function llenarSelectTecnicos() {
    const selectModal = document.getElementById('id_tecnico');
    const selectFiltro = document.getElementById('filterTecnico');
    
    let options = '<option value="">Sin asignar</option>';
    tecnicos.forEach(t => {
        options += `<option value="${t.id_usuario}">${t.nombre_completo}</option>`;
    });
    
    selectModal.innerHTML = options;
    selectFiltro.innerHTML = '<option value="">Todos los técnicos</option>' + options;
}

function renderizarTabla() {
    const tbody = document.getElementById('serviciosTableBody');
    
    if (servicios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem;">No hay servicios registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = servicios.map(s => {
        const estadoClass = s.estado.toLowerCase().replace(' ', '-');
        return `
            <tr>
                <td>#${s.id_servicio}</td>
                <td>${s.nombre_cliente || 'N/A'}</td>
                <td>${s.tipo_equipo}<br><small style="color: #6b7280;">${s.marca_modelo || ''}</small></td>
                <td>${s.descripcion_problema.substring(0, 50)}${s.descripcion_problema.length > 50 ? '...' : ''}</td>
                <td>${s.nombre_tecnico || '<em>Sin asignar</em>'}</td>
                <td><span class="badge badge-${estadoClass}">${s.estado}</span></td>
                <td>${formatearFecha(s.fecha_registro)}</td>
                <td class="price-display">$${parseFloat(s.costo_estimado || 0).toFixed(2)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editarServicio(${s.id_servicio})" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarServicio(${s.id_servicio})" title="Eliminar"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function buscarServicios() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    
    if (!term) {
        renderizarTabla();
        return;
    }
    
    const filtrados = servicios.filter(s => 
        (s.nombre_cliente && s.nombre_cliente.toLowerCase().includes(term)) ||
        s.tipo_equipo.toLowerCase().includes(term) ||
        s.descripcion_problema.toLowerCase().includes(term) ||
        (s.marca_modelo && s.marca_modelo.toLowerCase().includes(term))
    );
    
    mostrarFiltrados(filtrados);
}

function aplicarFiltros() {
    const estado = document.getElementById('filterEstado').value;
    const tecnico = document.getElementById('filterTecnico').value;
    
    let filtrados = [...servicios];
    
    if (estado) filtrados = filtrados.filter(s => s.estado === estado);
    if (tecnico) filtrados = filtrados.filter(s => s.id_tecnico == tecnico);
    
    mostrarFiltrados(filtrados);
}

function mostrarFiltrados(filtrados) {
    const tbody = document.getElementById('serviciosTableBody');
    
    if (filtrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem;">No se encontraron resultados</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtrados.map(s => {
        const estadoClass = s.estado.toLowerCase().replace(' ', '-');
        return `
            <tr>
                <td>#${s.id_servicio}</td>
                <td>${s.nombre_cliente || 'N/A'}</td>
                <td>${s.tipo_equipo}<br><small style="color: #6b7280;">${s.marca_modelo || ''}</small></td>
                <td>${s.descripcion_problema.substring(0, 50)}${s.descripcion_problema.length > 50 ? '...' : ''}</td>
                <td>${s.nombre_tecnico || '<em>Sin asignar</em>'}</td>
                <td><span class="badge badge-${estadoClass}">${s.estado}</span></td>
                <td>${formatearFecha(s.fecha_registro)}</td>
                <td class="price-display">$${parseFloat(s.costo_estimado || 0).toFixed(2)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editarServicio(${s.id_servicio})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarServicio(${s.id_servicio})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function abrirModalNuevo() {
    servicioEditando = null;
    document.getElementById('modalTitle').textContent = 'Nueva Orden de Servicio';
    document.getElementById('formServicio').reset();
    document.getElementById('servicioId').value = '';
    document.getElementById('modalServicio').classList.add('active');
}

function editarServicio(id) {
    servicioEditando = servicios.find(s => s.id_servicio == id);
    
    if (!servicioEditando) return;
    
    document.getElementById('modalTitle').textContent = 'Editar Servicio';
    document.getElementById('servicioId').value = servicioEditando.id_servicio;
    document.getElementById('id_cliente').value = servicioEditando.id_cliente;
    document.getElementById('id_tecnico').value = servicioEditando.id_tecnico || '';
    document.getElementById('tipo_equipo').value = servicioEditando.tipo_equipo;
    document.getElementById('marca_modelo').value = servicioEditando.marca_modelo || '';
    document.getElementById('descripcion_problema').value = servicioEditando.descripcion_problema;
    document.getElementById('diagnostico').value = servicioEditando.diagnostico || '';
    document.getElementById('costo_estimado').value = servicioEditando.costo_estimado || '';
    document.getElementById('fecha_entrega').value = servicioEditando.fecha_entrega || '';
    document.getElementById('estado').value = servicioEditando.estado;
    document.getElementById('notas').value = servicioEditando.notas || '';
    
    document.getElementById('modalServicio').classList.add('active');
}

async function guardarServicio(event) {
    event.preventDefault();
    
    const servicioId = document.getElementById('servicioId').value;
    const formData = {
        id_cliente: document.getElementById('id_cliente').value,
        id_tecnico: document.getElementById('id_tecnico').value || null,
        tipo_equipo: document.getElementById('tipo_equipo').value,
        marca_modelo: document.getElementById('marca_modelo').value,
        descripcion_problema: document.getElementById('descripcion_problema').value,
        diagnostico: document.getElementById('diagnostico').value,
        costo_estimado: parseFloat(document.getElementById('costo_estimado').value) || 0,
        fecha_entrega: document.getElementById('fecha_entrega').value || null,
        estado: document.getElementById('estado').value,
        notas: document.getElementById('notas').value
    };
    
    try {
        const action = servicioId ? 'actualizar' : 'crear';
        if (servicioId) formData.id_servicio = servicioId;
        
        const response = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ ' + data.message);
            cerrarModal();
            cargarServicios();
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión');
    }
}

async function eliminarServicio(id) {
    if (!confirm('¿Eliminar este servicio?')) return;
    
    try {
        const response = await fetch(`${API_URL}?action=eliminar`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id_servicio: id })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Servicio eliminado');
            cargarServicios();
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión');
    }
}

function cerrarModal() {
    document.getElementById('modalServicio').classList.remove('active');
    document.getElementById('formServicio').reset();
}

function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

document.getElementById('modalServicio').addEventListener('click', function(e) {
    if (e.target === this) cerrarModal();
});

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') buscarServicios();
});
