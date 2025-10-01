/**
 * Gestión de Módulos - CRUD Completo
 * Solo accesible para Administradores
 */

const API_URL = 'api/modulos-crud.php';
let modulos = [];
let moduloEditando = null;
let moduloAsignando = null;

// Verificar permisos al cargar
document.addEventListener('DOMContentLoaded', function() {
    verificarPermisos();
    cargarModulos();
});

function verificarPermisos() {
    const userData = JSON.parse(localStorage.getItem('usuario_logueado') || 'null');
    
    console.log('Verificando permisos. Usuario:', userData);
    
    if (!userData || !userData.loggedIn) {
        alert('Debes iniciar sesión para acceder');
        window.location.href = 'index.html';
        return;
    }
    
    // Verificar si es Administrador por rol o por id_tipo_usuario
    const esAdmin = userData.rol === 'Administrador' || 
                    userData.id_tipo_usuario === 1 || 
                    parseInt(userData.id_tipo_usuario) === 1;
    
    if (!esAdmin) {
        alert('No tienes permisos para acceder a esta sección. Solo Administradores.');
        window.location.href = 'panel.html';
        return;
    }
    
    console.log('Permisos verificados correctamente');
}

async function cargarModulos() {
    try {
        const response = await fetch(`${API_URL}?action=listar`);
        const data = await response.json();
        
        if (data.success) {
            modulos = data.data;
            renderizarTabla();
        } else {
            mostrarError('Error al cargar módulos');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión');
    }
}

function renderizarTabla() {
    const tbody = document.getElementById('modulosTableBody');
    
    if (modulos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem;">
                    No hay módulos registrados
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = modulos.map(modulo => `
        <tr>
            <td>${modulo.id_modulo}</td>
            <td>
                <div class="icon-cell">
                    <i class="${modulo.icono}"></i>
                </div>
            </td>
            <td><strong>${modulo.nombre_modulo}</strong></td>
            <td>${modulo.descripcion || '-'}</td>
            <td><code>${modulo.url}</code></td>
            <td>${modulo.orden}</td>
            <td><span class="badge badge-${modulo.activo == 1 ? 'activo' : 'inactivo'}">${modulo.activo == 1 ? 'Activo' : 'Inactivo'}</span></td>
            <td>${modulo.usuarios_asignados || 0} usuarios</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="abrirModalAsignar(${modulo.id_modulo})" title="Asignar">
                    <i class="fas fa-user-plus"></i>
                </button>
                <button class="btn btn-primary btn-sm" onclick="editarModulo(${modulo.id_modulo})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarModulo(${modulo.id_modulo})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function buscarModulos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderizarTabla();
        return;
    }
    
    const modulosFiltrados = modulos.filter(modulo => 
        modulo.nombre_modulo.toLowerCase().includes(searchTerm) ||
        (modulo.descripcion && modulo.descripcion.toLowerCase().includes(searchTerm)) ||
        (modulo.url && modulo.url.toLowerCase().includes(searchTerm))
    );
    
    const tbody = document.getElementById('modulosTableBody');
    
    if (modulosFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem;">
                    No se encontraron resultados
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = modulosFiltrados.map(modulo => `
        <tr>
            <td>${modulo.id_modulo}</td>
            <td>
                <div class="icon-cell">
                    <i class="${modulo.icono}"></i>
                </div>
            </td>
            <td><strong>${modulo.nombre_modulo}</strong></td>
            <td>${modulo.descripcion || '-'}</td>
            <td><code>${modulo.url}</code></td>
            <td>${modulo.orden}</td>
            <td><span class="badge badge-${modulo.activo == 1 ? 'activo' : 'inactivo'}">${modulo.activo == 1 ? 'Activo' : 'Inactivo'}</span></td>
            <td>${modulo.usuarios_asignados || 0} usuarios</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="abrirModalAsignar(${modulo.id_modulo})">
                    <i class="fas fa-user-plus"></i>
                </button>
                <button class="btn btn-primary btn-sm" onclick="editarModulo(${modulo.id_modulo})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarModulo(${modulo.id_modulo})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function abrirModalNuevo() {
    moduloEditando = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Módulo';
    document.getElementById('formModulo').reset();
    document.getElementById('moduloId').value = '';
    document.getElementById('modalModulo').classList.add('active');
    actualizarIconoPreview();
}

function editarModulo(id) {
    moduloEditando = modulos.find(m => m.id_modulo == id);
    
    if (!moduloEditando) return;
    
    document.getElementById('modalTitle').textContent = 'Editar Módulo';
    document.getElementById('moduloId').value = moduloEditando.id_modulo;
    document.getElementById('nombre_modulo').value = moduloEditando.nombre_modulo;
    document.getElementById('descripcion').value = moduloEditando.descripcion || '';
    document.getElementById('url').value = moduloEditando.url || '';
    document.getElementById('icono').value = moduloEditando.icono || '';
    document.getElementById('orden').value = moduloEditando.orden;
    document.getElementById('activo').value = moduloEditando.activo;
    
    actualizarIconoPreview();
    document.getElementById('modalModulo').classList.add('active');
}

async function guardarModulo(event) {
    event.preventDefault();
    
    const moduloId = document.getElementById('moduloId').value;
    const formData = {
        nombre_modulo: document.getElementById('nombre_modulo').value,
        descripcion: document.getElementById('descripcion').value,
        url: document.getElementById('url').value,
        icono: document.getElementById('icono').value,
        orden: document.getElementById('orden').value,
        activo: document.getElementById('activo').value
    };
    
    try {
        const action = moduloId ? 'actualizar' : 'crear';
        if (moduloId) {
            formData.id_modulo = moduloId;
        }
        
        const response = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarExito(moduloId ? 'Módulo actualizado correctamente' : 'Módulo creado correctamente');
            cerrarModal();
            cargarModulos();
        } else {
            mostrarError(data.message || 'Error al guardar módulo');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión');
    }
}

async function eliminarModulo(id) {
    if (!confirm('¿Estás seguro de eliminar este módulo? Se eliminarán todas las asignaciones.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}?action=eliminar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_modulo: id })
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarExito('Módulo eliminado correctamente');
            cargarModulos();
        } else {
            mostrarError(data.message || 'Error al eliminar módulo');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión');
    }
}

async function abrirModalAsignar(id) {
    moduloAsignando = modulos.find(m => m.id_modulo == id);
    
    if (!moduloAsignando) return;
    
    document.getElementById('moduloAsignarNombre').textContent = moduloAsignando.nombre_modulo;
    
    // Cargar tipos de usuario
    await cargarTiposUsuario(id);
    
    // Cargar usuarios
    await cargarUsuarios(id);
    
    document.getElementById('modalAsignar').classList.add('active');
}

async function cargarTiposUsuario(idModulo) {
    try {
        const response = await fetch(`${API_URL}?action=tipos_usuario_asignaciones&id_modulo=${idModulo}`);
        const data = await response.json();
        
        if (data.success) {
            const container = document.getElementById('tiposUsuarioList');
            container.innerHTML = data.data.map(tipo => `
                <div class="checkbox-item">
                    <input type="checkbox" id="tipo_${tipo.id_tipo_usuario}" 
                           value="${tipo.id_tipo_usuario}" 
                           ${tipo.tiene_modulo ? 'checked' : ''}
                           onchange="toggleTipoUsuario(${tipo.id_tipo_usuario}, this.checked)">
                    <label for="tipo_${tipo.id_tipo_usuario}">${tipo.nombre_tipo} (${tipo.usuarios_count} usuarios)</label>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarUsuarios(idModulo) {
    try {
        const response = await fetch(`${API_URL}?action=usuarios_asignaciones&id_modulo=${idModulo}`);
        const data = await response.json();
        
        if (data.success) {
            const container = document.getElementById('usuariosList');
            container.innerHTML = data.data.map(usuario => `
                <div class="checkbox-item">
                    <input type="checkbox" id="usuario_${usuario.id_usuario}" 
                           value="${usuario.id_usuario}" 
                           ${usuario.tiene_modulo ? 'checked' : ''}>
                    <label for="usuario_${usuario.id_usuario}">${usuario.nombre} ${usuario.apellido} (${usuario.nombre_tipo})</label>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function toggleTipoUsuario(idTipoUsuario, asignar) {
    if (!moduloAsignando) return;
    
    try {
        const action = asignar ? 'asignar_tipo' : 'desasignar_tipo';
        const response = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_modulo: moduloAsignando.id_modulo,
                id_tipo_usuario: idTipoUsuario
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Recargar usuarios para reflejar cambios
            await cargarUsuarios(moduloAsignando.id_modulo);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function guardarAsignaciones() {
    if (!moduloAsignando) return;
    
    const checkboxes = document.querySelectorAll('#usuariosList input[type="checkbox"]');
    const usuariosAsignados = [];
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            usuariosAsignados.push(parseInt(checkbox.value));
        }
    });
    
    try {
        const response = await fetch(`${API_URL}?action=asignar_usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_modulo: moduloAsignando.id_modulo,
                usuarios: usuariosAsignados
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarExito('Asignaciones guardadas correctamente');
            cerrarModalAsignar();
            cargarModulos();
        } else {
            mostrarError(data.message || 'Error al guardar asignaciones');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión');
    }
}

function cerrarModal() {
    document.getElementById('modalModulo').classList.remove('active');
    document.getElementById('formModulo').reset();
}

function cerrarModalAsignar() {
    document.getElementById('modalAsignar').classList.remove('active');
    moduloAsignando = null;
}

function actualizarIconoPreview() {
    const iconoInput = document.getElementById('icono');
    const preview = document.getElementById('iconPreview');
    
    if (iconoInput && preview) {
        const iconClass = iconoInput.value || 'fas fa-star';
        preview.innerHTML = `<i class="${iconClass}"></i>`;
    }
}

function mostrarExito(mensaje) {
    alert('✅ ' + mensaje);
}

function mostrarError(mensaje) {
    alert('❌ ' + mensaje);
}

// Cerrar modales al hacer clic fuera
document.getElementById('modalModulo').addEventListener('click', function(e) {
    if (e.target === this) {
        cerrarModal();
    }
});

document.getElementById('modalAsignar').addEventListener('click', function(e) {
    if (e.target === this) {
        cerrarModalAsignar();
    }
});

// Buscar al presionar Enter
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarModulos();
    }
});
