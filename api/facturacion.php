<?php
/**
 * API DE FACTURACIÓN
 * Genera facturas automáticas y maneja la documentación fiscal
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

class FacturacionAPI {
    private $db;
    private $empresa;
    
    public function __construct() {
        $this->db = new Database();
        $this->empresa = $this->obtenerDatosEmpresa();
    }
    
    public function procesarRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $action = $_GET['action'] ?? '';
        
        try {
            switch ($method) {
                case 'POST':
                    switch ($action) {
                        case 'generar_factura':
                            return $this->generarFactura();
                        case 'enviar_factura':
                            return $this->enviarFactura();
                        default:
                            throw new Exception('Acción no válida');
                    }
                    break;
                    
                case 'GET':
                    switch ($action) {
                        case 'obtener_factura':
                            return $this->obtenerFactura();
                        case 'historial_facturas':
                            return $this->obtenerHistorialFacturas();
                        case 'descargar_factura':
                            return $this->descargarFactura();
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
    
    private function generarFactura() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['orden_id'])) {
            throw new Exception('ID de orden requerido');
        }
        
        $ordenId = $input['orden_id'];
        
        // Obtener orden completa
        $orden = $this->obtenerOrdenCompleta($ordenId);
        if (!$orden) {
            throw new Exception('Orden no encontrada');
        }
        
        // Verificar si ya existe factura
        $facturaExistente = $this->verificarFacturaExistente($ordenId);
        if ($facturaExistente) {
            return $this->responderExito([
                'mensaje' => 'Factura ya existe',
                'factura' => $facturaExistente
            ]);
        }
        
        // Generar número de factura
        $numeroFactura = $this->generarNumeroFactura();
        
        // Crear factura
        $facturaId = $this->crearFactura($orden, $numeroFactura);
        
        // Generar PDF
        $pdfPath = $this->generarPDFFactura($facturaId, $orden);
        
        // Actualizar factura con ruta del PDF
        $this->actualizarRutaPDF($facturaId, $pdfPath);
        
        // Obtener factura completa
        $factura = $this->obtenerFacturaCompleta($facturaId);
        
        return $this->responderExito([
            'mensaje' => 'Factura generada exitosamente',
            'factura' => $factura
        ]);
    }
    
    private function obtenerOrdenCompleta($ordenId) {
        $query = "SELECT 
                    o.*,
                    c.nombre as cliente_nombre,
                    c.email as cliente_email,
                    c.telefono as cliente_telefono,
                    c.direccion as cliente_direccion,
                    s.nombre as servicio_nombre,
                    s.descripcion as servicio_descripcion,
                    s.precio as servicio_precio,
                    cat.nombre as categoria_nombre
                  FROM ordenes_servicios o
                  LEFT JOIN clientes c ON o.cliente_id = c.id
                  LEFT JOIN servicios_catalogo s ON o.servicio_id = s.id
                  LEFT JOIN categorias_servicios cat ON s.categoria_id = cat.id
                  WHERE o.id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([$ordenId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    private function verificarFacturaExistente($ordenId) {
        $query = "SELECT * FROM facturas WHERE orden_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$ordenId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    private function generarNumeroFactura() {
        $prefijo = 'FAC';
        $año = date('Y');
        $mes = date('m');
        
        // Obtener último número del mes
        $query = "SELECT COUNT(*) as total FROM facturas 
                  WHERE YEAR(fecha_emision) = ? AND MONTH(fecha_emision) = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$año, $mes]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $numero = str_pad($resultado['total'] + 1, 4, '0', STR_PAD_LEFT);
        
        return "{$prefijo}-{$año}{$mes}-{$numero}";
    }
    
    private function crearFactura($orden, $numeroFactura) {
        $query = "INSERT INTO facturas (
            numero_factura, orden_id, cliente_id, fecha_emision, 
            fecha_vencimiento, subtotal, impuestos, total, 
            estado, metodo_pago, observaciones
        ) VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 
                  ?, ?, ?, 'emitida', ?, ?)";
        
        $subtotal = $orden['total'];
        $impuestos = $subtotal * 0.19; // IVA 19%
        $total = $subtotal + $impuestos;
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            $numeroFactura,
            $orden['id'],
            $orden['cliente_id'],
            $subtotal,
            $impuestos,
            $total,
            $orden['metodo_pago'] ?? 'efectivo',
            'Factura generada automáticamente'
        ]);
        
        return $this->db->lastInsertId();
    }
    
    private function generarPDFFactura($facturaId, $orden) {
        // Crear directorio si no existe
        $directorio = '../facturas/';
        if (!is_dir($directorio)) {
            mkdir($directorio, 0755, true);
        }
        
        $nombreArchivo = "factura_{$orden['numero_orden']}.pdf";
        $rutaCompleta = $directorio . $nombreArchivo;
        
        // Generar HTML de la factura
        $html = $this->generarHTMLFactura($orden, $facturaId);
        
        // Simular generación de PDF (en producción usar una librería como TCPDF o DomPDF)
        $this->simularGeneracionPDF($html, $rutaCompleta);
        
        return $rutaCompleta;
    }
    
    private function generarHTMLFactura($orden, $facturaId) {
        $numeroFactura = $this->obtenerNumeroFactura($facturaId);
        
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Factura {$numeroFactura}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .empresa { font-size: 24px; font-weight: bold; color: #333; }
                .nit { font-size: 14px; color: #666; }
                .factura-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .cliente-info, .factura-details { width: 45%; }
                .section-title { font-weight: bold; margin-bottom: 10px; color: #333; }
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                .items-table th { background-color: #f5f5f5; }
                .totals { text-align: right; }
                .total-row { font-weight: bold; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class='header'>
                <div class='empresa'>{$this->empresa['nombre']}</div>
                <div class='nit'>NIT: {$this->empresa['nit']}</div>
                <div class='nit'>{$this->empresa['direccion']}</div>
                <div class='nit'>Tel: {$this->empresa['telefono']}</div>
            </div>
            
            <div class='factura-info'>
                <div class='cliente-info'>
                    <div class='section-title'>DATOS DEL CLIENTE</div>
                    <div><strong>Nombre:</strong> {$orden['cliente_nombre']}</div>
                    <div><strong>Email:</strong> {$orden['cliente_email']}</div>
                    <div><strong>Teléfono:</strong> {$orden['cliente_telefono']}</div>
                    <div><strong>Dirección:</strong> {$orden['cliente_direccion']}</div>
                </div>
                
                <div class='factura-details'>
                    <div class='section-title'>DATOS DE LA FACTURA</div>
                    <div><strong>Número:</strong> {$numeroFactura}</div>
                    <div><strong>Orden:</strong> {$orden['numero_orden']}</div>
                    <div><strong>Fecha:</strong> " . date('d/m/Y') . "</div>
                    <div><strong>Vencimiento:</strong> " . date('d/m/Y', strtotime('+30 days')) . "</div>
                </div>
            </div>
            
            <table class='items-table'>
                <thead>
                    <tr>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{$orden['servicio_nombre']}</td>
                        <td>1</td>
                        <td>$" . number_format($orden['servicio_precio'], 0, ',', '.') . "</td>
                        <td>$" . number_format($orden['total'], 0, ',', '.') . "</td>
                    </tr>
                </tbody>
            </table>
            
            <div class='totals'>
                <div>Subtotal: $" . number_format($orden['total'], 0, ',', '.') . "</div>
                <div>IVA (19%): $" . number_format($orden['total'] * 0.19, 0, ',', '.') . "</div>
                <div class='total-row'>TOTAL: $" . number_format($orden['total'] * 1.19, 0, ',', '.') . "</div>
            </div>
            
            <div class='footer'>
                <p>Esta factura fue generada automáticamente por el sistema Computec</p>
                <p>Para consultas contactar: {$this->empresa['email']}</p>
            </div>
        </body>
        </html>";
    }
    
    private function simularGeneracionPDF($html, $ruta) {
        // En producción, usar una librería real como TCPDF o DomPDF
        // Por ahora, guardamos el HTML como simulación
        file_put_contents($ruta, $html);
        error_log("PDF simulado generado en: $ruta");
    }
    
    private function obtenerNumeroFactura($facturaId) {
        $query = "SELECT numero_factura FROM facturas WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$facturaId]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return $resultado['numero_factura'];
    }
    
    private function actualizarRutaPDF($facturaId, $rutaPDF) {
        $query = "UPDATE facturas SET ruta_pdf = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$rutaPDF, $facturaId]);
    }
    
    private function obtenerFacturaCompleta($facturaId) {
        $query = "SELECT f.*, o.numero_orden, c.nombre as cliente_nombre 
                  FROM facturas f
                  LEFT JOIN ordenes_servicios o ON f.orden_id = o.id
                  LEFT JOIN clientes c ON f.cliente_id = c.id
                  WHERE f.id = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([$facturaId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    private function enviarFactura() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['factura_id']) || empty($input['email'])) {
            throw new Exception('ID de factura y email son requeridos');
        }
        
        $facturaId = $input['factura_id'];
        $email = $input['email'];
        
        // Obtener factura
        $factura = $this->obtenerFacturaCompleta($facturaId);
        if (!$factura) {
            throw new Exception('Factura no encontrada');
        }
        
        // Enviar email con factura
        $enviado = $this->enviarEmailFactura($factura, $email);
        
        if ($enviado) {
            // Actualizar estado
            $this->actualizarEstadoFactura($facturaId, 'enviada');
            
            return $this->responderExito([
                'mensaje' => 'Factura enviada exitosamente',
                'email' => $email
            ]);
        } else {
            throw new Exception('Error enviando la factura');
        }
    }
    
    private function enviarEmailFactura($factura, $email) {
        // Simular envío de email
        $asunto = "Factura {$factura['numero_factura']} - Computec";
        $mensaje = "Estimado cliente,\n\n";
        $mensaje .= "Adjunto encontrará la factura {$factura['numero_factura']} por el servicio solicitado.\n\n";
        $mensaje .= "Detalles:\n";
        $mensaje .= "- Número de Orden: {$factura['numero_orden']}\n";
        $mensaje .= "- Total: $" . number_format($factura['total'], 0, ',', '.') . "\n";
        $mensaje .= "- Fecha: " . date('d/m/Y', strtotime($factura['fecha_emision'])) . "\n\n";
        $mensaje .= "Gracias por confiar en Computec.\n\n";
        $mensaje .= "Saludos cordiales,\n";
        $mensaje .= "Equipo Computec";
        
        // Simular envío
        error_log("Email enviado a $email: $asunto");
        return true;
    }
    
    private function actualizarEstadoFactura($facturaId, $estado) {
        $query = "UPDATE facturas SET estado = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$estado, $facturaId]);
    }
    
    private function obtenerFactura() {
        $facturaId = $_GET['id'] ?? null;
        
        if (!$facturaId) {
            throw new Exception('ID de factura requerido');
        }
        
        $factura = $this->obtenerFacturaCompleta($facturaId);
        if (!$factura) {
            throw new Exception('Factura no encontrada');
        }
        
        return $this->responderExito([
            'factura' => $factura
        ]);
    }
    
    private function obtenerHistorialFacturas() {
        $clienteId = $_GET['cliente_id'] ?? null;
        $limite = $_GET['limite'] ?? 50;
        
        $query = "SELECT f.*, o.numero_orden, c.nombre as cliente_nombre 
                  FROM facturas f
                  LEFT JOIN ordenes_servicios o ON f.orden_id = o.id
                  LEFT JOIN clientes c ON f.cliente_id = c.id";
        
        $params = [];
        
        if ($clienteId) {
            $query .= " WHERE f.cliente_id = ?";
            $params[] = $clienteId;
        }
        
        $query .= " ORDER BY f.fecha_emision DESC LIMIT ?";
        $params[] = $limite;
        
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        $facturas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $this->responderExito([
            'facturas' => $facturas
        ]);
    }
    
    private function descargarFactura() {
        $facturaId = $_GET['id'] ?? null;
        
        if (!$facturaId) {
            throw new Exception('ID de factura requerido');
        }
        
        $query = "SELECT ruta_pdf, numero_factura FROM facturas WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$facturaId]);
        $factura = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$factura || !file_exists($factura['ruta_pdf'])) {
            throw new Exception('Archivo de factura no encontrado');
        }
        
        // Enviar archivo
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $factura['numero_factura'] . '.pdf"');
        readfile($factura['ruta_pdf']);
        exit();
    }
    
    private function obtenerDatosEmpresa() {
        return [
            'nombre' => 'Computec S.A.S',
            'nit' => '900123456-7',
            'direccion' => 'Calle 123 #45-67, Bogotá D.C.',
            'telefono' => '+57 (1) 234-5678',
            'email' => 'facturacion@computec.com'
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
$api = new FacturacionAPI();
echo $api->procesarRequest();
?>
