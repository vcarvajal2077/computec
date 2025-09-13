<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

try {
    $conn = getDatabaseConnectionMysqli();
    
    $action = $_GET['action'] ?? 'servicios';
    
    switch ($action) {
        case 'servicios':
            $query = "
                SELECT 
                    id_servicio,
                    tipo_servicio,
                    descripcion,
                    estado,
                    costo,
                    fecha_ingreso,
                    fecha_entrega,
                    observaciones,
                    cliente_nombre,
                    tecnico_nombre,
                    tecnico_id,
                    cliente_id,
                    icono_servicio,
                    color_estado
                FROM v_servicios_carrusel
                ORDER BY fecha_ingreso DESC
                LIMIT 20
            ";
            
            $result = $conn->query($query);
            
            $servicios = [];
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    // Formatear datos
                    $servicio = [
                        'id' => $row['id_servicio'],
                        'tipo' => $row['tipo_servicio'],
                        'descripcion' => $row['descripcion'],
                        'estado' => $row['estado'],
                        'costo' => $row['costo'] ? number_format($row['costo'], 0, ',', '.') : 'Por definir',
                        'fecha_ingreso' => date('d/m/Y', strtotime($row['fecha_ingreso'])),
                        'fecha_entrega' => $row['fecha_entrega'] ? date('d/m/Y', strtotime($row['fecha_entrega'])) : 'Pendiente',
                        'observaciones' => $row['observaciones'],
                        'cliente' => $row['cliente_nombre'],
                        'tecnico' => $row['tecnico_nombre'],
                        'icono' => $row['icono_servicio'],
                        'color_estado' => $row['color_estado'],
                        'estado_texto' => ucfirst(str_replace('_', ' ', $row['estado']))
                    ];
                    
                    $servicios[] = $servicio;
                }
            }
            
            echo json_encode([
                'success' => true,
                'data' => $servicios,
                'total' => count($servicios),
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            break;
            
        default:
            throw new Exception('Acción no válida');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error: ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

$conn->close();
?>
