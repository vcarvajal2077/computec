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

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDatabaseConnection();

    switch ($method) {
        case 'GET':
            $stmt = $pdo->prepare("
                SELECT 
                    ci.id, ci.item_id, ci.item_type, ci.quantity, 
                    IF(ci.item_type = 'product', p.nombre, sc.nombre) as item_name,
                    IF(ci.item_type = 'product', p.precio_venta, sc.precio_base) as item_price,
                    IF(ci.item_type = 'product', p.imagen, sc.imagen) as item_image
                FROM cart_items ci
                LEFT JOIN productos p ON ci.item_id = p.id_producto AND ci.item_type = 'product'
                LEFT JOIN servicios_catalogo sc ON ci.item_id = sc.id AND ci.item_type = 'service'
                WHERE ci.user_id = ?
            ");
            $stmt->execute([$userId]);
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
                // Si es un producto, manejar el stock
                if ($itemType === 'product') {
                    $stmt = $pdo->prepare("SELECT stock_actual FROM inventario WHERE id_producto = ? FOR UPDATE");
                    $stmt->execute([$itemId]);
                    $stock = $stmt->fetchColumn();

                    if ($stock === false || $stock < $quantity) {
                        throw new Exception('Stock insuficiente para el producto solicitado.');
                    }

                    $stmt = $pdo->prepare("UPDATE inventario SET stock_actual = stock_actual - ? WHERE id_producto = ?");
                    $stmt->execute([$quantity, $itemId]);
                }

                // Verificar si el item ya está en el carrito
                $stmt = $pdo->prepare("SELECT * FROM cart_items WHERE user_id = ? AND item_id = ? AND item_type = ?");
                $stmt->execute([$userId, $itemId, $itemType]);
                $existingItem = $stmt->fetch();

                if ($existingItem) {
                    $newQuantity = $existingItem['quantity'] + $quantity;
                    $stmt = $pdo->prepare("UPDATE cart_items SET quantity = ? WHERE id = ?");
                    $stmt->execute([$newQuantity, $existingItem['id']]);
                } else {
                    $stmt = $pdo->prepare("INSERT INTO cart_items (user_id, item_id, item_type, quantity) VALUES (?, ?, ?, ?)");
                    $stmt->execute([$userId, $itemId, $itemType, $quantity]);
                }

                $pdo->commit();

                $newStock = null;
                if ($itemType === 'product') {
                    $stmt = $pdo->prepare("SELECT stock_actual FROM inventario WHERE id_producto = ?");
                    $stmt->execute([$itemId]);
                    $newStock = $stmt->fetchColumn();
                }

                http_response_code(201);
                echo json_encode([
                    'success' => true, 
                    'message' => 'Item añadido al carrito',
                    'new_stock' => $newStock
                ]);

            } catch (Exception $e) {
                $pdo->rollBack();
                http_response_code(409); // Conflict
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
                $stmt = $pdo->prepare("SELECT * FROM cart_items WHERE id = ? AND user_id = ?");
                $stmt->execute([$cartItemId, $userId]);
                $item = $stmt->fetch();

                if (!$item) {
                    throw new Exception('El item no se encuentra en el carrito.');
                }

                if ($item['item_type'] === 'product') {
                    $quantityDiff = $newQuantity - $item['quantity'];

                    if ($quantityDiff > 0) { // Si se añaden unidades
                        $stmt = $pdo->prepare("SELECT stock_actual FROM inventario WHERE id_producto = ? FOR UPDATE");
                        $stmt->execute([$item['item_id']]);
                        $stock = $stmt->fetchColumn();
                        if ($stock < $quantityDiff) {
                            throw new Exception('Stock insuficiente para aumentar la cantidad.');
                        }
                    }
                    
                    // Actualizar stock (funciona para añadir y quitar)
                    $stmt = $pdo->prepare("UPDATE inventario SET stock_actual = stock_actual - ? WHERE id_producto = ?");
                    $stmt->execute([$quantityDiff, $item['item_id']]);
                }

                if ($newQuantity > 0) {
                    $stmt = $pdo->prepare("UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?");
                    $stmt->execute([$newQuantity, $cartItemId, $userId]);
                } else {
                    $stmt = $pdo->prepare("DELETE FROM cart_items WHERE id = ? AND user_id = ?");
                    $stmt->execute([$cartItemId, $userId]);
                }
                
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
                $stmt = $pdo->prepare("SELECT * FROM cart_items WHERE id = ? AND user_id = ?");
                $stmt->execute([$cartItemId, $userId]);
                $item = $stmt->fetch();

                if ($item) {
                    if ($item['item_type'] === 'product') {
                        // Devolver el stock al inventario
                        $stmt = $pdo->prepare("UPDATE inventario SET stock_actual = stock_actual + ? WHERE id_producto = ?");
                        $stmt->execute([$item['quantity'], $item['item_id']]);
                    }

                    $stmt = $pdo->prepare("DELETE FROM cart_items WHERE id = ? AND user_id = ?");
                    $stmt->execute([$cartItemId, $userId]);
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