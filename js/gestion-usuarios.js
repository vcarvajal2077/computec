/**
 * Gestión de Usuarios - CRUD Completo
 * Solo accesible para Administradores
 */

const API_URL = 'api/usuarios-crud.php';
let usuarios = [];
let usuarioEditando = null;

// Verificar permisos al cargar
document.addEventListener('DOMContentLoaded', function() {
    verificarPermisos();
    cargarUsuarios();
});

function verificarPermisos() {
    const userData = JSON.parse(localStorage.getItem('usuario_logueado') || 'null');
    
    console.log('=== VERIFICACIÓN DE PERMISOS ===');
    console.log('Usuario completo:', userData);
    console.log('Rol:', userData?.rol);
    console.log('id_tipo_usuario:', userData?.id_tipo_usuario);
    
    if (!userData || !userData.loggedIn) {
        console.log('❌ No hay sesión activa');
        alert('Debes iniciar sesión para acceder');
        window.location.href = 'index.html';
        return;
    }
    
    // Verificar si es Administrador por rol o por id_tipo_usuario
    const esAdminPorRol = userData.rol === 'Administrador';
    const esAdminPorId = userData.id_tipo_usuario === 1 || parseInt(userData.id_tipo_usuario) === 1;
    
    console.log('Es Admin por rol?', esAdminPorRol);
    console.log('Es Admin por ID?', esAdminPorId);
    
    const esAdmin = esAdminPorRol || esAdminPorId;
    
    console.log('Resultado final - Es Admin?', esAdmin);
    
    if (!esAdmin) {
        console.log('❌ No tiene permisos de administrador');
        alert('No tienes permisos para acceder a esta sección. Solo Administradores.');
        window.location.href = 'panel.html';
        return;
    }
    
    console.log('✅ Permisos verificados correctamente');
}

async function cargarUsuarios() {
    try {
        const response = await fetch(`${API_URL}?action=listar`);
        const data = await response.json();
        
        if (data.success) {
            usuarios = data.data;
            renderizarTabla();
        } else {
            mostrarError('Error al cargar usuarios');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión');
    }
}

function renderizarTabla() {
    const tbody = document.getElementById('usuariosTableBody');
    
    if (usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    No hay usuarios registrados
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = usuarios.map(usuario => `
        <tr>
            <td>${usuario.id_usuario}</td>
            <td>${usuario.nombre} ${usuario.apellido}</td>
            <td>${usuario.email}</td>
            <td><span class="badge badge-${usuario.nombre_tipo.toLowerCase().replace(' ', '-')}">${usuario.nombre_tipo}</span></td>
            <td><span class="badge badge-${usuario.activo == 1 ? 'activo' : 'inactivo'}">${usuario.activo == 1 ? 'Activo' : 'Inactivo'}</span></td>
            <td>${formatearFecha(usuario.fecha_registro)}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editarUsuario(${usuario.id_usuario})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id_usuario})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function buscarUsuarios() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderizarTabla();
        return;
    }
    
    const usuariosFiltrados = usuarios.filter(usuario => 
        usuario.nombre.toLowerCase().includes(searchTerm) ||
        usuario.apellido.toLowerCase().includes(searchTerm) ||
        usuario.email.toLowerCase().includes(searchTerm) ||
        usuario.nombre_tipo.toLowerCase().includes(searchTerm)
    );
    
    const tbody = document.getElementById('usuariosTableBody');
    
    if (usuariosFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    No se encontraron resultados
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = usuariosFiltrados.map(usuario => `
        <tr>
            <td>${usuario.id_usuario}</td>
            <td>${usuario.nombre} ${usuario.apellido}</td>
            <td>${usuario.email}</td>
            <td><span class="badge badge-${usuario.nombre_tipo.toLowerCase().replace(' ', '-')}">${usuario.nombre_tipo}</span></td>
            <td><span class="badge badge-${usuario.activo == 1 ? 'activo' : 'inactivo'}">${usuario.activo == 1 ? 'Activo' : 'Inactivo'}</span></td>
            <td>${formatearFecha(usuario.fecha_registro)}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editarUsuario(${usuario.id_usuario})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id_usuario})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function abrirModalNuevo() {
    usuarioEditando = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Usuario';
    document.getElementById('formUsuario').reset();
    document.getElementById('usuarioId').value = '';
    document.getElementById('passwordHint').style.display = 'none';
    document.getElementById('password').required = true;
    document.getElementById('modalUsuario').classList.add('active');
}

function editarUsuario(id) {
    usuarioEditando = usuarios.find(u => u.id_usuario == id);
    
    if (!usuarioEditando) return;
    
    document.getElementById('modalTitle').textContent = 'Editar Usuario';
    document.getElementById('usuarioId').value = usuarioEditando.id_usuario;
    document.getElementById('nombre').value = usuarioEditando.nombre;
    document.getElementById('apellido').value = usuarioEditando.apellido;
    document.getElementById('email').value = usuarioEditando.email;
    document.getElementById('telefono').value = usuarioEditando.telefono || '';
    document.getElementById('id_tipo_usuario').value = usuarioEditando.id_tipo_usuario;
    document.getElementById('activo').value = usuarioEditando.activo;
    document.getElementById('password').value = '';
    document.getElementById('password').required = false;
    document.getElementById('passwordHint').style.display = 'inline';
    
    document.getElementById('modalUsuario').classList.add('active');
}

async function guardarUsuario(event) {
    event.preventDefault();
    
    const usuarioId = document.getElementById('usuarioId').value;
    const formData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        id_tipo_usuario: document.getElementById('id_tipo_usuario').value,
        activo: document.getElementById('activo').value
    };
    
    const password = document.getElementById('password').value;
    if (password) {
        formData.password = password;
    }
    
    try {
        const action = usuarioId ? 'actualizar' : 'crear';
        if (usuarioId) {
            formData.id_usuario = usuarioId;
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
            mostrarExito(usuarioId ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
            cerrarModal();
            cargarUsuarios();
        } else {
            mostrarError(data.message || 'Error al guardar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión');
    }
}

async function eliminarUsuario(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}?action=eliminar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_usuario: id })
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarExito('Usuario eliminado correctamente');
            cargarUsuarios();
        } else {
            mostrarError(data.message || 'Error al eliminar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión');
    }
}

function cerrarModal() {
    document.getElementById('modalUsuario').classList.remove('active');
    document.getElementById('formUsuario').reset();
}

function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function mostrarExito(mensaje) {
    alert('✅ ' + mensaje);
}

function mostrarError(mensaje) {
    alert('❌ ' + mensaje);
}

// Cerrar modal al hacer clic fuera
document.getElementById('modalUsuario').addEventListener('click', function(e) {
    if (e.target === this) {
        cerrarModal();
    }
});

// Buscar al presionar Enter
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarUsuarios();
    }
});
