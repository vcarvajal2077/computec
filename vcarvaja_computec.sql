-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 02, 2025 at 02:54 AM
-- Server version: 10.6.23-MariaDB
-- PHP Version: 7.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vcarvaja_computec`
--

-- --------------------------------------------------------

--
-- Table structure for table `anuncios`
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
-- Dumping data for table `anuncios`
--

INSERT INTO `anuncios` (`id_anuncio`, `titulo`, `descripcion`, `imagen`, `url_destino`, `tipo_anuncio`, `posicion`, `fecha_inicio`, `fecha_fin`, `activo`, `orden`, `clicks`, `id_usuario_creador`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'holi', 'mua te amo victor', 'sheily', '#servicios.html', 'promocion', 'hero', '2025-09-10', '2025-09-11', 1, 0, 0, NULL, '2025-09-10 22:17:12', '2025-09-10 22:17:12');

-- --------------------------------------------------------

--
-- Table structure for table `asignaciones_tecnicos`
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
-- Table structure for table `asignacion_modulo`
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
-- Dumping data for table `asignacion_modulo`
--

INSERT INTO `asignacion_modulo` (`id_asignacion`, `id_usuario`, `id_modulo`, `fecha_asignacion`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(69, 1, 28, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(70, 1, 29, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(71, 1, 30, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(72, 1, 31, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(73, 1, 32, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(74, 1, 33, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(75, 1, 34, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(76, 1, 35, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(77, 1, 36, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(78, 1, 37, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(79, 1, 38, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(80, 1, 39, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(81, 1, 41, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(97, 2, 29, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(98, 2, 30, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(99, 2, 31, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(100, 2, 32, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(101, 2, 33, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(102, 2, 34, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(103, 2, 35, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(104, 2, 36, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(105, 2, 37, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(106, 2, 38, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(107, 2, 39, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(108, 2, 41, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(125, 3, 29, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(126, 3, 36, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(127, 3, 38, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(128, 3, 39, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(129, 3, 41, '2025-09-30 23:59:12', 1, '2025-09-30 23:59:12', '2025-09-30 23:59:12'),
(139, 4, 31, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(140, 7, 31, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(141, 8, 31, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(142, 9, 31, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(143, 4, 32, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(144, 7, 32, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(145, 8, 32, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(146, 9, 32, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(147, 4, 36, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(148, 7, 36, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(149, 8, 36, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(150, 9, 36, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(151, 4, 38, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(152, 7, 38, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(153, 8, 38, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(154, 9, 38, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(155, 4, 39, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(156, 7, 39, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(157, 8, 39, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(158, 9, 39, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(159, 4, 41, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(160, 7, 41, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(161, 8, 41, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(162, 9, 41, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(196, 10, 29, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(197, 11, 29, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(198, 10, 36, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(199, 11, 36, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(200, 10, 38, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(201, 11, 38, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(202, 10, 39, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(203, 11, 39, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(204, 10, 41, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(205, 11, 41, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(221, 5, 39, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(222, 12, 39, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(223, 13, 39, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(224, 14, 39, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(225, 5, 40, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(226, 12, 40, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(227, 13, 40, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(228, 14, 40, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(229, 5, 41, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(230, 12, 41, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(231, 13, 41, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(232, 14, 41, '2025-10-01 00:06:16', 1, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(246, 6, 27, '2025-10-01 22:12:53', 1, '2025-10-01 22:12:53', '2025-10-01 22:12:53'),
(247, 7, 27, '2025-10-01 22:12:53', 1, '2025-10-01 22:12:53', '2025-10-01 22:12:53'),
(248, 4, 27, '2025-10-01 22:12:53', 1, '2025-10-01 22:12:53', '2025-10-01 22:12:53'),
(249, 8, 27, '2025-10-01 22:12:53', 1, '2025-10-01 22:12:53', '2025-10-01 22:12:53'),
(250, 9, 27, '2025-10-01 22:12:53', 1, '2025-10-01 22:12:53', '2025-10-01 22:12:53'),
(251, 1, 27, '2025-10-01 22:12:53', 1, '2025-10-01 22:12:53', '2025-10-01 22:12:53');

-- --------------------------------------------------------

--
-- Table structure for table `auditoria`
--

CREATE TABLE `auditoria` (
  `id_auditoria` int(11) NOT NULL,
  `tabla` varchar(50) DEFAULT NULL,
  `accion` enum('INSERT','UPDATE','DELETE') DEFAULT NULL,
  `id_registro` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `datos_anteriores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_anteriores`)),
  `datos_nuevos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_nuevos`)),
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carrito`
--

CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `estado` enum('pendiente','procesando','completado','cancelado') DEFAULT 'pendiente',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `carrito`
--

INSERT INTO `carrito` (`id_carrito`, `id_cliente`, `total`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 13, '3600000.00', 'completado', '2025-09-21 00:28:17', '2025-10-01 00:28:17'),
(2, 14, '2500000.00', 'completado', '2025-09-23 00:28:17', '2025-10-01 00:28:17'),
(3, 15, '1700000.00', 'completado', '2025-09-24 00:28:17', '2025-10-01 00:28:17'),
(4, 16, '900000.00', 'completado', '2025-09-26 00:28:17', '2025-10-01 00:28:17'),
(5, 17, '2130000.00', 'completado', '2025-09-27 00:28:17', '2025-10-01 00:28:17'),
(6, 18, '550000.00', 'completado', '2025-09-28 00:28:17', '2025-10-01 00:28:17'),
(7, 19, '1800000.00', 'completado', '2025-09-29 00:28:17', '2025-10-01 00:28:17'),
(8, 20, '4200000.00', 'completado', '2025-09-30 00:28:17', '2025-10-01 00:28:17'),
(9, 21, '700000.00', 'completado', '2025-10-01 00:28:17', '2025-10-01 00:28:17'),
(10, 22, '2200000.00', 'procesando', '2025-10-01 00:28:17', '2025-10-01 00:28:17'),
(11, 13, '850000.00', 'procesando', '2025-10-01 00:28:17', '2025-10-01 00:28:17'),
(12, 1, '250000.00', 'pendiente', '2025-10-01 00:50:13', '2025-10-01 00:54:43'),
(13, 26, '3150000.00', 'pendiente', '2025-10-01 03:16:46', '2025-10-01 03:28:50'),
(14, 27, '800000.00', 'pendiente', '2025-10-01 03:19:51', '2025-10-01 03:20:26');

-- --------------------------------------------------------

--
-- Table structure for table `carrito_items`
--

CREATE TABLE `carrito_items` (
  `id` int(11) NOT NULL,
  `id_carrito` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `item_type` enum('product','service') NOT NULL DEFAULT 'product',
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `precio` decimal(10,2) NOT NULL,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `carrito_items`
--

INSERT INTO `carrito_items` (`id`, `id_carrito`, `item_id`, `item_type`, `cantidad`, `precio`, `fecha_agregado`) VALUES
(1, 1, 1, 'product', 2, '1800000.00', '2025-10-01 00:28:17'),
(2, 2, 2, 'product', 1, '2500000.00', '2025-10-01 00:28:17'),
(3, 3, 10, 'product', 3, '150000.00', '2025-10-01 00:28:17'),
(4, 3, 11, 'product', 2, '250000.00', '2025-10-01 00:28:17'),
(5, 3, 5, 'product', 5, '150000.00', '2025-10-01 00:28:17'),
(6, 4, 7, 'product', 1, '900000.00', '2025-10-01 00:28:17'),
(7, 5, 1, 'product', 1, '1800000.00', '2025-10-01 00:28:17'),
(8, 5, 10, 'product', 1, '150000.00', '2025-10-01 00:28:17'),
(9, 5, 14, 'product', 1, '180000.00', '2025-10-01 00:28:17'),
(10, 6, 12, 'product', 1, '550000.00', '2025-10-01 00:28:17'),
(11, 7, 1, 'product', 1, '1800000.00', '2025-10-01 00:28:17'),
(12, 8, 4, 'product', 1, '4200000.00', '2025-10-01 00:28:17'),
(13, 9, 15, 'product', 1, '450000.00', '2025-10-01 00:28:17'),
(14, 9, 16, 'product', 1, '250000.00', '2025-10-01 00:28:17'),
(15, 10, 3, 'product', 1, '2200000.00', '2025-10-01 00:28:17'),
(16, 11, 5, 'product', 4, '150000.00', '2025-10-01 00:28:17'),
(17, 11, 6, 'product', 1, '250000.00', '2025-10-01 00:28:17'),
(22, 12, 31, 'product', 1, '250000.00', '2025-10-01 00:54:18'),
(23, 13, 31, 'product', 3, '250000.00', '2025-10-01 03:16:53'),
(24, 13, 95, 'service', 3, '800000.00', '2025-10-01 03:16:58'),
(25, 14, 95, 'service', 1, '800000.00', '2025-10-01 03:20:26');

-- --------------------------------------------------------

--
-- Table structure for table `categorias_servicios`
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
-- Dumping data for table `categorias_servicios`
--

INSERT INTO `categorias_servicios` (`id`, `nombre`, `descripcion`, `icono`, `color`, `orden`, `estado`, `fecha_creacion`) VALUES
(9, 'Mantenimiento', 'Servicios de mantenimiento preventivo y correctivo', 'fas fa-wrench', '#3b82f6', 1, 'activo', '2025-09-10 23:33:12'),
(10, 'Reparación', 'Reparación de equipos y componentes', 'fas fa-tools', '#ef4444', 2, 'activo', '2025-09-10 23:33:12'),
(11, 'Instalación', 'Instalación de software y hardware', 'fas fa-download', '#10b981', 3, 'activo', '2025-09-10 23:33:12'),
(12, 'Consultoría', 'Asesoría técnica especializada', 'fas fa-lightbulb', '#f59e0b', 4, 'activo', '2025-09-10 23:33:12');

-- --------------------------------------------------------

--
-- Table structure for table `citas`
--

CREATE TABLE `citas` (
  `id_cita` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
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
-- Table structure for table `clientes`
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
-- Dumping data for table `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `apellido`, `documento`, `telefono`, `email`, `direccion`, `fecha_registro`, `tipo_cliente`, `id_usuario`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'María', 'Cliente', NULL, '3003334444', 'cliente@computec.com', NULL, '2025-09-30 20:37:12', 'persona', 5, 1, '2025-09-30 20:37:12', '2025-09-30 20:37:12'),
(4, 'victor', 'Carvajal Valencia', '', '32324234234', 'viticos@gmail.com', '', '2025-09-30 23:01:33', 'persona', NULL, 1, '2025-09-30 23:01:33', '2025-09-30 23:01:33'),
(5, 'Roberto', 'Sánchez', NULL, '3001234567', 'roberto.sanchez@empresa.com', 'Calle 45 #23-12, Bogotá', '2025-10-01 00:06:38', 'empresa', NULL, 1, '2025-10-01 00:06:38', '2025-10-01 00:06:38'),
(6, 'Laura', 'Gómez', NULL, '3009876543', 'laura.gomez@gmail.com', 'Carrera 7 #89-45, Medellín', '2025-10-01 00:06:38', '', NULL, 1, '2025-10-01 00:06:38', '2025-10-01 00:06:38'),
(7, 'Miguel', 'Castro', NULL, '3005551234', 'miguel.castro@tech.com', 'Avenida 68 #34-56, Cali', '2025-10-01 00:06:38', 'empresa', NULL, 1, '2025-10-01 00:06:38', '2025-10-01 00:06:38'),
(8, 'Patricia', 'Vargas', NULL, '3007778888', 'patricia.vargas@hotmail.com', 'Calle 100 #15-23, Barranquilla', '2025-10-01 00:06:38', '', NULL, 1, '2025-10-01 00:06:38', '2025-10-01 00:06:38'),
(9, 'Andrés', 'Moreno', NULL, '3006665555', 'andres.moreno@corp.com', 'Carrera 15 #78-90, Cartagena', '2025-10-01 00:06:38', 'empresa', NULL, 1, '2025-10-01 00:06:38', '2025-10-01 00:06:38'),
(10, 'Valentina', 'Ruiz', NULL, '3004443333', 'valentina.ruiz@outlook.com', 'Calle 72 #45-67, Bucaramanga', '2025-10-01 00:06:38', '', NULL, 1, '2025-10-01 00:06:38', '2025-10-01 00:06:38'),
(11, 'Fernando', 'Díaz', NULL, '3002221111', 'fernando.diaz@business.com', 'Avenida 19 #123-45, Pereira', '2025-10-01 00:06:38', 'empresa', NULL, 1, '2025-10-01 00:06:38', '2025-10-01 00:06:38'),
(12, 'Camila', 'Ortiz', NULL, '3008889999', 'camila.ortiz@yahoo.com', 'Carrera 50 #67-89, Manizales', '2025-10-01 00:06:38', '', NULL, 1, '2025-10-01 00:06:38', '2025-10-01 00:06:38'),
(13, 'Sebastián', 'Reyes', NULL, '3003332222', 'sebastian.reyes@company.com', 'Calle 85 #12-34, Ibagué', '2025-10-01 00:06:38', 'empresa', NULL, 1, '2025-10-01 00:06:38', '2025-10-01 00:06:38'),
(14, 'Isabella', 'Jiménez', NULL, '3009990000', 'isabella.jimenez@gmail.com', 'Avenida 30 #56-78, Santa Marta', '2025-10-01 00:06:38', '', NULL, 1, '2025-10-01 00:06:38', '2025-10-01 00:06:38'),
(15, 'Roberto', 'Sánchez', NULL, '3001234567', 'roberto.sanchez@empresa.com', 'Calle 45 #23-12, Bogotá', '2025-10-01 00:17:12', 'empresa', NULL, 1, '2025-10-01 00:17:12', '2025-10-01 00:17:12'),
(16, 'Laura', 'Gómez', NULL, '3009876543', 'laura.gomez@gmail.com', 'Carrera 7 #89-45, Medellín', '2025-10-01 00:17:12', '', NULL, 1, '2025-10-01 00:17:12', '2025-10-01 00:17:12'),
(17, 'Miguel', 'Castro', NULL, '3005551234', 'miguel.castro@tech.com', 'Avenida 68 #34-56, Cali', '2025-10-01 00:17:12', 'empresa', NULL, 1, '2025-10-01 00:17:12', '2025-10-01 00:17:12'),
(18, 'Patricia', 'Vargas', NULL, '3007778888', 'patricia.vargas@hotmail.com', 'Calle 100 #15-23, Barranquilla', '2025-10-01 00:17:12', '', NULL, 1, '2025-10-01 00:17:12', '2025-10-01 00:17:12'),
(19, 'Andrés', 'Moreno', NULL, '3006665555', 'andres.moreno@corp.com', 'Carrera 15 #78-90, Cartagena', '2025-10-01 00:17:12', 'empresa', NULL, 1, '2025-10-01 00:17:12', '2025-10-01 00:17:12'),
(20, 'Valentina', 'Ruiz', NULL, '3004443333', 'valentina.ruiz@outlook.com', 'Calle 72 #45-67, Bucaramanga', '2025-10-01 00:17:12', '', NULL, 1, '2025-10-01 00:17:12', '2025-10-01 00:17:12'),
(21, 'Fernando', 'Díaz', NULL, '3002221111', 'fernando.diaz@business.com', 'Avenida 19 #123-45, Pereira', '2025-10-01 00:17:12', 'empresa', NULL, 1, '2025-10-01 00:17:12', '2025-10-01 00:17:12'),
(22, 'Camila', 'Ortiz', NULL, '3008889999', 'camila.ortiz@yahoo.com', 'Carrera 50 #67-89, Manizales', '2025-10-01 00:17:12', '', NULL, 1, '2025-10-01 00:17:12', '2025-10-01 00:17:12'),
(23, 'Sebastián', 'Reyes', NULL, '3003332222', 'sebastian.reyes@company.com', 'Calle 85 #12-34, Ibagué', '2025-10-01 00:17:12', 'empresa', NULL, 1, '2025-10-01 00:17:12', '2025-10-01 00:17:12'),
(24, 'Isabella', 'Jiménez', NULL, '3009990000', 'isabella.jimenez@gmail.com', 'Avenida 30 #56-78, Santa Marta', '2025-10-01 00:17:12', '', NULL, 1, '2025-10-01 00:17:12', '2025-10-01 00:17:12'),
(25, 'adfadsf', 'asdfadsf', NULL, NULL, 'adfas@gmail.com', NULL, '2025-10-01 07:43:01', 'persona', 26, 1, '2025-10-01 00:43:01', '2025-10-01 00:43:01'),
(26, 'miguel', 'el verga', NULL, '3203550004', 'miguel@gmail.com', NULL, '2025-10-01 08:16:37', 'persona', 27, 1, '2025-10-01 03:16:37', '2025-10-01 03:16:37'),
(27, 'samuel', 'portilla', NULL, '320908097654', 'samuxd@gmail.com', NULL, '2025-10-01 08:19:27', 'persona', 28, 1, '2025-10-01 03:19:27', '2025-10-01 03:19:27');

-- --------------------------------------------------------

--
-- Table structure for table `configuracion_pagos`
--

CREATE TABLE `configuracion_pagos` (
  `id` int(11) NOT NULL,
  `pasarela` varchar(50) NOT NULL,
  `configuracion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`configuracion`)),
  `habilitada` tinyint(1) DEFAULT 1,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `configuracion_pagos`
