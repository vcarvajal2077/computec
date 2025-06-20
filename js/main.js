// Variables globales
let currentSection = 'dashboard';
let charts = {};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función principal de inicialización
function initializeApp() {
    setupNavigation();
    setupModals();
    setupCharts();
    setupUserManagement();
    setupSearchFunctionality();
    setupNotifications();
    loadDashboardData();
}

// Configuración de navegación
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Agregar clase active al enlace clickeado
            this.classList.add('active');
            
            // Obtener la sección objetivo
            const targetSection = this.getAttribute('href').substring(1);
            
            // Ocultar todas las secciones
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar la sección objetivo
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
                currentSection = targetSection;
                
                // Cargar datos específicos de la sección
                loadSectionData(targetSection);
            }
        });
    });
}

// Configuración de modales
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close, .btn-secondary');
    const createUserBtn = document.getElementById('createUserBtn');

    // Abrir modal de crear usuario
    if (createUserBtn) {
        createUserBtn.addEventListener('click', function() {
            openModal('userModal');
        });
    }

    // Cerrar modales
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllModals();
        });
    });

    // Cerrar modal al hacer clic fuera
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAllModals();
            }
        });
    });

    // Configurar formularios de modales
    setupModalForms();
}

// Abrir modal específico
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Cerrar todos los modales
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// Configurar formularios de modales
function setupModalForms() {
    const userForm = document.querySelector('#userModal form');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUserFormSubmit(this);
        });
    }
}

// Manejar envío del formulario de usuario
function handleUserFormSubmit(form) {
    const formData = new FormData(form);
    const userData = {
        username: formData.get('username') || document.getElementById('username').value,
        email: formData.get('email') || document.getElementById('email').value,
        role: formData.get('role') || document.getElementById('role').value
    };

    // Validar datos
    if (!userData.username || !userData.email || !userData.role) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }

    // Simular envío de datos
    console.log('Creando usuario:', userData);
    
    // Aquí iría la lógica real de creación de usuario
    showNotification('Usuario creado exitosamente', 'success');
    closeAllModals();
    form.reset();
    
    // Recargar tabla de usuarios
    loadUsersTable();
}

