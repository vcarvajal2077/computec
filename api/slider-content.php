<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password_db);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Consulta para obtener contenido del slider
    $query = "
        SELECT 
            tipo_contenido,
            id,
            titulo,
            descripcion,
            imagen,
            url_destino,
            fecha_creacion,
            fecha_fin,
            activo,
            orden,
            categoria,
            porcentaje_descuento,
            precio_original,
            precio_oferta,
            codigo_descuento
        FROM v_slider_content 
        WHERE activo = 1
        ORDER BY fecha_creacion DESC, orden ASC
        LIMIT 10
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Procesar resultados para el slider
    $sliderContent = [];
    foreach ($resultados as $row) {
        $item = [
            'id' => $row['id'],
            'tipo' => $row['tipo_contenido'],
            'titulo' => $row['titulo'],
            'descripcion' => $row['descripcion'],
            'imagen' => $row['imagen'] ?: 'https://via.placeholder.com/800x400/007bff/ffffff?text=' . urlencode($row['titulo']),
            'url_destino' => $row['url_destino'] ?: '#',
            'categoria' => $row['categoria'],
            'fecha_creacion' => $row['fecha_creacion'],
            'fecha_fin' => $row['fecha_fin']
        ];
        
        // Agregar información específica según el tipo
        if ($row['tipo_contenido'] === 'evento') {
            if ($row['porcentaje_descuento']) {
                $item['descuento'] = $row['porcentaje_descuento'] . '%';
            }
            if ($row['precio_original'] && $row['precio_oferta']) {
                $item['precio_original'] = number_format($row['precio_original'], 0, ',', '.');
                $item['precio_oferta'] = number_format($row['precio_oferta'], 0, ',', '.');
            }
            if ($row['codigo_descuento']) {
                $item['codigo'] = $row['codigo_descuento'];
            }
        }
        
        $sliderContent[] = $item;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $sliderContent,
        'total' => count($sliderContent),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de base de datos: ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error interno: ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>
