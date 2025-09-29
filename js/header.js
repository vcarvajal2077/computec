/* ===== HEADER Y NAVEGACIÓN ===== */

class HeaderManager {
    constructor() {
        this.header = null;
        this.accountDropdown = null;
        this.dropdownMenu = null;
        this.cartItemCount = null;
        this.userData = null;
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.loadUserData();
        this.renderDropdown();
        this.updateCartCount();
    }

    bindElements() {
        this.header = document.querySelector('.header');
        this.accountDropdown = document.getElementById('accountDropdown');
        this.dropdownMenu = document.getElementById('dropdownMenu');
        this.cartItemCount = document.getElementById('cart-item-count');
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

    async updateCartCount() {
        if (!this.isAuthenticated() || !this.cartItemCount) return;

        try {
            const response = await fetch('api/cart.php');
            if (response.ok) {
                const items = await response.json();
                this.cartItemCount.textContent = items.length;
            } else {
                this.cartItemCount.textContent = '0';
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
            this.cartItemCount.textContent = '0';
        }
    }

    loadUserData() {
        const userDataString = localStorage.getItem('usuario_logueado');
        this.userData = userDataString ? JSON.parse(userDataString) : { loggedIn: false, name: null };
    }

    async updateCartCount() {
        if (!this.isAuthenticated() || !this.cartItemCount) return;

        try {
            const response = await fetch('api/cart.php');
            if (response.ok) {
                const items = await response.json();
                this.cartItemCount.textContent = items.length;
            } else {
                this.cartItemCount.textContent = '0';
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
            this.cartItemCount.textContent = '0';
        }
    }

    renderDropdown() {
        if (!this.dropdownMenu) return;

        if (this.isAuthenticated()) {
            // Usuario logueado
            this.dropdownMenu.innerHTML = `
                <div class="dropdown-content">
                    <div class="user-info">
                        <div class="user-name">${this.userData.nombre || 'Usuario'}</div>
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
                        <a href="#" class="dropdown-item register-link">
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

    async logout() {
        if (confirm('¿Estás seguro de que quieres cerrar la sesión?')) {
            try {
                // Llamada a la API para destruir la sesión en el servidor
                const response = await fetch('api/logout.php');
                if (!response.ok) {
                    console.error('Error al cerrar la sesión en el servidor.');
                }
            } catch (error) {
                console.error('Error de red al intentar cerrar la sesión:', error);
            }

            // Limpiar datos de sesión del lado del cliente
            localStorage.removeItem('usuario_logueado');
            localStorage.removeItem('userData');

            this.userData = { loggedIn: false, name: null };

            // Actualizar la interfaz
            this.renderDropdown();
            if (this.cartItemCount) {
                this.cartItemCount.textContent = '0';
            }

            // Redirigir y recargar la página para un estado limpio
            window.location.reload();
        }
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
        this.updateCartCount();
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