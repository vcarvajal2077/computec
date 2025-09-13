/**
 * Gestor de Módulos - Frontend
 * Maneja la carga dinámica de módulos según el tipo de usuario
 */

class ModulosFrontend {
    constructor() {
        this.apiUrl = 'api/modulos.php';
        this.userData = this.getUserData();
    }
    
    /**
     * Obtiene los datos del usuario desde localStorage
     */
    getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }
    
    /**
     * Carga los módulos del usuario actual
     */
    async cargarModulosUsuario() {
        if (!this.userData) {
            console.error('No hay datos de usuario disponibles');
            return [];
        }
        
        try {
            console.log('Cargando módulos para usuario ID:', this.userData.id);
            const response = await fetch(`${this.apiUrl}?action=usuario&id_usuario=${this.userData.id}`);
            const data = await response.json();
            
            console.log('Respuesta de la API:', data);
            
            if (data.success && data.data && data.data.length > 0) {
                console.log('Módulos cargados desde API:', data.data.length);
                return data.data;
            } else {
                console.error('No se encontraron módulos en la API para el usuario:', this.userData.id);
                return [];
            }
        } catch (error) {
            console.error('Error al cargar módulos desde API:', error);
            return [];
        }
    }
    
    /**
     * Obtiene módulos por defecto según el tipo de usuario
     */
    getModulosPorDefecto() {
        const modulosBase = [
            {
                id_modulo: 1,
                nombre_modulo: 'Dashboard',
                descripcion: 'Panel de control y estadísticas',
                icono: 'fas fa-tachometer-alt',
                url: '#dashboard'
            }
        ];
        
        // Obtener el tipo de usuario (id_tipo_usuario)
        const tipoUsuario = this.userData?.id_tipo_usuario || this.userData?.tipo_usuario || 6; // Default: Cliente
        
        console.log('Tipo de usuario detectado:', tipoUsuario);
        
        // Mapear ID de tipo de usuario a módulos específicos
        const modulosPorTipo = {
            1: [ // Administrador
                { id_modulo: 2, nombre_modulo: 'Usuarios', descripcion: 'Gestión de usuarios', icono: 'fas fa-users', url: '/usuarios' },
                { id_modulo: 3, nombre_modulo: 'Clientes', descripcion: 'Gestión de clientes', icono: 'fas fa-user-group', url: '/clientes' },
                { id_modulo: 4, nombre_modulo: 'Productos', descripcion: 'Gestión de productos', icono: 'fas fa-box', url: '/productos' },
                { id_modulo: 5, nombre_modulo: 'Servicios', descripcion: 'Gestión de servicios técnicos', icono: 'fas fa-tools', url: '/servicios' },
                { id_modulo: 6, nombre_modulo: 'Ventas', descripcion: 'Gestión de ventas', icono: 'fas fa-shopping-cart', url: '/ventas' },
                { id_modulo: 7, nombre_modulo: 'Inventario', descripcion: 'Control de inventario', icono: 'fas fa-warehouse', url: '/inventario' },
                { id_modulo: 8, nombre_modulo: 'Citas', descripcion: 'Programación de citas', icono: 'fas fa-calendar', url: '/citas' },
                { id_modulo: 9, nombre_modulo: 'Reportes', descripcion: 'Generación de reportes', icono: 'fas fa-chart-bar', url: '/reportes' },
                { id_modulo: 10, nombre_modulo: 'Configuración', descripcion: 'Configuración del sistema', icono: 'fas fa-cog', url: '/configuracion' },
                { id_modulo: 21, nombre_modulo: 'Anuncios', descripcion: 'Gestión de anuncios', icono: 'fas fa-bullhorn', url: '/anuncios' },
                { id_modulo: 22, nombre_modulo: 'Eventos', descripcion: 'Gestión de eventos', icono: 'fas fa-calendar-alt', url: '/eventos' }
            ],
            2: [ // Vendedor
                { id_modulo: 3, nombre_modulo: 'Clientes', descripcion: 'Gestión de clientes', icono: 'fas fa-user-group', url: '/clientes' },
                { id_modulo: 4, nombre_modulo: 'Productos', descripcion: 'Gestión de productos', icono: 'fas fa-box', url: '/productos' },
                { id_modulo: 6, nombre_modulo: 'Ventas', descripcion: 'Gestión de ventas', icono: 'fas fa-shopping-cart', url: '/ventas' },
                { id_modulo: 7, nombre_modulo: 'Inventario', descripcion: 'Control de inventario', icono: 'fas fa-warehouse', url: '/inventario' },
                { id_modulo: 15, nombre_modulo: 'Facturas', descripcion: 'Gestión de facturas', icono: 'fas fa-file-invoice', url: '/facturas' },
                { id_modulo: 17, nombre_modulo: 'Mi Perfil', descripcion: 'Gestión del perfil de usuario', icono: 'fas fa-user-cog', url: '/perfil' }
            ],
            3: [ // Técnico
                { id_modulo: 3, nombre_modulo: 'Clientes', descripcion: 'Gestión de clientes', icono: 'fas fa-user-group', url: '/clientes' },
                { id_modulo: 5, nombre_modulo: 'Servicios', descripcion: 'Gestión de servicios técnicos', icono: 'fas fa-tools', url: '/servicios' },
                { id_modulo: 7, nombre_modulo: 'Inventario', descripcion: 'Control de inventario', icono: 'fas fa-warehouse', url: '/inventario' },
                { id_modulo: 11, nombre_modulo: 'Mis Servicios', descripcion: 'Servicios asignados al técnico', icono: 'fas fa-tools', url: '/mis-servicios' },
                { id_modulo: 12, nombre_modulo: 'Reparaciones', descripcion: 'Gestión de reparaciones', icono: 'fas fa-wrench', url: '/reparaciones' },
                { id_modulo: 16, nombre_modulo: 'Soporte Técnico', descripcion: 'Sistema de tickets de soporte', icono: 'fas fa-headset', url: '/soporte-tecnico' },
                { id_modulo: 17, nombre_modulo: 'Mi Perfil', descripcion: 'Gestión del perfil de usuario', icono: 'fas fa-user-cog', url: '/perfil' }
            ],
            4: [ // Supervisor
                { id_modulo: 2, nombre_modulo: 'Usuarios', descripcion: 'Gestión de usuarios', icono: 'fas fa-users', url: '/usuarios' },
                { id_modulo: 3, nombre_modulo: 'Clientes', descripcion: 'Gestión de clientes', icono: 'fas fa-user-group', url: '/clientes' },
                { id_modulo: 5, nombre_modulo: 'Servicios', descripcion: 'Gestión de servicios técnicos', icono: 'fas fa-tools', url: '/servicios' },
                { id_modulo: 9, nombre_modulo: 'Reportes', descripcion: 'Generación de reportes', icono: 'fas fa-chart-bar', url: '/reportes' },
                { id_modulo: 20, nombre_modulo: 'Supervisión', descripcion: 'Panel de supervisión', icono: 'fas fa-eye', url: '/supervision' },
                { id_modulo: 17, nombre_modulo: 'Mi Perfil', descripcion: 'Gestión del perfil de usuario', icono: 'fas fa-user-cog', url: '/perfil' }
            ],
            5: [ // Asistente Administrativo
                { id_modulo: 3, nombre_modulo: 'Clientes', descripcion: 'Gestión de clientes', icono: 'fas fa-user-group', url: '/clientes' },
                { id_modulo: 8, nombre_modulo: 'Citas', descripcion: 'Programación de citas', icono: 'fas fa-calendar', url: '/citas' },
                { id_modulo: 14, nombre_modulo: 'Garantías', descripcion: 'Gestión de garantías', icono: 'fas fa-shield-alt', url: '/garantias' },
                { id_modulo: 15, nombre_modulo: 'Facturas', descripcion: 'Gestión de facturas', icono: 'fas fa-file-invoice', url: '/facturas' },
                { id_modulo: 16, nombre_modulo: 'Soporte Técnico', descripcion: 'Sistema de tickets de soporte', icono: 'fas fa-headset', url: '/soporte-tecnico' },
                { id_modulo: 17, nombre_modulo: 'Mi Perfil', descripcion: 'Gestión del perfil de usuario', icono: 'fas fa-user-cog', url: '/perfil' }
            ],
            6: [ // Cliente
                { id_modulo: 11, nombre_modulo: 'Mis Servicios', descripcion: 'Servicios asignados al técnico', icono: 'fas fa-tools', url: '/mis-servicios' },
                { id_modulo: 16, nombre_modulo: 'Soporte Técnico', descripcion: 'Sistema de tickets de soporte', icono: 'fas fa-headset', url: '/soporte-tecnico' },
                { id_modulo: 17, nombre_modulo: 'Mi Perfil', descripcion: 'Gestión del perfil de usuario', icono: 'fas fa-user-cog', url: '/perfil' },
                { id_modulo: 18, nombre_modulo: 'Mis Productos', descripcion: 'Productos comprados por el cliente', icono: 'fas fa-shopping-bag', url: '/mis-productos' },
                { id_modulo: 19, nombre_modulo: 'Portal Cliente', descripcion: 'Portal de acceso para clientes', icono: 'fas fa-user', url: '/portal-cliente' }
            ]
        };
        
        const modulosEspecificos = modulosPorTipo[tipoUsuario] || modulosPorTipo[6]; // Default: Cliente
        return [...modulosBase, ...modulosEspecificos];
    }
    
    /**
     * Carga los módulos por tipo de usuario
     */
    async cargarModulosPorTipo(tipoUsuario) {
        try {
            const response = await fetch(`${this.apiUrl}?action=tipo_usuario&id_tipo_usuario=${tipoUsuario}`);
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                console.error('Error al cargar módulos por tipo:', data.error);
                return [];
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            return [];
        }
    }
    
    /**
     * Verifica si el usuario tiene acceso a un módulo específico
     */
    async verificarAccesoModulo(idModulo) {
        if (!this.userData || !this.userData.id) {
            return false;
        }
        
        try {
            const response = await fetch(`${this.apiUrl}?action=verificar_acceso&id_usuario=${this.userData.id}&id_modulo=${idModulo}`);
            const data = await response.json();
            
            if (data.success) {
                return data.tiene_acceso;
            } else {
                console.error('Error al verificar acceso:', data.error);
                return false;
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            return false;
        }
    }
    
    /**
     * Genera el menú dinámico para el usuario
     */
    async generarMenuDinamico() {
        console.log('Cargando módulos del usuario...');
        const modulos = await this.cargarModulosUsuario();
        console.log('Módulos cargados:', modulos);
        const menuHTML = this.crearMenuHTML(modulos);
        console.log('HTML del menú creado:', menuHTML);
        return menuHTML;
    }
    
    /**
     * Crea el HTML del menú basado en los módulos
     */
    crearMenuHTML(modulos) {
        let menuHTML = '';
        
        // Agregar el botón de Menú principal
        menuHTML += `
            <div class="nav-item">
                <a href="#menu" class="nav-link active" data-section="menu">
                    <i class="fas fa-bars"></i>
                    Menú
                </a>
            </div>
        `;
        
        // Agregar los módulos dinámicos
        modulos.forEach(modulo => {
            const iconClass = modulo.icono || 'fas fa-circle';
            const url = modulo.url || `#${modulo.nombre_modulo.toLowerCase().replace(/\s+/g, '-')}`;
            
            menuHTML += `
                <div class="nav-item">
                    <a href="${url}" class="nav-link" data-section="${modulo.nombre_modulo.toLowerCase().replace(/\s+/g, '-')}">
                        <i class="${iconClass}"></i>
                        ${modulo.nombre_modulo}
                    </a>
                </div>
            `;
        });
        
        return menuHTML;
    }
    
    /**
     * Actualiza el menú en el panel
     */
    async actualizarMenuPanel() {
        console.log('Buscando elemento .nav-menu...');
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) {
            console.error('No se encontró el elemento .nav-menu');
            return;
        }
        
        console.log('Generando menú dinámico...');
        const menuHTML = await this.generarMenuDinamico();
        console.log('HTML del menú generado:', menuHTML);
        
        navMenu.innerHTML = menuHTML;
        console.log('Menú actualizado en el DOM');
        
        // Re-inicializar los event listeners
        this.inicializarEventListeners();
    }
    
    /**
     * Inicializa los event listeners para la navegación
     */
    inicializarEventListeners() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.content-section');
        const pageTitle = document.getElementById('pageTitle');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Obtener la sección objetivo
                const targetSection = this.getAttribute('data-section');
                
                // Remover clase active de todos los links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Agregar clase active al link clickeado
                this.classList.add('active');
                
                // Ocultar todas las secciones
                sections.forEach(section => {
                    section.style.display = 'none';
                    section.classList.remove('active-section');
                });
                
                // Mostrar la sección correspondiente
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.style.display = 'block';
                    targetElement.classList.add('active-section');
                }
                
                // Actualizar título de la página
                if (pageTitle) {
                    const sectionTitle = this.textContent.trim();
                    pageTitle.textContent = sectionTitle;
                }
            });
        });
    }
    
    /**
     * Crea las tarjetas de módulos para la sección de menú
     */
    crearTarjetasModulos(modulos) {
        let tarjetasHTML = '';
        
        modulos.forEach(modulo => {
            const iconClass = modulo.icono || 'fas fa-circle';
            const descripcion = modulo.descripcion || 'Módulo del sistema';
            
            tarjetasHTML += `
                <div class="module-card" onclick="navigateToSection('${modulo.nombre_modulo.toLowerCase().replace(/\s+/g, '-')}')">
                    <div class="module-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="module-content">
                        <h3>${modulo.nombre_modulo}</h3>
                        <p>${descripcion}</p>
                    </div>
                </div>
            `;
        });
        
        return tarjetasHTML;
    }
    
    /**
     * Actualiza la sección de módulos en el menú principal
     */
    async actualizarSeccionModulos() {
        const modulos = await this.cargarModulosUsuario();
        const contenedorModulos = document.getElementById('moduleCardsContainer');
        
        if (contenedorModulos) {
            const tarjetasHTML = this.crearTarjetasModulos(modulos);
            contenedorModulos.innerHTML = tarjetasHTML;
        } else {
            console.error('No se encontró el contenedor de módulos');
        }
    }
    
    /**
     * Inicializa el sistema de módulos
     */
    async inicializar() {
        console.log('Iniciando sistema de módulos...');
        console.log('Datos de usuario:', this.userData);
        
        if (!this.userData) {
            console.error('No hay datos de usuario disponibles');
            return;
        }
        
        try {
            // Actualizar el menú del panel
            console.log('Actualizando menú del panel...');
            await this.actualizarMenuPanel();
            
            // Actualizar la sección de módulos
            console.log('Actualizando sección de módulos...');
            await this.actualizarSeccionModulos();
            
            console.log('Sistema de módulos inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar el sistema de módulos:', error);
        }
    }
}

// Función global para navegar a secciones
function navigateToSection(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');

    // Remover clase active de todos los links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Agregar clase active al link correspondiente
    const targetLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }

    // Ocultar todas las secciones
    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active-section');
    });
    
    // Mostrar la sección correspondiente
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        targetElement.style.display = 'block';
        targetElement.classList.add('active-section');
    }

    // Actualizar título de la página
    if (pageTitle && targetLink) {
        pageTitle.textContent = targetLink.textContent.trim();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const modulosFrontend = new ModulosFrontend();
    modulosFrontend.inicializar();
});

// Exportar para uso global
window.ModulosFrontend = ModulosFrontend;
window.navigateToSection = navigateToSection; 