--

INSERT INTO `configuracion_pagos` (`id`, `pasarela`, `configuracion`, `habilitada`, `fecha_actualizacion`) VALUES
(1, 'stripe', '{\"public_key\": \"pk_test_...\", \"secret_key\": \"sk_test_...\", \"webhook_secret\": \"whsec_...\"}', 1, '2025-09-09 20:33:32'),
(2, 'paypal', '{\"client_id\": \"paypal_client_id\", \"client_secret\": \"paypal_client_secret\", \"sandbox\": true}', 1, '2025-09-09 20:33:32'),
(3, 'nequi', '{\"api_key\": \"nequi_api_key\", \"merchant_id\": \"nequi_merchant\", \"sandbox\": true}', 1, '2025-09-09 20:33:32'),
(4, 'daviplata', '{\"api_key\": \"daviplata_api_key\", \"merchant_id\": \"daviplata_merchant\", \"sandbox\": true}', 1, '2025-09-09 20:33:32');

-- --------------------------------------------------------

--
-- Table structure for table `contacto`
--

CREATE TABLE `contacto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `asunto` varchar(200) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cotizaciones`
--

CREATE TABLE `cotizaciones` (
  `id_cotizacion` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_vencimiento` date DEFAULT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `observaciones` text DEFAULT NULL,
  `estado` enum('pendiente','enviada','aceptada','rechazada') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cotizaciones`
--

INSERT INTO `cotizaciones` (`id_cotizacion`, `id_cliente`, `fecha_creacion`, `fecha_vencimiento`, `total`, `observaciones`, `estado`) VALUES
(1, 13, '2025-10-01 00:25:41', '2025-10-07', '5600000.00', 'Cotización para renovación de equipos de oficina', 'pendiente'),
(3, 15, '2025-10-01 00:25:41', '2025-10-10', '8800000.00', 'Cotización para upgrade de servidores', 'enviada'),
(4, 16, '2025-10-01 00:25:41', '2025-10-03', '1450000.00', 'Cotización para componentes PC gaming', 'enviada'),
(5, 17, '2025-10-01 00:25:41', '2025-09-28', '2350000.00', 'Cotización aceptada - proceder con venta', 'aceptada'),
(6, 18, '2025-10-01 00:25:41', '2025-09-29', '3060000.00', 'Cliente confirmó compra', 'aceptada'),
(7, 19, '2025-10-01 00:25:41', '2025-09-25', '4200000.00', 'Cliente encontró mejor precio', 'rechazada');

-- --------------------------------------------------------

--
-- Table structure for table `cotizaciones_items`
--

CREATE TABLE `cotizaciones_items` (
  `id_item` int(11) NOT NULL,
  `id_cotizacion` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cotizaciones_items`
--

INSERT INTO `cotizaciones_items` (`id_item`, `id_cotizacion`, `id_producto`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
(1, 1, 1, 2, '1800000.00', '3600000.00'),
(2, 1, 10, 5, '150000.00', '750000.00'),
(3, 1, 11, 5, '250000.00', '1250000.00'),
(4, 2, 2, 1, '2500000.00', '2500000.00'),
(5, 3, 3, 3, '2200000.00', '6600000.00'),
(6, 3, 5, 8, '150000.00', '1200000.00'),
(7, 3, 6, 4, '250000.00', '1000000.00'),
(8, 4, 7, 1, '900000.00', '900000.00'),
(9, 4, 5, 2, '150000.00', '300000.00'),
(10, 4, 11, 1, '250000.00', '250000.00'),
(11, 5, 1, 1, '1800000.00', '1800000.00'),
(12, 5, 12, 1, '550000.00', '550000.00'),
(13, 6, 10, 3, '150000.00', '450000.00'),
(14, 6, 14, 2, '180000.00', '360000.00'),
(15, 6, 15, 5, '450000.00', '2250000.00'),
(16, 7, 4, 1, '4200000.00', '4200000.00');

-- --------------------------------------------------------

--
-- Table structure for table `detalle_venta`
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

-- --------------------------------------------------------

--
-- Table structure for table `estadisticas_web`
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

-- --------------------------------------------------------

--
-- Table structure for table `eventos`
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
-- Dumping data for table `eventos`
--

INSERT INTO `eventos` (`id_evento`, `titulo`, `descripcion`, `tipo_evento`, `categoria`, `porcentaje_descuento`, `precio_original`, `precio_oferta`, `codigo_descuento`, `imagen`, `url_destino`, `fecha_inicio`, `fecha_fin`, `limite_usos`, `usos_actuales`, `condiciones`, `destacado`, `activo`, `id_usuario_creador`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Descuento 20% en Reparaciones', 'Lleva tu computadora para reparación y obtén 20% de descuento en el servicio. Válido hasta fin de mes.', 'descuento', 'Reparaciones', '20.00', NULL, NULL, 'REPARA20', NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 100, 0, NULL, 1, 1, NULL, '2025-08-20 21:19:33', '2025-08-20 21:19:33'),
(2, 'Oferta Especial: PC Gaming', 'PC Gaming completa con Intel i5, 16GB RAM, GTX 1660 por solo $1.800.000. ¡Aprovecha esta oferta!', 'oferta_especial', 'PCs Gaming', NULL, '2200000.00', '1800000.00', NULL, NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 10, 0, NULL, 1, 1, NULL, '2025-08-20 21:19:33', '2025-08-20 21:19:33'),
(3, 'Promoción: Mantenimiento Preventivo', 'Mantenimiento preventivo para tu computadora por solo $50.000. Incluye limpieza y optimización.', 'promocion', 'Mantenimiento', NULL, '80000.00', '50000.00', 'MANTENIMIENTO', NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 50, 0, NULL, 0, 1, NULL, '2025-08-20 21:19:33', '2025-08-20 21:19:33'),
(4, 'Descuento 15% en Accesorios', 'Todos los accesorios con 15% de descuento. Teclados, mouse, monitores y más.', 'descuento', 'Accesorios', '15.00', NULL, NULL, 'ACCESORIOS15', NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 200, 0, NULL, 0, 1, NULL, '2025-08-20 21:19:33', '2025-08-20 21:19:33'),
(5, 'Evento: Taller de Mantenimiento', 'Taller gratuito de mantenimiento básico de computadoras. Aprende a cuidar tu equipo.', 'evento', 'Educación', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-15 14:00:00', '2024-02-15 16:00:00', 30, 0, NULL, 1, 1, NULL, '2025-08-20 21:19:33', '2025-08-20 21:19:33'),
(6, 'Descuento 20%', 'Descuento especial en todos los servicios', 'descuento', 'Servicios', '20.00', NULL, NULL, NULL, NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', NULL, 0, NULL, 1, 1, NULL, '2025-08-21 20:57:23', '2025-08-21 20:57:23'),
(7, 'Promoción Gaming', 'Ofertas especiales en equipos gaming', 'promocion', 'Productos', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', NULL, 0, NULL, 1, 1, NULL, '2025-08-21 20:57:23', '2025-08-21 20:57:23'),
(8, 'Black Friday Tech', 'Descuentos hasta 40% en todos los servicios', 'descuento', 'Promociones', '40.00', NULL, NULL, NULL, NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', NULL, 0, NULL, 1, 1, NULL, '2025-08-21 21:39:30', '2025-08-21 21:39:30'),
(9, 'Evento Gaming', 'Ofertas especiales en equipos gaming', 'oferta_especial', 'Gaming', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-01 00:00:00', '2024-12-31 23:59:59', NULL, 0, NULL, 1, 1, NULL, '2025-08-21 21:39:30', '2025-08-21 21:39:30'),
(10, 'Nueva Tecnología de Procesadores Intel 2025', 'Intel presenta su nueva generación de procesadores con arquitectura revolucionaria que promete un 40% más de rendimiento y mejor eficiencia energética. Los nuevos chips incluyen tecnologías de IA integrada y soporte para las últimas tecnologías de memoria.', 'noticia', 'Hardware', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-15 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 1, 1, NULL, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(11, 'Tendencias en Ciberseguridad para 2025', 'Las nuevas amenazas cibernéticas y las soluciones más avanzadas para proteger tu información personal y empresarial. Incluye análisis de malware, phishing avanzado y protección contra ataques de ransomware.', 'noticia', 'Seguridad', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-12 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 0, 1, NULL, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(12, 'Guía Completa: Ensamblar tu PC Gaming', 'Paso a paso para construir la computadora gaming de tus sueños con los mejores componentes del mercado. Incluye selección de componentes, compatibilidad, ensamblaje y configuración inicial del sistema.', 'noticia', 'Tutoriales', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-10 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 1, 1, NULL, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(13, 'Windows 12: Todo lo que Necesitas Saber', 'Características, requisitos y fecha de lanzamiento del nuevo sistema operativo de Microsoft. Descubre las nuevas funcionalidades, mejoras de rendimiento y cambios en la interfaz de usuario.', 'noticia', 'Software', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-08 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 0, 1, NULL, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(14, 'Mantenimiento Preventivo: Clave para el Rendimiento', 'Cómo mantener tu computadora funcionando al máximo rendimiento con simples tareas de mantenimiento. Incluye limpieza física, optimización de software y actualizaciones recomendadas.', 'noticia', 'Mantenimiento', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-05 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 0, 1, NULL, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(15, 'El Futuro de la Inteligencia Artificial en PCs', 'Cómo la IA está transformando la forma en que usamos nuestras computadoras y qué esperar en los próximos años. Incluye aplicaciones prácticas, herramientas de IA y el impacto en la productividad.', 'noticia', 'Tecnología', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-01 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 1, 1, NULL, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(16, 'Nuevas Tarjetas Gráficas NVIDIA RTX 5000', 'Análisis completo de las nuevas tarjetas gráficas NVIDIA RTX 5000. Rendimiento, características, precios y comparación con generaciones anteriores para ayudarte a elegir la mejor opción.', 'noticia', 'Hardware', NULL, NULL, NULL, NULL, NULL, NULL, '2024-11-28 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 0, 1, NULL, '2025-08-26 22:01:16', '2025-08-26 22:01:16'),
(17, 'Guía de Optimización para Juegos', 'Técnicas avanzadas para optimizar el rendimiento de tu PC en juegos. Configuración de gráficos, overclocking seguro y herramientas de monitoreo para obtener la mejor experiencia gaming.', 'noticia', 'Gaming', NULL, NULL, NULL, NULL, NULL, NULL, '2024-11-25 00:00:00', '2025-12-31 23:59:59', NULL, 0, NULL, 0, 1, NULL, '2025-08-26 22:01:16', '2025-08-26 22:01:16');

-- --------------------------------------------------------

--
-- Table structure for table `facturas`
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
-- Table structure for table `garantias`
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
-- Table structure for table `inventario`
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

--
-- Dumping data for table `inventario`
--

INSERT INTO `inventario` (`id_inventario`, `id_producto`, `stock_actual`, `stock_disponible`, `stock_reservado`, `ubicacion`, `fecha_actualizacion`, `movimiento`, `fecha_creacion`) VALUES
(1, 31, 10, 10, 10, 'su madre', '2025-10-01 03:28:50', 'de arriba a abajo', '2025-09-30 14:38:10'),
(2, 49, 10, 0, 0, NULL, '2025-09-30 22:33:45', NULL, '2025-09-30 22:32:49'),
(3, 50, 13241232, 0, 0, NULL, '2025-09-30 22:37:02', NULL, '2025-09-30 22:36:51'),
(38, 64, 1000, 0, 0, NULL, '2025-10-01 21:20:24', NULL, '2025-10-01 21:20:24'),
(39, 2, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(40, 3, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(41, 24, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(42, 25, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(43, 26, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(44, 27, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(45, 28, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(46, 29, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(47, 30, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(48, 32, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(49, 33, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(50, 34, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(51, 35, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(52, 36, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(53, 37, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(54, 38, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(55, 39, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(56, 40, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(57, 41, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(58, 42, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(59, 43, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(60, 44, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(61, 45, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(62, 46, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(63, 47, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(64, 48, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(65, 51, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(66, 52, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(67, 53, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(68, 54, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(69, 55, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(70, 56, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(71, 57, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(72, 58, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(73, 59, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(74, 60, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(75, 61, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(76, 62, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(77, 63, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(78, 65, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(79, 66, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(80, 67, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(81, 68, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(82, 69, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(83, 70, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(84, 71, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(85, 72, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(86, 73, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(87, 74, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(88, 75, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(89, 76, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(90, 77, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(91, 78, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(92, 79, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(93, 80, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(94, 81, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(95, 82, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(96, 83, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26'),
(97, 84, 100, 100, 0, NULL, '2025-10-01 21:27:26', NULL, '2025-10-01 21:27:26');

-- --------------------------------------------------------

--
-- Table structure for table `modulos`
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
-- Dumping data for table `modulos`
--

INSERT INTO `modulos` (`id_modulo`, `nombre_modulo`, `descripcion`, `url`, `icono`, `orden`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(27, 'Gestión de Usuarios', 'Administrar usuarios del sistema', '/Proyecto/gestion-usuarios.html', 'fas fa-users', 2, 1, '2025-09-30 23:59:12', '2025-10-01 22:08:43'),
(28, 'Gestión de Módulos', 'Administrar módulos y permisos', '/Proyecto/gestion-modulos.html', 'fas fa-th-large', 2, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03'),
(29, 'Gestión de Clientes', 'Administrar clientes', '/Proyecto/gestion-clientes.html', 'fas fa-user-tie', 3, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03'),
(30, 'Gestión de Productos', 'Administrar productos', '/Proyecto/gestion-productos.html', 'fas fa-box', 4, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03'),
(31, 'Gestión de Servicios', 'Administrar servicios y reparaciones', '/Proyecto/gestion-servicios.html', 'fas fa-tools', 5, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03'),
(32, 'Inventario', 'Control de inventario', '/Proyecto/inventario.html', 'fas fa-warehouse', 6, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03'),
(33, 'Proveedores', 'Gestión de proveedores', '/Proyecto/proveedores.html', 'fas fa-truck', 7, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03'),
(34, 'Facturación', 'Gestión de facturas', '/Proyecto/facturas.html', 'fas fa-file-invoice-dollar', 8, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03'),
(35, 'Reportes', 'Reportes y estadísticas', '/Proyecto/reportes.html', 'fas fa-chart-line', 9, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03'),
(36, 'Agenda', 'Agenda de citas', '/Proyecto/agenda.html', 'fas fa-calendar-alt', 10, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03'),
(37, 'Cotizaciones', 'Gestión de cotizaciones', '/Proyecto/cotizaciones.html', 'fas fa-file-invoice', 11, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03'),
(38, 'Tickets', 'Soporte técnico', '/Proyecto/tickets.html', 'fas fa-ticket-alt', 12, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03'),
(39, 'Notificaciones', 'Centro de notificaciones', '/Proyecto/notificaciones.html', 'fas fa-bell', 13, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03'),
(40, 'Portal Cliente', 'Portal del cliente', '/Proyecto/portal-cliente.html', 'fas fa-user-circle', 14, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03'),
(41, 'Mi Perfil', 'Editar perfil personal', '/Proyecto/mi-perfil.html', 'fas fa-user-cog', 15, 1, '2025-09-30 23:59:12', '2025-10-01 01:13:03');

-- --------------------------------------------------------

--
-- Table structure for table `movimientos_inventario`
--

CREATE TABLE `movimientos_inventario` (
  `id_movimiento` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `tipo` enum('entrada','salida','ajuste') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `observacion` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movimientos_inventario`
--

INSERT INTO `movimientos_inventario` (`id_movimiento`, `id_producto`, `tipo`, `cantidad`, `id_usuario`, `observacion`, `fecha`) VALUES
(1, 64, 'entrada', 1000, NULL, '', '2025-10-01 21:20:24');

-- --------------------------------------------------------

--
-- Table structure for table `notificaciones`
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
-- Table structure for table `ordenes_servicios`
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
-- Table structure for table `ordenes_servicios_detalles`
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
-- Table structure for table `pagos`
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

-- --------------------------------------------------------

--
-- Table structure for table `productos`
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
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sku` varchar(100) DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `garantia` int(11) DEFAULT 0,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `precio` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `categoria`, `precio_compra`, `precio_venta`, `stock_minimo`, `fecha_ingreso`, `id_proveedor`, `activo`, `codigo_barras`, `imagen`, `fecha_creacion`, `fecha_actualizacion`, `sku`, `marca`, `modelo`, `stock`, `garantia`, `fecha_registro`, `precio`) VALUES
(2, 'Laptop Gaming Pro', 'Laptop de alto rendimiento para gaming', 'Laptops', '1500000.00', '2000000.00', 5, '2025-08-21 20:57:34', NULL, 1, NULL, NULL, '2025-08-21 20:57:34', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '130000.00'),
(3, 'Mouse Gaming RGB', 'Mouse gaming con iluminación RGB', 'Accesorios', '50000.00', '80000.00', 10, '2025-08-21 20:57:34', NULL, 1, NULL, NULL, '2025-08-21 20:57:34', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '120000.00'),
(24, 'Laptop Gamer Pro X', 'Laptop de alta gama para gaming con tarjeta gráfica RTX 4080', 'Laptops', '5500000.00', '7500000.00', 5, '2025-09-30 13:50:33', 1, 1, '7890123456789', 'https://via.placeholder.com/300x300.png?text=Laptop+Gamer', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '130000.00'),
(25, 'Mouse Inalámbrico Ergonómico', 'Mouse ergonómico para largas horas de trabajo y juego', 'Accesorios', '80000.00', '150000.00', 10, '2025-09-30 13:50:33', 2, 1, '7890123456790', 'https://via.placeholder.com/300x300.png?text=Mouse', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '210000.00'),
(26, 'Teclado Mecánico RGB', 'Teclado mecánico con retroiluminación RGB personalizable', 'Accesorios', '250000.00', '450000.00', 8, '2025-09-30 13:50:33', 2, 1, '7890123456791', 'https://via.placeholder.com/300x300.png?text=Teclado', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '230000.00'),
(27, 'Monitor Curvo 27\"', 'Monitor curvo de 27 pulgadas para una experiencia inmersiva', 'Monitores', '900000.00', '1500000.00', 6, '2025-09-30 13:50:33', 3, 1, '7890123456792', 'https://via.placeholder.com/300x300.png?text=Monitor', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '120000.00'),
(28, 'Disco Duro SSD 1TB', 'Disco de estado sólido de 1TB para un rendimiento ultrarrápido', 'Componentes', '300000.00', '500000.00', 12, '2025-09-30 13:50:33', 4, 1, '7890123456793', 'https://via.placeholder.com/300x300.png?text=SSD', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '120000.00'),
(29, 'Memoria RAM 16GB DDR5', 'Módulo de memoria RAM de 16GB DDR5 para máxima velocidad', 'Componentes', '400000.00', '650000.00', 15, '2025-09-30 13:50:33', 4, 1, '7890123456794', 'https://via.placeholder.com/300x300.png?text=RAM', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '170000.00'),
(30, 'Silla Gamer Ergonómica', 'Silla ergonómica diseñada para largas sesiones de juego', 'Componentes', '800000.00', '1200000.00', 5, '2025-09-30 13:50:33', 5, 1, '7890123456795', 'https://via.placeholder.com/300x300.png?text=Silla+Gamer', '2025-09-30 13:50:33', '2025-09-30 22:27:16', 'N/A', '', '', 100, 0, '2025-09-30 22:13:31', '1200000.00'),
(31, 'Auriculares con Micrófono', 'Auriculares con cancelación de ruido y micrófono integrado', 'Accesorios', '150000.00', '250000.00', 5, '2025-09-30 13:50:33', 2, 1, '7890123456796', 'https://via.placeholder.com/300x300.png?text=Auriculares', '2025-09-30 13:50:33', '2025-09-30 22:29:14', 'prod', '', '', 15, 0, '2025-09-30 22:13:31', '250000.00'),
(32, 'Webcam Full HD 1080p', 'Cámara web con resolución Full HD para streaming y videoconferencias', 'Accesorios', '200000.00', '350000.00', 7, '2025-09-30 13:50:33', 3, 1, '7890123456797', 'https://via.placeholder.com/300x300.png?text=Webcam', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '220000.00'),
(33, 'Impresora Multifuncional', 'Impresora, escáner y copiadora en un solo dispositivo', 'Impresoras', '400000.00', '600000.00', 5, '2025-09-30 13:50:33', 6, 1, '7890123456798', 'https://via.placeholder.com/300x300.png?text=Impresora', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '160000.00'),
(34, 'Router Wi-Fi 6', 'Router de última generación para una conexión a internet más rápida y estable', 'Redes', '350000.00', '550000.00', 8, '2025-09-30 13:50:33', 7, 1, '7890123456799', 'https://via.placeholder.com/300x300.png?text=Router', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '200000.00'),
(35, 'Tableta Gráfica', 'Tableta para diseño gráfico y dibujo digital', 'Accesorios', '600000.00', '900000.00', 4, '2025-09-30 13:50:33', 8, 1, '7890123456800', 'https://via.placeholder.com/300x300.png?text=Tableta+Grafica', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '110000.00'),
(36, 'Proyector Portátil', 'Proyector compacto para presentaciones y entretenimiento', 'Proyectores', '700000.00', '1100000.00', 3, '2025-09-30 13:50:33', 9, 1, '7890123456801', 'https://via.placeholder.com/300x300.png?text=Proyector', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '170000.00'),
(37, 'Sistema de Sonido 5.1', 'Sistema de altavoces envolvente para una experiencia de cine en casa', 'Audio', '900000.00', '1400000.00', 3, '2025-09-30 13:50:33', 10, 1, '7890123456802', 'https://via.placeholder.com/300x300.png?text=Sistema+de+Sonido', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '100000.00'),
(38, 'Smartwatch Deportivo', 'Reloj inteligente con funciones de seguimiento de actividad física', 'Wearables', '500000.00', '800000.00', 6, '2025-09-30 13:50:33', 11, 1, '7890123456803', 'https://via.placeholder.com/300x300.png?text=Smartwatch', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '220000.00'),
(39, 'Power Bank 20000mAh', 'Batería externa de alta capacidad para cargar tus dispositivos', 'Accesorios', '120000.00', '200000.00', 10, '2025-09-30 13:50:33', 12, 1, '7890123456804', 'https://via.placeholder.com/300x300.png?text=Power+Bank', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '250000.00'),
(40, 'Funda para Laptop 15\"', 'Funda acolchada para proteger tu laptop de golpes y arañazos', 'Accesorios', '50000.00', '90000.00', 15, '2025-09-30 13:50:33', 13, 1, '7890123456805', 'https://via.placeholder.com/300x300.png?text=Funda', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '140000.00'),
(41, 'Micrófono de Condensador', 'Micrófono de estudio para grabación de voz y música', 'Audio', '300000.00', '500000.00', 5, '2025-09-30 13:50:33', 14, 1, '7890123456806', 'https://via.placeholder.com/300x300.png?text=Microfono', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '200000.00'),
(42, 'Base Refrigerante para Laptop', 'Base con ventiladores para mantener tu laptop a una temperatura óptima', 'Accesorios', '90000.00', '160000.00', 8, '2025-09-30 13:50:33', 15, 1, '7890123456807', 'https://via.placeholder.com/300x300.png?text=Base+Refrigerante', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '150000.00'),
(43, 'Kit de Limpieza para Pantallas', 'Solución y paño de microfibra para limpiar pantallas sin dejar marcas', 'Accesorios', '30000.00', '60000.00', 20, '2025-09-30 13:50:33', 16, 1, '7890123456808', 'https://via.placeholder.com/300x300.png?text=Kit+Limpieza', '2025-09-30 13:50:33', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:13:31', '220000.00'),
(44, 'Laptop HP Pavilion 15', 'Laptop HP Pavilion 15 con procesador Intel Core i5, 8GB RAM, 256GB SSD', 'Laptops', '0.00', '0.00', 3, '2025-09-30 22:15:09', NULL, 1, NULL, NULL, '2025-09-30 22:15:09', '2025-09-30 22:15:09', 'LAP-HP-001', 'HP', 'Pavilion 15', 10, 12, '2025-09-30 22:15:09', '2500000.00'),
(45, 'Mouse Logitech MX Master 3', 'Mouse inalámbrico ergonómico con sensor de alta precisión', 'Periféricos', '0.00', '0.00', 5, '2025-09-30 22:15:09', NULL, 1, NULL, NULL, '2025-09-30 22:15:09', '2025-09-30 22:15:09', 'MOU-LOG-001', 'Logitech', 'MX Master 3', 25, 24, '2025-09-30 22:15:09', '350000.00'),
(46, 'Teclado Mecánico Corsair K70', 'Teclado mecánico RGB con switches Cherry MX', 'Periféricos', '0.00', '0.00', 5, '2025-09-30 22:15:09', NULL, 1, NULL, NULL, '2025-09-30 22:15:09', '2025-09-30 22:15:09', 'TEC-COR-001', 'Corsair', 'K70 RGB', 15, 12, '2025-09-30 22:15:09', '450000.00'),
(47, 'Monitor LG 27 4K', 'Monitor LG 27 pulgadas resolución 4K UHD', 'Monitores', '0.00', '0.00', 3, '2025-09-30 22:15:09', NULL, 1, NULL, NULL, '2025-09-30 22:15:09', '2025-09-30 22:15:09', 'MON-LG-001', 'LG', '27UK850', 8, 36, '2025-09-30 22:15:09', '1200000.00'),
(48, 'SSD Samsung 1TB', 'Disco SSD Samsung 970 EVO Plus 1TB NVMe', 'Componentes', '0.00', '0.00', 5, '2025-09-30 22:15:09', NULL, 1, NULL, NULL, '2025-09-30 22:15:09', '2025-09-30 22:15:09', 'SSD-SAM-001', 'Samsung', '970 EVO Plus', 20, 60, '2025-09-30 22:15:09', '450000.00'),
(49, 'dildo', 'negros y gruesos', 'Software', '0.00', '10000000.00', 100, '2025-09-30 22:25:35', NULL, 1, NULL, NULL, '2025-09-30 22:25:35', '2025-09-30 22:33:32', 'prod-01', 'neggritas', 'ricoche', 1000, 12, '2025-09-30 22:25:35', '2000.00'),
(50, 'qwdqwda', 'fasdfasdf', 'Periféricos', '0.00', '1241324.00', 0, '2025-09-30 22:36:51', NULL, 1, NULL, NULL, '2025-09-30 22:36:51', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-09-30 22:36:51', '250000.00'),
(51, 'Laptop HP Pavilion 15', 'Intel Core i5, 8GB RAM, 256GB SSD', 'Laptops', '1200000.00', '1800000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '150000.00'),
(52, 'Laptop Dell Inspiron 14', 'Intel Core i7, 16GB RAM, 512GB SSD', 'Laptops', '1800000.00', '2500000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '220000.00'),
(53, 'Laptop Lenovo ThinkPad', 'Intel Core i5, 8GB RAM, 256GB SSD', 'Laptops', '1500000.00', '2200000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '240000.00'),
(54, 'MacBook Air M1', 'Apple M1, 8GB RAM, 256GB SSD', 'Laptops', '3000000.00', '4200000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '150000.00'),
(55, 'Memoria RAM DDR4 8GB', 'Kingston 3200MHz', 'Componentes', '80000.00', '150000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '230000.00'),
(56, 'Disco SSD 500GB', 'Samsung 870 EVO', 'Componentes', '150000.00', '250000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '130000.00'),
(57, 'Tarjeta Gráfica GTX 1650', 'NVIDIA 4GB GDDR6', 'Componentes', '600000.00', '900000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '210000.00'),
(58, 'Procesador Intel i5', '11va generación', 'Componentes', '400000.00', '650000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '210000.00'),
(59, 'Fuente de Poder 600W', '80 Plus Bronze', 'Componentes', '120000.00', '200000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '190000.00'),
(60, 'Mouse Logitech G502', 'Gaming RGB', 'Accesorios', '80000.00', '150000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '230000.00'),
(61, 'Teclado Mecánico RGB', 'Switches Blue', 'Accesorios', '150000.00', '250000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '160000.00'),
(62, 'Monitor 24\" Full HD', 'Samsung 75Hz', 'Accesorios', '350000.00', '550000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '170000.00'),
(63, 'Webcam Logitech C920', '1080p Full HD', 'Accesorios', '180000.00', '300000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '110000.00'),
(64, 'Audífonos Gamer', 'Sonido 7.1 RGB', 'Accesorios', '100000.00', '180000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '100000.00'),
(65, 'Windows 11 Pro', 'Licencia Original', 'Software', '300000.00', '450000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '230000.00'),
(66, 'Office 365 Personal', 'Suscripción 1 año', 'Software', '150000.00', '250000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '110000.00'),
(67, 'Antivirus Norton', 'Protección 3 dispositivos', 'Software', '80000.00', '150000.00', 0, '2025-10-01 00:06:57', NULL, 1, NULL, NULL, '2025-10-01 00:06:57', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:06:57', '110000.00'),
(68, 'Laptop HP Pavilion 15', 'Intel Core i5, 8GB RAM, 256GB SSD', 'Laptops', '1200000.00', '1800000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '100000.00'),
(69, 'Laptop Dell Inspiron 14', 'Intel Core i7, 16GB RAM, 512GB SSD', 'Laptops', '1800000.00', '2500000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '100000.00'),
(70, 'Laptop Lenovo ThinkPad', 'Intel Core i5, 8GB RAM, 256GB SSD', 'Laptops', '1500000.00', '2200000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '250000.00'),
(71, 'MacBook Air M1', 'Apple M1, 8GB RAM, 256GB SSD', 'Laptops', '3000000.00', '4200000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '220000.00'),
(72, 'Memoria RAM DDR4 8GB', 'Kingston 3200MHz', 'Componentes', '80000.00', '150000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '250000.00'),
(73, 'Disco SSD 500GB', 'Samsung 870 EVO', 'Componentes', '150000.00', '250000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '180000.00'),
(74, 'Tarjeta Gráfica GTX 1650', 'NVIDIA 4GB GDDR6', 'Componentes', '600000.00', '900000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '230000.00'),
(75, 'Procesador Intel i5', '11va generación', 'Componentes', '400000.00', '650000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '190000.00'),
(76, 'Fuente de Poder 600W', '80 Plus Bronze', 'Componentes', '120000.00', '200000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '170000.00'),
(77, 'Mouse Logitech G502', 'Gaming RGB', 'Accesorios', '80000.00', '150000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '160000.00'),
(78, 'Teclado Mecánico RGB', 'Switches Blue', 'Accesorios', '150000.00', '250000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '210000.00'),
(79, 'Monitor 24\" Full HD', 'Samsung 75Hz', 'Accesorios', '350000.00', '550000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '130000.00'),
(80, 'Webcam Logitech C920', '1080p Full HD', 'Accesorios', '180000.00', '300000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '120000.00'),
(81, 'Audífonos Gamer', 'Sonido 7.1 RGB', 'Accesorios', '100000.00', '180000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '240000.00'),
(82, 'Windows 11 Pro', 'Licencia Original', 'Software', '300000.00', '450000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '130000.00'),
(83, 'Office 365 Personal', 'Suscripción 1 año', 'Software', '150000.00', '250000.00', 0, '2025-10-01 00:07:09', NULL, 1, NULL, NULL, '2025-10-01 00:07:09', '2025-10-01 21:47:32', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '160000.00'),
(84, 'Antivirus Nortonia', 'Protección 3 dispositivos', 'Software', '80000.00', '150000.00', 0, '2025-10-01 00:07:09', NULL, 0, NULL, NULL, '2025-10-01 00:07:09', '2025-10-02 02:51:57', NULL, NULL, NULL, 150, 0, '2025-10-01 00:07:09', '140000.00');

-- --------------------------------------------------------

--
-- Table structure for table `proveedores`
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

--
-- Dumping data for table `proveedores`
--

INSERT INTO `proveedores` (`id_proveedor`, `nombre_empresa`, `contacto`, `telefono`, `email`, `direccion`, `categoria`, `fecha_registro`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'PC Gamers S.A.S.', 'Juan Pérez', '3101234567', 'ventas@pcgamers.com', 'Calle Falsa 123, Bogotá', 'Laptops', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(2, 'Tech Accesorios Ltda.', 'Maria Rodriguez', '3112345678', 'contacto@techaccesorios.com', 'Carrera 7 # 8-90, Medellín', 'Accesorios', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(3, 'Vision Global Tech', 'Carlos López', '3123456789', 'info@visionglobal.tech', 'Avenida Siempre Viva 45, Cali', 'Monitores', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(4, 'Componentes de Alta Velocidad', 'Ana Martínez', '3134567890', 'soporte@componentesav.com', 'Diagonal 23 # 45-67, Barranquilla', 'Componentes', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(5, 'Mobiliario Gamer Pro', 'Pedro Gómez', '3145678901', 'ventas@mobiliariogamer.pro', 'Calle 100 # 20-30, Bogotá', 'Mobiliario', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(6, 'Impresiones Modernas', 'Laura Sánchez', '3156789012', 'contacto@impresionesmodernas.com', 'Avenida El Dorado # 68-70, Bogotá', 'Impresoras', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(7, 'Conectividad Total', 'Andrés Jiménez', '3167890123', 'info@conectividadtotal.net', 'Carrera 15 # 85-20, Bogotá', 'Redes', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(8, 'Diseño Digital Creativo', 'Sofia Castro', '3178901234', 'ventas@disenodigital.co', 'Calle 80 # 10-15, Medellín', 'Accesorios', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(9, 'Proyecta Ideas', 'Jorge Ramirez', '3189012345', 'soporte@proyectaideas.com', 'Avenida 6N # 25-30, Cali', 'Proyectores', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(10, 'Sonido Envolvente Pro', 'Lucia Torres', '3190123456', 'info@sonidoenvolvente.pro', 'Carrera 43 # 70-80, Barranquilla', 'Audio', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(11, 'Tecnología Vestible Futura', 'David Garcia', '3201234567', 'ventas@tecnologiavestible.com', 'Calle 93 # 15-20, Bogotá', 'Wearables', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(12, 'Energía Portátil Global', 'Carolina Hernandez', '3212345678', 'contacto@energiaportatil.com', 'Avenida de las Américas # 50-60, Bogotá', 'Accesorios', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(13, 'Protectores de Tecnología', 'Daniel Rojas', '3223456789', 'info@protectoresdetecnologia.com', 'Calle 72 # 7-80, Bogotá', 'Accesorios', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(14, 'Audio Profesional de Estudio', 'Gabriela Vargas', '3234567890', 'soporte@audioprofesional.co', 'Carrera 13 # 35-40, Bogotá', 'Audio', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(15, 'Soluciones de Refrigeración', 'Mateo Diaz', '3001234567', 'ventas@solucionesrefrigeracion.com', 'Calle 26 # 18-25, Bogotá', 'Accesorios', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(16, 'Limpieza Electrónica Pura', 'Valentina Morales', '3012345678', 'contacto@limpiezapure.com', 'Carrera 9 # 110-120, Bogotá', 'Accesorios', '2025-09-30 13:50:30', 1, '2025-09-30 13:50:30', '2025-09-30 13:50:30'),
(17, 'Distribuidora Tech Colombia', 'Juan Pérez', '6013001234', 'ventas@techcol.com', 'Calle 100 #15-20, Bogotá', NULL, '2025-10-01 00:10:13', 1, '2025-10-01 00:10:13', '2025-10-01 00:10:13'),
(18, 'Importadora Digital SAS', 'María González', '6045678901', 'contacto@importadoradigital.com', 'Carrera 43A #1-50, Medellín', NULL, '2025-10-01 00:10:13', 1, '2025-10-01 00:10:13', '2025-10-01 00:10:13'),
(19, 'Mayorista Computadores', 'Carlos Rodríguez', '6023456789', 'info@mayorista.com', 'Avenida 6N #23-45, Cali', NULL, '2025-10-01 00:10:13', 1, '2025-10-01 00:10:13', '2025-10-01 00:10:13'),
(20, 'Suministros Informáticos', 'Ana Martínez', '6053334444', 'ventas@suministros.com', 'Calle 72 #54-32, Barranquilla', NULL, '2025-10-01 00:10:13', 1, '2025-10-01 00:10:13', '2025-10-01 00:10:13'),
(21, 'TechParts Distribuidor', 'Luis Torres', '6062223333', 'contacto@techparts.com', 'Carrera 5 #10-15, Cartagena', NULL, '2025-10-01 00:10:13', 1, '2025-10-01 00:10:13', '2025-10-01 00:10:13'),
(22, 'Componentes PC Colombia', 'Sofia López', '6071112222', 'info@componentespc.com', 'Calle 35 #12-45, Bucaramanga', NULL, '2025-10-01 00:10:13', 1, '2025-10-01 00:10:13', '2025-10-01 00:10:13'),
(23, 'Electrónica y Más', 'Diego Hernández', '6063334444', 'ventas@electronicaymas.com', 'Avenida 30 de Agosto, Pereira', NULL, '2025-10-01 00:10:13', 1, '2025-10-01 00:10:13', '2025-10-01 00:10:13'),
(24, 'Distribuidora Tech Colombia', 'Juan Pérez', '6013001234', 'ventas@techcol.com', 'Calle 100 #15-20, Bogotá', NULL, '2025-10-01 00:10:29', 1, '2025-10-01 00:10:29', '2025-10-01 00:10:29'),
(25, 'Importadora Digital SAS', 'María González', '6045678901', 'contacto@importadoradigital.com', 'Carrera 43A #1-50, Medellín', NULL, '2025-10-01 00:10:29', 1, '2025-10-01 00:10:29', '2025-10-01 00:10:29'),
(26, 'Mayorista Computadores', 'Carlos Rodríguez', '6023456789', 'info@mayorista.com', 'Avenida 6N #23-45, Cali', NULL, '2025-10-01 00:10:29', 1, '2025-10-01 00:10:29', '2025-10-01 00:10:29'),
(27, 'Suministros Informáticos', 'Ana Martínez', '6053334444', 'ventas@suministros.com', 'Calle 72 #54-32, Barranquilla', NULL, '2025-10-01 00:10:29', 1, '2025-10-01 00:10:29', '2025-10-01 00:10:29'),
(28, 'TechParts Distribuidor', 'Luis Torres', '6062223333', 'contacto@techparts.com', 'Carrera 5 #10-15, Cartagena', NULL, '2025-10-01 00:10:29', 1, '2025-10-01 00:10:29', '2025-10-01 00:10:29'),
(29, 'Componentes PC Colombia', 'Sofia López', '6071112222', 'info@componentespc.com', 'Calle 35 #12-45, Bucaramanga', NULL, '2025-10-01 00:10:29', 1, '2025-10-01 00:10:29', '2025-10-01 00:10:29'),
(30, 'Electrónica y Más', 'Diego Hernández', '6063334444', 'ventas@electronicaymas.com', 'Avenida 30 de Agosto, Pereira', NULL, '2025-10-01 00:10:29', 1, '2025-10-01 00:10:29', '2025-10-01 00:10:29'),
(31, 'Distribuidora Tech Colombia', 'Juan Pérez', '6013001234', 'ventas@techcol.com', 'Calle 100 #15-20, Bogotá', NULL, '2025-10-01 00:10:43', 1, '2025-10-01 00:10:43', '2025-10-01 00:10:43'),
(32, 'Importadora Digital SAS', 'María González', '6045678901', 'contacto@importadoradigital.com', 'Carrera 43A #1-50, Medellín', NULL, '2025-10-01 00:10:43', 1, '2025-10-01 00:10:43', '2025-10-01 00:10:43'),
(33, 'Mayorista Computadores', 'Carlos Rodríguez', '6023456789', 'info@mayorista.com', 'Avenida 6N #23-45, Cali', NULL, '2025-10-01 00:10:43', 1, '2025-10-01 00:10:43', '2025-10-01 00:10:43'),
(34, 'Suministros Informáticos', 'Ana Martínez', '6053334444', 'ventas@suministros.com', 'Calle 72 #54-32, Barranquilla', NULL, '2025-10-01 00:10:43', 1, '2025-10-01 00:10:43', '2025-10-01 00:10:43'),
(35, 'TechParts Distribuidor', 'Luis Torres', '6062223333', 'contacto@techparts.com', 'Carrera 5 #10-15, Cartagena', NULL, '2025-10-01 00:10:43', 1, '2025-10-01 00:10:43', '2025-10-01 00:10:43'),
(36, 'Componentes PC Colombia', 'Sofia López', '6071112222', 'info@componentespc.com', 'Calle 35 #12-45, Bucaramanga', NULL, '2025-10-01 00:10:43', 1, '2025-10-01 00:10:43', '2025-10-01 00:10:43'),
(37, 'Electrónica y Más', 'Diego Hernández', '6063334444', 'ventas@electronicaymas.com', 'Avenida 30 de Agosto, Pereira', NULL, '2025-10-01 00:10:43', 1, '2025-10-01 00:10:43', '2025-10-01 00:10:43');

-- --------------------------------------------------------

--
-- Table structure for table `reembolsos`
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
-- Table structure for table `reportes`
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
-- Table structure for table `reseñas`
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
-- Dumping data for table `reseñas`
--

INSERT INTO `reseñas` (`id_reseña`, `id_cliente`, `nombre_cliente`, `email_cliente`, `calificacion`, `titulo`, `comentario`, `tipo_servicio`, `imagen_cliente`, `verificado`, `destacado`, `activo`, `fecha_creacion`, `fecha_actualizacion`, `fecha_rotacion`, `orden_rotacion`) VALUES
(1, NULL, 'carlitos', 'carlitoselmasbonito@gmail.com', 4, 'excelencia', 'holi', 'mantenimiento', NULL, 1, 1, 1, '2025-09-06 18:06:44', '2025-09-06 18:06:44', '0000-00-00', 0),
(2, NULL, 'gerson', 'gersito@gmail.com', 5, 'perras', 'perras me gusta gerson', 'mantenimiento', NULL, 0, 1, 1, '2025-09-10 22:18:59', '2025-09-10 22:18:59', '0000-00-00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `servicios`
--

CREATE TABLE `servicios` (
  `id_servicio` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `tipo_servicio` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_ingreso` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_entrega` timestamp NULL DEFAULT NULL,
  `estado` enum('pendiente','en_proceso','completado','cancelado','recibido','esperando_repuestos','terminado','entregado') DEFAULT 'pendiente',
  `costo` decimal(10,2) DEFAULT 0.00,
  `observaciones` text DEFAULT NULL,
  `marca_modelo` varchar(200) DEFAULT NULL,
  `diagnostico` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `servicios`
--

INSERT INTO `servicios` (`id_servicio`, `id_cliente`, `id_usuario`, `tipo_servicio`, `descripcion`, `fecha_ingreso`, `fecha_entrega`, `estado`, `costo`, `observaciones`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(79, 1, 4, 'Reparación de Laptop', 'Laptop HP no enciende, pantalla negra', '2025-10-01 00:22:53', '2025-10-03 05:00:00', 'recibido', '150000.00', 'Cliente reporta que dejó de funcionar después de actualización', '2025-10-01 00:22:53', '2025-10-01 00:22:53'),
(80, 4, 4, 'Instalación de Software', 'Instalar Windows 11 y Office', '2025-10-01 00:22:53', '2025-10-02 05:00:00', 'recibido', '80000.00', 'Formateo completo solicitado', '2025-10-01 00:22:53', '2025-10-01 00:22:53'),
(81, 5, 6, 'Mantenimiento Preventivo', 'Limpieza y optimización de PC', '2025-10-01 00:22:53', '2025-10-01 05:00:00', 'recibido', '50000.00', NULL, '2025-10-01 00:22:53', '2025-10-01 00:22:53'),
(82, 6, 4, 'Cambio de Disco Duro', 'Reemplazar HDD por SSD 500GB', '2025-10-01 00:22:53', '2025-10-02 05:00:00', 'en_proceso', '300000.00', 'Disco duro con sectores dañados', '2025-10-01 00:22:53', '2025-10-01 00:22:53'),
(83, 7, 6, 'Reparación de Pantalla', 'Pantalla rota en laptop Dell', '2025-10-01 00:22:53', '2025-10-04 05:00:00', 'en_proceso', '250000.00', 'Esperando repuesto', '2025-10-01 00:22:53', '2025-10-01 00:22:53'),
(84, 8, 7, 'Actualización de RAM', 'Ampliar memoria de 8GB a 16GB', '2025-10-01 00:22:53', '2025-09-30 05:00:00', 'en_proceso', '180000.00', 'Cliente solicita mayor rendimiento', '2025-10-01 00:22:53', '2025-10-01 00:22:53'),
(85, 9, 4, 'Cambio de Teclado', 'Teclado con teclas dañadas', '2025-10-01 00:22:53', '2025-10-05 05:00:00', 'esperando_repuestos', '120000.00', 'Repuesto en camino', '2025-10-01 00:22:53', '2025-10-01 00:22:53'),
(86, 10, 6, 'Instalación de Antivirus', 'Norton 360 Premium', '2025-10-01 00:22:53', '2025-09-29 05:00:00', 'terminado', '60000.00', 'Servicio completado satisfactoriamente', '2025-10-01 00:22:53', '2025-10-01 00:22:53'),
(87, 11, 7, 'Limpieza de Virus', 'Eliminación de malware', '2025-10-01 00:22:53', '2025-09-28 05:00:00', 'terminado', '80000.00', 'Sistema limpio y optimizado', '2025-10-01 00:22:53', '2025-10-01 00:22:53'),
(88, 12, 4, 'Reparación de Fuente', 'Cambio de fuente de poder', '2025-10-01 00:22:53', '2025-09-25 05:00:00', 'entregado', '150000.00', 'Cliente satisfecho', '2025-10-01 00:22:53', '2025-10-01 00:22:53'),
(89, 1, 6, 'Formateo Completo', 'Reinstalación de sistema operativo', '2025-10-01 00:22:54', '2025-09-23 05:00:00', 'entregado', '100000.00', 'Incluye instalación de drivers', '2025-10-01 00:22:54', '2025-10-01 00:22:54');

-- --------------------------------------------------------

--
-- Table structure for table `servicios_catalogo`
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

--
-- Dumping data for table `servicios_catalogo`
--

INSERT INTO `servicios_catalogo` (`id`, `categoria_id`, `nombre`, `descripcion`, `descripcion_detallada`, `precio_base`, `tiempo_estimado`, `garantia`, `estado`, `imagen`, `caracteristicas`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(94, 9, 'Mantenimiento Básico de PC', 'Limpieza interna y externa, y optimización de software.', 'Incluye limpieza de componentes, cambio de pasta térmica, optimización del sistema operativo y eliminación de malware.', '150000.00', '1-2 horas', '30 días', 'disponible', 'img/mantenimiento_basico.jpg', '{\"componentes\": [\"CPU\", \"GPU\", \"RAM\"], \"software\": [\"Antivirus\", \"Optimizador\"]}', '2025-09-30 13:52:55', '2025-09-30 13:52:55'),
(95, 9, 'Mantenimiento Avanzado de Servidores', 'Revisión completa de hardware y software para servidores.', 'Incluye diagnóstico de hardware, actualización de firmware, configuración de RAID y monitoreo de rendimiento.', '800000.00', '4-6 horas', '90 días', 'disponible', 'img/mantenimiento_servidores.jpg', '{\"componentes\": [\"RAID\", \"Fuente de poder redundante\"], \"software\": [\"Windows Server\", \"Linux\"]}', '2025-09-30 13:52:55', '2025-09-30 13:52:55'),
(96, 10, 'Reparación de Placa Base', 'Diagnóstico y reparación de fallas en la placa base.', 'Incluye reemplazo de capacitores, reparación de pistas y soldadura de componentes.', '400000.00', '3-5 días', '60 días', 'disponible', 'img/reparacion_placa.jpg', '{\"componentes\": [\"Capacitores\", \"Circuitos integrados\"], \"marcas\": [\"ASUS\", \"Gigabyte\", \"MSI\"]}', '2025-09-30 13:52:55', '2025-09-30 13:52:55'),
(97, 10, 'Recuperación de Datos', 'Recuperación de datos de discos duros dañados.', 'Utilizamos software y hardware especializado para recuperar información de discos duros mecánicos y SSD.', '600000.00', '2-7 días', 'N/A', 'disponible', 'img/recuperacion_datos.jpg', '{\"dispositivos\": [\"HDD\", \"SSD\", \"USB\"], \"sistemas_archivos\": [\"NTFS\", \"FAT32\", \"ext4\"]}', '2025-09-30 13:52:55', '2025-09-30 13:52:55'),
(98, 11, 'Instalación de Redes Domésticas', 'Diseño e instalación de redes Wi-Fi y cableadas para el hogar.', 'Incluye configuración de router, puntos de acceso y seguridad de red.', '250000.00', '2-3 horas', '30 días', 'disponible', 'img/instalacion_red_hogar.jpg', '{\"equipos\": [\"Router\", \"Switch\", \"Access Point\"], \"tecnologias\": [\"Wi-Fi 6\", \"Ethernet\"]}', '2025-09-30 13:52:55', '2025-09-30 13:52:55'),
(99, 11, 'Instalación de Software a Medida', 'Instalación y configuración de software empresarial.', 'Nos adaptamos a las necesidades de tu negocio para instalar y configurar el software que necesitas.', '500000.00', '4-8 horas', '60 días', 'disponible', 'img/instalacion_software_medida.jpg', '{\"software\": [\"CRM\", \"ERP\", \"Software contable\"], \"plataformas\": [\"Windows\", \"Linux\", \"macOS\"]}', '2025-09-30 13:52:55', '2025-09-30 13:52:55'),
(100, 12, 'Consultoría en Seguridad Informática', 'Análisis de vulnerabilidades y recomendaciones de seguridad.', 'Realizamos un análisis exhaustivo de tu infraestructura para identificar y mitigar riesgos de seguridad.', '1000000.00', '1-2 semanas', 'N/A', 'disponible', 'img/consultoria_seguridad.jpg', '{\"areas\": [\"Pentesting\", \"Análisis de malware\", \"Políticas de seguridad\"], \"normativas\": [\"ISO 27001\", \"GDPR\"]}', '2025-09-30 13:52:55', '2025-09-30 13:52:55'),
(101, 12, 'Consultoría para Migración a la Nube', 'Asesoramiento para migrar tu infraestructura a la nube.', 'Te ayudamos a elegir la plataforma cloud adecuada y a planificar la migración de tus servicios y datos.', '1500000.00', '2-4 semanas', 'N/A', 'disponible', 'img/consultoria_nube.jpg', '{\"plataformas\": [\"AWS\", \"Azure\", \"Google Cloud\"], \"servicios\": [\"IaaS\", \"PaaS\", \"SaaS\"]}', '2025-09-30 13:52:55', '2025-09-30 13:52:55');

-- --------------------------------------------------------

--
-- Table structure for table `tecnicos`
--

CREATE TABLE `tecnicos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `especialidades` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`especialidades`)),
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `estado` enum('disponible','ocupado','inactivo') DEFAULT 'disponible',
  `calificacion_promedio` decimal(3,2) DEFAULT 0.00,
  `total_servicios` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tecnicos`
--

INSERT INTO `tecnicos` (`id`, `id_usuario`, `nombre`, `especialidades`, `telefono`, `email`, `estado`, `calificacion_promedio`, `total_servicios`) VALUES
(1, NULL, 'Carlos Mendoza', '[\"Mantenimiento\", \"Reparación\", \"Instalación\"]', '3201234567', 'carlos@computec.com', 'disponible', '4.80', 150),
(2, NULL, 'Ana Rodríguez', '[\"Reparación\", \"Consultoría\"]', '3202345678', 'ana@computec.com', 'disponible', '4.90', 120),
(3, NULL, 'Luis García', '[\"Instalación\", \"Mantenimiento\"]', '3203456789', 'luis@computec.com', 'disponible', '4.70', 95),
(4, NULL, 'María López', '[\"Consultoría\", \"Auditoría\"]', '3204567890', 'maria@computec.com', 'disponible', '4.90', 80),
(5, NULL, 'Carlos Mendoza', '[\"Mantenimiento\", \"Reparación\", \"Instalación\"]', '3201234567', 'carlos@computec.com', 'disponible', '4.80', 150),
(6, NULL, 'Ana Rodríguez', '[\"Reparación\", \"Consultoría\"]', '3202345678', 'ana@computec.com', 'disponible', '4.90', 120),
(7, NULL, 'Luis García', '[\"Instalación\", \"Mantenimiento\"]', '3203456789', 'luis@computec.com', 'disponible', '4.70', 95),
(8, NULL, 'María López', '[\"Consultoría\", \"Auditoría\"]', '3204567890', 'maria@computec.com', 'disponible', '4.90', 80),
(9, NULL, 'Carlos Mendoza', '[\"Mantenimiento\", \"Reparación\", \"Instalación\"]', '3201234567', 'carlos@computec.com', 'disponible', '4.80', 150),
(10, NULL, 'Ana Rodríguez', '[\"Reparación\", \"Consultoría\"]', '3202345678', 'ana@computec.com', 'disponible', '4.90', 120),
(11, NULL, 'Luis García', '[\"Instalación\", \"Mantenimiento\"]', '3203456789', 'luis@computec.com', 'disponible', '4.70', 95),
(12, NULL, 'María López', '[\"Consultoría\", \"Auditoría\"]', '3204567890', 'maria@computec.com', 'disponible', '4.90', 80),
(13, NULL, 'Carlos Mendoza', '[\"Mantenimiento\", \"Reparación\", \"Instalación\"]', '3201234567', 'carlos@computec.com', 'disponible', '4.80', 150),
(14, NULL, 'Ana Rodríguez', '[\"Reparación\", \"Consultoría\"]', '3202345678', 'ana@computec.com', 'disponible', '4.90', 120),
(15, NULL, 'Luis García', '[\"Instalación\", \"Mantenimiento\"]', '3203456789', 'luis@computec.com', 'disponible', '4.70', 95),
(16, NULL, 'María López', '[\"Consultoría\", \"Auditoría\"]', '3204567890', 'maria@computec.com', 'disponible', '4.90', 80),
(17, NULL, 'Carlos Mendoza', '[\"Mantenimiento\", \"Reparación\", \"Instalación\"]', '3201234567', 'carlos@computec.com', 'disponible', '4.80', 150),
(18, NULL, 'Ana Rodríguez', '[\"Reparación\", \"Consultoría\"]', '3202345678', 'ana@computec.com', 'disponible', '4.90', 120),
(19, NULL, 'Luis García', '[\"Instalación\", \"Mantenimiento\"]', '3203456789', 'luis@computec.com', 'disponible', '4.70', 95),
(20, NULL, 'María López', '[\"Consultoría\", \"Auditoría\"]', '3204567890', 'maria@computec.com', 'disponible', '4.90', 80);

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id_ticket` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `asunto` varchar(200) NOT NULL,
  `descripcion` text NOT NULL,
  `prioridad` enum('baja','media','alta') DEFAULT 'media',
  `estado` enum('abierto','en_proceso','resuelto','cerrado') DEFAULT 'abierto',
  `id_asignado` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id_ticket`, `id_cliente`, `asunto`, `descripcion`, `prioridad`, `estado`, `id_asignado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 13, 'Laptop no enciende después de actualización', 'Después de instalar Windows Update, la laptop no arranca. Pantalla negra.', 'alta', 'abierto', 4, '2025-10-01 00:26:19', '2025-10-01 00:26:19'),
