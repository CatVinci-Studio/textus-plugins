# Tablero de tareas

Organiza el trabajo en tarjetas y listas sobre un tablero que se guarda como un archivo Markdown normal.

- **Plugins › Nuevo tablero de tareas…** pide un nombre y crea _nombre_.md en la carpeta abierta, con `kanban-plugin: board` en su front matter y tres listas: Por hacer, En curso y Hecho. Si ya hay un tablero con ese nombre, se abre ese.
- Cualquier archivo .md con `kanban-plugin` en su front matter se abre como tablero. Así guarda sus tableros el plugin Kanban de Obsidian, de modo que cada app abre los de la otra. Los tableros antiguos llamados _nombre_.kanban.md también se abren como tableros.
- Cada lista es un encabezado del archivo y cada tarjeta una tarea debajo, así que el tablero se lee bien en cualquier sitio.

## En el tablero

- **Añadir una tarjeta** al final de una lista. Haz clic en el texto de una tarjeta para editarlo, marca su casilla cuando esté hecha y usa su botón × para quitarla.
- **Añadir lista** crea una lista nueva. Haz clic en el título de una lista para renombrarla; una lista vacía se puede quitar.
- Arrastra tarjetas dentro de una lista o a otra, y arrastra una lista por su cabecera para cambiar el orden. Las demás se apartan mientras arrastras.
- Escribe un [[enlace]] en una tarjeta y haz clic en él para abrir esa nota.
- **Editar como Markdown** abre el archivo como texto. El tablero sigue los cambios hechos ahí o en cualquier otro sitio.
- Lo que el Kanban de Obsidian guarda en el archivo además de las listas, como sus ajustes y la marca de su lista de terminadas, queda como estaba.

```markdown
---
kanban-plugin: board
---

## Por hacer

- [ ] Escribir el esquema

## Hecho

- [x] Elegir un título
```

## Permisos

- Leer y escribir archivos: para abrir tableros y guardarlos.
- Herramientas para Textus AI: para que Textus AI pueda encontrar y leer tableros, añadir tarjetas y moverlas.

## Cambios

- **0.4.5** - Una tarjeta o lista arrastrada se queda justo bajo el puntero y se eleva como todo lo que se arrastra en Textus. Sus barras, listas y controles son ahora los de Textus, crecen con la interfaz y siguen cada tema; necesita Textus 1.3.12.
- **0.4.4** - Arrastrar una tarjeta o una lista ya no selecciona texto por el camino.
- **0.4.3** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.4.2** - Tarjetas y listas siguen al puntero al arrastrarlas, y las demás se apartan. Requiere Textus 1.3.10.
- **0.4.1** - Conserva la marca que el Kanban de Obsidian pone en una lista de terminadas.
- **0.4.0** - Ahora se llama Tablero de tareas (antes Kanban). Los tableros nuevos son archivos .md normales con `kanban-plugin` en su front matter, como los escribe Obsidian; los .kanban.md siguen abriéndose.
- **0.3.1** - Textus AI distingue los tableros de las tareas escritas en documentos.
- **0.3.0** - Textus AI puede listar y leer tableros, añadir tarjetas y moverlas.
- **0.2.0** - Controles y menús propios de Textus.
- **0.1.0-0.1.3** - Primeras versiones: tableros en Markdown, tarjetas arrastradas entre listas, listas movidas por su cabecera, [[enlaces]] que abren notas, Editar como Markdown, cambios hechos en otro sitio mostrados al momento, ajustes de Obsidian conservados.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_boards`: Enumera los tableros Kanban (archivos kanban-plugin .md) de la carpeta abierta, cada uno con sus listas y cuántas tarjetas tiene cada una.
- `read_board`: Lee un tablero Kanban: sus listas en orden, cada una con el texto de sus tarjetas y si están hechas. Las tareas escritas en documentos normales son list_tasks.
- `add_card`: Añade una tarjeta al final de una lista de un tablero Kanban. Solo para un tablero (kanban-plugin .md); una tarea en un documento es add_task.
- `move_card`: Mueve una tarjeta de un tablero Kanban a otra lista, o a otro lugar de la suya.
<!-- /ai-tools -->
