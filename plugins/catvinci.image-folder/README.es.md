# Imágenes junto al documento

Guarda las imágenes de cada documento en una carpeta a su lado con su mismo nombre, como hacen Typora y VS Code: las imágenes de `Note.md` van en `Note.assets/`.

No hay nada que activar ni ajustar; funciona solo en cuanto lo instalas.

- Pega o suelta una imagen en un documento guardado. Textus guarda primero la imagen; luego este complemento la mueve a la carpeta del documento y cambia el enlace a `Note.assets/imagen.png`. Si el nombre ya existe, recibe un número; nunca se sobrescribe nada. Si el enlace no se puede cambiar, la imagen vuelve a donde estaba.
- Si renombras un documento dentro de su carpeta, su carpeta de imágenes se renombra con él, enlaces incluidos, salvo que otro documento también enlace a esa carpeta; en ese caso ambos se quedan como están.
- Las imágenes que ya están en tus documentos se quedan donde están.
- En una bóveda de Obsidian con carpeta de adjuntos configurada, y en un grafo de Logseq, las imágenes se quedan donde las pone esa app.

Trabaja con imágenes PNG, JPEG, GIF, WebP, AVIF, BMP, SVG, ICO, HEIC y TIFF. Funciona en escritorio y necesita Textus 1.3.0 o posterior. Pide leer y escribir archivos, para mover las imágenes y renombrar sus carpetas, y leer y editar el documento que tienes delante, para cambiar el enlace a una imagen movida.

## Cambios

- **0.1.4** - Deja las imágenes donde las pone la carpeta de imágenes de Typora de un documento y ya no mueve una carpeta si aún puede haber enlaces a ella sin revisar.
- **0.1.3** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.1.2** - Deja las imágenes donde las pone la carpeta de adjuntos de una bóveda de Obsidian o un grafo de Logseq.
- **0.1.1** - Un nombre más corto: Imágenes junto al documento.
- **0.1.0** - Primera versión: las imágenes pegadas y soltadas van a `Note.assets/`, y la carpeta sigue al documento renombrado.
