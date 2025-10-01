<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$conn = getDatabaseConnectionMysqli();
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'estado_stock': obtenerEstadoStock($conn); break;
        case 'movimientos': obtenerMovimientos($conn); break;
        case 'alertas': obtenerAlertas($conn); break;
        case 'estadisticas': obtenerEstadisticas($conn); break;
        case 'registrar_movimiento': registrarMovimiento($conn); break;
        default: throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
$conn->close();

function obtenerEstadoStock($conn) {
    $query = "SELECT p.id_producto, p.nombre, p.precio_venta, IFNULL(i.stock_actual, 0) as stock, 5 as stock_minimo 
              FROM productos p LEFT JOIN inventario i ON p.id_producto = i.id_producto ORDER BY p.nombre";
    $result = $conn->query($query);
    $datos = [];
    while ($row = $result->fetch_assoc()) $datos[] = $row;
    echo json_encode(['success' => true, 'data' => $datos]);
}

function obtenerMovimientos($conn) {
    $query = "SELECT m.*, p.nombre as producto, u.nombre as usuario 
              FROM movimientos_inventario m 
              LEFT JOIN productos p ON m.id_producto = p.id_producto 
              LEFT JOIN usuarios u ON m.id_usuario = u.id_usuario 
              ORDER BY m.fecha DESC LIMIT 100";
    $result = $conn->query($query);
    $datos = [];
    while ($row = $result->fetch_assoc()) $datos[] = $row;
    echo json_encode(['success' => true, 'data' => $datos]);
}

function obtenerAlertas($conn) {
    $query = "SELECT p.id_producto, p.nombre, IFNULL(i.stock_actual, 0) as stock, 5 as stock_minimo 
              FROM productos p LEFT JOIN inventario i ON p.id_producto = i.id_producto 
              WHERE IFNULL(i.stock_actual, 0) <= 5 ORDER BY stock ASC";
    $result = $conn->query($query);
    $datos = [];
    while ($row = $result->fetch_assoc()) $datos[] = $row;
    echo json_encode(['success' => true, 'data' => $datos]);
}

function obtenerEstadisticas($conn) {
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM productos p LEFT JOIN inventario i ON p.id_producto = i.id_producto WHERE IFNULL(i.stock_actual, 0) <= 5 AND IFNULL(i.stock_actual, 0) > 0");
    $stmt->execute();
    $bajo = $stmt->get_result()->fetch_assoc()['total'];
    
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM productos p LEFT JOIN inventario i ON p.id_producto = i.id_producto WHERE IFNULL(i.stock_actual, 0) = 0");
    $stmt->execute();
    $critico = $stmt->get_result()->fetch_assoc()['total'];
    
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM productos p LEFT JOIN inventario i ON p.id_producto = i.id_producto WHERE IFNULL(i.stock_actual, 0) > 5");
    $stmt->execute();
    $ok = $stmt->get_result()->fetch_assoc()['total'];
    
    $stmt = $conn->prepare("SELECT IFNULL(SUM(p.precio_venta * IFNULL(i.stock_actual, 0)), 0) as total FROM productos p LEFT JOIN inventario i ON p.id_producto = i.id_producto");
    $stmt->execute();
    $valor = $stmt->get_result()->fetch_assoc()['total'];
    
    echo json_encode(['success' => true, 'data' => ['bajo' => $bajo, 'critico' => $critico, 'ok' => $ok, 'valor' => $valor]]);
}

function registrarMovimiento($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $userData = json_decode($_COOKIE['usuario_logueado'] ?? '{}', true);
    
    $stmt = $conn->prepare("INSERT INTO movimientos_inventario (id_producto, tipo, cantidad, id_usuario, observacion) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('issis', $input['id_producto'], $input['tipo'], $input['cantidad'], $userData['id_usuario'], $input['observacion']);
    $stmt->execute();
    
    $stmt = $conn->prepare("SELECT stock_actual FROM inventario WHERE id_producto = ?");
    $stmt->bind_param('i', $input['id_producto']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $stock = $result->fetch_assoc()['stock_actual'];
        $nuevo = $input['tipo'] == 'entrada' ? $stock + $input['cantidad'] : $stock - $input['cantidad'];
        $stmt = $conn->prepare("UPDATE inventario SET stock_actual = ? WHERE id_producto = ?");
        $stmt->bind_param('ii', $nuevo, $input['id_producto']);
    } else {
        $stmt = $conn->prepare("INSERT INTO inventario (id_producto, stock_actual) VALUES (?, ?)");
        $stmt->bind_param('ii', $input['id_producto'], $input['cantidad']);
    }
    $stmt->execute();
    
    echo json_encode(['success' => true, 'message' => 'Movimiento registrado']);
}
?>
