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
                    <span class="mensaje-cliente">${m.cliente}</span>
                    <span class="mensaje-fecha">${m.fecha}</span>
                </div>
                <div class="mensaje-contenido">${m.contenido}</div>
                <div class="mensaje-acciones">
                    <button class="btn primary" onclick="responderMensaje(${m.id})"><i class='fas fa-reply'></i> Responder</button>
                    <button class="btn secondary" onclick="verMensaje(${m.id})"><i class='fas fa-eye'></i> Ver</button>
                </div>
            </div>
        `).join('');
    }
    window.responderMensaje = function(id) {
        alert('Función de respuesta simulada para mensaje ID ' + id);
    }
    window.verMensaje = function(id) {
        const m = mensajes.find(x => x.id === id);
        if (!m) return;
        document.getElementById('detalleMensaje').innerHTML = `
            <b>Cliente:</b> ${m.cliente}<br><b>Fecha:</b> ${m.fecha}<br><b>Mensaje:</b> ${m.contenido}`;
        openModal('modalMensaje');
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
}); 