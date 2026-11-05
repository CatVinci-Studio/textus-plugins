# Importar de Notion

Trae una exportación de Notion a Textus como archivos Markdown normales: páginas y subpáginas, imágenes y adjuntos, los enlaces entre ellas y las bases de datos.

1. En Notion, elige **Configuración › Exportar todo el contenido del espacio de trabajo**, con **Markdown y CSV** e incluyendo subpáginas. Pon el .zip que obtienes (o la carpeta que sale al descomprimirlo) en la carpeta abierta en Textus.
2. Elige **Complementos › Importar de Notion…** (o haz clic derecho en el .zip en la barra lateral) y escoge la exportación. Una exportación grande dividida en Part-1.zip, Part-2.zip… dentro de un zip se abre como una sola. Un .zip de más de 256 MB es demasiado grande para leerlo de una vez: descomprímelo, con los Part zip que contenga, en una sola carpeta dentro de la carpeta abierta y elige esa carpeta.
3. Todo va a una carpeta nueva, **Importación de Notion** y la fecha; no se cambia nada de lo que ya había. Al terminar se abre una página de informe.

En qué se convierte:

- **Páginas**: `Planes 1a2b….md` y su carpeta pasan a ser `Planes.md` y `Planes/`, la estructura que el plugin Páginas muestra como árbol. Dos páginas con el mismo nombre reciben " 2".
- **Enlaces** entre páginas, a imágenes y a adjuntos siguen los nombres nuevos. Los enlaces a páginas que no se exportaron quedan como estaban y aparecen en el informe.
- **Propiedades** bajo el título de la página de una fila de base de datos pasan a su front matter; en otras páginas esas líneas quedan como texto.
- **Bases de datos**: cada fila se vuelve un documento en una carpeta, con sus propiedades en el front matter: fechas como 2026-01-04 (formatos inglés, chino, japonés, coreano, alemán, francés, español, portugués e ISO), casillas como true/false, números, selecciones múltiples como listas y relaciones como enlaces a las filas. Al lado, una página muestra la base de datos como tabla, más un tablero si tiene un estado y un calendario si tiene fechas.
- **Destacados** (callouts) se vuelven notas (`> [!NOTE]`) y conservan su emoji. Los desplegables quedan como `<details>`.

Lo que no se trae: la exportación de Notion no incluye iconos ni portadas de página, comentarios ni las vistas guardadas de las bases de datos (filtros, ordenaciones), así que no llegan. Las propiedades de fórmula y rollup conservan el valor que tenían, las columnas quedan una tras otra, una base de datos insertada se vuelve un enlace a su página y las menciones de personas y fechas son texto normal.

El informe cuenta lo importado, lista los enlaces que no encontró y los bloques que cambió, y sugiere los plugins que ayudan con lo que trajiste: Páginas para subpáginas, Vistas de base de datos para bases de datos, Enlaces entrantes y Vista rápida para páginas enlazadas, etc. **Complementos › Plugins que ayudan tras importar de Notion…** ofrece instalar uno; Textus pregunta antes. Nada se instala solo.

Todo ocurre en tu ordenador: el plugin solo lee y escribe archivos de la carpeta abierta y nunca usa la red.
