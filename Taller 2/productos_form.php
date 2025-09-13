<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Agregar Producto</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f6f8;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 500px;
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
        input[type="text"], input[type="number"], textarea, select {
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
    <h2>Agregar Producto</h2>
    <?php
    // Obtener proveedores para el select
    $conn = new mysqli("localhost", "vcarvaja", "1127053339", "vcarvaja_sistema_computec");
    $proveedores = [];
    $prov_result = $conn->query("SELECT id_proveedor, nombre_empresa FROM proveedores WHERE activo = 1");
    while ($row = $prov_result->fetch_assoc()) {
        $proveedores[] = $row;
    }
    ?>
    <?php if (isset($_GET['msg']) && $_GET['msg'] == 'ok'): ?>
        <div style="color:green;text-align:center;margin-bottom:10px;">Producto agregado correctamente.</div>
    <?php endif; ?>
    <form id="productoForm" method="POST" action="Productos.php" novalidate>
        <label for="nombre">Nombre *</label>
        <input type="text" id="nombre" name="nombre" required>
        <div class="error" id="nombreError"></div>

        <label for="descripcion">Descripción</label>
        <textarea id="descripcion" name="descripcion" rows="2"></textarea>
        <div class="error" id="descripcionError"></div>

        <label for="categoria">Categoría</label>
        <input type="text" id="categoria" name="categoria">
        <div class="error" id="categoriaError"></div>

        <label for="precio_compra">Precio de compra *</label>
        <input type="number" id="precio_compra" name="precio_compra" step="0.01" min="0" required>
        <div class="error" id="precioCompraError"></div>

        <label for="precio_venta">Precio de venta *</label>
        <input type="number" id="precio_venta" name="precio_venta" step="0.01" min="0" required>
        <div class="error" id="precioVentaError"></div>

        <label for="stock_minimo">Stock mínimo</label>
        <input type="number" id="stock_minimo" name="stock_minimo" min="0">
        <div class="error" id="stockMinimoError"></div>

        <label for="id_proveedor">Proveedor</label>
        <select id="id_proveedor" name="id_proveedor">
            <option value="">Seleccione proveedor...</option>
            <?php foreach ($proveedores as $prov): ?>
                <option value="<?= $prov['id_proveedor'] ?>"><?= htmlspecialchars($prov['nombre_empresa']) ?></option>
            <?php endforeach; ?>
        </select>
        <div class="error" id="proveedorError"></div>

        <label for="codigo_barras">Código de barras</label>
        <input type="text" id="codigo_barras" name="codigo_barras">
        <div class="error" id="codigoBarrasError"></div>

        <button type="submit">Agregar Producto</button>
    </form>
    <a class="back-link" href="Productos2.php">Ver lista de productos</a>
</div>
<script>
    document.getElementById('productoForm').addEventListener('submit', function(e) {
        let valid = true;
        document.getElementById('nombreError').textContent = '';
        document.getElementById('descripcionError').textContent = '';
        document.getElementById('categoriaError').textContent = '';
        document.getElementById('precioCompraError').textContent = '';
        document.getElementById('precioVentaError').textContent = '';
        document.getElementById('stockMinimoError').textContent = '';
        document.getElementById('proveedorError').textContent = '';
        document.getElementById('codigoBarrasError').textContent = '';

        // Validación de nombre
        const nombre = document.getElementById('nombre').value.trim();
        if (nombre.length < 2) {
            document.getElementById('nombreError').textContent = 'El nombre debe tener al menos 2 caracteres.';
            valid = false;
        }
        // Validación de precio de compra
        const precioCompra = parseFloat(document.getElementById('precio_compra').value);
        if (isNaN(precioCompra) || precioCompra < 0) {
            document.getElementById('precioCompraError').textContent = 'Ingrese un precio de compra válido.';
            valid = false;
        }
        // Validación de precio de venta
        const precioVenta = parseFloat(document.getElementById('precio_venta').value);
        if (isNaN(precioVenta) || precioVenta < 0) {
            document.getElementById('precioVentaError').textContent = 'Ingrese un precio de venta válido.';
            valid = false;
        }
        // Validación de stock mínimo (opcional)
        const stockMinimo = document.getElementById('stock_minimo').value.trim();
        if (stockMinimo && (isNaN(stockMinimo) || parseInt(stockMinimo) < 0)) {
            document.getElementById('stockMinimoError').textContent = 'Ingrese un stock mínimo válido.';
            valid = false;
        }
        // Validación de código de barras (opcional, mínimo 5 si se ingresa)
        const codigoBarras = document.getElementById('codigo_barras').value.trim();
        if (codigoBarras && codigoBarras.length < 5) {
            document.getElementById('codigoBarrasError').textContent = 'El código de barras debe tener al menos 5 caracteres.';
            valid = false;
        }
        if (!valid) {
            e.preventDefault();
        }
    });
</script>
</body>
</html> 