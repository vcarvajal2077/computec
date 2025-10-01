<?php
header('Content-Type: application/json');
require_once '../config/database.php';
$conn = getDatabaseConnectionMysqli();
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'listar': listarTickets($conn); break;
        case 'crear': crearTicket($conn); break;
        case 'actualizar': actualizarTicket($conn); break;
        case 'eliminar': eliminarTicket($conn); break;
        case 'estadisticas': obtenerEstadisticas($conn); break;
        case 'agregar_comentario': agregarComentario($conn); break;
        case 'obtener_comentarios': obtenerComentarios($conn); break;
        default: throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
$conn->close();

function listarTickets($conn) {
    $query = "SELECT t.*, CONCAT(c.nombre, ' ', c.apellido) as cliente, CONCAT(u.nombre, ' ', u.apellido) as asignado 
              FROM tickets t 
              LEFT JOIN clientes c ON t.id_cliente = c.id_cliente 
              LEFT JOIN usuarios u ON t.id_asignado = u.id_usuario 
              ORDER BY t.fecha_creacion DESC";
    $result = $conn->query($query);
    $datos = [];
    while ($row = $result->fetch_assoc()) $datos[] = $row;
    echo json_encode(['success' => true, 'data' => $datos]);
}

function crearTicket($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("INSERT INTO tickets (id_cliente, asunto, descripcion, prioridad, id_asignado, estado) VALUES (?, ?, ?, ?, ?, 'abierto')");
    $stmt->bind_param('isssi', $input['id_cliente'], $input['asunto'], $input['descripcion'], $input['prioridad'], $input['id_asignado']);
    $stmt->execute();
    echo json_encode(['success' => true, 'message' => 'Ticket creado', 'id' => $conn->insert_id]);
}

function actualizarTicket($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("UPDATE tickets SET estado=?, id_asignado=? WHERE id_ticket=?");
    $stmt->bind_param('sii', $input['estado'], $input['id_asignado'], $input['id_ticket']);
    $stmt->execute();
    echo json_encode(['success' => true, 'message' => 'Ticket actualizado']);
}

function eliminarTicket($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("DELETE FROM tickets WHERE id_ticket=?");
    $stmt->bind_param('i', $input['id_ticket']);
    $stmt->execute();
    echo json_encode(['success' => true, 'message' => 'Ticket eliminado']);
}

function obtenerEstadisticas($conn) {
    $abiertos = $conn->query("SELECT COUNT(*) as total FROM tickets WHERE estado='abierto'")->fetch_assoc()['total'];
    $proceso = $conn->query("SELECT COUNT(*) as total FROM tickets WHERE estado='en_proceso'")->fetch_assoc()['total'];
    $resueltos = $conn->query("SELECT COUNT(*) as total FROM tickets WHERE estado='resuelto' AND DATE(fecha_actualizacion)=CURDATE()")->fetch_assoc()['total'];
    echo json_encode(['success' => true, 'data' => ['abiertos' => $abiertos, 'proceso' => $proceso, 'resueltos' => $resueltos]]);
}

function agregarComentario($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $userData = json_decode($_COOKIE['usuario_logueado'] ?? '{}', true);
    $stmt = $conn->prepare("INSERT INTO tickets_comentarios (id_ticket, id_usuario, comentario) VALUES (?, ?, ?)");
    $stmt->bind_param('iis', $input['id_ticket'], $userData['id_usuario'], $input['comentario']);
    $stmt->execute();
    echo json_encode(['success' => true, 'message' => 'Comentario agregado']);
}

function obtenerComentarios($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("SELECT c.*, CONCAT(u.nombre, ' ', u.apellido) as usuario FROM tickets_comentarios c LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario WHERE c.id_ticket=? ORDER BY c.fecha_creacion");
    $stmt->bind_param('i', $input['id_ticket']);
    $stmt->execute();
    $result = $stmt->get_result();
    $datos = [];
    while ($row = $result->fetch_assoc()) $datos[] = $row;
    echo json_encode(['success' => true, 'data' => $datos]);
}
?>
