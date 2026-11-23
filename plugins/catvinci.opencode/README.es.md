# OpenCode

Habla con OpenCode en Textus AI, con el modelo que le hayas configurado. Lee la carpeta abierta, escribe y edita tus notas, y pregunta antes de cada cambio: Textus muestra lo que quiere hacer y tú decides si lo permites. Lo que cambió queda marcado en el documento, a un solo deshacer. Para dejar que trabaje sin preguntar, elige Permitir todo en el menú junto al modelo (Textus 1.4.3 o posterior).

1. Instala [Node.js](https://nodejs.org) si no está en este equipo.
2. Funciona al momento con los modelos gratuitos de OpenCode. Para tu propio proveedor (OpenRouter entre ellos), inicia sesión una vez en una terminal: `npx -y opencode-ai@1.19.5 auth login`.
3. Haz clic en el botón de OpenCode arriba a la derecha de la ventana, junto al de Textus AI.

Textus inicia [OpenCode](https://opencode.ai) con `opencode acp`, su servidor del Agent Client Protocol, que se ejecuta con `npx`. Tus cuentas y su uso son de OpenCode; Textus no guarda ninguna clave para él.

Pregunta antes de editar, de ejecutar comandos y de traer páginas web; en el modo plan no edita. Sus subagentes están desactivados por ahora: OpenCode no transmite sus preguntas, así que un turno esperaría para siempre.

Necesita Textus 1.4.3 o posterior. Pide un solo permiso: iniciar este agente en este equipo.

## Cambios

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Asks before web fetches too, plan mode no longer edits, and sub-agents are off (their questions never arrived, so a turn hung). Needs Textus 1.4.3.
- **0.1.2** - Asks before each edit and command, as it says: OpenCode on its own allowed them unasked.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: OpenCode in Textus AI.
