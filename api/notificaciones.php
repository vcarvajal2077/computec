<?php
/**
 * API DE NOTIFICACIONES
 * Maneja el envío de notificaciones por email, WhatsApp y SMS
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';

class NotificacionesAPI {
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
                        case 'enviar_email':
                            return $this->enviarEmail();
                        case 'enviar_whatsapp':
                            return $this->enviarWhatsApp();
                        case 'enviar_sms':
                            return $this->enviarSMS();
                        case 'notificacion_orden':
                            return $this->notificarOrden();
                        default:
                            throw new Exception('Acción no válida');
                    }
                    break;
                    
                case 'GET':
                    switch ($action) {
                        case 'historial':
                            return $this->obtenerHistorial();
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
    
    private function enviarEmail() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $camposRequeridos = ['destinatario', 'asunto', 'mensaje'];
        foreach ($camposRequeridos as $campo) {
            if (empty($input[$campo])) {
                throw new Exception("El campo $campo es requerido");
            }
        }
        
        $destinatario = $input['destinatario'];
        $asunto = $input['asunto'];
        $mensaje = $input['mensaje'];
        $tipo = $input['tipo'] ?? 'general';
        
        // Crear template de email
        $html = $this->crearTemplateEmail($asunto, $mensaje, $tipo);
        
        // Configurar headers
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: Computec <noreply@computec.com>',
            'Reply-To: soporte@computec.com',
            'X-Mailer: PHP/' . phpversion()
        ];
        
        // Enviar email
        $enviado = mail($destinatario, $asunto, $html, implode("\r\n", $headers));
        
        if ($enviado) {
            // Registrar en base de datos
            $this->registrarNotificacion([
                'tipo' => 'email',
                'destinatario' => $destinatario,
                'asunto' => $asunto,
                'mensaje' => $mensaje,
                'estado' => 'enviado'
            ]);
            
            return $this->responderExito([
                'mensaje' => 'Email enviado exitosamente',
                'destinatario' => $destinatario
            ]);
        } else {
            throw new Exception('Error al enviar el email');
        }
    }
    
    private function enviarWhatsApp() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['telefono']) || empty($input['mensaje'])) {
            throw new Exception('Teléfono y mensaje son requeridos');
        }
        
        $telefono = $input['telefono'];
        $mensaje = $input['mensaje'];
        
        // Simular envío de WhatsApp (en producción usar API real)
        $enviado = $this->simularEnvioWhatsApp($telefono, $mensaje);
        
        if ($enviado) {
            $this->registrarNotificacion([
                'tipo' => 'whatsapp',
                'destinatario' => $telefono,
                'mensaje' => $mensaje,
                'estado' => 'enviado'
            ]);
            
            return $this->responderExito([
                'mensaje' => 'WhatsApp enviado exitosamente',
                'telefono' => $telefono
            ]);
        } else {
            throw new Exception('Error al enviar WhatsApp');
        }
    }
    
    private function enviarSMS() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['telefono']) || empty($input['mensaje'])) {
            throw new Exception('Teléfono y mensaje son requeridos');
        }
        
        $telefono = $input['telefono'];
        $mensaje = $input['mensaje'];
        
        // Simular envío de SMS (en producción usar API real)
        $enviado = $this->simularEnvioSMS($telefono, $mensaje);
        
        if ($enviado) {
            $this->registrarNotificacion([
                'tipo' => 'sms',
                'destinatario' => $telefono,
                'mensaje' => $mensaje,
                'estado' => 'enviado'
            ]);
            
            return $this->responderExito([
                'mensaje' => 'SMS enviado exitosamente',
                'telefono' => $telefono
            ]);
        } else {
            throw new Exception('Error al enviar SMS');
        }
    }
    
    private function notificarOrden() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['orden_id']) || empty($input['tipo_notificacion'])) {
            throw new Exception('ID de orden y tipo de notificación son requeridos');
        }
        
        $ordenId = $input['orden_id'];
        $tipoNotificacion = $input['tipo_notificacion'];
        
        // Obtener datos de la orden
        $orden = $this->obtenerOrdenCompleta($ordenId);
        if (!$orden) {
            throw new Exception('Orden no encontrada');
        }
        
        // Enviar notificaciones según el tipo
        $notificacionesEnviadas = [];
        
        switch ($tipoNotificacion) {
            case 'confirmacion':
                $notificacionesEnviadas = $this->enviarConfirmacionOrden($orden);
                break;
            case 'recordatorio':
                $notificacionesEnviadas = $this->enviarRecordatorioOrden($orden);
                break;
            case 'cambio_estado':
                $notificacionesEnviadas = $this->enviarCambioEstado($orden);
                break;
            default:
                throw new Exception('Tipo de notificación no válido');
        }
        
        return $this->responderExito([
            'mensaje' => 'Notificaciones enviadas exitosamente',
            'notificaciones' => $notificacionesEnviadas
        ]);
    }
    
    private function enviarConfirmacionOrden($orden) {
        $notificaciones = [];
        
        // Email de confirmación
        $asunto = "Confirmación de Orden #{$orden['numero_orden']} - Computec";
        $mensaje = $this->crearMensajeConfirmacionOrden($orden);
        
        $emailEnviado = $this->enviarEmailDirecto(
            $orden['cliente_email'],
            $asunto,
            $mensaje,
            'confirmacion_orden'
        );
        
        if ($emailEnviado) {
            $notificaciones[] = 'email';
        }
        
        // WhatsApp de confirmación
        $mensajeWhatsApp = $this->crearMensajeWhatsAppConfirmacion($orden);
        $whatsappEnviado = $this->simularEnvioWhatsApp(
            $orden['cliente_telefono'],
            $mensajeWhatsApp
        );
        
        if ($whatsappEnviado) {
            $notificaciones[] = 'whatsapp';
        }
        
        return $notificaciones;
    }
    
    private function enviarRecordatorioOrden($orden) {
        $notificaciones = [];
        
        // Solo enviar si hay fecha agendada
        if ($orden['fecha_agendada']) {
            $asunto = "Recordatorio de Cita - Orden #{$orden['numero_orden']}";
            $mensaje = $this->crearMensajeRecordatorio($orden);
            
            $emailEnviado = $this->enviarEmailDirecto(
                $orden['cliente_email'],
                $asunto,
                $mensaje,
                'recordatorio'
            );
            
            if ($emailEnviado) {
                $notificaciones[] = 'email';
            }
        }
        
        return $notificaciones;
    }
    
    private function enviarCambioEstado($orden) {
        $notificaciones = [];
        
        $asunto = "Actualización de Orden #{$orden['numero_orden']} - Computec";
        $mensaje = $this->crearMensajeCambioEstado($orden);
        
        $emailEnviado = $this->enviarEmailDirecto(
            $orden['cliente_email'],
            $asunto,
            $mensaje,
            'cambio_estado'
        );
        
        if ($emailEnviado) {
            $notificaciones[] = 'email';
        }
        
        return $notificaciones;
    }
    
    private function crearTemplateEmail($asunto, $mensaje, $tipo) {
        $colorPrincipal = '#3b82f6';
        $logo = 'https://via.placeholder.com/200x60/3b82f6/ffffff?text=Computec';
        
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>$asunto</title>
        </head>
        <body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;'>
            <div style='max-width: 600px; margin: 0 auto; background-color: white;'>
                <!-- Header -->
                <div style='background: linear-gradient(135deg, $colorPrincipal 0%, #1d4ed8 100%); padding: 30px; text-align: center;'>
                    <img src='$logo' alt='Computec' style='max-width: 200px; height: auto;'>
                    <h1 style='color: white; margin: 20px 0 0 0; font-size: 24px;'>$asunto</h1>
                </div>
                
                <!-- Content -->
                <div style='padding: 40px 30px;'>
                    <div style='font-size: 16px; line-height: 1.6; color: #374151;'>
                        $mensaje
                    </div>
                </div>
                
                <!-- Footer -->
                <div style='background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;'>
                    <p style='margin: 0 0 10px 0; color: #6b7280; font-size: 14px;'>
                        <strong>Computec</strong> - Soluciones Tecnológicas
                    </p>
                    <p style='margin: 0; color: #9ca3af; font-size: 12px;'>
                        Este es un mensaje automático, por favor no responder a este email.
                    </p>
                </div>
            </div>
        </body>
        </html>";
    }
    
    private function crearMensajeConfirmacionOrden($orden) {
        $fechaFormateada = date('d/m/Y H:i', strtotime($orden['fecha_orden']));
        $totalFormateado = number_format($orden['total'], 0, ',', '.');
        
        $return = "
        <h2>¡Orden Confirmada!</h2>
        <p>Hola <strong>{$orden['cliente_nombre']}</strong>,</p>
        <p>Tu orden ha sido procesada exitosamente. Aquí están los detalles:</p>
        
        <div style='background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>
            <h3>Detalles de la Orden</h3>
            <p><strong>Número de Orden:</strong> {$orden['numero_orden']}</p>
            <p><strong>Fecha:</strong> $fechaFormateada</p>
            <p><strong>Total:</strong> $$totalFormateado</p>
            <p><strong>Estado:</strong> {$orden['estado']}</p>
        </div>
        
        <h3>Servicios Contratados:</h3>
        <ul>";
        
        foreach ($orden['servicios'] as $servicio) {
            $precioFormateado = number_format($servicio['precio_unitario'], 0, ',', '.');
            $return .= "
            <li>
                <strong>{$servicio['servicio_nombre']}</strong><br>
                Cantidad: {$servicio['cantidad']} | Precio: $$precioFormateado
            </li>";
        }
        
        $return .= "
        </ul>
        
        <p>Te contactaremos pronto para coordinar la realización del servicio.</p>
        <p>¡Gracias por confiar en Computec!</p>";
        return $return;
    }
    
    private function crearMensajeWhatsAppConfirmacion($orden) {
        $totalFormateado = number_format($orden['total'], 0, ',', '.');
        
        return "¡Hola! Tu orden #{$orden['numero_orden']} ha sido confirmada. Total: $$totalFormateado. Te contactaremos pronto para coordinar el servicio. ¡Gracias por elegir Computec!";
    }
    
    private function crearMensajeRecordatorio($orden) {
        $fechaFormateada = date('d/m/Y', strtotime($orden['fecha_agendada']));
        $horaFormateada = $orden['hora_agendada'] ? date('H:i', strtotime($orden['hora_agendada'])) : 'Por confirmar';
        
        return "
        <h2>Recordatorio de Cita</h2>
        <p>Hola <strong>{$orden['cliente_nombre']}</strong>,</p>
        <p>Te recordamos que tienes una cita programada:</p>
        
        <div style='background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;'>
            <h3>Detalles de la Cita</h3>
            <p><strong>Orden:</strong> {$orden['numero_orden']}</p>
            <p><strong>Fecha:</strong> $fechaFormateada</p>
            <p><strong>Hora:</strong> $horaFormateada</p>
            <p><strong>Dirección:</strong> {$orden['direccion_servicio']}</p>
        </div>
        
        <p>Si necesitas reprogramar, contáctanos al +57 300 123 4567</p>";
    }
    
    private function crearMensajeCambioEstado($orden) {
        $estadoTexto = $this->obtenerEstadoTexto($orden['estado']);
        
        return "
        <h2>Actualización de Orden</h2>
        <p>Hola <strong>{$orden['cliente_nombre']}</strong>,</p>
        <p>Tu orden ha sido actualizada:</p>
        
        <div style='background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;'>
            <h3>Orden #{$orden['numero_orden']}</h3>
            <p><strong>Nuevo Estado:</strong> $estadoTexto</p>
        </div>
        
        <p>Puedes hacer seguimiento de tu orden en nuestro sitio web.</p>";
    }
    
    private function enviarEmailDirecto($destinatario, $asunto, $mensaje, $tipo) {
        $html = $this->crearTemplateEmail($asunto, $mensaje, $tipo);
        
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: Computec <noreply@computec.com>',
            'Reply-To: soporte@computec.com'
        ];
        
        return mail($destinatario, $asunto, $html, implode("\r\n", $headers));
    }
    
    private function simularEnvioWhatsApp($telefono, $mensaje) {
        // En producción, integrar con API de WhatsApp Business
        error_log("WhatsApp enviado a $telefono: $mensaje");
        return true;
    }
    
    private function simularEnvioSMS($telefono, $mensaje) {
        // En producción, integrar con API de SMS
        error_log("SMS enviado a $telefono: $mensaje");
        return true;
    }
    
    private function registrarNotificacion($datos) {
        $query = "INSERT INTO notificaciones (
            tipo, destinatario, asunto, mensaje, estado, fecha_envio
        ) VALUES (?, ?, ?, ?, ?, NOW())";
        
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            $datos['tipo'],
            $datos['destinatario'],
            $datos['asunto'] ?? null,
            $datos['mensaje'],
            $datos['estado']
        ]);
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
            // Obtener servicios
            $queryServicios = "SELECT 
                d.*,
                s.nombre as servicio_nombre
            FROM ordenes_servicios_detalles d
            JOIN servicios_catalogo s ON d.servicio_id = s.id
            WHERE d.orden_id = ?";
            
            $stmtServicios = $this->db->prepare($queryServicios);
            $stmtServicios->execute([$ordenId]);
            $orden['servicios'] = $stmtServicios->fetchAll(PDO::FETCH_ASSOC);
        }
        
        return $orden;
    }
    
    private function obtenerEstadoTexto($estado) {
        $estados = [
            'pendiente' => 'Pendiente',
            'confirmada' => 'Confirmada',
            'en_proceso' => 'En Proceso',
            'completada' => 'Completada',
            'cancelada' => 'Cancelada'
        ];
        return $estados[$estado] ?? $estado;
    }
    
    private function obtenerHistorial() {
        $limite = $_GET['limite'] ?? 50;
        
        $query = "SELECT * FROM notificaciones 
                 ORDER BY fecha_envio DESC 
                 LIMIT ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([$limite]);
        $notificaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $this->responderExito([
            'notificaciones' => $notificaciones
        ]);
    }
    
    private function obtenerConfiguracion() {
        $configuracion = [
            'email_habilitado' => true,
            'whatsapp_habilitado' => true,
            'sms_habilitado' => false,
            'horarios_envio' => [
                'inicio' => '08:00',
                'fin' => '18:00'
            ]
        ];
        
        return $this->responderExito([
            'configuracion' => $configuracion
        ]);
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
$api = new NotificacionesAPI();
echo $api->procesarRequest();
?>
