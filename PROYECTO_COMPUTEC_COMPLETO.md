# 🖥️ PROYECTO COMPUTEC - SISTEMA COMPLETO

## 📋 DESCRIPCIÓN GENERAL

**Computec** es un sistema integral para una empresa de servicios informáticos que incluye:
- **Sitio web profesional** con diseño moderno y responsive
- **Sistema de gestión interna** con paneles específicos por tipo de usuario
- **Sistema de módulos dinámicos** para control de permisos
- **Base de datos completa** con todas las entidades del negocio

---

## 🏗️ ARQUITECTURA DEL PROYECTO

### **Frontend:**
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS, Grid y Flexbox
- **JavaScript ES6+** - Interactividad y funcionalidades dinámicas
- **Font Awesome** - Iconografía
- **Google Fonts** - Tipografía Inter

### **Backend:**
- **PHP** - Lógica de servidor y APIs
- **MySQL** - Base de datos relacional
- **MySQLi** - Conexión a base de datos con prepared statements

### **Patrones de Diseño:**
- **SPA (Single Page Application)** - Para paneles de usuario
- **API RESTful** - Para comunicación frontend-backend
- **Arquitectura en Capas** - Separación de responsabilidades

---

## 🌐 SITIO WEB PROFESIONAL

### **Características Principales:**
- ✅ **Diseño responsive** para todos los dispositivos
- ✅ **Navegación unificada** con anclas internas
- ✅ **Interfaz moderna** con gradientes y efectos visuales
- ✅ **Formularios interactivos** con validación en tiempo real
- ✅ **Optimización SEO** y accesibilidad

### **Secciones del Sitio:**
1. **🏠 Inicio (Hero)** - Presentación principal con llamadas a la acción
2. **🔧 Servicios** - Reparación, ensamblaje, soporte técnico
3. **🛍️ Productos** - Laptops, PCs, accesorios, componentes
4. **👥 Nosotros** - Información de la empresa y estadísticas
5. **📞 Contacto** - Formulario interactivo y datos de contacto

### **Archivos del Sitio Web:**
- `index.html` - **SPA principal** con todas las secciones integradas
- `css/website-styles.css` - Estilos completos
- `js/website-scripts.js` - Funcionalidades JavaScript

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### **Flujo de Login:**
1. **Usuario ingresa credenciales** en `login.html`
2. **JavaScript envía datos** a `api/login.php`
3. **PHP valida credenciales** contra la base de datos
4. **Respuesta exitosa** almacena datos en `localStorage`
5. **Redirección** a `index.html` con dropdown actualizado
6. **Acceso al panel** específico según tipo de usuario

### **Almacenamiento de Sesión:**
```javascript
localStorage.setItem('userData', JSON.stringify({
    loggedIn: true,
    id: 13,
    name: "Gersson Rubio",
    email: "cliente@gmail.com",
    rol: "Cliente",
    id_tipo_usuario: 6
}));
```

---

## 👥 SISTEMA DE USUARIOS Y PANELES

### **Tipos de Usuario Definidos:**

#### **👑 Administrador (ID: 1)**
- **Panel:** `panel.html` (único para todos)
- **Tema:** Paleta uniforme
- **Permisos:** Acceso completo al sistema
- **Usuario de prueba:** `admin@gmail.com`

#### **💼 Vendedor (ID: 2)**
- **Panel:** `panel.html` (único para todos)
- **Tema:** Paleta uniforme
- **Permisos:** Gestión de ventas y clientes
- **Usuario de prueba:** `vendedor@gmail.com`

#### **🔧 Técnico (ID: 3)**
- **Panel:** `panel.html` (único para todos)
- **Tema:** Paleta uniforme
- **Permisos:** Gestión de servicios y reparaciones
- **Usuario de prueba:** `tecnico@gmail.com`

#### **👁️ Supervisor (ID: 4)**
- **Panel:** `panel.html` (único para todos)
- **Tema:** Paleta uniforme
- **Permisos:** Supervisión y reportes
- **Usuario de prueba:** `supervisor@gmail.com`

#### **📋 Asistente Administrativo (ID: 5)**
- **Panel:** `panel.html` (único para todos)
- **Tema:** Paleta uniforme
- **Permisos:** Gestión de citas y documentos
- **Usuario de prueba:** `auxiliar@gmail.com`

#### **👤 Cliente (ID: 6)**
- **Panel:** `panel.html` (único para todos)
- **Tema:** Paleta uniforme
- **Permisos:** Acceso a su portal personal
- **Usuario de prueba:** `cliente@gmail.com`

---

## 🧩 SISTEMA DE MÓDULOS DINÁMICOS

### **Estructura de Base de Datos:**

