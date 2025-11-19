# Manual de Diseño - Bodega Tienda

Este documento describe las convenciones de diseño y la guía de estilo para la aplicación web "Bodega Tienda". El objetivo es mantener una interfaz de usuario consistente, profesional y fácil de usar.

## 1. Filosofía de Diseño

El diseño se inspira en un entorno de bodega o almacén profesional: funcional, claro y robusto. La paleta de colores y la tipografía se han elegido para transmitir seriedad y eficiencia, con acentos de color para guiar al usuario y resaltar acciones importantes.

## 2. Paleta de Colores

La paleta de colores se define en `:root` dentro de `public/css/styles.css`.

- **Color Primario (Primary):** `#2c3e50` (Azul oscuro/grisáceo)
  - Uso: Barra de navegación, títulos principales, botones primarios.
  - Representa: Profesionalismo, seriedad.

- **Color Secundario (Secondary):** `#34495e` (Gris azulado más claro)
  - Uso: Hover en elementos de navegación, texto secundario.
  - Representa: Soporte, contexto.

- **Color de Acento (Accent):** `#f39c12` (Naranja/amarillo)
  - Uso: Enlaces, y para resaltar elementos interactivos o importantes.
  - Representa: Acción, atención.

- **Fondo (Background):** `#ecf0f1` (Gris muy claro)
  - Uso: Fondo principal de la aplicación.
  - Representa: Limpieza, espacio.

- **Colores de Estado:**
  - **Éxito (Success):** `#27ae60` (Verde) - Para mensajes de éxito.
  - **Peligro (Danger):** `#c0392b` (Rojo) - Para botones de borrado y mensajes de error.
  - **Advertencia (Warning):** `#f1c40f` (Amarillo) - Para alertas y avisos importantes.

## 3. Tipografía

- **Fuente Principal:** 'Helvetica Neue', Arial, sans-serif.
- **Uso:** Se utiliza en toda la aplicación para garantizar la legibilidad y un aspecto moderno y limpio.
- **Tamaños:**
  - Títulos `<h1>`: 2.5rem (ajustado por el navegador)
  - Títulos `<h2>`: 2rem
  - Texto normal `<p>`: 1rem (16px base)

## 4. Componentes de la Interfaz (UI)

### Botones (`.btn`)

- **Estilo:** Bordes redondeados (`4px`), sin borde de contorno, y con una transición suave en el color de fondo.
- **Variantes:**
  - `.btn-primary`: Fondo de color primario. Para acciones principales (Ej: "Crear Respaldo").
  - `.btn-success`: Fondo verde. Para acciones de confirmación (Ej: "Registrarse").
  - `.btn-danger`: Fondo rojo. Para acciones destructivas (Ej: "Restaurar Base de Datos").
  - `.btn-full`: Ancho completo (`100%`) para formularios.

### Formularios (`.form-container`)

- **Contenedor:** Fondo blanco, bordes redondeados, y una sombra sutil para destacarlo del fondo de la página.
- **Campos de Entrada (`.input-group`):**
  - Etiquetas (`label`) en negrita y de color secundario.
  - Entradas (`input`, `select`) con bordes claros. Al enfocarse (`:focus`), el borde cambia al color de acento para guiar al usuario.

### Alertas (`.alert`)

- **Uso:** Para mostrar mensajes de feedback al usuario (éxito, error, advertencia).
- **Estilo:** Cada tipo de alerta tiene un color de fondo y de texto que corresponde a los colores de estado para una identificación visual rápida.

### Navegación (`.navbar`)

- **Estilo:** Barra superior fija con el color primario de fondo.
- **Enlaces:** Texto blanco, sin subrayado. El enlace de "Cerrar Sesión" tiene un color de fondo rojo para diferenciarlo claramente.

---
*Este manual debe ser consultado antes de añadir nuevos componentes visuales a la aplicación para asegurar la consistencia del diseño.*
