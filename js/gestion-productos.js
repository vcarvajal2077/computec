/**
 * Gestión de Productos - CRUD Completo
 */

const API_URL = 'api/productos-crud.php';
let productos = [];
let productoEditando = null;

document.addEventListener('DOMContentLoaded', function() {
    verificarPermisos();
    cargarProductos();
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

async function cargarProductos() {
    try {
        const response = await fetch(`${API_URL}?action=listar`);
        const data = await response.json();
        
        if (data.success) {
            productos = data.data;
            renderizarTabla();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderizarTabla() {
    const tbody = document.getElementById('productosTableBody');
    
    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No hay productos</td></tr>';
        return;
    }
    
    tbody.innerHTML = productos.map(p => {
        const stockBadge = p.stock == 0 ? 'sin-stock' : (p.stock <= p.stock_minimo ? 'stock-bajo' : 'stock-ok');
        const stockText = p.stock == 0 ? 'Agotado' : (p.stock <= p.stock_minimo ? `Bajo (${p.stock})` : p.stock);
        
        return `
            <tr>
                <td><code>${p.sku}</code></td>
                <td>
                    <strong>${p.nombre}</strong><br>
                    <small style="color: #6b7280;">${p.marca || ''} ${p.modelo || ''}</small>
                </td>
                <td>${p.categoria}</td>
                <td class="price-display">$${parseFloat(p.precio).toFixed(2)}</td>
                <td><span class="badge badge-${stockBadge}">${stockText}</span></td>
                <td><span class="badge badge-${p.activo == 1 ? 'activo' : 'inactivo'}">${p.activo == 1 ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editarProducto(${p.id_producto})" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.id_producto})" title="Eliminar"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function buscarProductos() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    
    if (!term) {
        renderizarTabla();
        return;
    }
    
    const filtrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        (p.marca && p.marca.toLowerCase().includes(term)) ||
        (p.modelo && p.modelo.toLowerCase().includes(term))
    );
    
    mostrarFiltrados(filtrados);
}

function aplicarFiltros() {
    const categoria = document.getElementById('filterCategoria').value;
    const stock = document.getElementById('filterStock').value;
    const estado = document.getElementById('filterEstado').value;
    
    let filtrados = [...productos];
    
    if (categoria) filtrados = filtrados.filter(p => p.categoria === categoria);
    if (estado) filtrados = filtrados.filter(p => p.activo == estado);
    
    if (stock === 'disponible') filtrados = filtrados.filter(p => p.stock > p.stock_minimo);
    if (stock === 'bajo') filtrados = filtrados.filter(p => p.stock > 0 && p.stock <= p.stock_minimo);
    if (stock === 'agotado') filtrados = filtrados.filter(p => p.stock == 0);
    
    mostrarFiltrados(filtrados);
}

function mostrarFiltrados(filtrados) {
    const tbody = document.getElementById('productosTableBody');
    
    if (filtrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No se encontraron resultados</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtrados.map(p => {
        const stockBadge = p.stock == 0 ? 'sin-stock' : (p.stock <= p.stock_minimo ? 'stock-bajo' : 'stock-ok');
        const stockText = p.stock == 0 ? 'Agotado' : (p.stock <= p.stock_minimo ? `Bajo (${p.stock})` : p.stock);
        
        return `
            <tr>
                <td><code>${p.sku}</code></td>
                <td><strong>${p.nombre}</strong><br><small style="color: #6b7280;">${p.marca || ''} ${p.modelo || ''}</small></td>
                <td>${p.categoria}</td>
                <td class="price-display">$${parseFloat(p.precio).toFixed(2)}</td>
                <td><span class="badge badge-${stockBadge}">${stockText}</span></td>
                <td><span class="badge badge-${p.activo == 1 ? 'activo' : 'inactivo'}">${p.activo == 1 ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editarProducto(${p.id_producto})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.id_producto})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function abrirModalNuevo() {
    productoEditando = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Producto';
    document.getElementById('formProducto').reset();
    document.getElementById('productoId').value = '';
    document.getElementById('modalProducto').classList.add('active');
}

function editarProducto(id) {
    productoEditando = productos.find(p => p.id_producto == id);
    
    if (!productoEditando) return;
    
    document.getElementById('modalTitle').textContent = 'Editar Producto';
    document.getElementById('productoId').value = productoEditando.id_producto;
    document.getElementById('nombre').value = productoEditando.nombre;
    document.getElementById('sku').value = productoEditando.sku;
    document.getElementById('descripcion').value = productoEditando.descripcion || '';
    document.getElementById('categoria').value = productoEditando.categoria;
    document.getElementById('marca').value = productoEditando.marca || '';
    document.getElementById('modelo').value = productoEditando.modelo || '';
    document.getElementById('precio').value = productoEditando.precio;
    document.getElementById('stock').value = productoEditando.stock;
    document.getElementById('stock_minimo').value = productoEditando.stock_minimo;
    document.getElementById('garantia').value = productoEditando.garantia || 0;
    document.getElementById('activo').value = productoEditando.activo;
    
    document.getElementById('modalProducto').classList.add('active');
}

async function guardarProducto(event) {
    event.preventDefault();
    
    const productoId = document.getElementById('productoId').value;
    const formData = {
        nombre: document.getElementById('nombre').value,
        sku: document.getElementById('sku').value,
        descripcion: document.getElementById('descripcion').value,
        categoria: document.getElementById('categoria').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        stock_minimo: parseInt(document.getElementById('stock_minimo').value),
        garantia: parseInt(document.getElementById('garantia').value),
        activo: document.getElementById('activo').value
    };
    
    try {
        const action = productoId ? 'actualizar' : 'crear';
        if (productoId) formData.id_producto = productoId;
        
        const response = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ ' + data.message);
            cerrarModal();
            cargarProductos();
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión');
    }
}

async function eliminarProducto(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    
    try {
        const response = await fetch(`${API_URL}?action=eliminar`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id_producto: id })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Producto eliminado');
            cargarProductos();
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión');
    }
}

function cerrarModal() {
    document.getElementById('modalProducto').classList.remove('active');
    document.getElementById('formProducto').reset();
}

document.getElementById('modalProducto').addEventListener('click', function(e) {
    if (e.target === this) cerrarModal();
});

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') buscarProductos();
});
