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
            listarServicios($conn);
            break;
            
        case 'crear':
            crearServicio($conn);
            break;
            
        case 'actualizar':
            actualizarServicio($conn);
            break;
            
        case 'eliminar':
            eliminarServicio($conn);
            break;
            
        case 'obtener_clientes':
            obtenerClientes($conn);
            break;
            
        case 'obtener_tecnicos':
            obtenerTecnicos($conn);
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

function listarServicios($conn) {
    try {
        $query = "
            SELECT 
                s.*,
                CONCAT(c.nombre, ' ', c.apellido) as nombre_cliente,
                CONCAT(u.nombre, ' ', u.apellido) as nombre_tecnico,
                s.tipo_servicio as tipo_equipo,
                s.descripcion as descripcion_problema,
                s.costo as costo_estimado,
                s.observaciones as notas,
                s.id_usuario as id_tecnico
            FROM servicios s
            LEFT JOIN clientes c ON s.id_cliente = c.id_cliente
            LEFT JOIN usuarios u ON s.id_usuario = u.id_usuario
            ORDER BY s.id_servicio DESC
        ";
        
        $result = $conn->query($query);
        if (!$result) {
            throw new Exception("Error en query: " . $conn->error);
        }
        
        $servicios = [];
        while ($row = $result->fetch_assoc()) {
            $servicios[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $servicios
        ]);
    } catch (Exception $e) {
        throw new Exception("Error en listarServicios: " . $e->getMessage());
    }
}

function crearServicio($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_cliente']) || empty($input['tipo_equipo']) || empty($input['descripcion_problema'])) {
        throw new Exception('Cliente, tipo de equipo y descripción del problema son requeridos');
    }
    
    $stmt = $conn->prepare("
        INSERT INTO servicios (
            id_cliente, id_usuario, tipo_servicio, descripcion, 
            costo, fecha_entrega, estado, observaciones, marca_modelo, diagnostico
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $id_cliente = $input['id_cliente'];
    $id_usuario = !empty($input['id_tecnico']) ? $input['id_tecnico'] : null;
    $tipo_servicio = $input['tipo_equipo'];
    $descripcion = $input['descripcion_problema'];
    $costo = $input['costo_estimado'] ?? 0;
    $fecha_entrega = !empty($input['fecha_entrega']) ? $input['fecha_entrega'] : null;
    $estado = strtolower(str_replace(' ', '_', $input['estado'] ?? 'Pendiente'));
    $observaciones = $input['notas'] ?? '';
    $marca_modelo = $input['marca_modelo'] ?? '';
    $diagnostico = $input['diagnostico'] ?? '';
    
    $stmt->bind_param(
        'iissdssss',
        $id_cliente, $id_usuario, $tipo_servicio, $descripcion,
        $costo, $fecha_entrega, $estado, $observaciones, $marca_modelo, $diagnostico
    );
    
    if (!$stmt->execute()) {
        throw new Exception('Error al crear servicio: ' . $stmt->error);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Servicio creado correctamente',
        'id_servicio' => $conn->insert_id
    ]);
}

function actualizarServicio($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_servicio'])) {
        throw new Exception('ID de servicio requerido');
    }
    
    $campos = [];
    $tipos = '';
    $valores = [];
    
    if (isset($input['id_cliente'])) {
        $campos[] = 'id_cliente = ?';
        $tipos .= 'i';
        $valores[] = $input['id_cliente'];
    }
    
    if (isset($input['id_tecnico'])) {
        $campos[] = 'id_usuario = ?';
        $tipos .= 'i';
        $valores[] = $input['id_tecnico'] ?: null;
    }
    
    if (isset($input['tipo_equipo'])) {
        $campos[] = 'tipo_servicio = ?';
        $tipos .= 's';
        $valores[] = $input['tipo_equipo'];
    }
    
    if (isset($input['descripcion_problema'])) {
        $campos[] = 'descripcion = ?';
        $tipos .= 's';
        $valores[] = $input['descripcion_problema'];
    }
    
    if (isset($input['costo_estimado'])) {
        $campos[] = 'costo = ?';
        $tipos .= 'd';
        $valores[] = $input['costo_estimado'];
    }
    
    if (isset($input['fecha_entrega'])) {
        $campos[] = 'fecha_entrega = ?';
        $tipos .= 's';
        $valores[] = $input['fecha_entrega'] ?: null;
    }
    
    if (isset($input['estado'])) {
        $campos[] = 'estado = ?';
        $tipos .= 's';
        $valores[] = strtolower(str_replace(' ', '_', $input['estado']));
    }
    
    if (isset($input['notas'])) {
        $campos[] = 'observaciones = ?';
        $tipos .= 's';
        $valores[] = $input['notas'];
    }
    
    if (isset($input['marca_modelo'])) {
        $campos[] = 'marca_modelo = ?';
        $tipos .= 's';
        $valores[] = $input['marca_modelo'];
    }
    
    if (isset($input['diagnostico'])) {
        $campos[] = 'diagnostico = ?';
        $tipos .= 's';
        $valores[] = $input['diagnostico'];
    }
    
    if (empty($campos)) {
        throw new Exception('No hay campos para actualizar');
    }
    
    $query = "UPDATE servicios SET " . implode(', ', $campos) . " WHERE id_servicio = ?";
    $tipos .= 'i';
    $valores[] = $input['id_servicio'];
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param($tipos, ...$valores);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al actualizar servicio');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Servicio actualizado correctamente'
    ]);
}

function eliminarServicio($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_servicio'])) {
        throw new Exception('ID de servicio requerido');
    }
    
    $stmt = $conn->prepare("DELETE FROM servicios WHERE id_servicio = ?");
    $stmt->bind_param('i', $input['id_servicio']);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al eliminar servicio');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Servicio eliminado correctamente'
    ]);
}

function obtenerClientes($conn) {
    $query = "SELECT id_cliente, CONCAT(nombre, ' ', apellido) as nombre_completo FROM clientes WHERE activo = 1 ORDER BY nombre";
    $result = $conn->query($query);
    
    $clientes = [];
    while ($row = $result->fetch_assoc()) {
        $clientes[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $clientes
    ]);
}

function obtenerTecnicos($conn) {
    // Obtener usuarios que sean técnicos (tipo_usuario = 3 o rol = 'Técnico')
    $query = "
        SELECT u.id_usuario, CONCAT(u.nombre, ' ', u.apellido) as nombre_completo 
        FROM usuarios u
        INNER JOIN tipo_usuario t ON u.id_tipo_usuario = t.id_tipo_usuario
        WHERE t.nombre_tipo = 'Técnico' OR u.id_tipo_usuario = 3
        ORDER BY u.nombre
    ";
    $result = $conn->query($query);
    
    $tecnicos = [];
    while ($row = $result->fetch_assoc()) {
        $tecnicos[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $tecnicos
    ]);
}
?>
