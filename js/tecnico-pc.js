document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.module-section');

    // Datos de ejemplo
    let reparaciones = [
        {id: 1, tipo: 'Hardware', problema: 'No enciende', estado: 'pendiente', cliente: 'Juan Pérez', fecha: '2024-03-10', descripcion: 'La PC no responde al presionar el botón de encendido.'},
        {id: 2, tipo: 'Software', problema: 'Windows no arranca', estado: 'reparacion', cliente: 'María García', fecha: '2024-03-12', descripcion: 'Pantalla azul al iniciar el sistema.'}
    ];
    let ensamblajes = [
        {id: 1, tipo: 'Gaming', cliente: 'Carlos López', estado: 'enproceso', fecha: '2024-03-15', componentes: ['Intel i7', 'RTX 3070', '16GB RAM', '1TB SSD']},
        {id: 2, tipo: 'Oficina', cliente: 'Ana Martínez', estado: 'completado', fecha: '2024-03-14', componentes: ['Intel i5', '8GB RAM', '512GB SSD']}
    ];
    let componentes = [
        {id: 1, nombre: 'Intel i7-12700K', categoria: 'Procesador', stock: 5, precio: 350},
        {id: 2, nombre: 'ASUS Z690', categoria: 'Motherboard', stock: 3, precio: 250},
        {id: 3, nombre: 'RAM 32GB', categoria: 'RAM', stock: 10, precio: 120}
    ];
    let mensajes = [
        {id: 1, cliente: 'Juan Pérez', fecha: '2024-03-16', contenido: '¿Cuándo estará lista mi PC?', estado: 'pendiente'},
        {id: 2, cliente: 'María García', fecha: '2024-03-15', contenido: '¿Me puedes enviar el presupuesto?', estado: 'respondido'}
    ];
    let historial = [
        {fecha: '2024-03-10', servicio: 'Reparación', cliente: 'Juan Pérez', estado: 'completado'},
        {fecha: '2024-03-12', servicio: 'Ensamblaje', cliente: 'Carlos López', estado: 'enproceso'}
    ];

    // Navegación
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
                section.style.display = 'block';
            } else {
                section.classList.remove('active');
                section.style.display = 'none';
            }
        });
        if (sectionId === 'reparaciones') cargarReparaciones();
        if (sectionId === 'ensamblaje') cargarEnsamblajes();
        if (sectionId === 'componentes') cargarComponentes();
        if (sectionId === 'historial') cargarHistorial();
        if (sectionId === 'calendario') cargarCalendario();
        if (sectionId === 'comunicacion') cargarMensajes();
    }
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            showSection(targetId);
        });
    });
    // Mostrar solo la sección activa al cargar
    let foundActive = false;
    sections.forEach(section => {
        if (section.classList.contains('active') && !foundActive) {
            section.style.display = 'block';
            foundActive = true;
            showSection(section.id);
        } else {
            section.style.display = 'none';
        }
    });

    // Modales
    function openModal(id) {
        document.getElementById(id).style.display = 'flex';
    }
    function closeModalAll() {
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    }
    document.querySelectorAll('.modal .close').forEach(btn => {
        btn.onclick = closeModalAll;
    });
    window.onclick = function(e) {
        if (e.target.classList && e.target.classList.contains('modal')) closeModalAll();
    };

    // Reparaciones
    function cargarReparaciones() {
        const cont = document.querySelector('.reparaciones-list');
        if (!cont) return;
        cont.innerHTML = `<table><thead><tr><th>ID</th><th>Tipo</th><th>Problema</th><th>Estado</th><th>Cliente</th><th>Fecha</th><th>Acciones</th></tr></thead><tbody>
            ${reparaciones.map(r => `
                <tr>
                    <td>${r.id}</td>
                    <td>${r.tipo}</td>
                    <td>${r.problema}</td>
                    <td><span class="badge badge-${r.estado}">${estadoTexto(r.estado)}</span></td>
                    <td>${r.cliente}</td>
                    <td>${r.fecha}</td>
                    <td>
                        <button class="btn secondary" onclick="verReparacion(${r.id})"><i class='fas fa-eye'></i></button>
                        <button class="btn primary" onclick="editarReparacion(${r.id})"><i class='fas fa-edit'></i></button>
                        <button class="btn secondary" onclick="eliminarReparacion(${r.id})"><i class='fas fa-trash'></i></button>
                    </td>
                </tr>`).join('')}
        </tbody></table>`;
    }
    window.verReparacion = function(id) {
        const r = reparaciones.find(x => x.id === id);
        if (!r) return;
        document.getElementById('detalleReparacion').innerHTML = `
            <b>ID:</b> ${r.id}<br><b>Tipo:</b> ${r.tipo}<br><b>Problema:</b> ${r.problema}<br><b>Estado:</b> <span class='badge badge-${r.estado}'>${estadoTexto(r.estado)}</span><br><b>Cliente:</b> ${r.cliente}<br><b>Fecha:</b> ${r.fecha}<br><b>Descripción:</b> ${r.descripcion}`;
        openModal('modalReparacion');
    }
    window.editarReparacion = function(id) {
        alert('Función de edición simulada para reparación ID ' + id);
    }
    window.eliminarReparacion = function(id) {
        reparaciones = reparaciones.filter(x => x.id !== id);
        cargarReparaciones();
    }
    // Ensamblaje
    function cargarEnsamblajes() {
        const cont = document.querySelector('.ensamblaje-list');
        if (!cont) return;
        cont.innerHTML = ensamblajes.map(e => `
            <div class="ensamblaje-card">
                <div class="ensamblaje-header">
                    <span class="ensamblaje-tipo"><i class="fas fa-microchip"></i> ${e.tipo}</span>
                    <span class="badge badge-${e.estado}">${estadoTexto(e.estado)}</span>
                </div>
                <div><b>Cliente:</b> ${e.cliente}</div>
                <div><b>Fecha:</b> ${e.fecha}</div>
                <div><b>Componentes:</b> ${e.componentes.join(', ')}</div>
                <div style="margin-top:0.7rem">
                    <button class="btn secondary" onclick="verEnsamblaje(${e.id})"><i class='fas fa-eye'></i></button>
                    <button class="btn primary" onclick="editarEnsamblaje(${e.id})"><i class='fas fa-edit'></i></button>
                </div>
            </div>
        `).join('');
    }
    window.verEnsamblaje = function(id) {
        const e = ensamblajes.find(x => x.id === id);
        if (!e) return;
        document.getElementById('detalleEnsamblaje').innerHTML = `
            <b>ID:</b> ${e.id}<br><b>Tipo:</b> ${e.tipo}<br><b>Cliente:</b> ${e.cliente}<br><b>Fecha:</b> ${e.fecha}<br><b>Componentes:</b> ${e.componentes.join(', ')}<br><b>Estado:</b> <span class='badge badge-${e.estado}'>${estadoTexto(e.estado)}</span>`;
        openModal('modalEnsamblaje');
    }
    window.editarEnsamblaje = function(id) {
        alert('Función de edición simulada para ensamblaje ID ' + id);
    }
    // Componentes
    function cargarComponentes() {
        const cont = document.querySelector('.componentes-grid');
        if (!cont) return;
        cont.innerHTML = componentes.map(c => `
            <div class="componente-card">
                <h3>${c.nombre}</h3>
                <div class="componente-info">Categoría: ${c.categoria}</div>
                <div class="componente-info">Precio: $${c.precio}</div>
                <div class="componente-stock">Stock: ${c.stock}</div>
                <div style="margin-top:0.7rem">
                    <button class="btn secondary" onclick="verComponente(${c.id})"><i class='fas fa-eye'></i></button>
                    <button class="btn primary" onclick="editarComponente(${c.id})"><i class='fas fa-edit'></i></button>
                </div>
            </div>
        `).join('');
    }
    window.verComponente = function(id) {
        const c = componentes.find(x => x.id === id);
        if (!c) return;
        document.getElementById('detalleComponente').innerHTML = `
            <b>ID:</b> ${c.id}<br><b>Nombre:</b> ${c.nombre}<br><b>Categoría:</b> ${c.categoria}<br><b>Precio:</b> $${c.precio}<br><b>Stock:</b> ${c.stock}`;
        openModal('modalComponente');
    }
    window.editarComponente = function(id) {
        alert('Función de edición simulada para componente ID ' + id);
    }
    // Historial
    function cargarHistorial() {
        const cont = document.querySelector('.historial-list');
        if (!cont) return;
        cont.innerHTML = `<table><thead><tr><th>Fecha</th><th>Servicio</th><th>Cliente</th><th>Estado</th></tr></thead><tbody>
            ${historial.map(h => `
                <tr>
                    <td>${h.fecha}</td>
                    <td>${h.servicio}</td>
                    <td>${h.cliente}</td>
                    <td><span class="badge badge-${h.estado}">${estadoTexto(h.estado)}</span></td>
                </tr>`).join('')}
        </tbody></table>`;
    }
    // Calendario
    function cargarCalendario() {
        const cont = document.querySelector('.calendar-grid');
        if (!cont) return;
        let dias = '';
        for(let i=1;i<=31;i++){
            const hasEvent = i === 5 || i === 12;
            dias += `<div class='calendar-day${hasEvent ? ' has-events' : ''}'>${i}${hasEvent ? `<div class='calendar-event'>${i===5?'Reparación':'Ensamblaje'}</div>` : ''}</div>`;
        }
        cont.innerHTML = dias;
    }
    // Mensajes
    function cargarMensajes() {
        const cont = document.querySelector('.mensajes-list');
        if (!cont) return;
        cont.innerHTML = mensajes.map(m => `
            <div class="mensaje-card">
                <div class="mensaje-header">
                    <span class="mensaje-cliente"><i class="fas fa-user"></i> ${m.cliente}</span>
                    <span class="mensaje-fecha">${m.fecha}</span>
                </div>
                <div class="mensaje-contenido">${m.contenido}</div>
                <div class="mensaje-acciones">
                    <button class="btn primary" onclick="responderMensaje(${m.id})"><i class="fas fa-reply"></i> Responder</button>
                </div>
            </div>
        `).join('');
    }
    window.responderMensaje = function(id) {
        const m = mensajes.find(x => x.id === id);
        if (!m) return;
        let modal = document.getElementById('modalResponderMensaje');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalResponderMensaje';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class='modal-content' style='max-width:500px;width:95%;overflow-y:auto;'>
                    <div class='modal-header'>
                        <h2>Responder a ${m.cliente}</h2>
                        <span class='close' id='cerrarModalResponderMensaje'>&times;</span>
                    </div>
                    <form id='formResponderMensaje'>
                        <div class='form-group'>
                            <label for='respuestaMensaje'>Respuesta</label>
                            <textarea id='respuestaMensaje' class='form-control' rows='3' required></textarea>
                        </div>
                        <div class='form-actions'>
                            <button type='submit' class='btn primary'><i class='fas fa-paper-plane'></i> Enviar</button>
                            <button type='button' class='btn secondary' id='cancelarResponderMensaje'><i class='fas fa-times'></i> Cancelar</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        document.getElementById('cerrarModalResponderMensaje').onclick = () => { modal.style.display = 'none'; };
        document.getElementById('cancelarResponderMensaje').onclick = () => { modal.style.display = 'none'; };
        document.getElementById('formResponderMensaje').onsubmit = function(e) {
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
            const respuesta = this.respuestaMensaje.value.trim();
            if (!respuesta) mostrarError('respuestaMensaje', 'La respuesta es obligatoria.');
            else if (respuesta.length < 5) mostrarError('respuestaMensaje', 'Debe tener al menos 5 caracteres.');
            if (!valido) return;
            m.estado = 'respondido';
            m.respuesta = respuesta;
            cargarMensajes();
            modal.style.display = 'none';
        };
    }

    // Utilidades
    function estadoTexto(estado) {
        switch(estado) {
            case 'pendiente': return 'Pendiente';
            case 'reparacion': return 'En reparación';
            case 'diagnostico': return 'En diagnóstico';
            case 'completado': return 'Completado';
            case 'enproceso': return 'En proceso';
            case 'cancelado': return 'Cancelado';
            case 'respondido': return 'Respondido';
            default: return estado;
        }
    }

    // Nueva Reparación
    const btnNuevaReparacion = document.getElementById('btnNuevaReparacion');
    if (btnNuevaReparacion) {
        btnNuevaReparacion.addEventListener('click', mostrarModalNuevaReparacion);
    }

    function mostrarModalNuevaReparacion() {
        let modal = document.getElementById('modalNuevaReparacion');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalNuevaReparacion';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class='modal-content' style='max-width:600px;width:95%;overflow-y:auto;'>
                    <div class='modal-header'>
                        <h2>Nueva Reparación</h2>
                        <span class='close' id='cerrarModalNuevaReparacion'>&times;</span>
                    </div>
                    <form id='formNuevaReparacion'>
                        <div class='form-group'>
                            <label for='clienteReparacion'>Cliente</label>
                            <input type='text' id='clienteReparacion' class='form-control' required>
                        </div>
                        <div class='form-group'>
                            <label for='tipoReparacion'>Tipo de reparación</label>
                            <select id='tipoReparacion' class='form-control' required>
                                <option value=''>Seleccione...</option>
                                <option value='Hardware'>Hardware</option>
                                <option value='Software'>Software</option>
                                <option value='Mantenimiento'>Mantenimiento</option>
                                <option value='Otro'>Otro</option>
                            </select>
                        </div>
                        <div class='form-group'>
                            <label for='problemaReparacion'>Problema</label>
                            <input type='text' id='problemaReparacion' class='form-control' required>
                        </div>
                        <div class='form-group'>
                            <label for='descripcionReparacion'>Descripción</label>
                            <textarea id='descripcionReparacion' class='form-control' rows='3' required></textarea>
                        </div>
                        <div class='form-group'>
                            <label for='estadoReparacion'>Estado</label>
                            <select id='estadoReparacion' class='form-control' required>
                                <option value='pendiente'>Pendiente</option>
                                <option value='diagnostico'>Diagnóstico</option>
                                <option value='reparacion'>En reparación</option>
                                <option value='completado'>Completado</option>
                                <option value='cancelado'>Cancelado</option>
                            </select>
                        </div>
                        <div class='form-group'>
                            <label for='fechaReparacion'>Fecha</label>
                            <input type='date' id='fechaReparacion' class='form-control' required>
                        </div>
                        <div class='form-actions'>
                            <button type='submit' class='btn primary'><i class='fas fa-save'></i> Guardar</button>
                            <button type='button' class='btn secondary' id='cancelarNuevaReparacion'><i class='fas fa-times'></i> Cancelar</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        document.getElementById('cerrarModalNuevaReparacion').onclick = () => { modal.style.display = 'none'; };
        document.getElementById('cancelarNuevaReparacion').onclick = () => { modal.style.display = 'none'; };
        document.getElementById('formNuevaReparacion').onsubmit = function(e) {
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
            const cliente = this.clienteReparacion.value.trim();
            const tipo = this.tipoReparacion.value;
            const problema = this.problemaReparacion.value.trim();
            const descripcion = this.descripcionReparacion.value.trim();
            const estado = this.estadoReparacion.value;
            const fecha = this.fechaReparacion.value;
            // Cliente: solo letras y espacios
            if (!cliente) mostrarError('clienteReparacion', 'El cliente es obligatorio.');
            else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(cliente)) mostrarError('clienteReparacion', 'Solo letras y espacios.');
            // Tipo
            if (!tipo) mostrarError('tipoReparacion', 'Seleccione el tipo de reparación.');
            // Problema: mínimo 5 caracteres
            if (!problema) mostrarError('problemaReparacion', 'El problema es obligatorio.');
            else if (problema.length < 5) mostrarError('problemaReparacion', 'Debe tener al menos 5 caracteres.');
            // Descripción: mínimo 5, máximo 500 caracteres
            if (!descripcion) mostrarError('descripcionReparacion', 'La descripción es obligatoria.');
            else if (descripcion.length < 5) mostrarError('descripcionReparacion', 'Debe tener al menos 5 caracteres.');
            else if (descripcion.length > 500) mostrarError('descripcionReparacion', 'Máximo 500 caracteres.');
            // Estado
            if (!estado) mostrarError('estadoReparacion', 'Seleccione el estado.');
            // Fecha: no futura ni anterior a 2020-01-01
            if (!fecha) {
                mostrarError('fechaReparacion', 'La fecha es obligatoria.');
            } else {
                const hoy = new Date();
                const fechaIngresada = new Date(fecha);
                hoy.setHours(0,0,0,0);
                const minFecha = new Date('2020-01-01');
                if (fechaIngresada > hoy) {
                    mostrarError('fechaReparacion', 'La fecha no puede ser futura.');
                } else if (fechaIngresada < minFecha) {
                    mostrarError('fechaReparacion', 'No se permiten fechas antes de 2020.');
                }
            }
            if (!valido) return;
            // Agregar reparación simulada
            reparaciones.push({
                id: reparaciones.length ? Math.max(...reparaciones.map(r=>r.id))+1 : 1,
                tipo,
                problema,
                estado,
                cliente,
                fecha,
                descripcion
            });
            cargarReparaciones();
            modal.style.display = 'none';
        };
    }

    // Nuevo Ensamblaje
    const btnNuevoEnsamblaje = document.getElementById('btnNuevoEnsamblaje');
    if (btnNuevoEnsamblaje) {
        btnNuevoEnsamblaje.addEventListener('click', mostrarModalNuevoEnsamblaje);
    }

    function mostrarModalNuevoEnsamblaje() {
        let modal = document.getElementById('modalNuevoEnsamblaje');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalNuevoEnsamblaje';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class='modal-content' style='max-width:600px;width:95%;overflow-y:auto;'>
                    <div class='modal-header'>
                        <h2>Nuevo Ensamblaje</h2>
                        <span class='close' id='cerrarModalNuevoEnsamblaje'>&times;</span>
                    </div>
                    <form id='formNuevoEnsamblaje'>
                        <div class='form-group'>
                            <label for='clienteEnsamblaje'>Cliente</label>
                            <input type='text' id='clienteEnsamblaje' class='form-control' required>
                        </div>
                        <div class='form-group'>
                            <label for='tipoEnsamblaje'>Tipo de PC</label>
                            <select id='tipoEnsamblaje' class='form-control' required>
                                <option value=''>Seleccione...</option>
                                <option value='Gaming'>Gaming</option>
                                <option value='Oficina'>Oficina</option>
                                <option value='Diseño'>Diseño</option>
                                <option value='Servidor'>Servidor</option>
                                <option value='Otro'>Otro</option>
                            </select>
                        </div>
                        <div class='form-group'>
                            <label for='fechaEnsamblaje'>Fecha</label>
                            <input type='date' id='fechaEnsamblaje' class='form-control' required>
                        </div>
                        <div class='form-group'>
                            <label for='estadoEnsamblaje'>Estado</label>
                            <select id='estadoEnsamblaje' class='form-control' required>
                                <option value='enproceso'>En proceso</option>
                                <option value='completado'>Completado</option>
                                <option value='cancelado'>Cancelado</option>
                            </select>
                        </div>
                        <div class='form-group'>
                            <label for='componentesEnsamblaje'>Componentes (uno por línea)</label>
                            <textarea id='componentesEnsamblaje' class='form-control' rows='4' required placeholder='Ej: Intel i7\nRTX 3070\n16GB RAM'></textarea>
                        </div>
                        <div class='form-actions'>
                            <button type='submit' class='btn primary'><i class='fas fa-save'></i> Guardar</button>
                            <button type='button' class='btn secondary' id='cancelarNuevoEnsamblaje'><i class='fas fa-times'></i> Cancelar</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        document.getElementById('cerrarModalNuevoEnsamblaje').onclick = () => { modal.style.display = 'none'; };
        document.getElementById('cancelarNuevoEnsamblaje').onclick = () => { modal.style.display = 'none'; };
        document.getElementById('formNuevoEnsamblaje').onsubmit = function(e) {
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
            const cliente = this.clienteEnsamblaje.value.trim();
            const tipo = this.tipoEnsamblaje.value;
            const fecha = this.fechaEnsamblaje.value;
            const estado = this.estadoEnsamblaje.value;
            const componentes = this.componentesEnsamblaje.value.trim().split('\n').map(c=>c.trim()).filter(c=>c);
            // Cliente: solo letras y espacios
            if (!cliente) mostrarError('clienteEnsamblaje', 'El cliente es obligatorio.');
            else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(cliente)) mostrarError('clienteEnsamblaje', 'Solo letras y espacios.');
            // Tipo
            if (!tipo) mostrarError('tipoEnsamblaje', 'Seleccione el tipo de PC.');
            // Fecha: no futura ni anterior a 2020-01-01
            if (!fecha) {
                mostrarError('fechaEnsamblaje', 'La fecha es obligatoria.');
            } else {
                const hoy = new Date();
                const fechaIngresada = new Date(fecha);
                hoy.setHours(0,0,0,0);
                const minFecha = new Date('2020-01-01');
                if (fechaIngresada > hoy) {
                    mostrarError('fechaEnsamblaje', 'La fecha no puede ser futura.');
                } else if (fechaIngresada < minFecha) {
                    mostrarError('fechaEnsamblaje', 'No se permiten fechas antes de 2020.');
                }
            }
            // Estado
            if (!estado) mostrarError('estadoEnsamblaje', 'Seleccione el estado.');
            // Componentes: mínimo 2
            if (!componentes.length) mostrarError('componentesEnsamblaje', 'Debe ingresar al menos 2 componentes.');
            else if (componentes.length < 2) mostrarError('componentesEnsamblaje', 'Ingrese al menos 2 componentes.');
            else if (componentes.some(c => c.length < 3)) mostrarError('componentesEnsamblaje', 'Cada componente debe tener al menos 3 caracteres.');
            if (!valido) return;
            // Agregar ensamblaje simulado
            ensamblajes.push({
                id: ensamblajes.length ? Math.max(...ensamblajes.map(e=>e.id))+1 : 1,
                tipo,
                cliente,
                estado,
                fecha,
                componentes
            });
            cargarEnsamblajes();
            modal.style.display = 'none';
        };
    }

    // Nuevo Componente
    const btnNuevoComponente = document.getElementById('btnNuevoComponente');
    if (btnNuevoComponente) {
        btnNuevoComponente.addEventListener('click', mostrarModalNuevoComponente);
    }

    function mostrarModalNuevoComponente() {
        let modal = document.getElementById('modalNuevoComponente');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalNuevoComponente';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class='modal-content' style='max-width:500px;width:95%;overflow-y:auto;'>
                    <div class='modal-header'>
                        <h2>Nuevo Componente</h2>
                        <span class='close' id='cerrarModalNuevoComponente'>&times;</span>
                    </div>
                    <form id='formNuevoComponente'>
                        <div class='form-group'>
                            <label for='nombreComponente'>Nombre</label>
                            <input type='text' id='nombreComponente' class='form-control' required>
                        </div>
                        <div class='form-group'>
                            <label for='categoriaComponente'>Categoría</label>
                            <select id='categoriaComponente' class='form-control' required>
                                <option value=''>Seleccione...</option>
                                <option value='Procesador'>Procesador</option>
                                <option value='Motherboard'>Motherboard</option>
                                <option value='RAM'>RAM</option>
                                <option value='Almacenamiento'>Almacenamiento</option>
                                <option value='Tarjeta Gráfica'>Tarjeta Gráfica</option>
                                <option value='Fuente'>Fuente</option>
                                <option value='Gabinete'>Gabinete</option>
                                <option value='Otro'>Otro</option>
                            </select>
                        </div>
                        <div class='form-group'>
                            <label for='stockComponente'>Stock</label>
                            <input type='number' id='stockComponente' class='form-control' min='0' required>
                        </div>
                        <div class='form-group'>
                            <label for='precioComponente'>Precio</label>
                            <input type='number' id='precioComponente' class='form-control' min='0.01' step='0.01' required>
                        </div>
                        <div class='form-actions'>
                            <button type='submit' class='btn primary'><i class='fas fa-save'></i> Guardar</button>
                            <button type='button' class='btn secondary' id='cancelarNuevoComponente'><i class='fas fa-times'></i> Cancelar</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        document.getElementById('cerrarModalNuevoComponente').onclick = () => { modal.style.display = 'none'; };
        document.getElementById('cancelarNuevoComponente').onclick = () => { modal.style.display = 'none'; };
        document.getElementById('formNuevoComponente').onsubmit = function(e) {
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
            const nombre = this.nombreComponente.value.trim();
            const categoria = this.categoriaComponente.value;
            const stock = parseInt(this.stockComponente.value);
            const precio = parseFloat(this.precioComponente.value);
            // Nombre: mínimo 3, solo letras/números/espacios
            if (!nombre) mostrarError('nombreComponente', 'El nombre es obligatorio.');
            else if (nombre.length < 3) mostrarError('nombreComponente', 'Mínimo 3 caracteres.');
            else if (!/^[\wáéíóúÁÉÍÓÚñÑ0-9 ]+$/i.test(nombre)) mostrarError('nombreComponente', 'Solo letras, números y espacios.');
            // Categoría
            if (!categoria) mostrarError('categoriaComponente', 'Seleccione la categoría.');
            // Stock
            if (isNaN(stock) || stock < 0) mostrarError('stockComponente', 'Stock debe ser 0 o mayor.');
            // Precio
            if (isNaN(precio) || precio <= 0) mostrarError('precioComponente', 'El precio debe ser mayor a 0.');
            else if (!/^\d+(\.\d{1,2})?$/.test(this.precioComponente.value.trim())) mostrarError('precioComponente', 'Máximo dos decimales.');
            if (!valido) return;
            // Agregar componente simulado
            componentes.push({
                id: componentes.length ? Math.max(...componentes.map(c=>c.id))+1 : 1,
                nombre,
                categoria,
                stock,
                precio
            });
            cargarComponentes();
            modal.style.display = 'none';
        };
    }

    // Nuevo Mensaje
    const btnNuevoMensaje = document.getElementById('btnNuevoMensaje');
    if (btnNuevoMensaje) {
        btnNuevoMensaje.addEventListener('click', mostrarModalNuevoMensaje);
    }

    function mostrarModalNuevoMensaje() {
        let modal = document.getElementById('modalNuevoMensaje');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalNuevoMensaje';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class='modal-content' style='max-width:500px;width:95%;overflow-y:auto;'>
                    <div class='modal-header'>
                        <h2>Nuevo Mensaje</h2>
                        <span class='close' id='cerrarModalNuevoMensaje'>&times;</span>
                    </div>
                    <form id='formNuevoMensaje'>
                        <div class='form-group'>
                            <label for='clienteMensaje'>Cliente</label>
                            <input type='text' id='clienteMensaje' class='form-control' required>
                        </div>
                        <div class='form-group'>
                            <label for='contenidoMensaje'>Mensaje</label>
                            <textarea id='contenidoMensaje' class='form-control' rows='3' required></textarea>
                        </div>
                        <div class='form-actions'>
                            <button type='submit' class='btn primary'><i class='fas fa-paper-plane'></i> Enviar</button>
                            <button type='button' class='btn secondary' id='cancelarNuevoMensaje'><i class='fas fa-times'></i> Cancelar</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        document.getElementById('cerrarModalNuevoMensaje').onclick = () => { modal.style.display = 'none'; };
        document.getElementById('cancelarNuevoMensaje').onclick = () => { modal.style.display = 'none'; };
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
            const cliente = this.clienteMensaje.value.trim();
            const contenido = this.contenidoMensaje.value.trim();
            if (!cliente) mostrarError('clienteMensaje', 'El cliente es obligatorio.');
            else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(cliente)) mostrarError('clienteMensaje', 'Solo letras y espacios.');
            if (!contenido) mostrarError('contenidoMensaje', 'El mensaje es obligatorio.');
            else if (contenido.length < 5) mostrarError('contenidoMensaje', 'Debe tener al menos 5 caracteres.');
            if (!valido) return;
            mensajes.unshift({
                id: mensajes.length ? Math.max(...mensajes.map(m=>m.id))+1 : 1,
                cliente,
                fecha: new Date().toISOString().slice(0,10),
                contenido,
                estado: 'pendiente'
            });
            cargarMensajes();
            modal.style.display = 'none';
        };
    }
}); 