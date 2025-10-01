# 🚀 GUÍA DE DESPLIEGUE - Sistema Computec

## 📋 REQUISITOS DEL HOSTING

- **PHP:** 7.4 o superior
- **MySQL:** 5.7 o superior
- **Espacio:** Mínimo 100 MB
- **Extensiones PHP necesarias:**
  - PDO
  - PDO_MySQL
  - mysqli
  - JSON
  - mbstring

---

## 📦 PASO 1: EXPORTAR LA BASE DE DATOS

1. Abre **phpMyAdmin** → `http://localhost/phpmyadmin`
2. Selecciona la base de datos **`sistema_computec`**
3. Clic en **"Exportar"**
4. Método: **Rápido**
5. Formato: **SQL**
6. Clic en **"Continuar"**
7. Se descargará el archivo `sistema_computec.sql`

---

## 📁 PASO 2: PREPARAR ARCHIVOS DEL PROYECTO

### Archivos/Carpetas a SUBIR:
```
Proyecto/
├── api/                  ✅ Subir
├── config/               ✅ Subir
├── css/                  ✅ Subir
├── js/                   ✅ Subir
├── *.html                ✅ Subir todos los archivos HTML
├── *.php                 ✅ Subir si existen
└── .htaccess             ✅ Crear (ver abajo)
```

### Archivos a NO SUBIR:
```
❌ sistema_computec.sql (solo para importar en el hosting)
❌ datos_prueba_*.sql
❌ corregir_*.sql
❌ limpiar_*.sql
❌ GUIA_DESPLIEGUE.md
```

---

## 🔧 PASO 3: CONFIGURAR EL HOSTING

### A. Crear la Base de Datos en el Hosting

1. Accede al **cPanel** de tu hosting
2. Busca **"MySQL Databases"** o **"Bases de Datos MySQL"**
3. Crea una nueva base de datos:
   - Nombre: `tu_usuario_sistema_computec`
4. Crea un usuario MySQL:
   - Usuario: `tu_usuario_mysql`
   - Contraseña: `tu_password_seguro`
5. **Asigna el usuario a la base de datos** con **TODOS LOS PRIVILEGIOS**
6. Anota estos datos:
   ```
   Host: localhost (o la IP que te den)
   Base de datos: tu_usuario_sistema_computec
   Usuario: tu_usuario_mysql
   Contraseña: tu_password_seguro
   ```

### B. Importar la Base de Datos

1. En cPanel, abre **phpMyAdmin**
2. Selecciona la base de datos que creaste
3. Clic en **"Importar"**
4. Selecciona el archivo `sistema_computec.sql`
5. Clic en **"Continuar"**
6. Espera a que termine la importación

---

## 📝 PASO 4: ACTUALIZAR CONFIGURACIÓN

### Edita el archivo `config/database.php`

Busca las líneas 14-17 y reemplaza con tus datos del hosting:

```php
$host = 'localhost'; // O la IP que te dio el hosting
$dbname = 'tu_usuario_sistema_computec'; // Tu base de datos
$username = 'tu_usuario_mysql'; // Tu usuario MySQL
$password_db = 'tu_password_seguro'; // Tu contraseña MySQL
```

---

## 📤 PASO 5: SUBIR ARCHIVOS AL HOSTING

### Opción A: FileZilla (FTP)

1. Descarga **FileZilla** (https://filezilla-project.org/)
2. Conecta con los datos FTP de tu hosting:
   - Host: `ftp.tudominio.com`
   - Usuario: Tu usuario FTP
   - Contraseña: Tu contraseña FTP
   - Puerto: 21
3. Navega a la carpeta `public_html` o `www`
4. Sube TODA la carpeta `Proyecto` (o su contenido)

### Opción B: Administrador de Archivos (cPanel)

1. Accede a **cPanel**
2. Abre **"Administrador de Archivos"**
3. Navega a `public_html`
4. Clic en **"Cargar"**
5. Comprime tu carpeta `Proyecto` en un ZIP
6. Sube el archivo ZIP
7. Extrae el ZIP en el servidor

---

## 🔐 PASO 6: CREAR ARCHIVO .htaccess

Crea un archivo `.htaccess` en la raíz del proyecto con este contenido:

```apache
# Habilitar reescritura de URLs
RewriteEngine On

# Forzar HTTPS (opcional pero recomendado)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proteger archivos de configuración
<FilesMatch "^(database\.php|config\.php)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Proteger archivos SQL
<FilesMatch "\.(sql)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Configuración de PHP
php_value upload_max_filesize 20M
php_value post_max_size 20M
php_value max_execution_time 300
php_value max_input_time 300

# Deshabilitar listado de directorios
Options -Indexes

# Página de error personalizada
ErrorDocument 404 /index.html
```

---

## ✅ PASO 7: VERIFICAR EL DESPLIEGUE

1. **Accede a tu sitio:**
   ```
   https://tudominio.com/
   ```

2. **Prueba el login:**
   - Usuario: `admin`
   - Contraseña: `admin123`

3. **Verifica que funcionen:**
   - ✅ Login
   - ✅ Módulos (Clientes, Productos, etc.)
   - ✅ Carrito de compras
   - ✅ Registro de usuarios

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "No se puede conectar a la base de datos"
- Verifica los datos en `config/database.php`
- Asegúrate de que el usuario MySQL tenga permisos
- Verifica que el host sea correcto (puede ser `localhost` o una IP)

### Error 500 (Internal Server Error)
- Revisa los permisos de archivos (deben ser 644)
- Revisa los permisos de carpetas (deben ser 755)
- Verifica que PHP esté habilitado
- Revisa el archivo `.htaccess`

### Las imágenes no cargan
- Verifica que la carpeta `css/` y sus subcarpetas tengan permisos 755
- Asegúrate de que las rutas sean relativas

### Los módulos no redirigen correctamente
- Verifica que las URLs en la base de datos sean correctas
- Ejecuta este SQL en phpMyAdmin del hosting:
  ```sql
  UPDATE modulos SET url = REPLACE(url, '/Proyecto/', '/');
  ```
  (Solo si tu proyecto está en la raíz, no en una subcarpeta)

---

## 📊 DATOS DE PRUEBA

El sistema ya incluye datos de prueba:

### Usuarios:
- **Admin:** admin / admin123
- **Gestor:** gestor / admin123
- **Técnico:** tecnico / admin123
- **Cliente:** cliente / admin123

### Contenido:
- ✅ 22 Clientes
- ✅ 50+ Productos
- ✅ 15 Módulos funcionales
- ✅ Servicios, Tickets, Cotizaciones

---

## 🎯 CHECKLIST FINAL

- [ ] Base de datos exportada
- [ ] Base de datos importada en el hosting
- [ ] Archivo `config/database.php` actualizado
- [ ] Archivos subidos al hosting
- [ ] Archivo `.htaccess` creado
- [ ] Login funciona correctamente
- [ ] Módulos cargan sin errores
- [ ] Carrito de compras funciona
- [ ] Registro de usuarios funciona

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa los logs de error de PHP en cPanel
2. Verifica la consola del navegador (F12)
3. Contacta al soporte de tu hosting si es un problema del servidor

---

**¡Felicitaciones! Tu sistema Computec está listo para producción.** 🎉
