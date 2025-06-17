// Datos de ejemplo para usuarios (en un sistema real, esto vendría de una base de datos)
const users = [
    { username: 'admin', password: 'admin123', role: 'admin', email: 'admin@example.com' },
    { username: 'auxiliar', password: 'aux123', role: 'auxiliar', email: 'auxiliar@example.com' },
    { username: 'tecnico', password: 'tec123', role: 'tecnico', email: 'tecnico@example.com' },
    { username: 'invitado', password: 'guest123', role: 'guest', email: 'invitado@example.com' }
];

// Elementos del DOM para login
const loginForm = document.getElementById('loginForm');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const recoveryModal = document.getElementById('recoveryModal');
const recoveryForm = document.getElementById('recoveryForm');
const closeRecoveryModal = document.querySelector('#recoveryModal .close');

// Función para mostrar mensajes
function showMessage(element, message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `recovery-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    element.insertBefore(messageDiv, element.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Event Listeners para login
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verificar credenciales
    const user = users.find(u => 
        u.username === username && 
        u.password === password
    );

    if (user) {
        // Guardar información del usuario en sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            role: user.role
        }));

        // Redirigir según el rol
        switch(user.role) {
            case 'admin':
                window.location.href = 'index.html';
                break;
            case 'auxiliar':
                // Redirigir a la página del auxiliar
                alert('Redirigiendo a la página del auxiliar');
                break;
            case 'tecnico':
                // Redirigir a la página del técnico
                alert('Redirigiendo a la página del técnico');
                break;
            case 'guest':
                // Redirigir a la página del invitado
                alert('Redirigiendo a la página del invitado');
                break;
        }
    } else {
        showMessage(loginForm, 'Usuario o contraseña incorrectos', 'error');
    }
});

// Event Listeners para recuperación de contraseña
forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    recoveryModal.style.display = 'block';
});

closeRecoveryModal.addEventListener('click', function() {
    recoveryModal.style.display = 'none';
});

recoveryForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('recoveryEmail').value;
    const username = document.getElementById('recoveryUsername').value;

    // Verificar si el usuario existe
    const user = users.find(u => 
        u.username === username && 
        u.email === email
    );

    if (user) {
        // En un sistema real, aquí se enviaría un correo con instrucciones
        showMessage(recoveryForm, 'Se han enviado las instrucciones a tu correo electrónico', 'success');
        setTimeout(() => {
            recoveryModal.style.display = 'none';
            recoveryForm.reset();
        }, 2000);
    } else {
        showMessage(recoveryForm, 'No se encontró ninguna cuenta con esos datos', 'error');
    }
});

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', function(e) {
    if (e.target === recoveryModal) {
        recoveryModal.style.display = 'none';
    }
}); 