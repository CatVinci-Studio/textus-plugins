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

- **0.5.6** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3.
- **0.5.5** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. Needs Textus 1.4.3.
- **0.5.4** - A taken name gets the next free one as the file is written, never a clash (Textus 1.4.3).
- **0.5.3** - The store description now opens with what the plugin does.
- **0.5.2** - Templates in a hidden or lowercase templates folder, and in its subfolders, now show up. After Insert, the caret lands right after the template.
- **0.5.1** - **New from Template…** from a file's or folder's right-click menu makes the document in that folder.
- **0.5.0** - Templates are filled in by Textus itself, the same way as daily notes; needs Textus 1.3.10.
- **0.4.1** - Templates are listed in natural order: 2 before 10.
- **0.4.0** - Templater's common `tp.date` and `tp.file` tags, and an Obsidian vault's Templates date and time formats; tags that aren't run are named in a notice.
- **0.3.0** - Templates are Markdown files in the Templates folder (a vault's own templates folder in Obsidian), moved there once from where older versions kept them; `{{date:FORMAT}}` and `{{time:FORMAT}}`.
- **0.2.0** - Textus AI can list your templates and make a document from one.
- **0.1.3** - Says where it runs: desktop and iPhone.
- **0.1.2** - New from Template refuses a name that is already taken.
- **0.1.0-0.1.1** - First versions: new documents, inserted snippets and saved templates, with `{{date}}`, `{{time}}` and `{{title}}`; store page and icon.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_templates`: Enumera las plantillas de documento del usuario, cada una con su nombre y su Markdown, donde {{date}}, {{time}}, {{title}} y las etiquetas tp.date y tp.file de Templater se rellenan al usarla.
- `create_from_template`: Crea un documento nuevo en la carpeta abierta a partir de una plantilla del usuario, con {{date}}, {{time}}, {{title}} y las etiquetas tp.date y tp.file de Templater rellenados. Devuelve su ruta y, en notRun, las etiquetas dejadas tal cual.
<!-- /ai-tools -->
