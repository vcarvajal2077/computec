const API_URL = 'api/portal-cliente.php';
let clienteData = null;

document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    cargarDatos();
});

function verificarSesion() {
    const userData = JSON.parse(localStorage.getItem('usuario_logueado') || 'null');
    
    if (!userData || !userData.loggedIn) {
        alert('Debes iniciar sesión');
        window.location.href = 'index.html';
        return;
    }
    
    clienteData = userData;
    document.getElementById('clienteName').textContent = userData.nombre || 'Cliente';
}

async function cargarDatos() {
    if (!clienteData || !clienteData.id_cliente) {
        alert('No se pudo identificar el cliente');
        return;
    }
    
    await Promise.all([
        cargarEstadisticas(),
        cargarServicios(),
        cargarCompras()
    ]);
}

async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_URL}?action=estadisticas`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id_cliente: clienteData.id_cliente })
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('statServiciosActivos').textContent = data.data.servicios_activos;
            document.getElementById('statServiciosCompletados').textContent = data.data.servicios_completados;
            document.getElementById('statTotalCompras').textContent = formatPrice(data.data.total_compras);
            document.getElementById('statTotalGastado').textContent = formatPrice(data.data.total_gastado);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarServicios() {
    try {
        const response = await fetch(`${API_URL}?action=mis_servicios`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id_cliente: clienteData.id_cliente })
        });
        
        const data = await response.json();
        
        if (data.success) {
            renderizarServicios(data.data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarCompras() {
    try {
        const response = await fetch(`${API_URL}?action=mis_compras`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id_cliente: clienteData.id_cliente })
        });
        
        const data = await response.json();
        
        if (data.success) {
            renderizarCompras(data.data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderizarServicios(servicios) {
    const container = document.getElementById('serviciosContainer');
    
    if (servicios.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-tools"></i><p>No tienes servicios registrados</p></div>';
        return;
    }
    
    container.innerHTML = servicios.map(s => `
        <div class="service-card">
            <div class="service-header">
                <div>
                    <div class="service-title">${s.tipo_servicio}</div>
                    <div class="service-date">Ingreso: ${formatearFecha(s.fecha_ingreso)}</div>
                </div>
                <span class="badge badge-${s.estado}">${formatEstado(s.estado)}</span>
            </div>
            <p style="color: #6b7280; margin: 0.5rem 0;">${s.descripcion}</p>
            <div class="service-details">
                <div class="detail-item">
                    <span class="detail-label">Técnico</span>
                    <span class="detail-value">${s.nombre_tecnico || 'Sin asignar'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Costo</span>
                    <span class="detail-value price-display">${formatPrice(s.costo)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Entrega Estimada</span>
                    <span class="detail-value">${s.fecha_entrega ? formatearFecha(s.fecha_entrega) : 'Por definir'}</span>
                </div>
            </div>
            ${s.observaciones ? `<p style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.875rem;"><strong>Observaciones:</strong> ${s.observaciones}</p>` : ''}
        </div>
    `).join('');
}

function renderizarCompras(compras) {
    const container = document.getElementById('comprasContainer');
    
    if (compras.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-shopping-cart"></i><p>No tienes compras registradas</p></div>';
        return;
    }
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                ${compras.map(c => `
                    <tr>
                        <td>#${c.id_carrito}</td>
                        <td>${formatearFecha(c.fecha_creacion)}</td>
                        <td class="price-display">${formatPrice(c.total)}</td>
                        <td><span class="badge badge-${c.estado}">${c.estado}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('facturasContainer').innerHTML = container.innerHTML;
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

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
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
