# Imágenes junto al documento

Guarda las imágenes de cada documento en una carpeta a su lado con su mismo nombre, como hacen Typora y VS Code: las imágenes de `Note.md` van en `Note.assets/`.

No hay nada que activar ni ajustar; funciona solo en cuanto lo instalas.

- Pega o suelta una imagen en un documento guardado. Textus guarda primero la imagen; luego este complemento la mueve a la carpeta del documento y cambia el enlace a `Note.assets/imagen.png`. Si el nombre ya existe, recibe un número; nunca se sobrescribe nada. Si el enlace no se puede cambiar, la imagen vuelve a donde estaba.
- Si renombras un documento dentro de su carpeta, su carpeta de imágenes se renombra con él, enlaces incluidos, salvo que otro documento también enlace a esa carpeta; en ese caso ambos se quedan como están.
- Las imágenes que ya están en tus documentos se quedan donde están.
- En una bóveda de Obsidian con carpeta de adjuntos configurada, y en un grafo de Logseq, las imágenes se quedan donde las pone esa app.

Trabaja con imágenes PNG, JPEG, GIF, WebP, AVIF, BMP, SVG, ICO, HEIC y TIFF. Necesita Textus 1.4.0 o posterior. Pide leer y escribir archivos, para mover las imágenes y renombrar sus carpetas, y leer y editar el documento que tienes delante, para cambiar el enlace a una imagen movida.

## Cambios

- **0.1.8** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.0.
- **0.1.7** - The store description now opens with what the plugin does.
- **0.1.6** - Adding many pictures at once (a sync, a folder copied in) no longer reads the open document over and over.
- **0.1.5** - In an Obsidian vault, pictures stay where the vault's attachment setting puts them again: the setting is read through Textus.
- **0.1.4** - Leaves pictures where a document's Typora image folder setting puts them, and no longer moves a folder while some links to it may still be unchecked.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Leaves pictures where an Obsidian vault's attachment folder setting or a Logseq graph puts them.
- **0.1.1** - A shorter name: Images Follow Document.
- **0.1.0** - First version: pasted and dropped pictures move into `Note.assets/`, and the folder follows a renamed document.
