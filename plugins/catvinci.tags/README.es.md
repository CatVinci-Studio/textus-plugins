# Etiquetas

Muestra en la barra lateral todas las `#etiquetas` de la carpeta abierta, con cuántas notas usan cada una.

- La pestaña **Etiquetas** muestra las etiquetas, las más usadas primero. Las etiquetas anidadas (`#project/alpha`) forman un árbol, como en Obsidian, y el recuento de una etiqueta incluye las notas de las etiquetas que tiene debajo. Escribe en el campo de filtro para acotar la lista.
- Abre una etiqueta para ver sus notas y haz clic en una para abrirla.
- Haz clic derecho en una etiqueta y elige **Cambiar nombre…** para renombrarla en todas las notas, junto con las etiquetas anidadas en ella (`#project/alpha` pasa a ser `#new/alpha`). Las etiquetas coinciden sin importar mayúsculas o minúsculas. Si le das el nombre de una etiqueta que ya tienes, las dos se unen. Una etiqueta tiene letras, números, `_`, `-` y `/`, y no solo números.
- Las etiquetas del front matter (`tags: [a, b]`, o una lista bajo `tags:`) también se renombran. El código, el código en línea, las direcciones de los enlaces y las etiquetas más largas que empiezan igual (`#drafts` cuando renombras `#draft`) quedan como están.

## Permisos

- Leer archivos: para encontrar las etiquetas de la carpeta.
- Escribir archivos: para renombrar una etiqueta en las notas que la tienen.
- Herramientas para Textus AI: para que Textus AI pueda listar tus etiquetas y las notas que tienen una etiqueta.

## Cambios

- **0.3.7** - Its page is in every language Textus speaks.
- **0.3.6** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Renaming leaves `[[#Heading]]` links alone, and a ``` line inside a `~~~` block no longer ends the code.
- **0.3.3** - Tags match in any letter case, as their counts do; renaming a tag moves its nested tags too and no longer touches link addresses or front-matter tags like `project-x`; tags like `a/` or `a//b` are refused.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Tags used equally often are listed in natural name order ("Week2" before "Week10").
- **0.3.0** - Nested tags form a tree, each counting the notes of the tags under it; Textus AI finds a tag's nested tags too.
- **0.2.0** - Textus AI can list your tags and the notes with a tag (`list_tags`, `notes_with_tag`).
- **0.1.0-0.1.1** - First versions: tags with their counts, a tag's notes, renaming and merging in every note; runs on desktop and iOS.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_tags`: Enumera todas las #etiquetas de los documentos de la carpeta abierta con cuántos documentos usan cada una, las más usadas primero.
- `notes_with_tag`: Enumera los documentos de la carpeta abierta que tienen una #etiqueta, cada uno con su título, ruta y etiquetas.
<!-- /ai-tools -->
