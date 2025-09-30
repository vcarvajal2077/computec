<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Obtener datos del POST
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos']);
    exit();
}

$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email y contraseña son requeridos']);
    exit();
}

try {
    // Incluir configuración de base de datos
    require_once '../config/database.php';
    
    // Crear conexión
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password_db);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Buscar usuario por email
    $stmt = $pdo->prepare("
        SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.password, u.activo, 
               t.nombre_tipo as rol, c.id_cliente
        FROM usuarios u
        JOIN tipo_usuario t ON u.id_tipo_usuario = t.id_tipo_usuario
        LEFT JOIN clientes c ON u.id_usuario = c.id_usuario
        WHERE u.email = ? AND u.activo = 1
    ");
    
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales inválidas']);
        exit();
    }
    
    // Verificar contraseña
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales inválidas']);
        exit();
    }
    
    // Actualizar último acceso
    $updateStmt = $pdo->prepare("UPDATE usuarios SET ultimo_acceso = NOW() WHERE id_usuario = ?");
    $updateStmt->execute([$user['id_usuario']]);

    // Iniciar sesión y guardar datos del usuario
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['user_id'] = $user['id_usuario'];
    $_SESSION['user_name'] = $user['nombre'] . ' ' . $user['apellido'];
    $_SESSION['user_rol'] = $user['rol'];
    
    // Preparar respuesta
    $response = [
        'success' => true,
        'message' => 'Login exitoso',
        'userData' => [
            'id' => $user['id_usuario'],
            'name' => $user['nombre'] . ' ' . $user['apellido'],
            'email' => $user['email'],
            'rol' => $user['rol'],
            'id_cliente' => $user['id_cliente'],
            'loggedIn' => true
        ]
    ];
    
    echo json_encode($response);
    
} catch (PDOException $e) {
    error_log("Error de base de datos: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
} catch (Exception $e) {
    error_log("Error general: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
} 