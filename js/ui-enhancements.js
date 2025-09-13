/**
 * MEJORAS DE INTERFAZ - JAVASCRIPT
 * Funcionalidades para mejorar la experiencia de usuario
 */

class UIEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupLoadingStates();
        this.setupNotifications();
        this.setupFormEnhancements();
        this.setupButtonEnhancements();
        this.setupCardHoverEffects();
    }

    /**
     * Configurar animaciones de scroll
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observar elementos con clase animable
        document.querySelectorAll('.hero-producto-card, .servicio-item, .producto-item, .stat-item, .value-item').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Configurar estados de carga
     */
    setupLoadingStates() {
        // Interceptar formularios para mostrar loading
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                this.showLoadingOverlay();
            });
        });

        // Interceptar botones de pago
        document.querySelectorAll('.btn-procesar-pago, .btn-confirmar-orden').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showButtonLoading(btn);
            });
        });
    }

    /**
     * Configurar sistema de notificaciones
     */
    setupNotifications() {
        // Crear contenedor de notificaciones si no existe
        if (!document.querySelector('.notifications-container')) {
            const container = document.createElement('div');
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }
    }

    /**
     * Configurar mejoras de formularios
     */
    setupFormEnhancements() {
        // Mejorar inputs con labels flotantes
        document.querySelectorAll('.form-input-modern').forEach(input => {
            this.setupFloatingLabel(input);
        });

        // Validación en tiempo real
        document.querySelectorAll('input[required], textarea[required]').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    /**
     * Configurar mejoras de botones
     */
    setupButtonEnhancements() {
        // Efecto ripple en botones
        document.querySelectorAll('.btn-modern, .btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createRippleEffect(e, btn);
            });
        });
    }

    /**
     * Configurar efectos hover en tarjetas
     */
    setupCardHoverEffects() {
        document.querySelectorAll('.card-modern, .checkout-summary, .payment-methods-container').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * Mostrar overlay de carga
     */
    showLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner-modern"></div>
            <div class="loading-text">Procesando...</div>
        `;
        document.body.appendChild(overlay);
        overlay.style.display = 'flex';
    }

    /**
     * Ocultar overlay de carga
     */
    hideLoadingOverlay() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    /**
     * Mostrar loading en botón
     */
    showButtonLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = `
            <div class="loading-spinner-modern" style="width: 20px; height: 20px; border-width: 2px;"></div>
            <span>Procesando...</span>
        `;
        button.disabled = true;

        // Restaurar después de 3 segundos (o cuando se complete la acción)
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 3000);
    }

    /**
     * Mostrar notificación
     */
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        const container = document.querySelector('.notifications-container') || document.body;
        container.appendChild(notification);

        // Mostrar con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Ocultar después del tiempo especificado
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }

    /**
     * Configurar label flotante
     */
    setupFloatingLabel(input) {
        const label = input.nextElementSibling;
        if (!label || !label.classList.contains('form-label-modern')) return;

        input.addEventListener('focus', () => {
            label.classList.add('active');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                label.classList.remove('active');
            }
        });

        // Verificar si ya tiene valor
        if (input.value) {
            label.classList.add('active');
        }
    }

    /**
     * Validar campo
     */
    validateField(field) {
        const isValid = field.checkValidity();
        const container = field.closest('.form-group-modern') || field.parentElement;

        if (isValid) {
            container.classList.remove('error');
            container.classList.add('success');
        } else {
            container.classList.remove('success');
            container.classList.add('error');
        }

        return isValid;
    }

    /**
     * Crear efecto ripple
     */
    createRippleEffect(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Animar contador
     */
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    /**
     * Mostrar progreso
     */
    showProgress(container, percentage) {
        const progressBar = container.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }

    /**
     * Efecto de escritura
     */
    typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';

        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }
}

// Agregar estilos para ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar mejoras de UI cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.uiEnhancements = new UIEnhancements();
});

// Exportar para uso global
window.UIEnhancements = UIEnhancements;
