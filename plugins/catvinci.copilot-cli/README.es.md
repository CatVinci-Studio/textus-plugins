# GitHub Copilot CLI

Habla con GitHub Copilot CLI en Textus AI, con los modelos de tu plan de Copilot. Lee la carpeta abierta, escribe y edita tus notas, y pregunta antes de cada cambio: Textus muestra lo que quiere hacer y tú decides si lo permites. Lo que cambió queda marcado en el documento, a un solo deshacer. Su modo (agente, plan, piloto automático), su modelo y el interruptor «permitir todo» están en el menú junto al menú de modelos de Textus AI; «permitir todo» empieza desactivado.

1. Instala [Node.js](https://nodejs.org) si no está en este equipo. Necesitas un plan de GitHub Copilot.
2. Una vez, en una terminal: `npx @github/copilot login`.
3. Haz clic en el botón de GitHub Copilot CLI arriba a la derecha de la ventana, junto al de Textus AI.

Textus inicia [GitHub Copilot CLI](https://github.com/github/copilot-cli) con `copilot --acp`, su servidor del Agent Client Protocol, que se ejecuta con `npx`. Copilot CLI es software de GitHub con su propia licencia; tu cuenta y su uso son de GitHub, y Textus no guarda ningún token para él.

El piloto automático sigue trabajando por su cuenta y gasta más solicitudes premium. Textus mantiene la versión que inicia: aquí Copilot no se actualiza solo.

Necesita Textus 1.4.3 o posterior. Pide un solo permiso: iniciar este agente en este equipo.

## Cambios

- **0.1.2** - A simpler icon, drawn in the text colour.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: GitHub Copilot CLI in Textus AI.
