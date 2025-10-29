# Instrucciones de Migración - Correcciones del Sistema

## Problemas Corregidos

### 1. ❌ Error en `gestion-servicios.html`
**Problema:** Al editar un servicio aparecía el error: "Data truncated for column 'estado' at row 1"

**Causa:** La tabla `servicios` tenía valores ENUM que no coincidían con los valores enviados desde el formulario.

**Solución:** Se actualizó el ENUM de la columna `estado` para incluir los valores correctos y se agregaron las columnas faltantes `marca_modelo` y `diagnostico`.

### 2. ✅ Nueva Funcionalidad: Upload de Imágenes para Productos
Se agregó la capacidad de subir imágenes para los productos desde el formulario de gestión.

---

## Pasos para Aplicar las Correcciones

### Paso 1: Ejecutar la Migración de Base de Datos

Abre **phpMyAdmin** o tu cliente MySQL y ejecuta el siguiente script SQL:

```sql
-- Archivo: migrations/fix_servicios_estado.sql

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
```

**Alternativa:** Puedes ejecutar el archivo directamente:
```bash
mysql -u root -p vcarvaja_computec < migrations/fix_servicios_estado.sql
```

### Paso 2: Verificar Permisos de la Carpeta `uploads`

Asegúrate de que la carpeta `uploads/productos/` tenga permisos de escritura:

**En Windows (XAMPP):**
- La carpeta ya debería tener los permisos correctos
- Verifica que Apache tenga acceso de escritura

**En Linux/Mac:**
```bash
chmod -R 755 uploads/
chown -R www-data:www-data uploads/
```

### Paso 3: Verificar que los Archivos Estén en su Lugar

Asegúrate de que existan los siguientes archivos:

```
Proyecto/
├── api/
│   ├── servicios-crud.php          ✅ Actualizado
│   ├── productos-crud.php          ✅ Existente
│   └── upload-imagen.php           ✅ NUEVO
├── js/
│   ├── gestion-servicios.js        ✅ Existente
│   └── gestion-productos.js        ✅ Actualizado
├── uploads/
│   ├── .htaccess                   ✅ NUEVO
│   └── productos/
│       └── .gitkeep                ✅ NUEVO
├── migrations/
│   └── fix_servicios_estado.sql    ✅ NUEVO
├── gestion-servicios.html          ✅ Existente
├── gestion-productos.html          ✅ Actualizado
└── vcarvaja_computec.sql           ✅ Actualizado
```

---

## Cambios Realizados

### Archivos Modificados

1. **`vcarvaja_computec.sql`**
   - Actualizado el ENUM de `servicios.estado`
   - Agregadas columnas `marca_modelo` y `diagnostico`

2. **`api/servicios-crud.php`**
   - Actualizada función `crearServicio()` para incluir nuevos campos
   - Actualizada función `actualizarServicio()` para incluir nuevos campos

3. **`gestion-productos.html`**
   - Agregado campo de upload de imagen
   - Agregada vista previa de imagen

4. **`js/gestion-productos.js`**
   - Agregada función `subirImagen()`
   - Agregado preview de imagen al seleccionar archivo
   - Actualizada función `guardarProducto()` para manejar imágenes

### Archivos Nuevos

1. **`api/upload-imagen.php`**
   - API para manejar la subida de imágenes
   - Validación de tipo y tamaño de archivo
   - Generación de nombres únicos
   - Actualización automática de la base de datos

2. **`uploads/.htaccess`**
   - Configuración de seguridad para la carpeta de uploads
   - Permite solo imágenes, bloquea archivos PHP

3. **`migrations/fix_servicios_estado.sql`**
   - Script de migración para corregir la tabla servicios

---

## Pruebas

### Probar Gestión de Servicios

1. Accede a `gestion-servicios.html`
2. Crea una nueva orden de servicio
3. Edita una orden existente
4. Verifica que los estados funcionen correctamente:
   - Pendiente
   - En Proceso
   - Completado
   - Cancelado

### Probar Upload de Imágenes en Productos

1. Accede a `gestion-productos.html`
2. Crea un nuevo producto o edita uno existente
3. Selecciona una imagen (JPG, PNG, GIF o WEBP)
4. Verifica que aparezca la vista previa
5. Guarda el producto
6. Verifica que la imagen se guardó en `uploads/productos/`
7. Recarga la página y edita el producto para verificar que la imagen se muestra

---

## Características de Upload de Imágenes

### Formatos Permitidos
- JPG/JPEG
- PNG
- GIF
- WEBP

### Tamaño Máximo
- 5 MB por imagen

### Características
- ✅ Vista previa antes de guardar
- ✅ Nombres únicos para evitar conflictos
- ✅ Eliminación automática de imagen anterior al actualizar
- ✅ Validación de tipo y tamaño
- ✅ Seguridad: solo imágenes permitidas

---

## Solución de Problemas

### Error: "Data truncated for column 'estado'"
**Solución:** Ejecuta el script de migración SQL (Paso 1)

### Error: "No se puede guardar la imagen"
**Solución:** Verifica permisos de la carpeta `uploads/productos/`

### La imagen no se muestra
**Solución:** Verifica que la ruta en la base de datos sea correcta (debe ser `uploads/productos/nombre_archivo.ext`)

### Error 403 al acceder a la imagen
**Solución:** Verifica el archivo `.htaccess` en la carpeta `uploads/`

---

## Notas Adicionales

- Las imágenes se guardan con nombres únicos para evitar conflictos
- Al editar un producto y subir una nueva imagen, la imagen anterior se elimina automáticamente
- El campo de imagen es opcional, puedes crear productos sin imagen
- Las imágenes se almacenan en `uploads/productos/` con el formato: `producto_[id_unico]_[timestamp].[extension]`

---

## Contacto y Soporte

Si encuentras algún problema, verifica:
1. Que la migración SQL se ejecutó correctamente
2. Que los permisos de la carpeta uploads sean correctos
3. Que todos los archivos nuevos estén en su lugar
4. Que no haya errores en la consola del navegador (F12)
