<?php
/**
 * Gestor de Módulos del Sistema Computec
 * Maneja la asignación dinámica de módulos por tipo de usuario
 */

class ModulosManager {
    private $conn;
    
    public function __construct($conn) {
        $this->conn = $conn;
    }
    
    /**
     * Obtiene todos los módulos disponibles
     */
    public function getModulos() {
        $sql = "SELECT * FROM modulos WHERE activo = 1 ORDER BY orden ASC";
        $result = $this->conn->query($sql);
        
        $modulos = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $modulos[] = $row;
            }
        }
        
        return $modulos;
    }
    
    /**
     * Obtiene los módulos asignados a un usuario específico
     */
    public function getModulosUsuario($id_usuario) {
        $sql = "SELECT m.*, am.fecha_asignacion, am.activo as asignacion_activa 
                FROM modulos m 
                INNER JOIN asignacion_modulo am ON m.id_modulo = am.id_modulo 
                WHERE am.id_usuario = ? AND am.activo = 1 AND m.activo = 1 
                ORDER BY m.orden ASC";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id_usuario);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $modulos = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $modulos[] = $row;
            }
        }
        
        return $modulos;
    }
    
    /**
     * Obtiene los módulos por tipo de usuario
     */
    public function getModulosPorTipoUsuario($id_tipo_usuario) {
        $sql = "SELECT DISTINCT m.* 
                FROM modulos m 
                INNER JOIN asignacion_modulo am ON m.id_modulo = am.id_modulo 
                INNER JOIN usuarios u ON am.id_usuario = u.id_usuario 
                WHERE u.id_tipo_usuario = ? AND am.activo = 1 AND m.activo = 1 
                ORDER BY m.orden ASC";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id_tipo_usuario);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $modulos = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $modulos[] = $row;
            }
        }
        
        return $modulos;
    }
    
    /**
     * Asigna un módulo a un usuario
     */
    public function asignarModulo($id_usuario, $id_modulo) {
        // Verificar si ya existe la asignación
        $sql_check = "SELECT id_asignacion FROM asignacion_modulo WHERE id_usuario = ? AND id_modulo = ?";
        $stmt_check = $this->conn->prepare($sql_check);
        $stmt_check->bind_param("ii", $id_usuario, $id_modulo);
        $stmt_check->execute();
        $result_check = $stmt_check->get_result();
        
        if ($result_check->num_rows > 0) {
            // Actualizar asignación existente
            $sql = "UPDATE asignacion_modulo SET activo = 1, fecha_actualizacion = NOW() 
                    WHERE id_usuario = ? AND id_modulo = ?";
        } else {
            // Crear nueva asignación
            $sql = "INSERT INTO asignacion_modulo (id_usuario, id_modulo, fecha_asignacion, activo) 
                    VALUES (?, ?, NOW(), 1)";
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $id_usuario, $id_modulo);
        
        return $stmt->execute();
    }
    
    /**
     * Desasigna un módulo de un usuario
     */
    public function desasignarModulo($id_usuario, $id_modulo) {
        $sql = "UPDATE asignacion_modulo SET activo = 0, fecha_actualizacion = NOW() 
                WHERE id_usuario = ? AND id_modulo = ?";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $id_usuario, $id_modulo);
        
        return $stmt->execute();
    }
    
    /**
     * Asigna módulos por defecto según el tipo de usuario
     */
    public function asignarModulosPorDefecto($id_usuario, $id_tipo_usuario) {
        // Definir módulos por tipo de usuario según la nueva arquitectura de roles
        $modulos_por_tipo = [
            // Rol ID 1: Administrador (Acceso total)
            1 => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],

            // Rol ID 2: Gestor de Tienda (Productos, Servicios, Inventario, Ventas, Facturas)
            2 => [1, 4, 5, 6, 7, 15, 17],

            // Rol ID 3: Editor (Contenido, Soporte, Anuncios, Eventos)
            3 => [1, 16, 17, 21, 22],

            // Rol ID 4: Técnico (Sus servicios, reparaciones, soporte)
            4 => [1, 11, 12, 16, 17],

            // Rol ID 5: Cliente (Su portal, sus productos, soporte)
            5 => [1, 16, 17, 18, 19]
        ];
        
        if (isset($modulos_por_tipo[$id_tipo_usuario])) {
            foreach ($modulos_por_tipo[$id_tipo_usuario] as $id_modulo) {
                $this->asignarModulo($id_usuario, $id_modulo);
            }
            return true;
        }
        
        return false;
    }
    
    /**
     * Verifica si un usuario tiene acceso a un módulo específico
     */
    public function tieneAccesoModulo($id_usuario, $id_modulo) {
        $sql = "SELECT COUNT(*) as count FROM asignacion_modulo 
                WHERE id_usuario = ? AND id_modulo = ? AND activo = 1";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $id_usuario, $id_modulo);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        return $row['count'] > 0;
    }
    
    /**
     * Obtiene estadísticas de módulos
     */
    public function getEstadisticasModulos() {
        $sql = "SELECT 
                    m.nombre_modulo,
                    COUNT(am.id_asignacion) as usuarios_asignados,
                    COUNT(CASE WHEN am.activo = 1 THEN 1 END) as asignaciones_activas
                FROM modulos m 
                LEFT JOIN asignacion_modulo am ON m.id_modulo = am.id_modulo 
                WHERE m.activo = 1 
                GROUP BY m.id_modulo, m.nombre_modulo 
                ORDER BY m.orden ASC";
        
        $result = $this->conn->query($sql);
        
        $estadisticas = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $estadisticas[] = $row;
            }
        }
        
        return $estadisticas;
    }
}

// Función helper para obtener módulos en formato JSON
function getModulosJSON($id_usuario = null, $id_tipo_usuario = null) {
    require_once __DIR__ . '/config/database.php';
    $conn = getDatabaseConnectionMysqli();
    
    $modulosManager = new ModulosManager($conn);
    
    if ($id_usuario) {
        $modulos = $modulosManager->getModulosUsuario($id_usuario);
    } elseif ($id_tipo_usuario) {
        $modulos = $modulosManager->getModulosPorTipoUsuario($id_tipo_usuario);
    } else {
        $modulos = $modulosManager->getModulos();
    }
    
    return json_encode($modulos, JSON_UNESCAPED_UNICODE);
}

// Función helper para verificar acceso
function verificarAccesoModulo($id_usuario, $id_modulo) {
    require_once __DIR__ . '/config/database.php';
    $conn = getDatabaseConnectionMysqli();
    
    $modulosManager = new ModulosManager($conn);
    return $modulosManager->tieneAccesoModulo($id_usuario, $id_modulo);
}

// Función helper para generar menú dinámico
function generarMenuUsuario($id_usuario) {
    require_once __DIR__ . '/config/database.php';
    $conn = getDatabaseConnectionMysqli();
    
    $modulosManager = new ModulosManager($conn);
    $modulos = $modulosManager->getModulosUsuario($id_usuario);
    
    $menu = [];
    foreach ($modulos as $modulo) {
        $menu[] = [
            'id' => $modulo['id_modulo'],
            'nombre' => $modulo['nombre_modulo'],
            'url' => $modulo['url'],
            'icono' => $modulo['icono'],
            'orden' => $modulo['orden']
        ];
    }
    
    return $menu;
}
?> 