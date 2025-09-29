<?php
header("Content-Type: application/json");
require_once '../config/database.php';

session_start();

// Asumir que el ID de usuario está en la sesión. En una implementación real, esto debería ser más robusto.
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit();
}
$userId = $_SESSION['user_id'];

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDatabaseConnection();

    switch ($method) {
        case 'GET':
            // Lógica para obtener el carrito
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
            echo json_encode($cartItems);
            break;

        case 'POST':
            // Lógica para añadir un item
            $data = json_decode(file_get_contents('php://input'), true);
            if (!isset($data['item_id']) || !isset($data['item_type'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos incompletos']);
                exit();
            }

            $itemId = $data['item_id'];
            $itemType = $data['item_type'];
            $quantity = isset($data['quantity']) ? (int)$data['quantity'] : 1;

            // Verificar si el item ya está en el carrito
            $stmt = $pdo->prepare("SELECT * FROM cart_items WHERE user_id = ? AND item_id = ? AND item_type = ?");
            $stmt->execute([$userId, $itemId, $itemType]);
            $existingItem = $stmt->fetch();

            if ($existingItem) {
                // Actualizar cantidad
                $newQuantity = $existingItem['quantity'] + $quantity;
                $stmt = $pdo->prepare("UPDATE cart_items SET quantity = ? WHERE id = ?");
                $stmt->execute([$newQuantity, $existingItem['id']]);
            } else {
                // Insertar nuevo item
                $stmt = $pdo->prepare("INSERT INTO cart_items (user_id, item_id, item_type, quantity) VALUES (?, ?, ?, ?)");
                $stmt->execute([$userId, $itemId, $itemType, $quantity]);
            }

            http_response_code(201);
            echo json_encode(['message' => 'Item añadido al carrito']);
            break;

        case 'PUT':
            // Lógica para actualizar la cantidad de un item
            $data = json_decode(file_get_contents('php://input'), true);
            if (!isset($data['cart_item_id']) || !isset($data['quantity'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos incompletos']);
                exit();
            }

            $cartItemId = $data['cart_item_id'];
            $quantity = (int)$data['quantity'];

            if ($quantity > 0) {
                $stmt = $pdo->prepare("UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?");
                $stmt->execute([$quantity, $cartItemId, $userId]);
            } else {
                // Si la cantidad es 0 o menos, eliminar el item
                $stmt = $pdo->prepare("DELETE FROM cart_items WHERE id = ? AND user_id = ?");
                $stmt->execute([$cartItemId, $userId]);
            }

            echo json_encode(['message' => 'Carrito actualizado']);
            break;

        case 'DELETE':
            // Lógica para eliminar un item
            $data = json_decode(file_get_contents('php://input'), true);
            if (!isset($data['cart_item_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de item no proporcionado']);
                exit();
            }

            $cartItemId = $data['cart_item_id'];

            $stmt = $pdo->prepare("DELETE FROM cart_items WHERE id = ? AND user_id = ?");
            $stmt->execute([$cartItemId, $userId]);

            echo json_encode(['message' => 'Item eliminado del carrito']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>