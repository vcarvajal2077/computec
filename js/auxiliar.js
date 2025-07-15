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
                <div id="recepcionFormContainer"></div>
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
                // Validaciones
                let valido = true;
                // Limpiar errores previos
                entregaForm.querySelectorAll('.error-message').forEach(el => el.remove());
                entregaForm.querySelectorAll('.form-control').forEach(el => el.classList.remove('input-error'));

                // Helper para mostrar error
                function mostrarError(id, mensaje) {
                    const input = document.getElementById(id);
                    input.classList.add('input-error');
                    let error = document.createElement('div');
                    error.className = 'error-message';
                    error.style.color = '#f44336';
                    error.style.fontSize = '0.9em';
                    error.style.marginTop = '0.2em';
                    error.textContent = mensaje;
                    input.parentNode.appendChild(error);
                    valido = false;
                }

                // Validar Número de Orden
                const orden = entregaForm.ordenEntrega.value.trim();
                if (!orden) mostrarError('ordenEntrega', 'El número de orden es obligatorio.');
                // Validar Cliente
                const cliente = entregaForm.clienteEntrega.value.trim();
                if (!cliente) mostrarError('clienteEntrega', 'El cliente es obligatorio.');
                // Validar Fecha de Entrega
                const fecha = entregaForm.fechaEntrega.value;
                if (!fecha) {
                    mostrarError('fechaEntrega', 'La fecha de entrega es obligatoria.');
                } else {
                    const hoy = new Date();
                    const fechaIngresada = new Date(fecha);
                    hoy.setHours(0,0,0,0);
                    if (fechaIngresada > hoy) {
                        mostrarError('fechaEntrega', 'La fecha no puede ser futura.');
                    }
                }
                // Si no es válido, no enviar
                if (!valido) return;
                // Si todo está bien, simular guardado
                alert('Entrega registrada (simulado)');
                entregaForm.reset();
            });
        }

        // Botón Nueva Recepción
        const nuevaRecepcionBtn = document.getElementById('nuevaRecepcionBtn');
        if (nuevaRecepcionBtn) {
            nuevaRecepcionBtn.addEventListener('click', () => {
                this.mostrarFormularioRecepcion();
            });
        }

        const exportarBtn = document.getElementById('exportarBtn');
        if (exportarBtn) {
            exportarBtn.addEventListener('click', () => {
                // Lógica para exportar
                console.log('Exportar datos');
            });
        }

        // Botón Nuevo Mensaje
        const nuevoMensajeBtn = document.getElementById('nuevoMensajeBtn');
        if (nuevoMensajeBtn) {
            nuevoMensajeBtn.addEventListener('click', () => {
                mostrarModalNuevoMensaje();
            });
        }

        // Botón Nuevo Pago
        const nuevoPagoBtn = document.getElementById('nuevoPagoBtn');
        if (nuevoPagoBtn) {
            nuevoPagoBtn.addEventListener('click', () => {
                mostrarModalNuevoPago();
            });
        }

        // Función para mostrar el modal de nuevo mensaje
        function mostrarModalNuevoMensaje() {
            // Crear modal si no existe
            let modal = document.getElementById('modalNuevoMensaje');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'modalNuevoMensaje';
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>Nuevo Mensaje</h2>
                            <span class="close" id="cerrarModalNuevoMensaje">&times;</span>
                        </div>
                        <form id="formNuevoMensaje">
                            <div class="form-group">
                                <label for="destinatario">Destinatario</label>
                                <input type="text" id="destinatario" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="mensaje">Mensaje</label>
                                <textarea id="mensaje" class="form-control" rows="3" required></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn primary"><i class="fas fa-paper-plane"></i> Enviar</button>
                                <button type="button" class="btn secondary" id="cancelarNuevoMensaje"><i class="fas fa-times"></i> Cancelar</button>
                            </div>
                        </form>
                    </div>
                `;
                document.body.appendChild(modal);
            }
            modal.style.display = 'flex';

            // Cerrar modal
            document.getElementById('cerrarModalNuevoMensaje').onclick = () => { modal.style.display = 'none'; };
            document.getElementById('cancelarNuevoMensaje').onclick = () => { modal.style.display = 'none'; };

            // Validación y envío
            document.getElementById('formNuevoMensaje').onsubmit = function(e) {
                e.preventDefault();
                let valido = true;
                this.querySelectorAll('.error-message').forEach(el => el.remove());
                this.querySelectorAll('.form-control').forEach(el => el.classList.remove('input-error'));
                function mostrarError(id, mensaje) {
                    const input = document.getElementById(id);
                    input.classList.add('input-error');
                    let error = document.createElement('div');
                    error.className = 'error-message';
                    error.style.color = '#f44336';
                    error.style.fontSize = '0.9em';
                    error.style.marginTop = '0.2em';
                    error.textContent = mensaje;
                    input.parentNode.appendChild(error);
                    valido = false;
                }
                const destinatario = this.destinatario.value.trim();
                const mensaje = this.mensaje.value.trim();
                if (!destinatario) mostrarError('destinatario', 'El destinatario es obligatorio.');
                if (!mensaje) mostrarError('mensaje', 'El mensaje no puede estar vacío.');
                if (!valido) return;
                // Agregar mensaje simulado a la lista
                const lista = document.querySelector('.mensajes-list');
                if (lista) {
                    const nuevo = document.createElement('div');
                    nuevo.className = 'mensaje';
                    nuevo.innerHTML = `<h3>Mensaje a ${destinatario}</h3><p>${mensaje}</p><small>Enviado: ${new Date().toLocaleString()}</small>`;
                    lista.prepend(nuevo);
                }
                modal.style.display = 'none';
            };
        }

        // Función para mostrar el modal de nuevo pago
        function mostrarModalNuevoPago() {
            let modal = document.getElementById('modalNuevoPago');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'modalNuevoPago';
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content modal-pago-ancho">
                        <div class="modal-header">
                            <h2>Nuevo Pago</h2>
                            <span class="close" id="cerrarModalNuevoPago">&times;</span>
                        </div>
                        <form id="formNuevoPago">
                            <div class="form-group">
                                <label for="clientePago">Cliente</label>
                                <input type="text" id="clientePago" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="montoPago">Monto</label>
                                <input type="number" id="montoPago" class="form-control" min="0.01" step="0.01" required>
                            </div>
                            <div class="form-group">
                                <label for="fechaPago">Fecha</label>
                                <input type="date" id="fechaPago" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="metodoPago">Método de pago</label>
                                <select id="metodoPago" class="form-control" required>
                                    <option value="">Seleccione...</option>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="tarjeta">Tarjeta</option>
                                    <option value="transferencia">Transferencia</option>
                                    <option value="credito">Crédito</option>
                                </select>
                            </div>
                            <div class="form-group" id="referenciaPagoGroup" style="display:none;">
                                <label for="referenciaPago">Referencia</label>
                                <input type="text" id="referenciaPago" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="estadoPago">Estado</label>
                                <select id="estadoPago" class="form-control" required>
                                    <option value="">Seleccione...</option>
                                    <option value="pagado">Pagado</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="cancelado">Cancelado</option>
                                    <option value="devuelto">Devuelto</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="observacionesPago">Observaciones</label>
                                <textarea id="observacionesPago" class="form-control" rows="2" maxlength="250"></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn primary"><i class="fas fa-save"></i> Registrar Pago</button>
                                <button type="button" class="btn secondary" id="cancelarNuevoPago"><i class="fas fa-times"></i> Cancelar</button>
                            </div>
                        </form>
                    </div>
                `;
                document.body.appendChild(modal);
            }
            modal.style.display = 'flex';
            document.getElementById('cerrarModalNuevoPago').onclick = () => { modal.style.display = 'none'; };
            document.getElementById('cancelarNuevoPago').onclick = () => { modal.style.display = 'none'; };
            // Mostrar/ocultar referencia según método
            const metodoPagoSelect = document.getElementById('metodoPago');
            const referenciaGroup = document.getElementById('referenciaPagoGroup');
            metodoPagoSelect.onchange = function() {
                if (this.value === 'tarjeta' || this.value === 'transferencia') {
                    referenciaGroup.style.display = '';
                } else {
                    referenciaGroup.style.display = 'none';
                }
            };
            document.getElementById('formNuevoPago').onsubmit = function(e) {
                e.preventDefault();
                let valido = true;
                this.querySelectorAll('.error-message').forEach(el => el.remove());
                this.querySelectorAll('.form-control').forEach(el => el.classList.remove('input-error'));
                function mostrarError(id, mensaje) {
                    const input = document.getElementById(id);
                    input.classList.add('input-error');
                    let error = document.createElement('div');
                    error.className = 'error-message';
                    error.style.color = '#f44336';
                    error.style.fontSize = '0.9em';
                    error.style.marginTop = '0.2em';
                    error.textContent = mensaje;
                    input.parentNode.appendChild(error);
                    valido = false;
                }
                const cliente = this.clientePago.value.trim();
                const monto = parseFloat(this.montoPago.value);
                const montoStr = this.montoPago.value.trim();
                const fecha = this.fechaPago.value;
                const metodo = this.metodoPago.value;
                const referencia = this.referenciaPago ? this.referenciaPago.value.trim() : '';
                const estado = this.estadoPago.value;
                const observaciones = this.observacionesPago.value.trim();
                // Cliente solo letras y espacios
                if (!cliente) mostrarError('clientePago', 'El cliente es obligatorio.');
                else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(cliente)) mostrarError('clientePago', 'El nombre solo debe contener letras y espacios.');
                // Monto máximo y dos decimales
                if (!monto || monto <= 0) mostrarError('montoPago', 'El monto debe ser mayor a 0.');
                else if (monto > 1000000) mostrarError('montoPago', 'El monto no puede superar $1,000,000.');
                else if (!/^(\d+)(\.\d{1,2})?$/.test(montoStr)) mostrarError('montoPago', 'Máximo dos decimales.');
                // Fecha no anterior a 2020-01-01
                if (!fecha) {
                    mostrarError('fechaPago', 'La fecha es obligatoria.');
                } else {
                    const hoy = new Date();
                    const fechaIngresada = new Date(fecha);
                    hoy.setHours(0,0,0,0);
                    const minFecha = new Date('2020-01-01');
                    if (fechaIngresada > hoy) {
                        mostrarError('fechaPago', 'La fecha no puede ser futura.');
                    } else if (fechaIngresada < minFecha) {
                        mostrarError('fechaPago', 'No se permiten pagos antes de 2020.');
                    }
                }
                // Método de pago
                if (!metodo) mostrarError('metodoPago', 'Seleccione el método de pago.');
                // Referencia obligatoria si tarjeta o transferencia
                if ((metodo === 'tarjeta' || metodo === 'transferencia') && !referencia) {
                    mostrarError('referenciaPago', 'La referencia es obligatoria para este método.');
                }
                // Estado
                if (!estado) mostrarError('estadoPago', 'Seleccione el estado del pago.');
                // Observaciones obligatorias si devuelto/cancelado
                if ((estado === 'devuelto' || estado === 'cancelado') && !observaciones) {
                    mostrarError('observacionesPago', 'Debe indicar el motivo en observaciones.');
                }
                // Observaciones máximo 250 caracteres
                if (observaciones.length > 250) {
                    mostrarError('observacionesPago', 'Máximo 250 caracteres.');
                }
                if (!valido) return;
                // Agregar pago simulado a la tabla
                const tabla = document.querySelector('.data-table tbody');
                if (tabla) {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>Nuevo</td>
                        <td>${cliente}</td>
                        <td>$${monto.toFixed(2)}</td>
                        <td>${fecha}</td>
                        <td>${estado.charAt(0).toUpperCase() + estado.slice(1)}</td>
                        <td><button class='btn secondary'>Ver Detalles</button></td>
                    `;
                    tabla.prepend(fila);
                }
                modal.style.display = 'none';
            };
        }
    }

    mostrarFormularioRecepcion() {
        const container = document.getElementById('recepcionFormContainer');
        if (!container) return;
        container.innerHTML = `
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
                    <label for="tipoEquipo">Tipo de equipo</label>
                    <select id="tipoEquipo" class="form-control" required>
                        <option value="">Seleccione...</option>
                        <option value="Laptop">Laptop</option>
                        <option value="PC">PC</option>
                        <option value="Tablet">Tablet</option>
                        <option value="Impresora">Impresora</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="marca">Marca</label>
                    <input type="text" id="marca" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="modelo">Modelo</label>
                    <input type="text" id="modelo" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="descripcion">Descripción del Problema</label>
                    <textarea id="descripcion" class="form-control" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label for="fecha">Fecha de Recepción</label>
                    <input type="date" id="fecha" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="estadoInicial">Estado inicial</label>
                    <select id="estadoInicial" class="form-control" required>
                        <option value="">Seleccione...</option>
                        <option value="Bueno">Bueno</option>
                        <option value="Regular">Regular</option>
                        <option value="Malo">Malo</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Accesorios entregados</label>
                    <div>
                        <label><input type="checkbox" name="accesorios" value="Cargador"> Cargador</label>
                        <label><input type="checkbox" name="accesorios" value="Mouse"> Mouse</label>
                        <label><input type="checkbox" name="accesorios" value="Bolso"> Bolso</label>
                        <label><input type="checkbox" name="accesorios" value="Cable USB"> Cable USB</label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="observaciones">Observaciones</label>
                    <textarea id="observaciones" class="form-control" rows="2"></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn primary"><i class="fas fa-save"></i> Guardar Recepción</button>
                    <button type="button" class="btn secondary" id="cancelarRecepcionBtn"><i class="fas fa-times"></i> Cancelar</button>
                </div>
            </form>
        `;
        // Evento cancelar
        document.getElementById('cancelarRecepcionBtn').onclick = () => {
            container.innerHTML = '';
        };
        // Evento submit
        document.getElementById('recepcionForm').onsubmit = (e) => {
            e.preventDefault();
            // Validaciones
            let valido = true;
            const form = document.getElementById('recepcionForm');
            // Limpiar errores previos
            form.querySelectorAll('.error-message').forEach(el => el.remove());
            form.querySelectorAll('.form-control').forEach(el => el.classList.remove('input-error'));

            // Helper para mostrar error
            function mostrarError(id, mensaje) {
                const input = document.getElementById(id);
                input.classList.add('input-error');
                let error = document.createElement('div');
                error.className = 'error-message';
                error.style.color = '#f44336';
                error.style.fontSize = '0.9em';
                error.style.marginTop = '0.2em';
                error.textContent = mensaje;
                input.parentNode.appendChild(error);
                valido = false;
            }

            // Validar Cliente
            const cliente = form.cliente.value.trim();
            if (!cliente) mostrarError('cliente', 'El cliente es obligatorio.');
            // Validar Equipo
            const equipo = form.equipo.value.trim();
            if (!equipo) mostrarError('equipo', 'El equipo es obligatorio.');
            // Validar Tipo de equipo
            const tipoEquipo = form.tipoEquipo.value;
            if (!tipoEquipo) mostrarError('tipoEquipo', 'Seleccione el tipo de equipo.');
            // Validar Marca
            const marca = form.marca.value.trim();
            if (!marca) mostrarError('marca', 'La marca es obligatoria.');
            // Validar Modelo
            const modelo = form.modelo.value.trim();
            if (!modelo) mostrarError('modelo', 'El modelo es obligatorio.');
            // Validar Descripción
            const descripcion = form.descripcion.value.trim();
            if (!descripcion) mostrarError('descripcion', 'La descripción es obligatoria.');
            // Validar Fecha
            const fecha = form.fecha.value;
            if (!fecha) {
                mostrarError('fecha', 'La fecha es obligatoria.');
            } else {
                const hoy = new Date();
                const fechaIngresada = new Date(fecha);
                hoy.setHours(0,0,0,0);
                if (fechaIngresada > hoy) {
                    mostrarError('fecha', 'La fecha no puede ser futura.');
                }
            }
            // Validar Estado inicial
            const estadoInicial = form.estadoInicial.value;
            if (!estadoInicial) mostrarError('estadoInicial', 'Seleccione el estado inicial.');

            // Si no es válido, no enviar
            if (!valido) return;

            // Si todo está bien, simular guardado
            alert('Recepción registrada (simulado)');
            container.innerHTML = '';
        };
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