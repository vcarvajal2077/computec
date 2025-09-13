<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'listar':
            getTecnicos($pdo);
            break;
        case 'disponibles':
            getTecnicosDisponibles($pdo);
            break;
        case 'asignar':
            if ($method === 'POST') {
                asignarTecnico($pdo);
            } else {
                throw new Exception('Método no permitido');
            }
            break;
        case 'asignaciones':
            getAsignaciones($pdo);
            break;
        default:
            throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}

function getTecnicos($pdo) {
    $especialidad = $_GET['especialidad'] ?? null;
    $estado = $_GET['estado'] ?? null;
    $limit = $_GET['limit'] ?? 50;
    $offset = $_GET['offset'] ?? 0;
    
    $sql = "
        SELECT 
            id,
            nombre,
            especialidades,
            telefono,
            email,
            estado,
            calificacion_promedio,
            total_servicios
        FROM tecnicos
        WHERE 1=1
    ";
    
    $params = [];
    
    if ($estado) {
        $sql .= " AND estado = :estado";
        $params['estado'] = $estado;
    }
    
    $sql .= " ORDER BY calificacion_promedio DESC, total_servicios DESC LIMIT :limit OFFSET :offset";
    
    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue('limit', (int)$limit, PDO::PARAM_INT);
    $stmt->bindValue('offset', (int)$offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $tecnicos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Filtrar por especialidad si se especifica
    if ($especialidad) {
        $tecnicos = array_filter($tecnicos, function($tecnico) use ($especialidad) {
            $especialidades = json_decode($tecnico['especialidades'], true);
            return in_array($especialidad, $especialidades);
        });
    }
    
    // Decodificar JSON de especialidades
    foreach ($tecnicos as &$tecnico) {
        if ($tecnico['especialidades']) {
            $tecnico['especialidades'] = json_decode($tecnico['especialidades'], true);
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => array_values($tecnicos)
    ]);
}

function getTecnicosDisponibles($pdo) {
    $especialidad = $_GET['especialidad'] ?? null;
    
    $sql = "
        SELECT 
            id,
            nombre,
            especialidades,
            telefono,
            email,
            calificacion_promedio,
            total_servicios
        FROM tecnicos
        WHERE estado = 'disponible'
        ORDER BY calificacion_promedio DESC, total_servicios DESC
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $tecnicos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Filtrar por especialidad si se especifica
    if ($especialidad) {
        $tecnicos = array_filter($tecnicos, function($tecnico) use ($especialidad) {
            $especialidades = json_decode($tecnico['especialidades'], true);
            return in_array($especialidad, $especialidades);
        });
    }
    
    // Decodificar JSON de especialidades
    foreach ($tecnicos as &$tecnico) {
        if ($tecnico['especialidades']) {
            $tecnico['especialidades'] = json_decode($tecnico['especialidades'], true);
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => array_values($tecnicos)
    ]);
}

function asignarTecnico($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Datos de entrada inválidos');
    }
    
    $required_fields = ['orden_id', 'tecnico_id'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field])) {
            throw new Exception("Campo requerido: $field");
        }
    }
    
    $orden_id = $input['orden_id'];
    $tecnico_id = $input['tecnico_id'];
    $notas = $input['notas'] ?? '';
    
    // Verificar que la orden existe
    $stmt = $pdo->prepare("
        SELECT id, estado, tecnico_asignado 
        FROM ordenes_servicios 
        WHERE id = ?
    ");
    $stmt->execute([$orden_id]);
    $orden = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$orden) {
        throw new Exception('Orden no encontrada');
    }
    
    if ($orden['estado'] === 'cancelada') {
        throw new Exception('No se puede asignar técnico a una orden cancelada');
    }
    
    // Verificar que el técnico existe y está disponible
    $stmt = $pdo->prepare("
        SELECT id, nombre, estado 
        FROM tecnicos 
        WHERE id = ?
    ");
    $stmt->execute([$tecnico_id]);
    $tecnico = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$tecnico) {
        throw new Exception('Técnico no encontrado');
    }
    
    if ($tecnico['estado'] !== 'disponible') {
        throw new Exception('El técnico no está disponible');
    }
    
    // Verificar si ya hay una asignación activa para esta orden
    $stmt = $pdo->prepare("
        SELECT id 
        FROM asignaciones_tecnicos 
        WHERE orden_id = ? AND estado IN ('asignado', 'en_camino', 'en_servicio')
    ");
    $stmt->execute([$orden_id]);
    if ($stmt->fetch()) {
        throw new Exception('Ya existe una asignación activa para esta orden');
    }
    
    // Iniciar transacción
    $pdo->beginTransaction();
    
    try {
        // Crear asignación
        $stmt = $pdo->prepare("
            INSERT INTO asignaciones_tecnicos (
                orden_id, tecnico_id, estado, notas
            ) VALUES (?, ?, 'asignado', ?)
        ");
        
        $stmt->execute([$orden_id, $tecnico_id, $notas]);
        
        // Actualizar orden con técnico asignado
        $stmt = $pdo->prepare("
            UPDATE ordenes_servicios 
            SET tecnico_asignado = ?, estado = 'confirmada' 
            WHERE id = ?
        ");
        $stmt->execute([$tecnico['nombre'], $orden_id]);
        
        // Actualizar estado del técnico
        $stmt = $pdo->prepare("
            UPDATE tecnicos 
            SET estado = 'ocupado' 
            WHERE id = ?
        ");
        $stmt->execute([$tecnico_id]);
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'data' => [
                'asignacion_id' => $pdo->lastInsertId(),
                'tecnico_nombre' => $tecnico['nombre'],
                'estado' => 'asignado'
            ]
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

function getAsignaciones($pdo) {
    $tecnico_id = $_GET['tecnico_id'] ?? null;
    $orden_id = $_GET['orden_id'] ?? null;
    $estado = $_GET['estado'] ?? null;
    $limit = $_GET['limit'] ?? 20;
    $offset = $_GET['offset'] ?? 0;
    
    $sql = "
        SELECT 
            a.id,
            a.orden_id,
            a.tecnico_id,
            a.fecha_asignacion,
            a.estado,
            a.notas,
            t.nombre as tecnico_nombre,
            t.telefono as tecnico_telefono,
            o.numero_orden,
            o.fecha_orden,
            o.estado as orden_estado,
            o.direccion_servicio,
            CONCAT(c.nombre, ' ', c.apellido) as cliente_nombre,
            c.telefono as cliente_telefono
        FROM asignaciones_tecnicos a
        JOIN tecnicos t ON a.tecnico_id = t.id
        JOIN ordenes_servicios o ON a.orden_id = o.id
        JOIN clientes c ON o.cliente_id = c.id_cliente
        WHERE 1=1
    ";
    
    $params = [];
    
    if ($tecnico_id) {
        $sql .= " AND a.tecnico_id = :tecnico_id";
        $params['tecnico_id'] = $tecnico_id;
    }
    
    if ($orden_id) {
        $sql .= " AND a.orden_id = :orden_id";
        $params['orden_id'] = $orden_id;
    }
    
    if ($estado) {
        $sql .= " AND a.estado = :estado";
        $params['estado'] = $estado;
    }
    
    $sql .= " ORDER BY a.fecha_asignacion DESC LIMIT :limit OFFSET :offset";
    
    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue('limit', (int)$limit, PDO::PARAM_INT);
    $stmt->bindValue('offset', (int)$offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $asignaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $asignaciones
    ]);
}
?>
