# Funcionalidades propuestas

Lista de funcionalidades que ampliarían los casos de uso del fotomatón para el usuario final. Ordenadas por prioridad.

Referencias al código en `fotomatron.html`.

## Prioridad alta

### 1. Compartir con QR
Al terminar la sesión, mostrar un código QR que lleve a la tira en el móvil del invitado.
- **Situación actual:** la tira solo se descarga al equipo donde se usa la app (`downloadPhotoStrip`).
- **Decisión pendiente:** dónde se aloja el archivo para poder descargarlo desde el móvil.

### 2. Revisar y repetir fotos
Mostrar la tira antes de guardarla y permitir repetir una foto concreta.
- **Situación actual:** `takePhoto` añade siempre la foto y `endPhotoSession` descarga la tira sin preguntar.

### 3. Cancelar sesión en curso
Botón para detener una sesión a mitad.
- **Situación actual:** `stopPhotoBooth()` (línea ~3975) existe pero ningún botón la llama. La única salida es recargar la página.

### 4. Marca personalizada del evento
Texto propio, logo y fecha editable en el pie de la tira.
- **Situación actual:** el pie es fijo ("FOTOMATÓN" + fecha) en `downloadPhotoStrip`.
- **Casos de uso:** bodas, cumpleaños, fiestas de empresa.

### 5. Modo quiosco / operador
Panel oculto para configurar la app en un evento:
- Tiempos de la sesión (`PHOTO_COUNT`, `TIME_BETWEEN_PHOTOS`, `COUNTDOWN_TIME`, líneas 862-864, hoy constantes en código).
- Interruptor para desactivar los retos de pose (el README no menciona ninguno).
- Selección de cámara.
- Guardar esa configuración entre sesiones.
- **Nota:** el botón "Quitar todo y restablecer" es un reset intencionado, así que la configuración debería guardarse aparte.

## Prioridad media

### 6. Más formatos de salida
Tira 2×2, foto suelta, plantilla con marco del evento y tamaño de impresión.

### 7. Fondos y accesorios propios
Subir una imagen de fondo propia (hoy hay 9 predefinidos) o un sticker personalizado.

### 8. Texto sobre la foto
Escribir nombres o frases sobre la foto, antes o después de la toma.

### 9. Selección de cámara
La cámara está fija en `facingMode: 'user'` (línea ~1057). En tablets o portátiles con varias cámaras no se puede elegir.

### 10. Idiomas
La interfaz está solo en español (`lang="es"`). Útil para turistas o eventos internacionales.

## Más adelante

### 11. Vídeo corto o GIF
Grabar un clip o un GIF de la sesión, aprovechando los fotogramas que ya se capturan.

### 12. Galería o historial
Historial de tiras para el organizador del evento.

### 13. Accesibilidad
- **Situación actual:** los atributos `aria-` o `role` aparecen en solo 2 líneas del archivo.
- El botón de inicio y las tarjetas de accesorios no están etiquetados para lectores de pantalla.
- Casi nada es operable solo con teclado (salvo la tecla Supr para quitar accesorios).

## Parametrización

### 14. Resolución diferenciada: tira en vivo y tira compartida por QR
Parámetros independientes para la calidad de la tira que se ve durante la sesión y la que se comparte por QR.

- **Relación con otras propuestas:** depende de #1 (compartir con QR) y se configura desde el modo operador (#5).
- **Situación actual:**
  - La vista en vivo y la foto guardada usan el mismo tamaño de canvas (`previewCanvas`), así que no hay forma de separarlas.
  - La cámara pide 1280×960 ideal (línea ~1057).
  - La tira descargada tiene 400×300 por foto (`downloadPhotoStrip`), con JPEG a calidad 0,92.
  - Existe un modo de render a resolución completa (`renderHQ`) solo para la foto guardada.
- **Parámetros propuestos:**
  - Resolución de la vista en vivo (p. ej. 640×480 o 960×720), para mantener la fluidez en equipos modestos.
  - Resolución de la tira compartida por QR (p. ej. la máxima que dé la cámara, o un tope fijo).
  - Calidad JPEG de cada salida.
  - Tamaño máximo del archivo compartido, para que la descarga en datos móviles sea rápida.
- **Criterios de aceptación:**
  - La vista en vivo y los retos de pose siguen fluidos con la resolución en vivo configurada.
  - El archivo del QR usa la resolución compartida configurada, sin afectar a la vista en vivo.
  - Los valores por defecto mantienen el comportamiento actual.
