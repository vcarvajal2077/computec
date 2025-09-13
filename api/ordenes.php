<?php
/**
 * API PARA ÓRDENES DE SERVICIOS
 * Maneja la creación y gestión de órdenes de servicios
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

class OrdenesAPI {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function procesarRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $action = $_GET['action'] ?? '';
        
        try {
            switch ($method) {
                case 'POST':
                    switch ($action) {
                        case 'crear_orden':
                            return $this->crearOrden();
                        case 'confirmar_orden':
                            return $this->confirmarOrden();
                        case 'cancelar_orden':
                            return $this->cancelarOrden();
                        default:
                            throw new Exception('Acción no válida');
                    }
                    break;
                    
                case 'GET':
                    switch ($action) {
                        case 'obtener_orden':
                            return $this->obtenerOrden();
                        case 'listar_ordenes':
                            return $this->listarOrdenes();
                        case 'estados_disponibles':
                            return $this->obtenerEstadosDisponibles();
                        default:
                            throw new Exception('Acción no válida');
                    }
                    break;
                    
                default:
                    throw new Exception('Método no permitido');
            }
        } catch (Exception $e) {
            return $this->responderError($e->getMessage());
        }
    }
    
    private function crearOrden() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validar datos requeridos
        $camposRequeridos = ['cliente_nombre', 'cliente_email', 'cliente_telefono', 'servicios', 'direccion_servicio'];
        foreach ($camposRequeridos as $campo) {
            if (empty($input[$campo])) {
                throw new Exception("El campo $campo es requerido");
            }
        }
        
        // Validar servicios
        if (!is_array($input['servicios']) || empty($input['servicios'])) {
            throw new Exception('Debe seleccionar al menos un servicio');
        }
        
        // Generar número de orden único
        $numeroOrden = $this->generarNumeroOrden();
        
        // Calcular totales
        $subtotal = 0;
        $serviciosDetalle = [];
        
        foreach ($input['servicios'] as $servicio) {
            $servicioData = $this->obtenerServicio($servicio['id']);
            if (!$servicioData) {
                throw new Exception("Servicio ID {$servicio['id']} no encontrado");
            }
            
            $cantidad = $servicio['cantidad'] ?? 1;
            $precio = $servicioData['precio_base'];
            $subtotalItem = $precio * $cantidad;
            
            $serviciosDetalle[] = [
                'servicio_id' => $servicio['id'],
                'cantidad' => $cantidad,
                'precio_unitario' => $precio,
                'subtotal' => $subtotalItem
            ];
            
            $subtotal += $subtotalItem;
        }
        
        // Calcular impuestos (19% IVA)
        $impuestos = $subtotal * 0.19;
        $total = $subtotal + $impuestos;
        
        // Crear orden
        $query = "INSERT INTO ordenes_servicios (
            numero_orden, cliente_id, total, subtotal, impuestos, 
            metodo_pago, estado, notas, direccion_servicio, 
            fecha_agendada, hora_agendada
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($query);
        $resultado = $stmt->execute([
            $numeroOrden,
            null, // cliente_id será null para órdenes sin registro
            $total,
            $subtotal,
            $impuestos,
            $input['metodo_pago'] ?? 'efectivo',
            'pendiente',
            $input['notas'] ?? '',
            $input['direccion_servicio'],
            $input['fecha_agendada'] ?? null,
            $input['hora_agendada'] ?? null
        ]);
        
        if (!$resultado) {
            throw new Exception('Error al crear la orden');
        }
        
        $ordenId = $this->db->lastInsertId();
        
        // Crear detalles de servicios
        foreach ($serviciosDetalle as $detalle) {
            $queryDetalle = "INSERT INTO ordenes_servicios_detalles (
                orden_id, servicio_id, cantidad, precio_unitario, subtotal, notas_adicionales
            ) VALUES (?, ?, ?, ?, ?, ?)";
            
            $stmtDetalle = $this->db->prepare($queryDetalle);
            $stmtDetalle->execute([
                $ordenId,
                $detalle['servicio_id'],
                $detalle['cantidad'],
                $detalle['precio_unitario'],
                $detalle['subtotal'],
                $input['notas_servicio'] ?? ''
            ]);
        }
        
        // Crear registro de cliente temporal si no existe
        $clienteId = $this->crearClienteTemporal($input);
        
        // Actualizar orden con cliente_id
        if ($clienteId) {
            $queryUpdate = "UPDATE ordenes_servicios SET cliente_id = ? WHERE id = ?";
            $stmtUpdate = $this->db->prepare($queryUpdate);
            $stmtUpdate->execute([$clienteId, $ordenId]);
        }
        
        // Obtener orden completa
        $ordenCompleta = $this->obtenerOrdenCompleta($ordenId);
        
        // Enviar notificaciones automáticas
        $this->enviarNotificacionesOrden($ordenCompleta);
        
        return $this->responderExito([
            'mensaje' => 'Orden creada exitosamente',
            'orden' => $ordenCompleta
        ]);
    }
    
    private function obtenerServicio($servicioId) {
        $query = "SELECT * FROM servicios_catalogo WHERE id = ? AND estado = 'disponible'";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$servicioId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    private function generarNumeroOrden() {
        $prefijo = 'ORD';
        $fecha = date('Ymd');
        $numero = str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        return $prefijo . $fecha . $numero;
    }
    
    private function crearClienteTemporal($datosCliente) {
        // Verificar si el cliente ya existe por email
        $query = "SELECT id_cliente FROM clientes WHERE email = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$datosCliente['cliente_email']]);
        $clienteExistente = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($clienteExistente) {
            return $clienteExistente['id_cliente'];
        }
        
        // Crear nuevo cliente temporal
        $query = "INSERT INTO clientes (
            nombre, apellido, email, telefono, direccion, 
            tipo_cliente, activo
        ) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($query);
        $resultado = $stmt->execute([
            $datosCliente['cliente_nombre'],
            $datosCliente['cliente_apellido'] ?? '',
            $datosCliente['cliente_email'],
            $datosCliente['cliente_telefono'],
            $datosCliente['direccion_servicio'],
            'persona',
            1
        ]);
        
        if ($resultado) {
            return $this->db->lastInsertId();
        }
        
        return null;
    }
    
    private function obtenerOrdenCompleta($ordenId) {
        $query = "SELECT 
            o.*,
            c.nombre as cliente_nombre,
            c.apellido as cliente_apellido,
            c.email as cliente_email,
            c.telefono as cliente_telefono
        FROM ordenes_servicios o
        LEFT JOIN clientes c ON o.cliente_id = c.id_cliente
        WHERE o.id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([$ordenId]);
        $orden = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($orden) {
            // Obtener detalles de servicios
            $queryDetalles = "SELECT 
                d.*,
                s.nombre as servicio_nombre,
                s.descripcion as servicio_descripcion,
                s.tiempo_estimado,
                s.garantia,
                cat.nombre as categoria_nombre,
                cat.color as categoria_color
            FROM ordenes_servicios_detalles d
            JOIN servicios_catalogo s ON d.servicio_id = s.id
            JOIN categorias_servicios cat ON s.categoria_id = cat.id
            WHERE d.orden_id = ?";
            
            $stmtDetalles = $this->db->prepare($queryDetalles);
            $stmtDetalles->execute([$ordenId]);
            $orden['servicios'] = $stmtDetalles->fetchAll(PDO::FETCH_ASSOC);
        }
        
        return $orden;
    }
    
    private function confirmarOrden() {
        $input = json_decode(file_get_contents('php://input'), true);
        $ordenId = $input['orden_id'] ?? null;
        
        if (!$ordenId) {
            throw new Exception('ID de orden requerido');
        }
        
        $query = "UPDATE ordenes_servicios SET estado = 'confirmada' WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $resultado = $stmt->execute([$ordenId]);
        
        if (!$resultado) {
            throw new Exception('Error al confirmar la orden');
        }
        
        $ordenCompleta = $this->obtenerOrdenCompleta($ordenId);
        
        return $this->responderExito([
            'mensaje' => 'Orden confirmada exitosamente',
            'orden' => $ordenCompleta
        ]);
    }
    
    private function cancelarOrden() {
        $input = json_decode(file_get_contents('php://input'), true);
        $ordenId = $input['orden_id'] ?? null;
        
        if (!$ordenId) {
            throw new Exception('ID de orden requerido');
        }
        
        $query = "UPDATE ordenes_servicios SET estado = 'cancelada' WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $resultado = $stmt->execute([$ordenId]);
        
        if (!$resultado) {
            throw new Exception('Error al cancelar la orden');
        }
        
        return $this->responderExito([
            'mensaje' => 'Orden cancelada exitosamente'
        ]);
    }
    
    private function obtenerOrden() {
        $ordenId = $_GET['id'] ?? null;
        
        if (!$ordenId) {
            throw new Exception('ID de orden requerido');
        }
        
        $ordenCompleta = $this->obtenerOrdenCompleta($ordenId);
        
        if (!$ordenCompleta) {
            throw new Exception('Orden no encontrada');
        }
        
        return $this->responderExito([
            'orden' => $ordenCompleta
        ]);
    }
    
    private function listarOrdenes() {
        $clienteEmail = $_GET['cliente_email'] ?? null;
        $estado = $_GET['estado'] ?? null;
        $limite = $_GET['limite'] ?? 50;
        
        $query = "SELECT 
            o.*,
            c.nombre as cliente_nombre,
            c.apellido as cliente_apellido,
            c.email as cliente_email
        FROM ordenes_servicios o
        LEFT JOIN clientes c ON o.cliente_id = c.id_cliente
        WHERE 1=1";
        
        $params = [];
        
        if ($clienteEmail) {
            $query .= " AND c.email = ?";
            $params[] = $clienteEmail;
        }
        
        if ($estado) {
            $query .= " AND o.estado = ?";
            $params[] = $estado;
        }
        
        $query .= " ORDER BY o.fecha_orden DESC LIMIT ?";
        $params[] = $limite;
        
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        $ordenes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $this->responderExito([
            'ordenes' => $ordenes
        ]);
    }
    
    private function obtenerEstadosDisponibles() {
        $estados = [
            'pendiente' => 'Pendiente',
            'confirmada' => 'Confirmada',
            'en_proceso' => 'En Proceso',
            'completada' => 'Completada',
            'cancelada' => 'Cancelada'
        ];
        
        return $this->responderExito([
            'estados' => $estados
        ]);
    }
    
    private function responderExito($data) {
        return json_encode([
            'success' => true,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
    
    private function enviarNotificacionesOrden($orden) {
        try {
            // Preparar datos para notificación
            $datosNotificacion = [
                'orden_id' => $orden['id'],
                'tipo_notificacion' => 'confirmacion'
            ];
            
            // Enviar notificación vía API
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'http://localhost/Proyecto/api/notificaciones.php?action=notificacion_orden');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($datosNotificacion));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Content-Length: ' . strlen(json_encode($datosNotificacion))
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode === 200) {
                error_log("Notificaciones enviadas para orden #{$orden['numero_orden']}");
            } else {
                error_log("Error enviando notificaciones para orden #{$orden['numero_orden']}: $response");
            }
            
        } catch (Exception $e) {
            error_log("Error en notificaciones: " . $e->getMessage());
        }
    }
    
    private function responderError($mensaje, $codigo = 400) {
        http_response_code($codigo);
        return json_encode([
            'success' => false,
            'error' => $mensaje,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
}

// Ejecutar API
$api = new OrdenesAPI();
echo $api->procesarRequest();
?>