<?php
header('Content-Type: application/json');
require_once '../config/database.php';

session_start();

// Verificar sesión
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$action = $_GET['action'] ?? '';

try {
    $pdo = getDatabaseConnection();
    
    switch ($action) {
        case 'listar': 
            listarProveedores($pdo); 
            break;
        case 'crear': 
            crearProveedor($pdo); 
            break;
        case 'actualizar': 
            actualizarProveedor($pdo); 
            break;
        case 'eliminar': 
            eliminarProveedor($pdo); 
            break;
        default: 
            throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function listarProveedores($pdo) {
    $stmt = $pdo->query("SELECT * FROM proveedores ORDER BY nombre_empresa");
    $datos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $datos]);
}

function crearProveedor($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("INSERT INTO proveedores (nombre_empresa, contacto, telefono, email, direccion, categoria, activo) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $input['nombre_empresa'] ?? '',
        $input['contacto'] ?? '',
        $input['telefono'] ?? '',
        $input['email'] ?? '',
        $input['direccion'] ?? '',
        $input['categoria'] ?? '',
        $input['activo'] ?? 1
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Proveedor creado exitosamente']);
}

function actualizarProveedor($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("UPDATE proveedores SET nombre_empresa=?, contacto=?, telefono=?, email=?, direccion=?, categoria=?, activo=? WHERE id_proveedor=?");
    $stmt->execute([
        $input['nombre_empresa'],
        $input['contacto'],
        $input['telefono'],
        $input['email'],
        $input['direccion'],
        $input['categoria'] ?? '',
        $input['activo'],
        $input['id_proveedor']
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Proveedor actualizado exitosamente']);
}

function eliminarProveedor($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("DELETE FROM proveedores WHERE id_proveedor=?");
    $stmt->execute([$input['id_proveedor']]);
    
    echo json_encode(['success' => true, 'message' => 'Proveedor eliminado exitosamente']);
}
?>
