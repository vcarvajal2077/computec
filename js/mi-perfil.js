/**
 * Mi Perfil - Gestión de información personal
 */

const API_URL = 'api/perfil.php';
let usuarioActual = null;

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    cargarPerfil();
    
    // Detectar si viene desde "Configuración" por URL params
    const urlParams = new URLSearchParams(window.location.search);
    const origen = urlParams.get('from');
    
    if (origen === 'configuracion') {
        document.getElementById('pageHeader').innerHTML = '<i class="fas fa-cog"></i> Configuración';
        document.title = 'Configuración - Computec';
    }
});

function verificarSesion() {
    const userData = JSON.parse(localStorage.getItem('usuario_logueado') || 'null');
    
    if (!userData || !userData.loggedIn) {
        alert('Debes iniciar sesión para acceder');
        window.location.href = 'index.html';
        return;
    }
    
    usuarioActual = userData;
}

async function cargarPerfil() {
    if (!usuarioActual) return;
    
    try {
        const response = await fetch(`${API_URL}?action=obtener`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id_usuario: usuarioActual.id_usuario })
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarDatosPerfil(data.data);
        } else {
            mostrarAlerta('alertPersonal', 'error', data.message || 'Error al cargar perfil');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('alertPersonal', 'error', 'Error de conexión');
    }
}

function mostrarDatosPerfil(datos) {
    // Avatar con iniciales
    const iniciales = (datos.nombre[0] || '') + (datos.apellido[0] || '');
    document.getElementById('profileAvatar').textContent = iniciales;
    
    // Información principal
    document.getElementById('profileName').textContent = `${datos.nombre} ${datos.apellido}`;
    document.getElementById('profileRole').textContent = datos.nombre_tipo;
    document.getElementById('profileEmail').textContent = datos.email;
    document.getElementById('profilePhone').textContent = datos.telefono || 'No especificado';
    document.getElementById('profileId').textContent = datos.id_usuario;
    
    // Fecha de registro
    const fecha = new Date(datos.fecha_registro);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('profileDate').textContent = `Miembro desde ${fecha.toLocaleDateString('es-ES', opciones)}`;
    
    // Formulario de edición
    document.getElementById('nombre').value = datos.nombre;
    document.getElementById('apellido').value = datos.apellido;
    document.getElementById('email').value = datos.email;
    document.getElementById('telefono').value = datos.telefono || '';
    document.getElementById('tipoUsuario').value = datos.nombre_tipo;
}

async function actualizarInformacion(event) {
    event.preventDefault();
    
    if (!usuarioActual) return;
    
    const formData = {
        id_usuario: usuarioActual.id_usuario,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value
    };
    
    try {
        const response = await fetch(`${API_URL}?action=actualizar`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarAlerta('alertPersonal', 'success', '✅ Información actualizada correctamente');
            
            // Actualizar localStorage
            usuarioActual.nombre = formData.nombre;
            usuarioActual.apellido = formData.apellido;
            usuarioActual.email = formData.email;
            localStorage.setItem('usuario_logueado', JSON.stringify(usuarioActual));
            
            // Recargar perfil
            setTimeout(() => {
                cargarPerfil();
            }, 1500);
        } else {
            mostrarAlerta('alertPersonal', 'error', '❌ ' + (data.message || 'Error al actualizar'));
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('alertPersonal', 'error', '❌ Error de conexión');
    }
}

async function cambiarContrasena(event) {
    event.preventDefault();
    
    if (!usuarioActual) return;
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
        mostrarAlerta('alertPassword', 'error', '❌ Las contraseñas no coinciden');
        return;
    }
    
    // Validar longitud
    if (newPassword.length < 6) {
        mostrarAlerta('alertPassword', 'error', '❌ La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    const formData = {
        id_usuario: usuarioActual.id_usuario,
        current_password: currentPassword,
        new_password: newPassword
    };
    
    try {
        const response = await fetch(`${API_URL}?action=cambiar_contrasena`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarAlerta('alertPassword', 'success', '✅ Contraseña cambiada correctamente');
            document.getElementById('formPassword').reset();
        } else {
            mostrarAlerta('alertPassword', 'error', '❌ ' + (data.message || 'Error al cambiar contraseña'));
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('alertPassword', 'error', '❌ Error de conexión');
    }
}

function mostrarAlerta(elementId, tipo, mensaje) {
    const alert = document.getElementById(elementId);
    alert.className = `alert alert-${tipo === 'success' ? 'success' : 'error'} show`;
    alert.textContent = mensaje;
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
}
