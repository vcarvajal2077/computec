<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

session_start();

$conn = getDatabaseConnectionMysqli();
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'mis_servicios':
            obtenerMisServicios($conn);
            break;
        case 'mis_compras':
            obtenerMisCompras($conn);
            break;
        case 'estadisticas':
            obtenerEstadisticas($conn);
            break;
        default:
            throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();

function obtenerMisServicios($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (empty($input['id_cliente'])) throw new Exception('ID de cliente requerido');
    
    $query = "SELECT s.*, CONCAT(u.nombre, ' ', u.apellido) as nombre_tecnico 
              FROM servicios s LEFT JOIN usuarios u ON s.id_usuario = u.id_usuario 
              WHERE s.id_cliente = ? ORDER BY s.fecha_ingreso DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $input['id_cliente']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $servicios = [];
    while ($row = $result->fetch_assoc()) $servicios[] = $row;
    
    echo json_encode(['success' => true, 'data' => $servicios]);
}

function obtenerMisCompras($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (empty($input['id_cliente'])) throw new Exception('ID de cliente requerido');
    
    $query = "SELECT c.id_carrito, c.fecha_creacion, c.total, c.estado 
              FROM carrito c WHERE c.id_cliente = ? AND c.estado != 'pendiente' 
              ORDER BY c.fecha_creacion DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $input['id_cliente']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $compras = [];
    while ($row = $result->fetch_assoc()) $compras[] = $row;
    
    echo json_encode(['success' => true, 'data' => $compras]);
}

function obtenerEstadisticas($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (empty($input['id_cliente'])) throw new Exception('ID de cliente requerido');
    
    $id = $input['id_cliente'];
    
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM servicios WHERE id_cliente = ? AND estado NOT IN ('entregado', 'cancelado')");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $serviciosActivos = $stmt->get_result()->fetch_assoc()['total'];
    
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM servicios WHERE id_cliente = ? AND estado IN ('terminado', 'entregado')");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $serviciosCompletados = $stmt->get_result()->fetch_assoc()['total'];
    
    $stmt = $conn->prepare("SELECT IFNULL(SUM(total), 0) as total FROM carrito WHERE id_cliente = ? AND estado != 'pendiente'");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $totalCompras = $stmt->get_result()->fetch_assoc()['total'];
    
    $stmt = $conn->prepare("SELECT IFNULL(SUM(costo), 0) as total FROM servicios WHERE id_cliente = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $totalServicios = $stmt->get_result()->fetch_assoc()['total'];
    
    echo json_encode([
        'success' => true,
        'data' => [
            'servicios_activos' => $serviciosActivos,
            'servicios_completados' => $serviciosCompletados,
            'total_compras' => $totalCompras,
            'total_gastado' => $totalCompras + $totalServicios
        ]
    ]);
}
?>
