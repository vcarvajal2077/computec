// Tipos de usuario de ejemplo
const tiposUsuario = [
    { id: 1, nombre: 'Admin', icono: 'fa-user-shield', desc: 'Control total del sistema' },
    { id: 2, nombre: 'Auxiliar', icono: 'fa-user-cog', desc: 'Soporte y asistencia' },
    { id: 4, nombre: 'Técnico PC', icono: 'fa-desktop', desc: 'Especialista en PC' },
    { id: 5, nombre: 'Técnico Accesorios', icono: 'fa-keyboard', desc: 'Especialista en accesorios' }
];

// Usuarios simulados
const usuarios = [
    { id_usuario: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@admin.com', telefono: '123456789', fecha_registro: '2024-06-01', ultimo_acceso: '2024-06-17', activo: true, id_tipo_usuario: 1 },
    { id_usuario: 2, nombre: 'Ana', apellido: 'Gómez', email: 'ana@aux.com', telefono: '987654321', fecha_registro: '2024-06-02', ultimo_acceso: '2024-06-16', activo: true, id_tipo_usuario: 2 },
    { id_usuario: 4, nombre: 'Marta', apellido: 'Ruiz', email: 'marta@pc.com', telefono: '444555666', fecha_registro: '2024-06-04', ultimo_acceso: '2024-06-14', activo: true, id_tipo_usuario: 4 },
    { id_usuario: 5, nombre: 'Carlos', apellido: 'Díaz', email: 'carlos@accesorios.com', telefono: '333222111', fecha_registro: '2024-06-05', ultimo_acceso: '2024-06-13', activo: true, id_tipo_usuario: 5 }
];

// Menú lateral colapsable
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarToggleMain = document.getElementById('sidebarToggleMain');
if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}
if (sidebar && sidebarToggleMain) {
    sidebarToggleMain.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}

// Mostrar tarjetas de tipos de usuario en el main
const btnTiposUsuario = document.getElementById('btn-tipos-usuario');
const mainTitle = document.getElementById('main-title');
const mainContentPlaceholder = document.getElementById('main-content-placeholder');
if (btnTiposUsuario && mainContentPlaceholder && mainTitle) {
    btnTiposUsuario.addEventListener('click', () => {
        mainTitle.textContent = 'Tipos de usuario';
        mainContentPlaceholder.innerHTML = `
            <div class="tipos-usuario-grid">
                ${tiposUsuario.map(tipo => {
                    const cantidad = usuarios.filter(u => u.id_tipo_usuario === tipo.id).length;
                    return `
                    <button class="tipo-usuario-btn-card" data-tipo-id="${tipo.id}">
                        <div class="icono"><i class="fa ${tipo.icono}"></i></div>
                        <div class="info">
                            <div class="titulo">${tipo.nombre}</div>
                            <div class="desc">${tipo.desc}</div>
                        </div>
                        <span class="badge">${cantidad}</span>
                    </button>
                    `;
                }).join('')}
            </div>
        `;
        document.querySelectorAll('.tipo-usuario-btn-card').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tipoId = parseInt(e.currentTarget.getAttribute('data-tipo-id'));
                mostrarUsuariosPorTipo(tipoId);
            });
        });
    });
}

