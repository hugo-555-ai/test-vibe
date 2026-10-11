# Fotomatón - Aplicación Web de Fotomatón

Una aplicación web completa que simula un fotomatón clásico con acceso a la cámara del navegador, efectos divertidos, accesorios y generación automática de tiras de fotos.

## Características

- **Cámara en vivo** con efecto espejo (volteado horizontalmente)
- **4 fotos** por sesión en formato vertical
- **Ratio 4:3** por foto en la tira descendible
- **Temática divertida** con animaciones, emojis y elementos decorativos
- **Sistema de accesorios** con vista previa en directo (lo que ves es lo que se fotografía):
  - Filtros (sepia, B/N, negativo, vintage, cálido, frío, suave)
  - Sombreros (vaquero, corona, Santa, fiesta, chef, pirata, graduación)
  - Gafas (sol, nerd, corazones, estrellas, 3D, monóculo, natación)
  - Fondos (playa, espacio, ciudad, bosque, atardecer, fiesta, invierno): la persona se recorta en un óvalo sobre el escenario
  - Efectos animados (bokeh, destellos, corazones, estrellas, burbujas, fuegos, glitch)
- Los sombreros y gafas se colocan sobre la cara usando la API `FaceDetector` si el navegador la ofrece; si no, sobre una posición centrada
- **Retos de pose**: antes de cada foto aparece un emoji (cara o gesto) con su nombre; el usuario lo imita y el emoji queda estampado en pequeño en la esquina inferior izquierda de esa foto
- **Tiempos fijos**: 3 segundos de cuenta atrás inicial y 3 segundos entre fotos
- **Descarga automática** de la tira de fotos en formato JPG
- **Diseño Full HD** optimizado para 1920x1080

## Diseño

- **Tira de fotos**: Panel izquierdo, altura igual a la cámara
- **Cámara**: Centrada, con marco decorativo
- **Accesorios**: Panel derecho con pestañas por categoría
- **Botón de inicio**: Centrado en la parte inferior
- **Cuenta atrás inicial**: Aparece en el centro de la pantalla
- **Cuenta atrás entre fotos**: Aparece en el slot de la próxima foto (izquierda)
- **Márgenes**: 5% de margen blanco alrededor de cada foto, 2.5% entre fotos

## Uso

1. Abre el archivo `fotomatron.html` en un navegador moderno (Chrome, Firefox, Edge)
2. Permite el acceso a la cámara cuando se solicite
3. Selecciona accesorios de las pestañas disponibles
4. Haz clic en "Empezar" para comenzar la sesión
5. La tira de fotos se descargará automáticamente al finalizar

## Requisitos

- Navegador moderno con soporte para:
  - `navigator.mediaDevices.getUserMedia` (acceso a cámara)
  - Canvas API
  - Web Audio API (para efectos de sonido)
- Conexión a internet solo para la carga inicial (la aplicación funciona offline después)

## Estructura del proyecto

```
.
├── fotomatron.html    # Aplicación completa en un solo archivo
└── README.md          # Este archivo
```

## Referencias

- [JoinMyMoment - Fotomatón gratuito](https://joinmymoment.com/es/free-photo-booth)

## Tecnologías

- HTML5
- CSS3 (Grid, Flexbox, animaciones)
- JavaScript vanilla (ES5/ES6)
- Canvas API
- Web Audio API

## Personalización

Puedes modificar las siguientes constantes en el código para personalizar la experiencia:

```javascript
const PHOTO_COUNT = 4;           // Número de fotos por sesión
const TIME_BETWEEN_PHOTOS = 3;    // Segundos entre fotos
const COUNTDOWN_TIME = 3;         // Segundos de cuenta atrás inicial
```

## Autor

Proyecto de prueba creado con Mistral AI.

---

*Inspirado en los fotomatones clásicos con un toque moderno y divertido.*
