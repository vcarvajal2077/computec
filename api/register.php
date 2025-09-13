<?php
/**
 * API para Registro de Usuarios
 * Registra nuevos usuarios en la base de datos
 */

// Configuración de la base de datos
require_once '../config/database.php';

// Obtener conexión PDO
$pdo = getDatabaseConnection();

// Headers para API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Solo permitir método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

try {
    // Obtener datos del POST
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Datos de entrada inválidos');
    }
    
    // Validar campos requeridos
    $required_fields = ['nombre', 'apellido', 'email', 'password', 'id_tipo_usuario'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("El campo '$field' es requerido");
        }
    }
    
    // Validar email
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }
    
    // Validar contraseña
    if (strlen($input['password']) < 6) {
        throw new Exception('La contraseña debe tener al menos 6 caracteres');
    }
    
    // Verificar si el email ya existe
    $stmt = $pdo->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
    $stmt->execute([$input['email']]);
    
    if ($stmt->fetch()) {
        throw new Exception('El email ya está registrado');
    }
    
    // Hash de la contraseña
    $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
    
    // Preparar datos para inserción
    $userData = [
        'nombre' => trim($input['nombre']),
        'apellido' => trim($input['apellido']),
        'email' => trim($input['email']),
        'password' => $hashedPassword,
        'id_tipo_usuario' => (int)$input['id_tipo_usuario'],
        'telefono' => !empty($input['telefono']) ? trim($input['telefono']) : null,
        'fecha_registro' => date('Y-m-d H:i:s'),
        'activo' => 1
    ];
    
    // Insertar usuario
    $sql = "INSERT INTO usuarios (nombre, apellido, email, password, id_tipo_usuario, telefono, fecha_registro, activo) 
            VALUES (:nombre, :apellido, :email, :password, :id_tipo_usuario, :telefono, :fecha_registro, :activo)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($userData);
    
    $userId = $pdo->lastInsertId();
    
    // Si es un cliente, crear también el registro en la tabla clientes
    if ($input['id_tipo_usuario'] == 6) { // 6 = Cliente
        $clientData = [
            'nombre' => $userData['nombre'],
            'apellido' => $userData['apellido'],
            'email' => $userData['email'],
            'telefono' => $userData['telefono'],
            'fecha_registro' => $userData['fecha_registro'],
            'tipo_cliente' => 'persona',
            'id_usuario' => $userId,
            'activo' => 1
        ];
        
        $clientSql = "INSERT INTO clientes (nombre, apellido, email, telefono, fecha_registro, tipo_cliente, id_usuario, activo) 
                      VALUES (:nombre, :apellido, :email, :telefono, :fecha_registro, :tipo_cliente, :id_usuario, :activo)";
        
        $clientStmt = $pdo->prepare($clientSql);
        $clientStmt->execute($clientData);
        
        $clientId = $pdo->lastInsertId();
        
        // Actualizar el usuario con el id_cliente
        $updateSql = "UPDATE usuarios SET id_cliente = ? WHERE id_usuario = ?";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([$clientId, $userId]);
    }
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Usuario registrado exitosamente',
        'userId' => $userId,
        'data' => [
            'nombre' => $userData['nombre'],
            'apellido' => $userData['apellido'],
            'email' => $userData['email'],
            'tipo_usuario' => $input['id_tipo_usuario']
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Error en registro: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} catch (PDOException $e) {
    error_log("Error de base de datos en registro: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error en la base de datos: ' . $e->getMessage()
    ]);
}
?> 