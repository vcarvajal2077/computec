<?php
// api/productos.php

header('Content-Type: application/json');
require_once '../config/database.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    $pdo = getDatabaseConnection();
    
    switch ($action) {
        case 'getProductos':
            // Unimos productos con inventario para obtener el stock
            $stmt = $pdo->prepare(
                'SELECT 
                    p.id_producto,
                    p.nombre,
                    p.descripcion,
                    p.categoria,
                    p.precio_venta,
                    p.imagen,
                    IFNULL(i.stock_actual, 0) as stock
                FROM productos p
                LEFT JOIN inventario i ON p.id_producto = i.id_producto
                WHERE p.activo = 1'
            );
            $stmt->execute();
            $productos = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $productos]);
            break;

        case 'getCategorias':
            $stmt = $pdo->prepare(
                'SELECT DISTINCT categoria 
                FROM productos 
                WHERE activo = 1 AND categoria IS NOT NULL AND categoria != \'\' 
                ORDER BY categoria ASC'
            );
            $stmt->execute();
            // Usamos fetchColumn para obtener una lista simple de nombres de categorías
            $categorias = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
            echo json_encode(['success' => true, 'data' => $categorias]);
            break;

        default:
            echo json_encode(['success' => false, 'error' => 'Acción no válida']);
            break;
    }
} catch (Exception $e) {
    // Manejo de errores
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error en el servidor: ' . $e->getMessage()]);
}

?>