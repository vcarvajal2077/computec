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
            listarModulos($conn);
            break;
            
        case 'crear':
            crearModulo($conn);
            break;
            
        case 'actualizar':
            actualizarModulo($conn);
            break;
            
        case 'eliminar':
            eliminarModulo($conn);
            break;
            
        case 'tipos_usuario_asignaciones':
            obtenerTiposUsuarioAsignaciones($conn);
            break;
            
        case 'usuarios_asignaciones':
            obtenerUsuariosAsignaciones($conn);
            break;
            
        case 'asignar_tipo':
            asignarModuloATipo($conn);
            break;
            
        case 'desasignar_tipo':
            desasignarModuloDeTipo($conn);
            break;
            
        case 'asignar_usuarios':
            asignarModuloAUsuarios($conn);
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

function listarModulos($conn) {
    $query = "
        SELECT 
            m.*,
            COUNT(DISTINCT am.id_usuario) as usuarios_asignados
        FROM modulos m
        LEFT JOIN asignacion_modulo am ON m.id_modulo = am.id_modulo AND am.activo = 1
        GROUP BY m.id_modulo
        ORDER BY m.orden ASC
    ";
    
    $result = $conn->query($query);
    $modulos = [];
    
    while ($row = $result->fetch_assoc()) {
        $modulos[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $modulos
    ]);
}

function crearModulo($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['nombre_modulo']) || empty($input['url'])) {
        throw new Exception('Nombre y URL son requeridos');
    }
    
    $stmt = $conn->prepare("
        INSERT INTO modulos (nombre_modulo, descripcion, url, icono, orden, activo)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $descripcion = $input['descripcion'] ?? '';
    $icono = $input['icono'] ?? 'fas fa-circle';
    $orden = $input['orden'] ?? 1;
    $activo = $input['activo'] ?? 1;
    
    $stmt->bind_param(
        'ssssii',
        $input['nombre_modulo'],
        $descripcion,
        $input['url'],
        $icono,
        $orden,
        $activo
    );
    
    if (!$stmt->execute()) {
        throw new Exception('Error al crear módulo');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Módulo creado correctamente',
        'id_modulo' => $conn->insert_id
    ]);
}

function actualizarModulo($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_modulo'])) {
        throw new Exception('ID de módulo requerido');
    }
    
    $campos = [];
    $tipos = '';
    $valores = [];
    
    if (isset($input['nombre_modulo'])) {
        $campos[] = 'nombre_modulo = ?';
        $tipos .= 's';
        $valores[] = $input['nombre_modulo'];
    }
    
    if (isset($input['descripcion'])) {
        $campos[] = 'descripcion = ?';
        $tipos .= 's';
        $valores[] = $input['descripcion'];
    }
    
    if (isset($input['url'])) {
        $campos[] = 'url = ?';
        $tipos .= 's';
        $valores[] = $input['url'];
    }
    
    if (isset($input['icono'])) {
        $campos[] = 'icono = ?';
        $tipos .= 's';
        $valores[] = $input['icono'];
    }
    
    if (isset($input['orden'])) {
        $campos[] = 'orden = ?';
        $tipos .= 'i';
        $valores[] = $input['orden'];
    }
    
    if (isset($input['activo'])) {
        $campos[] = 'activo = ?';
        $tipos .= 'i';
        $valores[] = $input['activo'];
    }
    
    if (empty($campos)) {
        throw new Exception('No hay campos para actualizar');
    }
    
    $query = "UPDATE modulos SET " . implode(', ', $campos) . " WHERE id_modulo = ?";
    $tipos .= 'i';
    $valores[] = $input['id_modulo'];
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param($tipos, ...$valores);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al actualizar módulo');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Módulo actualizado correctamente'
    ]);
}

function eliminarModulo($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_modulo'])) {
        throw new Exception('ID de módulo requerido');
    }
    
    // Eliminar asignaciones
    $stmt = $conn->prepare("DELETE FROM asignacion_modulo WHERE id_modulo = ?");
    $stmt->bind_param('i', $input['id_modulo']);
    $stmt->execute();
    
    // Eliminar módulo
    $stmt = $conn->prepare("DELETE FROM modulos WHERE id_modulo = ?");
    $stmt->bind_param('i', $input['id_modulo']);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al eliminar módulo');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Módulo eliminado correctamente'
    ]);
}

