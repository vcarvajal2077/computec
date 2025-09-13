/**
 * Hero Servicios - Funcionalidad Simplificada
 * Maneja las animaciones y efectos de las tarjetas de servicios en el hero
 */

class HeroServicios {
    constructor() {
        this.serviceCards = document.querySelectorAll('.hero-service-card');
        this.productCards = document.querySelectorAll('.hero-producto-card');
        this.statItems = document.querySelectorAll('.stat-item');
        this.valueItems = document.querySelectorAll('.value-item');
        this.contactItems = document.querySelectorAll('.contact-item');
        this.contactBtns = document.querySelectorAll('.contact-btn');
        this.init();
    }

    init() {
        // Mostrar elementos inmediatamente
        this.showElementsImmediately();
        this.addScrollAnimations();
        this.addHoverEffects();
    }

    showElementsImmediately() {
        // Mostrar todas las tarjetas inmediatamente
        this.serviceCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        
        this.productCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        
        this.statItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
        
        this.valueItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
        
        this.contactItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        });
        
        this.contactBtns.forEach(btn => {
            btn.style.opacity = '1';
            btn.style.transform = 'translateX(0)';
        });
    }

    addScrollAnimations() {
        // Intersection Observer para animaciones al hacer scroll
        const observerOptions = {
            // Dispara apenas 1px sea visible y aún antes gracias al margen inferior
            threshold: 0,
            rootMargin: '0px 0px 300px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Aplicar animación a las tarjetas de servicios (solo si no están visibles)
        this.serviceCards.forEach((card, index) => {
            if (card.style.opacity !== '1') {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `all 0.45s ease ${index * 0.06}s`;
            }
            observer.observe(card);
        });

        // Aplicar animación a las tarjetas de productos
        this.productCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.45s ease ${(index + this.serviceCards.length) * 0.06}s`;
            
            observer.observe(card);
        });

        // Aplicar animación a las estadísticas
        this.statItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `all 0.45s ease ${(index + this.serviceCards.length + this.productCards.length) * 0.06}s`;
            
            observer.observe(item);
        });

        // Aplicar animación a los valores
        this.valueItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `all 0.45s ease ${(index + this.serviceCards.length + this.productCards.length + this.statItems.length) * 0.06}s`;
            
            observer.observe(item);
        });

        // Aplicar animación a los elementos de contacto
        this.contactItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = `all 0.45s ease ${(index + this.serviceCards.length + this.productCards.length + this.statItems.length + this.valueItems.length) * 0.06}s`;
            
            observer.observe(item);
        });

        // Aplicar animación a los botones de contacto
        this.contactBtns.forEach((btn, index) => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateX(30px)';
            btn.style.transition = `all 0.45s ease ${(index + this.serviceCards.length + this.productCards.length + this.statItems.length + this.valueItems.length + this.contactItems.length) * 0.06}s`;
            
            observer.observe(btn);
        });
    }

    addHoverEffects() {
        // Agregar efectos hover a las tarjetas de servicios
        this.serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addCardHoverEffect(card);
            });

            card.addEventListener('mouseleave', () => {
                this.removeCardHoverEffect(card);
            });
        });

        // Agregar efectos hover a las tarjetas de productos
        this.productCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addCardHoverEffect(card);
            });

            card.addEventListener('mouseleave', () => {
                this.removeCardHoverEffect(card);
            });
        });

        // Agregar efectos hover a las estadísticas
        this.statItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.addStatHoverEffect(item);
            });

            item.addEventListener('mouseleave', () => {
                this.removeStatHoverEffect(item);
            });
        });

        // Agregar efectos hover a los valores
        this.valueItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.addValueHoverEffect(item);
            });

            item.addEventListener('mouseleave', () => {
                this.removeValueHoverEffect(item);
            });
        });

        // Agregar efectos hover a los elementos de contacto
        this.contactItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.addContactHoverEffect(item);
            });

            item.addEventListener('mouseleave', () => {
                this.removeContactHoverEffect(item);
            });
        });

        // Agregar efectos hover a los botones de contacto
        this.contactBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.addButtonHoverEffect(btn);
            });

            btn.addEventListener('mouseleave', () => {
                this.removeButtonHoverEffect(btn);
            });
        });
    }

    addCardHoverEffect(card) {
        const serviceIcon = card.querySelector('.hero-service-icon i');
        const serviceBtn = card.querySelector('.hero-service-btn');
        const productIcon = card.querySelector('.hero-producto-icon i');
        const productBtn = card.querySelector('.hero-producto-btn');
        if (serviceIcon) {
            serviceIcon.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        if (serviceBtn) {
            serviceBtn.style.transform = 'translateY(-2px)';
        }

        if (productIcon) {
            productIcon.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        if (productBtn) {
            productBtn.style.transform = 'translateY(-2px)';
        }
    }

    removeCardHoverEffect(card) {
        const serviceIcon = card.querySelector('.hero-service-icon i');
        const serviceBtn = card.querySelector('.hero-service-btn');
        const productIcon = card.querySelector('.hero-producto-icon i');
        const productBtn = card.querySelector('.hero-producto-btn');
        if (serviceIcon) {
            serviceIcon.style.transform = 'scale(1) rotate(0deg)';
        }
        
        if (serviceBtn) {
            serviceBtn.style.transform = 'translateY(0)';
        }

        if (productIcon) {
            productIcon.style.transform = 'scale(1) rotate(0deg)';
        }
        
        if (productBtn) {
            productBtn.style.transform = 'translateY(0)';
        }
    }

    addStatHoverEffect(item) {
        const statNumber = item.querySelector('.stat-number');
        if (statNumber) {
            statNumber.style.transform = 'scale(1.1)';
            statNumber.style.textShadow = '0 4px 8px rgba(0, 0, 0, 0.4)';
        }
    }

    removeStatHoverEffect(item) {
        const statNumber = item.querySelector('.stat-number');
        if (statNumber) {
            statNumber.style.transform = 'scale(1)';
            statNumber.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
        }
    }

    addValueHoverEffect(item) {
        const valueIcon = item.querySelector('.value-icon i');
        if (valueIcon) {
            valueIcon.style.transform = 'scale(1.2) rotate(10deg)';
        }
    }

    removeValueHoverEffect(item) {
        const valueIcon = item.querySelector('.value-icon i');
        if (valueIcon) {
            valueIcon.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    addContactHoverEffect(item) {
        const contactIcon = item.querySelector('.contact-icon i');
        if (contactIcon) {
            contactIcon.style.transform = 'scale(1.2) rotate(10deg)';
        }
    }

    removeContactHoverEffect(item) {
        const contactIcon = item.querySelector('.contact-icon i');
        if (contactIcon) {
            contactIcon.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    addButtonHoverEffect(btn) {
        const btnIcon = btn.querySelector('i');
        if (btnIcon) {
            btnIcon.style.transform = 'scale(1.2) rotate(5deg)';
        }
    }

    removeButtonHoverEffect(btn) {
        const btnIcon = btn.querySelector('i');
        if (btnIcon) {
            btnIcon.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    // Método para agregar efecto de partículas al hacer clic (opcional)
    addParticleEffect(card) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#007bff';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';

            document.body.appendChild(particle);

            const angle = (i / 6) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;

            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }
}

// Función global para scroll a sección
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new HeroServicios();
});

// Exportar para uso global si es necesario
window.HeroServicios = HeroServicios;
