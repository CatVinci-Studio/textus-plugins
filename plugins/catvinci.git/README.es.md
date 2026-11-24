# Git

Para una carpeta guardada en Git:

- Los archivos que cambiaron desde el último commit se marcan en la barra lateral: **M** modificado, **A** añadido, **U** nuevo y aún no en Git, **R** renombrado, **!** en conflicto.
- En un documento cambiado, cada párrafo, encabezado o lista con líneas que el último commit no tenía (tal como se guardó) lleva una marca en el margen derecho; al hacer clic en ella se hace commit (Textus 1.4.4).
- La barra de estado muestra la rama, con ↑ los commits por enviar y ↓ los que hay que traer; al hacer clic se hace commit.
- **Hacer commit de los cambios…** (menú Complementos, o la rama) muestra los archivos cambiados, con el que tienes delante ya elegido; tú escribes el mensaje y tu propio Git hace commit solo de esos archivos: sus hooks y la firma funcionan como siempre. El primer commit en una carpeta pregunta antes.
- **Enviar (push)** y **Traer (pull)** (menú Complementos) envían la rama a su rama remota y traen los commits del remoto, con tu propio Git y las credenciales que tenga guardadas; si las pide, inicia sesión una vez con Git en una terminal. Una rama que aún no tiene rama remota se envía a `origin`. Un pull que daría conflicto se deshace, sin cambiar nada, y se te avisa (Textus 1.4.6).
- Con Historial de versiones 0.4, los commits de un documento aparecen entre sus versiones y se comparan y restauran igual.
- Textus AI puede leer los cambios, los commits de un archivo y un archivo tal como lo tenía un commit; por ejemplo, para redactar tu mensaje de commit.

Nada cambia de rama. Necesita Git instalado (en un Mac, las Command Line Tools) y Textus 1.4.6.

## Cambios

- **0.3.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.", and its tools for Textus AI are described in every language.
- **0.3.0** - Push and Pull, and what waits to be pushed or pulled beside the branch (Textus 1.4.6).
- **0.2.0** - Blocks changed since the last commit are marked in the margin (Textus 1.4.4).
- **0.1.1** - The first-commit confirmation's button reads "Commit".
- **0.1.0** - First version.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `git_changes`: La rama de la carpeta abierta y los archivos cambiados, con las líneas de cada archivo de texto cambiado frente a su último commit. Léelo antes de escribir un mensaje de commit.
- `git_history`: Los commits de Git de un archivo, del más reciente al más antiguo, a través de los cambios de nombre: hash, fecha, autor, asunto.
- `git_file_at`: El texto de un archivo tal como lo tenía uno de sus commits (hash de git_history).
<!-- /ai-tools -->
