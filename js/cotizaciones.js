const API_URL = 'api/cotizaciones.php';
let cotizaciones = [];
let productos = [];
let items = [];

document.addEventListener('DOMContentLoaded', () => { verificarPermisos(); cargarDatos(); });

function verificarPermisos() {
    const userData = JSON.parse(localStorage.getItem('usuario_logueado') || 'null');
    if (!userData || !userData.loggedIn) { alert('Debes iniciar sesión'); window.location.href = 'index.html'; }
}

async function cargarDatos() {
    await Promise.all([cargarCotizaciones(), cargarClientes(), cargarProductos()]);
}

async function cargarCotizaciones() {
    const response = await fetch(`${API_URL}?action=listar`);
    const data = await response.json();
    if (data.success) { cotizaciones = data.data; renderizarTabla(); }
}

async function cargarClientes() {
    const response = await fetch(`${API_URL}?action=obtener_clientes`);
    const data = await response.json();
    if (data.success) {
        const select = document.getElementById('id_cliente');
        select.innerHTML = '<option value="">Seleccione...</option>' + data.data.map(c => `<option value="${c.id_cliente}">${c.nombre}</option>`).join('');
    }
}

async function cargarProductos() {
    const response = await fetch(`${API_URL}?action=obtener_productos`);
    const data = await response.json();
    if (data.success) {
        productos = data.data;
        actualizarSelectProductos();
    }
}

function actualizarSelectProductos() {
    const select = document.querySelector('#itemsContainer select');
    select.innerHTML = '<option value="">Seleccionar producto...</option>' + productos.map(p => `<option value="${p.id_producto}" data-precio="${p.precio_venta}">${p.nombre} - $${formatNumber(p.precio_venta)}</option>`).join('');
}

function renderizarTabla() {
    const tbody = document.getElementById('cotizacionesTable');
    tbody.innerHTML = cotizaciones.length ? cotizaciones.map(c => `<tr>
        <td>#${c.id_cotizacion}</td>
        <td>${c.cliente || 'N/A'}</td>
        <td>${formatFecha(c.fecha_creacion)}</td>
        <td style="font-weight: 700; color: #14b8a6;">$${formatNumber(c.total)}</td>
        <td><span class="badge badge-${c.estado}">${c.estado}</span></td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="verCotizacion(${c.id_cotizacion})"><i class="fas fa-eye"></i></button>
            <button class="btn btn-secondary btn-sm" onclick="eliminarCotizacion(${c.id_cotizacion})"><i class="fas fa-trash"></i></button>
        </td>
    </tr>`).join('') : '<tr><td colspan="6" style="text-align: center;">No hay cotizaciones</td></tr>';
}

function abrirModalNueva() {
    document.getElementById('modalTitle').textContent = 'Nueva Cotización';
    document.getElementById('formCotizacion').reset();
    document.getElementById('cotizacionId').value = '';
    items = [];
    renderizarItems();
    document.getElementById('modalCotizacion').classList.add('active');
}

function agregarItem(select) {
    const id = select.value;
    if (!id) return;
    const producto = productos.find(p => p.id_producto == id);
    if (!producto) return;
    
    items.push({
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        cantidad: 1,
        precio_unitario: producto.precio_venta,
        subtotal: producto.precio_venta
    });
    
    select.value = '';
    renderizarItems();
}

function renderizarItems() {
    const container = document.getElementById('itemsList');
    container.innerHTML = items.map((item, index) => `
        <div class="item-row">
            <span>${item.nombre}</span>
            <input type="number" value="${item.cantidad}" min="1" onchange="actualizarCantidad(${index}, this.value)" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px;">
            <span>$${formatNumber(item.precio_unitario)}</span>
            <strong>$${formatNumber(item.subtotal)}</strong>
            <button type="button" onclick="eliminarItem(${index})" style="background: #dc2626; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');
    
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    document.getElementById('totalCotizacion').textContent = '$' + formatNumber(total);
}

function actualizarCantidad(index, cantidad) {
    items[index].cantidad = parseInt(cantidad);
    items[index].subtotal = items[index].cantidad * items[index].precio_unitario;
    renderizarItems();
}

function eliminarItem(index) {
    items.splice(index, 1);
    renderizarItems();
}

async function guardarCotizacion(event) {
    event.preventDefault();
    if (items.length === 0) { alert('Debe agregar al menos un item'); return; }
    
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const formData = {
        id_cliente: document.getElementById('id_cliente').value,
        fecha_vencimiento: document.getElementById('fecha_vencimiento').value || null,
        total: total,
        observaciones: document.getElementById('observaciones').value,
        items: items
    };
    
    const response = await fetch(`${API_URL}?action=crear`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    if (data.success) { alert('✅ ' + data.message); cerrarModal(); cargarCotizaciones(); } else { alert('❌ ' + data.message); }
}

async function eliminarCotizacion(id) {
    if (!confirm('¿Eliminar esta cotización?')) return;
    const response = await fetch(`${API_URL}?action=eliminar`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id_cotizacion: id })
    });
    const data = await response.json();
    if (data.success) { alert('✅ Cotización eliminada'); cargarCotizaciones(); }
}

function verCotizacion(id) {
    alert('Ver cotización #' + id);
}

function cerrarModal() { document.getElementById('modalCotizacion').classList.remove('active'); }

function formatNumber(num) {
    return new Intl.NumberFormat('es-CO').format(num || 0);
}

function formatFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

document.getElementById('modalCotizacion').addEventListener('click', function(e) { if (e.target === this) cerrarModal(); });
