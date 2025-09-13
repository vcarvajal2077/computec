/**
 * SERVICIOS DINÁMICOS - JAVASCRIPT
 * Maneja la carga dinámica de servicios desde la API
 */

class ServiciosDinamicos {
    constructor() {
        this.categorias = [];
        this.servicios = [];
        this.serviciosFiltrados = [];
        this.categoriaActual = null;
        this.apiBase = 'api/servicios.php';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.cargarCategorias();
    }
    
    bindEvents() {
        // Botón de reintentar
        document.getElementById('retry-servicios')?.addEventListener('click', () => {
            this.cargarCategorias();
        });
        
        // Botón de volver a categorías
        document.getElementById('volver-categorias')?.addEventListener('click', () => {
            this.mostrarCategorias();
        });
    }
    
    async cargarCategorias() {
        this.mostrarLoading();
        
        try {
            const response = await fetch(`${this.apiBase}?action=categorias`);
            const data = await response.json();
            
            if (data.success) {
                this.categorias = data.data;
                // Cargar también todos los servicios para agruparlos
                await this.cargarTodosLosServicios();
                this.renderizarCategorias();
                this.mostrarCategorias();
            } else {
                throw new Error(data.error || 'Error al cargar categorías');
            }
        } catch (error) {
            console.error('Error cargando categorías:', error);
            this.mostrarError();
        }
    }
    
    async cargarTodosLosServicios() {
        try {
            const response = await fetch(`${this.apiBase}?action=servicios`);
            const data = await response.json();
            
            if (data.success) {
                this.servicios = data.data;
            } else {
                console.error('Error en respuesta de servicios:', data.error);
            }
        } catch (error) {
            console.error('Error cargando servicios:', error);
        }
    }
    
    cargarServicios(categoriaId) {
        // Filtrar servicios por categoría desde los datos ya cargados
        const serviciosEnCategoria = this.servicios.filter(servicio => 
            servicio.categoria_id == categoriaId
        );
        
        // Guardar servicios filtrados temporalmente
        this.serviciosFiltrados = serviciosEnCategoria;
        this.categoriaActual = this.categorias.find(c => c.id == categoriaId);
        this.renderizarServicios();
        this.mostrarServicios();
    }
    
