<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

// Verificar que el usuario esté autenticado y sea Admin
session_start();

$conn = getDatabaseConnectionMysqli();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'listar':
            listarUsuarios($conn);
            break;
            
        case 'crear':
            crearUsuario($conn);
            break;
            
        case 'actualizar':
            actualizarUsuario($conn);
            break;
            
        case 'eliminar':
            eliminarUsuario($conn);
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

function listarUsuarios($conn) {
    $query = "
        SELECT 
            u.id_usuario,
            u.nombre,
            u.apellido,
            u.email,
            u.telefono,
            u.fecha_registro,
            u.activo,
            u.id_tipo_usuario,
            t.nombre_tipo
        FROM usuarios u
        INNER JOIN tipo_usuario t ON u.id_tipo_usuario = t.id_tipo_usuario
        ORDER BY u.id_usuario DESC
    ";
    
    $result = $conn->query($query);
    $usuarios = [];
    
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $usuarios
    ]);
}

function crearUsuario($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validar campos requeridos
    if (empty($input['nombre']) || empty($input['email']) || empty($input['password']) || empty($input['id_tipo_usuario'])) {
        throw new Exception('Faltan campos requeridos');
    }
    
    // Verificar que el email no exista
    $stmt = $conn->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
    $stmt->bind_param('s', $input['email']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        throw new Exception('El email ya está registrado');
    }
    
    // Hash de la contraseña
    $passwordHash = password_hash($input['password'], PASSWORD_BCRYPT);
    
    // Insertar usuario
    $stmt = $conn->prepare("
        INSERT INTO usuarios (nombre, apellido, email, password, telefono, id_tipo_usuario, activo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    $apellido = $input['apellido'] ?? '';
    $telefono = $input['telefono'] ?? '';
    $activo = $input['activo'] ?? 1;
    
    $stmt->bind_param(
        'sssssii',
        $input['nombre'],
        $apellido,
        $input['email'],
        $passwordHash,
        $telefono,
        $input['id_tipo_usuario'],
        $activo
    );
    
    if (!$stmt->execute()) {
        throw new Exception('Error al crear usuario');
    }
    
    $nuevoId = $conn->insert_id;
    
    // Asignar módulos por defecto según tipo de usuario
    asignarModulosPorDefecto($conn, $nuevoId, $input['id_tipo_usuario']);
    
    // Si es cliente, crear registro en tabla clientes
    // Verificar si el tipo de usuario es "Cliente"
    $stmtTipo = $conn->prepare("SELECT nombre_tipo FROM tipo_usuario WHERE id_tipo_usuario = ?");
    $stmtTipo->bind_param('i', $input['id_tipo_usuario']);
    $stmtTipo->execute();
    $resultTipo = $stmtTipo->get_result();
    $tipoUsuario = $resultTipo->fetch_assoc();
    
    if ($tipoUsuario && strtolower($tipoUsuario['nombre_tipo']) === 'cliente') {
        // Verificar si la columna id_usuario existe en clientes
        $columnsCheck = $conn->query("SHOW COLUMNS FROM clientes LIKE 'id_usuario'");
        
        if ($columnsCheck->num_rows > 0) {
            // La columna existe, insertar con id_usuario
            $stmtCliente = $conn->prepare("
                INSERT INTO clientes (nombre, apellido, email, telefono, id_usuario, activo)
                VALUES (?, ?, ?, ?, ?, 1)
            ");
            $stmtCliente->bind_param('ssssi', $input['nombre'], $apellido, $input['email'], $telefono, $nuevoId);
        } else {
            // La columna no existe, insertar sin id_usuario
            $stmtCliente = $conn->prepare("
                INSERT INTO clientes (nombre, apellido, email, telefono, activo)
                VALUES (?, ?, ?, ?, 1)
            ");
            $stmtCliente->bind_param('ssss', $input['nombre'], $apellido, $input['email'], $telefono);
        }
        
        $stmtCliente->execute();
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Usuario creado correctamente',
        'id_usuario' => $nuevoId
    ]);
}

function actualizarUsuario($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_usuario'])) {
        throw new Exception('ID de usuario requerido');
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
    
    if (!empty($input['apellido'])) {
        $campos[] = 'apellido = ?';
        $tipos .= 's';
        $valores[] = $input['apellido'];
    }
    
    if (!empty($input['email'])) {
        $campos[] = 'email = ?';
        $tipos .= 's';
        $valores[] = $input['email'];
    }
    
    if (isset($input['telefono'])) {
        $campos[] = 'telefono = ?';
        $tipos .= 's';
        $valores[] = $input['telefono'];
    }
    
    if (!empty($input['password'])) {
        $campos[] = 'password = ?';
        $tipos .= 's';
        $valores[] = password_hash($input['password'], PASSWORD_BCRYPT);
    }
    
    if (isset($input['id_tipo_usuario'])) {
        $campos[] = 'id_tipo_usuario = ?';
        $tipos .= 'i';
        $valores[] = $input['id_tipo_usuario'];
    }
    
    if (isset($input['activo'])) {
        $campos[] = 'activo = ?';
        $tipos .= 'i';
        $valores[] = $input['activo'];
    }
    
    if (empty($campos)) {
        throw new Exception('No hay campos para actualizar');
    }
    
    $query = "UPDATE usuarios SET " . implode(', ', $campos) . " WHERE id_usuario = ?";
    $tipos .= 'i';
    $valores[] = $input['id_usuario'];
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param($tipos, ...$valores);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al actualizar usuario');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Usuario actualizado correctamente'
    ]);
}

function eliminarUsuario($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_usuario'])) {
        throw new Exception('ID de usuario requerido');
    }
    
    // No permitir eliminar al usuario actual
    if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $input['id_usuario']) {
        throw new Exception('No puedes eliminar tu propio usuario');
    }
    
    // Eliminar asignaciones de módulos
    $stmt = $conn->prepare("DELETE FROM asignacion_modulo WHERE id_usuario = ?");
    $stmt->bind_param('i', $input['id_usuario']);
    $stmt->execute();
    
    // Eliminar cliente si existe
    $stmt = $conn->prepare("DELETE FROM clientes WHERE id_usuario = ?");
    $stmt->bind_param('i', $input['id_usuario']);
    $stmt->execute();
    
    // Eliminar usuario
    $stmt = $conn->prepare("DELETE FROM usuarios WHERE id_usuario = ?");
    $stmt->bind_param('i', $input['id_usuario']);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al eliminar usuario');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Usuario eliminado correctamente'
    ]);
}

function asignarModulosPorDefecto($conn, $idUsuario, $idTipoUsuario) {
    // Obtener módulos según tipo de usuario
    $modulosPorTipo = [
        1 => [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], // Admin - todos
        2 => [4,7,13,14,6,15,9,17], // Gestor Tienda
        3 => [21,22,20], // Editor
        4 => [11,12,16,17], // Técnico
        5 => [19,18,6,15,16,17,21,22] // Cliente
    ];
    
    $modulos = $modulosPorTipo[$idTipoUsuario] ?? [];
    
    if (empty($modulos)) {
        return;
    }
    
    $stmt = $conn->prepare("INSERT INTO asignacion_modulo (id_usuario, id_modulo, activo) VALUES (?, ?, 1)");
    
    foreach ($modulos as $idModulo) {
        $stmt->bind_param('ii', $idUsuario, $idModulo);
        $stmt->execute();
    }
}
?>