function obtenerTiposUsuarioAsignaciones($conn) {
    $idModulo = $_GET['id_modulo'] ?? null;
    
    if (!$idModulo) {
        throw new Exception('ID de módulo requerido');
    }
    
    $query = "
        SELECT 
            t.id_tipo_usuario,
            t.nombre_tipo,
            COUNT(DISTINCT u.id_usuario) as usuarios_count,
            COUNT(DISTINCT CASE WHEN am.id_modulo = ? THEN u.id_usuario END) as usuarios_con_modulo
        FROM tipo_usuario t
        LEFT JOIN usuarios u ON t.id_tipo_usuario = u.id_tipo_usuario
        LEFT JOIN asignacion_modulo am ON u.id_usuario = am.id_usuario AND am.id_modulo = ? AND am.activo = 1
        GROUP BY t.id_tipo_usuario, t.nombre_tipo
        ORDER BY t.id_tipo_usuario
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $idModulo, $idModulo);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $tipos = [];
    while ($row = $result->fetch_assoc()) {
        $row['tiene_modulo'] = ($row['usuarios_con_modulo'] > 0 && $row['usuarios_con_modulo'] == $row['usuarios_count']);
        $tipos[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $tipos
    ]);
}

function obtenerUsuariosAsignaciones($conn) {
    $idModulo = $_GET['id_modulo'] ?? null;
    
    if (!$idModulo) {
        throw new Exception('ID de módulo requerido');
    }
    
    $query = "
        SELECT 
            u.id_usuario,
            u.nombre,
            u.apellido,
            u.email,
            t.nombre_tipo,
            CASE WHEN am.id_asignacion IS NOT NULL THEN 1 ELSE 0 END as tiene_modulo
        FROM usuarios u
        INNER JOIN tipo_usuario t ON u.id_tipo_usuario = t.id_tipo_usuario
        LEFT JOIN asignacion_modulo am ON u.id_usuario = am.id_usuario AND am.id_modulo = ? AND am.activo = 1
        WHERE u.activo = 1
        ORDER BY u.nombre, u.apellido
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $idModulo);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $usuarios = [];
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $usuarios
    ]);
}

function asignarModuloATipo($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_modulo']) || empty($input['id_tipo_usuario'])) {
        throw new Exception('ID de módulo y tipo de usuario requeridos');
    }
    
    // Obtener todos los usuarios de ese tipo
    $stmt = $conn->prepare("SELECT id_usuario FROM usuarios WHERE id_tipo_usuario = ? AND activo = 1");
    $stmt->bind_param('i', $input['id_tipo_usuario']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $stmtInsert = $conn->prepare("
        INSERT INTO asignacion_modulo (id_usuario, id_modulo, activo) 
        VALUES (?, ?, 1)
        ON DUPLICATE KEY UPDATE activo = 1
    ");
    
    while ($row = $result->fetch_assoc()) {
        $stmtInsert->bind_param('ii', $row['id_usuario'], $input['id_modulo']);
        $stmtInsert->execute();
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Módulo asignado al tipo de usuario'
    ]);
}

function desasignarModuloDeTipo($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_modulo']) || empty($input['id_tipo_usuario'])) {
        throw new Exception('ID de módulo y tipo de usuario requeridos');
    }
    
    $query = "
        DELETE am FROM asignacion_modulo am
        INNER JOIN usuarios u ON am.id_usuario = u.id_usuario
        WHERE am.id_modulo = ? AND u.id_tipo_usuario = ?
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $input['id_modulo'], $input['id_tipo_usuario']);
    $stmt->execute();
    
    echo json_encode([
        'success' => true,
        'message' => 'Módulo desasignado del tipo de usuario'
    ]);
}

function asignarModuloAUsuarios($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_modulo']) || !isset($input['usuarios'])) {
        throw new Exception('ID de módulo y lista de usuarios requeridos');
    }
    
    // Primero, eliminar todas las asignaciones actuales de este módulo
    $stmt = $conn->prepare("DELETE FROM asignacion_modulo WHERE id_modulo = ?");
    $stmt->bind_param('i', $input['id_modulo']);
    $stmt->execute();
    
    // Luego, insertar las nuevas asignaciones
    if (!empty($input['usuarios'])) {
        $stmtInsert = $conn->prepare("INSERT INTO asignacion_modulo (id_usuario, id_modulo, activo) VALUES (?, ?, 1)");
        
        foreach ($input['usuarios'] as $idUsuario) {
            $stmtInsert->bind_param('ii', $idUsuario, $input['id_modulo']);
            $stmtInsert->execute();
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Asignaciones guardadas correctamente'
    ]);
}
?>
