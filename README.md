# Simulador de Viajes - Proyecto Final JavaScript

Aplicación web interactiva para simular reservas de viajes con múltiples destinos, actividades y cálculo automático de costos.

## Descripción

Este simulador permite a los usuarios planificar viajes completos seleccionando destinos, cantidad de noches, y actividades opcionales. Calcula automáticamente impuestos, aplica descuentos por grupo y mantiene un historial de reservas.

## Características Principales

- **Múltiples destinos**: Buenos Aires, Miami, Madrid
- **Actividades opcionales** por cada destino
- **Cálculo automático** de impuestos (21%)
- **Descuentos por grupo** (10% para 4+ viajeros)
- **Conversión de monedas** (USD, EUR, ARS)
- **Persistencia de datos** con localStorage
- **Historial de reservas** (últimas 10)
- **Interfaz responsive** con Bootstrap 5
- **Notificaciones** con Toastify
- **Confirmaciones** con SweetAlert2

## Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3 (personalizado + Bootstrap 5.3.2)
- JavaScript ES6+

### Librerías Externas
- **Bootstrap 5.3.2**: Framework CSS
- **Bootstrap Icons**: Iconografía
- **SweetAlert2**: Modales de confirmación
- **Toastify**: Notificaciones toast

### Arquitectura
- **Modular**: Código separado en múltiples archivos JS
- **Fetch API**: Carga de datos desde JSON
- **LocalStorage**: Persistencia de datos
- **Async/Await**: Manejo asíncrono

## Estructura del Proyecto

```
javascript/
├── index.html              # Documento principal
├── README.md              # Este archivo
├── PLAN_ENTREGA2.md       # Documentación del plan
├── css/
│   └── styles.css         # Estilos personalizados
├── js/
│   ├── app.js            # Orquestador principal
│   ├── data.js           # Fetch y manejo de datos
│   ├── ui.js             # Manipulación del DOM
│   └── storage.js        # LocalStorage
└── data/
    ├── destinations.json  # Datos de destinos
    └── activities.json    # Datos de actividades
```

## Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Servidor local (opcional pero recomendado)

### Opción 1: Servidor Local (Recomendado)

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego abrir: `http://localhost:8000`

### Opción 2: Abrir Directamente

Abrir `index.html` directamente en el navegador.

**Nota**: Algunos navegadores pueden bloquear Fetch API por CORS al abrir archivos locales. Se recomienda usar un servidor local.

## Guía de Uso

### 1. Inicio
- Ingresar el número de viajeros (1-20)
- Click en "Comenzar"

### 2. Datos del Viajero
Para cada viajero:
- Ingresar nombre completo
- Ingresar edad (muestra advertencia si es menor de 18)
- Seleccionar destino
- Indicar número de noches
- Seleccionar actividades opcionales (checkboxes)
- Click en "Agregar Viajero"

### 3. Resumen
- Revisar lista de viajeros agregados
- Ver totales por moneda
- Ver descuento por grupo (si aplica)
- Ver total final en ARS
- Opciones:
  - "Agregar Viajero": Agregar más viajeros
  - "Confirmar Reserva": Finalizar y guardar

### 4. Confirmación
- Mensaje de éxito
- Reserva guardada en historial
- Opción para nueva reserva

## Funcionalidades Detalladas

### Cálculo de Costos
```
Subtotal = (Hotel por noche × Noches) + Actividades
Impuestos = Subtotal × 21%
Total = Subtotal + Impuestos
```

### Descuento por Grupo
- Se aplica 10% de descuento si hay 4 o más viajeros
- El descuento se calcula sobre el total en ARS

### Conversión de Monedas
Tasas fijas para simulación:
- 1 USD = 1000 ARS
- 1 EUR = 1100 ARS

### Persistencia de Datos

**Reserva Actual**
- Se guarda automáticamente después de agregar cada viajero
- Se recupera al recargar la página
- Se limpia al confirmar la reserva

**Historial**
- Guarda las últimas 10 reservas confirmadas
- Incluye fecha y hora de confirmación
- Persiste entre sesiones

## Validaciones

- Campos requeridos en formularios
- Rangos numéricos (edad 0-120, noches 1-60)
- Advertencia para menores de edad
- Confirmación antes de eliminar viajeros
- Confirmación antes de finalizar reserva

## Manejo de Errores

- Try-catch en operaciones críticas
- Mensajes de error amigables (UX)
- Loading overlay durante carga de datos
- Notificaciones toast para feedback

## Librerías Externas Utilizadas

### SweetAlert2
Modales elegantes para confirmaciones:
- Confirmar reserva
- Eliminar viajero
- Otras acciones críticas

### Toastify
Notificaciones no intrusivas:
- Éxito al agregar viajero
- Errores de carga
- Feedback general

## Navegadores Compatibles

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Limitaciones Conocidas

- Tasas de cambio fijas (no en tiempo real)
- Máximo 20 viajeros por reserva
- Historial limitado a 10 reservas
- Sin integración con pasarelas de pago reales
- Sin backend real (simulado con JSON)

## Mejoras Futuras

- Integración con API de tipos de cambio real
- Más destinos y actividades
- Exportar reserva a PDF
- Envío de confirmación por email
- Sistema de usuarios y login
- Integración con calendario
- Comparador de precios

## Autor

Proyecto desarrollado para el curso de JavaScript de CoderHouse

## Licencia

Este proyecto es de uso educativo.

---

**Versión**: 1.0.0 (Proyecto Final)  
**Fecha**: Noviembre 2025
