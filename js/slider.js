class DynamicSlider {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            autoplay: true,
            autoplaySpeed: 5000,
            showArrows: true,
            showIndicators: true,
            showNavigation: true,
            ...options
        };
        
        this.currentSlide = 0;
        this.slides = [];
        this.autoplayInterval = null;
        this.isPaused = false;
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadSliderContent();
            this.renderSlider();
            this.bindEvents();
            if (this.options.autoplay) {
                this.startAutoplay();
            }
        } catch (error) {
            console.error('Error inicializando slider:', error);
            this.showError();
        }
    }
    
    async loadSliderContent() {
        try {
            const response = await fetch('api/slider-content.php');
            const data = await response.json();
            
            if (data.success && data.data.length > 0) {
                this.slides = data.data;
            } else {
                // Contenido por defecto si no hay datos
                this.slides = this.getDefaultSlides();
            }
        } catch (error) {
            console.error('Error cargando contenido del slider:', error);
            this.slides = this.getDefaultSlides();
        }
    }
    
    getDefaultSlides() {
        return [
            {
                id: 1,
                tipo: 'anuncio',
                titulo: '¡Bienvenido a Computec!',
                descripcion: 'Tu socio tecnológico de confianza para reparaciones y ventas de computadoras.',
                imagen: 'https://via.placeholder.com/800x400/007bff/ffffff?text=Bienvenido+a+Computec',
                url_destino: '#',
                categoria: 'promocion'
            },
            {
                id: 2,
                tipo: 'evento',
                titulo: 'Servicios Profesionales',
                descripcion: 'Reparación, mantenimiento y venta de equipos con garantía.',
                imagen: 'https://via.placeholder.com/800x400/28a745/ffffff?text=Servicios+Profesionales',
                url_destino: '#',
                categoria: 'servicios'
            }
        ];
    }
    
    renderSlider() {
        if (this.slides.length === 0) return;
        
        this.container.innerHTML = `
            <div class="slider-container">
                <div class="slider-wrapper">
                    ${this.slides.map((slide, index) => this.renderSlide(slide, index)).join('')}
                </div>
                
                ${this.options.showArrows ? `
                    <button class="slider-arrow slider-prev" aria-label="Slide anterior">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>
                    <button class="slider-arrow slider-next" aria-label="Slide siguiente">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                ` : ''}
                
                ${this.options.showIndicators ? `
                    <div class="slider-indicators">
                        ${this.slides.map((_, index) => `
                            <button class="slider-indicator ${index === 0 ? 'active' : ''}" 
                                    data-slide="${index}" 
                                    aria-label="Ir al slide ${index + 1}">
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${this.options.showNavigation ? `
                    <div class="slider-navigation">
                        <button class="slider-pause" aria-label="Pausar autoplay">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="6" y="4" width="4" height="16"/>
                                <rect x="14" y="4" width="4" height="16"/>
                            </svg>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        this.showSlide(0);
    }
    
    renderSlide(slide, index) {
        const badge = slide.tipo === 'evento' ? `<span class="slide-badge">${slide.categoria}</span>` : '';
        const discount = slide.descuento ? `<span class="slide-discount">${slide.descuento}</span>` : '';
        const prices = slide.precio_original && slide.precio_oferta ? 
            `<div class="slide-prices">
                <span class="price-original">$${slide.precio_original}</span>
                <span class="price-offer">$${slide.precio_oferta}</span>
            </div>` : '';
        
        return `
            <div class="slider-slide ${index === 0 ? 'active' : ''}" data-slide="${index}">
                <div class="slide-image">
                    <img src="${slide.imagen}" alt="${slide.titulo}" loading="lazy">
                    ${badge}
                    ${discount}
                </div>
                <div class="slide-content">
                    <h2 class="slide-title">${slide.titulo}</h2>
                    <p class="slide-description">${slide.descripcion}</p>
                    ${prices}
                    <a href="${slide.url_destino}" class="slide-button">
                        ${slide.tipo === 'evento' ? 'Ver Oferta' : 'Ver Más'}
                    </a>
                </div>
            </div>
        `;
    }
    
    showSlide(index) {
        if (index < 0) index = this.slides.length - 1;
        if (index >= this.slides.length) index = 0;
        
        // Ocultar slide actual
        const currentSlide = this.container.querySelector('.slider-slide.active');
        if (currentSlide) {
            currentSlide.classList.remove('active');
        }
        
        // Mostrar nuevo slide
        const newSlide = this.container.querySelector(`[data-slide="${index}"]`);
        if (newSlide) {
            newSlide.classList.add('active');
        }
        
        // Actualizar indicadores
        const currentIndicator = this.container.querySelector('.slider-indicator.active');
        if (currentIndicator) {
            currentIndicator.classList.remove('active');
        }
        
        const newIndicator = this.container.querySelector(`[data-slide="${index}"]`);
        if (newIndicator) {
            newIndicator.classList.add('active');
        }
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }
    
    goToSlide(index) {
        this.showSlide(index);
    }
    
    startAutoplay() {
        if (this.autoplayInterval) return;
        
        this.autoplayInterval = setInterval(() => {
            if (!this.isPaused) {
                this.nextSlide();
            }
        }, this.options.autoplaySpeed);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    pauseAutoplay() {
        this.isPaused = true;
        const pauseBtn = this.container.querySelector('.slider-pause');
        if (pauseBtn) {
            pauseBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5,3 19,12 5,21"/>
                </svg>
            `;
            pauseBtn.setAttribute('aria-label', 'Reanudar autoplay');
        }
    }
    
    resumeAutoplay() {
        this.isPaused = false;
        const pauseBtn = this.container.querySelector('.slider-pause');
        if (pauseBtn) {
            pauseBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
            `;
            pauseBtn.setAttribute('aria-label', 'Pausar autoplay');
        }
    }
    
    bindEvents() {
        // Navegación con flechas
        const prevBtn = this.container.querySelector('.slider-prev');
        const nextBtn = this.container.querySelector('.slider-next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Indicadores
        const indicators = this.container.querySelectorAll('.slider-indicator');
        indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.goToSlide(slideIndex);
            });
        });
        
        // Botón de pausa/reanudar
        const pauseBtn = this.container.querySelector('.slider-pause');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (this.isPaused) {
                    this.resumeAutoplay();
                } else {
                    this.pauseAutoplay();
                }
            });
        }
        
        // Pausar en hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.resumeAutoplay());
        
        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                if (this.isPaused) this.resumeAutoplay();
                else this.pauseAutoplay();
            }
        });
        
        // Touch events para dispositivos móviles
        let startX = 0;
        let endX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
    
    showError() {
        this.container.innerHTML = `
            <div class="slider-error">
                <p>No se pudo cargar el contenido del slider</p>
                <button onclick="location.reload()">Reintentar</button>
            </div>
        `;
    }
    
    destroy() {
        this.stopAutoplay();
        this.container.innerHTML = '';
    }
}

// Inicializar slider cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.getElementById('hero-slider');
    if (sliderContainer) {
        window.heroSlider = new DynamicSlider('hero-slider', {
            autoplay: true,
            autoplaySpeed: 5000,
            showArrows: true,
            showIndicators: true,
            showNavigation: true
        });
    }
});
