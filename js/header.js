/* ===== HEADER Y NAVEGACIÓN ===== */

class HeaderManager {
    constructor() {
        this.header = null;
        this.accountDropdown = null;
        this.dropdownMenu = null;
        this.userData = null;
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.loadUserData();
        this.renderDropdown();
    }

    bindElements() {
        this.header = document.querySelector('.header');
        this.accountDropdown = document.getElementById('accountDropdown');
        this.dropdownMenu = document.getElementById('dropdownMenu');
    }

    bindEvents() {
        if (this.header) {
            window.addEventListener('scroll', () => this.handleScroll());
        }
    }

    loadUserData() {
        const userDataString = localStorage.getItem('userData');
        this.userData = userDataString ? JSON.parse(userDataString) : { loggedIn: false, name: null };
    }

    renderDropdown() {
        if (!this.dropdownMenu) return;

        if (this.isAuthenticated()) {
            // Usuario logueado
            this.dropdownMenu.innerHTML = `
                <div class="dropdown-content">
                    <div class="user-info">
                        <div class="user-name">${this.userData.name || 'Usuario'}</div>
                        <div class="user-email">${this.userData.email || 'usuario@computec.com'}</div>
                    </div>
                    <div class="dropdown-actions">
                        <a href="panel.html" class="dropdown-item">
                            <i class="fas fa-tachometer-alt"></i>
                            Panel de Control
                        </a>
                        <a href="configuracion.html" class="dropdown-item">
                            <i class="fas fa-cog"></i>
                            Configuración
                        </a>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item" onclick="headerManager.logout()">
                            <i class="fas fa-sign-out-alt"></i>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            `;
        } else {
            // Usuario no logueado
            this.dropdownMenu.innerHTML = `
                <div class="dropdown-content">
                    <div class="dropdown-actions">
                        <a href="login.html" class="dropdown-item">
                            <i class="fas fa-sign-in-alt"></i>
                            Iniciar Sesión
                        </a>
                        <a href="login.html" class="dropdown-item">
                            <i class="fas fa-user-plus"></i>
                            Registrarse
                        </a>
                    </div>
                </div>
            `;
        }
    }

    getUserData() {
        return this.userData;
    }

    logout() {
        localStorage.removeItem('userData');
        this.userData = { loggedIn: false, name: null };
        this.renderDropdown();
        window.location.href = 'index.html';
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }

    isAuthenticated() {
        return this.userData && this.userData.loggedIn;
    }

    getCurrentUser() {
        return this.userData;
    }

    // Método para simular login (para testing)
    simulateLogin(userData) {
        this.userData = { ...userData, loggedIn: true };
        localStorage.setItem('userData', JSON.stringify(this.userData));
        this.renderDropdown();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.headerManager = new HeaderManager();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderManager;
}
