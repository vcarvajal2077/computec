<?php
header('Content-Type: application/json');
require_once '../config/database.php';
$conn = getDatabaseConnectionMysqli();
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'listar': listarFacturas($conn); break;
        case 'detalle': obtenerDetalle($conn); break;
        case 'estadisticas': obtenerEstadisticas($conn); break;
        default: throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
$conn->close();

function listarFacturas($conn) {
    $query = "SELECT c.id_carrito as id_factura, CONCAT(cl.nombre, ' ', cl.apellido) as cliente, c.fecha_creacion, c.total, c.estado 
              FROM carrito c 
              LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente 
              WHERE c.estado != 'pendiente' 
              ORDER BY c.fecha_creacion DESC";
    $result = $conn->query($query);
    $datos = [];
    while ($row = $result->fetch_assoc()) $datos[] = $row;
    echo json_encode(['success' => true, 'data' => $datos]);
}

function obtenerDetalle($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("SELECT ci.*, p.nombre FROM carrito_items ci LEFT JOIN productos p ON ci.item_id = p.id_producto WHERE ci.id_carrito = ?");
    $stmt->bind_param('i', $input['id_factura']);
    $stmt->execute();
    $result = $stmt->get_result();
    $items = [];
    while ($row = $result->fetch_assoc()) $items[] = $row;
    echo json_encode(['success' => true, 'data' => $items]);
}

function obtenerEstadisticas($conn) {
    $stmt = $conn->prepare("SELECT IFNULL(SUM(total), 0) as total FROM carrito WHERE estado != 'pendiente'");
    $stmt->execute();
    $total = $stmt->get_result()->fetch_assoc()['total'];
    
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM carrito WHERE estado = 'completado'");
    $stmt->execute();
    $pagadas = $stmt->get_result()->fetch_assoc()['total'];
    
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM carrito WHERE estado = 'procesando'");
    $stmt->execute();
    $pendientes = $stmt->get_result()->fetch_assoc()['total'];
    
    echo json_encode(['success' => true, 'data' => ['total' => $total, 'pagadas' => $pagadas, 'pendientes' => $pendientes]]);
}
?>
