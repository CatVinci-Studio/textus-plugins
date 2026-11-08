# Emacs

Te deja moverte, marcar, cortar (kill) y pegar (yank) en el editor con las teclas de Emacs.

Las teclas funcionan en cuanto instalas el complemento. **Complementos › Activar o desactivar las teclas de Emacs** las enciende y apaga, igual que un clic en **Emacs** en la barra de estado, que además muestra **Marca** mientras hay una marca puesta y **C-x-** mientras C-x espera su segunda tecla. Solo toma las teclas de abajo; escribir sigue siendo cosa del editor. En un documento Markdown, una «línea» es un párrafo, un encabezado, un elemento de lista o una línea de un bloque de código.

- **Moverse**: **C-f C-b C-n C-p**, **C-a C-e**, **M-f M-b**, **M-< M->**, **M-{ M-}** por párrafos, **C-v M-v** de veinte en veinte líneas.
- **Marca y región**: **C-SPC** pone la marca y los movimientos siguientes (también las flechas) amplían la región; **C-g** la quita; **C-x h** selecciona todo el documento.
- **Kill ring**: **C-k** corta hasta el final de la línea (al final, la une con la siguiente), **C-w** corta la región, **M-w** la copia, **M-d** y **M-DEL** cortan una palabra hacia delante o hacia atrás. Los cortes seguidos se juntan en uno. **C-y** pega el corte más reciente y **M-y** justo después lo cambia por otros más antiguos. **C-d** borra un carácter sin tocar el kill ring.
- **Mayúsculas**: **M-u**, **M-l** y **M-c** ponen la palabra siguiente en mayúsculas, en minúsculas o con inicial mayúscula.
- **Deshacer y guardar**: **C-/**, **C-_** o **C-x u** deshacen; **C-x C-s** guarda.

En Mac, los atajos de Textus van con ⌘, así que todas las teclas Ctrl son de Emacs. En Windows y Linux, las teclas Ctrl son de Textus y del sistema (copiar, pegar, cortar, seleccionar todo, negrita, buscar), así que solo las teclas M-, C-SPC y C-g son de Emacs hasta que actives **Usar también las teclas Ctrl de la app** en los ajustes del complemento.

Funciona en escritorio y en iPhone. Pide un solo permiso, teclas del editor, para tomar estas teclas en el editor.

## Cambios

- **0.1.4** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.1.3** - Indica dónde funciona: escritorio y iPhone.
- **0.1.2** - C-x ya no se queda enganchado; C-d y C-y no tocan el portapapeles ni la región.
- **0.1.0-0.1.1** - Primeras versiones: movimientos, marca y región, kill ring con C-y y M-y, M-u M-l M-c, deshacer y teclas C-x; página en la tienda e icono.
