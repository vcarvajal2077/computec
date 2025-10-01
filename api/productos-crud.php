<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

session_start();

$conn = getDatabaseConnectionMysqli();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'listar':
            listarProductos($conn);
            break;
            
        case 'crear':
            crearProducto($conn);
            break;
            
        case 'actualizar':
            actualizarProducto($conn);
            break;
            
        case 'eliminar':
            eliminarProducto($conn);
            break;
            
        case 'obtener':
            obtenerProducto($conn);
            break;
            
        default:
            throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();

// ============================================================================
// FUNCIONES
// ============================================================================

function listarProductos($conn) {
    try {
        // Usar la misma estructura que productos.php: JOIN entre productos e inventario
        $query = "
            SELECT 
                p.id_producto,
                p.nombre,
                p.descripcion,
                p.categoria,
                p.precio_venta as precio,
                p.imagen,
                p.activo,
                IFNULL(i.stock_actual, 0) as stock,
                5 as stock_minimo
            FROM productos p
            LEFT JOIN inventario i ON p.id_producto = i.id_producto
            ORDER BY p.id_producto DESC
        ";
        
        $result = $conn->query($query);
        if (!$result) {
            throw new Exception("Error en query: " . $conn->error);
        }
        
        $productos = [];
    } catch (Exception $e) {
        throw new Exception("Error en listarProductos: " . $e->getMessage());
    }
    
    while ($row = $result->fetch_assoc()) {
        // Agregar campos faltantes con valores por defecto
        if (!isset($row['sku'])) $row['sku'] = 'N/A';
        if (!isset($row['descripcion'])) $row['descripcion'] = '';
        if (!isset($row['categoria'])) $row['categoria'] = 'General';
        if (!isset($row['marca'])) $row['marca'] = '';
        if (!isset($row['modelo'])) $row['modelo'] = '';
        if (!isset($row['stock'])) $row['stock'] = 0;
        if (!isset($row['stock_minimo'])) $row['stock_minimo'] = 0;
        if (!isset($row['garantia'])) $row['garantia'] = 0;
        if (!isset($row['activo'])) $row['activo'] = 1;
        if (!isset($row['fecha_registro'])) $row['fecha_registro'] = date('Y-m-d H:i:s');
        
        $productos[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $productos
    ]);
}

function crearProducto($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validar campos requeridos
    if (empty($input['nombre']) || empty($input['precio'])) {
        throw new Exception('Nombre y precio son requeridos');
    }
    
    // Insertar en tabla productos
    $stmt = $conn->prepare("
        INSERT INTO productos (nombre, descripcion, categoria, precio_venta, activo)
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $nombre = $input['nombre'];
    $descripcion = $input['descripcion'] ?? '';
    $categoria = $input['categoria'] ?? 'General';
    $precio = $input['precio'];
    $activo = $input['activo'] ?? 1;
    
    $stmt->bind_param('sssdi', $nombre, $descripcion, $categoria, $precio, $activo);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al crear producto: ' . $stmt->error);
    }
    
    $id_producto = $conn->insert_id;
    
    // Insertar en tabla inventario si se proporciona stock
    if (isset($input['stock'])) {
        $stmtInv = $conn->prepare("
            INSERT INTO inventario (id_producto, stock_actual)
            VALUES (?, ?)
        ");
        $stock = $input['stock'];
        $stmtInv->bind_param('ii', $id_producto, $stock);
        $stmtInv->execute();
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Producto creado correctamente',
        'id_producto' => $id_producto
    ]);
}

function actualizarProducto($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_producto'])) {
        throw new Exception('ID de producto requerido');
    }
    
    // Actualizar tabla productos
    $campos = [];
    $tipos = '';
    $valores = [];
    
    if (!empty($input['nombre'])) {
        $campos[] = 'nombre = ?';
        $tipos .= 's';
        $valores[] = $input['nombre'];
    }
    
    if (isset($input['descripcion'])) {
        $campos[] = 'descripcion = ?';
        $tipos .= 's';
        $valores[] = $input['descripcion'];
    }
    
    if (isset($input['categoria'])) {
        $campos[] = 'categoria = ?';
        $tipos .= 's';
        $valores[] = $input['categoria'];
    }
    
    if (isset($input['precio'])) {
        $campos[] = 'precio_venta = ?';
        $tipos .= 'd';
        $valores[] = $input['precio'];
    }
    
    if (isset($input['activo'])) {
        $campos[] = 'activo = ?';
        $tipos .= 'i';
        $valores[] = $input['activo'];
    }
    
    if (!empty($campos)) {
        $query = "UPDATE productos SET " . implode(', ', $campos) . " WHERE id_producto = ?";
        $tipos .= 'i';
        $valores[] = $input['id_producto'];
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param($tipos, ...$valores);
        
        if (!$stmt->execute()) {
            throw new Exception('Error al actualizar producto');
        }
    }
    
    // Actualizar stock en tabla inventario
    if (isset($input['stock'])) {
        // Verificar si existe registro en inventario
        $stmtCheck = $conn->prepare("SELECT id_inventario FROM inventario WHERE id_producto = ?");
        $stmtCheck->bind_param('i', $input['id_producto']);
        $stmtCheck->execute();
        $resultCheck = $stmtCheck->get_result();
        
        if ($resultCheck->num_rows > 0) {
            // Actualizar
            $stmtUpd = $conn->prepare("UPDATE inventario SET stock_actual = ? WHERE id_producto = ?");
            $stmtUpd->bind_param('ii', $input['stock'], $input['id_producto']);
            $stmtUpd->execute();
        } else {
            // Insertar
            $stmtIns = $conn->prepare("INSERT INTO inventario (id_producto, stock_actual) VALUES (?, ?)");
            $stmtIns->bind_param('ii', $input['id_producto'], $input['stock']);
            $stmtIns->execute();
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Producto actualizado correctamente'
    ]);
}

function eliminarProducto($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_producto'])) {
        throw new Exception('ID de producto requerido');
    }
    
    $stmt = $conn->prepare("DELETE FROM productos WHERE id_producto = ?");
    $stmt->bind_param('i', $input['id_producto']);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al eliminar producto');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Producto eliminado correctamente'
    ]);
}

function obtenerProducto($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id_producto'])) {
        throw new Exception('ID de producto requerido');
    }
    
    $stmt = $conn->prepare("SELECT * FROM productos WHERE id_producto = ?");
    $stmt->bind_param('i', $input['id_producto']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Producto no encontrado');
    }
    
    $producto = $result->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'data' => $producto
    ]);
}
?>
