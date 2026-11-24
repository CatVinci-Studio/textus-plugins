# Qwen Code

Habla con Qwen Code en Textus AI, con los modelos Qwen de Alibaba. Lee la carpeta abierta, escribe y edita tus notas, y pregunta antes de cada cambio: Textus muestra lo que quiere hacer y tú decides si lo permites. Lo que cambió queda marcado en el documento, a un solo deshacer. Su modo (preguntar primero, aceptar ediciones, decidir por sí mismo, aceptar todo, plan), su modelo y el razonamiento están en el menú junto al menú de modelos de Textus AI.

1. Instala [Node.js](https://nodejs.org) 22 o posterior si no está en este equipo.
2. Dale una clave de API una vez: pon `OPENAI_API_KEY`, `OPENAI_BASE_URL` y `OPENAI_MODEL` en `~/.qwen/.env` (para OpenRouter, la URL base es `https://openrouter.ai/api/v1`), o ejecuta `npx @qwen-code/qwen-code` en una terminal y usa `/auth` (Alibaba Cloud Model Studio o cualquier servicio compatible con OpenAI).
3. Haz clic en el botón de Qwen Code arriba a la derecha de la ventana, junto al de Textus AI.

Textus inicia [Qwen Code](https://github.com/QwenLM/qwen-code) con `qwen --acp`, su servidor del Agent Client Protocol, que se ejecuta con `npx`. Tu clave y su uso son de tu proveedor; Textus no guarda ninguna clave para él.

Empieza en preguntar primero. Lo que eliges con «Permitir siempre» para los comandos, Qwen Code lo guarda para siempre, en el proyecto o para ti.

Necesita Textus 1.4.3 o posterior. Pide un solo permiso: iniciar este agente en este equipo.

## Cambios

- **0.1.2** - Its icon is Qwen Code's own logo.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Qwen Code in Textus AI.
