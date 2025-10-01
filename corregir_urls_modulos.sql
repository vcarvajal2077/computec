-- ============================================================================
-- CORREGIR URLs DE MÓDULOS - Sistema Computec
-- Actualiza las URLs para que coincidan con los archivos HTML reales
-- ============================================================================

-- Ver URLs actuales
SELECT '=== URLs ACTUALES (ANTES) ===' as '';
SELECT id_modulo, nombre_modulo, url FROM modulos ORDER BY id_modulo;

-- Corregir URLs (con /Proyecto/ para rutas absolutas)
UPDATE modulos SET url = '/Proyecto/gestion-usuarios.html' WHERE id_modulo = 27;
UPDATE modulos SET url = '/Proyecto/gestion-modulos.html' WHERE id_modulo = 28;
UPDATE modulos SET url = '/Proyecto/gestion-clientes.html' WHERE id_modulo = 29;
UPDATE modulos SET url = '/Proyecto/gestion-productos.html' WHERE id_modulo = 30;
UPDATE modulos SET url = '/Proyecto/gestion-servicios.html' WHERE id_modulo = 31;
UPDATE modulos SET url = '/Proyecto/inventario.html' WHERE id_modulo = 32;
UPDATE modulos SET url = '/Proyecto/proveedores.html' WHERE id_modulo = 33;
UPDATE modulos SET url = '/Proyecto/facturas.html' WHERE id_modulo = 34;
UPDATE modulos SET url = '/Proyecto/reportes.html' WHERE id_modulo = 35;
UPDATE modulos SET url = '/Proyecto/agenda.html' WHERE id_modulo = 36;
UPDATE modulos SET url = '/Proyecto/cotizaciones.html' WHERE id_modulo = 37;
UPDATE modulos SET url = '/Proyecto/tickets.html' WHERE id_modulo = 38;
UPDATE modulos SET url = '/Proyecto/notificaciones.html' WHERE id_modulo = 39;
UPDATE modulos SET url = '/Proyecto/portal-cliente.html' WHERE id_modulo = 40;
UPDATE modulos SET url = '/Proyecto/mi-perfil.html' WHERE id_modulo = 41;

-- Ver URLs corregidas
SELECT '=== URLs CORREGIDAS (DESPUÉS) ===' as '';
SELECT id_modulo, nombre_modulo, url FROM modulos ORDER BY id_modulo;

-- Verificar que todas las URLs terminen en .html
SELECT '=== VERIFICACIÓN ===' as '';
SELECT 
    id_modulo,
    nombre_modulo,
    url,
    CASE 
        WHEN url LIKE '%.html' THEN '✓ Correcto'
        ELSE '✗ Falta .html'
    END as estado
FROM modulos
ORDER BY id_modulo;

SELECT '=== CORRECCIÓN COMPLETADA ✓ ===' as '';
