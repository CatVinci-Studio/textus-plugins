# Búsqueda Keenable

Deja que Textus AI busque en la web con [Keenable](https://keenable.ai).

- Textus AI lo usa en una conversación cuando le pides Keenable, o cuando su propia búsqueda web no está configurada. Obtiene 5 resultados por defecto (hasta 10), cada uno con un título, una dirección, un texto breve y una fecha.
- Funciona sin clave, con la búsqueda pública de Keenable. Para la búsqueda completa de Keenable, haz clic en **Definir clave de API…** en su página de los Ajustes de Textus (o ejecuta **Keenable: definir clave de API…** desde la paleta de comandos) y pega tu clave. Hazlo otra vez y deja el campo vacío para quitar la clave y volver a la búsqueda pública. La clave se guarda en el almacén secreto de Textus en este dispositivo.
- Lo que preguntas solo se envía a Keenable cuando Textus AI usa esta herramienta en una conversación.

El plugin pide dos permisos: herramientas de IA, para dar a Textus AI la herramienta de búsqueda de abajo, y acceso a la red solo a `api.keenable.ai`, para hacer las búsquedas.

## Cambios

- **0.1.3** - Set the API key with a button on its page in Settings: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.1.2** - Removing the API key really removes it, so search goes back to the public search; an unreadable answer gets a plain message.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - First version: web search for Textus AI through Keenable, with or without an API key.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `keenable_search`: Busca en la web con Keenable y devuelve de cada resultado el título, la URL, un texto breve y la fecha. Úsala cuando el usuario pida Keenable o cuando la búsqueda web propia de Textus AI no esté configurada.
<!-- /ai-tools -->
