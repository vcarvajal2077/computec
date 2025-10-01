const API_URL = 'api/facturas.php';
let facturas = [];

document.addEventListener('DOMContentLoaded', () => { verificarPermisos(); cargarDatos(); });

function verificarPermisos() {
    const userData = JSON.parse(localStorage.getItem('usuario_logueado') || 'null');
    if (!userData || !userData.loggedIn) { alert('Debes iniciar sesión'); window.location.href = 'index.html'; }
}

async function cargarDatos() {
    await Promise.all([cargarEstadisticas(), cargarFacturas()]);
}

async function cargarEstadisticas() {
    const response = await fetch(`${API_URL}?action=estadisticas`);
    const data = await response.json();
    if (data.success) {
        document.getElementById('statTotal').textContent = formatPrice(data.data.total);
        document.getElementById('statPagadas').textContent = data.data.pagadas;
        document.getElementById('statPendientes').textContent = data.data.pendientes;
    }
}

async function cargarFacturas() {
    const response = await fetch(`${API_URL}?action=listar`);
    const data = await response.json();
    if (data.success) { facturas = data.data; renderizarTabla(); }
}

function renderizarTabla() {
    const tbody = document.getElementById('facturasTable');
    tbody.innerHTML = facturas.length ? facturas.map(f => `<tr>
        <td>#${f.id_factura}</td>
        <td>${f.cliente || 'N/A'}</td>
        <td>${formatFecha(f.fecha_creacion)}</td>
        <td style="font-weight: 700; color: #ec4899;">${formatPrice(f.total)}</td>
        <td><span class="badge badge-${f.estado}">${f.estado}</span></td>
        <td><button class="btn btn-primary btn-sm" onclick="verDetalle(${f.id_factura})"><i class="fas fa-eye"></i> Ver</button></td>
    </tr>`).join('') : '<tr><td colspan="6" style="text-align: center;">No hay facturas</td></tr>';
}

function buscarFacturas() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtrados = term ? facturas.filter(f => f.cliente && f.cliente.toLowerCase().includes(term) || f.id_factura.toString().includes(term)) : facturas;
    mostrarFiltrados(filtrados);
}

function aplicarFiltros() {
    const estado = document.getElementById('filterEstado').value;
    const filtrados = estado ? facturas.filter(f => f.estado === estado) : facturas;
    mostrarFiltrados(filtrados);
}

function mostrarFiltrados(filtrados) {
    const tbody = document.getElementById('facturasTable');
    tbody.innerHTML = filtrados.map(f => `<tr>
        <td>#${f.id_factura}</td>
        <td>${f.cliente || 'N/A'}</td>
        <td>${formatFecha(f.fecha_creacion)}</td>
        <td style="font-weight: 700; color: #ec4899;">${formatPrice(f.total)}</td>
        <td><span class="badge badge-${f.estado}">${f.estado}</span></td>
        <td><button class="btn btn-primary btn-sm" onclick="verDetalle(${f.id_factura})"><i class="fas fa-eye"></i> Ver</button></td>
    </tr>`).join('');
}

async function verDetalle(id) {
    const response = await fetch(`${API_URL}?action=detalle`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id_factura: id })
    });
    const data = await response.json();
    if (data.success) {
        const factura = facturas.find(f => f.id_factura == id);
        document.getElementById('detalleContent').innerHTML = `
            <p><strong>Factura:</strong> #${id}</p>
            <p><strong>Cliente:</strong> ${factura.cliente}</p>
            <p><strong>Fecha:</strong> ${formatFecha(factura.fecha_creacion)}</p>
            <h3>Items:</h3>
            <table style="width: 100%; margin-top: 1rem;">
                <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th></tr></thead>
                <tbody>${data.data.map(i => `<tr><td>${i.nombre}</td><td>${i.cantidad}</td><td>${formatPrice(i.precio)}</td></tr>`).join('')}</tbody>
            </table>
            <p style="margin-top: 1rem; font-size: 1.5rem; font-weight: 700; color: #ec4899;">Total: ${formatPrice(factura.total)}</p>
        `;
        document.getElementById('modalDetalle').classList.add('active');
    }
}

function cerrarModal() {
    document.getElementById('modalDetalle').classList.remove('active');
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price || 0);
}

function formatFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

document.getElementById('modalDetalle').addEventListener('click', function(e) { if (e.target === this) cerrarModal(); });
