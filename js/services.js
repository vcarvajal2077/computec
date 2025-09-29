/**
 * SERVICES PAGE - JAVASCRIPT
 * Inicialización específica para la página de servicios
 */

document.addEventListener('DOMContentLoaded', () => {
    // Verificar que el script de servicios dinámicos esté cargado
    if (typeof ServiciosDinamicos === 'undefined') {
        console.error('Error: ServiciosDinamicos no está disponible');
    }
    
    // Agregar funcionalidad adicional específica de la página de servicios
    initializeServicesPage();
});

function initializeServicesPage() {
    // Agregar estilos adicionales si es necesario
    addServicesPageStyles();
    
    // Configurar eventos adicionales
    setupServicesPageEvents();
}

function addServicesPageStyles() {
    // Verificar si los estilos ya están agregados
    if (document.getElementById('services-page-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'services-page-styles';
    styles.textContent = `
        /* Estilos específicos para la página de servicios */
        .main-content {
            padding: 2rem 0;
            min-height: 60vh;
        }
        
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .section-subtitle {
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 3rem;
        }
        
        /* Asegurar que el contenedor tenga el espaciado correcto */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }
    `;
    
    document.head.appendChild(styles);
}

function setupServicesPageEvents() {
    // Eventos adicionales específicos de la página de servicios
    console.log('Eventos de la página de servicios configurados');
}