# 🛫 Simulador de Viajes - JavaScript

## 📋 Descripción del Proyecto

Este es un simulador interactivo de cálculo de costos de viajes desarrollado como **Entrega 1** para el curso de JavaScript de CoderHouse. El simulador permite calcular el costo estimado de viajes a diferentes destinos, incluyendo actividades opcionales, impuestos y descuentos por grupo.

## ✨ Características Principales

- 🌍 **Múltiples destinos**: Buenos Aires, Miami, Madrid
- 🎯 **Actividades opcionales** por cada destino
- 💰 **Cálculo automático de impuestos** (21% IVA)
- 👥 **Descuentos por grupo** (10% para 4+ viajeros)
- 💱 **Conversión de monedas** (USD, EUR, ARS)
- 📊 **Resumen detallado** en consola con `console.table()`
- ✅ **Validación de datos** robusta
- 🎨 **Interfaz Bootstrap 5** responsive

## 🚀 Cómo Usar el Simulador

1. **Abrir el archivo**: Abre `index.html` en tu navegador web
2. **Abrir la consola**: Presiona `F12` o `Ctrl+Shift+I` para abrir las herramientas de desarrollador
3. **Ejecutar**: En la consola, escribe `runSimulator()` y presiona Enter
4. **Seguir instrucciones**: Completa los datos solicitados en los cuadros de diálogo

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica del documento
- **Bootstrap 5.3.2**: Framework CSS para diseño responsive
- **Bootstrap Icons**: Iconografía moderna
- **JavaScript ES6+**: Lógica del simulador con características modernas

## 📁 Estructura del Proyecto

```
cursoJSCoder/
├── index.html          # Página principal con Bootstrap
├── js/
│   └── app.js         # Lógica del simulador
├── .gitignore         # Archivos ignorados por Git
└── README.md          # Documentación del proyecto
```

## 🎯 Objetivos Cumplidos (Entrega 1)

### ✅ Objetivos Generales
- [x] Estructura base del simulador armada
- [x] Integración de herramientas JS aprendidas

### ✅ Objetivos Específicos
- [x] **Variables y constantes**: `TAX_RATE`, `GROUP_DISCOUNT_THRESHOLD`, etc.
- [x] **Arrays y objetos**: `DESTINATIONS`, `ACTIVITIES`, `EXCHANGE_RATES`
- [x] **Funciones interactivas**: 8+ funciones con responsabilidades específicas
- [x] **Ciclos y condicionales**: `for`, `while`, `if/else` implementados óptimamente
- [x] **Interacción usuario**: `prompt()`, `confirm()`, `alert()`
- [x] **Salida en consola**: `console.log()` y `console.table()`

### ✅ Criterios de Evaluación
- [x] **Estructura HTML**: Completa con Bootstrap 5 y buenas prácticas
- [x] **Algoritmos**: Uso óptimo de condicionales y ciclos
- [x] **Funciones**: Nombres claros, estructura correcta, resultados precisos
- [x] **Archivo JS**: Correctamente referenciado en HTML

## 🔧 Funciones Principales

### 🎯 Algoritmo Básico Implementado

1. **Entrada de datos**: 
   - `promptNumber()`: Validación robusta de números
   - `chooseDestination()`: Selección de destino
   - `chooseActivities()`: Selección de actividades

2. **Procesamiento de datos**:
   - `calculateTripCost()`: Cálculo de costos por viajero
   - `convertToARS()`: Conversión de monedas
   - `summarizeGroup()`: Cálculos de grupo y descuentos

3. **Salida de resultados**:
   - `printSummary()`: Resumen en consola
   - `collectTravelerBooking()`: Confirmación por viajero

## 💡 Características Avanzadas

- **Validación de entrada**: Manejo de errores y valores inválidos
- **Experiencia de usuario**: Mensajes claros y confirmaciones
- **Escalabilidad**: Fácil agregar nuevos destinos y actividades
- **Organización del código**: Comentarios y estructura modular
- **Responsive design**: Funciona en dispositivos móviles y desktop

## 🎨 Mejoras Visuales con Bootstrap

- **Navegación**: Header con branding del curso
- **Cards**: Organización visual del contenido
- **Iconografía**: Bootstrap Icons para mejor UX
- **Tipografía**: Jerarquía visual clara
- **Colores**: Esquema profesional y accesible
- **Responsive**: Adaptable a todos los tamaños de pantalla

## 📝 Notas de Desarrollo

- El simulador funciona **íntegramente desde la consola** como se requiere
- Se priorizó la **lógica de JavaScript** sobre el diseño visual
- Implementación de **buenas prácticas** de programación
- Código **comentado y organizado** por secciones
- **Manejo de errores** y casos edge

## 🚀 Próximas Mejoras

- Integración con APIs de viajes reales
- Persistencia de datos con localStorage
- Más opciones de personalización
- Sistema de usuarios y favoritos

---

**Desarrollado por**: [Tu Nombre]  
**Curso**: JavaScript - CoderHouse  
**Entrega**: 1 - Estructura del Simulador  
**Fecha**: Diciembre 2024
