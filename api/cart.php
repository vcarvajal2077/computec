<?php
header("Content-Type: application/json");
require_once '../config/database.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Usuario no autenticado']);
    exit();
}
$userId = $_SESSION['user_id'];

// Obtener id_cliente del usuario
function getClienteId($pdo, $userId) {
    $stmt = $pdo->prepare("SELECT id_cliente FROM clientes WHERE id_usuario = ?");
    $stmt->execute([$userId]);
    return $stmt->fetchColumn();
}

// Obtener o crear carrito activo
function getOrCreateCarrito($pdo, $clienteId) {
    // Buscar carrito pendiente
    $stmt = $pdo->prepare("SELECT id_carrito FROM carrito WHERE id_cliente = ? AND estado = 'pendiente' LIMIT 1");
    $stmt->execute([$clienteId]);
    $carritoId = $stmt->fetchColumn();
    
    if (!$carritoId) {
        // Crear nuevo carrito
        $stmt = $pdo->prepare("INSERT INTO carrito (id_cliente, total, estado) VALUES (?, 0, 'pendiente')");
        $stmt->execute([$clienteId]);
        $carritoId = $pdo->lastInsertId();
    }
    
    return $carritoId;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDatabaseConnection();

    $clienteId = getClienteId($pdo, $userId);
    if (!$clienteId) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Cliente no encontrado']);
        exit();
    }

    switch ($method) {
        case 'GET':
            $carritoId = getOrCreateCarrito($pdo, $clienteId);
            
            $stmt = $pdo->prepare("
                SELECT 
                    ci.id, ci.item_id, ci.item_type, ci.cantidad as quantity, ci.precio,
                    IF(ci.item_type = 'product', p.nombre, sc.nombre) as item_name,
                    IF(ci.item_type = 'product', p.precio_venta, sc.precio_base) as item_price,
                    IF(ci.item_type = 'product', p.imagen, sc.imagen) as item_image
                FROM carrito_items ci
                LEFT JOIN productos p ON ci.item_id = p.id_producto AND ci.item_type = 'product'
                LEFT JOIN servicios_catalogo sc ON ci.item_id = sc.id AND ci.item_type = 'service'
                WHERE ci.id_carrito = ?
            ");
            $stmt->execute([$carritoId]);
            $cartItems = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $cartItems]);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!isset($data['item_id']) || !isset($data['item_type'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
                exit();
            }

            $itemId = $data['item_id'];
            $itemType = $data['item_type'];
            $quantity = isset($data['quantity']) ? (int)$data['quantity'] : 1;

            $pdo->beginTransaction();

            try {
                $carritoId = getOrCreateCarrito($pdo, $clienteId);
                
                // Obtener precio del item y verificar stock
                $newStock = null;
                if ($itemType === 'product') {
                    $stmt = $pdo->prepare("SELECT p.precio_venta, IFNULL(i.stock_actual, 0) as stock FROM productos p LEFT JOIN inventario i ON p.id_producto = i.id_producto WHERE p.id_producto = ?");
                    $stmt->execute([$itemId]);
                    $producto = $stmt->fetch();
                    $precio = $producto['precio_venta'];
                    $newStock = $producto['stock'];
                    
                    if ($newStock < $quantity) {
                        throw new Exception('Stock insuficiente. Disponible: ' . $newStock);
                    }
                } else {
                    $stmt = $pdo->prepare("SELECT precio_base FROM servicios_catalogo WHERE id = ?");
                    $stmt->execute([$itemId]);
                    $precio = $stmt->fetchColumn();
                }

                // Verificar si el item ya está en el carrito
                $stmt = $pdo->prepare("SELECT * FROM carrito_items WHERE id_carrito = ? AND item_id = ? AND item_type = ?");
                $stmt->execute([$carritoId, $itemId, $itemType]);
                $existingItem = $stmt->fetch();

                if ($existingItem) {
                    $newQuantity = $existingItem['cantidad'] + $quantity;
                    
                    // Verificar stock para la nueva cantidad si es producto
                    if ($itemType === 'product') {
                        $stmt = $pdo->prepare("SELECT IFNULL(stock_actual, 0) FROM inventario WHERE id_producto = ?");
                        $stmt->execute([$itemId]);
                        $stockActual = $stmt->fetchColumn();
                        
                        if ($stockActual < $quantity) {
                            throw new Exception('Stock insuficiente. Disponible: ' . $stockActual);
                        }
                        
                        // Descontar del inventario
                        $stmt = $pdo->prepare("UPDATE inventario SET stock_actual = stock_actual - ? WHERE id_producto = ?");
                        $stmt->execute([$quantity, $itemId]);
                    }
                    
                    $stmt = $pdo->prepare("UPDATE carrito_items SET cantidad = ? WHERE id = ?");
                    $stmt->execute([$newQuantity, $existingItem['id']]);
                } else {
                    // Descontar del inventario si es producto
                    if ($itemType === 'product') {
                        $stmt = $pdo->prepare("UPDATE inventario SET stock_actual = stock_actual - ? WHERE id_producto = ?");
                        $stmt->execute([$quantity, $itemId]);
                    }
                    
                    $stmt = $pdo->prepare("INSERT INTO carrito_items (id_carrito, item_id, item_type, cantidad, precio) VALUES (?, ?, ?, ?, ?)");
                    $stmt->execute([$carritoId, $itemId, $itemType, $quantity, $precio]);
                }
                
                // Actualizar total del carrito
                $stmt = $pdo->prepare("UPDATE carrito SET total = (SELECT SUM(cantidad * precio) FROM carrito_items WHERE id_carrito = ?) WHERE id_carrito = ?");
                $stmt->execute([$carritoId, $carritoId]);
                
                // Obtener stock actualizado si es producto
                if ($itemType === 'product') {
                    $stmt = $pdo->prepare("SELECT IFNULL(stock_actual, 0) FROM inventario WHERE id_producto = ?");
                    $stmt->execute([$itemId]);
                    $newStock = $stmt->fetchColumn();
                }

                $pdo->commit();

                http_response_code(201);
                echo json_encode([
                    'success' => true, 
                    'message' => 'Item añadido al carrito',
                    'new_stock' => $newStock
                ]);

            } catch (Exception $e) {
                $pdo->rollBack();
                http_response_code(409);
                echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            }
            break;

        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!isset($data['cart_item_id']) || !isset($data['quantity'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
                exit();
            }

            $cartItemId = $data['cart_item_id'];
            $newQuantity = (int)$data['quantity'];

            $pdo->beginTransaction();

            try {
                $carritoId = getOrCreateCarrito($pdo, $clienteId);
                
                $stmt = $pdo->prepare("SELECT * FROM carrito_items WHERE id = ? AND id_carrito = ?");
                $stmt->execute([$cartItemId, $carritoId]);
                $item = $stmt->fetch();

                if (!$item) {
                    throw new Exception('El item no se encuentra en el carrito.');
                }

                // Ajustar stock si es producto
                if ($item['item_type'] === 'product') {
                    $cantidadDiff = $newQuantity - $item['cantidad'];
                    
                    if ($cantidadDiff > 0) {
                        // Se aumenta cantidad: verificar y descontar stock
                        $stmt = $pdo->prepare("SELECT IFNULL(stock_actual, 0) FROM inventario WHERE id_producto = ?");
                        $stmt->execute([$item['item_id']]);
                        $stockActual = $stmt->fetchColumn();
                        
                        if ($stockActual < $cantidadDiff) {
                            throw new Exception('Stock insuficiente. Disponible: ' . $stockActual);
                        }
                        
                        $stmt = $pdo->prepare("UPDATE inventario SET stock_actual = stock_actual - ? WHERE id_producto = ?");
                        $stmt->execute([$cantidadDiff, $item['item_id']]);
                    } else if ($cantidadDiff < 0) {
                        // Se reduce cantidad: devolver stock
                        $stmt = $pdo->prepare("UPDATE inventario SET stock_actual = stock_actual + ? WHERE id_producto = ?");
                        $stmt->execute([abs($cantidadDiff), $item['item_id']]);
                    }
                }

                if ($newQuantity > 0) {
                    $stmt = $pdo->prepare("UPDATE carrito_items SET cantidad = ? WHERE id = ?");
                    $stmt->execute([$newQuantity, $cartItemId]);
                } else {
                    // Si la cantidad es 0, devolver todo el stock
                    if ($item['item_type'] === 'product') {
                        $stmt = $pdo->prepare("UPDATE inventario SET stock_actual = stock_actual + ? WHERE id_producto = ?");
                        $stmt->execute([$item['cantidad'], $item['item_id']]);
                    }
                    
                    $stmt = $pdo->prepare("DELETE FROM carrito_items WHERE id = ?");
                    $stmt->execute([$cartItemId]);
                }
                
                // Actualizar total del carrito
                $stmt = $pdo->prepare("UPDATE carrito SET total = (SELECT IFNULL(SUM(cantidad * precio), 0) FROM carrito_items WHERE id_carrito = ?) WHERE id_carrito = ?");
                $stmt->execute([$carritoId, $carritoId]);
                
                $pdo->commit();
                echo json_encode(['success' => true, 'message' => 'Carrito actualizado']);

            } catch (Exception $e) {
                $pdo->rollBack();
                http_response_code(409);
                echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            }
            break;

        case 'DELETE':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!isset($data['cart_item_id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'ID de item no proporcionado']);
                exit();
            }

            $cartItemId = $data['cart_item_id'];
            
            $pdo->beginTransaction();

            try {
                $carritoId = getOrCreateCarrito($pdo, $clienteId);
                
                $stmt = $pdo->prepare("SELECT * FROM carrito_items WHERE id = ? AND id_carrito = ?");
                $stmt->execute([$cartItemId, $carritoId]);
                $item = $stmt->fetch();

                if ($item) {
                    // Devolver stock al inventario si es producto
                    if ($item['item_type'] === 'product') {
                        $stmt = $pdo->prepare("UPDATE inventario SET stock_actual = stock_actual + ? WHERE id_producto = ?");
                        $stmt->execute([$item['cantidad'], $item['item_id']]);
                    }
                    
                    $stmt = $pdo->prepare("DELETE FROM carrito_items WHERE id = ?");
                    $stmt->execute([$cartItemId]);
                    
                    // Actualizar total del carrito
                    $stmt = $pdo->prepare("UPDATE carrito SET total = (SELECT IFNULL(SUM(cantidad * precio), 0) FROM carrito_items WHERE id_carrito = ?) WHERE id_carrito = ?");
                    $stmt->execute([$carritoId, $carritoId]);
                }
                
                $pdo->commit();
                echo json_encode(['success' => true, 'message' => 'Item eliminado del carrito']);

            } catch (Exception $e) {
                $pdo->rollBack();
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'No se pudo eliminar el item: ' . $e->getMessage()]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Método no permitido']);
            break;
    }
} catch (Exception $e) {
    // Asegurarse de hacer rollback si la conexión falla al inicio
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>