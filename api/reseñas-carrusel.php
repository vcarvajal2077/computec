<?php
/**
 * API para el Carrusel de Reseñas de Clientes
 * Obtiene reseñas desde la tabla reseñas de la base de datos
 */

// Headers para API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Obtener la acción solicitada
    $action = $_GET['action'] ?? 'reseñas';
    
    if ($action === 'reseñas') {
        // Intentar conectar a la base de datos
        try {
            require_once __DIR__ . '/../config/database.php';
            $pdo = getDatabaseConnection();
            
            // Usar la vista reseñas_rotativas que maneja automáticamente la rotación cada 5 días
            $query = "
                SELECT 
                    r.id_reseña as id,
                    r.nombre_cliente as nombre,
                    CASE 
                        WHEN c.tipo_cliente = 'empresa' THEN CONCAT(c.nombre, ' ', c.apellido)
                        ELSE 'Cliente Particular'
                    END as empresa,
                    r.calificacion as calificación,
                    r.comentario,
                    r.tipo_servicio as servicio,
                    DATE_FORMAT(r.fecha_creacion, '%d/%m/%Y') as fecha,
                    r.destacado,
                    r.fecha_rotacion,
                    r.orden_rotacion,
                    r.proxima_rotacion
                FROM reseñas_rotativas r
                LEFT JOIN clientes c ON r.id_cliente = c.id_cliente
                ORDER BY r.destacado DESC, r.orden_rotacion ASC, r.fecha_rotacion ASC
            ";
            
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $reseñas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Procesar las reseñas para agregar iconos y colores por servicio
            $reseñas_procesadas = [];
            foreach ($reseñas as $reseña) {
                $reseña['imagen'] = getIconoPorTipoCliente($reseña['empresa']);
                $reseña['color_servicio'] = getColorPorServicio($reseña['servicio']);
                $reseñas_procesadas[] = $reseña;
            }
            
            // Si no hay reseñas en la BD, usar reseñas por defecto
            if (empty($reseñas_procesadas)) {
                $reseñas_procesadas = getReseñasPorDefecto();
            }
            
            // Log para debugging
            error_log("API Reseñas: " . count($reseñas_procesadas) . " reseñas encontradas");
            
            echo json_encode([
                'success' => true,
                'data' => $reseñas_procesadas,
                'total' => count($reseñas_procesadas)
            ]);
            
        } catch (Exception $dbError) {
            // Si hay error de BD, usar reseñas por defecto
            $reseñas_procesadas = getReseñasPorDefecto();
            echo json_encode([
                'success' => true,
                'data' => $reseñas_procesadas,
                'total' => count($reseñas_procesadas),
                'message' => 'Usando datos por defecto: ' . $dbError->getMessage()
            ]);
        }
        
    } else {
        throw new Exception('Acción no válida');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'data' => getReseñasPorDefecto() // Fallback a reseñas por defecto
    ]);
}

/**
 * Obtiene el icono apropiado según el tipo de cliente
 */
function getIconoPorTipoCliente($empresa) {
    if (strpos($empresa, 'Tech') !== false || strpos($empresa, 'Solutions') !== false) {
        return 'fas fa-user-tie';
    } elseif (strpos($empresa, 'Estudiante') !== false || strpos($empresa, 'Universidad') !== false) {
        return 'fas fa-user-graduate';
    } elseif (strpos($empresa, 'Particular') !== false) {
        return 'fas fa-user';
    } else {
        return 'fas fa-user-tie';
    }
}

/**
 * Obtiene el color apropiado según el servicio
 */
function getColorPorServicio($servicio) {
    $colores = [
        'Reparación de Laptop' => '#007bff',
        'Reparación de Desktop' => '#007bff',
        'Ensamblaje de PC' => '#28a745',
        'Ensamblaje PC Gaming' => '#28a745',
        'Mantenimiento Preventivo' => '#ffc107',
        'Mantenimiento Correctivo' => '#ffc107',
        'Diagnóstico Técnico' => '#dc3545',
        'Soporte Técnico' => '#6f42c1',
        'Venta de Componentes' => '#17a2b8',
        'Instalación de Software' => '#fd7e14',
        'Recuperación de Datos' => '#e83e8c',
        'Redes y Conectividad' => '#20c997',
        'Reparación a Domicilio' => '#007bff'
    ];
    
    return $colores[$servicio] ?? '#6c757d';
}

/**
 * Reseñas por defecto en caso de error o sin datos
 * Incluye reseñas de los últimos 5 días para simular rotación
 */
function getReseñasPorDefecto() {
    // Calcular fechas de los últimos 5 días
    $fechas = [];
    for ($i = 0; $i < 5; $i++) {
        $fechas[] = date('d/m/Y', strtotime("-$i days"));
    }
    
    return [
        [
            'id' => 1,
            'nombre' => 'Carlos Rodríguez',
            'empresa' => 'Cliente Particular',
            'calificación' => 5,
            'comentario' => 'Repararon mi laptop en menos de 24 horas. El servicio fue profesional y el precio muy justo. Definitivamente los recomiendo.',
            'servicio' => 'Reparación de Laptop',
            'fecha' => $fechas[0], // Hoy
            'imagen' => 'fas fa-user-tie',
            'color_servicio' => '#007bff'
        ],
        [
            'id' => 2,
            'nombre' => 'María González',
            'empresa' => 'Cliente Particular',
            'calificación' => 5,
            'comentario' => 'Me ensamblaron una PC gaming perfecta para mis necesidades. El técnico fue muy profesional y me explicó todo el proceso.',
            'servicio' => 'Ensamblaje de PC',
            'fecha' => $fechas[1], // Ayer
            'imagen' => 'fas fa-user-graduate',
            'color_servicio' => '#28a745'
        ],
        [
            'id' => 3,
            'nombre' => 'Juan Pérez',
            'empresa' => 'Cliente Particular',
            'calificación' => 4,
            'comentario' => 'El soporte técnico remoto resolvió mi problema rápidamente. Muy eficientes y amables.',
            'servicio' => 'Soporte Técnico',
            'fecha' => $fechas[2], // Hace 2 días
            'imagen' => 'fas fa-user',
            'color_servicio' => '#6f42c1'
        ],
        [
            'id' => 4,
            'nombre' => 'Ana Martínez',
            'empresa' => 'Cliente Particular',
            'calificación' => 5,
            'comentario' => 'Vinieron a mi casa a reparar mi computadora. Muy puntuales y profesionales. El problema se solucionó en el momento.',
            'servicio' => 'Reparación a Domicilio',
            'fecha' => $fechas[3], // Hace 3 días
            'imagen' => 'fas fa-user-graduate',
            'color_servicio' => '#007bff'
        ],
        [
            'id' => 5,
            'nombre' => 'Luis Fernández',
            'empresa' => 'Cliente Particular',
            'calificación' => 4,
            'comentario' => 'Compré varios componentes y todos funcionan perfectamente. Precios competitivos y buena asesoría.',
            'servicio' => 'Venta de Componentes',
            'fecha' => $fechas[4], // Hace 4 días
            'imagen' => 'fas fa-user-tie',
            'color_servicio' => '#17a2b8'
        ]
    ];
}
?>
