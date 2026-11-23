# DeepSeek Harness

Habla con DeepSeek Harness, el agente propio de DeepSeek, en Textus AI. Lee la carpeta abierta, escribe y edita tus notas, y pregunta antes de cada cambio: Textus muestra lo que quiere hacer y tú decides si lo permites. Lo que cambió queda marcado en el documento, a un solo deshacer.

1. Instala [Node.js](https://nodejs.org) 24.9 o posterior si este equipo no lo tiene.
2. Dale tu clave de API de DeepSeek una vez: ejecuta `npx -y @deepseek-ai/dsh@0.2.2-rc.1 web` en una terminal y añade la clave en su página Models.
3. Haz clic en el botón de DeepSeek Harness arriba a la derecha de la ventana, junto al de Textus AI.

Textus inicia [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) con `dsh --profile acp`, su servidor del Agent Client Protocol, que se ejecuta con `npx`. Tu clave y su uso son de DeepSeek; Textus no guarda ninguna clave para él. DeepSeek Harness es una versión preliminar, así que su comportamiento puede cambiar.

Textus lo inicia en su entorno aislado de solo lectura: lee y busca libremente, y pregunta antes de escribir un archivo o de ejecutar un comando que cambie algo.

DeepSeek Harness envía por defecto sus registros de sesión a DeepSeek; desactívalo en `dsh web`, Settings › General. Textus desactiva sus informes de uso.

Necesita Textus 1.4.3 o posterior. Pide un solo permiso: iniciar este agente en este equipo.

## Cambios

- **0.1.3** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.2** - Asks before writing files or running commands that change things (before, it did both without asking). Usage reports off, and the setup names the exact version and Node.js 24.9. Needs Textus 1.4.3.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: DeepSeek Harness in Textus AI.
