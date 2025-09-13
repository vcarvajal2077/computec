// Variables globales
let currentSection = 'inicio';
let isMenuOpen = false;

// Elementos del DOM
const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollIndicator = document.querySelector('.scroll-indicator');
const contactForm = document.getElementById('contactForm');
const productButtons = document.querySelectorAll('.btn-product');
const sections = document.querySelectorAll('section[id]');

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Función principal de inicialización
function initializeWebsite() {
    setupScrollEffects();
    setupMobileMenu();
    setupContactForm();
    setupProductModals();
    setupProductFilters();
    setupFAQ();
    setupAnimations();
    setupWhatsAppButton();
    setupActiveNavigation();
}

// Efectos de scroll
function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        // Header con efecto de scroll
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Navegación activa
function setupActiveNavigation() {
    // Obtener la página actual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Marcar el enlace activo
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Menú móvil
function setupMobileMenu() {
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                isMenuOpen = false;
                document.body.style.overflow = '';
            }
        });
    }
}

// Scroll suave


// Filtros de productos
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Actualizar botones activos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar productos
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'todos' || cardCategory === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// FAQ
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Cerrar todos los items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Abrir el item clickeado si no estaba activo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Formulario de contacto
function setupContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                showSuccessMessage();
                contactForm.reset();
            }
        });
        
        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

// Validar formulario
function validateForm() {
    const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Limpiar errores previos
    clearFieldError(field);
    
    // Validaciones específicas
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un email válido';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 7) {
                isValid = false;
                errorMessage = 'Ingresa un teléfono válido';
            }
            break;
            
        case 'service':
            if (value === '') {
                isValid = false;
                errorMessage = 'Selecciona un servicio';
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'El mensaje debe tener al menos 10 caracteres';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Mostrar error de campo
function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--danger-color)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

