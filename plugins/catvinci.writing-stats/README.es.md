# Estadísticas de escritura

Muestra en la barra lateral el recuento de palabras, el tiempo de lectura y una meta diaria de escritura.

Abre la pestaña **Estadísticas de escritura** en la barra lateral:

- **Este documento**: palabras, caracteres y tiempo de lectura.
- **Selección**: palabras y caracteres de lo que seleccionaste.
- **Hoy**: las palabras que añadiste hoy, en todos los documentos, frente a una meta diaria, y los días seguidos que la cumpliste. Pon la meta en los ajustes del plugin, en **Meta diaria**: 500 si no la cambias, 0 para ninguna.
- **Toda la carpeta**: despliégala para contar palabras, caracteres y documentos de toda la carpeta abierta.

El chino, el japonés y el coreano se cuentan por carácter; las demás escrituras, por palabra. Las marcas propias de Markdown - `#`, `*`, las direcciones de los enlaces, el front matter - no cuentan. El tiempo de lectura supone 230 palabras o 400 caracteres CJK por minuto.

Necesita Textus 1.4.3 o posterior. Pide leer el editor y los archivos de la carpeta abierta, para contarlos, y da a Textus AI la herramienta de abajo.

## Cambios

- **0.2.8** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.2.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.2.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.2.5** - Words and characters are counted as the status bar counts them (from Textus 1.4.3), and a Windows file's front matter is left out of the count.
- **0.2.4** - The store description now opens with what the plugin does.
- **0.2.3** - Today now counts only the words you type yourself, not changes from sync or AI, and stays quick in large folders. A negative daily goal is no longer shown as met.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - Updated shared path code.
- **0.2.0** - Textus AI can count the words of a document or a folder.
- **0.1.1** - Says where it runs: desktop and iPhone.
- **0.1.0** - First version: the document, the selection, today against a goal, the streak and the whole folder.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `count_words`: Cuenta palabras, caracteres y minutos de lectura de un documento, de todos los documentos de una carpeta o del documento al frente; un carácter chino, japonés o coreano cuenta como palabra y las marcas de Markdown no cuentan.
<!-- /ai-tools -->
