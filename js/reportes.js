const API_URL = 'api/reportes.php';
let charts = {};

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
    
    if (!esAdmin && !esGestor) {
        alert('No tienes permisos');
        window.location.href = 'panel.html';
    }
}

async function cargarDatos() {
    const dias = document.getElementById('filterPeriodo').value;
    
    await Promise.all([
        cargarEstadisticasGenerales(dias),
        cargarVentasPorDia(dias),
        cargarServiciosPorEstado(),
        cargarProductosMasVendidos(),
        cargarIngresosMensuales(),
        cargarTopClientes()
    ]);
}

async function cargarEstadisticasGenerales(dias) {
    try {
        const response = await fetch(`${API_URL}?action=estadisticas_generales`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ dias: parseInt(dias) })
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('statVentas').textContent = formatPrice(data.data.ventas);
            document.getElementById('statServicios').textContent = data.data.servicios;
            document.getElementById('statClientes').textContent = data.data.clientes;
            document.getElementById('statProductos').textContent = data.data.productos;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarVentasPorDia(dias) {
    try {
        const response = await fetch(`${API_URL}?action=ventas_por_dia`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ dias: parseInt(dias) })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const labels = data.data.map(d => formatFecha(d.fecha));
            const valores = data.data.map(d => parseFloat(d.total));
            
            if (charts.ventas) charts.ventas.destroy();
            
            const ctx = document.getElementById('chartVentas').getContext('2d');
            charts.ventas = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Ventas',
                        data: valores,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarServiciosPorEstado() {
    try {
        const response = await fetch(`${API_URL}?action=servicios_por_estado`);
        const data = await response.json();
        
        if (data.success) {
            const labels = data.data.map(d => formatEstado(d.estado));
            const valores = data.data.map(d => parseInt(d.total));
            
            if (charts.servicios) charts.servicios.destroy();
            
            const ctx = document.getElementById('chartServicios').getContext('2d');
            charts.servicios = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: valores,
                        backgroundColor: ['#3b82f6', '#16a34a', '#d97706', '#8b5cf6', '#dc2626', '#6b7280']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarProductosMasVendidos() {
    try {
        const response = await fetch(`${API_URL}?action=productos_mas_vendidos`);
        const data = await response.json();
        
        if (data.success) {
            const labels = data.data.map(d => d.nombre);
            const valores = data.data.map(d => parseInt(d.total));
            
            if (charts.productos) charts.productos.destroy();
            
            const ctx = document.getElementById('chartProductos').getContext('2d');
            charts.productos = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Unidades Vendidas',
                        data: valores,
                        backgroundColor: '#16a34a'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarIngresosMensuales() {
    try {
        const response = await fetch(`${API_URL}?action=ingresos_mensuales`);
        const data = await response.json();
        
        if (data.success) {
            const labels = data.data.map(d => d.mes);
            const valores = data.data.map(d => parseFloat(d.total));
            
            if (charts.ingresos) charts.ingresos.destroy();
            
            const ctx = document.getElementById('chartIngresos').getContext('2d');
            charts.ingresos = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Ingresos',
                        data: valores,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarTopClientes() {
    try {
        const response = await fetch(`${API_URL}?action=top_clientes`);
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('topClientesTable');
            
            if (data.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">No hay datos</td></tr>';
                return;
            }
            
            tbody.innerHTML = data.data.map(c => `
                <tr>
                    <td>${c.cliente}</td>
                    <td>${c.servicios}</td>
                    <td>${c.compras}</td>
                    <td style="font-weight: 700; color: #16a34a;">${formatPrice(c.total_gastado)}</td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price || 0);
}

function formatFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
}

function formatEstado(estado) {
    const estados = {
        'recibido': 'Recibido',
        'en_proceso': 'En Proceso',
        'esperando_repuestos': 'Esperando Repuestos',
        'terminado': 'Terminado',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado'
    };
    return estados[estado] || estado;
}
