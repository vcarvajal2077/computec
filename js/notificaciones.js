/**
 * SISTEMA DE NOTIFICACIONES EN TIEMPO REAL
 * Maneja notificaciones push y alertas visuales
 */

class NotificacionesManager {
    constructor() {
        this.notificaciones = [];
        this.intervalo = null;
        this.apiBase = 'api/notificaciones.php';
        
        this.init();
    }
    
    init() {
        this.crearContenedorNotificaciones();
        this.bindEvents();
        this.iniciarPolling();
    }
    
    crearContenedorNotificaciones() {
        // Crear contenedor de notificaciones si no existe
        if (!document.getElementById('notificaciones-container')) {
            const container = document.createElement('div');
            container.id = 'notificaciones-container';
            container.className = 'notificaciones-container';
            document.body.appendChild(container);
        }
    }
    
    bindEvents() {
        // Escuchar notificaciones del sistema
        window.addEventListener('notificacion', (e) => {
            this.mostrarNotificacion(e.detail);
        });
        
        // Escuchar notificaciones de órdenes
        window.addEventListener('orden-creada', (e) => {
            this.mostrarNotificacionOrden(e.detail);
        });
    }
    
    iniciarPolling() {
        // Solo iniciar polling si hay usuario logueado
        const userData = localStorage.getItem('usuario_logueado');
        if (!userData) {
            return;
        }
        
        // Verificar notificaciones cada 30 segundos
        this.intervalo = setInterval(() => {
            this.verificarNotificaciones();
        }, 30000);
        
        // Primera verificación inmediata
        this.verificarNotificaciones();
    }
    
