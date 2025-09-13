<?php
$conn = new mysqli("localhost", "vcarvaja", "1127053339", "vcarvaja_sistema_computec");
if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

if (isset($_GET["delete"])) {
    $id = intval($_GET["delete"]);
    $conn->query("DELETE FROM productos WHERE id_producto = $id");
    echo "<p style='color:green;text-align:center;'>Producto eliminado.</p>";
}

$result = $conn->query("SELECT p.id_producto, p.nombre, p.descripcion, p.categoria, p.precio_compra, p.precio_venta, p.stock_minimo, p.codigo_barras, pr.nombre_empresa as proveedor FROM productos p LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor");
?>
<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <title>Lista de Productos</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f6f8; margin: 0; padding: 0; }
        .container { max-width: 1200px; margin: 40px auto; background: #fff; padding: 30px 40px 20px 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h2 { text-align: center; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px 8px; text-align: left; }
        th { background: #1976d2; color: #fff; }
        tr:nth-child(even) { background: #f4f6f8; }
        tr:hover { background: #e3f0fc; }
        .acciones a { color: #d32f2f; text-decoration: none; font-weight: bold; margin-right: 8px; }
        .acciones a:hover { text-decoration: underline; }
        .add-link { display: inline-block; margin-bottom: 15px; background: #1976d2; color: #fff; padding: 8px 16px; border-radius: 4px; text-decoration: none; transition: background 0.2s; }
        .add-link:hover { background: #1565c0; }
    </style>
</head>
<body>
<div class='container'>
    <h2>Lista de Productos</h2>
    <a class='add-link' href='productos_form.php'>Agregar nuevo producto</a>
    <table>
        <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
            <th>Stock Mínimo</th>
            <th>Proveedor</th>
            <th>Código Barras</th>
            <th>Acción</th>
        </tr>
        <?php while ($row = $result->fetch_assoc()): ?>
        <tr>
            <td><?= htmlspecialchars($row['nombre']) ?></td>
            <td><?= htmlspecialchars($row['descripcion']) ?></td>
            <td><?= htmlspecialchars($row['categoria']) ?></td>
            <td><?= htmlspecialchars($row['precio_compra']) ?></td>
            <td><?= htmlspecialchars($row['precio_venta']) ?></td>
            <td><?= htmlspecialchars($row['stock_minimo']) ?></td>
            <td><?= htmlspecialchars($row['proveedor']) ?></td>
            <td><?= htmlspecialchars($row['codigo_barras']) ?></td>
            <td class='acciones'>
                <a href='Productos2.php?delete=<?= $row['id_producto'] ?>' onclick="return confirm('¿Eliminar?')">Eliminar</a>
            </td>
        </tr>
        <?php endwhile; ?>
    </table>
</div>
</body>
</html> 