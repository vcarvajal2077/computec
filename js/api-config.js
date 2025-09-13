// Configuración de la API
const API_CONFIG = {
    // Rutas base
    BASE_URL: 'api',
    
    // Endpoints
    ENDPOINTS: {
        LOGIN: '/login.php',
        REGISTER: '/register.php',
        USERS: '/users',
        CLIENTS: '/clients'
    },
    
    // Función para obtener la URL completa
    getUrl: function(endpoint) {
        return this.BASE_URL + endpoint;
    },
    
    // Headers por defecto
    getHeaders: function() {
        return {
            'Content-Type': 'application/json'
        };
    },
    
    // Función para hacer peticiones POST
    post: async function(endpoint, data) {
        try {
            const response = await fetch(this.getUrl(endpoint), {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            return {
                ok: response.ok,
                status: response.status,
                data: result
            };
        } catch (error) {
            console.error('API Error:', error);
            return {
                ok: false,
                status: 0,
                data: { message: 'Error de conexión' }
            };
        }
    },
    
    // Función para hacer peticiones GET
    get: async function(endpoint) {
        try {
            const response = await fetch(this.getUrl(endpoint), {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            const result = await response.json();
            return {
                ok: response.ok,
                status: response.status,
                data: result
            };
        } catch (error) {
            console.error('API Error:', error);
            return {
                ok: false,
                status: 0,
                data: { message: 'Error de conexión' }
            };
        }
    }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
} 