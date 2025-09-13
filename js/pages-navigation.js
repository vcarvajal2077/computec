/* ===== NAVEGACIÓN PARA PÁGINAS SEPARADAS ===== */

// Función global para navegación entre páginas
function scrollToSection(section) {
    // En páginas separadas, redirigir a la página correspondiente
    switch(section) {
        case 'servicios':
            window.location.href = 'servicios.html';
            break;
        case 'productos':
            window.location.href = 'productos.html';
            break;
        case 'contacto':
            window.location.href = 'contacto.html';
            break;
        case 'nosotros':
            window.location.href = 'nosotros.html';
            break;
        default:
            console.log('Sección no encontrada:', section);
    }
}

// Función para manejar enlaces de productos
function navigateToProducts(category) {
    window.location.href = `productos.html#${category}`;
}

// Función para manejar enlaces de servicios
function navigateToServices(category) {
    window.location.href = `servicios.html#${category}`;
}

// Prevenir conflictos con SPA navigation
document.addEventListener('DOMContentLoaded', function() {
    // Remover cualquier listener de SPA navigation si existe
    if (window.SPANavigation) {
        console.log('SPA Navigation detectada, deshabilitando para página separada');
    }
    
    // Asegurar que los enlaces funcionen correctamente
    const productLinks = document.querySelectorAll('.hero-producto-btn');
    productLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'productos.html';
        });
    });
    
    const serviceButtons = document.querySelectorAll('.hero-service-btn');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'servicios.html';
        });
    });
});
