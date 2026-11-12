# Plantillas

Crea documentos nuevos e inserta fragmentos a partir de tus propias plantillas, con la fecha, la hora y el título ya puestos.

Las plantillas son archivos Markdown en la carpeta **Templates** de la carpeta abierta (en una bóveda de Obsidian, la que nombran sus ajustes de Plantillas), así que van adonde vayan tus notas. Si aún no hay ninguna, se crea una plantilla **Notas de reunión** para empezar.

- **Complementos › Nuevo desde plantilla…** crea un documento en la raíz de la carpeta abierta a partir de una de tus plantillas. Pide el nombre y no acepta uno que ya exista.
- **Complementos › Insertar plantilla…**, o **Insertar plantilla…** en el menú de barra, pone una plantilla en el cursor.
- **Complementos › Guardar como plantilla…** guarda el documento que tienes delante como plantilla. Un nombre ya usado recibe un número; nunca se sobrescribe nada.

## Qué se rellena

- `{{date}}`, `{{time}}` y `{{title}}` se rellenan al usar la plantilla; `{{date:YYYY-MM-DD}}` y `{{time:HH:mm}}` admiten un formato, como en Obsidian.
- En una bóveda de Obsidian, `{{date}}` y `{{time}}` usan los formatos de fecha y hora de sus ajustes de Plantillas.
- También se rellenan las etiquetas comunes de Templater: `<% tp.date.now("YYYY-MM-DD") %>` (con un desfase en días, como `-1`, o `"P1W"`), `tp.date.today`, `tomorrow` y `yesterday`, `<% tp.file.title %>`, `tp.file.creation_date()` y `tp.file.folder()`; `<% tp.file.cursor() %>` deja el cursor ahí.
- Los scripts y las demás etiquetas nunca se ejecutan: se quedan como están y un aviso los nombra.

Funciona en escritorio y en iPhone y necesita Textus 1.3.10 o posterior. Pide leer y escribir archivos de la carpeta abierta, para las plantillas y los documentos nuevos; leer y editar el documento que tienes delante, para insertar una plantilla o guardarlo como tal; y da a Textus AI las dos herramientas de abajo.

## Cambios

- **0.5.2** - Ahora aparecen las plantillas de una carpeta de plantillas oculta o en minúsculas, y de sus subcarpetas. Tras insertar, el cursor queda justo después de la plantilla.
- **0.5.1** - **Nuevo desde plantilla…** en el menú contextual de un archivo o carpeta crea el documento en esa carpeta.
- **0.5.0** - Las plantillas las rellena el propio Textus, igual que las notas diarias; necesita Textus 1.3.10.
- **0.4.1** - Las plantillas se listan en orden natural: 2 antes que 10.
- **0.4.0** - Las etiquetas comunes `tp.date` y `tp.file` de Templater, y los formatos de fecha y hora de Plantillas en una bóveda de Obsidian; un aviso nombra las etiquetas que no se ejecutan.
- **0.3.0** - Las plantillas son archivos Markdown en la carpeta Templates (en Obsidian, la carpeta de plantillas de la bóveda), movidas allí una vez desde donde las guardaban versiones anteriores; `{{date:FORMATO}}` y `{{time:FORMATO}}`.
- **0.2.0** - Textus AI puede listar tus plantillas y crear un documento a partir de una.
- **0.1.3** - Indica dónde funciona: escritorio y iPhone.
- **0.1.2** - Nuevo desde plantilla no acepta un nombre que ya existe.
- **0.1.0-0.1.1** - Primeras versiones: documentos nuevos, fragmentos insertados y plantillas guardadas, con `{{date}}`, `{{time}}` y `{{title}}`; página en la tienda e icono.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_templates`: Enumera las plantillas de documento del usuario, cada una con su nombre y su Markdown, donde {{date}}, {{time}}, {{title}} y las etiquetas tp.date y tp.file de Templater se rellenan al usarla.
- `create_from_template`: Crea un documento nuevo en la carpeta abierta a partir de una plantilla del usuario, con {{date}}, {{time}}, {{title}} y las etiquetas tp.date y tp.file de Templater rellenados. Devuelve su ruta y, en notRun, las etiquetas dejadas tal cual.
<!-- /ai-tools -->
