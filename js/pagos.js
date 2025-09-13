/**
 * SISTEMA DE PAGOS AVANZADO
 * Maneja el procesamiento de pagos con múltiples pasarelas
 */

class PagosManager {
    constructor() {
        this.apiBase = 'api/pagos.php';
        this.metodosDisponibles = [];
        this.metodoSeleccionado = null;
        
        this.init();
    }
    
    init() {
        this.cargarMetodosDisponibles();
        this.bindEvents();
    }
    
    async cargarMetodosDisponibles() {
        try {
            const response = await fetch(`${this.apiBase}?action=metodos_disponibles`);
            const data = await response.json();
            
            if (data.success) {
                this.metodosDisponibles = data.data.metodos;
                this.renderizarMetodosPago();
            }
        } catch (error) {
            console.error('Error cargando métodos de pago:', error);
        }
    }
    
    renderizarMetodosPago() {
        const container = document.getElementById('payment-methods');
        if (!container) return;
        
        container.innerHTML = this.metodosDisponibles.map(metodo => `
            <div class="payment-option" data-metodo="${metodo.id}">
                <input type="radio" id="pago_${metodo.id}" name="metodo_pago" value="${metodo.id}">
                <label for="pago_${metodo.id}">
                    <div class="payment-icon" style="--metodo-color: ${metodo.color}">
                        <i class="${metodo.icono}"></i>
                    </div>
                    <div class="payment-info">
                        <span class="payment-name">${metodo.nombre}</span>
                        <small class="payment-description">${metodo.descripcion}</small>
                        <div class="payment-details">
                            <span class="comision">Comisión: ${metodo.comision}</span>
                            ${metodo.habilitado ? '<span class="disponible">Disponible</span>' : '<span class="no-disponible">No disponible</span>'}
                        </div>
                    </div>
                </label>
            </div>
        `).join('');
        
        // Agregar event listeners
        container.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => {
                this.seleccionarMetodoPago(option.dataset.metodo);
            });
        });
    }
    
    seleccionarMetodoPago(metodoId) {
        this.metodoSeleccionado = this.metodosDisponibles.find(m => m.id === metodoId);
        this.mostrarFormularioPago(metodoId);
    }
    
    mostrarFormularioPago(metodoId) {
        // Ocultar formularios existentes
        document.querySelectorAll('.formulario-pago').forEach(form => {
            form.style.display = 'none';
        });
        
        // Mostrar formulario específico
        const formulario = document.getElementById(`formulario_${metodoId}`);
        if (formulario) {
            formulario.style.display = 'block';
        } else {
            this.crearFormularioPago(metodoId);
        }
    }
    
    crearFormularioPago(metodoId) {
        const container = document.getElementById('formularios-pago');
        if (!container) return;
        
        let formularioHTML = '';
        
        switch (metodoId) {
            case 'tarjeta':
                formularioHTML = this.crearFormularioTarjeta();
                break;
            case 'paypal':
                formularioHTML = this.crearFormularioPayPal();
                break;
            case 'nequi':
                formularioHTML = this.crearFormularioNequi();
                break;
            case 'daviplata':
                formularioHTML = this.crearFormularioDaviplata();
                break;
            case 'efectivo':
                formularioHTML = this.crearFormularioEfectivo();
                break;
            case 'transferencia':
                formularioHTML = this.crearFormularioTransferencia();
                break;
        }
        
        const formulario = document.createElement('div');
        formulario.id = `formulario_${metodoId}`;
        formulario.className = 'formulario-pago';
        formulario.innerHTML = formularioHTML;
        
        container.appendChild(formulario);
        formulario.style.display = 'block';
    }
    
    crearFormularioTarjeta() {
        return `
            <div class="formulario-tarjeta">
                <h3><i class="fas fa-credit-card"></i> Datos de la Tarjeta</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label for="numero_tarjeta">Número de Tarjeta *</label>
                        <input type="text" id="numero_tarjeta" name="numero_tarjeta" 
                               placeholder="1234 5678 9012 3456" maxlength="19" required>
                    </div>
                    <div class="form-group">
                        <label for="nombre_titular">Nombre del Titular *</label>
                        <input type="text" id="nombre_titular" name="nombre_titular" 
                               placeholder="Como aparece en la tarjeta" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="fecha_vencimiento">Fecha de Vencimiento *</label>
                        <input type="text" id="fecha_vencimiento" name="fecha_vencimiento" 
                               placeholder="MM/AA" maxlength="5" required>
                    </div>
                    <div class="form-group">
                        <label for="cvv">CVV *</label>
                        <input type="text" id="cvv" name="cvv" 
                               placeholder="123" maxlength="4" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="email_tarjeta">Email para confirmación *</label>
                    <input type="email" id="email_tarjeta" name="email_tarjeta" 
                           placeholder="tu@email.com" required>
                </div>
                <div class="seguridad-tarjeta">
                    <i class="fas fa-shield-alt"></i>
                    <span>Tu información está protegida con encriptación SSL</span>
                </div>
            </div>
        `;
    }
    
    crearFormularioPayPal() {
        return `
            <div class="formulario-paypal">
                <h3><i class="fab fa-paypal"></i> Pago con PayPal</h3>
                <div class="paypal-info">
                    <p>Serás redirigido a PayPal para completar tu pago de forma segura.</p>
                    <div class="paypal-beneficios">
                        <div class="beneficio">
                            <i class="fas fa-shield-alt"></i>
                            <span>Protección del comprador</span>
                        </div>
                        <div class="beneficio">
                            <i class="fas fa-lock"></i>
                            <span>Pago seguro</span>
                        </div>
                        <div class="beneficio">
                            <i class="fas fa-undo"></i>
                            <span>Reembolsos fáciles</span>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="email_paypal">Email de PayPal *</label>
                    <input type="email" id="email_paypal" name="email_paypal" 
                           placeholder="tu@email.com" required>
                </div>
            </div>
        `;
    }
    
    crearFormularioNequi() {
        return `
            <div class="formulario-nequi">
                <h3><i class="fas fa-mobile-alt"></i> Pago con Nequi</h3>
                <div class="nequi-info">
                    <p>Ingresa tu número de teléfono registrado en Nequi</p>
                </div>
                <div class="form-group">
                    <label for="telefono_nequi">Número de Teléfono *</label>
                    <input type="tel" id="telefono_nequi" name="telefono_nequi" 
                           placeholder="+57 300 123 4567" required>
                </div>
                <div class="nequi-pasos">
                    <h4>Pasos para pagar:</h4>
                    <ol>
                        <li>Ingresa tu número de teléfono</li>
                        <li>Recibirás una notificación en Nequi</li>
                        <li>Confirma el pago en la app</li>
                    </ol>
                </div>
            </div>
        `;
    }
    
    crearFormularioDaviplata() {
        return `
            <div class="formulario-daviplata">
                <h3><i class="fas fa-mobile-alt"></i> Pago con Daviplata</h3>
                <div class="daviplata-info">
                    <p>Ingresa tu número de teléfono registrado en Daviplata</p>
                </div>
                <div class="form-group">
                    <label for="telefono_daviplata">Número de Teléfono *</label>
                    <input type="tel" id="telefono_daviplata" name="telefono_daviplata" 
                           placeholder="+57 300 123 4567" required>
                </div>
                <div class="daviplata-pasos">
                    <h4>Pasos para pagar:</h4>
                    <ol>
                        <li>Ingresa tu número de teléfono</li>
                        <li>Recibirás una notificación en Daviplata</li>
                        <li>Confirma el pago en la app</li>
                    </ol>
                </div>
            </div>
        `;
    }
    
    crearFormularioEfectivo() {
        return `
            <div class="formulario-efectivo">
                <h3><i class="fas fa-money-bill-wave"></i> Pago en Efectivo</h3>
                <div class="efectivo-info">
                    <p>Pagarás al técnico al momento de recibir el servicio.</p>
                    <div class="efectivo-details">
                        <div class="detail-item">
                            <i class="fas fa-check"></i>
                            <span>Sin comisiones adicionales</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>Pago al momento del servicio</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-receipt"></i>
                            <span>Recibirás factura física</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    crearFormularioTransferencia() {
        return `
            <div class="formulario-transferencia">
                <h3><i class="fas fa-university"></i> Transferencia Bancaria</h3>
                <div class="transferencia-info">
                    <p>Realiza una transferencia a nuestra cuenta bancaria</p>
                </div>
                <div class="datos-bancarios">
                    <h4>Datos para la Transferencia:</h4>
                    <div class="banco-info">
                        <div class="banco-item">
                            <strong>Banco:</strong> Bancolombia
                        </div>
                        <div class="banco-item">
                            <strong>Tipo de Cuenta:</strong> Ahorros
                        </div>
                        <div class="banco-item">
                            <strong>Número de Cuenta:</strong> 1234567890
                        </div>
                        <div class="banco-item">
                            <strong>Titular:</strong> Computec S.A.S
                        </div>
                        <div class="banco-item">
                            <strong>NIT:</strong> 900123456-7
                        </div>
                        <div class="banco-item">
                            <strong>Referencia:</strong> ORD${Date.now()}
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="comprobante_transferencia">Subir Comprobante (Opcional)</label>
                    <input type="file" id="comprobante_transferencia" name="comprobante_transferencia" 
                           accept="image/*,.pdf">
                </div>
            </div>
        `;
    }
    
    async procesarPago(ordenId, monto) {
        const metodoPago = this.metodoSeleccionado;
        if (!metodoPago) {
            throw new Error('Selecciona un método de pago');
        }
        
        // Recopilar datos del formulario
        const datosPago = this.recopilarDatosPago(metodoPago.id);
        
        // Validar datos
        this.validarDatosPago(metodoPago.id, datosPago);
        
        // Mostrar loading
        this.mostrarLoadingPago(true);
        
        try {
            const response = await fetch(`${this.apiBase}?action=procesar_pago`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orden_id: ordenId,
                    metodo_pago: metodoPago.id,
                    monto: monto,
                    datos_pago: datosPago
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.mostrarConfirmacionPago(data.data);
                return data.data;
            } else {
                throw new Error(data.error || 'Error procesando el pago');
            }
            
        } catch (error) {
            console.error('Error procesando pago:', error);
            this.mostrarErrorPago(error.message);
            throw error;
        } finally {
            this.mostrarLoadingPago(false);
        }
    }
    
    recopilarDatosPago(metodoId) {
        const datos = {};
        
        switch (metodoId) {
            case 'tarjeta':
                datos.numero_tarjeta = document.getElementById('numero_tarjeta')?.value;
                datos.nombre_titular = document.getElementById('nombre_titular')?.value;
                datos.fecha_vencimiento = document.getElementById('fecha_vencimiento')?.value;
                datos.cvv = document.getElementById('cvv')?.value;
                datos.email = document.getElementById('email_tarjeta')?.value;
                break;
            case 'paypal':
                datos.email = document.getElementById('email_paypal')?.value;
                break;
            case 'nequi':
                datos.telefono = document.getElementById('telefono_nequi')?.value;
                break;
            case 'daviplata':
                datos.telefono = document.getElementById('telefono_daviplata')?.value;
                break;
            case 'transferencia':
                datos.comprobante = document.getElementById('comprobante_transferencia')?.files[0];
                break;
        }
        
        return datos;
    }
    
    validarDatosPago(metodoId, datos) {
        switch (metodoId) {
            case 'tarjeta':
                if (!datos.numero_tarjeta || !datos.nombre_titular || !datos.fecha_vencimiento || !datos.cvv) {
                    throw new Error('Completa todos los campos de la tarjeta');
                }
                break;
            case 'paypal':
                if (!datos.email) {
                    throw new Error('Ingresa tu email de PayPal');
                }
                break;
            case 'nequi':
            case 'daviplata':
                if (!datos.telefono) {
                    throw new Error('Ingresa tu número de teléfono');
                }
                break;
        }
    }
    
    mostrarLoadingPago(mostrar) {
        const btnPagar = document.getElementById('btn-procesar-pago');
        if (btnPagar) {
            btnPagar.disabled = mostrar;
            btnPagar.innerHTML = mostrar ? 
                '<i class="fas fa-spinner fa-spin"></i> Procesando...' : 
                '<i class="fas fa-credit-card"></i> Procesar Pago';
        }
    }
    
    mostrarConfirmacionPago(datos) {
        const modal = document.createElement('div');
        modal.className = 'modal-confirmacion-pago';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-check-circle"></i> Pago Exitoso</h2>
                </div>
                <div class="modal-body">
                    <div class="pago-confirmado">
                        <h3>¡Tu pago ha sido procesado exitosamente!</h3>
                        <div class="pago-details">
                            <p><strong>Método:</strong> ${this.metodoSeleccionado.nombre}</p>
                            <p><strong>Referencia:</strong> ${datos.transaction_id}</p>
                            <p><strong>Estado:</strong> ${datos.estado}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="this.closest('.modal-confirmacion-pago').remove()">
                        Continuar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }
    
    mostrarErrorPago(mensaje) {
        // Crear notificación de error
        if (window.NotificacionesManager) {
            NotificacionesManager.enviar('error', 'Error en el Pago', mensaje);
        } else {
            alert('Error: ' + mensaje);
        }
    }
    
    bindEvents() {
        // Formatear número de tarjeta
        document.addEventListener('input', (e) => {
            if (e.target.id === 'numero_tarjeta') {
                this.formatearNumeroTarjeta(e.target);
            }
            if (e.target.id === 'fecha_vencimiento') {
                this.formatearFechaVencimiento(e.target);
            }
        });
    }
    
    formatearNumeroTarjeta(input) {
        let valor = input.value.replace(/\D/g, '');
        valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
        input.value = valor;
    }
    
    formatearFechaVencimiento(input) {
        let valor = input.value.replace(/\D/g, '');
        if (valor.length >= 2) {
            valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
        }
        input.value = valor;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.pagosManager = new PagosManager();
});