function mostrarUsuariosPorTipo(tipoId) {
    const tipo = tiposUsuario.find(t => t.id === tipoId);
    mainTitle.textContent = `Usuarios: ${tipo.nombre}`;
    const usuariosFiltrados = usuarios.filter(u => u.id_tipo_usuario === tipoId);
    mainContentPlaceholder.innerHTML = `
        <button class="crear-usuario-btn">+ Crear usuario</button>
        <div class="tabla-usuarios-container">
            <table class="tabla-usuarios">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Fecha registro</th>
                        <th>Último acceso</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${usuariosFiltrados.length === 0 ? `<tr><td colspan='8'>No hay usuarios de este tipo.</td></tr>` : usuariosFiltrados.map(u => `
                        <tr>
                            <td>${u.nombre}</td>
                            <td>${u.apellido}</td>
                            <td>${u.email}</td>
                            <td>${u.telefono || '-'}</td>
                            <td>${u.fecha_registro}</td>
                            <td>${u.ultimo_acceso || '-'}</td>
                            <td>${u.activo ? 'Activo' : 'Inactivo'}</td>
                            <td>
                                <button class="leer-btn" title="Ver" data-id="${u.id_usuario}"><i class="fa fa-eye"></i></button>
                                <button class="editar-btn" title="Editar" data-id="${u.id_usuario}"><i class="fa fa-edit"></i></button>
                                <button class="eliminar-btn" title="Eliminar" data-id="${u.id_usuario}"><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    // CRUD events
    document.querySelector('.crear-usuario-btn').onclick = () => abrirModalUsuario('crear', tipoId);
    document.querySelectorAll('.leer-btn').forEach(btn => {
        btn.onclick = () => abrirModalLeerUsuario(parseInt(btn.getAttribute('data-id')));
    });
    document.querySelectorAll('.editar-btn').forEach(btn => {
        btn.onclick = () => abrirModalUsuario('editar', tipoId, parseInt(btn.getAttribute('data-id')));
    });
    document.querySelectorAll('.eliminar-btn').forEach(btn => {
        btn.onclick = () => eliminarUsuario(parseInt(btn.getAttribute('data-id')), tipoId);
    });
}

