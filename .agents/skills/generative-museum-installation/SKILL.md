# Generative Museum Installation

Este skill transforma una aplicación Next.js en una instalación de museo digital interactiva. Proporciona el workflow de ComfyUI de máxima nitidez, gestión de estado con historial persistente y una interfaz inmersiva con visor de obras (Modal).

## Componentes Clave

### 1. ComfyUI (Nitidez Extrema)
Utiliza la plantilla `assets/comfyui_template.ts`.
- **Workflow**: SDXL Turbo con **2 pasos** y **Euler Ancestral**.
- **Nodes**: Mapeo exitoso (SamplerCustom [13], Scheduler [22], Save [27]).
- **Prompt**: Inyectar estilo al inicio `(Style: ...)`.

### 2. Estado (Historial Persistente)
Utiliza `assets/store_template.ts`.
- Maneja el historial de hasta 50 imágenes generadas localmente.
- Controla el estado del **Visor de Museo** (Popup).

### 3. Interfaz y Temas
Utiliza `assets/styles_template.css` para el `globals.css`.
- **Layout**: Cuadrícula de 8 columnas (escritorio) / 3 columnas (móvil).
- **Visor**: Modal con efecto glassmorphism, ficha técnica, compartir y descargar.
- **Dinamismo**: Cambia el `data-theme` del contenedor principal para mutar toda la atmósfera de la web.

## Guía de Despliegue Rápido
1. **Infraestructura**: Copia `store_template.ts` a `lib/store.ts`.
2. **API**: Adapta `comfyui_template.ts` a tu archivo de configuración de API.
3. **Estilos**: Inyecta los temas de `styles_template.css` en tu CSS global.
4. **UI**: Implementa el componente de Modal para el visor de obras y conecta el `onClick` de la galería al `setSelectedGalleryItem` del store.

## Recursos
- `assets/comfyui_template.ts`: Motor de generación HD.
- `assets/store_template.ts`: Motor de estado y galería.
- `assets/styles_template.css`: Paleta de temas dinámicos.
