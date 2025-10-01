<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

session_start();

$conn = getDatabaseConnectionMysqli();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'obtener':
            obtenerPerfil($conn);
            break;
            
        case 'actualizar':
            actualizarPerfil($conn);
            break;
            
        case 'cambiar_contrasena':
            cambiarContrasena($conn);
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

function obtenerPerfil($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_usuario'])) {
        throw new Exception('ID de usuario requerido');
    }
    
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
        WHERE u.id_usuario = ?
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $input['id_usuario']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Usuario no encontrado');
    }
    
    $usuario = $result->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'data' => $usuario
    ]);
}

function actualizarPerfil($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_usuario'])) {
        throw new Exception('ID de usuario requerido');
    }
    
    // Verificar que el email no esté en uso por otro usuario
    if (!empty($input['email'])) {
        $stmt = $conn->prepare("SELECT id_usuario FROM usuarios WHERE email = ? AND id_usuario != ?");
        $stmt->bind_param('si', $input['email'], $input['id_usuario']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            throw new Exception('El email ya está en uso por otro usuario');
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
    
    if (empty($campos)) {
        throw new Exception('No hay campos para actualizar');
    }
    
    $query = "UPDATE usuarios SET " . implode(', ', $campos) . " WHERE id_usuario = ?";
    $tipos .= 'i';
    $valores[] = $input['id_usuario'];
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param($tipos, ...$valores);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al actualizar perfil');
    }
    
    // Si el usuario tiene un registro en la tabla clientes, actualizarlo también
    $stmtCliente = $conn->prepare("SELECT id_cliente FROM clientes WHERE id_usuario = ?");
    $stmtCliente->bind_param('i', $input['id_usuario']);
    $stmtCliente->execute();
    $resultCliente = $stmtCliente->get_result();
    
    if ($resultCliente->num_rows > 0) {
        $camposCliente = [];
        $tiposCliente = '';
        $valoresCliente = [];
        
        if (!empty($input['nombre'])) {
            $camposCliente[] = 'nombre = ?';
            $tiposCliente .= 's';
            $valoresCliente[] = $input['nombre'];
        }
        
        if (!empty($input['apellido'])) {
            $camposCliente[] = 'apellido = ?';
            $tiposCliente .= 's';
            $valoresCliente[] = $input['apellido'];
        }
        
        if (!empty($input['email'])) {
            $camposCliente[] = 'email = ?';
            $tiposCliente .= 's';
            $valoresCliente[] = $input['email'];
        }
        
        if (isset($input['telefono'])) {
            $camposCliente[] = 'telefono = ?';
            $tiposCliente .= 's';
            $valoresCliente[] = $input['telefono'];
        }
        
        if (!empty($camposCliente)) {
            $queryCliente = "UPDATE clientes SET " . implode(', ', $camposCliente) . " WHERE id_usuario = ?";
            $tiposCliente .= 'i';
            $valoresCliente[] = $input['id_usuario'];
            
            $stmtUpdateCliente = $conn->prepare($queryCliente);
            $stmtUpdateCliente->bind_param($tiposCliente, ...$valoresCliente);
            $stmtUpdateCliente->execute();
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Perfil actualizado correctamente'
    ]);
}

function cambiarContrasena($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_usuario']) || empty($input['current_password']) || empty($input['new_password'])) {
        throw new Exception('Todos los campos son requeridos');
    }
    
    // Obtener la contraseña actual del usuario
    $stmt = $conn->prepare("SELECT password FROM usuarios WHERE id_usuario = ?");
    $stmt->bind_param('i', $input['id_usuario']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Usuario no encontrado');
    }
    
    $usuario = $result->fetch_assoc();
    
    // Verificar que la contraseña actual sea correcta
    if (!password_verify($input['current_password'], $usuario['password'])) {
        throw new Exception('La contraseña actual es incorrecta');
    }
    
    // Validar longitud de la nueva contraseña
    if (strlen($input['new_password']) < 6) {
        throw new Exception('La nueva contraseña debe tener al menos 6 caracteres');
    }
    
    // Hash de la nueva contraseña
    $newPasswordHash = password_hash($input['new_password'], PASSWORD_BCRYPT);
    
    // Actualizar contraseña
    $stmt = $conn->prepare("UPDATE usuarios SET password = ? WHERE id_usuario = ?");
    $stmt->bind_param('si', $newPasswordHash, $input['id_usuario']);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al cambiar la contraseña');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Contraseña cambiada correctamente'
    ]);
}
?>
