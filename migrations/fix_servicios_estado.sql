-- Migración para corregir el campo estado en la tabla servicios
-- y agregar campos faltantes

-- Modificar el ENUM del campo estado para incluir los nuevos valores
ALTER TABLE `servicios` 
MODIFY COLUMN `estado` enum('pendiente','en_proceso','completado','cancelado','recibido','esperando_repuestos','terminado','entregado') DEFAULT 'pendiente';

-- Agregar columnas faltantes si no existen
ALTER TABLE `servicios` 
ADD COLUMN IF NOT EXISTS `marca_modelo` varchar(200) DEFAULT NULL AFTER `observaciones`,
ADD COLUMN IF NOT EXISTS `diagnostico` text DEFAULT NULL AFTER `marca_modelo`;

-- Actualizar registros existentes para mapear estados antiguos a nuevos
UPDATE `servicios` SET `estado` = 'pendiente' WHERE `estado` = 'recibido';
UPDATE `servicios` SET `estado` = 'completado' WHERE `estado` IN ('terminado', 'entregado');
