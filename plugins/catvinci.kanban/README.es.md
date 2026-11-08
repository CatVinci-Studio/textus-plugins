# Tablero de tareas

Tableros de tarjetas en listas, guardados como un archivo Markdown normal.

- **Complementos › Nuevo tablero de tareas…** crea uno: _nombre_.md con `kanban-plugin: board` en su front matter, el formato del Kanban de Obsidian, así que cada uno abre los tableros del otro. Los tableros antiguos _nombre_.kanban.md se siguen abriendo como tableros.
- Cada lista es un encabezado del archivo y cada tarjeta una tarea debajo de él, así que el tablero se puede leer en cualquier parte.
- Añade una tarjeta al final de una lista; arrastra las tarjetas entre listas, y las listas para reordenarlas. Una tarjeta marcada está hecha.
- Escribe un [[enlace]] en una tarjeta y haz clic en él para abrir esa nota.
- **Editar como Markdown** abre el archivo como texto; el tablero refleja tus cambios.

```markdown
## Por hacer

- [ ] Escribir el esquema

## Hecho

- [x] Elegir un título
```

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_boards`: Enumera los tableros Kanban (archivos kanban-plugin .md) de la carpeta abierta, cada uno con sus listas y cuántas tarjetas tiene cada una.
- `read_board`: Lee un tablero Kanban: sus listas en orden, cada una con el texto de sus tarjetas y si están hechas. Las tareas escritas en documentos normales son list_tasks.
- `add_card`: Añade una tarjeta al final de una lista de un tablero Kanban. Solo para un tablero (kanban-plugin .md); una tarea en un documento es add_task.
- `move_card`: Mueve una tarjeta de un tablero Kanban a otra lista, o a otro lugar de la suya.
<!-- /ai-tools -->
