# Mascota de escritorio

Una compañera chibi que te acompaña mientras escribes y reacciona a lo que haces.

Actívala o desactívala con **Complementos › Mostrar u ocultar la mascota**, o desde la paleta de comandos. La primera vez que se activa el plugin, aparece ella sola.

- **Quién:** Moyu, la chica gato propia de Textus. Mientras Textus AI trabaja y su panel está abierto, viene de visita la LLM-chan del modelo que usa: Claude-chan, GPT-chan, Gemini-chan, DeepSeek-chan, Kimi-chan, Qwen-chan, Doubao-chan, GLM-chan, MiniMax-chan, Grok-chan o ERNIE-chan. La invitada se queda un minuto y medio más o menos después de que Textus AI termine, y se va a casa cuando se cierra el panel de IA. Para quedarte con un solo personaje, elígelo en los ajustes del plugin o con **Cambiar de personaje…** en su menú contextual.
- **Dónde:** al principio, dentro de la ventana de Textus. Arrástrala adonde quieras; haz clic derecho sobre ella para cambiar de personaje, ponerla en tu escritorio (por encima de todas las ventanas), plegarla en un punto o cerrarla. En el escritorio, su menú también abre Textus o Textus AI. Aparece donde la dejaste y, esté en el lado que esté, se gira hacia el centro.
- **Qué hace:** escribe mientras tecleas, sueña despierta y luego dormita cuando paras, se alegra cuando guardas, se inclina para mirar cuando Textus AI trabaja y duerme mientras Textus está en segundo plano. Haz clic en ella y te responde; haz clic varias veces para acariciarla; llévatela a otro sitio y se asusta. Te saluda una vez al día, te da la bienvenida tras un descanso largo, te anima después de un buen rato escribiendo y luego te pide que descanses, te recuerda que duermas a altas horas de la noche y te avisa cuando Textus AI tiene ediciones para que las revises.
- **Qué dice:** cada personaje habla con su propia voz, con unas cuantas frases para cada momento, en todos los idiomas de Textus (`lines/`).

## Ajustes

- **Quién te acompaña:** seguir el modelo de Textus AI (por defecto) o siempre el mismo personaje.
- **Bocadillos:** desactívalos y se queda callada.
- **Recordarme descansar de madrugada:** si escribes entre las 11 de la noche y las 5 de la mañana, te recuerda una vez esa noche que te vayas a dormir.

Solo se entera de *que* algo pasó - tecleaste, guardaste, Textus AI está pensando -, nunca de una palabra de tus documentos o conversaciones, así que el plugin no pide permisos.

## Créditos

Moyu es un personaje propio de CatVinci Studio. Las LLM-chan son las personificaciones que la comunidad hizo de los modelos de IA, diseñadas por [ZipZipPipe](https://space.bilibili.com/4168597) y otros artistas, y redibujadas en estilo chibi por CatVinci Studio; mira [LLM-chan stickers](https://github.com/ChengAoShen/LLM-chan-stickers). Es una obra de fans, sin relación con ninguna empresa de IA.

## Cambios

- **0.1.10** - Its page is in every language Textus speaks. Its description begins with what she does, and no longer counts the characters or languages. Its page receives Textus's messages by the API's current name.
- **0.1.9** - Code kept for Textus versions it no longer runs on is gone.
- **0.1.8** - What she says sits above her, two lines at most, and never covers her face.
- **0.1.7** - A visiting LLM-chan keeps her pose and greeting when a new page opens, and stays still while Textus is in the background. Her hop is gentler, and the bubble's tail points at her middle.
- **0.1.6** - The speech bubble's tail joins its box with no line between them.
- **0.1.5** - started on the left, she faces the middle from the first frame; her speech bubble is Textus's own, and when she is small its words shrink with her (to a readable floor) and wrap into even lines; needs Textus 1.3.12
- **0.1.4** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.3** - The model's LLM-chan visits only while the Textus AI panel is open, and goes home when it closes.
- **0.1.2** - Every character redrawn; she sits at either side and turns to face the middle.
- **0.1.1** - Moyu speaks for herself when Textus AI works ("I'm here to help"), and cheers on fluent writing.
- **0.1.0** - First version: Moyu and the LLM-chan in a floating view, in the window or on the desktop, with lines in every language Textus speaks.
