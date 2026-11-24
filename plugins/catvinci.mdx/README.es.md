# MDX

Para documentos MDX - el Markdown con componentes que usan Docusaurus, Nextra
y otras herramientas de sitios web. Textus abre los archivos `.mdx` por sí solo y
conserva sus imports, `{expressions}` y componentes tal como están escritos;
este plugin añade:

- **Problemas subrayados.** El propio compilador de MDX revisa el documento
  mientras escribes, y el primer problema que encuentra se subraya donde está,
  con su línea y lo que falla.
- **Vista previa de MDX.** El documento dibujado a su lado: pestañas, avisos
  (`<Callout>`, `<Admonition>`, `:::tip`) y `<details>` con el aspecto de Textus,
  y cualquier otro componente como una tarjeta con su nombre y sus atributos.
  No se ejecuta nada del código del documento.
- **Guardar como Markdown / Guardar como MDX.** Una copia junto al documento: los
  avisos pasan a ser alertas de GitHub, las pestañas partes con encabezado, y un
  componente sin nada dentro queda como comentario; en sentido contrario, las llaves
  y `<` se escapan y los comentarios y `<br>` se escriben como los quiere MDX.

Los encontrarás en el menú Complementos, o con clic derecho en un documento `.mdx`.

## Permisos

- **Leer el documento**: para revisarlo y dibujarlo mientras escribes.
- **Leer y escribir archivos**: para revisar un archivo .mdx que nombre Textus AI y para guardar la copia convertida junto al documento.
- **Herramientas para Textus AI**: para que Textus AI pueda revisar el MDX que escribe.

## Cambios

- **0.1.4** - Its icon is MDX's own logo.
- **0.1.3** - Its page is in every language Textus speaks.
- **0.1.2** - Its package lists the libraries it carries, with their licenses.
- **0.1.1** - Preview MDX on a phone, where the preview shows alone, draws the document it was opened from instead of an empty page.
- **0.1.0** - First version: problems underlined by MDX's compiler, Preview MDX, Save as Markdown and Save as MDX, and check_mdx for Textus AI.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_mdx`: Comprueba MDX con el compilador oficial de MDX y da el primer problema con su línea y columna. Úsala tras escribir o cambiar un documento .mdx, antes de decir que funciona.
<!-- /ai-tools -->
