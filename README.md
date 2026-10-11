# Fotomatón - Aplicación Web de Fotomatón

Una aplicación web completa que simula un fotomatón clásico con acceso a la cámara del navegador, efectos divertidos, accesorios y generación automática de tiras de fotos.

## Características

- **Cámara en vivo** con efecto espejo (volteado horizontalmente)
- **4 fotos** por sesión en formato vertical
- **Ratio 4:3** por foto en la tira descendible
- **Temática divertida** con animaciones, emojis y elementos decorativos
- **Sistema de accesorios** con vista previa en directo (lo que ves es lo que se fotografía):
  - Filtros (sepia, B/N, negativo, vintage, cálido, frío, suave, Halloween)
  - Sombreros (vaquero, corona, Santa, fiesta, chef, pirata, graduación, bruja, calabaza, diablillo)
  - Gafas (sol, nerd, corazones, estrellas, 3D, monóculo, natación, ojos rojos, ojos calabaza, barra negra y pixelado de privacidad)
  - Fondos (playa, espacio, ciudad, bosque, atardecer, fiesta, invierno, cementerio): la persona se recorta en un óvalo sobre el escenario
  - Decoración animada (bokeh, destellos, corazones, estrellas, burbujas, fuegos, glitch, murciélagos, fantasmas)
- Los sombreros y gafas se colocan sobre la cara usando la API `FaceDetector` si el navegador la ofrece; si no, sobre una posición centrada
- **Retos de pose**: antes de cada foto aparece un emoji (cara o gesto) con su nombre; el usuario lo imita y el emoji queda estampado en pequeño en la esquina inferior izquierda de esa foto
- **Filtro Warhol**: cuadrícula 2×2 posterizada con una paleta pop por recuadro, aplicada sobre toda la composición (los accesorios salen en cada recuadro y se pueden editar en cualquiera)
- **Distorsiones** (pestaña propia, combinables con los filtros de color): ojo de pez, pellizco, torbellino, ondas, espejo, feria ancha, alargado, pixelado, caleidoscopio, mosaico, agua, derretido y RGB. En las que tienen centro (ojo de pez, pellizco, torbellino, agua, caleidoscopio, feria, alargado, espejo, RGB) se arrastra el punto ◎ de la cámara para moverlo
- **Varios accesorios a la vez**: cada pulsación en Sombreros o Gafas añade uno más (puedes repetir el mismo); la decoración (antes "Efectos") se puede combinar y tiene sliders de cantidad, velocidad y tamaño. Filtro, distorsión y fondo son de elección única
- **Quitar accesorios**: lista "Accesorios puestos" con ✕ por accesorio, botones "Quitar este" / "Quitar todos", tecla Supr, y "Quitar todos" en cada pestaña
- **Cada sombrero/gafa es independiente**: arrastra sobre la cámara para moverlo; tira de una esquina del cuadro, rueda del ratón, pellizco táctil o slider para el tamaño, flechas de desplazamiento y Restablecer
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
