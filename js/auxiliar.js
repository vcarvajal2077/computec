// Gestor de Navegación
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.sidebar-nav a');
        this.moduleContent = document.getElementById('module-content');
        this.currentModule = null;
        this.setupEventListeners();
        this.loadInitialModule();
    }

    setupEventListeners() {
        this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
                const module = link.getAttribute('data-module');
                this.navigateToModule(module);
            });
        });

        // Eventos para los modales
        document.getElementById('notificationsBtn').addEventListener('click', () => this.toggleModal('notificationsModal'));
        document.getElementById('helpBtn').addEventListener('click', () => this.toggleModal('helpModal'));
        
        // Cerrar modales
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const modal = closeBtn.closest('.modal');
                this.closeModal(modal);
        });
    });
    }

    loadInitialModule() {
        const hash = window.location.hash.substring(1) || 'recepcion';
        this.navigateToModule(hash);
    }

    navigateToModule(module) {
        this.currentModule = module;
        this.updateActiveLink();
        this.loadModuleContent(module);
        window.location.hash = module;
    }

    updateActiveLink() {
        this.navLinks.forEach(link => {
        link.classList.remove('active');
            if (link.getAttribute('data-module') === this.currentModule) {
            link.classList.add('active');
        }
    });
}

    loadModuleContent(module) {
        let content = '';
        switch (module) {
            case 'recepcion':
                content = this.getRecepcionContent();
                break;
            case 'seguimiento':
                content = this.getSeguimientoContent();
                break;
            case 'entrega':
                content = this.getEntregaContent();
                break;
            case 'comunicacion':
                content = this.getComunicacionContent();
                break;
            case 'inventario':
                content = this.getInventarioContent();
                break;
            case 'historial':
                content = this.getHistorialContent();
                break;
            case 'caja':
                content = this.getCajaContent();
                break;
            default:
                content = '<h2>Módulo no encontrado</h2>';
        }
        this.moduleContent.innerHTML = content;
        this.setupModuleEventListeners();
    }

    getRecepcionContent() {
        return `
            <div class="module-section">
                <div class="section-header">
                    <h2>Recepción de Equipos</h2>
                    <div class="header-actions">
                        <button class="btn primary" id="nuevaRecepcionBtn">
                            <i class="fas fa-plus"></i> Nueva Recepción
                        </button>
                    </div>
                </div>
                <form id="recepcionForm" class="form-container">
                    <div class="form-group">
                        <label for="cliente">Cliente</label>
                        <input type="text" id="cliente" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="equipo">Equipo</label>
                        <input type="text" id="equipo" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="descripcion">Descripción del Problema</label>
                        <textarea id="descripcion" class="form-control" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="fecha">Fecha de Recepción</label>
                        <input type="date" id="fecha" class="form-control" required>
                    </div>
                    <button type="submit" class="btn primary">Registrar Recepción</button>
                </form>
            </div>
        `;
    }

    getSeguimientoContent() {
        return `
            <div class="module-section">
                <div class="section-header">
                    <h2>Seguimiento de Órdenes</h2>
                    <div class="header-actions">
                        <button class="btn secondary" id="exportarBtn">
                            <i class="fas fa-file-export"></i> Exportar
                        </button>
                        <button class="btn primary" id="actualizarBtn">
                            <i class="fas fa-sync"></i> Actualizar
                        </button>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Orden #</th>
                                <th>Cliente</th>
                                <th>Equipo</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>001</td>
                                <td>Cliente A</td>
                                <td>Laptop</td>
                                <td>En Proceso</td>
                                <td>2024-02-20</td>
                                <td>
                                    <button class="btn secondary">Ver Detalles</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getEntregaContent() {
        return `
            <div class="module-section">
                <div class="section-header">
                    <h2>Entrega de Equipos</h2>
                    <div class="header-actions">
                        <button class="btn primary" id="nuevaEntregaBtn">
                            <i class="fas fa-check-circle"></i> Nueva Entrega
                        </button>
                    </div>
                </div>
                <form id="entregaForm" class="form-container">
                    <div class="form-group">
                        <label for="ordenEntrega">Número de Orden</label>
                        <input type="text" id="ordenEntrega" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="clienteEntrega">Cliente</label>
                        <input type="text" id="clienteEntrega" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="fechaEntrega">Fecha de Entrega</label>
                        <input type="date" id="fechaEntrega" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="observaciones">Observaciones</label>
                        <textarea id="observaciones" class="form-control" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn primary">Registrar Entrega</button>
                </form>
            </div>
        `;
    }

    getComunicacionContent() {
        return `
            <div class="module-section">
                <div class="section-header">
                    <h2>Comunicación</h2>
                    <div class="header-actions">
                        <button class="btn primary" id="nuevoMensajeBtn">
                            <i class="fas fa-envelope"></i> Nuevo Mensaje
                        </button>
                    </div>
                </div>
                <div class="mensajes-list">
                    <div class="mensaje">
                        <h3>Mensaje de Cliente A</h3>
                        <p>Hola, ¿cómo va mi reparación?</p>
                        <small>Enviado: 2024-02-20 10:30</small>
                    </div>
                </div>
            </div>
        `;
    }

    getInventarioContent() {
        return `
            <div class="module-section">
                <div class="section-header">
                    <h2>Inventario</h2>
                    <div class="header-actions">
                        <button class="btn secondary" id="reporteBtn">
                            <i class="fas fa-file-export"></i> Generar Reporte
                        </button>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>001</td>
                                <td>Laptop</td>
                                <td>Electrónica</td>
                                <td>10</td>
                                <td>Disponible</td>
                                <td>
                                    <button class="btn secondary">Ver Detalles</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getHistorialContent() {
        return `
            <div class="module-section">
                <div class="section-header">
                    <h2>Historial</h2>
                    <div class="header-actions">
                        <button class="btn secondary" id="busquedaBtn">
                            <i class="fas fa-search"></i> Búsqueda Avanzada
                </button>
                        <button class="btn primary" id="exportarHistorialBtn">
                            <i class="fas fa-file-export"></i> Exportar
                </button>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Equipo</th>
                                <th>Fecha</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>001</td>
                                <td>Cliente A</td>
                                <td>Laptop</td>
                                <td>2024-02-20</td>
                                <td>Recepción</td>
                                <td>Completado</td>
                                <td>
                                    <button class="btn secondary">Ver Detalles</button>
            </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getCajaContent() {
        return `
            <div class="module-section">
                <div class="section-header">
                    <h2>Caja y Pagos</h2>
                    <div class="header-actions">
                        <button class="btn primary" id="nuevoPagoBtn">
                            <i class="fas fa-plus"></i> Nuevo Pago
                        </button>
        </div>
        </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Monto</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>001</td>
                                <td>Cliente A</td>
                                <td>$100</td>
                                <td>2024-02-20</td>
                                <td>Pagado</td>
                                <td>
                                    <button class="btn secondary">Ver Detalles</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
        </div>
        </div>
        `;
    }

    setupModuleEventListeners() {
        // Eventos específicos para cada módulo
        const form = document.getElementById('recepcionForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Lógica para procesar el formulario de recepción
                console.log('Formulario de recepción enviado');
            });
        }

        const entregaForm = document.getElementById('entregaForm');
        if (entregaForm) {
            entregaForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Lógica para procesar el formulario de entrega
                console.log('Formulario de entrega enviado');
            });
        }

        // Botones de acción
        const nuevaRecepcionBtn = document.getElementById('nuevaRecepcionBtn');
        if (nuevaRecepcionBtn) {
            nuevaRecepcionBtn.addEventListener('click', () => {
                // Lógica para nueva recepción
                console.log('Nueva recepción');
            });
        }

        const exportarBtn = document.getElementById('exportarBtn');
        if (exportarBtn) {
            exportarBtn.addEventListener('click', () => {
                // Lógica para exportar
                console.log('Exportar datos');
            });
        }
    }

    toggleModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal.style.display === 'flex') {
            this.closeModal(modal);
        } else {
            this.openModal(modal);
        }
    }

    openModal(modal) {
        modal.style.display = 'flex';
    }

    closeModal(modal) {
        modal.style.display = 'none';
    }
}

// Inicializar el gestor de navegación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const navigationManager = new NavigationManager();
}); 