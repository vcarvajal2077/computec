-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-09-2025 a las 01:33:30
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_computec`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `GenerarReportePagos` (IN `fecha_inicio` DATE, IN `fecha_fin` DATE, IN `metodo_pago_param` VARCHAR(50))   BEGIN
    SELECT 
        DATE(fecha_transaccion) as fecha,
        metodo_pago,
        COUNT(*) as total_transacciones,
        SUM(monto) as monto_total,
        SUM(CASE WHEN estado = 'aprobado' THEN 1 ELSE 0 END) as pagos_aprobados,
        SUM(CASE WHEN estado = 'aprobado' THEN monto ELSE 0 END) as monto_aprobado
    FROM pagos 
    WHERE DATE(fecha_transaccion) BETWEEN fecha_inicio AND fecha_fin
    AND (metodo_pago_param IS NULL OR metodo_pago = metodo_pago_param)
    GROUP BY DATE(fecha_transaccion), metodo_pago
    ORDER BY fecha DESC, metodo_pago;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `anuncios`
--

CREATE TABLE `anuncios` (
  `id_anuncio` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `url_destino` varchar(255) DEFAULT NULL,
  `tipo_anuncio` enum('promocion','destacado','banner','popup') DEFAULT 'promocion',
  `posicion` enum('hero','sidebar','footer','popup') DEFAULT 'hero',
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `orden` int(11) DEFAULT 0,
  `clicks` int(11) DEFAULT 0,
  `id_usuario_creador` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `anuncios`
--

INSERT INTO `anuncios` (`id_anuncio`, `titulo`, `descripcion`, `imagen`, `url_destino`, `tipo_anuncio`, `posicion`, `fecha_inicio`, `fecha_fin`, `activo`, `orden`, `clicks`, `id_usuario_creador`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'holi', 'mua te amo victor', 'sheily', '#servicios.html', 'promocion', 'hero', '2025-09-10', '2025-09-11', 1, 0, 0, NULL, '2025-09-10 22:17:12', '2025-09-10 22:17:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignaciones_tecnicos`
--