// Limpiar error de campo
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            background: var(--success-color);
            color: white;
            padding: 1rem;
            border-radius: var(--radius-md);
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 600;
        ">
            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
            ¡Mensaje enviado exitosamente! Te contactaremos pronto.
        </div>
    `;
    
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    
    // Remover mensaje después de 5 segundos
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Modales de productos
function setupProductModals() {
    productButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productDescription = productCard.querySelector('p').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            showProductModal(productName, productDescription, productPrice, productImage);
        });
    });
}

// Mostrar modal de producto
function showProductModal(name, description, price, image) {
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${image}" alt="${name}">
                    </div>
                    <div class="modal-info">
                        <h3>${name}</h3>
                        <p>${description}</p>
                        <div class="modal-price">${price}</div>
                        <div class="modal-actions">
                            <button class="btn btn-primary">
                                <i class="fab fa-whatsapp"></i>
                                Consultar por WhatsApp
                            </button>
                            <button class="btn btn-secondary">
                                <i class="fas fa-phone"></i>
                                Llamar ahora
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Estilos del modal
    const modalStyles = `
        <style>
            .product-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            
            .modal-content {
                position: relative;
                background: white;
                border-radius: var(--radius-xl);
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: var(--shadow-xl);
            }
            
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: var(--text-secondary);
                z-index: 1;
            }
            
            .modal-close:hover {
                color: var(--text-primary);
            }
            
            .modal-body {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
            }
            
            .modal-image img {
                width: 100%;
                height: auto;
                border-radius: var(--radius-lg);
            }
            
            .modal-info h3 {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: var(--text-primary);
            }
            
            .modal-info p {
                color: var(--text-secondary);
                margin-bottom: 1rem;
                line-height: 1.6;
            }
            
            .modal-price {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--primary-color);
                margin-bottom: 1.5rem;
            }
            
            .modal-actions {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            @media (max-width: 768px) {
                .modal-body {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                    padding: 1.5rem;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', modalStyles);
    document.body.appendChild(modal);
    
    // Cerrar modal
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => removeModal(modal));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            removeModal(modal);
        }
    });
    
    // Acciones de los botones del modal
    const whatsappBtn = modal.querySelector('.btn-primary');
    const callBtn = modal.querySelector('.btn-secondary');
    
    whatsappBtn.addEventListener('click', () => {
        const message = `Hola, estoy interesado en el producto: ${name}`;
        const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
    
    callBtn.addEventListener('click', () => {
        window.location.href = 'tel:+573001234567';
    });
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

// Remover modal
function removeModal(modal) {
    modal.remove();
    document.body.style.overflow = '';
}

// Animaciones
function setupAnimations() {
    // Animación de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos animables
    const animatableElements = document.querySelectorAll('.service-card, .product-card, .testimonial-card, .feature, .stat-item, .team-member, .certification-item, .info-card, .process-step');
    
    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Botón de WhatsApp
function setupWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-button');
    
    if (whatsappBtn) {
        // Animación de pulso
        setInterval(() => {
            whatsappBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                whatsappBtn.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
        
        // Mensaje personalizado según la página
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            let message = 'Hola, me gustaría obtener más información sobre sus servicios.';
            
            switch (currentPage) {
                case 'productos.html':
                    message = 'Hola, me gustaría consultar sobre sus productos.';
                    break;
                case 'servicios.html':
                    message = 'Hola, me gustaría consultar sobre sus servicios técnicos.';
                    break;
                case 'nosotros.html':
                    message = 'Hola, me gustaría conocer más sobre su empresa.';
                    break;
                case 'contacto.html':
                    message = 'Hola, necesito ayuda con un problema informático.';
                    break;
            }
            
            const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
}

// Utilidades adicionales
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimización de rendimiento
const optimizedScrollHandler = debounce(function() {
    // Aquí irían las funciones que se ejecutan en scroll
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Preloader (opcional)
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
});

// Animación de fadeIn para filtros
const fadeInAnimation = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Insertar animación en el head
const styleSheet = document.createElement('style');
styleSheet.textContent = fadeInAnimation;
document.head.appendChild(styleSheet);

// Console log para desarrollo
console.log('🚀 Computec Website - Scripts cargados correctamente');
console.log('📧 Formulario de contacto activo');
console.log('📱 Botón de WhatsApp configurado');
console.log('🎨 Animaciones y efectos activos');
console.log('🔍 Filtros de productos activos');
console.log('❓ FAQ interactivo activo');

// Navegación suave y funcionalidades del sitio
document.addEventListener('DOMContentLoaded', function() {
    
    // Menú móvil
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Si es un enlace a otra página, no se previene el comportamiento por defecto
        });
    });
    
    
    
    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !phone || !service) {
                alert('Por favor completa todos los campos obligatorios.');
                return;
            }
            
            // Simular envío
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Botones de productos
    const productButtons = document.querySelectorAll('.btn-product');
    productButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            
            alert(`Producto: ${productName}\nPrecio: ${productPrice}\n\nPara más información, contáctanos al 300 123 4567`);
        });
    });
    
    // Animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll('.service-card, .product-card, .feature, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const serviciosSection = document.querySelector('#servicios');
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = serviciosSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }
    
    // Efecto parallax en el hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Contador animado para estadísticas
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = counter.textContent.replace(/\d+/, target);
                }
            };
            
            updateCounter();
        });
    }
    
    // Animar contadores cuando la sección nosotros esté visible
    const nosotrosSection = document.querySelector('#nosotros');
    if (nosotrosSection) {
        const nosotrosObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    nosotrosObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        nosotrosObserver.observe(nosotrosSection);
    }
    
    // Validación de formulario en tiempo real
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = 'Por favor ingresa un email válido';
                break;
            case 'tel':
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                isValid = phoneRegex.test(value) && value.length >= 7;
                errorMessage = 'Por favor ingresa un teléfono válido';
                break;
            default:
                isValid = value.length > 0;
                errorMessage = 'Este campo es obligatorio';
        }
        
        if (!isValid && value.length > 0) {
            field.classList.add('error');
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = errorMessage;
                field.parentNode.insertBefore(errorDiv, field.nextSibling);
            }
        } else {
            field.classList.remove('error');
            const errorDiv = field.parentNode.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    }
});

// Estilos adicionales para validación
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
    }
    
    .error-message {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    }
    
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .scroll-indicator {
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .scroll-indicator:hover {
        transform: translateY(5px);
    }
`;
document.head.appendChild(style); 