- **Preguntas abiertas:**
  - ¿El archivo descargado en el equipo usa la resolución en vivo o la compartida?
  - ¿Cuál es el tope práctico de resolución que aguanta el renderizado de distorsiones y acabados en tiempo real?

## Diseño responsable

Requisitos transversales que condicionan el diseño de todas las funcionalidades anteriores. Son de diseño y no de funcionalidad nueva.

### A. Privacidad por diseño
- **Mínimo tratamiento:** no guardar ninguna foto hasta confirmar el pago (ver arquitectura de pagos). Si no hay compra, nada se almacena.
- **Borrado automático:** plazo de conservación definido y publicado, con borrado tras la descarga o al vencer el plazo.
- **Sin identificación:** la detección de caras solo sirve para colocar accesorios (`FaceDetector`) y no se guarda ni se usa para reconocer personas. Cualquier etiquetado o identificación pasaría a ser dato biométrico y queda fuera de alcance.
- **Transeúntes:** el encuadre y la interfaz deben evitar captar a personas ajenas a la sesión, o avisar de que la zona está en grabación.
- **Consentimiento separado:** aceptación explícita para el servicio, y una casilla aparte y opcional para cualquier uso promocional. Negarse a lo promocional no impide usar el fotomatón.
- **Aviso visible antes de empezar:** responsable, finalidad, plazo de conservación y cómo ejercer derechos (acceso, supresión).
- **Derecho de supresión:** cada tira tiene un código que permite pedir su borrado.
- **Menores:** aviso de que la captura de menores requiere consentimiento de su tutor.

### B. Transparencia y honestidad en el pago
- Precio final con impuestos visible antes de pagar.
- Sin cuentas atrás ni mensajes que presionen para pagar.
- Si falla la impresión, la descarga o el cobro, reembolso automático o reintento sin coste.
- Mensajes de error claros, en lenguaje sencillo.

### C. Accesibilidad (objetivo WCAG 2.2 nivel AA)
- **Situación actual:** los atributos `aria-` o `role` aparecen en 2 líneas del archivo.
- Etiquetas accesibles en todos los controles y foco visible.
- Todo operable con teclado y pantalla táctil, con tamaños de botón adecuados.
- Contraste suficiente en la cuenta atrás, las instrucciones y los retos de pose.
- Cuenta atrás y retos también comunicados por texto y sonido, no solo por color o animación.
- Pantalla y botones a una altura que permita usarlos desde silla de ruedas.

### D. Seguridad sensorial
- **Destellos:** el rayo (dos destellos seguidos), el flash del obturador y el glitch deben revisarse frente al criterio WCAG 2.3.1 (no más de tres destellos por segundo). Hoy no se cumple una comprobación formal.
- **Movimiento reducido:** la regla `prefers-reduced-motion` solo cubre los emojis de pose (línea ~309). Debe aplicarse a todos los efectos animados y a la lluvia, los destellos y las distorsiones.
- **Modo tranquilo** en el modo quiosco: sin destellos ni parpadeos.
- **Sonido:** volumen máximo configurable para cumplir la ordenanza de ruido y respetar a los clientes del local. Ya existe el interruptor de sonido, falta el límite.

### E. Inclusión y contenido
- Revisar el catálogo de accesorios y fondos para evitar estereotipos, disfraces de culturas o creencias, y contenido sexual o ridiculizador.
- Probar la detección de caras con una muestra diversa de personas (tonos de piel, gafas, pelo, edades). Si la detección falla con algunos rostros, el accesorio debe caer a la posición centrada sin penalizar a nadie.
- Los retos de pose no deben burlarse de nadie ni forzar a hacer gestos incómodos.

### F. Seguridad física e higiene
- Diseño del equipo sin cables sueltos, bordes afilados ni partes móviles accesibles.
- Anclaje para evitar vuelcos.
- Si hay accesorios físicos compartidos (sombreros, gafas), limpieza y desinfección entre usos. Preferible una solución digital.
- Marcado CE y cumplimiento del reglamento eléctrico (ver el documento de dificultades legales).

