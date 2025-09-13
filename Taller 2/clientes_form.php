<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Agregar Cliente</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f6f8;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 450px;
            margin: 40px auto;
            background: #fff;
            padding: 30px 40px 20px 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h2 {
            text-align: center;
            color: #333;
        }
        label {
            display: block;
            margin-top: 15px;
            color: #555;
        }
        input[type="text"], input[type="email"], textarea, select {
            width: 100%;
            padding: 8px 10px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 15px;
        }
        textarea {
            resize: vertical;
        }
        .error {
            color: #d32f2f;
            font-size: 13px;
            margin-top: 2px;
        }
        button {
            width: 100%;
            margin-top: 20px;
            padding: 10px;
            background: #1976d2;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.2s;
        }
        button:hover {
            background: #1565c0;
        }
        .back-link {
            display: block;
            text-align: center;
            margin-top: 15px;
            color: #1976d2;
            text-decoration: none;
        }
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
<div class="container">
    <h2>Agregar Cliente</h2>
    <?php if (isset($_GET['msg']) && $_GET['msg'] == 'ok'): ?>
        <div style="color:green;text-align:center;margin-bottom:10px;">Cliente agregado correctamente.</div>
    <?php endif; ?>
    <form id="clienteForm" method="POST" action="Clientes.php" novalidate>
        <label for="nombre">Nombre *</label>
        <input type="text" id="nombre" name="nombre" required>
        <div class="error" id="nombreError"></div>

        <label for="apellido">Apellido *</label>
        <input type="text" id="apellido" name="apellido" required>
        <div class="error" id="apellidoError"></div>

        <label for="documento">Documento</label>
        <input type="text" id="documento" name="documento">
        <div class="error" id="documentoError"></div>

        <label for="telefono">Teléfono</label>
        <input type="text" id="telefono" name="telefono" pattern="^[0-9+\s-]{7,20}$">
        <div class="error" id="telefonoError"></div>

        <label for="email">Correo electrónico</label>
        <input type="email" id="email" name="email">
        <div class="error" id="emailError"></div>

        <label for="direccion">Dirección</label>
        <textarea id="direccion" name="direccion" rows="2"></textarea>
        <div class="error" id="direccionError"></div>

        <label for="tipo_cliente">Tipo de cliente *</label>
        <select id="tipo_cliente" name="tipo_cliente" required>
            <option value="">Seleccione...</option>
            <option value="persona">Persona</option>
            <option value="empresa">Empresa</option>
        </select>
        <div class="error" id="tipoClienteError"></div>

        <button type="submit">Agregar Cliente</button>
    </form>
    <a class="back-link" href="Clientes2.php">Ver lista de clientes</a>
</div>
<script>
    document.getElementById('clienteForm').addEventListener('submit', function(e) {
        let valid = true;
        document.getElementById('nombreError').textContent = '';
        document.getElementById('apellidoError').textContent = '';
        document.getElementById('documentoError').textContent = '';
        document.getElementById('telefonoError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('direccionError').textContent = '';
        document.getElementById('tipoClienteError').textContent = '';

        // Validación de nombre
        const nombre = document.getElementById('nombre').value.trim();
        if (nombre.length < 2) {
            document.getElementById('nombreError').textContent = 'El nombre debe tener al menos 2 caracteres.';
            valid = false;
        }
        // Validación de apellido
        const apellido = document.getElementById('apellido').value.trim();
        if (apellido.length < 2) {
            document.getElementById('apellidoError').textContent = 'El apellido debe tener al menos 2 caracteres.';
            valid = false;
        }
        // Validación de tipo_cliente
        const tipoCliente = document.getElementById('tipo_cliente').value;
        if (!tipoCliente) {
            document.getElementById('tipoClienteError').textContent = 'Seleccione el tipo de cliente.';
            valid = false;
        }
        // Validación de email (opcional)
        const email = document.getElementById('email').value.trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('emailError').textContent = 'Ingrese un correo válido.';
            valid = false;
        }
        // Validación de teléfono (opcional)
        const telefono = document.getElementById('telefono').value.trim();
        if (telefono && !/^[0-9+\s-]{7,20}$/.test(telefono)) {
            document.getElementById('telefonoError').textContent = 'Ingrese un teléfono válido (solo números, +, - y espacios).';
            valid = false;
        }
        // Validación de documento (opcional, pero si se ingresa debe tener mínimo 5 caracteres)
        const documento = document.getElementById('documento').value.trim();
        if (documento && documento.length < 5) {
            document.getElementById('documentoError').textContent = 'El documento debe tener al menos 5 caracteres.';
            valid = false;
        }
        // Validación de dirección (opcional, si se ingresa mínimo 5 caracteres)
        const direccion = document.getElementById('direccion').value.trim();
        if (direccion && direccion.length < 5) {
            document.getElementById('direccionError').textContent = 'La dirección debe tener al menos 5 caracteres.';
            valid = false;
        }
        if (!valid) {
            e.preventDefault();
        }
    });
</script>
</body>
</html> 