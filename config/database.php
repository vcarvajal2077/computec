<?php
// Detectar si estamos en localhost o en producción
$isLocalhost = ($_SERVER['SERVER_NAME'] === 'localhost' || $_SERVER['SERVER_ADDR'] === '127.0.0.1');

if ($isLocalhost) {
    // Configuración para LOCALHOST (XAMPP)
    $host = 'localhost';
    $dbname = 'sistema_computec';
    $username = 'root';
    $password_db = '';
} else {
    // Configuración para PRODUCCIÓN (Hosting)
    // IMPORTANTE: Cambia estos valores con los datos de tu hosting
    $host = 'localhost'; // O la IP del servidor MySQL
    $dbname = 'tu_usuario_sistema_computec'; // Nombre de la BD en el hosting
    $username = 'tu_usuario_mysql'; // Usuario MySQL del hosting
    $password_db = 'tu_password_mysql'; // Contraseña MySQL del hosting
}

// Configuración adicional
$charset = 'utf8mb4';
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

/**
 * Función para obtener la conexión a la base de datos
 */
function getDatabaseConnection() {
    global $host, $dbname, $username, $password_db, $charset, $options;
    
    try {
        $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
        $pdo = new PDO($dsn, $username, $password_db, $options);
        return $pdo;
    } catch (PDOException $e) {
        throw new Exception("Error de conexión: " . $e->getMessage());
    }
}

/**
 * Función para obtener conexión mysqli (para compatibilidad)
 */
function getDatabaseConnectionMysqli() {
    global $host, $username, $password_db, $dbname;
    
    try {
        $conn = new mysqli($host, $username, $password_db, $dbname);
        
        if ($conn->connect_error) {
            throw new Exception("Error de conexión: " . $conn->connect_error);
        }
        
        $conn->set_charset("utf8mb4");
        return $conn;
    } catch (Exception $e) {
        throw new Exception("Error de conexión: " . $e->getMessage());
    }
}
?> 