<?php
header('Content-Type: application/json');
require_once '../config/database.php';
$conn = getDatabaseConnectionMysqli();
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'listar': listarCotizaciones($conn); break;
        case 'crear': crearCotizacion($conn); break;
        case 'actualizar': actualizarCotizacion($conn); break;
        case 'eliminar': eliminarCotizacion($conn); break;
        case 'obtener_clientes': obtenerClientes($conn); break;
        case 'obtener_productos': obtenerProductos($conn); break;
        case 'convertir_venta': convertirAVenta($conn); break;
        default: throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
$conn->close();

function listarCotizaciones($conn) {
    $query = "SELECT c.*, CONCAT(cl.nombre, ' ', cl.apellido) as cliente 
              FROM cotizaciones c 
              LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente 
              ORDER BY c.fecha_creacion DESC";
    $result = $conn->query($query);
    $datos = [];
    while ($row = $result->fetch_assoc()) $datos[] = $row;
    echo json_encode(['success' => true, 'data' => $datos]);
}

function crearCotizacion($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $conn->begin_transaction();
    
    try {
        $stmt = $conn->prepare("INSERT INTO cotizaciones (id_cliente, fecha_vencimiento, total, observaciones, estado) VALUES (?, ?, ?, ?, 'pendiente')");
        $stmt->bind_param('isds', $input['id_cliente'], $input['fecha_vencimiento'], $input['total'], $input['observaciones']);
        $stmt->execute();
        $id_cotizacion = $conn->insert_id;
        
        foreach ($input['items'] as $item) {
            $stmt = $conn->prepare("INSERT INTO cotizaciones_items (id_cotizacion, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param('iiidd', $id_cotizacion, $item['id_producto'], $item['cantidad'], $item['precio_unitario'], $item['subtotal']);
            $stmt->execute();
        }
        
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Cotización creada', 'id' => $id_cotizacion]);
    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }
}

function actualizarCotizacion($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("UPDATE cotizaciones SET estado=? WHERE id_cotizacion=?");
    $stmt->bind_param('si', $input['estado'], $input['id_cotizacion']);
    $stmt->execute();
    echo json_encode(['success' => true, 'message' => 'Cotización actualizada']);
}

function eliminarCotizacion($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("DELETE FROM cotizaciones WHERE id_cotizacion=?");
    $stmt->bind_param('i', $input['id_cotizacion']);
    $stmt->execute();
    echo json_encode(['success' => true, 'message' => 'Cotización eliminada']);
}

function obtenerClientes($conn) {
    $result = $conn->query("SELECT id_cliente, CONCAT(nombre, ' ', apellido) as nombre FROM clientes WHERE activo=1 ORDER BY nombre");
    $datos = [];
    while ($row = $result->fetch_assoc()) $datos[] = $row;
    echo json_encode(['success' => true, 'data' => $datos]);
}

function obtenerProductos($conn) {
    $result = $conn->query("SELECT p.id_producto, p.nombre, p.precio_venta FROM productos p WHERE p.activo=1 ORDER BY p.nombre");
    $datos = [];
    while ($row = $result->fetch_assoc()) $datos[] = $row;
    echo json_encode(['success' => true, 'data' => $datos]);
}

function convertirAVenta($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    // Lógica para convertir cotización a venta
    $stmt = $conn->prepare("UPDATE cotizaciones SET estado='aceptada' WHERE id_cotizacion=?");
    $stmt->bind_param('i', $input['id_cotizacion']);
    $stmt->execute();
    echo json_encode(['success' => true, 'message' => 'Cotización convertida a venta']);
}
?>