    renderizarCategorias() {
        const container = document.getElementById('servicios-categorias');
        if (!container) return;
        
        // Filtrar categorías para asegurar nombres únicos
        const categoriasUnicas = [];
        const nombresVistos = new Set();
        
        for (const categoria of this.categorias) {
            if (!nombresVistos.has(categoria.nombre)) {
                categoriasUnicas.push(categoria);
                nombresVistos.add(categoria.nombre);
            }
        }
        
        // Logs de debug comentados
        // console.log('Categorías únicas:', categoriasUnicas);
        // console.log('Servicios cargados:', this.servicios);
        
        container.innerHTML = categoriasUnicas.map(categoria => {
            // Contar servicios por categoría - convertir a string para comparación
            const serviciosEnCategoria = this.servicios.filter(servicio => 
                String(servicio.categoria_id) === String(categoria.id)
            );
            const cantidadServicios = serviciosEnCategoria.length;
            
            // Log para debug (comentado en producción)
            // console.log(`Categoría ${categoria.nombre} (ID: ${categoria.id}): ${cantidadServicios} servicios`);
            
            return `
                <div class="categoria-card" 
                     data-categoria-id="${categoria.id}"
                     style="--categoria-color: ${categoria.color}">
                    <div class="categoria-icon">
                        <i class="${categoria.icono}"></i>
                    </div>
                    <h3 class="categoria-titulo">${categoria.nombre}</h3>
                    <p class="categoria-descripcion">${categoria.descripcion}</p>
                    <div class="categoria-servicios-count">
                        ${cantidadServicios} ${cantidadServicios === 1 ? 'Servicio' : 'Servicios'}
                    </div>
                </div>
            `;
        }).join('');
        
        // Agregar event listeners a las tarjetas
        container.querySelectorAll('.categoria-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoriaId = card.dataset.categoriaId;
                this.cargarServicios(categoriaId);
            });
        });
    }
    
    renderizarServicios() {
        const container = document.getElementById('servicios-lista');
        const titulo = document.getElementById('categoria-titulo');
        
        if (!container || !titulo) return;
        
        titulo.textContent = this.categoriaActual.nombre;
        
        container.innerHTML = this.serviciosFiltrados.map(servicio => `
            <div class="servicio-card" 
                 data-servicio-id="${servicio.id}"
                 style="--servicio-color: ${this.categoriaActual.color}">
                <div class="servicio-header">
                    <h3 class="servicio-titulo">${servicio.nombre}</h3>
                    <div class="servicio-precio">
                        $${this.formatearPrecio(servicio.precio_base)}
                    </div>
                </div>
                
                <p class="servicio-descripcion">${servicio.descripcion}</p>
                
                <div class="servicio-detalles">
                    <div class="servicio-detalle-item">
                        <i class="fas fa-clock"></i>
                        <span>${servicio.tiempo_estimado}</span>
                    </div>
                    <div class="servicio-detalle-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>${servicio.garantia}</span>
                    </div>
                </div>
                
                ${servicio.caracteristicas && servicio.caracteristicas.length > 0 ? `
                    <div class="servicio-caracteristicas">
                        <h4>Incluye:</h4>
                        <div class="caracteristicas-lista">
                            ${servicio.caracteristicas.map(caracteristica => `
                                <span class="caracteristica-tag">${caracteristica}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="servicio-acciones">
                    <button class="btn-servicio btn-ver-detalles" onclick="serviciosDinamicos.verDetalles(${servicio.id})">
                        <i class="fas fa-info-circle"></i>
                        Ver Detalles
                    </button>
                    <button class="btn-servicio btn-contratar" onclick="serviciosDinamicos.contratarServicio(${servicio.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Contratar
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    mostrarLoading() {
        document.getElementById('servicios-loading').style.display = 'flex';
        document.getElementById('servicios-error').style.display = 'none';
        document.getElementById('servicios-categorias').style.display = 'none';
        document.getElementById('servicios-detalle').style.display = 'none';
    }
    
    mostrarError() {
        document.getElementById('servicios-loading').style.display = 'none';
        document.getElementById('servicios-error').style.display = 'flex';
        document.getElementById('servicios-categorias').style.display = 'none';
        document.getElementById('servicios-detalle').style.display = 'none';
    }
    
    mostrarCategorias() {
        document.getElementById('servicios-loading').style.display = 'none';
        document.getElementById('servicios-error').style.display = 'none';
        document.getElementById('servicios-categorias').style.display = 'grid';
        document.getElementById('servicios-detalle').style.display = 'none';
    }
    
    mostrarServicios() {
        document.getElementById('servicios-loading').style.display = 'none';
        document.getElementById('servicios-error').style.display = 'none';
        document.getElementById('servicios-categorias').style.display = 'none';
        document.getElementById('servicios-detalle').style.display = 'block';
    }
    
    formatearPrecio(precio) {
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(precio);
    }
    
    verDetalles(servicioId) {
        // Buscar el servicio en los servicios filtrados
        const servicio = this.serviciosFiltrados.find(s => s.id == servicioId);
        if (!servicio) return;
        
        // Crear modal de detalles
        this.mostrarModalDetalles(servicio);
    }
    
    mostrarModalDetalles(servicio) {
        // Crear modal si no existe
        let modal = document.getElementById('modal-detalles-servicio');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-detalles-servicio';
            modal.className = 'modal-detalles';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${servicio.nombre}</h2>
                    <button class="modal-close" onclick="serviciosDinamicos.cerrarModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="servicio-precio-modal">
                        $${this.formatearPrecio(servicio.precio_base)}
                    </div>
                    
                    <div class="servicio-descripcion-modal">
                        <h3>Descripción del Servicio</h3>
                        <p>${servicio.descripcion_detallada || servicio.descripcion}</p>
                    </div>
                    
                    <div class="servicio-detalles-modal">
                        <div class="detalle-item">
                            <i class="fas fa-clock"></i>
                            <span>Tiempo estimado: ${servicio.tiempo_estimado || '2-4 horas'}</span>
                        </div>
                        <div class="detalle-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>Garantía: ${servicio.garantia || '30 días'}</span>
                        </div>
                    </div>
                    
                    ${servicio.caracteristicas && servicio.caracteristicas.length > 0 ? `
                        <div class="servicio-caracteristicas-modal">
                            <h3>Características del Servicio</h3>
                            <ul>
                                ${servicio.caracteristicas.map(caracteristica => `
                                    <li>${caracteristica}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    <button class="btn-modal btn-cancelar" onclick="serviciosDinamicos.cerrarModal()">
                        <i class="fas fa-times"></i>
                        Cerrar
                    </button>
                    <button class="btn-modal btn-contratar" onclick="serviciosDinamicos.contratarServicio(${servicio.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Contratar Servicio
                    </button>
                </div>
            </div>
        `;
        
        // Animación de entrada
        setTimeout(() => {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }, 10);
        
        // Cerrar con ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                this.cerrarModal();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
        
        // Cerrar al hacer clic fuera del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.cerrarModal();
            }
        });
    }
    
    cerrarModal() {
        const modal = document.getElementById('modal-detalles-servicio');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
    
    contratarServicio(servicioId) {
        // Buscar el servicio en los servicios filtrados
        const servicio = this.serviciosFiltrados.find(s => s.id == servicioId);
        if (!servicio) return;
        
        // Redirigir al checkout con el servicio seleccionado
        window.location.href = `checkout.html?servicio_id=${servicioId}`;
    }
    
    verificarUsuarioLogueado() {
        // Verificar si hay un usuario logueado en localStorage o sessionStorage
        const usuario = localStorage.getItem('usuario_logueado') || sessionStorage.getItem('usuario_logueado');
        return usuario !== null;
    }
    
    mostrarModalLogin() {
        // Crear modal de login si no existe
        let modal = document.getElementById('modal-login');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-login';
            modal.className = 'modal-login';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Iniciar Sesión Requerido</h2>
                    <button class="modal-close" onclick="this.closest('.modal-login').style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Para contratar servicios necesitas iniciar sesión o registrarte.</p>
                    <div class="login-options">
                        <button class="btn-login" onclick="window.location.href='login.html'">
                            <i class="fas fa-sign-in-alt"></i>
                            Iniciar Sesión
                        </button>
                        <button class="btn-register" onclick="window.location.href='register.html'">
                            <i class="fas fa-user-plus"></i>
                            Registrarse
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }
    
    agregarAlCarrito(servicio) {
        // Obtener carrito actual
        let carrito = JSON.parse(localStorage.getItem('carrito_servicios') || '[]');
        
        // Verificar si el servicio ya está en el carrito
        const existe = carrito.find(item => item.id === servicio.id);
        
        if (existe) {
            existe.cantidad += 1;
        } else {
            carrito.push({
                id: servicio.id,
                nombre: servicio.nombre,
                precio: servicio.precio_base,
                cantidad: 1,
                categoria: this.categoriaActual.nombre
            });
        }
        
        // Guardar carrito
        localStorage.setItem('carrito_servicios', JSON.stringify(carrito));
        
        // Actualizar contador del carrito si existe
        this.actualizarContadorCarrito();
    }
    
    actualizarContadorCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carrito_servicios') || '[]');
        const contador = document.getElementById('carrito-contador');
        
        if (contador) {
            const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }
    
    mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${mensaje}</span>
        `;
        
        // Agregar al DOM
        document.body.appendChild(notificacion);
        
        // Mostrar con animación
        setTimeout(() => notificacion.classList.add('mostrar'), 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.serviciosDinamicos = new ServiciosDinamicos();
});

// CSS adicional para modales y notificaciones
const modalStyles = `
<style>
.modal-detalles, .modal-login {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 16px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
    margin: 0;
    color: #1e293b;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    color: #64748b;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: #f1f5f9;
    color: #1e293b;
}

.modal-body {
    padding: 24px;
}

.servicio-precio-modal {
    font-size: 32px;
    font-weight: 700;
    color: #3b82f6;
    text-align: center;
    margin-bottom: 24px;
}

.servicio-descripcion-modal h3,
.servicio-caracteristicas-modal h3 {
    color: #1e293b;
    margin-bottom: 12px;
}

.servicio-detalles-modal {
    display: flex;
    gap: 24px;
    margin: 20px 0;
}

.detalle-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
}

.detalle-item i {
    color: #3b82f6;
}

.servicio-caracteristicas-modal ul {
    list-style: none;
    padding: 0;
}

.servicio-caracteristicas-modal li {
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
}

.servicio-caracteristicas-modal li:before {
    content: '✓';
    color: #10b981;
    font-weight: bold;
    margin-right: 8px;
}

.modal-footer {
    display: flex;
    gap: 12px;
    padding: 24px;
    border-top: 1px solid #e2e8f0;
    justify-content: flex-end;
}

.btn-modal {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
}

.btn-cancelar {
    background: #f1f5f9;
    color: #475569;
}

.btn-contratar {
    background: #3b82f6;
    color: white;
}

.login-options {
    display: flex;
    gap: 16px;
    margin-top: 20px;
}

.btn-login, .btn-register {
    flex: 1;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-login {
    background: #3b82f6;
    color: white;
}

.btn-register {
    background: #10b981;
    color: white;
}

.notificacion {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    z-index: 1001;
}

.notificacion.mostrar {
    transform: translateX(0);
}

.notificacion-success {
    border-left: 4px solid #10b981;
}

.notificacion-success i {
    color: #10b981;
}

@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        margin: 20px;
    }
    
    .servicio-detalles-modal {
        flex-direction: column;
        gap: 12px;
    }
    
    .login-options {
        flex-direction: column;
    }
}
</style>
`;

// Agregar estilos al head
document.head.insertAdjacentHTML('beforeend', modalStyles);

