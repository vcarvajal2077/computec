<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$conn = new mysqli("localhost", "vcarvaja", "1127053339", "vcarvaja_sistema_computec");
if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);
echo "Conexión OK<br>";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $apellido = $_POST["apellido"];
    $documento = !empty($_POST["documento"]) ? $_POST["documento"] : null;
    $telefono = !empty($_POST["telefono"]) ? $_POST["telefono"] : null;
    $email = !empty($_POST["email"]) ? $_POST["email"] : null;
    $direccion = !empty($_POST["direccion"]) ? $_POST["direccion"] : null;
    $tipo_cliente = $_POST["tipo_cliente"];
    $sql = "INSERT INTO clientes (nombre, apellido, documento, telefono, email, direccion, tipo_cliente) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("Error en prepare: " . $conn->error);
    }
    echo "Prepare OK<br>";
    $stmt->bind_param("sssssss", $nombre, $apellido, $documento, $telefono, $email, $direccion, $tipo_cliente);
    if ($stmt->execute()) {
        header("Location: clientes_form.php?msg=ok");
        exit;
    } else {
        echo "<p>Error al agregar cliente: " . $conn->error . "</p>";
    }
}
?>