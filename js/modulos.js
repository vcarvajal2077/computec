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
        const userData = localStorage.getItem('usuario_logueado');
        return userData ? JSON.parse(userData) : null;
    }
    
    /**
     * Carga los módulos del usuario actual desde la API
     */
    async cargarModulosUsuario() {
        if (!this.userData) {
            console.error('No hay datos de usuario disponibles');
            return [];
        }
        
        try {
            const userId = this.userData.id || this.userData.id_usuario;
            console.log('Cargando módulos para usuario ID:', userId);
            const response = await fetch(`${this.apiUrl}?action=usuario&id_usuario=${userId}`);
            const data = await response.json();
            
            console.log('Respuesta de la API:', data);
            
            if (data.success && data.data && data.data.length > 0) {
                console.log('Módulos cargados desde API:', data.data.length);
                return data.data;
            } else {
                console.log('No se encontraron módulos en la API, usando por defecto');
                return this.getModulosPorDefecto();
            }
        } catch (error) {
            console.error('Error al cargar módulos desde API:', error);
            return this.getModulosPorDefecto();
        }
    }
    
    /**
     * Obtiene módulos por defecto según el tipo de usuario
     * Basado en los requerimientos actualizados
     */
    getModulosPorDefecto() {
        const tipoUsuario = this.userData?.id_tipo_usuario || 5; // Default: Cliente
        
        console.log('Cargando módulos por defecto para tipo de usuario:', tipoUsuario);
        
        const modulosPorTipo = {
            1: [ // Admin → 21 módulos
                { id_modulo: 1, nombre_modulo: 'Dashboard', descripcion: 'Panel principal del sistema', icono: 'fas fa-tachometer-alt' },
                { id_modulo: 2, nombre_modulo: 'Usuarios', descripcion: 'Gestión de usuarios', icono: 'fas fa-users' },
                { id_modulo: 3, nombre_modulo: 'Clientes', descripcion: 'Gestión de clientes', icono: 'fas fa-user-group' },
                { id_modulo: 4, nombre_modulo: 'Productos', descripcion: 'Gestión de productos', icono: 'fas fa-box' },
                { id_modulo: 5, nombre_modulo: 'Servicios', descripcion: 'Gestión de servicios técnicos', icono: 'fas fa-tools' },
                { id_modulo: 6, nombre_modulo: 'Ventas', descripcion: 'Gestión de ventas', icono: 'fas fa-shopping-cart' },
                { id_modulo: 7, nombre_modulo: 'Inventario', descripcion: 'Control de inventario', icono: 'fas fa-warehouse' },
                { id_modulo: 8, nombre_modulo: 'Citas', descripcion: 'Programación de citas', icono: 'fas fa-calendar' },
                { id_modulo: 9, nombre_modulo: 'Reportes', descripcion: 'Generación de reportes', icono: 'fas fa-chart-bar' },
                { id_modulo: 10, nombre_modulo: 'Configuración', descripcion: 'Configuración del sistema', icono: 'fas fa-cog' },
                { id_modulo: 11, nombre_modulo: 'Mis Servicios', descripcion: 'Servicios asignados', icono: 'fas fa-tools' },
                { id_modulo: 12, nombre_modulo: 'Reparaciones', descripcion: 'Gestión de reparaciones', icono: 'fas fa-wrench' },
                { id_modulo: 13, nombre_modulo: 'Proveedores', descripcion: 'Gestión de proveedores', icono: 'fas fa-truck' },
                { id_modulo: 14, nombre_modulo: 'Garantías', descripcion: 'Gestión de garantías', icono: 'fas fa-shield-alt' },
                { id_modulo: 15, nombre_modulo: 'Facturas', descripcion: 'Gestión de facturas', icono: 'fas fa-file-invoice' },
                { id_modulo: 16, nombre_modulo: 'Soporte Técnico', descripcion: 'Sistema de tickets de soporte', icono: 'fas fa-headset' },
                { id_modulo: 17, nombre_modulo: 'Mi Perfil', descripcion: 'Gestión del perfil de usuario', icono: 'fas fa-user-cog' },
                { id_modulo: 18, nombre_modulo: 'Mis Productos', descripcion: 'Productos comprados', icono: 'fas fa-shopping-bag' },
                { id_modulo: 19, nombre_modulo: 'Portal Cliente', descripcion: 'Portal de acceso para clientes', icono: 'fas fa-user' },
                { id_modulo: 20, nombre_modulo: 'Supervisión', descripcion: 'Panel de supervisión', icono: 'fas fa-eye' },
                { id_modulo: 21, nombre_modulo: 'Anuncios', descripcion: 'Gestión de anuncios', icono: 'fas fa-bullhorn' },
                { id_modulo: 22, nombre_modulo: 'Eventos', descripcion: 'Gestión de eventos', icono: 'fas fa-calendar-alt' }
            ],
            2: [ // Gestor de Tienda → 8 módulos
                { id_modulo: 4, nombre_modulo: 'Productos', descripcion: 'Gestión de productos', icono: 'fas fa-box' },
                { id_modulo: 7, nombre_modulo: 'Inventario', descripcion: 'Control de inventario', icono: 'fas fa-warehouse' },
                { id_modulo: 13, nombre_modulo: 'Proveedores', descripcion: 'Gestión de proveedores', icono: 'fas fa-truck' },
                { id_modulo: 14, nombre_modulo: 'Garantías', descripcion: 'Gestión de garantías', icono: 'fas fa-shield-alt' },
                { id_modulo: 6, nombre_modulo: 'Ventas', descripcion: 'Gestión de ventas', icono: 'fas fa-shopping-cart' },
                { id_modulo: 15, nombre_modulo: 'Facturas', descripcion: 'Gestión de facturas', icono: 'fas fa-file-invoice' },
                { id_modulo: 9, nombre_modulo: 'Reportes', descripcion: 'Generación de reportes', icono: 'fas fa-chart-bar' },
                { id_modulo: 17, nombre_modulo: 'Mi Perfil', descripcion: 'Gestión del perfil de usuario', icono: 'fas fa-user-cog' }
            ],
            3: [ // Editor → 3 módulos
                { id_modulo: 21, nombre_modulo: 'Anuncios', descripcion: 'Gestión de anuncios y promociones', icono: 'fas fa-bullhorn' },
                { id_modulo: 22, nombre_modulo: 'Eventos', descripcion: 'Gestión de eventos y descuentos', icono: 'fas fa-calendar-alt' },
                { id_modulo: 20, nombre_modulo: 'Supervisión', descripcion: 'Panel de supervisión de contenido', icono: 'fas fa-eye' }
            ],
            4: [ // Técnico → 4 módulos
                { id_modulo: 11, nombre_modulo: 'Mis Servicios', descripcion: 'Servicios asignados al técnico', icono: 'fas fa-tools' },
                { id_modulo: 12, nombre_modulo: 'Reparaciones', descripcion: 'Gestión de reparaciones asignadas', icono: 'fas fa-wrench' },
                { id_modulo: 16, nombre_modulo: 'Soporte Técnico', descripcion: 'Sistema de tickets de soporte', icono: 'fas fa-headset' },
                { id_modulo: 17, nombre_modulo: 'Mi Perfil', descripcion: 'Gestión del perfil de usuario', icono: 'fas fa-user-cog' }
            ],
            5: [ // Cliente → 8 módulos
                { id_modulo: 19, nombre_modulo: 'Portal Cliente', descripcion: 'Portal de acceso para clientes', icono: 'fas fa-user' },
                { id_modulo: 18, nombre_modulo: 'Mis Productos', descripcion: 'Productos comprados por el cliente', icono: 'fas fa-shopping-bag' },
                { id_modulo: 6, nombre_modulo: 'Ventas', descripcion: 'Ver mis pedidos', icono: 'fas fa-shopping-cart' },
                { id_modulo: 15, nombre_modulo: 'Facturas', descripcion: 'Ver facturas propias', icono: 'fas fa-file-invoice' },
                { id_modulo: 16, nombre_modulo: 'Soporte Técnico', descripcion: 'Crear solicitudes de soporte', icono: 'fas fa-headset' },
                { id_modulo: 17, nombre_modulo: 'Mi Perfil', descripcion: 'Gestión del perfil de usuario', icono: 'fas fa-user-cog' },
                { id_modulo: 21, nombre_modulo: 'Anuncios', descripcion: 'Ver anuncios y promociones', icono: 'fas fa-bullhorn' },
                { id_modulo: 22, nombre_modulo: 'Eventos', descripcion: 'Ver eventos y descuentos', icono: 'fas fa-calendar-alt' }
            ]
        };
        
        return modulosPorTipo[tipoUsuario] || modulosPorTipo[5];
    }
    
    /**
     * Crea el HTML del menú basado en los módulos
     * Los módulos se muestran como botones debajo del botón "Menú"
     */
    crearMenuHTML(modulos) {
        let menuHTML = '';
        
        // Botón de Menú principal (siempre primero)
        menuHTML += `
            <div class="nav-item">
                <a href="/Proyecto/panel.html" class="nav-link active" data-section="menu">
                    <i class="fas fa-bars"></i>
                    Menú
                </a>
            </div>
        `;
        
        // Módulos dinámicos como botones debajo del Menú
        modulos.forEach(modulo => {
            const iconClass = modulo.icono || 'fas fa-circle';
            const moduloUrl = modulo.url || '#';
            
            menuHTML += `
                <div class="nav-item">
                    <a href="${moduloUrl}" class="nav-link" data-modulo-id="${modulo.id_modulo}">
                        <i class="${iconClass}"></i>
                        ${modulo.nombre_modulo}
                    </a>
                </div>
            `;
        });
        
        return menuHTML;
    }
    
    /**
     * Genera el menú dinámico para el usuario
     */
    async generarMenuDinamico() {
        console.log('Generando menú dinámico...');
        const modulos = await this.cargarModulosUsuario();
        console.log('Módulos para el menú:', modulos);
        return this.crearMenuHTML(modulos);
    }
    
    /**
     * Actualiza el menú en el panel
     */
    async actualizarMenuPanel() {
        console.log('Actualizando menú del panel...');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!navMenu) {
            console.error('No se encontró el elemento .nav-menu');
            return;
        }
        
        const menuHTML = await this.generarMenuDinamico();
        navMenu.innerHTML = menuHTML;
        console.log('Menú actualizado en el DOM');
        
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
                
                const targetSection = this.getAttribute('data-section');
                
                // Remover clase active de todos los links
                navLinks.forEach(l => l.classList.remove('active'));
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
                    pageTitle.textContent = this.textContent.trim();
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
            const moduloUrl = modulo.url || '#';
            
            tarjetasHTML += `
                <div class="module-card" onclick="window.location.href='${moduloUrl}'">
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
            await this.actualizarMenuPanel();
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

    navLinks.forEach(link => link.classList.remove('active'));
    
    const targetLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }

    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active-section');
    });
    
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        targetElement.style.display = 'block';
        targetElement.classList.add('active-section');
    }

    if (pageTitle && targetLink) {
        pageTitle.textContent = targetLink.textContent.trim();
    }
}

// Exportar para uso global
window.ModulosFrontend = ModulosFrontend;
window.navigateToSection = navigateToSection;
