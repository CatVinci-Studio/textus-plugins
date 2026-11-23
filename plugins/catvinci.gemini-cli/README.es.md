# Gemini CLI

Habla con Gemini CLI en Textus AI, con los modelos Gemini de Google. Lee la carpeta abierta, escribe y edita tus notas, y pregunta antes de cada cambio: Textus muestra lo que quiere hacer y tú decides si lo permites. Lo que cambió queda marcado en el documento, a un solo deshacer. Su modo (preguntar primero, aceptar ediciones, aceptar todo, plan) y su modelo están en el menú junto al menú de modelos de Textus AI.

1. Instala [Node.js](https://nodejs.org) si no está en este equipo.
2. Haz clic en el botón de Gemini CLI arriba a la derecha de la ventana, junto al de Textus AI. La primera vez se abre el navegador para entrar con tu cuenta de Google. Para una clave de la API de Gemini o Vertex AI, ejecuta `npx @google/gemini-cli` una vez en una terminal y elígela con `/auth` (Textus abierto desde el Dock no ve las variables definidas en una terminal).

Textus inicia [Gemini CLI](https://github.com/google-gemini/gemini-cli) con `gemini --acp`, su servidor del Agent Client Protocol, que se ejecuta con `npx`. Tu cuenta y su uso son de Google; Textus no guarda ninguna clave para él.

Aceptar ediciones y aceptar todo solo funcionan en las carpetas en las que confiaste en el propio Gemini CLI; en las demás se queda en preguntar primero.

Necesita Textus 1.4.3 o posterior. Pide un solo permiso: iniciar este agente en este equipo.

## Cambios

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Gemini CLI in Textus AI.
