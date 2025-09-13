/* ===== HEADER SIMPLE PARA PÁGINAS SEPARADAS ===== */

class SimpleHeaderManager {
    constructor() {
        this.header = null;
        this.navToggle = null;
        this.navActions = null;
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
    }

    bindElements() {
        this.header = document.querySelector('.header');
        this.navToggle = document.getElementById('nav-toggle');
        this.navActions = document.querySelector('.nav-actions');
    }

    bindEvents() {
        if (this.header) {
            window.addEventListener('scroll', () => this.handleScroll());
        }
        
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Cerrar menú móvil al hacer clic en un enlace
        if (this.navActions) {
            this.navActions.addEventListener('click', (e) => {
                if (e.target.closest('.nav-link')) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    handleScroll() {
        if (window.scrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }

    toggleMobileMenu() {
        this.header.classList.toggle('mobile-menu-open');
        this.navToggle.classList.toggle('active');
    }

    closeMobileMenu() {
        this.header.classList.remove('mobile-menu-open');
        this.navToggle.classList.remove('active');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SimpleHeaderManager();
});

/* ===== BOTÓN VOLVER ARRIBA ===== */

class BackToTopButton {
    constructor() {
        this.button = null;
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
    }

    bindElements() {
        this.button = document.getElementById('backToTop');
    }

    bindEvents() {
        if (this.button) {
            this.button.addEventListener('click', () => this.scrollToTop());
            window.addEventListener('scroll', () => this.toggleVisibility());
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    toggleVisibility() {
        if (window.scrollY > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
}

// Inicializar botón volver arriba
document.addEventListener('DOMContentLoaded', () => {
    new BackToTopButton();
});
