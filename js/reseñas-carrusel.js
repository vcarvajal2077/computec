/**
 * Carrusel de Reseñas de Clientes
 * Conecta con la base de datos a través de la API
 */

class ReseñasCarrusel {
    constructor() {
        this.reseñas = [];
        this.currentIndex = 0;
        this.itemsPerView = 3;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Inicializando carrusel de reseñas...');
        await this.loadReseñas();
        this.renderCarrusel();
        this.bindEvents();
        this.startAutoplay();
        console.log('✅ Carrusel de reseñas inicializado');
    }
    
    async loadReseñas() {
        try {
            console.log('📡 Cargando reseñas desde la API...');
            const response = await fetch('api/reseñas-carrusel.php?action=reseñas');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📡 Respuesta de la API:', data);
            
            if (data.success && data.data) {
                this.reseñas = data.data;
                console.log('✅ Reseñas cargadas:', this.reseñas.length);
            } else {
                throw new Error('No se pudieron cargar las reseñas desde la API');
            }
        } catch (error) {
            console.error('❌ Error al cargar reseñas:', error);
            // Usar reseñas de ejemplo en caso de error
            this.reseñas = [
                {
                    id: 1,
                    nombre: "Cliente Ejemplo",
                    empresa: "Empresa Demo",
                    comentario: "Excelente servicio técnico",
                    calificación: 5,
                    servicio: "Mantenimiento",
                    fecha: "01/01/2025"
                }
            ];
        }
    }
    
    renderCarrusel() {
        const container = document.getElementById('reseñas-carrusel');
        if (!container) {
            console.error('❌ No se encontró el contenedor #reseñas-carrusel');
            return;
        }
        
        console.log('🎨 Renderizando carrusel con', this.reseñas.length, 'reseñas');
        
        const carruselHTML = `
            <div class="carrusel-container">
                <div class="carrusel-wrapper">
                    ${this.reseñas.map(reseña => this.createReseñaCard(reseña)).join('')}
                </div>
            </div>
        `;
        
        container.innerHTML = carruselHTML;
        this.wrapper = container.querySelector('.carrusel-wrapper');
        
        console.log('✅ Carrusel renderizado');
    }
    
    createReseñaCard(reseña) {
        const estrellas = this.generateStars(reseña.calificación);
        
        return `
            <div class="reseña-card" data-id="${reseña.id}">
                <div class="reseña-header">
                    <div class="reseña-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="reseña-info">
                        <h4 class="reseña-nombre">${reseña.nombre}</h4>
                        <p class="reseña-empresa">${reseña.empresa}</p>
                        <div class="reseña-calificación">
                            ${estrellas}
                        </div>
                    </div>
                </div>
                
                <div class="reseña-contenido">
                    <p class="reseña-comentario">"${reseña.comentario}"</p>
                </div>
                
                <div class="reseña-footer">
                    <span class="reseña-servicio">${reseña.servicio}</span>
                    <span class="reseña-fecha">${reseña.fecha}</span>
                </div>
            </div>
        `;
    }
    
    generateStars(calificación) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= calificación) {
                stars += '<i class="fas fa-star filled"></i>';
            } else {
                stars += '<i class="fas fa-star"></i>';
            }
        }
        return stars;
    }
    
    
    // Métodos de navegación eliminados - ahora se usa scroll nativo
    
    startAutoplay() {
        // Autoplay deshabilitado para navegación por scroll
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    bindEvents() {
        // Eventos de scroll nativo - no se necesitan eventos adicionales
        console.log('📱 Navegación por scroll habilitada');
    }
    
    adjustItemsPerView() {
        // Ajuste responsivo para scroll - no se necesita actualizar carrusel
        if (window.innerWidth <= 768) {
            this.itemsPerView = 1;
        } else if (window.innerWidth <= 1024) {
            this.itemsPerView = 2;
        } else {
            this.itemsPerView = 3;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ReseñasCarrusel();
});
