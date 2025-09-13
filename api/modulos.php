<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';
require_once '../modulos_manager.php';

// Usar la conexión configurada automáticamente
$conn = getDatabaseConnectionMysqli();

$modulosManager = new ModulosManager($conn);

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($method) {
        case 'GET':
            switch ($action) {
                case 'todos':
                    $modulos = $modulosManager->getModulos();
                    echo json_encode(['success' => true, 'data' => $modulos]);
                    break;
                    
                case 'usuario':
                    $id_usuario = $_GET['id_usuario'] ?? null;
                    if (!$id_usuario) {
                        throw new Exception('ID de usuario requerido');
                    }
                    $modulos = $modulosManager->getModulosUsuario($id_usuario);
                    echo json_encode(['success' => true, 'data' => $modulos]);
                    break;
                    
                case 'tipo_usuario':
                    $id_tipo_usuario = $_GET['id_tipo_usuario'] ?? null;
                    if (!$id_tipo_usuario) {
                        throw new Exception('ID de tipo de usuario requerido');
                    }
                    $modulos = $modulosManager->getModulosPorTipoUsuario($id_tipo_usuario);
                    echo json_encode(['success' => true, 'data' => $modulos]);
                    break;
                    
                case 'verificar_acceso':
                    $id_usuario = $_GET['id_usuario'] ?? null;
                    $id_modulo = $_GET['id_modulo'] ?? null;
                    if (!$id_usuario || !$id_modulo) {
                        throw new Exception('ID de usuario y módulo requeridos');
                    }
                    $tiene_acceso = $modulosManager->tieneAccesoModulo($id_usuario, $id_modulo);
                    echo json_encode(['success' => true, 'tiene_acceso' => $tiene_acceso]);
                    break;
                    
                case 'estadisticas':
                    $estadisticas = $modulosManager->getEstadisticasModulos();
                    echo json_encode(['success' => true, 'data' => $estadisticas]);
                    break;
                    
                case 'menu_usuario':
                    $id_usuario = $_GET['id_usuario'] ?? null;
                    if (!$id_usuario) {
                        throw new Exception('ID de usuario requerido');
                    }
                    $menu = generarMenuUsuario($id_usuario);
                    echo json_encode(['success' => true, 'data' => $menu]);
                    break;
                    
                default:
                    throw new Exception('Acción no válida');
            }
            break;
            
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            
            switch ($action) {
                case 'asignar':
                    $id_usuario = $input['id_usuario'] ?? null;
                    $id_modulo = $input['id_modulo'] ?? null;
                    
                    if (!$id_usuario || !$id_modulo) {
                        throw new Exception('ID de usuario y módulo requeridos');
                    }
                    
                    $resultado = $modulosManager->asignarModulo($id_usuario, $id_modulo);
                    echo json_encode(['success' => $resultado, 'message' => 'Módulo asignado correctamente']);
                    break;
                    
                case 'asignar_por_defecto':
                    $id_usuario = $input['id_usuario'] ?? null;
                    $id_tipo_usuario = $input['id_tipo_usuario'] ?? null;
                    
                    if (!$id_usuario || !$id_tipo_usuario) {
                        throw new Exception('ID de usuario y tipo de usuario requeridos');
                    }
                    
                    $resultado = $modulosManager->asignarModulosPorDefecto($id_usuario, $id_tipo_usuario);
                    echo json_encode(['success' => $resultado, 'message' => 'Módulos asignados por defecto']);
                    break;
                    
                default:
                    throw new Exception('Acción no válida');
            }
            break;
            
        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            
            switch ($action) {
                case 'desasignar':
                    $id_usuario = $input['id_usuario'] ?? null;
                    $id_modulo = $input['id_modulo'] ?? null;
                    
                    if (!$id_usuario || !$id_modulo) {
                        throw new Exception('ID de usuario y módulo requeridos');
                    }
                    
                    $resultado = $modulosManager->desasignarModulo($id_usuario, $id_modulo);
                    echo json_encode(['success' => $resultado, 'message' => 'Módulo desasignado correctamente']);
                    break;
                    
                default:
                    throw new Exception('Acción no válida');
            }
            break;
            
        default:
            throw new Exception('Método no permitido');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}

$conn->close();
?> 