<?php
// Script de diagnóstico para la API de servicios
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config/database.php';

echo "<h2>Diagnóstico de la API de Servicios</h2>";

try {
    // 1. Probar conexión a la base de datos
    echo "<h3>1. Conexión a la base de datos:</h3>";
    $pdo = getDatabaseConnection();
    echo "✅ Conexión exitosa<br>";
    
    // 2. Verificar si las tablas existen
    echo "<h3>2. Verificar tablas:</h3>";
    $tables = ['categorias_servicios', 'servicios_catalogo'];
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "✅ Tabla '$table' existe<br>";
        } else {
            echo "❌ Tabla '$table' NO existe<br>";
        }
    }
    
    // 3. Verificar estructura de categorias_servicios
    echo "<h3>3. Estructura de categorias_servicios:</h3>";
    try {
        $stmt = $pdo->query("DESCRIBE categorias_servicios");
        $columns = $stmt->fetchAll();
        echo "<table border='1'>";
        echo "<tr><th>Campo</th><th>Tipo</th><th>Null</th><th>Key</th><th>Default</th></tr>";
        foreach ($columns as $column) {
            echo "<tr>";
            echo "<td>" . $column['Field'] . "</td>";
            echo "<td>" . $column['Type'] . "</td>";
            echo "<td>" . $column['Null'] . "</td>";
            echo "<td>" . $column['Key'] . "</td>";
            echo "<td>" . $column['Default'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } catch (Exception $e) {
        echo "❌ Error al obtener estructura: " . $e->getMessage() . "<br>";
    }
    
    // 4. Verificar datos en categorias_servicios
    echo "<h3>4. Datos en categorias_servicios:</h3>";
    try {
        $stmt = $pdo->query("SELECT * FROM categorias_servicios");
        $categorias = $stmt->fetchAll();
        echo "Total de categorías: " . count($categorias) . "<br>";
        if (count($categorias) > 0) {
            echo "<table border='1'>";
            echo "<tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Icono</th><th>Color</th><th>Orden</th><th>Estado</th></tr>";
            foreach ($categorias as $categoria) {
                echo "<tr>";
                echo "<td>" . $categoria['id'] . "</td>";
                echo "<td>" . $categoria['nombre'] . "</td>";
                echo "<td>" . $categoria['descripcion'] . "</td>";
                echo "<td>" . $categoria['icono'] . "</td>";
                echo "<td>" . $categoria['color'] . "</td>";
                echo "<td>" . $categoria['orden'] . "</td>";
                echo "<td>" . $categoria['estado'] . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
    } catch (Exception $e) {
        echo "❌ Error al obtener categorías: " . $e->getMessage() . "<br>";
    }
    
    // 5. Verificar datos en servicios_catalogo
    echo "<h3>5. Datos en servicios_catalogo:</h3>";
    try {
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM servicios_catalogo");
        $result = $stmt->fetch();
        echo "Total de servicios: " . $result['total'] . "<br>";
        
        if ($result['total'] > 0) {
            $stmt = $pdo->query("SELECT id, nombre, categoria_id, estado FROM servicios_catalogo LIMIT 5");
            $servicios = $stmt->fetchAll();
            echo "<table border='1'>";
            echo "<tr><th>ID</th><th>Nombre</th><th>Categoría ID</th><th>Estado</th></tr>";
            foreach ($servicios as $servicio) {
                echo "<tr>";
                echo "<td>" . $servicio['id'] . "</td>";
                echo "<td>" . $servicio['nombre'] . "</td>";
                echo "<td>" . $servicio['categoria_id'] . "</td>";
                echo "<td>" . $servicio['estado'] . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
    } catch (Exception $e) {
        echo "❌ Error al obtener servicios: " . $e->getMessage() . "<br>";
    }
    
    // 6. Probar la consulta de la API
    echo "<h3>6. Probar consulta de la API:</h3>";
    try {
        $stmt = $pdo->prepare("
            SELECT id, nombre, descripcion, icono, color, orden 
            FROM categorias_servicios 
            WHERE estado = 'activo' 
            ORDER BY orden ASC
        ");
        $stmt->execute();
        $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "✅ Consulta exitosa. Categorías encontradas: " . count($categorias) . "<br>";
        
        if (count($categorias) > 0) {
            echo "<pre>" . json_encode($categorias, JSON_PRETTY_PRINT) . "</pre>";
        }
    } catch (Exception $e) {
        echo "❌ Error en la consulta: " . $e->getMessage() . "<br>";
    }
    
} catch (Exception $e) {
    echo "❌ Error general: " . $e->getMessage() . "<br>";
}
?>