// Configuración de gráficos
function setupCharts() {
    // Gráfico de actividad
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
        charts.activity = new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Reparaciones',
                    data: [12, 19, 15, 25, 22, 18, 24],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Ensamblajes',
                    data: [8, 12, 10, 15, 18, 14, 20],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Gráfico de ventas
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        charts.sales = new Chart(salesCtx, {
            type: 'bar',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Ventas ($)',
                    data: [35000, 42000, 38000, 45000, 48000, 52000],
                    backgroundColor: [
                        'rgba(37, 99, 235, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(6, 182, 212, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Gráfico de servicios
    const servicesCtx = document.getElementById('servicesChart');
    if (servicesCtx) {
        charts.services = new Chart(servicesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Reparaciones', 'Ensamblajes', 'Soporte'],
                datasets: [{
                    data: [45, 30, 25],
                    backgroundColor: [
                        '#2563eb',
                        '#10b981',
                        '#f59e0b'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Configuración de gestión de usuarios
function setupUserManagement() {
    // Configurar botones de acción en la tabla
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-icon')) {
            const button = e.target.closest('.btn-icon');
            const action = button.getAttribute('title')?.toLowerCase();
            const row = button.closest('tr');
            
            if (row) {
                const userId = row.cells[0].textContent;
                const username = row.cells[1].textContent;
                
                switch(action) {
                    case 'ver':
                        viewUser(userId, username);
                        break;
                    case 'editar':
                        editUser(userId, username);
                        break;
                    case 'eliminar':
                        deleteUser(userId, username);
                        break;
                }
            }
        }
    });
}

// Ver usuario
function viewUser(userId, username) {
    const modal = document.getElementById('readUserModal');
    if (modal) {
        const userInfo = document.getElementById('readUserInfo');
        userInfo.innerHTML = `
            <div class="user-details">
                <p><strong>ID:</strong> ${userId}</p>
                <p><strong>Usuario:</strong> ${username}</p>
                <p><strong>Email:</strong> ${username}@computec.com</p>
                <p><strong>Rol:</strong> Técnico</p>
                <p><strong>Estado:</strong> Activo</p>
                <p><strong>Último acceso:</strong> Hace 1 hora</p>
            </div>
        `;
        openModal('readUserModal');
    }
}

// Editar usuario
function editUser(userId, username) {
    const modal = document.getElementById('userModal');
    if (modal) {
        const modalTitle = modal.querySelector('#modalTitle');
        const usernameInput = modal.querySelector('#username');
        const emailInput = modal.querySelector('#email');
        const roleSelect = modal.querySelector('#role');
        
        modalTitle.textContent = 'Editar Usuario';
        usernameInput.value = username;
        emailInput.value = `${username}@computec.com`;
        roleSelect.value = 'tecnico';
        roleSelect.disabled = false;
        
        openModal('userModal');
    }
}

// Eliminar usuario
function deleteUser(userId, username) {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${username}"?`)) {
        console.log('Eliminando usuario:', userId);
        showNotification('Usuario eliminado exitosamente', 'success');
        // Aquí iría la lógica real de eliminación
    }
}

// Configuración de búsqueda
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterUsersTable(searchTerm);
        });
    }
}

// Filtrar tabla de usuarios
function filterUsersTable(searchTerm) {
    const tableRows = document.querySelectorAll('.users-table tbody tr');
    
    tableRows.forEach(row => {
        const username = row.cells[1].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        const role = row.cells[3].textContent.toLowerCase();
        
        if (username.includes(searchTerm) || email.includes(searchTerm) || role.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Configuración de notificaciones
function setupNotifications() {
    const notificationBell = document.querySelector('.notifications');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            showNotificationPanel();
        });
    }
}

// Mostrar panel de notificaciones
function showNotificationPanel() {
    // Crear panel de notificaciones
    const panel = document.createElement('div');
    panel.className = 'notification-panel';
    panel.innerHTML = `
        <div class="notification-header">
            <h3>Notificaciones</h3>
            <button class="close-notifications">&times;</button>
        </div>
        <div class="notification-list">
            <div class="notification-item">
                <i class="fas fa-tools"></i>
                <div class="notification-content">
                    <p>Nueva reparación asignada</p>
                    <span>Hace 5 minutos</span>
                </div>
            </div>
            <div class="notification-item">
                <i class="fas fa-user-plus"></i>
                <div class="notification-content">
                    <p>Usuario registrado: Juan Pérez</p>
                    <span>Hace 1 hora</span>
                </div>
            </div>
            <div class="notification-item">
                <i class="fas fa-desktop"></i>
                <div class="notification-content">
                    <p>Ensamblaje completado</p>
                    <span>Hace 2 horas</span>
                </div>
            </div>
        </div>
    `;
    
    // Agregar estilos
    panel.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        width: 350px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 1000;
        border: 1px solid #e2e8f0;
    `;
    
    document.querySelector('.notifications').appendChild(panel);
    
    // Cerrar panel
    panel.querySelector('.close-notifications').addEventListener('click', function() {
        panel.remove();
    });
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', function closePanel(e) {
        if (!panel.contains(e.target) && !e.target.closest('.notifications')) {
            panel.remove();
            document.removeEventListener('click', closePanel);
        }
    });
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Agregar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Cerrar notificación
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Obtener icono de notificación
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Obtener color de notificación
function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#06b6d4'
    };
    return colors[type] || '#06b6d4';
}

// Cargar datos del dashboard
function loadDashboardData() {
    // Simular carga de datos
    console.log('Cargando datos del dashboard...');
    
    // Actualizar estadísticas
    updateStats();
    
    // Actualizar actividad reciente
    updateRecentActivity();
}

// Cargar datos específicos de sección
function loadSectionData(section) {
    switch(section) {
        case 'usuarios':
            loadUsersTable();
            break;
        case 'servicios':
            loadServicesData();
            break;
        case 'reportes':
            loadReportsData();
            break;
    }
}

// Actualizar estadísticas
function updateStats() {
    // Simular actualización de estadísticas
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const currentValue = parseInt(stat.textContent.replace(/[^\d]/g, ''));
        animateNumber(stat, 0, currentValue, 1000);
    });
}

// Animar números
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const startValue = start;
    const endValue = end;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
        element.textContent = element.textContent.replace(/\d+/, currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Actualizar actividad reciente
function updateRecentActivity() {
    // Simular actualización de actividad
    console.log('Actualizando actividad reciente...');
}

// Cargar tabla de usuarios
function loadUsersTable() {
    // Simular carga de usuarios
    console.log('Cargando tabla de usuarios...');
}

// Cargar datos de servicios
function loadServicesData() {
    // Simular carga de datos de servicios
    console.log('Cargando datos de servicios...');
}

// Cargar datos de reportes
function loadReportsData() {
    // Simular carga de datos de reportes
    console.log('Cargando datos de reportes...');
}

// Función para exportar datos
function exportData(type) {
    console.log(`Exportando datos de tipo: ${type}`);
    showNotification('Exportación iniciada', 'info');
}

// Función para imprimir reportes
function printReport(reportId) {
    console.log(`Imprimiendo reporte: ${reportId}`);
    showNotification('Reporte enviado a impresora', 'success');
}

// Función para generar PDF
function generatePDF(content) {
    console.log('Generando PDF...');
    showNotification('PDF generado exitosamente', 'success');
}

// Función para validar formularios
function validateForm(formData) {
    const errors = [];
    
    for (let [key, value] of formData.entries()) {
        if (!value.trim()) {
            errors.push(`El campo ${key} es requerido`);
        }
    }
    
    return errors;
}

// Función para formatear fechas
function formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Función para formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(amount);
}

// Event listeners adicionales
document.addEventListener('keydown', function(e) {
    // Cerrar modales con Escape
    if (e.key === 'Escape') {
        closeAllModals();
    }
    
    // Navegación con teclado
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                document.querySelector('[href="#dashboard"]').click();
                break;
            case '2':
                e.preventDefault();
                document.querySelector('[href="#servicios"]').click();
                break;
            case '3':
                e.preventDefault();
                document.querySelector('[href="#usuarios"]').click();
                break;
            case '4':
                e.preventDefault();
                document.querySelector('[href="#reportes"]').click();
                break;
        }
    }
});

// Agregar estilos CSS dinámicos
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-panel {
        max-height: 400px;
        overflow-y: auto;
    }
    
    .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .notification-list {
        padding: 0;
    }
    
    .notification-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
        border-bottom: 1px solid #f1f5f9;
        transition: background-color 0.2s;
    }
    
    .notification-item:hover {
        background-color: #f8fafc;
    }
    
    .notification-item i {
        color: #64748b;
        margin-top: 0.25rem;
    }
    
    .notification-content p {
        margin: 0;
        font-weight: 500;
        color: #1e293b;
    }
    
    .notification-content span {
        font-size: 0.875rem;
        color: #64748b;
    }
    
    .close-notifications {
        background: none;
        border: none;
        font-size: 1.25rem;
        color: #64748b;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .close-notifications:hover {
        background-color: #f1f5f9;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
`;

document.head.appendChild(dynamicStyles); 