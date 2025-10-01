const API_URL = 'api/inventario.php';

document.addEventListener('DOMContentLoaded', function() {
    verificarPermisos();
    cargarDatos();
});

function verificarPermisos() {
    const userData = JSON.parse(localStorage.getItem('usuario_logueado') || 'null');
    if (!userData || !userData.loggedIn) {
        alert('Debes iniciar sesión');
        window.location.href = 'index.html';
    }
}

async function cargarDatos() {
    await Promise.all([cargarEstadisticas(), cargarStock(), cargarMovimientos(), cargarAlertas(), cargarProductos()]);
}

async function cargarEstadisticas() {
    const response = await fetch(`${API_URL}?action=estadisticas`);
    const data = await response.json();
    if (data.success) {
        document.getElementById('statStockBajo').textContent = data.data.bajo;
        document.getElementById('statStockCritico').textContent = data.data.critico;
        document.getElementById('statProductosOK').textContent = data.data.ok;
        document.getElementById('statValorTotal').textContent = formatPrice(data.data.valor);
    }
}

async function cargarStock() {
    const response = await fetch(`${API_URL}?action=estado_stock`);
    const data = await response.json();
    if (data.success) {
        const tbody = document.getElementById('stockTable');
        tbody.innerHTML = data.data.map(p => {
            const estado = p.stock == 0 ? 'critico' : (p.stock <= p.stock_minimo ? 'bajo' : 'ok');
            return `<tr>
                <td>${p.nombre}</td>
                <td>${p.stock}</td>
                <td>${p.stock_minimo}</td>
                <td><span class="badge badge-${estado}">${estado.toUpperCase()}</span></td>
                <td>${formatPrice(p.precio_venta * p.stock)}</td>
            </tr>`;
        }).join('');
    }
}

async function cargarMovimientos() {
    const response = await fetch(`${API_URL}?action=movimientos`);
    const data = await response.json();
    if (data.success) {
        const tbody = document.getElementById('movimientosTable');
        tbody.innerHTML = data.data.length ? data.data.map(m => `<tr>
            <td>${formatFecha(m.fecha)}</td>
            <td>${m.producto}</td>
            <td><span class="badge badge-${m.tipo}">${m.tipo}</span></td>
            <td>${m.cantidad}</td>
            <td>${m.usuario || 'N/A'}</td>
            <td>${m.observacion || '-'}</td>
        </tr>`).join('') : '<tr><td colspan="6" style="text-align: center;">No hay movimientos</td></tr>';
    }
}

async function cargarAlertas() {
    const response = await fetch(`${API_URL}?action=alertas`);
    const data = await response.json();
    if (data.success) {
        const tbody = document.getElementById('alertasTable');
        tbody.innerHTML = data.data.length ? data.data.map(p => `<tr>
            <td>${p.nombre}</td>
            <td>${p.stock}</td>
            <td>${p.stock_minimo}</td>
            <td style="color: #dc2626; font-weight: 600;">${p.stock_minimo - p.stock}</td>
            <td><button class="btn btn-primary btn-sm" onclick="abrirModalMovimiento(${p.id_producto})">Reponer</button></td>
        </tr>`).join('') : '<tr><td colspan="5" style="text-align: center;">No hay alertas</td></tr>';
    }
}

async function cargarProductos() {
    const response = await fetch(`${API_URL}?action=estado_stock`);
    const data = await response.json();
    if (data.success) {
        const select = document.getElementById('productoSelect');
        select.innerHTML = '<option value="">Seleccione...</option>' + data.data.map(p => `<option value="${p.id_producto}">${p.nombre}</option>`).join('');
    }
}

function abrirModalMovimiento(idProducto) {
    document.getElementById('modalMovimiento').classList.add('active');
    if (idProducto) document.getElementById('productoSelect').value = idProducto;
}

function cerrarModal() {
    document.getElementById('modalMovimiento').classList.remove('active');
    document.getElementById('formMovimiento').reset();
}

async function registrarMovimiento(event) {
    event.preventDefault();
    const formData = {
        id_producto: document.getElementById('productoSelect').value,
        tipo: document.getElementById('tipoMovimiento').value,
        cantidad: parseInt(document.getElementById('cantidad').value),
        observacion: document.getElementById('observacion').value
    };
    
    const response = await fetch(`${API_URL}?action=registrar_movimiento`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    if (data.success) {
        alert('✅ Movimiento registrado');
        cerrarModal();
        cargarDatos();
    } else {
        alert('❌ ' + data.message);
    }
}

function cambiarTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price || 0);
}

function formatFecha(fecha) {
    return new Date(fecha).toLocaleString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

document.getElementById('modalMovimiento').addEventListener('click', function(e) {
    if (e.target === this) cerrarModal();
});
