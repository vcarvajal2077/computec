const API_URL = 'api/proveedores.php';
let proveedores = [];

document.addEventListener('DOMContentLoaded', () => { verificarPermisos(); cargarProveedores(); });

function verificarPermisos() {
    const userData = JSON.parse(localStorage.getItem('usuario_logueado') || 'null');
    if (!userData || !userData.loggedIn) { alert('Debes iniciar sesión'); window.location.href = 'index.html'; }
}

async function cargarProveedores() {
    const response = await fetch(`${API_URL}?action=listar`);
    const data = await response.json();
    if (data.success) { proveedores = data.data; renderizarTabla(); }
}

function renderizarTabla() {
    const tbody = document.getElementById('proveedoresTable');
    tbody.innerHTML = proveedores.length ? proveedores.map(p => `<tr>
        <td>${p.nombre}</td>
        <td>${p.contacto || '-'}</td>
        <td>${p.telefono || '-'}</td>
        <td>${p.email || '-'}</td>
        <td>${p.direccion || '-'}</td>
        <td><span class="badge badge-${p.activo == 1 ? 'activo' : 'inactivo'}">${p.activo == 1 ? 'Activo' : 'Inactivo'}</span></td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editarProveedor(${p.id_proveedor})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-secondary btn-sm" onclick="eliminarProveedor(${p.id_proveedor})"><i class="fas fa-trash"></i></button>
        </td>
    </tr>`).join('') : '<tr><td colspan="7" style="text-align: center;">No hay proveedores</td></tr>';
}

function buscarProveedores() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtrados = term ? proveedores.filter(p => p.nombre.toLowerCase().includes(term) || (p.contacto && p.contacto.toLowerCase().includes(term))) : proveedores;
    const tbody = document.getElementById('proveedoresTable');
    tbody.innerHTML = filtrados.map(p => `<tr>
        <td>${p.nombre}</td>
        <td>${p.contacto || '-'}</td>
        <td>${p.telefono || '-'}</td>
        <td>${p.email || '-'}</td>
        <td>${p.direccion || '-'}</td>
        <td><span class="badge badge-${p.activo == 1 ? 'activo' : 'inactivo'}">${p.activo == 1 ? 'Activo' : 'Inactivo'}</span></td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editarProveedor(${p.id_proveedor})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-secondary btn-sm" onclick="eliminarProveedor(${p.id_proveedor})"><i class="fas fa-trash"></i></button>
        </td>
    </tr>`).join('');
}

function abrirModalNuevo() {
    document.getElementById('modalTitle').textContent = 'Nuevo Proveedor';
    document.getElementById('formProveedor').reset();
    document.getElementById('proveedorId').value = '';
    document.getElementById('modalProveedor').classList.add('active');
}

function editarProveedor(id) {
    const p = proveedores.find(x => x.id_proveedor == id);
    if (!p) return;
    document.getElementById('modalTitle').textContent = 'Editar Proveedor';
    document.getElementById('proveedorId').value = p.id_proveedor;
    document.getElementById('nombre').value = p.nombre;
    document.getElementById('contacto').value = p.contacto || '';
    document.getElementById('telefono').value = p.telefono || '';
    document.getElementById('email').value = p.email || '';
    document.getElementById('direccion').value = p.direccion || '';
    document.getElementById('activo').value = p.activo;
    document.getElementById('modalProveedor').classList.add('active');
}

async function guardarProveedor(event) {
    event.preventDefault();
    const id = document.getElementById('proveedorId').value;
    const formData = {
        nombre: document.getElementById('nombre').value,
        contacto: document.getElementById('contacto').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        direccion: document.getElementById('direccion').value,
        activo: document.getElementById('activo').value
    };
    if (id) formData.id_proveedor = id;
    
    const response = await fetch(`${API_URL}?action=${id ? 'actualizar' : 'crear'}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    if (data.success) { alert('✅ ' + data.message); cerrarModal(); cargarProveedores(); } else { alert('❌ ' + data.message); }
}

async function eliminarProveedor(id) {
    if (!confirm('¿Eliminar este proveedor?')) return;
    const response = await fetch(`${API_URL}?action=eliminar`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id_proveedor: id })
    });
    const data = await response.json();
    if (data.success) { alert('✅ Proveedor eliminado'); cargarProveedores(); }
}

function cerrarModal() {
    document.getElementById('modalProveedor').classList.remove('active');
}

document.getElementById('modalProveedor').addEventListener('click', function(e) { if (e.target === this) cerrarModal(); });
