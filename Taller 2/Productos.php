<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$conn = new mysqli("localhost", "vcarvaja", "1127053339", "vcarvaja_sistema_computec");
if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);
echo "Conexión OK<br>";

// Obtener proveedores para el select
$proveedores = [];
$prov_result = $conn->query("SELECT id_proveedor, nombre_empresa FROM proveedores WHERE activo = 1");
while ($row = $prov_result->fetch_assoc()) {
    $proveedores[] = $row;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $descripcion = !empty($_POST["descripcion"]) ? $_POST["descripcion"] : null;
    $categoria = !empty($_POST["categoria"]) ? $_POST["categoria"] : null;
    $precio_compra = floatval($_POST["precio_compra"]);
    $precio_venta = floatval($_POST["precio_venta"]);
    $stock_minimo = !empty($_POST["stock_minimo"]) ? intval($_POST["stock_minimo"]) : 0;
    $id_proveedor = !empty($_POST["id_proveedor"]) ? intval($_POST["id_proveedor"]) : null;
    $codigo_barras = !empty($_POST["codigo_barras"]) ? $_POST["codigo_barras"] : null;
    $sql = "INSERT INTO productos (nombre, descripcion, categoria, precio_compra, precio_venta, stock_minimo, id_proveedor, codigo_barras) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("Error en prepare: " . $conn->error);
    }
    echo "Prepare OK<br>";
    $stmt->bind_param("ssssddis", $nombre, $descripcion, $categoria, $precio_compra, $precio_venta, $stock_minimo, $id_proveedor, $codigo_barras);
    if ($stmt->execute()) {
        header("Location: productos_form.php?msg=ok");
        exit;
    } else {
        echo "<p>Error al agregar producto: " . $conn->error . "</p>";
    }
}
?> 