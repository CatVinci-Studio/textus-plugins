# Codex

Habla con Codex en Textus AI. Lee la carpeta abierta, escribe y edita tus notas, y pregunta antes de cada cambio: Textus muestra lo que quiere hacer y tú decides si lo permites. Lo que cambió queda marcado en el documento, a un solo deshacer.

1. Instala [Node.js](https://nodejs.org) si no está en este equipo.
2. La primera vez se abre el navegador para entrar con ChatGPT; o entra una vez en una terminal: `npx -y @agentclientprotocol/codex-acp@2.6.0 cli login`.
3. Haz clic en el botón de Codex arriba a la derecha de la ventana, junto al de Textus AI, o elige **Codex** en el menú de modelos de Textus AI.

Textus inicia Codex de OpenAI con el adaptador del Agent Client Protocol `@agentclientprotocol/codex-acp`, que se ejecuta con `npx`. Tu cuenta y su uso son de Codex; Textus no guarda ninguna clave para él.

Empieza en **Read-only**, el modo que pregunta antes de cada edición y cada comando; elige otro en el menú junto al modelo.

Necesita Textus 1.4.3 o posterior. Pide un solo permiso: iniciar este agente en este equipo.

## Cambios

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Signs in with ChatGPT in the browser (before, it tried an API key and stopped there), and starts in Read-only. Needs Textus 1.4.3, which also marks the changes Codex writes itself.
- **0.1.2** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Codex answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Codex in Textus AI.
