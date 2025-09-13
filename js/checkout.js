/**
 * CHECKOUT - JAVASCRIPT
 * Maneja el proceso de checkout para servicios
 */

class CheckoutManager {
    constructor() {
        this.servicio = null;
        this.apiBase = 'api/ordenes.php';
        
        this.init();
    }
    
    init() {
        this.cargarServicioDesdeURL();
        this.bindEvents();
        this.configurarFechaMinima();
        this.verificarUsuarioLogueado();
    }
    
    cargarServicioDesdeURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const servicioId = urlParams.get('servicio_id');
        
        if (servicioId) {
            this.cargarServicio(servicioId);
        } else {
            this.mostrarError('No se ha seleccionado ningún servicio');
        }
    }
    
    async cargarServicio(servicioId) {
        try {
            const response = await fetch(`api/servicios.php?action=servicio&id=${servicioId}`);
            const data = await response.json();
            
            if (data.success) {
                this.servicio = data.data;
                this.renderizarResumenServicio();
            } else {
                throw new Error(data.error || 'Error al cargar el servicio');
            }
        } catch (error) {
            console.error('Error cargando servicio:', error);
            this.mostrarError('Error al cargar el servicio seleccionado');
        }
    }
    
    renderizarResumenServicio() {
        if (!this.servicio) return;
        
        const container = document.getElementById('servicio-resumen');
        if (!container) return;
        
        // Calcular precios
        const subtotal = this.servicio.precio_base;
        const impuestos = subtotal * 0.19;
        const total = subtotal + impuestos;
        
        container.innerHTML = `
            <div class="servicio-info">
                <div class="servicio-icon" style="--servicio-color: ${this.servicio.categoria_color || '#3b82f6'}">
                    <i class="${this.servicio.categoria_icono || 'fas fa-cog'}"></i>
                </div>
                <div class="servicio-details">
                    <h3>${this.servicio.nombre}</h3>
                    <p>${this.servicio.descripcion}</p>
                </div>
            </div>
            
            <div class="servicio-precio" style="--servicio-color: ${this.servicio.categoria_color || '#3b82f6'}">
                $${this.formatearPrecio(this.servicio.precio_base)}
            </div>
            
            ${this.servicio.caracteristicas && this.servicio.caracteristicas.length > 0 ? `
                <div class="servicio-caracteristicas">
                    <h4>Incluye:</h4>
                    <div class="caracteristicas-lista">
                        ${this.servicio.caracteristicas.map(caracteristica => `
                            <span class="caracteristica-tag">${caracteristica}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="resumen-total">
                <div class="total-item">
                    <span>Subtotal:</span>
                    <span>$${this.formatearPrecio(subtotal)}</span>
                </div>
                <div class="total-item">
                    <span>IVA (19%):</span>
                    <span>$${this.formatearPrecio(impuestos)}</span>
                </div>
                <div class="total-item final">
                    <span>Total:</span>
                    <span>$${this.formatearPrecio(total)}</span>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // Formulario de checkout
        const form = document.getElementById('checkout-form');
        if (form) {
            form.addEventListener('submit', (e) => this.procesarCheckout(e));
        }
        
        // Validación en tiempo real
        this.configurarValidaciones();
    }
    
    configurarValidaciones() {
        const inputs = document.querySelectorAll('#checkout-form input, #checkout-form textarea, #checkout-form select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validarCampo(input));
            input.addEventListener('input', () => this.limpiarError(input));
        });
    }
    
    validarCampo(campo) {
        const valor = campo.value.trim();
        const esRequerido = campo.hasAttribute('required');
        
        if (esRequerido && !valor) {
            this.mostrarErrorCampo(campo, 'Este campo es requerido');
            return false;
        }
        
        if (campo.type === 'email' && valor) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(valor)) {
                this.mostrarErrorCampo(campo, 'Ingresa un email válido');
                return false;
            }
        }
        
        if (campo.type === 'tel' && valor) {
            const telefonoRegex = /^[0-9+\-\s()]{7,15}$/;
            if (!telefonoRegex.test(valor)) {
                this.mostrarErrorCampo(campo, 'Ingresa un teléfono válido');
                return false;
            }
        }
        
        this.limpiarError(campo);
        return true;
    }
    
    mostrarErrorCampo(campo, mensaje) {
        this.limpiarError(campo);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = mensaje;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        
        campo.parentNode.appendChild(errorDiv);
        campo.style.borderColor = '#ef4444';
    }
    
    limpiarError(campo) {
        const errorDiv = campo.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        campo.style.borderColor = '#d1d5db';
    }
    
    configurarFechaMinima() {
        const fechaInput = document.getElementById('fecha_agendada');
        if (fechaInput) {
            const hoy = new Date();
            const fechaMinima = hoy.toISOString().split('T')[0];
            fechaInput.min = fechaMinima;
        }
    }
    
    verificarUsuarioLogueado() {
        const usuario = this.obtenerUsuarioLogueado();
        
        if (usuario) {
            // Usuario logueado - pre-llenar formulario
            this.preLlenarFormulario(usuario);
            this.mostrarBienvenida(usuario);
        } else {
            // Usuario no logueado - mostrar opción de login
            this.mostrarOpcionLogin();
        }
    }
    
    obtenerUsuarioLogueado() {
        try {
            const usuario = localStorage.getItem('usuario_logueado');
            return usuario ? JSON.parse(usuario) : null;
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
            return null;
        }
    }
    
    preLlenarFormulario(usuario) {
        // Pre-llenar campos con datos del usuario
        const campos = {
            'cliente_nombre': usuario.nombre || '',
            'cliente_apellido': usuario.apellido || '',
            'cliente_email': usuario.email || '',
            'cliente_telefono': usuario.telefono || ''
        };
        
        Object.entries(campos).forEach(([campo, valor]) => {
            const input = document.getElementById(campo);
            if (input && valor) {
                input.value = valor;
                input.style.backgroundColor = '#f0f9ff';
                input.style.borderColor = '#3b82f6';
            }
        });
    }
    
    mostrarBienvenida(usuario) {
        // Crear mensaje de bienvenida
        const mensajeBienvenida = document.createElement('div');
        mensajeBienvenida.className = 'bienvenida-usuario';
        mensajeBienvenida.innerHTML = `
            <div class="bienvenida-content">
                <i class="fas fa-user-check"></i>
                <div>
                    <h3>¡Hola, ${usuario.nombre}!</h3>
                    <p>Hemos pre-llenado tu información. Puedes modificarla si es necesario.</p>
                </div>
                <button class="btn-cerrar-bienvenida" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Insertar después del breadcrumb
        const breadcrumb = document.querySelector('.breadcrumb');
        if (breadcrumb) {
            breadcrumb.insertAdjacentElement('afterend', mensajeBienvenida);
        }
    }
    
    mostrarOpcionLogin() {
        // Crear opción de login
        const opcionLogin = document.createElement('div');
        opcionLogin.className = 'opcion-login';
        opcionLogin.innerHTML = `
            <div class="opcion-login-content">
                <i class="fas fa-sign-in-alt"></i>
                <div>
                    <h3>Inicia sesión para continuar</h3>
                    <p>Para finalizar tu orden, es necesario que inicies sesión en tu cuenta.</p>
                </div>
                <div class="opcion-login-actions">
                    <button class="btn-login-checkout" onclick="checkoutManager.abrirLogin()">
                        <i class="fas fa-sign-in-alt"></i>
                        Iniciar Sesión o Registrarse
                    </button>
                </div>
            </div>
        `;
        
        // Insertar después del breadcrumb
        const breadcrumb = document.querySelector('.breadcrumb');
        if (breadcrumb) {
            breadcrumb.insertAdjacentElement('afterend', opcionLogin);
        }
    }
    
    abrirLogin() {
        // Redirigir a página de login con return URL
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `login.html?return=${returnUrl}`;
    }
    
    async procesarCheckout(e) {
        e.preventDefault();

        // Verificación de login obligatorio
        const usuario = this.obtenerUsuarioLogueado();
        if (!usuario) {
            this.mostrarError('Debes iniciar sesión para poder confirmar una orden.');
            // Esperar un momento para que el usuario vea el mensaje y luego redirigir
            setTimeout(() => {
                this.abrirLogin();
            }, 2000);
            return;
        }

        // Validar formulario
        if (!this.validarFormulario()) {
            return;
        }
        
        // Mostrar loading
        this.mostrarLoading(true);
        
        try {
            // Preparar datos
            const formData = new FormData(e.target);
            
            const datosOrden = {
                cliente_nombre: formData.get('cliente_nombre'),
                cliente_apellido: formData.get('cliente_apellido'),
                cliente_email: formData.get('cliente_email'),
                cliente_telefono: formData.get('cliente_telefono'),
                direccion_servicio: formData.get('direccion_servicio'),
                fecha_agendada: formData.get('fecha_agendada'),
                hora_agendada: formData.get('hora_agendada'),
                metodo_pago: formData.get('metodo_pago'),
                notas: formData.get('notas'),
                usuario_id: usuario ? usuario.id_usuario : null,
                servicios: [{
                    id: this.servicio.id,
                    cantidad: 1
                }]
            };
            
            // Enviar orden
            const response = await fetch(`${this.apiBase}?action=crear_orden`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosOrden)
            });
            
            const data = await response.json();
            
            if (data.success) {
                const orden = data.data.orden;
                
                // Si hay un método de pago seleccionado, procesar pago
                if (window.pagosManager && window.pagosManager.metodoSeleccionado) {
                    await this.procesarPago(orden);
                } else {
                    // Mostrar confirmación sin pago
                    this.mostrarConfirmacion(orden);
                }
                
                // Enviar notificación de orden creada
                if (window.NotificacionesManager) {
                    NotificacionesManager.notificarOrden(orden);
                }
            } else {
                throw new Error(data.error || 'Error al procesar la orden');
            }
            
        } catch (error) {
            console.error('Error procesando checkout:', error);
            this.mostrarError('Error al procesar la orden. Intenta de nuevo.');
        } finally {
            this.mostrarLoading(false);
        }
    }
    
    async procesarPago(orden) {
        try {
            // Mostrar loading de pago
            this.mostrarLoadingPago(true);
            
            // Procesar pago usando el PagosManager
            const resultadoPago = await window.pagosManager.procesarPago(orden.id, orden.total);
            
            if (resultadoPago) {
                // Actualizar orden con información de pago
                orden.estado_pago = resultadoPago.estado;
                orden.metodo_pago = resultadoPago.metodo;
                orden.referencia_pago = resultadoPago.transaction_id;
                
                // Mostrar confirmación con información de pago
                this.mostrarConfirmacionConPago(orden, resultadoPago);
                
                // Generar factura automáticamente
                await this.generarFactura(orden.id);
            }
            
        } catch (error) {
            console.error('Error procesando pago:', error);
            this.mostrarError('Error procesando el pago. La orden se creó pero el pago falló.');
            
            // Mostrar confirmación sin pago
            this.mostrarConfirmacion(orden);
        } finally {
            this.mostrarLoadingPago(false);
        }
    }
    
    async generarFactura(ordenId) {
        try {
            const response = await fetch('api/facturacion.php?action=generar_factura', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orden_id: ordenId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('Factura generada:', data.data.factura);
                // Opcional: mostrar notificación de factura generada
                if (window.NotificacionesManager) {
                    NotificacionesManager.enviar('success', 'Factura Generada', 'Se ha generado tu factura automáticamente.');
                }
            }
        } catch (error) {
            console.error('Error generando factura:', error);
        }
    }
    
    mostrarLoadingPago(mostrar) {
        const btnProcesar = document.getElementById('btn-procesar-pago');
        if (btnProcesar) {
            btnProcesar.disabled = mostrar;
            btnProcesar.innerHTML = mostrar ? 
                '<i class="fas fa-spinner fa-spin"></i> Procesando Pago...' : 
                '<i class="fas fa-credit-card"></i> Procesar Pago';
        }
    }
    
    mostrarConfirmacionConPago(orden, resultadoPago) {
        const modal = document.getElementById('modal-confirmacion');
        const ordenDetails = document.getElementById('orden-details');
        
        if (ordenDetails) {
            ordenDetails.innerHTML = `
                <h4>Número de Orden: ${orden.numero_orden}</h4>
                <p><strong>Servicio:</strong> ${this.servicio.nombre}</p>
                <p><strong>Total:</strong> $${this.formatearPrecio(orden.total)}</p>
                <p><strong>Estado:</strong> ${this.obtenerEstadoTexto(orden.estado)}</p>
                <div class="pago-info">
                    <h5><i class="fas fa-credit-card"></i> Información de Pago</h5>
                    <p><strong>Método:</strong> ${resultadoPago.metodo}</p>
                    <p><strong>Referencia:</strong> ${resultadoPago.transaction_id}</p>
                    <p><strong>Estado del Pago:</strong> <span class="estado-pago ${resultadoPago.estado}">${resultadoPago.estado.toUpperCase()}</span></p>
                </div>
                ${orden.fecha_agendada ? `<p><strong>Fecha agendada:</strong> ${this.formatearFecha(orden.fecha_agendada)}</p>` : ''}
                ${orden.hora_agendada ? `<p><strong>Hora agendada:</strong> ${orden.hora_agendada}</p>` : ''}
            `;
        }
        
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    validarFormulario() {
        const camposRequeridos = document.querySelectorAll('#checkout-form [required]');
        let esValido = true;
        
        camposRequeridos.forEach(campo => {
            if (!this.validarCampo(campo)) {
                esValido = false;
            }
        });
        
        // Validar términos y condiciones
        const terminos = document.getElementById('acepto_terminos');
        if (!terminos.checked) {
            this.mostrarError('Debes aceptar los términos y condiciones');
            esValido = false;
        }
        
        return esValido;
    }
    
    mostrarConfirmacion(orden) {
        const modal = document.getElementById('modal-confirmacion');
        const ordenDetails = document.getElementById('orden-details');
        
        if (ordenDetails) {
            ordenDetails.innerHTML = `
                <h4>Número de Orden: ${orden.numero_orden}</h4>
                <p><strong>Servicio:</strong> ${this.servicio.nombre}</p>
                <p><strong>Total:</strong> $${this.formatearPrecio(orden.total)}</p>
                <p><strong>Estado:</strong> ${this.obtenerEstadoTexto(orden.estado)}</p>
                ${orden.fecha_agendada ? `<p><strong>Fecha agendada:</strong> ${this.formatearFecha(orden.fecha_agendada)}</p>` : ''}
                ${orden.hora_agendada ? `<p><strong>Hora agendada:</strong> ${orden.hora_agendada}</p>` : ''}
            `;
        }
        
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    mostrarError(mensaje) {
        // Crear notificación de error
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion-error';
        notificacion.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${mensaje}</span>
        `;
        
        // Estilos
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-left: 4px solid #ef4444;
            border-radius: 8px;
            padding: 16px 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notificacion);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            notificacion.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notificacion.remove(), 300);
        }, 5000);
    }
    
    mostrarLoading(mostrar) {
        const overlay = document.getElementById('loading-overlay');
        const btnConfirmar = document.getElementById('btn-confirmar');
        
        if (overlay) {
            overlay.style.display = mostrar ? 'flex' : 'none';
        }
        
        if (btnConfirmar) {
            btnConfirmar.disabled = mostrar;
            btnConfirmar.innerHTML = mostrar ? 
                '<i class="fas fa-spinner fa-spin"></i> Procesando...' : 
                '<i class="fas fa-check"></i> Confirmar Orden';
        }
    }
    
    formatearPrecio(precio) {
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(precio);
    }
    
    formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    obtenerEstadoTexto(estado) {
        const estados = {
            'pendiente': 'Pendiente',
            'confirmada': 'Confirmada',
            'en_proceso': 'En Proceso',
            'completada': 'Completada',
            'cancelada': 'Cancelada'
        };
        return estados[estado] || estado;
    }
}

// Funciones globales
function volverServicios() {
    window.location.href = 'index.html#servicios';
}

function cerrarModal() {
    const modal = document.getElementById('modal-confirmacion');
    if (modal) {
        modal.style.display = 'none';
    }
}

function irAInicio() {
    window.location.href = 'index.html';
}

function mostrarTerminos() {
    alert('Términos y condiciones:\n\n1. El servicio se realizará según las especificaciones acordadas.\n2. El pago debe realizarse según el método seleccionado.\n3. Se respetará la fecha y hora agendada, sujeto a disponibilidad.\n4. El cliente debe proporcionar acceso adecuado para realizar el servicio.\n5. Computec se reserva el derecho de cancelar el servicio si las condiciones no son adecuadas.');
}

function mostrarPolitica() {
    alert('Política de privacidad:\n\n1. Tus datos personales serán utilizados únicamente para procesar tu orden.\n2. No compartiremos tu información con terceros sin tu consentimiento.\n3. Mantenemos medidas de seguridad para proteger tu información.\n4. Puedes solicitar la eliminación de tus datos en cualquier momento.\n5. Para más información, contacta a soporte@computec.com');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutManager = new CheckoutManager();
});

// CSS adicional para animaciones
const additionalStyles = `
<style>
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.notificacion-error i {
    color: #ef4444;
    font-size: 18px;
}

.notificacion-error span {
    color: #dc2626;
    font-weight: 500;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
