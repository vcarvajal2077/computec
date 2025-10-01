/**
 * Gestión de Clientes - CRUD Completo
 * Accesible para Admin y Gestor de Tienda
 */

const API_URL = 'api/clientes-crud.php';
let clientes = [];
let clienteEditando = null;

// Verificar permisos al cargar
document.addEventListener('DOMContentLoaded', function() {
    verificarPermisos();
    cargarClientes();
});

function verificarPermisos() {
    const userData = JSON.parse(localStorage.getItem('usuario_logueado') || 'null');
    
    if (!userData || !userData.loggedIn) {
        alert('Debes iniciar sesión para acceder');
        window.location.href = 'index.html';
        return;
    }
    
    // Permitir acceso a Admin (1) y Gestor de Tienda (2)
    const tipoUsuario = parseInt(userData.id_tipo_usuario);
    const esAdmin = userData.rol === 'Administrador' || tipoUsuario === 1;
    const esGestor = userData.rol === 'Gestor de Tienda' || tipoUsuario === 2;
    
    if (!esAdmin && !esGestor) {
        alert('No tienes permisos para acceder a esta sección');
        window.location.href = 'panel.html';
        return;
    }
}

async function cargarClientes() {
    try {
        const response = await fetch(`${API_URL}?action=listar`);
        const data = await response.json();
        
        if (data.success) {
            clientes = data.data;
            renderizarTabla();
        } else {
            mostrarError('Error al cargar clientes');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión');
    }
}

function renderizarTabla() {
    const tbody = document.getElementById('clientesTableBody');
    
    if (clientes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem;">
                    No hay clientes registrados
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = clientes.map(cliente => `
        <tr>
            <td>${cliente.id_cliente}</td>
            <td>${cliente.nombre} ${cliente.apellido || ''}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.documento || '-'}</td>
            <td><span class="badge badge-${cliente.activo == 1 ? 'activo' : 'inactivo'}">${cliente.activo == 1 ? 'Activo' : 'Inactivo'}</span></td>
            <td>${formatearFecha(cliente.fecha_registro)}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="verDetalles(${cliente.id_cliente})" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-primary btn-sm" onclick="editarCliente(${cliente.id_cliente})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${cliente.id_cliente})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function buscarClientes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderizarTabla();
        return;
    }
    
    const clientesFiltrados = clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(searchTerm) ||
        (cliente.apellido && cliente.apellido.toLowerCase().includes(searchTerm)) ||
        cliente.email.toLowerCase().includes(searchTerm) ||
        cliente.telefono.includes(searchTerm) ||
        (cliente.documento && cliente.documento.toLowerCase().includes(searchTerm))
    );
    
    const tbody = document.getElementById('clientesTableBody');
    
    if (clientesFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem;">
                    No se encontraron resultados
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = clientesFiltrados.map(cliente => `
        <tr>
            <td>${cliente.id_cliente}</td>
            <td>${cliente.nombre} ${cliente.apellido || ''}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.documento || '-'}</td>
            <td><span class="badge badge-${cliente.activo == 1 ? 'activo' : 'inactivo'}">${cliente.activo == 1 ? 'Activo' : 'Inactivo'}</span></td>
            <td>${formatearFecha(cliente.fecha_registro)}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="verDetalles(${cliente.id_cliente})"><i class="fas fa-eye"></i></button>
                <button class="btn btn-primary btn-sm" onclick="editarCliente(${cliente.id_cliente})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${cliente.id_cliente})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function abrirModalNuevo() {
    clienteEditando = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Cliente';
    document.getElementById('formCliente').reset();
    document.getElementById('clienteId').value = '';
    document.getElementById('modalCliente').classList.add('active');
}

function editarCliente(id) {
    clienteEditando = clientes.find(c => c.id_cliente == id);
    
    if (!clienteEditando) return;
    
    document.getElementById('modalTitle').textContent = 'Editar Cliente';
    document.getElementById('clienteId').value = clienteEditando.id_cliente;
    document.getElementById('nombre').value = clienteEditando.nombre;
    document.getElementById('apellido').value = clienteEditando.apellido || '';
    document.getElementById('email').value = clienteEditando.email;
    document.getElementById('telefono').value = clienteEditando.telefono;
    document.getElementById('documento').value = clienteEditando.documento || '';
    document.getElementById('direccion').value = clienteEditando.direccion || '';
    document.getElementById('notas').value = clienteEditando.notas || '';
    document.getElementById('activo').value = clienteEditando.activo;
    
    document.getElementById('modalCliente').classList.add('active');
}

function verDetalles(id) {
    const cliente = clientes.find(c => c.id_cliente == id);
    
    if (!cliente) return;
    
    const detalles = `
        📋 INFORMACIÓN DEL CLIENTE
        
        ID: ${cliente.id_cliente}
        Nombre: ${cliente.nombre} ${cliente.apellido || ''}
        Email: ${cliente.email}
        Teléfono: ${cliente.telefono}
        Documento: ${cliente.documento || 'No especificado'}
        Dirección: ${cliente.direccion || 'No especificada'}
        Estado: ${cliente.activo == 1 ? 'Activo' : 'Inactivo'}
        Fecha de registro: ${formatearFecha(cliente.fecha_registro)}
        
        Notas:
        ${cliente.notas || 'Sin notas'}
    `;
    
    alert(detalles);
}

async function guardarCliente(event) {
    event.preventDefault();
    
    const clienteId = document.getElementById('clienteId').value;
    const formData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        documento: document.getElementById('documento').value,
        direccion: document.getElementById('direccion').value,
        notas: document.getElementById('notas').value,
        activo: document.getElementById('activo').value
    };
    
    try {
        const action = clienteId ? 'actualizar' : 'crear';
        if (clienteId) {
            formData.id_cliente = clienteId;
        }
        
        const response = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ ' + (clienteId ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente'));
            cerrarModal();
            cargarClientes();
        } else {
            alert('❌ ' + (data.message || 'Error al guardar cliente'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión');
    }
}

async function eliminarCliente(id) {
    if (!confirm('¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}?action=eliminar`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id_cliente: id })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Cliente eliminado correctamente');
            cargarClientes();
        } else {
            alert('❌ ' + (data.message || 'Error al eliminar cliente'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión');
    }
}

function cerrarModal() {
    document.getElementById('modalCliente').classList.remove('active');
    document.getElementById('formCliente').reset();
}

function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function mostrarError(mensaje) {
    alert('❌ ' + mensaje);
}

// Cerrar modal al hacer clic fuera
document.getElementById('modalCliente').addEventListener('click', function(e) {
    if (e.target === this) {
        cerrarModal();
    }
});

// Buscar al presionar Enter
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarClientes();
    }
});
