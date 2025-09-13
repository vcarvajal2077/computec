<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    $pdo = getDatabaseConnection();
    
    switch ($action) {
        case 'categorias':
            getCategorias($pdo);
            break;
        case 'servicios':
            getServicios($pdo);
            break;
        case 'servicio':
            getServicioById($pdo);
            break;
        case 'servicios_categoria':
            getServiciosByCategoria($pdo);
            break;
        default:
            throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}

function getCategorias($pdo) {
    $stmt = $pdo->prepare("
        SELECT id, nombre, descripcion, icono, color, orden 
        FROM categorias_servicios 
        WHERE estado = 'activo' 
        ORDER BY orden ASC
    ");
    $stmt->execute();
    $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $categorias
    ]);
}

function getServicios($pdo) {
    $categoria_id = $_GET['categoria_id'] ?? null;
    $search = $_GET['search'] ?? '';
    $limit = $_GET['limit'] ?? 50;
    $offset = $_GET['offset'] ?? 0;
    
    $sql = "
        SELECT 
            s.id,
            s.categoria_id,
            s.nombre,
            s.descripcion,
            s.descripcion_detallada,
            s.precio_base,
            s.tiempo_estimado,
            s.garantia,
            s.estado,
            s.imagen,
            s.caracteristicas,
            c.nombre as categoria_nombre,
            c.icono as categoria_icono,
            c.color as categoria_color
        FROM servicios_catalogo s
        JOIN categorias_servicios c ON s.categoria_id = c.id
        WHERE s.estado = 'disponible' AND c.estado = 'activo'
    ";
    
    $params = [];
    
    if ($categoria_id) {
        $sql .= " AND s.categoria_id = :categoria_id";
        $params['categoria_id'] = $categoria_id;
    }
    
    if ($search) {
        $sql .= " AND (s.nombre LIKE :search OR s.descripcion LIKE :search)";
        $params['search'] = "%$search%";
    }
    
    $sql .= " ORDER BY c.orden ASC, s.nombre ASC LIMIT :limit OFFSET :offset";
    
    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue('limit', (int)$limit, PDO::PARAM_INT);
    $stmt->bindValue('offset', (int)$offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $servicios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Decodificar JSON de características
    foreach ($servicios as &$servicio) {
        if ($servicio['caracteristicas']) {
            $servicio['caracteristicas'] = json_decode($servicio['caracteristicas'], true);
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $servicios,
        'total' => count($servicios)
    ]);
}

function getServicioById($pdo) {
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        throw new Exception('ID de servicio requerido');
    }
    
    $stmt = $pdo->prepare("
        SELECT 
            s.id,
            s.categoria_id,
            s.nombre,
            s.descripcion,
            s.descripcion_detallada,
            s.precio_base,
            s.tiempo_estimado,
            s.garantia,
            s.estado,
            s.imagen,
            s.caracteristicas,
            c.nombre as categoria_nombre,
            c.icono as categoria_icono,
            c.color as categoria_color
        FROM servicios_catalogo s
        JOIN categorias_servicios c ON s.categoria_id = c.id
        WHERE s.id = :id AND s.estado = 'disponible'
    ");
    
    $stmt->execute(['id' => $id]);
    $servicio = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$servicio) {
        throw new Exception('Servicio no encontrado');
    }
    
    // Decodificar JSON de características
    if ($servicio['caracteristicas']) {
        $servicio['caracteristicas'] = json_decode($servicio['caracteristicas'], true);
    }
    
    echo json_encode([
        'success' => true,
        'data' => $servicio
    ]);
}

function getServiciosByCategoria($pdo) {
    $categoria_id = $_GET['categoria_id'] ?? null;
    
    if (!$categoria_id) {
        throw new Exception('ID de categoría requerido');
    }
    
    $stmt = $pdo->prepare("
        SELECT 
            s.id,
            s.categoria_id,
            s.nombre,
            s.descripcion,
            s.precio_base,
            s.tiempo_estimado,
            s.garantia,
            s.imagen,
            s.caracteristicas
        FROM servicios_catalogo s
        WHERE s.categoria_id = :categoria_id AND s.estado = 'disponible'
        ORDER BY s.nombre ASC
    ");
    
    $stmt->execute(['categoria_id' => $categoria_id]);
    $servicios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Decodificar JSON de características
    foreach ($servicios as &$servicio) {
        if ($servicio['caracteristicas']) {
            $servicio['caracteristicas'] = json_decode($servicio['caracteristicas'], true);
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $servicios
    ]);
}
?>