    async verificarNotificaciones() {
        try {
            // Verificar si hay usuario logueado
            const userData = localStorage.getItem('usuario_logueado');
            if (!userData) {
                // Si no hay usuario, detener el polling
                if (this.intervalo) {
                    clearInterval(this.intervalo);
                    this.intervalo = null;
                }
                return;
            }
            
            const response = await fetch(`${this.apiBase}?action=historial&limite=5`);
            
            // Verificar si la respuesta es JSON válida
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('API de notificaciones no disponible o devolvió respuesta no-JSON');
                return;
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.procesarNotificaciones(data.data.notificaciones);
            }
        } catch (error) {
            // Silenciar errores si no hay usuario logueado
            const userData = localStorage.getItem('usuario_logueado');
            if (userData) {
                console.error('Error verificando notificaciones:', error);
            }
        }
    }
    
    procesarNotificaciones(notificaciones) {
        // Procesar solo notificaciones nuevas
        const nuevasNotificaciones = notificaciones.filter(notif => 
            !this.notificaciones.find(existente => existente.id === notif.id)
        );
        
        nuevasNotificaciones.forEach(notificacion => {
            this.mostrarNotificacion({
                tipo: notificacion.tipo,
                titulo: notificacion.asunto || 'Nueva Notificación',
                mensaje: notificacion.mensaje,
                timestamp: notificacion.fecha_envio
            });
        });
        
        this.notificaciones = notificaciones;
    }
    
    mostrarNotificacion(datos) {
        const container = document.getElementById('notificaciones-container');
        if (!container) return;
        
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${datos.tipo || 'info'}`;
        notificacion.innerHTML = `
            <div class="notificacion-content">
                <div class="notificacion-icon">
                    <i class="${this.obtenerIcono(datos.tipo)}"></i>
                </div>
                <div class="notificacion-texto">
                    <h4 class="notificacion-titulo">${datos.titulo}</h4>
                    <p class="notificacion-mensaje">${datos.mensaje}</p>
                    ${datos.timestamp ? `<span class="notificacion-tiempo">${this.formatearTiempo(datos.timestamp)}</span>` : ''}
                </div>
                <button class="notificacion-cerrar" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(notificacion);
        
        // Animar entrada
        setTimeout(() => {
            notificacion.classList.add('mostrar');
        }, 100);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.classList.add('ocultar');
                setTimeout(() => {
                    if (notificacion.parentNode) {
                        notificacion.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    mostrarNotificacionOrden(orden) {
        this.mostrarNotificacion({
            tipo: 'success',
            titulo: '¡Orden Confirmada!',
            mensaje: `Tu orden #${orden.numero_orden} ha sido procesada exitosamente. Total: $${this.formatearPrecio(orden.total)}`,
            timestamp: new Date().toISOString()
        });
    }
    
    obtenerIcono(tipo) {
        const iconos = {
            'email': 'fas fa-envelope',
            'whatsapp': 'fab fa-whatsapp',
            'sms': 'fas fa-sms',
            'success': 'fas fa-check-circle',
            'info': 'fas fa-info-circle',
            'warning': 'fas fa-exclamation-triangle',
            'error': 'fas fa-times-circle'
        };
        return iconos[tipo] || 'fas fa-bell';
    }
    
    formatearTiempo(timestamp) {
        const ahora = new Date();
        const tiempo = new Date(timestamp);
        const diffMs = ahora - tiempo;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Hace ${diffHours}h`;
        
        const diffDays = Math.floor(diffHours / 24);
        return `Hace ${diffDays}d`;
    }
    
    formatearPrecio(precio) {
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(precio);
    }
    
    // Método para enviar notificación personalizada
    static enviar(tipo, titulo, mensaje) {
        const evento = new CustomEvent('notificacion', {
            detail: { tipo, titulo, mensaje }
        });
        window.dispatchEvent(evento);
    }
    
    // Método para notificar orden creada
    static notificarOrden(orden) {
        const evento = new CustomEvent('orden-creada', {
            detail: orden
        });
        window.dispatchEvent(evento);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.notificacionesManager = new NotificacionesManager();
});

// CSS para notificaciones
const notificacionesStyles = `
<style>
.notificaciones-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 400px;
}

.notificacion {
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-left: 4px solid #3b82f6;
    overflow: hidden;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
    max-width: 100%;
}

.notificacion.mostrar {
    transform: translateX(0);
    opacity: 1;
}

.notificacion.ocultar {
    transform: translateX(100%);
    opacity: 0;
}

.notificacion-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
}

.notificacion-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.notificacion-email .notificacion-icon {
    background: #dbeafe;
    color: #3b82f6;
}

.notificacion-whatsapp .notificacion-icon {
    background: #dcfce7;
    color: #16a34a;
}

.notificacion-sms .notificacion-icon {
    background: #fef3c7;
    color: #d97706;
}

.notificacion-success .notificacion-icon {
    background: #dcfce7;
    color: #16a34a;
}

.notificacion-info .notificacion-icon {
    background: #dbeafe;
    color: #3b82f6;
}

.notificacion-warning .notificacion-icon {
    background: #fef3c7;
    color: #d97706;
}

.notificacion-error .notificacion-icon {
    background: #fecaca;
    color: #dc2626;
}

.notificacion-texto {
    flex: 1;
    min-width: 0;
}

.notificacion-titulo {
    margin: 0 0 4px 0;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.4;
}

.notificacion-mensaje {
    margin: 0 0 4px 0;
    font-size: 13px;
    color: #64748b;
    line-height: 1.4;
    word-wrap: break-word;
}

.notificacion-tiempo {
    font-size: 11px;
    color: #9ca3af;
    font-weight: 500;
}

.notificacion-cerrar {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notificacion-cerrar:hover {
    background: #f1f5f9;
    color: #64748b;
}

/* Responsive */
@media (max-width: 768px) {
    .notificaciones-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
    }
    
    .notificacion {
        transform: translateY(-100%);
    }
    
    .notificacion.mostrar {
        transform: translateY(0);
    }
    
    .notificacion.ocultar {
        transform: translateY(-100%);
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificacionesStyles);
