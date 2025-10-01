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
        case 'estadisticas_generales':
            obtenerEstadisticasGenerales($conn);
            break;
        case 'ventas_por_dia':
            obtenerVentasPorDia($conn);
            break;
        case 'servicios_por_estado':
            obtenerServiciosPorEstado($conn);
            break;
        case 'productos_mas_vendidos':
            obtenerProductosMasVendidos($conn);
            break;
        case 'ingresos_mensuales':
            obtenerIngresosMensuales($conn);
            break;
        case 'top_clientes':
            obtenerTopClientes($conn);
            break;
        default:
            throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();

function obtenerEstadisticasGenerales($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $dias = $input['dias'] ?? 30;
    
    // Ventas totales
    $stmt = $conn->prepare("SELECT IFNULL(SUM(total), 0) as total FROM carrito WHERE estado != 'pendiente' AND fecha_creacion >= DATE_SUB(NOW(), INTERVAL ? DAY)");
    $stmt->bind_param('i', $dias);
    $stmt->execute();
    $ventas = $stmt->get_result()->fetch_assoc()['total'];
    
    // Servicios completados
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM servicios WHERE estado IN ('terminado', 'entregado') AND fecha_ingreso >= DATE_SUB(NOW(), INTERVAL ? DAY)");
    $stmt->bind_param('i', $dias);
    $stmt->execute();
    $servicios = $stmt->get_result()->fetch_assoc()['total'];
    
    // Nuevos clientes
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM clientes WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL ? DAY)");
    $stmt->bind_param('i', $dias);
    $stmt->execute();
    $clientes = $stmt->get_result()->fetch_assoc()['total'];
    
    // Productos vendidos
    $stmt = $conn->prepare("SELECT IFNULL(SUM(ci.cantidad), 0) as total FROM carrito_items ci INNER JOIN carrito c ON ci.id_carrito = c.id_carrito WHERE c.estado != 'pendiente' AND c.fecha_creacion >= DATE_SUB(NOW(), INTERVAL ? DAY)");
    $stmt->bind_param('i', $dias);
    $stmt->execute();
    $productos = $stmt->get_result()->fetch_assoc()['total'];
    
    echo json_encode([
        'success' => true,
        'data' => [
            'ventas' => $ventas,
            'servicios' => $servicios,
            'clientes' => $clientes,
            'productos' => $productos
        ]
    ]);
}

function obtenerVentasPorDia($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $dias = $input['dias'] ?? 30;
    
    $query = "SELECT DATE(fecha_creacion) as fecha, IFNULL(SUM(total), 0) as total 
              FROM carrito 
              WHERE estado != 'pendiente' AND fecha_creacion >= DATE_SUB(NOW(), INTERVAL ? DAY)
              GROUP BY DATE(fecha_creacion) 
              ORDER BY fecha ASC";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $dias);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $datos = [];
    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }
    
    echo json_encode(['success' => true, 'data' => $datos]);
}

function obtenerServiciosPorEstado($conn) {
    $query = "SELECT estado, COUNT(*) as total FROM servicios GROUP BY estado";
    $result = $conn->query($query);
    
    $datos = [];
    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }
    
    echo json_encode(['success' => true, 'data' => $datos]);
}

function obtenerProductosMasVendidos($conn) {
    $query = "SELECT p.nombre, IFNULL(SUM(ci.cantidad), 0) as total 
              FROM carrito_items ci 
              INNER JOIN productos p ON ci.item_id = p.id_producto 
              INNER JOIN carrito c ON ci.id_carrito = c.id_carrito
              WHERE ci.item_type = 'product' AND c.estado != 'pendiente'
              GROUP BY p.id_producto 
              ORDER BY total DESC 
              LIMIT 10";
    
    $result = $conn->query($query);
    
    $datos = [];
    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }
    
    echo json_encode(['success' => true, 'data' => $datos]);
}

function obtenerIngresosMensuales($conn) {
    $query = "SELECT DATE_FORMAT(fecha_creacion, '%Y-%m') as mes, IFNULL(SUM(total), 0) as total 
              FROM carrito 
              WHERE estado != 'pendiente' AND fecha_creacion >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
              GROUP BY DATE_FORMAT(fecha_creacion, '%Y-%m') 
              ORDER BY mes ASC";
    
    $result = $conn->query($query);
    
    $datos = [];
    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }
    
    echo json_encode(['success' => true, 'data' => $datos]);
}

function obtenerTopClientes($conn) {
    $query = "SELECT 
                CONCAT(c.nombre, ' ', c.apellido) as cliente,
                COUNT(DISTINCT s.id_servicio) as servicios,
                COUNT(DISTINCT ca.id_carrito) as compras,
                IFNULL(SUM(ca.total), 0) + IFNULL(SUM(s.costo), 0) as total_gastado
              FROM clientes c
              LEFT JOIN servicios s ON c.id_cliente = s.id_cliente
              LEFT JOIN carrito ca ON c.id_cliente = ca.id_cliente AND ca.estado != 'pendiente'
              GROUP BY c.id_cliente
              HAVING total_gastado > 0
              ORDER BY total_gastado DESC
              LIMIT 10";
    
    $result = $conn->query($query);
    
    $datos = [];
    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }
    
    echo json_encode(['success' => true, 'data' => $datos]);
}
?>
