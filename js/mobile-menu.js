/* ========================================
   MOBILE MENU FUNCTIONALITY
   ======================================== */

class MobileMenu {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navActions = document.querySelector('.nav-actions');
        this.mobileOverlay = null;
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.hamburger || !this.navActions) return;
        
        this.createOverlay();
        this.bindEvents();
        this.handleResize();
    }
    
    createOverlay() {
        // Crear overlay para el menú móvil
        this.mobileOverlay = document.createElement('div');
        this.mobileOverlay.className = 'mobile-overlay';
        document.body.appendChild(this.mobileOverlay);
    }
    
    bindEvents() {
        // Toggle del menú hamburguesa
        this.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
        
        // Cerrar menú al hacer clic en overlay
        this.mobileOverlay.addEventListener('click', () => {
            this.closeMenu();
        });
        
        // Cerrar menú al hacer clic en enlaces
        this.navActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                this.closeMenu();
            }
        });
        
        // Cerrar menú al hacer scroll
        window.addEventListener('scroll', () => {
            if (this.isMenuOpen) {
                this.closeMenu();
            }
        });
        
        // Manejar resize de ventana
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isMenuOpen = true;
        
        // Activar hamburguesa
        this.hamburger.classList.add('active');
        
        // Mostrar menú
        this.navActions.classList.add('mobile-active');
        
        // Mostrar overlay
        this.mobileOverlay.classList.add('active');
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        // Agregar clase al header para indicar que el menú está abierto
        document.querySelector('.header').classList.add('menu-open');
        
        // Animar elementos del menú
        this.animateMenuItems();
    }
    
    closeMenu() {
        if (!this.isMenuOpen) return;
        
        this.isMenuOpen = false;
        
        // Desactivar hamburguesa
        this.hamburger.classList.remove('active');
        
        // Ocultar menú
        this.navActions.classList.remove('mobile-active');
        
        // Ocultar overlay
        this.mobileOverlay.classList.remove('active');
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        // Remover clase del header
        document.querySelector('.header').classList.remove('menu-open');
    }
    
    animateMenuItems() {
        const menuItems = this.navActions.querySelectorAll('.nav-link');
        
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }
    
    handleResize() {
        // Si la ventana es más grande que 768px, cerrar el menú
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMenu();
        }
    }
    
    // Método público para cerrar el menú desde otros scripts
    close() {
        this.closeMenu();
    }
    
    // Método público para abrir el menú desde otros scripts
    open() {
        this.openMenu();
    }
    
    // Método público para verificar si el menú está abierto
    isOpen() {
        return this.isMenuOpen;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.mobileMenu = new MobileMenu();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileMenu;
}
