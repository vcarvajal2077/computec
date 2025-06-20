# 🖥️ Computec - Página Web Profesional

Una página web moderna y responsive para una empresa de servicios informáticos, diseñada para mostrar servicios, productos y facilitar el contacto con clientes.

## 📋 Características

### 🎨 Diseño Moderno
- **Diseño responsive** que se adapta a todos los dispositivos
- **Interfaz moderna** con gradientes y efectos visuales atractivos
- **Tipografía profesional** usando Inter Font
- **Paleta de colores** coherente y profesional

### 🚀 Funcionalidades Principales

#### Navegación
- **Menú fijo** con efecto de transparencia
- **Navegación suave** entre secciones
- **Menú móvil** hamburguesa para dispositivos pequeños
- **Indicador de sección activa**

#### Secciones de la Página
1. **Hero Section** - Presentación principal con llamadas a la acción
2. **Servicios** - Catálogo de servicios con precios y características
3. **Productos** - Galería de productos con modales informativos
4. **Nosotros** - Información de la empresa y estadísticas
5. **Testimonios** - Opiniones de clientes satisfechos
6. **Contacto** - Formulario de contacto y información de contacto
7. **Footer** - Enlaces útiles y redes sociales

#### Interactividad
- **Formulario de contacto** con validaciones en tiempo real
- **Modales de productos** con información detallada
- **Botón flotante de WhatsApp** con mensajes personalizados
- **Animaciones suaves** y efectos hover
- **Scroll effects** y navegación activa

## 📁 Estructura de Archivos

```
proyecto/
├── website.html          # Página principal
├── css/
│   └── website-styles.css # Estilos CSS completos
├── js/
│   └── website-scripts.js # Funcionalidades JavaScript
└── README-website.md     # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Interactividad y funcionalidades
- **Font Awesome** - Iconografía
- **Google Fonts** - Tipografía Inter

## 🎯 Características Técnicas

### CSS
- **Variables CSS** para fácil personalización
- **Grid y Flexbox** para layouts modernos
- **Media queries** para responsive design
- **Animaciones CSS** y transiciones suaves
- **Backdrop filter** para efectos de transparencia

### JavaScript
- **Modular y organizado** en funciones específicas
- **Validación de formularios** en tiempo real
- **Gestión de modales** para productos
- **Optimización de rendimiento** con debounce
- **Compatibilidad** con navegadores modernos

## 🚀 Cómo Usar

### 1. Abrir la Página
```bash
# Simplemente abre el archivo website.html en tu navegador
open website.html
```

### 2. Personalización
- **Colores**: Modifica las variables CSS en `:root`
- **Contenido**: Edita el HTML según tus necesidades
- **Funcionalidades**: Ajusta el JavaScript según requerimientos

### 3. Despliegue
- Sube los archivos a tu servidor web
- Asegúrate de que todos los archivos estén en la misma estructura
- Verifica que las rutas de los archivos CSS y JS sean correctas

## 📱 Responsive Design

La página está optimizada para:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

### Breakpoints Principales
- `1024px` - Ajustes para tablets
- `768px` - Menú móvil y layouts de una columna
- `480px` - Optimizaciones para móviles pequeños

## 🎨 Personalización

### Cambiar Colores
```css
:root {
    --primary-color: #2563eb;    /* Color principal */
    --accent-color: #f59e0b;     /* Color de acento */
    --success-color: #10b981;    /* Color de éxito */
    /* ... más variables */
}
```

### Modificar Contenido
- **Servicios**: Edita las tarjetas en la sección servicios
- **Productos**: Actualiza las imágenes y descripciones
- **Contacto**: Cambia la información de contacto
- **Testimonios**: Agrega o modifica testimonios de clientes

## 📞 Integración con WhatsApp

El botón de WhatsApp está configurado para:
- **Mensajes personalizados** según la sección actual
- **Número configurable** (actualmente: +57 300 123 4567)
- **Apertura en nueva pestaña** para mejor UX

## 🔧 Funcionalidades Avanzadas

### Formulario de Contacto
- **Validación en tiempo real**
- **Mensajes de error específicos**
- **Confirmación de envío**
- **Campos requeridos** con validación

### Modales de Productos
- **Información detallada** de cada producto
- **Botones de acción** (WhatsApp y llamada)
- **Diseño responsive** para móviles
- **Cierre intuitivo** (X o clic fuera)

### Animaciones
- **Entrada suave** de elementos al hacer scroll
- **Efectos hover** en botones y tarjetas
- **Transiciones fluidas** entre estados
- **Animación de pulso** en botón de WhatsApp

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Los estilos no se cargan**
   - Verifica que la ruta del archivo CSS sea correcta
   - Asegúrate de que el archivo `website-styles.css` existe

2. **JavaScript no funciona**
   - Revisa la consola del navegador para errores
   - Verifica que el archivo `website-scripts.js` esté en la ruta correcta

3. **Imágenes no se muestran**
   - Las imágenes usan URLs de Unsplash, verifica tu conexión a internet
   - Para producción, descarga y usa imágenes locales

4. **Formulario no envía**
   - El formulario está configurado solo para mostrar mensaje de éxito
   - Para funcionalidad real, integra con un backend o servicio de email

## 📈 Optimizaciones Futuras

### Posibles Mejoras
- **Lazy loading** para imágenes
- **Service Worker** para cache offline
- **PWA** (Progressive Web App)
- **SEO optimizado** con meta tags
- **Analytics** integrado
- **Chat en vivo** integrado
- **Sistema de reservas** online

### Integraciones Sugeridas
- **Google Analytics** para seguimiento
- **Facebook Pixel** para publicidad
- **Mailchimp** para newsletter
- **Calendly** para agendar citas
- **Stripe** para pagos online

## 📞 Soporte

Para soporte técnico o personalizaciones adicionales:
- **Email**: soporte@computec.com
- **WhatsApp**: +57 300 123 4567
- **Horarios**: Lunes - Viernes 8:00 AM - 6:00 PM

## 📄 Licencia

Este proyecto está diseñado para uso comercial de Computec. Todos los derechos reservados.

---

**Desarrollado con ❤️ para Computec**  
*Soluciones Informáticas Profesionales*

- Se añadió la subpágina 'mi-cuenta.html' y un botón 'Mi Cuenta' en el menú de navegación, siguiendo el mismo formato que las demás secciones principales. 