#### **Tabla `modulos`:**
```sql
CREATE TABLE `modulos` (
  `id_modulo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_modulo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `icono` varchar(50) DEFAULT NULL,
  `orden` int(11) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
);
```

#### **Tabla `asignacion_modulo`:**
```sql
CREATE TABLE `asignacion_modulo` (
  `id_asignacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_modulo` int(11) NOT NULL,
  `fecha_asignacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
);
```

### **Módulos Disponibles (20 total):**

| ID | Nombre | Descripción | Icono | Asignado a |
|----|--------|-------------|-------|------------|
| 1 | Dashboard | Panel principal del sistema | fas fa-tachometer-alt | Todos |
| 2 | Usuarios | Gestión de usuarios del sistema | fas fa-users | Admin, Supervisor |
| 3 | Clientes | Gestión de clientes | fas fa-user-group | Todos excepto Cliente |
| 4 | Productos | Gestión de productos | fas fa-box | Admin, Vendedor |
| 5 | Servicios | Gestión de servicios técnicos | fas fa-tools | Admin, Técnico, Supervisor |
| 6 | Ventas | Gestión de ventas | fas fa-shopping-cart | Admin, Vendedor, Supervisor |
| 7 | Inventario | Control de inventario | fas fa-warehouse | Admin, Vendedor, Técnico, Supervisor |
| 8 | Citas | Programación de citas | fas fa-calendar | Admin, Asistente |
| 9 | Reportes | Generación de reportes | fas fa-chart-bar | Admin, Supervisor |
| 10 | Configuración | Configuración del sistema | fas fa-cog | Admin |
| 11 | Mis Servicios | Servicios asignados al técnico | fas fa-tools | Técnico, Cliente |
| 12 | Reparaciones | Gestión de reparaciones | fas fa-wrench | Técnico |
| 13 | Proveedores | Gestión de proveedores | fas fa-truck | Admin |
| 14 | Garantías | Gestión de garantías | fas fa-shield-alt | Admin |
| 15 | Facturas | Gestión de facturas | fas fa-file-invoice | Admin, Vendedor, Asistente, Supervisor |
| 16 | Soporte Técnico | Sistema de tickets de soporte | fas fa-headset | Todos |
| 17 | Mi Perfil | Gestión del perfil de usuario | fas fa-user-cog | Todos |
| 18 | Mis Productos | Productos comprados por el cliente | fas fa-shopping-bag | Cliente |
| 19 | Portal Cliente | Portal de acceso para clientes | fas fa-user | Cliente |
| 20 | Supervisión | Panel de supervisión | fas fa-eye | Admin, Supervisor |

### **Asignaciones por Tipo de Usuario:**

#### **👑 Administrador (16 módulos):**
Dashboard, Usuarios, Clientes, Productos, Servicios, Ventas, Inventario, Citas, Reportes, Configuración, Proveedores, Garantías, Facturas, Soporte Técnico, Mi Perfil, Supervisión

#### **💼 Vendedor (7 módulos):**
Dashboard, Clientes, Productos, Ventas, Inventario (solo lectura), Facturas, Mi Perfil

#### **🔧 Técnico (8 módulos):**
Dashboard, Clientes, Servicios, Inventario (solo lectura), Mis Servicios, Reparaciones, Soporte Técnico, Mi Perfil

#### **👁️ Supervisor (11 módulos):**
Dashboard, Usuarios (solo lectura), Clientes, Servicios, Ventas, Inventario, Reportes, Facturas, Mi Perfil, Supervisión

#### **📋 Asistente (6 módulos):**
Dashboard, Clientes, Citas, Facturas, Soporte Técnico, Mi Perfil

#### **👤 Cliente (6 módulos):**
Dashboard, Mis Servicios, Soporte Técnico, Mi Perfil, Mis Productos, Portal Cliente

---

## 🔄 PROCESO DE CARGA DINÁMICA

### **Flujo Completo:**

1. **Inicio de sesión** → `login.html` → `api/login.php` → `localStorage`
2. **Regreso a principal** → `index.html` → dropdown actualizado
3. **Acceso al panel** → `[tipo]-panel.html` → verificación de sesión
4. **Carga de módulos** → `js/modulos.js` → `api/modulos.php` → menú dinámico
5. **Resultado** → Panel completamente funcional con módulos específicos

### **Archivos del Sistema de Módulos:**
- `modulos_manager.php` - Clase PHP para gestión de módulos
- `api/modulos.php` - API RESTful para módulos
- `js/modulos.js` - Clase JavaScript para frontend
- `config/database.php` - Configuración de base de datos

---

## 🗄️ BASE DE DATOS COMPLETA

### **Tablas Principales:**
- `usuarios` - Usuarios del sistema
- `tipo_usuario` - Tipos de usuario disponibles
- `clientes` - Información de clientes
- `productos` - Catálogo de productos
- `servicios` - Servicios técnicos
- `ventas` - Registro de ventas
- `inventario` - Control de stock
- `citas` - Programación de citas
- `modulos` - Módulos del sistema
- `asignacion_modulo` - Asignaciones de módulos
- `proveedores` - Información de proveedores
- `garantias` - Gestión de garantías
- `reportes` - Generación de reportes

### **Vistas Útiles:**
- `v_productos_stock_bajo` - Productos con stock bajo
- `v_servicios_pendientes` - Servicios en proceso
- `v_ventas_hoy` - Ventas del día actual

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
📁 Proyecto/
├── 📄 index.html                    # **SPA principal** del sitio web
├── 📄 login.html                    # Página de autenticación
├── 📄 panel.html                    # Panel único dinámico
├── 📁 config/
│   └── 📄 database.php              # Configuración de BD
├── 📁 api/
│   └── 📄 modulos.php               # API de módulos
├── 📁 js/
│   ├── 📄 modulos.js                # Sistema de módulos frontend
│   ├── 📄 login.js                  # Lógica de autenticación
│   ├── 📄 website-scripts.js        # Scripts del sitio web
│   └── 📄 [otros scripts].js        # Scripts adicionales
├── 📁 css/
│   ├── 📄 website-styles.css        # Estilos del sitio web
│   ├── 📄 login.css                 # Estilos de login
│   └── 📄 [otros estilos].css       # Estilos adicionales
├── 📁 Taller 2/                     # Archivos de desarrollo previo
├── 📄 modulos_manager.php           # Gestor de módulos PHP
├── 📄 sistema_computec.sql          # Estructura completa de BD
└── 📄 PROYECTO_COMPUTEC_COMPLETO.md # Este archivo
```

---

## 🚀 DESPLIEGUE Y CONFIGURACIÓN

### **Configuración Local (XAMPP):**
- **Host:** `localhost`
- **Usuario:** `root`
- **Contraseña:** `""`
- **Base de datos:** `sistema_computec`

### **Configuración Hosting (CWP):**
- **Host:** `localhost`
- **Usuario:** `vcarvaja`
- **Contraseña:** `1127053339`
- **Base de datos:** `vcarvaja_sistema_computec`

### **Archivo de Configuración Automática:**
`config/database.php` detecta automáticamente el entorno y usa las credenciales correctas.

---

## 🧪 PRUEBAS Y VERIFICACIÓN

### **Usuarios de Prueba:**
- **Admin:** `admin@gmail.com` / `123456`
- **Vendedor:** `vendedor@gmail.com` / `123456`
- **Técnico:** `tecnico@gmail.com` / `123456`
- **Supervisor:** `supervisor@gmail.com` / `123456`
- **Asistente:** `auxiliar@gmail.com` / `123456`
- **Cliente:** `cliente@gmail.com` / `123456`

### **Verificaciones Importantes:**
1. ✅ Login y autenticación funcionando
2. ✅ Redirección a paneles correctos
3. ✅ Carga dinámica de módulos
4. ✅ Navegación SPA en paneles
5. ✅ Responsive design en todos los dispositivos
6. ✅ Conexión a base de datos funcionando

---

## 🎯 CARACTERÍSTICAS TÉCNICAS

### **Seguridad:**
- ✅ Prepared statements para prevenir SQL injection
- ✅ Validación de sesiones en cada panel
- ✅ Verificación de permisos por tipo de usuario
- ✅ Escape de datos de salida con `htmlspecialchars`

### **Rendimiento:**
- ✅ Carga dinámica de módulos solo cuando es necesario
- ✅ CSS y JS optimizados
- ✅ Imágenes optimizadas
- ✅ Caché de navegador aprovechado

### **Mantenibilidad:**
- ✅ Código modular y bien organizado
- ✅ Separación de responsabilidades
- ✅ Documentación completa
- ✅ Estructura de archivos clara

---

## 📈 ESTADO ACTUAL DEL PROYECTO

### **✅ COMPLETADO:**
- **Sitio web SPA** completamente funcional
- Sistema de autenticación robusto
- Panel único dinámico para todos los usuarios
- Sistema de módulos dinámicos
- Base de datos completa y optimizada
- Diseño responsive para todos los dispositivos
- API RESTful para comunicación
- Documentación completa

### **🚀 LISTO PARA PRODUCCIÓN:**
- Código limpio y optimizado
- Estructura de archivos organizada
- Configuración automática de entorno
- Sistema de permisos implementado
- Interfaz de usuario moderna y intuitiva

---

## 📞 INFORMACIÓN DE CONTACTO

**Proyecto desarrollado para Computec**
- **Tipo:** Sistema integral de gestión empresarial
- **Tecnologías:** HTML5, CSS3, JavaScript, PHP, MySQL
- **Arquitectura:** Frontend + Backend + Base de datos
- **Estado:** Completado y listo para producción

---

*Documento generado automáticamente - Última actualización: Enero 2025* 