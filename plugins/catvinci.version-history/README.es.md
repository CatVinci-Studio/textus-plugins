# Historial de versiones

Guarda cada guardado de un documento como una versión, para ver qué cambió y recuperar una antigua.

- Cada vez que guardas, el texto del documento queda como una versión. Los guardados muy seguidos (el autoguardado de cada pocos segundos) cuentan como uno, con una versión nueva como mucho cada 15 minutos. Se conservan las últimas 50 versiones de cada documento.
- La pestaña **Historial** de la barra lateral lista las versiones del documento abierto, la más reciente arriba, agrupadas por día: Hoy, Ayer y luego la fecha.
- Elige una para ver, línea a línea, qué cambió desde entonces.
- **Restaurar esta versión** ofrece el texto antiguo como una edición del documento, que aceptas o rechazas como cualquier otra. **Abrir como documento nuevo** la abre al lado.
- Las versiones se guardan dentro de Textus, no en tu carpeta. Los documentos de más de 2 MB no se guardan, y cuando el almacenamiento se llena se van primero las versiones más antiguas.

## Permisos

- Leer archivos y el documento: para guardar cada versión y compararla con el texto actual.
- Proponer ediciones: para devolver una versión antigua como una edición que aceptas o rechazas.
- Herramientas para Textus AI: para que Textus AI pueda listar las versiones de un documento y compararlas.

## Cambios

- **0.3.4** - En la barra lateral el panel ya no muestra un título propio, como las demás pestañas.
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
