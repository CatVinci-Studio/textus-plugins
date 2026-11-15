# Historial de versiones

Guarda cada guardado de un documento como una versión, para ver qué cambió y recuperar una antigua.

- Cada vez que guardas, el texto del documento queda como una versión. Los guardados muy seguidos (el autoguardado de cada pocos segundos) cuentan como uno, con una versión nueva como mucho cada 15 minutos. Se guarda todo el último día, luego una por hora durante una semana, una por día durante tres meses y una por semana antes de eso.
- La pestaña **Historial** de la barra lateral lista las versiones del documento abierto, la más reciente arriba, agrupadas por día: Hoy, Ayer y luego la fecha.
- Elige una para ver, línea a línea, qué cambió desde entonces.
- Compárala con el documento actual o con cualquier otra versión, con las palabras cambiadas marcadas. **Restaurar** junto a un cambio recupera solo ese cambio; **Más** pone nombre o fija una versión, que entonces se guarda siempre, o la abre como documento nuevo. También se guardan los cambios hechos fuera de Textus (otra app, una sincronización, git): el texto de antes y el de después.
- **Restaurar esta versión** ofrece el texto antiguo como una edición del documento, que aceptas o rechazas como cualquier otra. **Abrir como documento nuevo** la abre al lado.
- Las versiones se guardan dentro de Textus, no en tu carpeta. Los documentos de más de 2 MB no se guardan, y cuando el almacenamiento se llena se van primero las versiones más antiguas.

## Permisos

- Leer archivos y el documento: para guardar cada versión y compararla con el texto actual.
- Proponer ediciones: para devolver una versión antigua como una edición que aceptas o rechazas.
- Herramientas para Textus AI: para que Textus AI pueda listar las versiones de un documento y compararlas.

## Cambios

- **0.4.0** - Las versiones se espacian con la edad en lugar de quedarse solo las últimas 50; cada texto se guarda una vez; las versiones de un documento borrado se van al mes. Compara dos versiones cualesquiera palabra por palabra, recupera un solo cambio, pon nombre y fija versiones, y se guardan los cambios hechos fuera de Textus. Las versiones de 0.3 pasan solas. Requiere Textus 1.4.3.
- **0.3.8** - El texto de antes del primer guardado ya no se pierde cuando ese guardado llega justo al abrir el documento.
- **0.3.7** - El texto que tenía un documento antes de guardarlo por primera vez también se conserva como versión, y las versiones siguen al documento al cambiarle el nombre o moverlo.
- **0.3.6** - El guardado automático mientras escribes solo escribe la versión más reciente, no todas las versiones del documento, así que los documentos largos se guardan con mucho menos trabajo.
- **0.3.5** - Una versión abierta sigue abierta cuando el autoguardado la actualiza, y Restaurar siempre la encuentra. Con el almacenamiento lleno, las versiones antiguas de otros documentos dejan sitio, y el panel avisa si un guardado no se pudo conservar. Las filas se usan con el teclado; los botones pasan a otra línea en una barra lateral estrecha.
- **0.3.4** - En la barra lateral el panel ya no muestra un título propio, como las demás pestañas. Textos de ayuda y de estado vacío más breves. Su panel lateral y su página siguen el diseño de Textus 1.3.13.
- **0.3.3** - Sus barras, listas y controles son ahora los de Textus, crecen con la interfaz y siguen cada tema; necesita Textus 1.3.12.
- **0.3.2** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.3.1** - Solo cambió el código de rutas compartido con otros plugins; nada cambia al usarlo.
- **0.3.0** - Textus AI puede listar las versiones de un documento y compararlas (`list_versions`, `diff_versions`).
- **0.2.0** - Controles propios de Textus. Requiere Textus 1.3.2.
- **0.1.0-0.1.3** - Primeras versiones: una versión en cada guardado, qué cambió desde entonces, restaurar como edición que se acepta o rechaza, abrir como documento nuevo, guardados seguidos como uno, versiones agrupadas por día, las más antiguas fuera cuando se llena el almacenamiento.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_versions`: Enumera las versiones guardadas de un documento - el que está al frente si no se da ruta -, la más reciente primero, numeradas desde 1, cada una con cuándo se guardó y su tamaño.
- `diff_versions`: Muestra, línea a línea, qué cambió entre dos versiones de un documento, o entre una versión y el documento tal como está: + añadido, - quitado, con algo de contexto.
<!-- /ai-tools -->
