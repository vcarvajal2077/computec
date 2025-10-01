<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

session_start();

$conn = getDatabaseConnectionMysqli();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'listar':
            listarClientes($conn);
            break;
            
        case 'crear':
            crearCliente($conn);
            break;
            
        case 'actualizar':
            actualizarCliente($conn);
            break;
            
        case 'eliminar':
            eliminarCliente($conn);
            break;
            
        case 'obtener':
            obtenerCliente($conn);
            break;
            
        default:
            throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();

// ============================================================================
// FUNCIONES
// ============================================================================

function listarClientes($conn) {
    // Primero verificar qué columnas existen
    $columnsCheck = $conn->query("SHOW COLUMNS FROM clientes");
    $columns = [];
    while ($col = $columnsCheck->fetch_assoc()) {
        $columns[] = $col['Field'];
    }
    
    // Construir SELECT solo con columnas que existen
    $selectFields = ['id_cliente', 'nombre', 'apellido', 'email', 'telefono'];
    
    if (in_array('documento', $columns)) $selectFields[] = 'documento';
    if (in_array('direccion', $columns)) $selectFields[] = 'direccion';
    if (in_array('notas', $columns)) $selectFields[] = 'notas';
    if (in_array('fecha_registro', $columns)) $selectFields[] = 'fecha_registro';
    if (in_array('activo', $columns)) $selectFields[] = 'activo';
    
    $query = "SELECT " . implode(', ', $selectFields) . " FROM clientes ORDER BY id_cliente DESC";
    
    $result = $conn->query($query);
    $clientes = [];
    
    while ($row = $result->fetch_assoc()) {
        // Agregar campos faltantes con valores por defecto
        if (!isset($row['documento'])) $row['documento'] = null;
        if (!isset($row['direccion'])) $row['direccion'] = null;
        if (!isset($row['notas'])) $row['notas'] = null;
        if (!isset($row['fecha_registro'])) $row['fecha_registro'] = date('Y-m-d H:i:s');
        if (!isset($row['activo'])) $row['activo'] = 1;
        
        $clientes[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $clientes
    ]);
}

function crearCliente($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validar campos requeridos
    if (empty($input['nombre']) || empty($input['email']) || empty($input['telefono'])) {
        throw new Exception('Nombre, email y teléfono son requeridos');
    }
    
    // Verificar que el email no exista
    $stmt = $conn->prepare("SELECT id_cliente FROM clientes WHERE email = ?");
    $stmt->bind_param('s', $input['email']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        throw new Exception('El email ya está registrado');
    }
    
    // Verificar qué columnas existen
    $columnsCheck = $conn->query("SHOW COLUMNS FROM clientes");
    $columns = [];
    while ($col = $columnsCheck->fetch_assoc()) {
        $columns[] = $col['Field'];
    }
    
    // Construir INSERT dinámicamente
    $fields = ['nombre', 'apellido', 'email', 'telefono'];
    $values = [
        $input['nombre'],
        $input['apellido'] ?? '',
        $input['email'],
        $input['telefono']
    ];
    $types = 'ssss';
    
    if (in_array('documento', $columns)) {
        $fields[] = 'documento';
        $values[] = $input['documento'] ?? '';
        $types .= 's';
    }
    
    if (in_array('direccion', $columns)) {
        $fields[] = 'direccion';
        $values[] = $input['direccion'] ?? '';
        $types .= 's';
    }
    
    if (in_array('notas', $columns)) {
        $fields[] = 'notas';
        $values[] = $input['notas'] ?? '';
        $types .= 's';
    }
    
    if (in_array('activo', $columns)) {
        $fields[] = 'activo';
        $values[] = $input['activo'] ?? 1;
        $types .= 'i';
    }
    
    $placeholders = implode(', ', array_fill(0, count($fields), '?'));
    $query = "INSERT INTO clientes (" . implode(', ', $fields) . ") VALUES (" . $placeholders . ")";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$values);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al crear cliente: ' . $stmt->error);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Cliente creado correctamente',
        'id_cliente' => $conn->insert_id
    ]);
}

function actualizarCliente($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_cliente'])) {
        throw new Exception('ID de cliente requerido');
    }
    
    // Verificar que el email no esté en uso por otro cliente
    if (!empty($input['email'])) {
        $stmt = $conn->prepare("SELECT id_cliente FROM clientes WHERE email = ? AND id_cliente != ?");
        $stmt->bind_param('si', $input['email'], $input['id_cliente']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            throw new Exception('El email ya está en uso por otro cliente');
        }
    }
    
    // Construir query dinámicamente
    $campos = [];
    $tipos = '';
    $valores = [];
    
    if (!empty($input['nombre'])) {
        $campos[] = 'nombre = ?';
        $tipos .= 's';
        $valores[] = $input['nombre'];
    }
    
    if (isset($input['apellido'])) {
        $campos[] = 'apellido = ?';
        $tipos .= 's';
        $valores[] = $input['apellido'];
    }
    
    if (!empty($input['email'])) {
        $campos[] = 'email = ?';
        $tipos .= 's';
        $valores[] = $input['email'];
    }
    
    if (!empty($input['telefono'])) {
        $campos[] = 'telefono = ?';
        $tipos .= 's';
        $valores[] = $input['telefono'];
    }
    
    if (isset($input['documento'])) {
        $campos[] = 'documento = ?';
        $tipos .= 's';
        $valores[] = $input['documento'];
    }
    
    if (isset($input['direccion'])) {
        $campos[] = 'direccion = ?';
        $tipos .= 's';
        $valores[] = $input['direccion'];
    }
    
    if (isset($input['notas'])) {
        $campos[] = 'notas = ?';
        $tipos .= 's';
        $valores[] = $input['notas'];
    }
    
    if (isset($input['activo'])) {
        $campos[] = 'activo = ?';
        $tipos .= 'i';
        $valores[] = $input['activo'];
    }
    
    if (empty($campos)) {
        throw new Exception('No hay campos para actualizar');
    }
    
    $query = "UPDATE clientes SET " . implode(', ', $campos) . " WHERE id_cliente = ?";
    $tipos .= 'i';
    $valores[] = $input['id_cliente'];
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param($tipos, ...$valores);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al actualizar cliente');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Cliente actualizado correctamente'
    ]);
}

function eliminarCliente($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_cliente'])) {
        throw new Exception('ID de cliente requerido');
    }
    
    // Verificar si el cliente tiene ventas o servicios asociados
    // Por ahora solo eliminamos, pero en el futuro podríamos validar
    
    $stmt = $conn->prepare("DELETE FROM clientes WHERE id_cliente = ?");
    $stmt->bind_param('i', $input['id_cliente']);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al eliminar cliente');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Cliente eliminado correctamente'
    ]);
}

function obtenerCliente($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_cliente'])) {
        throw new Exception('ID de cliente requerido');
    }
    
    $stmt = $conn->prepare("
        SELECT 
            id_cliente,
            nombre,
            apellido,
            email,
            telefono,
            documento,
            direccion,
            notas,
            fecha_registro,
            activo
        FROM clientes
        WHERE id_cliente = ?
    ");
    
    $stmt->bind_param('i', $input['id_cliente']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Cliente no encontrado');
    }
    
    $cliente = $result->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'data' => $cliente
    ]);
}
?>
