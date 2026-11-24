# Importar de Notion

Convierte una exportación de Notion en archivos Markdown normales en la carpeta abierta, que Obsidian también lee.

Llegan las páginas y subpáginas, las imágenes y los adjuntos, los enlaces entre ellos y las bases de datos en el formato Bases de Obsidian.

1. En Notion, elige **Settings › Export all workspace content**, con **Markdown & CSV** y las subpáginas incluidas. Pon el .zip que te da (o la carpeta en la que se descomprime) en la carpeta abierta en Textus.
2. Elige **Complementos › Importar de Notion…** (o haz clic derecho en el .zip en la barra lateral) y elige la exportación. Una exportación grande dividida en Part-1.zip, Part-2.zip… dentro de un zip se abre como una sola. Un .zip de más de 256 MB es demasiado grande para leerlo de una vez: descomprímelo en la carpeta abierta y elige esa carpeta.
3. Pon nombre a la carpeta a la que va la importación (**Notion** si no escribes otro); no se cambia nada de lo que ya hay. Una barra de progreso te deja cancelar; lo escrito hasta entonces se queda. Al final se abre una página de informe y, con **Wiki** instalado, la barra lateral muestra la importación como un árbol de páginas.

## En qué se convierte

- **Páginas**: una página con subpáginas - también una fila de base de datos con subpáginas - se convierte en una carpeta con la página dentro, `Plans/Plans.md`, y sus subpáginas a su lado; una página sin subpáginas es un archivo, `Plans.md`. Los ids de Notion desaparecen de los nombres; la página de una fila de base de datos toma su título completo, que Notion recorta en los nombres de archivo.
- **Bases de datos**: cada base de datos se convierte en una carpeta con una página que contiene un bloque `base`, con las vistas a un clic: su tablero si tiene un estado, su tabla, y su calendario si tiene fechas. Cada fila es una nota en esa carpeta, con sus propiedades en su front matter: fechas como 2026-01-04, casillas, números, listas, relaciones como enlaces. Donde otra página muestra una base de datos, también la muestra ahí, ordenada como dice la exportación. Las filas y páginas vacías «Untitled» de Notion se dejan fuera.
- **Las imágenes y los adjuntos** van a una carpeta `assets` junto a la página que los muestra; las imágenes pegadas toman el nombre de su página.
- **Los enlaces** entre páginas, a imágenes y a adjuntos siguen los nombres nuevos. Los enlaces a páginas que no se exportaron aparecen en el informe.
- **Enlaces entre páginas**: se pregunta al empezar: enlaces estándar (recomendado), `[Page](Page.md)`, como los exporta Notion y los abre cualquier app, o `[[enlaces wiki]]` como los escribe Obsidian. La carpeta importada guarda la elección, así que una página creada después en ella enlaza igual.
- **Los destacados** se convierten en notas (`> [!NOTE]`), con su emoji. Los desplegables quedan como `<details>`.

**Iconos de página**: la exportación en Markdown de Notion los deja fuera. Exporta también las mismas páginas como HTML y elige esa exportación cuando la importación lo pregunte: llegan los iconos emoji de las páginas.

**Lo que se queda atrás**: la exportación de Notion no tiene portadas, comentarios ni los filtros de las vistas guardadas, así que no llegan; el orden de una vista sí. Las propiedades de fórmula y de rollup conservan el valor que tenían, y las menciones de personas y fechas son texto normal.

## El informe

El informe cuenta lo que entró, muestra los enlaces que no encontró, los archivos que no pudo leer o escribir y los bloques que cambió, y sugiere los plugins que ayudan con el resto: primero Wiki, para el árbol de páginas y las bases de datos; luego Enlaces bidireccionales, Vista rápida, Tareas, Tarjetas de enlace, Visor de PDF y Plantillas, cada uno solo cuando la importación tiene aquello con lo que ayuda. **Complementos › Plugins que ayudan tras importar de Notion…** ofrece instalar uno; Textus pregunta antes, y no se instala nada por sí solo.

## Permisos

Todo ocurre en tu dispositivo: el plugin solo lee y escribe archivos en la carpeta abierta y nunca usa la red. Necesita Textus 1.3.10 o posterior.

## Cambios

- **0.7.13** - A simpler icon, drawn in the text colour.
- **0.7.12** - Its page is in every language Textus speaks. In Chinese, a database is 数据库, and 知识库 is only the Wiki plugin's name. Every language calls the Wiki plugin by its current name.
- **0.7.11** - Its package lists the libraries it carries, with their licenses.
- **0.7.10** - The database code it shares with Database brought up to date (its file columns filled).
- **0.7.9** - Databases it makes keep a view another plugin draws (Textus 1.4.6).
- **0.7.8** - The import report gets a free name as it is written (Textus 1.4.3).
- **0.7.7** - Bundles the Wiki plugin's newer base code; importing works as before.
- **0.7.6** - Importing a database with many rows is quicker.
- **0.7.5** - Page icons now come through from an unzipped HTML export too, and such an export shows up when you pick where the icons come from.
- **0.7.4** - Shares the database's updated filter code: a filter ticking several values reads the same in both. Shorter help and empty-state text.
- **0.7.3** - Once imported, the sidebar goes into the new folder (Textus 1.3.12) and shows its pages tree. Notion's blank rows and pages - no title, nothing written, only the "Not started" status Notion fills in - are left out.
- **0.7.2** - A database that sits under a page (as in Notion) stays a link on that page, no longer also shown there as a table; its own page shows it. Its code is split into smaller files by what each part does.
- **0.7.1** - Shares Two-way Links' fix for working out how a note links.
- **0.7.0** - asks how the pages link: standard links (recommended), as Notion exports them, or [[wiki links]] - a path shown by the page's name; the imported folder keeps the choice for pages made in it later
- **0.6.1** - Calls Workspace by its name in the import report and in the suggested plugins.
- **0.6.0** - Dates written by Textus itself; needs Textus 1.3.10.
- **0.5.0** - Page emoji icons, from Notion's HTML export of the same pages.
- **0.4.0** - Its own plugin again: pages with sub-pages as folders, databases as Obsidian bases, empty "Untitled" pages left out, and the import opened in Workspace's pages tree.
- **0.3.0** - Merged into Workspace for a while; this version only pointed there.
- **0.2.2** - One database block per database, opening on the board when there is a status.
- **0.2.1** - Asks what to name the import's folder; pasted pictures are named after their page.
- **0.2.0** - Reads Notion's newer exports: no doubled pages or rows, rows keep their whole titles, attachments go beside the page that uses them, databases shown on other pages keep their sort.
- **0.1.1** - The report suggests Two-way Links by its new name.
- **0.1.0** - First version: a Notion export (.zip or folder) into a folder of Markdown, ids out of names, links rewritten, databases as notes with front matter, callouts as notes, a report with plugins that help.
