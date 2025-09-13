<?php
/**
 * API DE PAGOS AVANZADA
 * Integración con múltiples pasarelas de pago
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

class PagosAPI {
    private $db;
    private $configuracion;
    
    public function __construct() {
        $this->db = getDatabaseConnection();
        $this->configuracion = $this->obtenerConfiguracionPagos();
    }
    
    public function procesarRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $action = $_GET['action'] ?? '';
        
        try {
            switch ($method) {
                case 'POST':
                    switch ($action) {
                        case 'procesar_pago':
                            return $this->procesarPago();
                        case 'crear_intencion_pago':
                            return $this->crearIntencionPago();
                        case 'confirmar_pago':
                            return $this->confirmarPago();
                        case 'reembolsar':
                            return $this->procesarReembolso();
                        default:
                            throw new Exception('Acción no válida');
                    }
                    break;
                    
                case 'GET':
                    switch ($action) {
                        case 'metodos_disponibles':
                            return $this->obtenerMetodosDisponibles();
                        case 'verificar_estado':
                            return $this->verificarEstadoPago();
                        case 'historial':
                            return $this->obtenerHistorialPagos();
                        case 'configuracion':
                            return $this->obtenerConfiguracion();
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
    
    private function procesarPago() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validar datos requeridos
        $camposRequeridos = ['orden_id', 'metodo_pago', 'monto'];
        foreach ($camposRequeridos as $campo) {
            if (empty($input[$campo])) {
                throw new Exception("El campo $campo es requerido");
            }
        }
        
        $ordenId = $input['orden_id'];
        $metodoPago = $input['metodo_pago'];
        $monto = $input['monto'];
        $datosPago = $input['datos_pago'] ?? [];
        
        // Obtener orden
        $orden = $this->obtenerOrden($ordenId);
        if (!$orden) {
            throw new Exception('Orden no encontrada');
        }
        
        // Verificar monto
        if ($monto != $orden['total']) {
            throw new Exception('El monto no coincide con el total de la orden');
        }
        
        // Procesar según método de pago
        switch ($metodoPago) {
            case 'tarjeta':
                return $this->procesarPagoTarjeta($orden, $datosPago);
            case 'paypal':
                return $this->procesarPagoPayPal($orden, $datosPago);
            case 'nequi':
                return $this->procesarPagoNequi($orden, $datosPago);
            case 'daviplata':
                return $this->procesarPagoDaviplata($orden, $datosPago);
            case 'efectivo':
                return $this->procesarPagoEfectivo($orden);
            case 'transferencia':
                return $this->procesarPagoTransferencia($orden, $datosPago);
            default:
                throw new Exception('Método de pago no válido');
        }
    }
    
    private function procesarPagoTarjeta($orden, $datosPago) {
        // Simular integración con Stripe
        $resultado = $this->simularStripe($orden, $datosPago);
        
        if ($resultado['success']) {
            $this->registrarPago($orden['id'], 'tarjeta', $resultado['transaction_id'], $orden['total'], 'aprobado', $resultado);
            $this->actualizarEstadoOrden($orden['id'], 'pagado');
            
            return $this->responderExito([
                'mensaje' => 'Pago procesado exitosamente',
                'transaction_id' => $resultado['transaction_id'],
                'estado' => 'aprobado',
                'metodo' => 'tarjeta'
            ]);
        } else {
            throw new Exception($resultado['error'] ?? 'Error procesando el pago');
        }
    }
    
    private function procesarPagoPayPal($orden, $datosPago) {
        // Simular integración con PayPal
        $resultado = $this->simularPayPal($orden, $datosPago);
        
        if ($resultado['success']) {
            $this->registrarPago($orden['id'], 'paypal', $resultado['transaction_id'], $orden['total'], 'aprobado', $resultado);
            $this->actualizarEstadoOrden($orden['id'], 'pagado');
            
            return $this->responderExito([
                'mensaje' => 'Pago PayPal procesado exitosamente',
                'transaction_id' => $resultado['transaction_id'],
                'estado' => 'aprobado',
                'metodo' => 'paypal'
            ]);
        } else {
            throw new Exception($resultado['error'] ?? 'Error procesando el pago PayPal');
        }
    }
    
    private function procesarPagoNequi($orden, $datosPago) {
        // Simular integración con Nequi
        $resultado = $this->simularNequi($orden, $datosPago);
        
        if ($resultado['success']) {
            $this->registrarPago($orden['id'], 'nequi', $resultado['transaction_id'], $orden['total'], 'aprobado', $resultado);
            $this->actualizarEstadoOrden($orden['id'], 'pagado');
            
            return $this->responderExito([
                'mensaje' => 'Pago Nequi procesado exitosamente',
                'transaction_id' => $resultado['transaction_id'],
                'estado' => 'aprobado',
                'metodo' => 'nequi'
            ]);
        } else {
            throw new Exception($resultado['error'] ?? 'Error procesando el pago Nequi');
        }
    }
    
    private function procesarPagoDaviplata($orden, $datosPago) {
        // Simular integración con Daviplata
        $resultado = $this->simularDaviplata($orden, $datosPago);
        
        if ($resultado['success']) {
            $this->registrarPago($orden['id'], 'daviplata', $resultado['transaction_id'], $orden['total'], 'aprobado', $resultado);
            $this->actualizarEstadoOrden($orden['id'], 'pagado');
            
            return $this->responderExito([
                'mensaje' => 'Pago Daviplata procesado exitosamente',
                'transaction_id' => $resultado['transaction_id'],
                'estado' => 'aprobado',
                'metodo' => 'daviplata'
            ]);
        } else {
            throw new Exception($resultado['error'] ?? 'Error procesando el pago Daviplata');
        }
    }
    
    private function procesarPagoEfectivo($orden) {
        // Pago en efectivo - solo registrar
        $this->registrarPago($orden['id'], 'efectivo', 'EFECTIVO_' . time(), $orden['total'], 'pendiente', []);
        
        return $this->responderExito([
            'mensaje' => 'Pago en efectivo registrado. Se confirmará al momento del servicio.',
            'estado' => 'pendiente',
            'metodo' => 'efectivo'
        ]);
    }
    
    private function procesarPagoTransferencia($orden, $datosPago) {
        // Pago por transferencia - generar datos bancarios
        $datosBancarios = $this->generarDatosBancarios();
        
        $this->registrarPago($orden['id'], 'transferencia', 'TRANSFERENCIA_' . time(), $orden['total'], 'pendiente', $datosBancarios);
        
        return $this->responderExito([
            'mensaje' => 'Datos bancarios generados. Realiza la transferencia y envía el comprobante.',
            'estado' => 'pendiente',
            'metodo' => 'transferencia',
            'datos_bancarios' => $datosBancarios
        ]);
    }
    
    private function simularStripe($orden, $datosPago) {
        // Simular respuesta de Stripe
        $tarjetaValida = $this->validarTarjeta($datosPago['numero_tarjeta'] ?? '');
        
        if ($tarjetaValida) {
            return [
                'success' => true,
                'transaction_id' => 'stripe_' . uniqid(),
                'fecha_procesamiento' => date('Y-m-d H:i:s'),
                'metodo' => 'tarjeta'
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Tarjeta inválida o rechazada'
            ];
        }
    }
    
    private function simularPayPal($orden, $datosPago) {
        // Simular respuesta de PayPal
        $emailValido = filter_var($datosPago['email'] ?? '', FILTER_VALIDATE_EMAIL);
        
        if ($emailValido) {
            return [
                'success' => true,
                'transaction_id' => 'paypal_' . uniqid(),
                'fecha_procesamiento' => date('Y-m-d H:i:s'),
                'metodo' => 'paypal'
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Email de PayPal inválido'
            ];
        }
    }
    
    private function simularNequi($orden, $datosPago) {
        // Simular respuesta de Nequi
        $telefonoValido = preg_match('/^\+?57\d{10}$/', $datosPago['telefono'] ?? '');
        
        if ($telefonoValido) {
            return [
                'success' => true,
                'transaction_id' => 'nequi_' . uniqid(),
                'fecha_procesamiento' => date('Y-m-d H:i:s'),
                'metodo' => 'nequi'
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Número de teléfono inválido'
            ];
        }
    }
    
    private function simularDaviplata($orden, $datosPago) {
        // Simular respuesta de Daviplata
        $telefonoValido = preg_match('/^\+?57\d{10}$/', $datosPago['telefono'] ?? '');
        
        if ($telefonoValido) {
            return [
                'success' => true,
                'transaction_id' => 'daviplata_' . uniqid(),
                'fecha_procesamiento' => date('Y-m-d H:i:s'),
                'metodo' => 'daviplata'
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Número de teléfono inválido'
            ];
        }
    }
    
    private function validarTarjeta($numeroTarjeta) {
        // Validación básica de tarjeta (Luhn algorithm)
        $numero = preg_replace('/\D/', '', $numeroTarjeta);
        
        if (strlen($numero) < 13 || strlen($numero) > 19) {
            return false;
        }
        
        $sum = 0;
        $alternate = false;
        
        for ($i = strlen($numero) - 1; $i >= 0; $i--) {
            $n = intval($numero[$i]);
            
            if ($alternate) {
                $n *= 2;
                if ($n > 9) {
                    $n = ($n % 10) + 1;
                }
            }
            
            $sum += $n;
            $alternate = !$alternate;
        }
        
        return ($sum % 10) === 0;
    }
    
    private function generarDatosBancarios() {
        return [
            'banco' => 'Bancolombia',
            'tipo_cuenta' => 'Ahorros',
            'numero_cuenta' => '1234567890',
            'titular' => 'Computec S.A.S',
            'nit' => '900123456-7',
            'referencia' => 'ORD' . time()
        ];
    }
    
    private function registrarPago($ordenId, $metodo, $referencia, $monto, $estado, $respuesta) {
        $query = "INSERT INTO pagos (
            orden_id, metodo_pago, referencia, monto, estado, 
            fecha_transaccion, respuesta_pasarela
        ) VALUES (?, ?, ?, ?, ?, NOW(), ?)";
        
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            $ordenId,
            $metodo,
            $referencia,
            $monto,
            $estado,
            json_encode($respuesta)
        ]);
    }
    
    private function actualizarEstadoOrden($ordenId, $estado) {
        $query = "UPDATE ordenes_servicios SET estado_pago = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$estado, $ordenId]);
    }
    
    private function obtenerOrden($ordenId) {
        $query = "SELECT * FROM ordenes_servicios WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$ordenId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    private function obtenerMetodosDisponibles() {
        $metodos = [
            [
                'id' => 'tarjeta',
                'nombre' => 'Tarjeta de Crédito/Débito',
                'descripcion' => 'Visa, Mastercard, American Express',
                'icono' => 'fas fa-credit-card',
                'color' => '#3b82f6',
                'habilitado' => true,
                'comision' => '2.9%'
            ],
            [
                'id' => 'paypal',
                'nombre' => 'PayPal',
                'descripcion' => 'Pago seguro con PayPal',
                'icono' => 'fab fa-paypal',
                'color' => '#0070ba',
                'habilitado' => true,
                'comision' => '3.4%'
            ],
            [
                'id' => 'nequi',
                'nombre' => 'Nequi',
                'descripcion' => 'Pago móvil con Nequi',
                'icono' => 'fas fa-mobile-alt',
                'color' => '#00d4aa',
                'habilitado' => true,
                'comision' => '1.5%'
            ],
            [
                'id' => 'daviplata',
                'nombre' => 'Daviplata',
                'descripcion' => 'Pago móvil con Daviplata',
                'icono' => 'fas fa-mobile-alt',
                'color' => '#ff6b35',
                'habilitado' => true,
                'comision' => '1.5%'
            ],
            [
                'id' => 'efectivo',
                'nombre' => 'Efectivo',
                'descripcion' => 'Pago al momento del servicio',
                'icono' => 'fas fa-money-bill-wave',
                'color' => '#10b981',
                'habilitado' => true,
                'comision' => '0%'
            ],
            [
                'id' => 'transferencia',
                'nombre' => 'Transferencia Bancaria',
                'descripcion' => 'Transferencia a cuenta bancaria',
                'icono' => 'fas fa-university',
                'color' => '#8b5cf6',
                'habilitado' => true,
                'comision' => '0%'
            ]
        ];
        
        return $this->responderExito([
            'metodos' => $metodos
        ]);
    }
    
    private function verificarEstadoPago() {
        $pagoId = $_GET['pago_id'] ?? null;
        
        if (!$pagoId) {
            throw new Exception('ID de pago requerido');
        }
        
        $query = "SELECT * FROM pagos WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$pagoId]);
        $pago = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$pago) {
            throw new Exception('Pago no encontrado');
        }
        
        return $this->responderExito([
            'pago' => $pago
        ]);
    }
    
    private function obtenerHistorialPagos() {
        $ordenId = $_GET['orden_id'] ?? null;
        $limite = $_GET['limite'] ?? 50;
        
        $query = "SELECT p.*, o.numero_orden 
                 FROM pagos p 
                 JOIN ordenes_servicios o ON p.orden_id = o.id";
        
        $params = [];
        
        if ($ordenId) {
            $query .= " WHERE p.orden_id = ?";
            $params[] = $ordenId;
        }
        
        $query .= " ORDER BY p.fecha_transaccion DESC LIMIT ?";
        $params[] = $limite;
        
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        $pagos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $this->responderExito([
            'pagos' => $pagos
        ]);
    }
    
    private function procesarReembolso() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['pago_id']) || empty($input['motivo'])) {
            throw new Exception('ID de pago y motivo son requeridos');
        }
        
        $pagoId = $input['pago_id'];
        $motivo = $input['motivo'];
        
        // Obtener pago
        $query = "SELECT * FROM pagos WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$pagoId]);
        $pago = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$pago) {
            throw new Exception('Pago no encontrado');
        }
        
        if ($pago['estado'] !== 'aprobado') {
            throw new Exception('Solo se pueden reembolsar pagos aprobados');
        }
        
        // Simular reembolso
        $reembolsoExitoso = $this->simularReembolso($pago);
        
        if ($reembolsoExitoso) {
            // Actualizar estado del pago
            $queryUpdate = "UPDATE pagos SET estado = 'reembolsado' WHERE id = ?";
            $stmtUpdate = $this->db->prepare($queryUpdate);
            $stmtUpdate->execute([$pagoId]);
            
            return $this->responderExito([
                'mensaje' => 'Reembolso procesado exitosamente',
                'monto_reembolsado' => $pago['monto']
            ]);
        } else {
            throw new Exception('Error procesando el reembolso');
        }
    }
    
    private function simularReembolso($pago) {
        // Simular reembolso exitoso
        error_log("Reembolso simulado para pago {$pago['id']}: {$pago['monto']}");
        return true;
    }
    
    private function obtenerConfiguracion() {
        return $this->responderExito([
            'configuracion' => $this->configuracion
        ]);
    }
    
    private function obtenerConfiguracionPagos() {
        return [
            'stripe' => [
                'habilitado' => true,
                'public_key' => 'pk_test_...',
                'secret_key' => 'sk_test_...'
            ],
            'paypal' => [
                'habilitado' => true,
                'client_id' => 'paypal_client_id',
                'client_secret' => 'paypal_client_secret'
            ],
            'nequi' => [
                'habilitado' => true,
                'api_key' => 'nequi_api_key'
            ],
            'daviplata' => [
                'habilitado' => true,
                'api_key' => 'daviplata_api_key'
            ]
        ];
    }
    
    private function responderExito($data) {
        return json_encode([
            'success' => true,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
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
$api = new PagosAPI();
echo $api->procesarRequest();
?>