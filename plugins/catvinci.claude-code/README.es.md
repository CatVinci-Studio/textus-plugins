# Claude Code

Habla con Claude Code en Textus AI. Lee la carpeta abierta, escribe y edita tus notas, y pregunta antes de cada cambio: Textus muestra lo que quiere hacer y tú decides si lo permites. Lo que cambió queda marcado en el documento, a un solo deshacer.

1. Instala [Node.js](https://nodejs.org) si no está en este equipo.
2. Inicia sesión en Claude Code una vez, en una terminal: `npx -y @agentclientprotocol/claude-agent-acp@0.107.0 --cli auth login --claudeai` (o ejecuta `claude` si lo tienes instalado).
3. Haz clic en el botón de Claude Code arriba a la derecha de la ventana, junto al de Textus AI, o elige **Claude Code** en el menú de modelos de Textus AI.

Textus inicia Claude Code de Anthropic con el adaptador del Agent Client Protocol `@agentclientprotocol/claude-agent-acp`, que se ejecuta con `npx`. Tu cuenta y su uso son de Claude Code; Textus no guarda ninguna clave para él.

Empieza en el modo **Manual** de Claude Code, que pregunta antes de cada edición y cada comando; elige otro modo en el menú junto al modelo. Para usarlo a través de OpenRouter, pon `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN` y un `ANTHROPIC_API_KEY` vacío en el bloque `env` de `~/.claude/settings.json`: Textus abierto desde el Dock no ve las variables definidas en una terminal.

Necesita Textus 1.4.3 o posterior. Pide un solo permiso: iniciar este agente en este equipo.

## Cambios

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Starts in Manual mode, named by the plugin; its sign-in command needs no separate Claude Code install. Needs Textus 1.4.3, which also marks the changes Claude Code writes itself.
- **0.1.2** - Uses Claude Code's ACP adapter 0.107.0. Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Claude Code answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Claude Code in Textus AI.
