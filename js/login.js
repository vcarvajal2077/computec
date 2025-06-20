// Variables globales
let isProcessing = false;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
});

// Función principal de inicialización
function initializeLogin() {
    setupFormValidation();
    setupPasswordToggle();
    setupModalHandlers();
    setupFormSubmission();
    setupAnimations();
    setupKeyboardShortcuts();
}

// Configurar validación del formulario
function setupFormValidation() {
    const form = document.getElementById('loginForm');
    const inputs = form.querySelectorAll('input[required]');

    inputs.forEach(input => {
        // Validación en tiempo real
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearFieldError(this);
        });

        // Validación al presionar Enter
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (validateField(this)) {
                    submitForm();
                }
            }
        });
    });
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remover errores previos
    clearFieldError(field);

    // Validaciones específicas por tipo de campo
    switch (field.type) {
        case 'email':
            if (!value) {
                errorMessage = 'El correo electrónico es requerido';
                isValid = false;
            } else if (!isValidEmail(value)) {
                errorMessage = 'Ingresa un correo electrónico válido';
                isValid = false;
            }
            break;

        case 'password':
            if (!value) {
                errorMessage = 'La contraseña es requerida';
                isValid = false;
            } else if (value.length < 6) {
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                isValid = false;
            }
            break;

        default:
            if (!value) {
                errorMessage = 'Este campo es requerido';
                isValid = false;
            }
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
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    
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

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Configurar toggle de contraseña
function setupPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            const icon = this.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }
}

// Configurar manejadores de modales
function setupModalHandlers() {
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const recoveryModal = document.getElementById('recoveryModal');
    const closeRecoveryModal = document.getElementById('closeRecoveryModal');
    const cancelRecovery = document.getElementById('cancelRecovery');

    // Abrir modal de recuperación
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('recoveryModal');
        });
    }

    // Cerrar modal de recuperación
    if (closeRecoveryModal) {
        closeRecoveryModal.addEventListener('click', function() {
            closeModal('recoveryModal');
        });
    }

    if (cancelRecovery) {
        cancelRecovery.addEventListener('click', function() {
            closeModal('recoveryModal');
        });
    }

    // Cerrar modal al hacer clic fuera
    if (recoveryModal) {
        recoveryModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal('recoveryModal');
            }
        });
    }

    // Configurar formulario de recuperación
const recoveryForm = document.getElementById('recoveryForm');
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRecoveryForm();
        });
    }
}

// Abrir modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Enfocar el primer input del modal
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

// Cerrar modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Limpiar formulario
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            clearFormErrors(form);
        }
    }
}

// Configurar envío del formulario
function setupFormSubmission() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm();
        });
    }
}

// Enviar formulario
function submitForm() {
    if (isProcessing) return;

    const form = document.getElementById('loginForm');
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validar todos los campos
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    if (!isValid) {
        showNotification('Por favor completa todos los campos correctamente', 'error');
        return;
    }

    // Mostrar estado de carga
    setLoadingState(true);

    // Simular envío de datos (aquí iría la lógica real)
    simulateLogin(username, password, rememberMe);
}

// Simular proceso de login
function simulateLogin(username, password, rememberMe) {
    // Simular delay de red
    setTimeout(() => {
        // Simular validación de credenciales
        if (username === 'admin' && password === 'admin123') {
            showNotification('Inicio de sesión exitoso', 'success');
            
            // Simular redirección
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showNotification('Usuario o contraseña incorrectos', 'error');
            setLoadingState(false);
        }
    }, 1500);
}

// Configurar estado de carga
function setLoadingState(loading) {
    isProcessing = loading;
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginBtn) {
        if (loading) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }
}

// Manejar formulario de recuperación
function handleRecoveryForm() {
    const email = document.getElementById('recoveryEmail').value.trim();
    const username = document.getElementById('recoveryUsername').value.trim();

    if (!email || !username) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Ingresa un correo electrónico válido', 'error');
        return;
    }

    // Simular envío de solicitud de recuperación
    showNotification('Solicitud enviada. Revisa tu correo electrónico', 'success');
    closeModal('recoveryModal');
}

// Configurar animaciones
function setupAnimations() {
    // Animación de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos animables
    const animatedElements = document.querySelectorAll('.feature-item, .form-group');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Configurar atajos de teclado
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Escape para cerrar modales
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }

        // Ctrl/Cmd + Enter para enviar formulario
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activeForm = document.querySelector('.modal.active form') || document.getElementById('loginForm');
            if (activeForm) {
                e.preventDefault();
                if (activeForm.id === 'loginForm') {
                    submitForm();
                } else if (activeForm.id === 'recoveryForm') {
                    handleRecoveryForm();
                }
            }
        }
    });
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = getNotificationIcon(type);
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Agregar estilos adicionales
    notification.style.cssText += `
        position: relative;
        overflow: hidden;
    `;

    container.appendChild(notification);

    // Auto-remover después de 5 segundos
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
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Limpiar errores del formulario
function clearFormErrors(form) {
    const errorFields = form.querySelectorAll('.field-error');
    errorFields.forEach(error => error.remove());
    
    const errorInputs = form.querySelectorAll('.error');
    errorInputs.forEach(input => input.classList.remove('error'));
}

// Función para validar formulario completo
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// Función para obtener datos del formulario
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

// Función para resetear formulario
function resetForm(form) {
    form.reset();
    clearFormErrors(form);
    
    // Remover estado de carga
    setLoadingState(false);
}

// Función para manejar errores de red
function handleNetworkError() {
    showNotification('Error de conexión. Verifica tu internet e intenta nuevamente', 'error');
    setLoadingState(false);
}

// Función para manejar errores del servidor
function handleServerError(status) {
    let message = 'Error del servidor. Intenta nuevamente.';
    
    switch (status) {
        case 401:
            message = 'Credenciales incorrectas';
                break;
        case 403:
            message = 'Acceso denegado';
                break;
        case 404:
            message = 'Servicio no encontrado';
                break;
        case 500:
            message = 'Error interno del servidor';
                break;
        }
    
    showNotification(message, 'error');
    setLoadingState(false);
}

// Función para guardar datos en localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

// Función para obtener datos de localStorage
function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error al obtener de localStorage:', error);
        return null;
    }
}

// Función para limpiar localStorage
function clearLocalStorage() {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error al limpiar localStorage:', error);
    }
}

// Función para verificar si el usuario está recordado
function checkRememberedUser() {
    const rememberedUser = getFromLocalStorage('rememberedUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser.username;
        document.getElementById('rememberMe').checked = true;
    }
}

// Función para recordar usuario
function rememberUser(username) {
    const rememberMe = document.getElementById('rememberMe').checked;
    if (rememberMe) {
        saveToLocalStorage('rememberedUser', { username });
    } else {
        localStorage.removeItem('rememberedUser');
    }
}

// Agregar estilos CSS dinámicos
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
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
    
    .field-error {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .form-group input.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background-color 0.2s;
        margin-left: auto;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .login-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .login-btn:disabled:hover {
        transform: none;
        box-shadow: none;
    }
`;

document.head.appendChild(dynamicStyles);

// Inicializar usuario recordado al cargar la página
checkRememberedUser();