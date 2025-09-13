/**
 * Productos por Categorías - Funcionalidad Interactiva
 * Maneja el comportamiento del acordeón de categorías de productos
 */

class ProductosCategorias {
    constructor() {
        this.categories = document.querySelectorAll('.producto-categoria');
        this.init();
    }

    init() {
        this.bindEvents();
        this.setInitialState();
    }

    bindEvents() {
        this.categories.forEach(category => {
            const header = category.querySelector('.categoria-header');
            if (header) {
                header.addEventListener('click', () => {
                    this.toggleCategory(category);
                });
            }
        });
    }

    setInitialState() {
        // Abrir la primera categoría por defecto
        if (this.categories.length > 0) {
            this.categories[0].classList.add('active');
        }
    }

    toggleCategory(category) {
        const isActive = category.classList.contains('active');
        
        // Cerrar todas las categorías
        this.categories.forEach(cat => {
            cat.classList.remove('active');
        });
        
        // Si la categoría clickeada no estaba activa, abrirla
        if (!isActive) {
            category.classList.add('active');
        }
    }

    // Método para abrir una categoría específica por nombre
    openCategory(categoryName) {
        const category = document.querySelector(`[data-category="${categoryName}"]`);
        if (category) {
            this.categories.forEach(cat => {
                cat.classList.remove('active');
            });
            category.classList.add('active');
        }
    }

    // Método para cerrar todas las categorías
    closeAll() {
        this.categories.forEach(cat => {
            cat.classList.remove('active');
        });
    }

    // Método para abrir todas las categorías
    openAll() {
        this.categories.forEach(cat => {
            cat.classList.add('active');
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ProductosCategorias();
});

// Exportar para uso global si es necesario
window.ProductosCategorias = ProductosCategorias;
