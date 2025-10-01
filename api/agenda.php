<?php
header('Content-Type: application/json');
require_once '../config/database.php';
$conn = getDatabaseConnectionMysqli();
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'listar': listarCitas($conn); break;
        case 'crear': crearCita($conn); break;
        case 'actualizar': actualizarCita($conn); break;
        case 'eliminar': eliminarCita($conn); break;
        case 'obtener_clientes': obtenerClientes($conn); break;
        case 'obtener_tecnicos': obtenerTecnicos($conn); break;
        default: throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
$conn->close();

function listarCitas($conn) {
    $query = "SELECT c.*, CONCAT(cl.nombre, ' ', cl.apellido) as cliente, CONCAT(u.nombre, ' ', u.apellido) as tecnico, s.tipo_servicio 
              FROM citas c 
              LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente 
              LEFT JOIN usuarios u ON c.id_tecnico = u.id_usuario 
              LEFT JOIN servicios s ON c.id_servicio = s.id_servicio 
              ORDER BY c.fecha, c.hora";
    $result = $conn->query($query);
    $datos = [];
    while ($row = $result->fetch_assoc()) $datos[] = $row;
    echo json_encode(['success' => true, 'data' => $datos]);
}

function crearCita($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("INSERT INTO citas (id_cliente, id_servicio, id_tecnico, fecha, hora, duracion, notas, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('iiississ', $input['id_cliente'], $input['id_servicio'], $input['id_tecnico'], $input['fecha'], $input['hora'], $input['duracion'], $input['notas'], $input['estado']);
    $stmt->execute();
    echo json_encode(['success' => true, 'message' => 'Cita creada']);
}

function actualizarCita($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("UPDATE citas SET id_cliente=?, id_servicio=?, id_tecnico=?, fecha=?, hora=?, duracion=?, notas=?, estado=? WHERE id_cita=?");
    $stmt->bind_param('iiississi', $input['id_cliente'], $input['id_servicio'], $input['id_tecnico'], $input['fecha'], $input['hora'], $input['duracion'], $input['notas'], $input['estado'], $input['id_cita']);
    $stmt->execute();
    echo json_encode(['success' => true, 'message' => 'Cita actualizada']);
}

function eliminarCita($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("DELETE FROM citas WHERE id_cita=?");
    $stmt->bind_param('i', $input['id_cita']);
    $stmt->execute();
    echo json_encode(['success' => true, 'message' => 'Cita eliminada']);
}

function obtenerClientes($conn) {
    $result = $conn->query("SELECT id_cliente, CONCAT(nombre, ' ', apellido) as nombre FROM clientes WHERE activo=1 ORDER BY nombre");
    $datos = [];
    while ($row = $result->fetch_assoc()) $datos[] = $row;
    echo json_encode(['success' => true, 'data' => $datos]);
}

function obtenerTecnicos($conn) {
    $result = $conn->query("SELECT u.id_usuario, CONCAT(u.nombre, ' ', u.apellido) as nombre FROM usuarios u WHERE u.id_tipo_usuario=3 ORDER BY u.nombre");
    $datos = [];
    while ($row = $result->fetch_assoc()) $datos[] = $row;
    echo json_encode(['success' => true, 'data' => $datos]);
}
?>