### G. Sostenibilidad
- Opción sin impresión: la tira se comparte por QR y no se imprime en papel. Si se imprime, papel reciclable.
- Modo reposo: pantalla y cámara apagadas cuando no hay sesión.
- Archivos comprimidos con la calidad mínima necesaria (propuesta #14).

### H. Gobernanza
- **Evaluación de impacto en protección de datos (EIPD):** captar imágenes de personas en un espacio público o semipúblico suele exigirla. Conviene valorarla con el asesor legal.
- Responsable designado y registro de actividades de tratamiento.
- Procedimiento ante una brecha de datos. La notificación a la AEPD tiene un plazo de 72 horas.
- Revisión periódica del catálogo, los textos legales y los contratos con proveedores.

## Diseño responsive

### Situación actual
- Solo hay dos puntos de corte: `max-width: 1000px` (apila las secciones en columna) y `1920×1080` (columnas de 300/340 px). Entre ambos, el layout usa columnas fijas de 250 px y 280 px (`fotomatron.html`, línea ~36).
- El escritorio ocupa `100vh` con `overflow` oculto (línea ~33). En pantallas bajas, como un portátil de 1280×720 o un móvil en horizontal, el botón de inicio, la cuenta atrás o los controles pueden quedar fuera de la vista sin posibilidad de desplazarse.
- No hay una regla específica para el quiosco en vertical (tótem), que es un formato habitual en fotomatones.
- La página de descarga y pago en el móvil (propuestas #1 y arquitectura de pagos) no existe todavía y debe diseñarse con enfoque móvil primero.

### Requisitos
- **Formatos objetivo:** quiosco horizontal 1920×1080 y 1366×768; quiosco vertical 1080×1920; tablet 768×1024 (vertical) y 1280×800 (horizontal); móvil 360×800 y 390×844; móvil en horizontal 844×390.
- **Basado en el espacio disponible, no solo en el ancho:** usar `svh` o `dvh` en lugar de `vh`, y dimensionar el visor de cámara con `min(ancho, alto)` para que el botón de inicio y la cuenta atrás siempre se vean.
- **Quiosco en vertical:** distribución propia, con la cámara arriba, la tira y los accesorios debajo, y el botón de inicio al alcance de la mano.
- **Página del móvil (descarga y pago):** diseño móvil primero, sin desplazamiento horizontal a 360 px, con botones de al menos 44 px y tira previsualizada escalada.
- **Panel de accesorios:** cuadrícula con número de columnas según el ancho, scroll interno y pestañas que no desborden en pantallas pequeñas.
- **Textos y controles:** tamaños con `clamp()` en lugar de píxeles fijos, y objetivos táctiles de al menos 44 px.
- **Resolución del visor:** dimensionar el canvas de vista previa según el contenedor y el `devicePixelRatio`, con un tope para no perder fluidez (relacionado con la propuesta #14).
- **Reflujo:** el contenido debe poder usarse con zoom del 200 % y a 320 px de ancho sin desplazamiento horizontal (WCAG 1.4.10).
- **Orientación:** bloquearla solo en el modo quiosco. En móvil y tablet debe poder girarse sin perder el estado de la sesión.

### Pruebas
- Matriz de pruebas con los formatos anteriores, en Chrome, Safari en iOS y Firefox.
- Comprobar en cada formato que el botón de inicio, la cuenta atrás, los controles y la tira son visibles y usables sin desplazarse.
- Probar también con el teclado y el zoom al 200 %.

## Atajos de teclado

### Situación actual
- Solo existe Supr/Backspace para quitar el accesorio seleccionado (`fotomatron.html`, línea ~1551). Los atajos se desactivan mientras hay un campo de texto activo.

### Principios
- Toda acción tiene equivalente con ratón o táctil (WCAG 2.1.1).
- Durante una sesión solo se permiten Esc y M, para evitar cambios accidentales en los retos de pose.
- Las acciones destructivas usan Shift o Ctrl y piden confirmación.
- No reasignar atajos del navegador: F5, F11, Ctrl+R, Ctrl+W, Ctrl+T, Ctrl+S, Ctrl+P, Ctrl+L, Alt+F4.
- Tecla `?` para mostrar la lista de atajos.
- En el modo operador, los atajos son configurables.

### Asignación propuesta

| Tecla | Función | Cuándo |
|---|---|---|
| Enter | Empezar sesión (lanza la cuenta atrás inicial de 3 s) | Sin sesión en curso |
| Esc | Cancelar sesión, incluida la cuenta atrás (pide confirmación), y cerrar modales | Siempre |
| R | Repetir la última foto | Pantalla de revisión (propuesta #2) |
| 1 a 8 | Cambiar de pestaña | Sin sesión en curso |
| [ / ] | Seleccionar accesorio anterior o siguiente | Con accesorios puestos |
| Flechas | Mover el accesorio seleccionado | Con un accesorio seleccionado |
| Shift + flechas | Mover en pasos mayores | Con un accesorio seleccionado |
| + / − | Aumentar o reducir el tamaño del accesorio | Con un accesorio seleccionado |
| Home | Restablecer posición y tamaño del accesorio | Con un accesorio seleccionado |
| Supr / Backspace | Quitar el accesorio seleccionado | Ya existe |
| Shift + Supr | Quitar todos los accesorios (pide confirmación) | Siempre |
| Ctrl + Supr | Quitar todo y restablecer (pide confirmación) | Siempre |
| Ctrl + Z / Ctrl + Y | Deshacer / rehacer el último cambio de accesorios o filtros | Siempre |
| M | Activar o silenciar el sonido | Siempre |
| G | Mostrar u ocultar las guías del visor | Siempre |
| F | Pantalla completa | Siempre |
| D | Descargar la tira actual | Tras una sesión |
| P | Activar o desactivar los retos de pose | Solo modo operador |
| Ctrl + Shift + O | Abrir el panel de operador (propuesta #5) | Siempre, con PIN |
| ? | Mostrar la lista de atajos | Siempre |

### Detalle por atajo

**Sesión**
- **Enter:** inicia la sesión y la cuenta atrás inicial (`COUNTDOWN_TIME`, 3 s). Solo sin sesión en curso. Si el foco está en el botón Empezar, el atajo global no debe ejecutarse, para no iniciar dos veces.
- **Esc:** cancela la sesión, incluida la cuenta atrás, con confirmación. Usa `stopPhotoBooth()`, que hoy no tiene ninguna llamada. También cierra los modales.
- **R:** repite la última foto. Requiere la pantalla de revisión de la propuesta #2.

**Pestañas y accesorios**
- **1 a 8:** cambia de pestaña en el orden de las categorías. Usa `switchPropTab`.
- **[ y ]:** selecciona el accesorio anterior o siguiente. No usa Tab, para no interferir con la navegación por teclado.
- **Flechas:** mueve el accesorio seleccionado con el mismo paso que el d-pad (0,03, `nudgeAccessory`). Mantener la tecla pulsada repite el movimiento.
- **Shift + flechas:** paso mayor, a definir (por ejemplo 0,1).
- **+ y −:** cambia el tamaño con `setAccessoryScale`, entre 0,4 y 2,5.
- **Home:** restablece posición y tamaño del accesorio seleccionado (`resetAccessory`).
- **Supr / Backspace:** quita el accesorio seleccionado. Ya existe (línea ~1551).
- **Shift + Supr:** quita todos los accesorios (`clearAccessories`), con confirmación.
- **Ctrl + Supr:** quita todo y restablece (`resetAll`), con confirmación.

**Deshacer**
- **Ctrl + Z / Ctrl + Y:** requiere una pila de estados nueva para accesorios y filtros. No existe hoy.

**Visualización y sistema**
- **G:** muestra u oculta las guías. Hoy se dibujan siempre en la vista previa (línea ~1137), así que falta el interruptor.
- **F:** pantalla completa con la API del navegador. Debe activarse con una pulsación del usuario.
- **M:** activa o silencia el sonido. Ya existe el interruptor; solo falta el atajo.

**Descarga y operador**
- **D:** vuelve a descargar la última tira. Requiere guardar el último resultado en memoria.
- **P:** activa o desactiva los retos de pose. Solo modo operador. Hoy no hay interruptor.
- **Ctrl + Shift + O:** abre el panel de operador con PIN. Por diseñar (propuesta #5).
- **?:** muestra la lista de atajos. Por diseñar.

**Resumen de código**
- Ya existe y solo requiere el atajo: Enter, Esc (la función de cancelar), 1 a 8, flechas, + y −, Home, Shift + Supr, Ctrl + Supr, M y Supr/Backspace.
- Requiere código nuevo: R, Ctrl + Z / Ctrl + Y, G, F, D, P, Ctrl + Shift + O y ?.

### Pruebas
- Comprobar que ningún atajo se activa mientras se escribe en un campo.
- Comprobar que las acciones destructivas no se ejecutan con una sola pulsación.
- Revisar que los atajos no entren en conflicto con los del navegador en Chrome, Firefox y Edge.