(2, 14, 'Consulta sobre garantía de producto', '¿La laptop comprada hace 2 meses tiene garantía por pantalla?', 'baja', 'abierto', 7, '2025-10-01 00:26:19', '2025-10-01 00:26:19'),
(3, 15, 'Problema con instalación de Office', 'No puedo activar Office 365, aparece error de licencia', 'media', 'abierto', NULL, '2025-10-01 00:26:19', '2025-10-01 00:26:19'),
(4, 16, 'Computador muy lento', 'El PC tarda mucho en iniciar y abrir programas', 'media', 'en_proceso', 5, '2025-10-01 00:26:19', '2025-10-01 00:26:19'),
(5, 17, 'Virus detectado', 'Antivirus detectó amenazas, necesito ayuda para eliminarlas', 'alta', 'en_proceso', 4, '2025-10-01 00:26:19', '2025-10-01 00:26:19'),
(6, 18, 'Configuración de red', 'No puedo conectarme a la red WiFi de la oficina', 'media', 'en_proceso', 6, '2025-10-01 00:26:19', '2025-10-01 00:26:19'),
(7, 19, 'Pérdida de datos', 'Se borraron archivos importantes, ¿se pueden recuperar?', 'alta', 'en_proceso', 5, '2025-10-01 00:26:19', '2025-10-01 00:26:19'),
(8, 20, 'Instalación de impresora', 'Necesito ayuda para instalar impresora HP', 'baja', 'resuelto', 7, '2025-10-01 00:26:19', '2025-10-01 00:26:19'),
(9, 21, 'Actualización de drivers', 'Drivers de tarjeta gráfica desactualizados', 'media', 'resuelto', 6, '2025-10-01 00:26:19', '2025-10-01 00:26:19'),
(10, 22, 'Problema con audio', 'No se escucha audio en laptop', 'media', 'resuelto', 4, '2025-10-01 00:26:19', '2025-10-01 00:26:19'),
(11, 13, 'Consulta sobre precios', 'Información sobre costo de reparación', 'baja', 'cerrado', 7, '2025-10-01 00:26:19', '2025-10-01 00:26:19'),
(12, 14, 'Cambio de contraseña', 'Olvidé mi contraseña de Windows', 'baja', 'cerrado', 5, '2025-10-01 00:26:19', '2025-10-01 00:26:19');

