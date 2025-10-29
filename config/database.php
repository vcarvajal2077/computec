<?php
// Configuración de la base de datos
$host = 'localhost';
$dbname = 'computec';
$username = 'root';
$password_db = '';

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