CREATE TABLE `asignaciones_tecnicos` (
  `id` int(11) NOT NULL,
  `orden_id` int(11) NOT NULL,
  `tecnico_id` int(11) NOT NULL,
  `fecha_asignacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('asignado','en_camino','en_servicio','completado') DEFAULT 'asignado',
  `notas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignacion_modulo`
--

CREATE TABLE `asignacion_modulo` (
  `id_asignacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_modulo` int(11) NOT NULL,
  `fecha_asignacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `asignacion_modulo`
--

INSERT INTO `asignacion_modulo` (`id_asignacion`, `id_usuario`, `id_modulo`, `fecha_asignacion`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 12, 1, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(2, 12, 2, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(3, 12, 3, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(4, 12, 4, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(5, 12, 5, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(6, 12, 6, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(7, 12, 7, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(8, 12, 8, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(9, 12, 9, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(10, 12, 10, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(11, 12, 13, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(12, 12, 14, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(13, 12, 15, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(14, 12, 16, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(15, 12, 17, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(16, 12, 20, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(17, 14, 1, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(18, 14, 3, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(19, 14, 4, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(20, 14, 6, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(21, 14, 7, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(22, 14, 15, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(23, 14, 17, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(24, 15, 1, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(25, 15, 3, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(26, 15, 5, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(27, 15, 7, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(28, 15, 11, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(29, 15, 12, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(30, 15, 16, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(31, 15, 17, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(32, 16, 1, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(33, 16, 2, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(34, 16, 3, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(35, 16, 5, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(36, 16, 6, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(37, 16, 7, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(38, 16, 9, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(39, 16, 15, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(40, 16, 17, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(41, 16, 20, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(42, 10, 1, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(43, 10, 3, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(44, 10, 8, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(45, 10, 15, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(46, 10, 16, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(47, 10, 17, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(48, 13, 1, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(49, 13, 11, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(50, 13, 16, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(51, 13, 17, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(52, 13, 18, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(53, 13, 19, '2025-08-16 14:48:20', 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(54, 17, 1, '2025-08-20 20:27:46', 1, '2025-08-20 20:27:46', '2025-08-20 20:27:46'),
(55, 17, 11, '2025-08-20 20:27:46', 1, '2025-08-20 20:27:46', '2025-08-20 20:27:46'),
(56, 17, 16, '2025-08-20 20:27:46', 1, '2025-08-20 20:27:46', '2025-08-20 20:27:46'),
(57, 17, 17, '2025-08-20 20:27:46', 1, '2025-08-20 20:27:46', '2025-08-20 20:27:46'),
(58, 17, 18, '2025-08-20 20:27:46', 1, '2025-08-20 20:27:46', '2025-08-20 20:27:46'),
(59, 17, 19, '2025-08-20 20:27:46', 1, '2025-08-20 20:27:46', '2025-08-20 20:27:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_servicios`
--

CREATE TABLE `categorias_servicios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `icono` varchar(50) DEFAULT 'fas fa-tools',
  `color` varchar(7) DEFAULT '#3b82f6',
  `orden` int(11) DEFAULT 0,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias_servicios`
--

INSERT INTO `categorias_servicios` (`id`, `nombre`, `descripcion`, `icono`, `color`, `orden`, `estado`, `fecha_creacion`) VALUES
(9, 'Mantenimiento', 'Servicios de mantenimiento preventivo y correctivo', 'fas fa-wrench', '#3b82f6', 1, 'activo', '2025-09-10 23:33:12'),
(10, 'Reparación', 'Reparación de equipos y componentes', 'fas fa-tools', '#ef4444', 2, 'activo', '2025-09-10 23:33:12'),
(11, 'Instalación', 'Instalación de software y hardware', 'fas fa-download', '#10b981', 3, 'activo', '2025-09-10 23:33:12'),
(12, 'Consultoría', 'Asesoría técnica especializada', 'fas fa-lightbulb', '#f59e0b', 4, 'activo', '2025-09-10 23:33:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id_cita` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_cita` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `tipo_cita` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('programada','confirmada','en_curso','completada','cancelada','no_asistio') DEFAULT 'programada',
  `recordatorio` tinyint(1) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `documento` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo_cliente` enum('persona','empresa') DEFAULT 'persona',
  `id_usuario` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `apellido`, `documento`, `telefono`, `email`, `direccion`, `fecha_registro`, `tipo_cliente`, `id_usuario`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(13, 'Gersson ', 'Rubio', NULL, NULL, 'gersitomua@gmail.com', NULL, '2025-08-14 20:06:20', 'persona', 13, 1, '2025-08-14 20:06:20', '2025-08-14 20:06:20'),
(14, 'Test', 'Usuario', NULL, NULL, 'test@test.com', NULL, '2025-08-20 20:27:46', 'persona', 17, 1, '2025-08-20 20:27:46', '2025-08-20 20:27:46'),
(15, 'Carlos', 'Ardila', NULL, '32324234234', 'carlitos@gmail.com', NULL, '2025-08-28 03:40:38', 'persona', 18, 1, '2025-08-27 20:40:38', '2025-08-27 20:40:38'),
(16, 'Carlos', 'Ardila', NULL, '3203550004', 'ardilita@gmail.com', NULL, '2025-08-28 03:42:17', 'persona', 19, 1, '2025-08-27 20:42:17', '2025-08-27 20:42:17'),
(17, 'etgsgfsd', 'gfsfgsdf', NULL, '3203550004', 'sfdgsd@gmail.com', NULL, '2025-09-02 02:48:27', 'persona', 20, 1, '2025-09-01 19:48:27', '2025-09-01 19:48:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion_pagos`
--

CREATE TABLE `configuracion_pagos` (
  `id` int(11) NOT NULL,
  `pasarela` varchar(50) NOT NULL,
  `configuracion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`configuracion`)),
  `habilitada` tinyint(1) DEFAULT 1,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `configuracion_pagos`
--

INSERT INTO `configuracion_pagos` (`id`, `pasarela`, `configuracion`, `habilitada`, `fecha_actualizacion`) VALUES
(1, 'stripe', '{\"public_key\": \"pk_test_...\", \"secret_key\": \"sk_test_...\", \"webhook_secret\": \"whsec_...\"}', 1, '2025-09-09 20:33:32'),
(2, 'paypal', '{\"client_id\": \"paypal_client_id\", \"client_secret\": \"paypal_client_secret\", \"sandbox\": true}', 1, '2025-09-09 20:33:32'),
(3, 'nequi', '{\"api_key\": \"nequi_api_key\", \"merchant_id\": \"nequi_merchant\", \"sandbox\": true}', 1, '2025-09-09 20:33:32'),
(4, 'daviplata', '{\"api_key\": \"daviplata_api_key\", \"merchant_id\": \"daviplata_merchant\", \"sandbox\": true}', 1, '2025-09-09 20:33:32');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `id_detalle_venta` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Disparadores `detalle_venta`
--
DELIMITER $$
CREATE TRIGGER `tr_actualizar_inventario_venta` AFTER INSERT ON `detalle_venta` FOR EACH ROW BEGIN
    UPDATE inventario 
    SET stock_actual = stock_actual - NEW.cantidad,
        stock_disponible = stock_disponible - NEW.cantidad
    WHERE id_producto = NEW.id_producto;
    
    -- Registrar movimiento
    INSERT INTO movimientos_inv (id_producto, id_usuario, tipo_movimiento, cantidad, motivo, referencia)
    SELECT NEW.id_producto, v.id_usuario, 'salida', NEW.cantidad, 'Venta', CONCAT('Venta #', NEW.id_venta)
    FROM ventas v WHERE v.id_venta = NEW.id_venta;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadisticas_web`
--

CREATE TABLE `estadisticas_web` (
  `id_estadistica` int(11) NOT NULL,
  `tipo_estadistica` enum('visita_pagina','click_anuncio','uso_descuento','contacto_form','descarga_archivo') NOT NULL,
  `elemento_id` int(11) DEFAULT NULL,
  `elemento_tipo` varchar(50) DEFAULT NULL,
  `ip_visitante` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `referer` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Disparadores `estadisticas_web`
--
DELIMITER $$
CREATE TRIGGER `tr_actualizar_clicks_anuncio` AFTER INSERT ON `estadisticas_web` FOR EACH ROW BEGIN
    IF NEW.tipo_estadistica = 'click_anuncio' AND NEW.elemento_tipo = 'anuncio' THEN
        UPDATE `anuncios` 
        SET `clicks` = `clicks` + 1 
        WHERE `id_anuncio` = NEW.elemento_id;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_actualizar_usos_evento` AFTER INSERT ON `estadisticas_web` FOR EACH ROW BEGIN
    IF NEW.tipo_estadistica = 'uso_descuento' AND NEW.elemento_tipo = 'evento' THEN
        UPDATE `eventos` 
        SET `usos_actuales` = `usos_actuales` + 1 
        WHERE `id_evento` = NEW.elemento_id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id_evento` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo_evento` enum('descuento','promocion','oferta_especial','evento','noticia') DEFAULT 'descuento',
  `categoria` varchar(100) DEFAULT NULL,
  `porcentaje_descuento` decimal(5,2) DEFAULT NULL,
  `precio_original` decimal(10,2) DEFAULT NULL,
  `precio_oferta` decimal(10,2) DEFAULT NULL,
  `codigo_descuento` varchar(50) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `url_destino` varchar(255) DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `limite_usos` int(11) DEFAULT NULL,
  `usos_actuales` int(11) DEFAULT 0,
  `condiciones` text DEFAULT NULL,
  `destacado` tinyint(1) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1,
  `id_usuario_creador` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`id_evento`, `titulo`, `descripcion`, `tipo_evento`, `categoria`, `porcentaje_descuento`, `precio_original`, `precio_oferta`, `codigo_descuento`, `imagen`, `url_destino`, `fecha_inicio`, `fecha_fin`, `limite_usos`, `usos_actuales`, `condiciones`, `destacado`, `activo`, `id_usuario_creador`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Descuento 20% en Reparaciones', 'Lleva tu computadora para reparación y obtén 20% de descuento en el servicio. Válido hasta fin de mes.', 'descuento', 'Reparaciones', 20.00, NULL, NULL, 'REPARA20', NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 100, 0, NULL, 1, 1, 12, '2025-08-20 21:19:33', '2025-08-20 21:19:33'),
(2, 'Oferta Especial: PC Gaming', 'PC Gaming completa con Intel i5, 16GB RAM, GTX 1660 por solo $1.800.000. ¡Aprovecha esta oferta!', 'oferta_especial', 'PCs Gaming', NULL, 2200000.00, 1800000.00, NULL, NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 10, 0, NULL, 1, 1, 12, '2025-08-20 21:19:33', '2025-08-20 21:19:33'),
(3, 'Promoción: Mantenimiento Preventivo', 'Mantenimiento preventivo para tu computadora por solo $50.000. Incluye limpieza y optimización.', 'promocion', 'Mantenimiento', NULL, 80000.00, 50000.00, 'MANTENIMIENTO', NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 50, 0, NULL, 0, 1, 12, '2025-08-20 21:19:33', '2025-08-20 21:19:33'),
(4, 'Descuento 15% en Accesorios', 'Todos los accesorios con 15% de descuento. Teclados, mouse, monitores y más.', 'descuento', 'Accesorios', 15.00, NULL, NULL, 'ACCESORIOS15', NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 200, 0, NULL, 0, 1, 12, '2025-08-20 21:19:33', '2025-08-20 21:19:33'),
(5, 'Evento: Taller de Mantenimiento', 'Taller gratuito de mantenimiento básico de computadoras. Aprende a cuidar tu equipo.', 'evento', 'Educación', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-15 14:00:00', '2024-02-15 16:00:00', 30, 0, NULL, 1, 1, 12, '2025-08-20 21:19:33', '2025-08-20 21:19:33'),
(6, 'Descuento 20%', 'Descuento especial en todos los servicios', 'descuento', 'Servicios', 20.00, NULL, NULL, NULL, NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', NULL, 0, NULL, 1, 1, 12, '2025-08-21 20:57:23', '2025-08-21 20:57:23'),
(7, 'Promoción Gaming', 'Ofertas especiales en equipos gaming', 'promocion', 'Productos', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', NULL, 0, NULL, 1, 1, 12, '2025-08-21 20:57:23', '2025-08-21 20:57:23'),
(8, 'Black Friday Tech', 'Descuentos hasta 40% en todos los servicios', 'descuento', 'Promociones', 40.00, NULL, NULL, NULL, NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', NULL, 0, NULL, 1, 1, 12, '2025-08-21 21:39:30', '2025-08-21 21:39:30'),
(9, 'Evento Gaming', 'Ofertas especiales en equipos gaming', 'oferta_especial', 'Gaming', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', NULL, 0, NULL, 1, 1, 12, '2025-08-21 21:39:30', '2025-08-21 21:39:30'),
(10, 'Nueva Tecnología de Procesadores Intel 2025', 'Intel presenta su nueva generación de procesadores con arquitectura revolucionaria que promete un 40% más de rendimiento y mejor eficiencia energética. Los nuevos chips incluyen tecnologías de IA integrada y soporte para las últimas tecnologías de memoria.', 'noticia', 'Hardware', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-15 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 1, 1, 12, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(11, 'Tendencias en Ciberseguridad para 2025', 'Las nuevas amenazas cibernéticas y las soluciones más avanzadas para proteger tu información personal y empresarial. Incluye análisis de malware, phishing avanzado y protección contra ataques de ransomware.', 'noticia', 'Seguridad', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-12 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 0, 1, 12, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(12, 'Guía Completa: Ensamblar tu PC Gaming', 'Paso a paso para construir la computadora gaming de tus sueños con los mejores componentes del mercado. Incluye selección de componentes, compatibilidad, ensamblaje y configuración inicial del sistema.', 'noticia', 'Tutoriales', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-10 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 1, 1, 12, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(13, 'Windows 12: Todo lo que Necesitas Saber', 'Características, requisitos y fecha de lanzamiento del nuevo sistema operativo de Microsoft. Descubre las nuevas funcionalidades, mejoras de rendimiento y cambios en la interfaz de usuario.', 'noticia', 'Software', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-08 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 0, 1, 12, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(14, 'Mantenimiento Preventivo: Clave para el Rendimiento', 'Cómo mantener tu computadora funcionando al máximo rendimiento con simples tareas de mantenimiento. Incluye limpieza física, optimización de software y actualizaciones recomendadas.', 'noticia', 'Mantenimiento', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-05 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 0, 1, 12, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(15, 'El Futuro de la Inteligencia Artificial en PCs', 'Cómo la IA está transformando la forma en que usamos nuestras computadoras y qué esperar en los próximos años. Incluye aplicaciones prácticas, herramientas de IA y el impacto en la productividad.', 'noticia', 'Tecnología', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-01 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 1, 1, 12, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(16, 'Nuevas Tarjetas Gráficas NVIDIA RTX 5000', 'Análisis completo de las nuevas tarjetas gráficas NVIDIA RTX 5000. Rendimiento, características, precios y comparación con generaciones anteriores para ayudarte a elegir la mejor opción.', 'noticia', 'Hardware', NULL, NULL, NULL, NULL, NULL, NULL, '2024-11-28 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 0, 1, 12, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(17, 'Guía de Optimización para Juegos', 'Técnicas avanzadas para optimizar el rendimiento de tu PC en juegos. Configuración de gráficos, overclocking seguro y herramientas de monitoreo para obtener la mejor experiencia gaming.', 'noticia', 'Gaming', NULL, NULL, NULL, NULL, NULL, NULL, '2024-11-25 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 0, 1, 12, '2025-08-26 22:01:16', '2025-08-26 22:01:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas`
--

CREATE TABLE `facturas` (
  `id` int(11) NOT NULL,
  `numero_factura` varchar(50) NOT NULL,
  `orden_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `fecha_emision` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_vencimiento` time NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `impuestos` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` enum('emitida','enviada','pagada','vencida','cancelada') DEFAULT 'emitida',
  `metodo_pago` varchar(50) DEFAULT NULL,
  `ruta_pdf` varchar(500) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `garantias`
--

CREATE TABLE `garantias` (
  `id_garantia` int(11) NOT NULL,
  `id_servicio` int(11) DEFAULT NULL,
  `id_venta` int(11) DEFAULT NULL,
  `tipo_garantia` varchar(100) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('vigente','vencida','utilizada','cancelada') DEFAULT 'vigente',
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id_inventario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `stock_actual` int(11) NOT NULL DEFAULT 0,
  `stock_disponible` int(11) NOT NULL DEFAULT 0,
  `stock_reservado` int(11) NOT NULL DEFAULT 0,
  `ubicacion` varchar(100) DEFAULT NULL,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `movimiento` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulos`
--

CREATE TABLE `modulos` (
  `id_modulo` int(11) NOT NULL,
  `nombre_modulo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `icono` varchar(50) DEFAULT NULL,
  `orden` int(11) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `modulos`
--

INSERT INTO `modulos` (`id_modulo`, `nombre_modulo`, `descripcion`, `url`, `icono`, `orden`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Dashboard', 'Panel principal del sistema', '/dashboard', 'fas fa-tachometer-alt', 1, 1, '2025-07-17 20:21:36', '2025-08-16 14:48:20'),
(2, 'Usuarios', 'Gestión de usuarios', '/usuarios', 'fas fa-users', 2, 1, '2025-07-17 20:21:36', '2025-08-16 14:48:20'),
(3, 'Clientes', 'Gestión de clientes', '/clientes', 'fas fa-user-group', 3, 1, '2025-07-17 20:21:36', '2025-08-16 14:48:20'),
(4, 'Productos', 'Gestión de productos', '/productos', 'fas fa-box', 4, 1, '2025-07-17 20:21:36', '2025-08-16 14:48:20'),
(5, 'Servicios', 'Gestión de servicios técnicos', '/servicios', 'fas fa-tools', 5, 1, '2025-07-17 20:21:36', '2025-08-16 14:48:20'),
(6, 'Ventas', 'Gestión de ventas', '/ventas', 'fas fa-shopping-cart', 6, 1, '2025-07-17 20:21:36', '2025-08-16 14:48:20'),
(7, 'Inventario', 'Control de inventario', '/inventario', 'fas fa-warehouse', 7, 1, '2025-07-17 20:21:36', '2025-08-16 14:48:20'),
(8, 'Citas', 'Programación de citas', '/citas', 'fas fa-calendar', 8, 1, '2025-07-17 20:21:36', '2025-08-16 14:48:20'),
(9, 'Reportes', 'Generación de reportes', '/reportes', 'fas fa-chart-bar', 9, 1, '2025-07-17 20:21:36', '2025-08-16 14:48:20'),
(10, 'Configuración', 'Configuración del sistema', '/configuracion', 'fas fa-cog', 10, 1, '2025-07-17 20:21:36', '2025-08-16 14:48:20'),
(11, 'Mis Servicios', 'Servicios asignados al técnico', '/mis-servicios', 'fas fa-tools', 11, 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(12, 'Reparaciones', 'Gestión de reparaciones', '/reparaciones', 'fas fa-wrench', 12, 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(13, 'Proveedores', 'Gestión de proveedores', '/proveedores', 'fas fa-truck', 13, 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(14, 'Garantías', 'Gestión de garantías', '/garantias', 'fas fa-shield-alt', 14, 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(15, 'Facturas', 'Gestión de facturas', '/facturas', 'fas fa-file-invoice', 15, 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(16, 'Soporte Técnico', 'Sistema de tickets de soporte', '/soporte-tecnico', 'fas fa-headset', 16, 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(17, 'Mi Perfil', 'Gestión del perfil de usuario', '/perfil', 'fas fa-user-cog', 17, 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(18, 'Mis Productos', 'Productos comprados por el cliente', '/mis-productos', 'fas fa-shopping-bag', 18, 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(19, 'Portal Cliente', 'Portal de acceso para clientes', '/portal-cliente', 'fas fa-user', 19, 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(20, 'Supervisión', 'Panel de supervisión', '/supervision', 'fas fa-eye', 20, 1, '2025-08-16 14:48:20', '2025-08-16 14:48:20'),
(21, 'Anuncios', 'Gestión de anuncios y promociones para el sitio web', '/anuncios', 'fas fa-bullhorn', 21, 1, '2025-08-21 21:30:39', '2025-08-21 21:30:39'),
(22, 'Eventos', 'Gestión de eventos, descuentos y promociones', '/eventos', 'fas fa-calendar-alt', 22, 1, '2025-08-21 21:30:39', '2025-08-26 21:15:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_inv`
--

CREATE TABLE `movimientos_inv` (
  `id_movimiento` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_movimiento` enum('entrada','salida','ajuste','transferencia') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `motivo` varchar(200) DEFAULT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `stock_anterior` int(11) DEFAULT NULL,
  `stock_nuevo` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `tipo` enum('email','whatsapp','sms','push') NOT NULL,
  `destinatario` varchar(255) NOT NULL,
  `asunto` varchar(255) DEFAULT NULL,
  `mensaje` text NOT NULL,
  `estado` enum('pendiente','enviado','fallido') DEFAULT 'pendiente',
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `respuesta_api` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes_servicios`
--

CREATE TABLE `ordenes_servicios` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `numero_orden` varchar(20) NOT NULL,
  `fecha_orden` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('pendiente','confirmada','en_proceso','completada','cancelada') DEFAULT 'pendiente',
  `total` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `impuestos` decimal(10,2) DEFAULT 0.00,
  `descuento` decimal(10,2) DEFAULT 0.00,
  `metodo_pago` enum('efectivo','transferencia','tarjeta','nequi','daviplata') DEFAULT 'efectivo',
  `estado_pago` enum('pendiente','pagado','reembolsado') DEFAULT 'pendiente',
  `fecha_pago` timestamp NULL DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `direccion_servicio` text DEFAULT NULL,
  `fecha_agendada` date DEFAULT NULL,
  `hora_agendada` time DEFAULT NULL,
  `tecnico_asignado` varchar(100) DEFAULT NULL,
  `notificacion_enviada` tinyint(1) DEFAULT 0,
  `fecha_notificacion` timestamp NULL DEFAULT NULL,
  `referencia_pago` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes_servicios_detalles`
--

CREATE TABLE `ordenes_servicios_detalles` (
  `id` int(11) NOT NULL,
  `orden_id` int(11) NOT NULL,
  `servicio_id` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT 1,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `notas_adicionales` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` int(11) NOT NULL,
  `orden_id` int(11) NOT NULL,
  `metodo_pago` varchar(50) NOT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `estado` enum('pendiente','aprobado','rechazado','reembolsado') DEFAULT 'pendiente',
  `fecha_transaccion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `respuesta_pasarela` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`respuesta_pasarela`)),
  `datos_pago` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_pago`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `pagos`
--
DELIMITER $$
CREATE TRIGGER `tr_actualizar_orden_pago` AFTER UPDATE ON `pagos` FOR EACH ROW BEGIN
    IF NEW.estado = 'aprobado' AND OLD.estado != 'aprobado' THEN
        UPDATE ordenes_servicios 
        SET 
            estado_pago = 'pagado',
            metodo_pago = NEW.metodo_pago,
            referencia_pago = NEW.referencia,
            fecha_pago = NEW.fecha_transaccion
        WHERE id = NEW.orden_id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `precio_compra` decimal(10,2) NOT NULL DEFAULT 0.00,
  `precio_venta` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stock_minimo` int(11) DEFAULT 0,
  `fecha_ingreso` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_proveedor` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `codigo_barras` varchar(50) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `categoria`, `precio_compra`, `precio_venta`, `stock_minimo`, `fecha_ingreso`, `id_proveedor`, `activo`, `codigo_barras`, `imagen`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(2, 'Laptop Gaming Pro', 'Laptop de alto rendimiento para gaming', 'Laptops', 1500000.00, 2000000.00, 5, '2025-08-21 20:57:34', NULL, 1, NULL, NULL, '2025-08-21 20:57:34', '2025-08-21 20:57:34'),
(3, 'Mouse Gaming RGB', 'Mouse gaming con iluminación RGB', 'Accesorios', 50000.00, 80000.00, 10, '2025-08-21 20:57:34', NULL, 1, NULL, NULL, '2025-08-21 20:57:34', '2025-08-21 20:57:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `nombre_empresa` varchar(200) NOT NULL,
  `contacto` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reembolsos`
--

CREATE TABLE `reembolsos` (
  `id` int(11) NOT NULL,
  `pago_id` int(11) NOT NULL,
  `monto_reembolsado` decimal(10,2) NOT NULL,
  `motivo` text NOT NULL,
  `estado` enum('solicitado','procesado','completado','rechazado') DEFAULT 'solicitado',
  `fecha_solicitud` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_procesamiento` timestamp NULL DEFAULT NULL,
  `referencia_reembolso` varchar(255) DEFAULT NULL,
  `respuesta_pasarela` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes`
--

CREATE TABLE `reportes` (
  `id_reporte` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_reporte` varchar(100) NOT NULL,
  `fecha_generacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `periodo_inicio` date DEFAULT NULL,
  `periodo_fin` date DEFAULT NULL,
  `parametros` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`parametros`)),
  `archivo` varchar(255) DEFAULT NULL,
  `estado` enum('generando','completado','error') DEFAULT 'generando',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reseñas`
--

CREATE TABLE `reseñas` (
  `id_reseña` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `nombre_cliente` varchar(150) NOT NULL,
  `email_cliente` varchar(150) DEFAULT NULL,
  `calificacion` int(11) NOT NULL CHECK (`calificacion` >= 1 and `calificacion` <= 5),
  `titulo` varchar(200) DEFAULT NULL,
  `comentario` text NOT NULL,
  `tipo_servicio` varchar(100) DEFAULT NULL,
  `imagen_cliente` varchar(255) DEFAULT NULL,
  `verificado` tinyint(1) DEFAULT 0,
  `destacado` tinyint(1) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fecha_rotacion` date DEFAULT curdate(),
  `orden_rotacion` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reseñas`
--

INSERT INTO `reseñas` (`id_reseña`, `id_cliente`, `nombre_cliente`, `email_cliente`, `calificacion`, `titulo`, `comentario`, `tipo_servicio`, `imagen_cliente`, `verificado`, `destacado`, `activo`, `fecha_creacion`, `fecha_actualizacion`, `fecha_rotacion`, `orden_rotacion`) VALUES
(1, 15, 'carlitos', 'carlitoselmasbonito@gmail.com', 4, 'excelencia', 'holi', 'mantenimiento', NULL, 1, 1, 1, '2025-09-06 18:06:44', '2025-09-06 18:06:44', '0000-00-00', 0),
(2, 16, 'gerson', 'gersito@gmail.com', 5, 'perras', 'perras me gusta gerson', 'mantenimiento', NULL, 0, 1, 1, '2025-09-10 22:18:59', '2025-09-10 22:18:59', '0000-00-00', 0);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `reseñas_rotativas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `reseñas_rotativas` (
`id_reseña` int(11)
,`id_cliente` int(11)
,`nombre_cliente` varchar(150)
,`email_cliente` varchar(150)
,`calificacion` int(11)
,`titulo` varchar(200)
,`comentario` text
,`tipo_servicio` varchar(100)
,`imagen_cliente` varchar(255)
,`verificado` tinyint(1)
,`destacado` tinyint(1)
,`activo` tinyint(1)
,`fecha_creacion` timestamp
,`fecha_actualizacion` timestamp
,`fecha_rotacion` date
,`orden_rotacion` int(11)
,`proxima_rotacion` date
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id_servicio` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_servicio` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_ingreso` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_entrega` timestamp NULL DEFAULT NULL,
  `estado` enum('recibido','en_proceso','esperando_repuestos','terminado','entregado','cancelado') DEFAULT 'recibido',
  `costo` decimal(10,2) DEFAULT 0.00,
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id_servicio`, `id_cliente`, `id_usuario`, `tipo_servicio`, `descripcion`, `fecha_ingreso`, `fecha_entrega`, `estado`, `costo`, `observaciones`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 13, 12, 'Reparación de Laptop', 'Servicio completo de reparación y mantenimiento', '2025-08-21 20:57:47', NULL, 'recibido', 0.00, NULL, '2025-08-21 20:57:47', '2025-08-21 20:57:47'),
(2, 14, 12, 'Instalación de Software', 'Instalación y configuración de software especializado', '2025-08-21 20:57:47', NULL, 'recibido', 0.00, NULL, '2025-08-21 20:57:47', '2025-08-21 20:57:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios_catalogo`
--

CREATE TABLE `servicios_catalogo` (
  `id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `descripcion_detallada` longtext DEFAULT NULL,
  `precio_base` decimal(10,2) NOT NULL,
  `tiempo_estimado` varchar(50) DEFAULT '2-4 horas',
  `garantia` varchar(100) DEFAULT '30 días',
  `estado` enum('disponible','no_disponible','agotado') DEFAULT 'disponible',
  `imagen` varchar(255) DEFAULT NULL,
  `caracteristicas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`caracteristicas`)),
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tecnicos`
--

CREATE TABLE `tecnicos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `especialidades` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`especialidades`)),
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `estado` enum('disponible','ocupado','inactivo') DEFAULT 'disponible',
  `calificacion_promedio` decimal(3,2) DEFAULT 0.00,
  `total_servicios` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tecnicos`
--

INSERT INTO `tecnicos` (`id`, `nombre`, `especialidades`, `telefono`, `email`, `estado`, `calificacion_promedio`, `total_servicios`) VALUES
(1, 'Carlos Mendoza', '[\"Mantenimiento\", \"Reparación\", \"Instalación\"]', '3201234567', 'carlos@computec.com', 'disponible', 4.80, 150),
(2, 'Ana Rodríguez', '[\"Reparación\", \"Consultoría\"]', '3202345678', 'ana@computec.com', 'disponible', 4.90, 120),
(3, 'Luis García', '[\"Instalación\", \"Mantenimiento\"]', '3203456789', 'luis@computec.com', 'disponible', 4.70, 95),
(4, 'María López', '[\"Consultoría\", \"Auditoría\"]', '3204567890', 'maria@computec.com', 'disponible', 4.90, 80),
(5, 'Carlos Mendoza', '[\"Mantenimiento\", \"Reparación\", \"Instalación\"]', '3201234567', 'carlos@computec.com', 'disponible', 4.80, 150),
(6, 'Ana Rodríguez', '[\"Reparación\", \"Consultoría\"]', '3202345678', 'ana@computec.com', 'disponible', 4.90, 120),
(7, 'Luis García', '[\"Instalación\", \"Mantenimiento\"]', '3203456789', 'luis@computec.com', 'disponible', 4.70, 95),
(8, 'María López', '[\"Consultoría\", \"Auditoría\"]', '3204567890', 'maria@computec.com', 'disponible', 4.90, 80),
(9, 'Carlos Mendoza', '[\"Mantenimiento\", \"Reparación\", \"Instalación\"]', '3201234567', 'carlos@computec.com', 'disponible', 4.80, 150),
(10, 'Ana Rodríguez', '[\"Reparación\", \"Consultoría\"]', '3202345678', 'ana@computec.com', 'disponible', 4.90, 120),
(11, 'Luis García', '[\"Instalación\", \"Mantenimiento\"]', '3203456789', 'luis@computec.com', 'disponible', 4.70, 95),
(12, 'María López', '[\"Consultoría\", \"Auditoría\"]', '3204567890', 'maria@computec.com', 'disponible', 4.90, 80),
(13, 'Carlos Mendoza', '[\"Mantenimiento\", \"Reparación\", \"Instalación\"]', '3201234567', 'carlos@computec.com', 'disponible', 4.80, 150),
(14, 'Ana Rodríguez', '[\"Reparación\", \"Consultoría\"]', '3202345678', 'ana@computec.com', 'disponible', 4.90, 120),
(15, 'Luis García', '[\"Instalación\", \"Mantenimiento\"]', '3203456789', 'luis@computec.com', 'disponible', 4.70, 95),
(16, 'María López', '[\"Consultoría\", \"Auditoría\"]', '3204567890', 'maria@computec.com', 'disponible', 4.90, 80),
(17, 'Carlos Mendoza', '[\"Mantenimiento\", \"Reparación\", \"Instalación\"]', '3201234567', 'carlos@computec.com', 'disponible', 4.80, 150),
(18, 'Ana Rodríguez', '[\"Reparación\", \"Consultoría\"]', '3202345678', 'ana@computec.com', 'disponible', 4.90, 120),
(19, 'Luis García', '[\"Instalación\", \"Mantenimiento\"]', '3203456789', 'luis@computec.com', 'disponible', 4.70, 95),
(20, 'María López', '[\"Consultoría\", \"Auditoría\"]', '3204567890', 'maria@computec.com', 'disponible', 4.90, 80);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_usuario`
--

CREATE TABLE `tipo_usuario` (
  `id_tipo_usuario` int(11) NOT NULL,
  `nombre_tipo` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `permisos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permisos`)),
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tipo_usuario`
--

INSERT INTO `tipo_usuario` (`id_tipo_usuario`, `nombre_tipo`, `descripcion`, `permisos`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Administrador', 'Acceso completo al sistema', '{\"all\": true}', 1, '2025-07-17 20:21:36', '2025-07-17 20:21:36'),
(2, 'Vendedor', 'Acceso a ventas y clientes', '{\"ventas\": true, \"clientes\": true}', 1, '2025-07-17 20:21:36', '2025-07-17 20:21:36'),
(3, 'Técnico', 'Acceso a servicios y reparaciones', '{\"servicios\": true, \"inventario\": \"read\"}', 1, '2025-07-17 20:21:36', '2025-07-17 20:21:36'),
(4, 'Supervisor', 'Acceso de supervisión', '{\"reportes\": true, \"usuarios\": \"read\"}', 1, '2025-07-17 20:21:36', '2025-07-17 20:21:36'),
(5, 'Asistente Administrativo', 'Acceso a citas y documentos', '{\"citas\": true, \"documentos\": \"read\"}', 1, '2025-07-17 20:21:36', '2025-07-17 20:21:36'),
(6, 'Cliente', 'Acceso a su portal de cliente', '{\"portal_cliente\": true}', 1, '2025-07-17 20:21:36', '2025-07-17 20:21:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transacciones_pago`
--

CREATE TABLE `transacciones_pago` (
  `id` int(11) NOT NULL,
  `pago_id` int(11) NOT NULL,
  `tipo_evento` varchar(50) NOT NULL,
  `datos_evento` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`datos_evento`)),
  `fecha_evento` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_cliente` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1,
  `id_tipo_usuario` int(11) NOT NULL,
  `ultimo_acceso` timestamp NULL DEFAULT NULL,
  `intentos_fallidos` int(11) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `email`, `password`, `telefono`, `fecha_registro`, `activo`, `id_tipo_usuario`, `ultimo_acceso`, `intentos_fallidos`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(10, 'Heiner Camilo', 'Moreno Beltran', 'auxiliar@gmail.com', '$2y$10$8LZ2d6e4lDMoULlUlyRNJevyZqjLw.zCNKLNhkNKu2zjZObHnSuyG', NULL, '2025-07-21 17:34:56', 1, 5, '2025-09-09 21:24:39', 0, '2025-07-21 17:34:56', '2025-09-09 21:24:39'),
(12, 'Maria', 'Rojas', 'admin@gmail.com', '$2y$10$ZNPCrcGamecOF0ipIyVyd.cvbDLcmTk0Uc/HSMgViiXo1StcDZnFq', NULL, '2025-08-12 19:48:49', 1, 1, '2025-09-10 22:26:18', 0, '2025-08-12 19:48:49', '2025-09-10 22:26:18'),
(13, 'Gersson ', 'Rubio', 'cliente@gmail.com', '$2y$10$qktmquGRurCw09/jBNhffuw9b3uoWKtZSC5rxa3fbr.uiBvUMHzQK', NULL, '2025-08-14 20:06:20', 1, 6, '2025-09-01 19:47:39', 0, '2025-08-14 20:06:20', '2025-09-01 19:47:39'),
(14, 'Juan ', 'Prieto', 'vendedor@gmail.com', '$2y$10$ckSFDfgOjuRmW0zewtcJi.hJSL7xXi1fc8kVv4BLKymkBNxnEBHMa', NULL, '2025-08-14 20:39:55', 1, 2, '2025-08-26 19:32:04', 0, '2025-08-14 20:39:55', '2025-08-26 19:32:04'),
(15, 'Victor Josep', 'Carvajal Valencia', 'tecnico@gmail.com', '$2y$10$4aOm3m4GZGH1vtxuEtgxW.ADJTiVXRSK4Lbbkx71TTQ/tCOK2Pz3u', NULL, '2025-08-14 20:41:20', 1, 3, NULL, 0, '2025-08-14 20:41:20', '2025-08-14 20:41:20'),
(16, 'Salome', 'Farfan', 'supervisor@gmail.com', '$2y$10$PJUUB9GmT0i2tCKKu5RxoO03Nwk70/rFiQuwkFrwtugt8/CL/lnZO', NULL, '2025-08-14 20:42:02', 1, 4, '2025-08-21 19:50:04', 0, '2025-08-14 20:42:02', '2025-08-21 19:50:04'),
(17, 'Test', 'Usuario', 'test@test.com', '$2y$10$rKuLJ4yxApYSjWZsuA7mG.5L.ptiybO2232HidyueLLxcfSc1akkS', NULL, '2025-08-20 20:27:46', 1, 6, NULL, 0, '2025-08-20 20:27:46', '2025-08-20 20:27:46'),
(18, 'Carlos', 'Ardila', 'carlitos@gmail.com', '$2y$10$eHD1IVLht/VJ1//FBs0WregEuwoKXMQvx2.m.6C/gfIT3g0QBuvcC', '32324234234', '2025-08-28 03:40:38', 1, 6, '2025-09-01 20:06:10', 0, '2025-08-27 20:40:38', '2025-09-01 20:06:10'),
(19, 'Carlos', 'Ardila', 'ardilita@gmail.com', '$2y$10$88Ylu0rcz01XlOfBavtjcuhaRElQ5l0Zf./8Fm6b8I8PkFeV3ZVjG', '3203550004', '2025-08-28 03:42:17', 1, 6, '2025-09-10 22:25:56', 0, '2025-08-27 20:42:17', '2025-09-10 22:25:56'),
(20, 'etgsgfsd', 'gfsfgsdf', 'sfdgsd@gmail.com', '$2y$10$L0GQxGikMcCh.YLenYcI9edw5JZq4nfxT8pRFA/ue4bEB/4xzXHBe', '3203550004', '2025-09-02 02:48:27', 1, 6, NULL, 0, '2025-09-01 19:48:27', '2025-09-01 19:48:27'),
(21, 'fdcasdfasdf', 'adsfasdfasdf', 'hola@gmail.com', '$2y$10$gi1Ab39Myo5Rdu.9swmXQ.te5CAnJlDS5aniPR7eKhm9Aoz0S.hHy', '320355004', '2025-09-02 03:00:54', 1, 5, NULL, 0, '2025-09-01 20:00:54', '2025-09-01 20:00:54'),
(22, 'Nicole', 'Farfan', 'pendejo@gmail.com', '$2y$10$GyepsmLlqLleOBQdaEyG0uTY0hlTAFoFrOdVygU4GXGMunyxU8zk2', '3219007311', '2025-09-02 03:01:24', 1, 3, NULL, 0, '2025-09-01 20:01:24', '2025-09-01 20:01:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_venta` timestamp NOT NULL DEFAULT current_timestamp(),
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `impuestos` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `metodo_pago` enum('efectivo','tarjeta','transferencia','credito') NOT NULL,
  `estado` enum('pendiente','pagado','cancelado','devuelto') DEFAULT 'pendiente',
  `numero_factura` varchar(50) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_ordenes_completa`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_ordenes_completa` (
`id` int(11)
,`numero_orden` varchar(20)
,`fecha_orden` timestamp
,`estado` enum('pendiente','confirmada','en_proceso','completada','cancelada')
,`total` decimal(10,2)
,`metodo_pago` enum('efectivo','transferencia','tarjeta','nequi','daviplata')
,`estado_pago` enum('pendiente','pagado','reembolsado')
,`cliente_id` int(11)
,`cliente_nombre` varchar(201)
,`cliente_email` varchar(150)
,`cliente_telefono` varchar(20)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_pagos_completos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_pagos_completos` (
`id` int(11)
,`orden_id` int(11)
,`numero_orden` varchar(20)
,`cliente_nombre` varchar(100)
,`cliente_email` varchar(150)
,`servicio_nombre` varchar(200)
,`metodo_pago` varchar(50)
,`referencia` varchar(100)
,`monto` decimal(10,2)
,`estado` enum('pendiente','aprobado','rechazado','reembolsado')
,`fecha_transaccion` timestamp
,`numero_factura` varchar(50)
,`estado_factura` enum('emitida','enviada','pagada','vencida','cancelada')
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_servicios_completa`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_servicios_completa` (
`id` int(11)
,`nombre` varchar(200)
,`descripcion` text
,`descripcion_detallada` longtext
,`precio_base` decimal(10,2)
,`tiempo_estimado` varchar(50)
,`garantia` varchar(100)
,`estado` enum('disponible','no_disponible','agotado')
,`imagen` varchar(255)
,`caracteristicas` longtext
,`categoria_nombre` varchar(100)
,`categoria_icono` varchar(50)
,`categoria_color` varchar(7)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_anuncios_activos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_anuncios_activos` (
`id_anuncio` int(11)
,`titulo` varchar(200)
,`descripcion` text
,`imagen` varchar(255)
,`url_destino` varchar(255)
,`tipo_anuncio` enum('promocion','destacado','banner','popup')
,`posicion` enum('hero','sidebar','footer','popup')
,`fecha_inicio` date
,`fecha_fin` date
,`activo` tinyint(1)
,`orden` int(11)
,`clicks` int(11)
,`id_usuario_creador` int(11)
,`fecha_creacion` timestamp
,`fecha_actualizacion` timestamp
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_estadisticas_resumen`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_estadisticas_resumen` (
`tipo_estadistica` enum('visita_pagina','click_anuncio','uso_descuento','contacto_form','descarga_archivo')
,`total_registros` bigint(21)
,`fecha` date
,`visitantes_unicos` bigint(21)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_eventos_activos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_eventos_activos` (
`id_evento` int(11)
,`titulo` varchar(200)
,`descripcion` text
,`tipo_evento` enum('descuento','promocion','oferta_especial','evento','noticia')
,`categoria` varchar(100)
,`porcentaje_descuento` decimal(5,2)
,`precio_original` decimal(10,2)
,`precio_oferta` decimal(10,2)
,`codigo_descuento` varchar(50)
,`imagen` varchar(255)
,`url_destino` varchar(255)
,`fecha_inicio` datetime
,`fecha_fin` datetime
,`limite_usos` int(11)
,`usos_actuales` int(11)
,`condiciones` text
,`destacado` tinyint(1)
,`activo` tinyint(1)
,`id_usuario_creador` int(11)
,`fecha_creacion` timestamp
,`fecha_actualizacion` timestamp
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_productos_stock_bajo`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_productos_stock_bajo` (
`id_producto` int(11)
,`nombre` varchar(200)
,`categoria` varchar(100)
,`stock_actual` int(11)
,`stock_minimo` int(11)
,`proveedor` varchar(200)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_servicios_carrusel`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_servicios_carrusel` (
`id_servicio` int(11)
,`tipo_servicio` varchar(100)
,`descripcion` text
,`estado` enum('recibido','en_proceso','esperando_repuestos','terminado','entregado','cancelado')
,`costo` decimal(10,2)
,`fecha_ingreso` timestamp
,`fecha_entrega` timestamp
,`observaciones` text
,`cliente_nombre` varchar(201)
,`tecnico_nombre` varchar(201)
,`tecnico_id` int(11)
,`cliente_id` int(11)
,`icono_servicio` varchar(15)
,`color_estado` varchar(7)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_servicios_pendientes`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_servicios_pendientes` (
`id_servicio` int(11)
,`cliente` varchar(201)
,`tipo_servicio` varchar(100)
,`descripcion` text
,`fecha_ingreso` timestamp
,`estado` enum('recibido','en_proceso','esperando_repuestos','terminado','entregado','cancelado')
,`tecnico` varchar(201)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_slider_content`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_slider_content` (
`tipo_contenido` varchar(7)
,`id` int(11)
,`titulo` varchar(200)
,`descripcion` text
,`imagen` varchar(255)
,`url_destino` varchar(255)
,`fecha_creacion` timestamp
,`fecha_fin` date
,`activo` tinyint(1)
,`orden` int(11)
,`categoria` enum('promocion','destacado','banner','popup')
,`porcentaje_descuento` binary(0)
,`precio_original` binary(0)
,`precio_oferta` binary(0)
,`codigo_descuento` binary(0)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_ventas_hoy`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_ventas_hoy` (
`id_venta` int(11)
,`numero_factura` varchar(50)
,`cliente` varchar(201)
,`vendedor` varchar(201)
,`total` decimal(10,2)
,`metodo_pago` enum('efectivo','tarjeta','transferencia','credito')
,`estado` enum('pendiente','pagado','cancelado','devuelto')
,`fecha_venta` timestamp
);

-- --------------------------------------------------------

--
-- Estructura para la vista `reseñas_rotativas`
--
DROP TABLE IF EXISTS `reseñas_rotativas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `reseñas_rotativas`  AS SELECT `r`.`id_reseña` AS `id_reseña`, `r`.`id_cliente` AS `id_cliente`, `r`.`nombre_cliente` AS `nombre_cliente`, `r`.`email_cliente` AS `email_cliente`, `r`.`calificacion` AS `calificacion`, `r`.`titulo` AS `titulo`, `r`.`comentario` AS `comentario`, `r`.`tipo_servicio` AS `tipo_servicio`, `r`.`imagen_cliente` AS `imagen_cliente`, `r`.`verificado` AS `verificado`, `r`.`destacado` AS `destacado`, `r`.`activo` AS `activo`, `r`.`fecha_creacion` AS `fecha_creacion`, `r`.`fecha_actualizacion` AS `fecha_actualizacion`, `r`.`fecha_rotacion` AS `fecha_rotacion`, `r`.`orden_rotacion` AS `orden_rotacion`, CASE WHEN `r`.`fecha_rotacion` < curdate() - interval 5 day THEN `r`.`fecha_rotacion`+ interval 5 day ELSE `r`.`fecha_rotacion` END AS `proxima_rotacion` FROM `reseñas` AS `r` WHERE `r`.`calificacion` >= 4 ORDER BY `r`.`destacado` DESC, `r`.`fecha_rotacion` ASC LIMIT 0, 10 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_ordenes_completa`
--
DROP TABLE IF EXISTS `vista_ordenes_completa`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_ordenes_completa`  AS SELECT `o`.`id` AS `id`, `o`.`numero_orden` AS `numero_orden`, `o`.`fecha_orden` AS `fecha_orden`, `o`.`estado` AS `estado`, `o`.`total` AS `total`, `o`.`metodo_pago` AS `metodo_pago`, `o`.`estado_pago` AS `estado_pago`, `o`.`cliente_id` AS `cliente_id`, concat(`c`.`nombre`,' ',`c`.`apellido`) AS `cliente_nombre`, `c`.`email` AS `cliente_email`, `c`.`telefono` AS `cliente_telefono` FROM (`ordenes_servicios` `o` join `clientes` `c` on(`o`.`cliente_id` = `c`.`id_cliente`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_pagos_completos`
--
DROP TABLE IF EXISTS `vista_pagos_completos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_pagos_completos`  AS SELECT `p`.`id` AS `id`, `p`.`orden_id` AS `orden_id`, `o`.`numero_orden` AS `numero_orden`, `c`.`nombre` AS `cliente_nombre`, `c`.`email` AS `cliente_email`, `s`.`nombre` AS `servicio_nombre`, `p`.`metodo_pago` AS `metodo_pago`, `p`.`referencia` AS `referencia`, `p`.`monto` AS `monto`, `p`.`estado` AS `estado`, `p`.`fecha_transaccion` AS `fecha_transaccion`, `f`.`numero_factura` AS `numero_factura`, `f`.`estado` AS `estado_factura` FROM (((((`pagos` `p` left join `ordenes_servicios` `o` on(`p`.`orden_id` = `o`.`id`)) left join `clientes` `c` on(`o`.`cliente_id` = `c`.`id_cliente`)) left join `ordenes_servicios_detalles` `d` on(`o`.`id` = `d`.`orden_id`)) left join `servicios_catalogo` `s` on(`d`.`servicio_id` = `s`.`id`)) left join `facturas` `f` on(`p`.`orden_id` = `f`.`orden_id`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_servicios_completa`
--
DROP TABLE IF EXISTS `vista_servicios_completa`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_servicios_completa`  AS SELECT `s`.`id` AS `id`, `s`.`nombre` AS `nombre`, `s`.`descripcion` AS `descripcion`, `s`.`descripcion_detallada` AS `descripcion_detallada`, `s`.`precio_base` AS `precio_base`, `s`.`tiempo_estimado` AS `tiempo_estimado`, `s`.`garantia` AS `garantia`, `s`.`estado` AS `estado`, `s`.`imagen` AS `imagen`, `s`.`caracteristicas` AS `caracteristicas`, `c`.`nombre` AS `categoria_nombre`, `c`.`icono` AS `categoria_icono`, `c`.`color` AS `categoria_color` FROM (`servicios_catalogo` `s` join `categorias_servicios` `c` on(`s`.`categoria_id` = `c`.`id`)) WHERE `s`.`estado` = 'disponible' AND `c`.`estado` = 'activo' ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_anuncios_activos`
--
DROP TABLE IF EXISTS `v_anuncios_activos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_anuncios_activos`  AS SELECT `anuncios`.`id_anuncio` AS `id_anuncio`, `anuncios`.`titulo` AS `titulo`, `anuncios`.`descripcion` AS `descripcion`, `anuncios`.`imagen` AS `imagen`, `anuncios`.`url_destino` AS `url_destino`, `anuncios`.`tipo_anuncio` AS `tipo_anuncio`, `anuncios`.`posicion` AS `posicion`, `anuncios`.`fecha_inicio` AS `fecha_inicio`, `anuncios`.`fecha_fin` AS `fecha_fin`, `anuncios`.`activo` AS `activo`, `anuncios`.`orden` AS `orden`, `anuncios`.`clicks` AS `clicks`, `anuncios`.`id_usuario_creador` AS `id_usuario_creador`, `anuncios`.`fecha_creacion` AS `fecha_creacion`, `anuncios`.`fecha_actualizacion` AS `fecha_actualizacion` FROM `anuncios` WHERE `anuncios`.`activo` = 1 AND `anuncios`.`fecha_inicio` <= curdate() AND (`anuncios`.`fecha_fin` is null OR `anuncios`.`fecha_fin` >= curdate()) ORDER BY `anuncios`.`orden` ASC, `anuncios`.`fecha_creacion` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_estadisticas_resumen`
--
DROP TABLE IF EXISTS `v_estadisticas_resumen`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_estadisticas_resumen`  AS SELECT `estadisticas_web`.`tipo_estadistica` AS `tipo_estadistica`, count(0) AS `total_registros`, cast(`estadisticas_web`.`fecha_registro` as date) AS `fecha`, count(distinct `estadisticas_web`.`ip_visitante`) AS `visitantes_unicos` FROM `estadisticas_web` WHERE `estadisticas_web`.`fecha_registro` >= current_timestamp() - interval 30 day GROUP BY `estadisticas_web`.`tipo_estadistica`, cast(`estadisticas_web`.`fecha_registro` as date) ORDER BY cast(`estadisticas_web`.`fecha_registro` as date) DESC, count(0) DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_eventos_activos`
--
DROP TABLE IF EXISTS `v_eventos_activos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_eventos_activos`  AS SELECT `eventos`.`id_evento` AS `id_evento`, `eventos`.`titulo` AS `titulo`, `eventos`.`descripcion` AS `descripcion`, `eventos`.`tipo_evento` AS `tipo_evento`, `eventos`.`categoria` AS `categoria`, `eventos`.`porcentaje_descuento` AS `porcentaje_descuento`, `eventos`.`precio_original` AS `precio_original`, `eventos`.`precio_oferta` AS `precio_oferta`, `eventos`.`codigo_descuento` AS `codigo_descuento`, `eventos`.`imagen` AS `imagen`, `eventos`.`url_destino` AS `url_destino`, `eventos`.`fecha_inicio` AS `fecha_inicio`, `eventos`.`fecha_fin` AS `fecha_fin`, `eventos`.`limite_usos` AS `limite_usos`, `eventos`.`usos_actuales` AS `usos_actuales`, `eventos`.`condiciones` AS `condiciones`, `eventos`.`destacado` AS `destacado`, `eventos`.`activo` AS `activo`, `eventos`.`id_usuario_creador` AS `id_usuario_creador`, `eventos`.`fecha_creacion` AS `fecha_creacion`, `eventos`.`fecha_actualizacion` AS `fecha_actualizacion` FROM `eventos` WHERE `eventos`.`activo` = 1 AND `eventos`.`fecha_inicio` <= current_timestamp() AND (`eventos`.`fecha_fin` is null OR `eventos`.`fecha_fin` >= current_timestamp()) ORDER BY `eventos`.`destacado` DESC, `eventos`.`fecha_inicio` ASC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_productos_stock_bajo`
--
DROP TABLE IF EXISTS `v_productos_stock_bajo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_productos_stock_bajo`  AS SELECT `p`.`id_producto` AS `id_producto`, `p`.`nombre` AS `nombre`, `p`.`categoria` AS `categoria`, `i`.`stock_actual` AS `stock_actual`, `p`.`stock_minimo` AS `stock_minimo`, `pr`.`nombre_empresa` AS `proveedor` FROM ((`productos` `p` left join `inventario` `i` on(`p`.`id_producto` = `i`.`id_producto`)) left join `proveedores` `pr` on(`p`.`id_proveedor` = `pr`.`id_proveedor`)) WHERE `i`.`stock_actual` <= `p`.`stock_minimo` AND `p`.`activo` = 1 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_servicios_carrusel`
--
DROP TABLE IF EXISTS `v_servicios_carrusel`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_servicios_carrusel`  AS SELECT `s`.`id_servicio` AS `id_servicio`, `s`.`tipo_servicio` AS `tipo_servicio`, `s`.`descripcion` AS `descripcion`, `s`.`estado` AS `estado`, `s`.`costo` AS `costo`, `s`.`fecha_ingreso` AS `fecha_ingreso`, `s`.`fecha_entrega` AS `fecha_entrega`, `s`.`observaciones` AS `observaciones`, concat(`c`.`nombre`,' ',`c`.`apellido`) AS `cliente_nombre`, concat(`u`.`nombre`,' ',`u`.`apellido`) AS `tecnico_nombre`, `u`.`id_usuario` AS `tecnico_id`, `c`.`id_cliente` AS `cliente_id`, CASE WHEN `s`.`tipo_servicio` like '%reparación%' OR `s`.`tipo_servicio` like '%reparacion%' THEN 'fas fa-wrench' WHEN `s`.`tipo_servicio` like '%mantenimiento%' THEN 'fas fa-tools' WHEN `s`.`tipo_servicio` like '%instalación%' OR `s`.`tipo_servicio` like '%instalacion%' THEN 'fas fa-download' WHEN `s`.`tipo_servicio` like '%ensamblaje%' THEN 'fas fa-desktop' WHEN `s`.`tipo_servicio` like '%limpieza%' THEN 'fas fa-broom' WHEN `s`.`tipo_servicio` like '%actualización%' OR `s`.`tipo_servicio` like '%actualizacion%' THEN 'fas fa-sync-alt' ELSE 'fas fa-cog' END AS `icono_servicio`, CASE WHEN `s`.`estado` = 'recibido' THEN '#ffc107' WHEN `s`.`estado` = 'en_proceso' THEN '#17a2b8' WHEN `s`.`estado` = 'esperando_repuestos' THEN '#fd7e14' WHEN `s`.`estado` = 'terminado' THEN '#28a745' WHEN `s`.`estado` = 'entregado' THEN '#6c757d' WHEN `s`.`estado` = 'cancelado' THEN '#dc3545' ELSE '#6c757d' END AS `color_estado` FROM ((`servicios` `s` join `clientes` `c` on(`s`.`id_cliente` = `c`.`id_cliente`)) join `usuarios` `u` on(`s`.`id_usuario` = `u`.`id_usuario`)) WHERE `s`.`estado` in ('recibido','en_proceso','terminado','entregado') AND `c`.`activo` = 1 AND `u`.`activo` = 1 ORDER BY `s`.`fecha_ingreso` DESC LIMIT 0, 20 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_servicios_pendientes`
--
DROP TABLE IF EXISTS `v_servicios_pendientes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_servicios_pendientes`  AS SELECT `s`.`id_servicio` AS `id_servicio`, concat(`c`.`nombre`,' ',`c`.`apellido`) AS `cliente`, `s`.`tipo_servicio` AS `tipo_servicio`, `s`.`descripcion` AS `descripcion`, `s`.`fecha_ingreso` AS `fecha_ingreso`, `s`.`estado` AS `estado`, concat(`u`.`nombre`,' ',`u`.`apellido`) AS `tecnico` FROM ((`servicios` `s` join `clientes` `c` on(`s`.`id_cliente` = `c`.`id_cliente`)) join `usuarios` `u` on(`s`.`id_usuario` = `u`.`id_usuario`)) WHERE `s`.`estado` in ('recibido','en_proceso','esperando_repuestos') ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_slider_content`
--
DROP TABLE IF EXISTS `v_slider_content`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_slider_content`  AS SELECT 'anuncio' AS `tipo_contenido`, `anuncios`.`id_anuncio` AS `id`, `anuncios`.`titulo` AS `titulo`, `anuncios`.`descripcion` AS `descripcion`, `anuncios`.`imagen` AS `imagen`, `anuncios`.`url_destino` AS `url_destino`, `anuncios`.`fecha_creacion` AS `fecha_creacion`, `anuncios`.`fecha_fin` AS `fecha_fin`, `anuncios`.`activo` AS `activo`, `anuncios`.`orden` AS `orden`, `anuncios`.`tipo_anuncio` AS `categoria`, NULL AS `porcentaje_descuento`, NULL AS `precio_original`, NULL AS `precio_oferta`, NULL AS `codigo_descuento` FROM `anuncios` WHERE `anuncios`.`activo` = 1 AND `anuncios`.`fecha_inicio` <= curdate() AND (`anuncios`.`fecha_fin` is null OR `anuncios`.`fecha_fin` >= curdate()) AND `anuncios`.`posicion` = 'hero' ORDER BY `anuncios`.`orden` ASC, `anuncios`.`fecha_creacion` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_ventas_hoy`
--
DROP TABLE IF EXISTS `v_ventas_hoy`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_ventas_hoy`  AS SELECT `v`.`id_venta` AS `id_venta`, `v`.`numero_factura` AS `numero_factura`, concat(`c`.`nombre`,' ',`c`.`apellido`) AS `cliente`, concat(`u`.`nombre`,' ',`u`.`apellido`) AS `vendedor`, `v`.`total` AS `total`, `v`.`metodo_pago` AS `metodo_pago`, `v`.`estado` AS `estado`, `v`.`fecha_venta` AS `fecha_venta` FROM ((`ventas` `v` left join `clientes` `c` on(`v`.`id_cliente` = `c`.`id_cliente`)) left join `usuarios` `u` on(`v`.`id_usuario` = `u`.`id_usuario`)) WHERE cast(`v`.`fecha_venta` as date) = curdate() ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `anuncios`
--
ALTER TABLE `anuncios`
  ADD PRIMARY KEY (`id_anuncio`),
  ADD KEY `idx_tipo_anuncio` (`tipo_anuncio`),
  ADD KEY `idx_posicion` (`posicion`),
  ADD KEY `idx_fecha_inicio` (`fecha_inicio`),
  ADD KEY `idx_fecha_fin` (`fecha_fin`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_orden` (`orden`),
  ADD KEY `idx_usuario_creador` (`id_usuario_creador`),
  ADD KEY `idx_anuncios_fecha_activo` (`fecha_inicio`,`fecha_fin`,`activo`);

--
-- Indices de la tabla `asignaciones_tecnicos`
--
ALTER TABLE `asignaciones_tecnicos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orden_id` (`orden_id`),
  ADD KEY `tecnico_id` (`tecnico_id`);

--
-- Indices de la tabla `asignacion_modulo`
--
ALTER TABLE `asignacion_modulo`
  ADD PRIMARY KEY (`id_asignacion`),
  ADD UNIQUE KEY `unique_usuario_modulo` (`id_usuario`,`id_modulo`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_modulo` (`id_modulo`);

--
-- Indices de la tabla `categorias_servicios`
--
ALTER TABLE `categorias_servicios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id_cita`),
  ADD KEY `idx_fecha_cita` (`fecha_cita`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_cliente` (`id_cliente`),
  ADD KEY `idx_usuario` (`id_usuario`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `idx_documento` (`documento`),
  ADD KEY `idx_nombre_apellido` (`nombre`,`apellido`),
  ADD KEY `idx_tipo_cliente` (`tipo_cliente`),
  ADD KEY `idx_activo` (`activo`);

--
-- Indices de la tabla `configuracion_pagos`
--
ALTER TABLE `configuracion_pagos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_pasarela` (`pasarela`);

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id_detalle_venta`),
  ADD KEY `idx_venta` (`id_venta`),
  ADD KEY `idx_producto` (`id_producto`);

--
-- Indices de la tabla `estadisticas_web`
--
ALTER TABLE `estadisticas_web`
  ADD PRIMARY KEY (`id_estadistica`),
  ADD KEY `idx_tipo_estadistica` (`tipo_estadistica`),
  ADD KEY `idx_elemento` (`elemento_id`,`elemento_tipo`),
  ADD KEY `idx_fecha_registro` (`fecha_registro`),
  ADD KEY `idx_estadisticas_fecha_tipo` (`fecha_registro`,`tipo_estadistica`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id_evento`),
  ADD KEY `idx_tipo_evento` (`tipo_evento`),
  ADD KEY `idx_categoria` (`categoria`),
  ADD KEY `idx_fecha_inicio` (`fecha_inicio`),
  ADD KEY `idx_fecha_fin` (`fecha_fin`),
  ADD KEY `idx_destacado` (`destacado`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_codigo_descuento` (`codigo_descuento`),
  ADD KEY `idx_usuario_creador` (`id_usuario_creador`),
  ADD KEY `idx_eventos_fecha_tipo` (`fecha_inicio`,`fecha_fin`,`tipo_evento`,`activo`);

--
-- Indices de la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_factura` (`numero_factura`),
  ADD KEY `idx_orden_id` (`orden_id`),
  ADD KEY `idx_cliente_id` (`cliente_id`),
  ADD KEY `idx_numero_factura` (`numero_factura`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha_emision` (`fecha_emision`);

--
-- Indices de la tabla `garantias`
--
ALTER TABLE `garantias`
  ADD PRIMARY KEY (`id_garantia`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha_vencimiento` (`fecha_vencimiento`),
  ADD KEY `idx_servicio` (`id_servicio`),
  ADD KEY `idx_venta` (`id_venta`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inventario`),
  ADD UNIQUE KEY `unique_producto` (`id_producto`),
  ADD KEY `idx_stock_actual` (`stock_actual`),
  ADD KEY `idx_ubicacion` (`ubicacion`);

--
-- Indices de la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD PRIMARY KEY (`id_modulo`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_orden` (`orden`);

--
-- Indices de la tabla `movimientos_inv`
--
ALTER TABLE `movimientos_inv`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `idx_producto` (`id_producto`),
  ADD KEY `idx_fecha` (`fecha`),
  ADD KEY `idx_tipo_movimiento` (`tipo_movimiento`),
  ADD KEY `idx_usuario` (`id_usuario`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tipo` (`tipo`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha_envio` (`fecha_envio`),
  ADD KEY `idx_notificaciones_destinatario` (`destinatario`),
  ADD KEY `idx_notificaciones_fecha_creacion` (`fecha_creacion`);

--
-- Indices de la tabla `ordenes_servicios`
--
ALTER TABLE `ordenes_servicios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_orden` (`numero_orden`),
  ADD KEY `idx_ordenes_cliente` (`cliente_id`),
  ADD KEY `idx_ordenes_estado` (`estado`),
  ADD KEY `idx_ordenes_fecha` (`fecha_orden`);

--
-- Indices de la tabla `ordenes_servicios_detalles`
--
ALTER TABLE `ordenes_servicios_detalles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orden_id` (`orden_id`),
  ADD KEY `servicio_id` (`servicio_id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pagos_orden` (`orden_id`),
  ADD KEY `idx_metodo_pago` (`metodo_pago`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha_transaccion` (`fecha_transaccion`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_proveedor` (`id_proveedor`),
  ADD KEY `idx_nombre` (`nombre`),
  ADD KEY `idx_categoria` (`categoria`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_codigo_barras` (`codigo_barras`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`),
  ADD KEY `idx_nombre_empresa` (`nombre_empresa`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_categoria` (`categoria`);

--
-- Indices de la tabla `reembolsos`
--
ALTER TABLE `reembolsos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pago_id` (`pago_id`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha_solicitud` (`fecha_solicitud`);

--
-- Indices de la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id_reporte`),
  ADD KEY `idx_tipo_reporte` (`tipo_reporte`),
  ADD KEY `idx_fecha_generacion` (`fecha_generacion`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_usuario` (`id_usuario`);

--
-- Indices de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD PRIMARY KEY (`id_reseña`),
  ADD KEY `idx_cliente` (`id_cliente`),
  ADD KEY `idx_calificacion` (`calificacion`),
  ADD KEY `idx_verificado` (`verificado`),
  ADD KEY `idx_destacado` (`destacado`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_fecha_creacion` (`fecha_creacion`),
  ADD KEY `idx_reseñas_calificacion_activo` (`calificacion`,`activo`,`destacado`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id_servicio`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha_ingreso` (`fecha_ingreso`),
  ADD KEY `idx_cliente` (`id_cliente`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_servicios_estado_fecha` (`estado`,`fecha_ingreso`);

--
-- Indices de la tabla `servicios_catalogo`
--
ALTER TABLE `servicios_catalogo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_servicios_catalogo_categoria` (`categoria_id`),
  ADD KEY `idx_servicios_catalogo_estado` (`estado`);

--
-- Indices de la tabla `tecnicos`
--
ALTER TABLE `tecnicos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  ADD PRIMARY KEY (`id_tipo_usuario`),
  ADD UNIQUE KEY `nombre_tipo` (`nombre_tipo`);

--
-- Indices de la tabla `transacciones_pago`
--
ALTER TABLE `transacciones_pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pago_id` (`pago_id`),
  ADD KEY `idx_tipo_evento` (`tipo_evento`),
  ADD KEY `idx_fecha_evento` (`fecha_evento`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_tipo_usuario` (`id_tipo_usuario`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `idx_fecha_venta` (`fecha_venta`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_metodo_pago` (`metodo_pago`),
  ADD KEY `idx_numero_factura` (`numero_factura`),
  ADD KEY `idx_ventas_fecha_estado` (`fecha_venta`,`estado`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `anuncios`
--
ALTER TABLE `anuncios`
  MODIFY `id_anuncio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `asignaciones_tecnicos`
--
ALTER TABLE `asignaciones_tecnicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `asignacion_modulo`
--
ALTER TABLE `asignacion_modulo`
  MODIFY `id_asignacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT de la tabla `categorias_servicios`
--
ALTER TABLE `categorias_servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id_cita` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `configuracion_pagos`
--
ALTER TABLE `configuracion_pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id_detalle_venta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estadisticas_web`
--
ALTER TABLE `estadisticas_web`
  MODIFY `id_estadistica` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `facturas`
--
ALTER TABLE `facturas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `garantias`
--
ALTER TABLE `garantias`
  MODIFY `id_garantia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inventario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `modulos`
--
ALTER TABLE `modulos`
  MODIFY `id_modulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `movimientos_inv`
--
ALTER TABLE `movimientos_inv`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ordenes_servicios`
--
ALTER TABLE `ordenes_servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ordenes_servicios_detalles`
--
ALTER TABLE `ordenes_servicios_detalles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reembolsos`
--
ALTER TABLE `reembolsos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id_reporte` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  MODIFY `id_reseña` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `servicios_catalogo`
--
ALTER TABLE `servicios_catalogo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT de la tabla `tecnicos`
--
ALTER TABLE `tecnicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  MODIFY `id_tipo_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `transacciones_pago`
--
ALTER TABLE `transacciones_pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `anuncios`
--
ALTER TABLE `anuncios`
  ADD CONSTRAINT `anuncios_ibfk_1` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `asignaciones_tecnicos`
--
ALTER TABLE `asignaciones_tecnicos`
  ADD CONSTRAINT `asignaciones_tecnicos_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_servicios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `asignaciones_tecnicos_ibfk_2` FOREIGN KEY (`tecnico_id`) REFERENCES `tecnicos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `asignacion_modulo`
--
ALTER TABLE `asignacion_modulo`
  ADD CONSTRAINT `asignacion_modulo_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `asignacion_modulo_ibfk_2` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_venta_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `fk_facturas_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_facturas_orden` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_servicios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `garantias`
--
ALTER TABLE `garantias`
  ADD CONSTRAINT `garantias_ibfk_1` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id_servicio`),
  ADD CONSTRAINT `garantias_ibfk_2` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`);

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `movimientos_inv`
--
ALTER TABLE `movimientos_inv`
  ADD CONSTRAINT `movimientos_inv_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `movimientos_inv_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `ordenes_servicios_detalles`
--
ALTER TABLE `ordenes_servicios_detalles`
  ADD CONSTRAINT `ordenes_servicios_detalles_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_servicios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ordenes_servicios_detalles_ibfk_2` FOREIGN KEY (`servicio_id`) REFERENCES `servicios_catalogo` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_servicios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`);

--
-- Filtros para la tabla `reembolsos`
--
ALTER TABLE `reembolsos`
  ADD CONSTRAINT `fk_reembolsos_pago` FOREIGN KEY (`pago_id`) REFERENCES `pagos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `reportes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD CONSTRAINT `reseñas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE SET NULL;

--
-- Filtros para la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `servicios_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `servicios_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `servicios_catalogo`
--
ALTER TABLE `servicios_catalogo`
  ADD CONSTRAINT `servicios_catalogo_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_servicios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `transacciones_pago`
--
ALTER TABLE `transacciones_pago`
  ADD CONSTRAINT `fk_transacciones_pago` FOREIGN KEY (`pago_id`) REFERENCES `pagos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_tipo_usuario`) REFERENCES `tipo_usuario` (`id_tipo_usuario`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