-- --------------------------------------------------------

--
-- Table structure for table `tickets_comentarios`
--

CREATE TABLE `tickets_comentarios` (
  `id_comentario` int(11) NOT NULL,
  `id_ticket` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets_comentarios`
--

INSERT INTO `tickets_comentarios` (`id_comentario`, `id_ticket`, `id_usuario`, `comentario`, `fecha_creacion`) VALUES
(1, 1, 4, 'Hola, voy a revisar el problema. ¿Puedes traer la laptop mañana?', '2025-10-01 00:26:19'),
(2, 1, 13, 'Sí, la llevo mañana a las 10am', '2025-10-01 00:26:19'),
(3, 4, 5, 'He revisado el equipo. Necesita limpieza de archivos temporales y optimización.', '2025-10-01 00:26:19'),
(4, 4, 5, 'Iniciando proceso de limpieza y desfragmentación.', '2025-10-01 00:26:19'),
(5, 4, 16, 'Perfecto, ¿cuánto tiempo tomará?', '2025-10-01 00:26:19'),
(6, 4, 5, 'Aproximadamente 2 horas. Te aviso cuando esté listo.', '2025-10-01 00:26:19'),
(7, 5, 4, 'Detecté malware. Ejecutando análisis completo del sistema.', '2025-10-01 00:26:19'),
(8, 5, 4, 'Sistema limpio. Instalé protección adicional.', '2025-10-01 00:26:19'),
(9, 5, 17, 'Muchas gracias! ¿Qué antivirus recomiendas?', '2025-10-01 00:26:19'),
(10, 5, 4, 'Te recomiendo Norton 360 o Kaspersky Total Security.', '2025-10-01 00:26:19'),
(11, 8, 7, 'La impresora está instalada correctamente. Realicé prueba de impresión.', '2025-10-01 00:26:19'),
(12, 8, 20, 'Excelente! Funciona perfectamente. Gracias!', '2025-10-01 00:26:19'),
(13, 10, 4, 'El problema era el driver de audio. Ya está solucionado.', '2025-10-01 00:26:19'),
(14, 10, 22, 'Confirmado, ya funciona el audio. Muchas gracias!', '2025-10-01 00:26:19');

-- --------------------------------------------------------

--
-- Table structure for table `tipo_usuario`
--

CREATE TABLE `tipo_usuario` (
  `id_tipo_usuario` int(11) NOT NULL,
  `nombre_tipo` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tipo_usuario`
--

INSERT INTO `tipo_usuario` (`id_tipo_usuario`, `nombre_tipo`, `descripcion`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Administrador', 'Acceso total al sistema. Puede gestionar usuarios, configuraciones y todo el contenido.', 1, '2025-07-17 20:21:36', '2025-09-30 18:22:07'),
(2, 'Gestor de Tienda', 'Gestiona productos, inventario, servicios y órdenes de la tienda.', 1, '2025-07-17 20:21:36', '2025-09-30 18:22:07'),
(3, 'Auxiliar', 'Gestiona el contenido no comercial como noticias, páginas de contacto y modera comentarios.', 1, '2025-07-17 20:21:36', '2025-09-30 23:22:55'),
(4, 'Técnico', 'Personal de servicio que puede ver y actualizar las órdenes de servicio asignadas.', 1, '2025-07-17 20:21:36', '2025-09-30 18:22:07'),
(5, 'Cliente', 'Usuario registrado que puede realizar compras y ver su historial.', 1, '2025-07-17 20:21:36', '2025-09-30 18:22:07');

-- --------------------------------------------------------

--
-- Table structure for table `transacciones_pago`
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
-- Table structure for table `usuarios`
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
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `email`, `password`, `telefono`, `fecha_registro`, `activo`, `id_tipo_usuario`, `ultimo_acceso`, `intentos_fallidos`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'viticor', 'Sistema', 'admin@computec.com', '$2y$10$SE64L50na.3r9Q4f.h04OeSS7rUPOv3C8WNhawdOrGcd2/jmLSaie', '3001234567', '2025-09-30 20:37:12', 1, 1, '2025-10-02 02:51:32', 0, '2025-09-30 20:37:12', '2025-10-02 02:51:32'),
(2, 'Carlos', 'Vendedor', 'vendedor@computec.com', '$2y$10$SE64L50na.3r9Q4f.h04OeSS7rUPOv3C8WNhawdOrGcd2/jmLSaie', '3009876543', '2025-09-30 20:37:12', 1, 2, '2025-09-30 23:22:07', 0, '2025-09-30 20:37:12', '2025-09-30 23:22:07'),
(3, 'Laura', 'Editor', 'editor@computec.com', '$2y$10$SE64L50na.3r9Q4f.h04OeSS7rUPOv3C8WNhawdOrGcd2/jmLSaie', '3005551234', '2025-09-30 20:37:12', 1, 3, NULL, 0, '2025-09-30 20:37:12', '2025-09-30 20:37:12'),
(4, 'Juan', 'Técnico', 'tecnico@computec.com', '$2y$10$SE64L50na.3r9Q4f.h04OeSS7rUPOv3C8WNhawdOrGcd2/jmLSaie', '3007778888', '2025-09-30 20:37:12', 1, 4, '2025-10-01 22:14:34', 0, '2025-09-30 20:37:12', '2025-10-01 22:14:34'),
(5, 'jose', 'Cliente', 'cliente@computec.com', '$2y$10$SE64L50na.3r9Q4f.h04OeSS7rUPOv3C8WNhawdOrGcd2/jmLSaie', '3003334444', '2025-09-30 20:37:12', 1, 5, '2025-10-02 02:35:37', 0, '2025-09-30 20:37:12', '2025-10-02 02:35:37'),
(6, 'asdfadf', 'adsfads', 'asdfasdf', 'asdfasdf', 'adfadsf', '2025-10-01 00:13:07', 1, 4, NULL, 0, '2025-10-01 00:13:07', '2025-10-01 00:13:07'),
(7, 'Juan', 'Pérez', 'tecnico1@computec.com', '$2y$10$SE64L50na.3r9Q4f.h04OeSS7rUPOv3C8WNhawdOrGcd2/jmLSaie', '3001234567', '2025-10-01 00:06:16', 1, 4, NULL, 0, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(8, 'María', 'González', 'tecnico2@computec.com', '$2y$10$SE64L50na.3r9Q4f.h04OeSS7rUPOv3C8WNhawdOrGcd2/jmLSaie', '3009876543', '2025-10-01 00:06:16', 1, 4, NULL, 0, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(9, 'Pedro', 'Ramírez', 'tecnico3@computec.com', '$2y$10$SE64L50na.3r9Q4f.h04OeSS7rUPOv3C8WNhawdOrGcd2/jmLSaie', '3005551234', '2025-10-01 00:06:16', 1, 4, NULL, 0, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(10, 'Ana', 'Martínez', 'auxiliar1@computec.com', '$2y$10$SE64L50na.3r9Q4f.h04OeSS7rUPOv3C8WNhawdOrGcd2/jmLSaie', '3007778888', '2025-10-01 00:06:16', 1, 3, NULL, 0, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(11, 'Luis', 'Torres', 'auxiliar2@computec.com', '$2y$10$SE64L50na.3r9Q4f.h04OeSS7rUPOv3C8WNhawdOrGcd2/jmLSaie', '3006665555', '2025-10-01 00:06:16', 1, 3, NULL, 0, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(12, 'Carlos', 'Rodríguez', 'cliente1@gmail.com', '$2y$10$SE64L50na.3r9Q4f.h04OeSS7rUPOv3C8WNhawdOrGcd2/jmLSaie', '3001112222', '2025-10-01 00:06:16', 1, 5, NULL, 0, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(13, 'Sofia', 'López', 'cliente2@gmail.com', '$2y$10$SE64L50na.3r9Q4f.h04OeSS7rUPOv3C8WNhawdOrGcd2/jmLSaie', '3003334444', '2025-10-01 00:06:16', 1, 5, NULL, 0, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(14, 'Diego', 'Hernández', 'cliente3@gmail.com', '$2y$10$SE64L50na.3r9Q4f.h04OeSS7rUPOv3C8WNhawdOrGcd2/jmLSaie', '3005556666', '2025-10-01 00:06:16', 1, 5, NULL, 0, '2025-10-01 00:06:16', '2025-10-01 00:06:16'),
(26, 'adfadsf', 'asdfadsf', 'adfas@gmail.com', '$2y$10$.7prDpspP6BUjSXSUIAXLeG.HJ37sajyJvNuu98GaTqbbbDorkatW', NULL, '2025-10-01 07:43:01', 1, 5, '2025-10-01 00:43:26', 0, '2025-10-01 00:43:01', '2025-10-01 00:43:26'),
(27, 'miguel', 'el verga2', 'miguel@gmail.com', '$2y$10$3HGZ8PECJVE7hj5RBJ4PWOVmYVF4AhQdtwb3./HvA8L6kTtkN64v2', '3203550004', '2025-10-01 08:16:37', 1, 5, '2025-10-01 03:30:30', 0, '2025-10-01 03:16:37', '2025-10-01 22:13:56'),
(28, 'samuel', 'portilla', 'samuxd@gmail.com', '$2y$10$7xsMiBLRTFNHSnRoasoG.elSFzgMJYxxWPz9bXHY2e4XvxHg5ckK6', '320908097654', '2025-10-01 08:19:27', 1, 5, '2025-10-01 03:19:47', 0, '2025-10-01 03:19:27', '2025-10-01 03:19:47');

-- --------------------------------------------------------

--
-- Table structure for table `ventas`
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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anuncios`
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
-- Indexes for table `asignaciones_tecnicos`
--
ALTER TABLE `asignaciones_tecnicos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orden_id` (`orden_id`),
  ADD KEY `tecnico_id` (`tecnico_id`);

--
-- Indexes for table `asignacion_modulo`
--
ALTER TABLE `asignacion_modulo`
  ADD PRIMARY KEY (`id_asignacion`),
  ADD UNIQUE KEY `unique_usuario_modulo` (`id_usuario`,`id_modulo`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_modulo` (`id_modulo`);

--
-- Indexes for table `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id_auditoria`);

--
-- Indexes for table `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_carrito`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `estado` (`estado`);

--
-- Indexes for table `carrito_items`
--
ALTER TABLE `carrito_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_carrito` (`id_carrito`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `categorias_servicios`
--
ALTER TABLE `categorias_servicios`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id_cita`),
  ADD KEY `idx_fecha_cita` (`fecha_cita`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_cliente` (`id_cliente`),
  ADD KEY `idx_usuario` (`id_usuario`);

--
-- Indexes for table `clientes`
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
-- Indexes for table `configuracion_pagos`
--
ALTER TABLE `configuracion_pagos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_pasarela` (`pasarela`);

--
-- Indexes for table `contacto`
--
ALTER TABLE `contacto`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cotizaciones`
--
ALTER TABLE `cotizaciones`
  ADD PRIMARY KEY (`id_cotizacion`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indexes for table `cotizaciones_items`
--
ALTER TABLE `cotizaciones_items`
  ADD PRIMARY KEY (`id_item`),
  ADD KEY `id_cotizacion` (`id_cotizacion`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indexes for table `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id_detalle_venta`),
  ADD KEY `idx_venta` (`id_venta`),
  ADD KEY `idx_producto` (`id_producto`);

--
-- Indexes for table `estadisticas_web`
--
ALTER TABLE `estadisticas_web`
  ADD PRIMARY KEY (`id_estadistica`),
  ADD KEY `idx_tipo_estadistica` (`tipo_estadistica`),
  ADD KEY `idx_elemento` (`elemento_id`,`elemento_tipo`),
  ADD KEY `idx_fecha_registro` (`fecha_registro`),
  ADD KEY `idx_estadisticas_fecha_tipo` (`fecha_registro`,`tipo_estadistica`);

--
-- Indexes for table `eventos`
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
-- Indexes for table `facturas`
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
-- Indexes for table `garantias`
--
ALTER TABLE `garantias`
  ADD PRIMARY KEY (`id_garantia`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha_vencimiento` (`fecha_vencimiento`),
  ADD KEY `idx_servicio` (`id_servicio`),
  ADD KEY `idx_venta` (`id_venta`);

--
-- Indexes for table `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inventario`),
  ADD UNIQUE KEY `unique_producto` (`id_producto`),
  ADD KEY `idx_stock_actual` (`stock_actual`),
  ADD KEY `idx_ubicacion` (`ubicacion`);

--
-- Indexes for table `modulos`
--
ALTER TABLE `modulos`
  ADD PRIMARY KEY (`id_modulo`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_orden` (`orden`);

--
-- Indexes for table `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tipo` (`tipo`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha_envio` (`fecha_envio`),
  ADD KEY `idx_notificaciones_destinatario` (`destinatario`),
  ADD KEY `idx_notificaciones_fecha_creacion` (`fecha_creacion`);

--
-- Indexes for table `ordenes_servicios`
--
ALTER TABLE `ordenes_servicios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_orden` (`numero_orden`),
  ADD KEY `idx_ordenes_cliente` (`cliente_id`),
  ADD KEY `idx_ordenes_estado` (`estado`),
  ADD KEY `idx_ordenes_fecha` (`fecha_orden`);

--
-- Indexes for table `ordenes_servicios_detalles`
--
ALTER TABLE `ordenes_servicios_detalles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orden_id` (`orden_id`),
  ADD KEY `servicio_id` (`servicio_id`);

--
-- Indexes for table `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pagos_orden` (`orden_id`),
  ADD KEY `idx_metodo_pago` (`metodo_pago`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha_transaccion` (`fecha_transaccion`);

--
-- Indexes for table `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `id_proveedor` (`id_proveedor`),
  ADD KEY `idx_nombre` (`nombre`),
  ADD KEY `idx_categoria` (`categoria`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_codigo_barras` (`codigo_barras`);

--
-- Indexes for table `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`),
  ADD KEY `idx_nombre_empresa` (`nombre_empresa`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_categoria` (`categoria`);

--
-- Indexes for table `reembolsos`
--
ALTER TABLE `reembolsos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pago_id` (`pago_id`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha_solicitud` (`fecha_solicitud`);

--
-- Indexes for table `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id_reporte`),
  ADD KEY `idx_tipo_reporte` (`tipo_reporte`),
  ADD KEY `idx_fecha_generacion` (`fecha_generacion`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_usuario` (`id_usuario`);

--
-- Indexes for table `reseñas`
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
-- Indexes for table `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id_servicio`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha_ingreso` (`fecha_ingreso`),
  ADD KEY `idx_cliente` (`id_cliente`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_servicios_estado_fecha` (`estado`,`fecha_ingreso`);

--
-- Indexes for table `servicios_catalogo`
--
ALTER TABLE `servicios_catalogo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_servicios_catalogo_categoria` (`categoria_id`),
  ADD KEY `idx_servicios_catalogo_estado` (`estado`);

--
-- Indexes for table `tecnicos`
--
ALTER TABLE `tecnicos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id_ticket`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_asignado` (`id_asignado`);

--
-- Indexes for table `tickets_comentarios`
--
ALTER TABLE `tickets_comentarios`
  ADD PRIMARY KEY (`id_comentario`),
  ADD KEY `id_ticket` (`id_ticket`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  ADD PRIMARY KEY (`id_tipo_usuario`),
  ADD UNIQUE KEY `nombre_tipo` (`nombre_tipo`);

--
-- Indexes for table `transacciones_pago`
--
ALTER TABLE `transacciones_pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pago_id` (`pago_id`),
  ADD KEY `idx_tipo_evento` (`tipo_evento`),
  ADD KEY `idx_fecha_evento` (`fecha_evento`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_tipo_usuario` (`id_tipo_usuario`);

--
-- Indexes for table `ventas`
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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anuncios`
--
ALTER TABLE `anuncios`
  MODIFY `id_anuncio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `asignaciones_tecnicos`
--
ALTER TABLE `asignaciones_tecnicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `asignacion_modulo`
--
ALTER TABLE `asignacion_modulo`
  MODIFY `id_asignacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=252;

--
-- AUTO_INCREMENT for table `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id_auditoria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `carrito_items`
--
ALTER TABLE `carrito_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `categorias_servicios`
--
ALTER TABLE `categorias_servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `citas`
--
ALTER TABLE `citas`
  MODIFY `id_cita` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `configuracion_pagos`
--
ALTER TABLE `configuracion_pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `contacto`
--
ALTER TABLE `contacto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cotizaciones`
--
ALTER TABLE `cotizaciones`
  MODIFY `id_cotizacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `cotizaciones_items`
--
ALTER TABLE `cotizaciones_items`
  MODIFY `id_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id_detalle_venta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `estadisticas_web`
--
ALTER TABLE `estadisticas_web`
  MODIFY `id_estadistica` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `facturas`
--
ALTER TABLE `facturas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `garantias`
--
ALTER TABLE `garantias`
  MODIFY `id_garantia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inventario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `modulos`
--
ALTER TABLE `modulos`
  MODIFY `id_modulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ordenes_servicios`
--
ALTER TABLE `ordenes_servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ordenes_servicios_detalles`
--
ALTER TABLE `ordenes_servicios_detalles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `reembolsos`
--
ALTER TABLE `reembolsos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id_reporte` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reseñas`
--
ALTER TABLE `reseñas`
  MODIFY `id_reseña` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `servicios_catalogo`
--
ALTER TABLE `servicios_catalogo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `tecnicos`
--
ALTER TABLE `tecnicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id_ticket` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tickets_comentarios`
--
ALTER TABLE `tickets_comentarios`
  MODIFY `id_comentario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  MODIFY `id_tipo_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `transacciones_pago`
--
ALTER TABLE `transacciones_pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `anuncios`
--
ALTER TABLE `anuncios`
  ADD CONSTRAINT `anuncios_ibfk_1` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Constraints for table `asignaciones_tecnicos`
--
ALTER TABLE `asignaciones_tecnicos`
  ADD CONSTRAINT `asignaciones_tecnicos_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_servicios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `asignaciones_tecnicos_ibfk_2` FOREIGN KEY (`tecnico_id`) REFERENCES `tecnicos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `asignacion_modulo`
--
ALTER TABLE `asignacion_modulo`
  ADD CONSTRAINT `asignacion_modulo_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `asignacion_modulo_ibfk_2` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`) ON DELETE CASCADE;

--
-- Constraints for table `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE;

--
-- Constraints for table `carrito_items`
--
ALTER TABLE `carrito_items`
  ADD CONSTRAINT `carrito_items_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_carrito`) ON DELETE CASCADE;

--
-- Constraints for table `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Constraints for table `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_venta_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Constraints for table `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Constraints for table `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `fk_facturas_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_facturas_orden` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_servicios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `garantias`
--
ALTER TABLE `garantias`
  ADD CONSTRAINT `garantias_ibfk_1` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id_servicio`),
  ADD CONSTRAINT `garantias_ibfk_2` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`);

--
-- Constraints for table `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE;

--
-- Constraints for table `ordenes_servicios_detalles`
--
ALTER TABLE `ordenes_servicios_detalles`
  ADD CONSTRAINT `ordenes_servicios_detalles_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_servicios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ordenes_servicios_detalles_ibfk_2` FOREIGN KEY (`servicio_id`) REFERENCES `servicios_catalogo` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_servicios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`);

--
-- Constraints for table `reembolsos`
--
ALTER TABLE `reembolsos`
  ADD CONSTRAINT `fk_reembolsos_pago` FOREIGN KEY (`pago_id`) REFERENCES `pagos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `reportes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `reseñas`
--
ALTER TABLE `reseñas`
  ADD CONSTRAINT `reseñas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE SET NULL;

--
-- Constraints for table `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `servicios_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `servicios_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `servicios_catalogo`
--
ALTER TABLE `servicios_catalogo`
  ADD CONSTRAINT `servicios_catalogo_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_servicios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tecnicos`
--
ALTER TABLE `tecnicos`
  ADD CONSTRAINT `fk_tecnicos_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `transacciones_pago`
--
ALTER TABLE `transacciones_pago`
  ADD CONSTRAINT `fk_transacciones_pago` FOREIGN KEY (`pago_id`) REFERENCES `pagos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_tipo_usuario`) REFERENCES `tipo_usuario` (`id_tipo_usuario`);

--
-- Constraints for table `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
