<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

session_start();

// Directorio de uploads
$uploadDir = '../uploads/productos/';

// Crear directorio si no existe
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    if (!isset($_FILES['imagen'])) {
        throw new Exception('No se recibió ninguna imagen');
    }

    $file = $_FILES['imagen'];
    
    // Validar errores de upload
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Error al subir el archivo');
    }

    // Validar tipo de archivo
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $fileType = mime_content_type($file['tmp_name']);
    
    if (!in_array($fileType, $allowedTypes)) {
        throw new Exception('Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)');
    }

    // Validar tamaño (máximo 5MB)
    $maxSize = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $maxSize) {
        throw new Exception('El archivo es demasiado grande. Máximo 5MB');
    }

    // Generar nombre único para el archivo
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $fileName = uniqid('producto_') . '_' . time() . '.' . $extension;
    $filePath = $uploadDir . $fileName;

    // Mover archivo
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        throw new Exception('Error al guardar el archivo');
    }

    // Ruta relativa para guardar en la base de datos
    $relativePath = 'uploads/productos/' . $fileName;

    // Si se proporciona id_producto, actualizar la base de datos
    if (isset($_POST['id_producto']) && !empty($_POST['id_producto'])) {
        $conn = getDatabaseConnectionMysqli();
        $id_producto = intval($_POST['id_producto']);
        
        // Obtener imagen anterior para eliminarla
        $stmt = $conn->prepare("SELECT imagen FROM productos WHERE id_producto = ?");
        $stmt->bind_param('i', $id_producto);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            $oldImage = $row['imagen'];
            // Eliminar imagen anterior si existe
            if ($oldImage && file_exists('../' . $oldImage)) {
                unlink('../' . $oldImage);
            }
        }
        
        // Actualizar producto con nueva imagen
        $stmt = $conn->prepare("UPDATE productos SET imagen = ? WHERE id_producto = ?");
        $stmt->bind_param('si', $relativePath, $id_producto);
        
        if (!$stmt->execute()) {
            throw new Exception('Error al actualizar la base de datos');
        }
        
        $conn->close();
    }

    echo json_encode([
        'success' => true,
        'message' => 'Imagen subida correctamente',
        'imagen' => $relativePath,
        'url' => $relativePath
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