function abrirModalLeerUsuario(idUsuario) {
    const usuario = usuarios.find(u => u.id_usuario === idUsuario);
    const modal = document.createElement('div');
    modal.className = 'modal-usuario';
    modal.innerHTML = `
        <div class="modal-contenido">
            <span class="cerrar-modal">&times;</span>
            <h3>Información del usuario</h3>
            <div class="info-usuario-modal">
                <p><strong>Nombre:</strong> ${usuario.nombre}</p>
                <p><strong>Apellido:</strong> ${usuario.apellido}</p>
                <p><strong>Email:</strong> ${usuario.email}</p>
                <p><strong>Teléfono:</strong> ${usuario.telefono || '-'}</p>
                <p><strong>Fecha de registro:</strong> ${usuario.fecha_registro}</p>
                <p><strong>Último acceso:</strong> ${usuario.ultimo_acceso || '-'}</p>
                <p><strong>Estado:</strong> ${usuario.activo ? 'Activo' : 'Inactivo'}</p>
            </div>
            <div class="modal-acciones">
                <button type="button" id="cancelar-modal">Cerrar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.cerrar-modal').onclick = () => modal.remove();
    modal.querySelector('#cancelar-modal').onclick = () => modal.remove();
}

function abrirModalUsuario(modo, tipoId, idUsuario = null) {
    let usuario = { nombre: '', apellido: '', email: '', telefono: '', activo: true };
    if (modo === 'editar') {
        usuario = usuarios.find(u => u.id_usuario === idUsuario);
    }
    const modal = document.createElement('div');
    modal.className = 'modal-usuario';
    modal.innerHTML = `
        <div class="modal-contenido">
            <span class="cerrar-modal">&times;</span>
            <h3>${modo === 'crear' ? 'Crear' : 'Editar'} usuario</h3>
            <form id="form-usuario-modal" novalidate>
                <label>Nombre:
                    <input type="text" name="nombre" value="${usuario.nombre || ''}" required>
                    <div class="error-msg" data-error="nombre"></div>
                </label>
                <label>Apellido:
                    <input type="text" name="apellido" value="${usuario.apellido || ''}" required>
                    <div class="error-msg" data-error="apellido"></div>
                </label>
                <label>Email:
                    <input type="email" name="email" value="${usuario.email || ''}" required>
                    <div class="error-msg" data-error="email"></div>
                </label>
                <label>Teléfono:
                    <input type="text" name="telefono" value="${usuario.telefono || ''}">
                    <div class="error-msg" data-error="telefono"></div>
                </label>
                <label>Estado:
                    <select name="activo">
                        <option value="true" ${usuario.activo ? 'selected' : ''}>Activo</option>
                        <option value="false" ${!usuario.activo ? 'selected' : ''}>Inactivo</option>
                    </select>
                </label>
                <div class="modal-acciones">
                    <button type="submit"><i class="fa fa-save"></i> ${modo === 'crear' ? 'Crear' : 'Guardar'}</button>
                    <button type="button" id="cancelar-modal"><i class="fa fa-times"></i> Cancelar</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.cerrar-modal').onclick = () => modal.remove();
    modal.querySelector('#cancelar-modal').onclick = () => modal.remove();
    modal.querySelector('#form-usuario-modal').onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        let valido = true;
        // Limpiar errores previos
        form.querySelectorAll('.error-msg').forEach(div => div.textContent = '');
        form.nombre.classList.remove('error');
        form.apellido.classList.remove('error');
        form.email.classList.remove('error');
        form.telefono.classList.remove('error');
        // Validación nombre
        if (!form.nombre.value.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(form.nombre.value.trim())) {
            form.nombre.classList.add('error');
            form.querySelector('[data-error="nombre"]').textContent = 'Nombre obligatorio (solo letras y espacios)';
            valido = false;
        }
        // Validación apellido
        if (!form.apellido.value.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(form.apellido.value.trim())) {
            form.apellido.classList.add('error');
            form.querySelector('[data-error="apellido"]').textContent = 'Apellido obligatorio (solo letras y espacios)';
            valido = false;
        }
        // Validación email
        const emailVal = form.email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal || !emailRegex.test(emailVal)) {
            form.email.classList.add('error');
            form.querySelector('[data-error="email"]').textContent = 'Email obligatorio y válido';
            valido = false;
        } else {
            // Unicidad de email
            const emailRepetido = usuarios.some(u => u.email === emailVal && (modo === 'crear' || (modo === 'editar' && u.id_usuario !== idUsuario)));
            if (emailRepetido) {
                form.email.classList.add('error');
                form.querySelector('[data-error="email"]').textContent = 'Este email ya está registrado';
                mostrarMensaje('El email ya existe', 'error');
                valido = false;
            }
        }
        // Validación teléfono
        if (form.telefono.value.trim() && (!/^\d{1,15}$/.test(form.telefono.value.trim()))) {
            form.telefono.classList.add('error');
            form.querySelector('[data-error="telefono"]').textContent = 'Solo números, máximo 15 dígitos';
            valido = false;
        }
        if (!valido) return;
        const datos = {
            nombre: form.nombre.value,
            apellido: form.apellido.value,
            email: form.email.value,
            telefono: form.telefono.value,
            activo: form.activo.value === 'true',
            id_tipo_usuario: tipoId
        };
        if (modo === 'crear') {
            datos.id_usuario = Date.now();
            datos.fecha_registro = new Date().toISOString().slice(0,10);
            datos.ultimo_acceso = '-';
            usuarios.push(datos);
            mostrarMensaje('Usuario creado', 'success');
        } else {
            const idx = usuarios.findIndex(u => u.id_usuario === idUsuario);
            usuarios[idx] = { ...usuarios[idx], ...datos };
            mostrarMensaje('Usuario actualizado', 'success');
        }
        modal.remove();
        mostrarUsuariosPorTipo(tipoId);
    };
}

function eliminarUsuario(id, tipoId) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
        const idx = usuarios.findIndex(u => u.id_usuario === id);
        if (idx !== -1) {
            usuarios.splice(idx, 1);
            mostrarMensaje('Usuario eliminado', 'success');
            mostrarUsuariosPorTipo(tipoId);
        }
    }
}

// Al cargar la página, mostrar solo el mensaje de bienvenida
window.addEventListener('DOMContentLoaded', () => {
    if (mainTitle) mainTitle.textContent = 'Bienvenido, admin';
    if (mainContentPlaceholder) mainContentPlaceholder.innerHTML = '';
});

// Helper para mostrar mensajes flotantes con icono
function mostrarMensaje(texto, tipo = 'success') {
    const msg = document.createElement('div');
    msg.className = `mensaje-flotante ${tipo}`;
    msg.textContent = texto;
    document.body.appendChild(msg);
    setTimeout(() => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 400);
    }, 2000);
} 