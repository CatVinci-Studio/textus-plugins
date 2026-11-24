# Carpetas SSH

Abre una carpeta de un servidor con tu propio ssh y escribe allí como en una carpeta de este equipo: sus documentos en pestañas, sus archivos en la barra lateral.

## Qué hace

- **Complementos › Abrir carpeta remota…** muestra los servidores de tu `~/.ssh/config` (o acepta uno que escribas, como `me@server`) y luego la carpeta que abrir, empezando por tu carpeta personal allí.
- La carpeta se abre en la barra lateral. Los documentos se abren, guardan, renombran, mueven y buscan como en cualquier carpeta; un documento o una carpeta nuevos se crean en el servidor.
- Tu propio `ssh` hace la conexión, con tu configuración, tus claves, tu agente y tus hosts conocidos. Solo se pide transferencia de archivos (SFTP): ni shell ni comandos.
- Si la conexión se corta, se vuelve a hacer la próxima vez que se lee o se guarda un archivo.

## Límites

- Solo se entra con clave o agente. Un servidor que pide contraseña se rechaza; añádele antes una clave.
- Un servidor que ssh aún no conoce se rechaza, nunca se acepta por ti: conéctate una vez con `ssh` en una terminal y acepta allí su clave.
- Aún no se pueden pegar imágenes en un documento de un servidor, y un archivo eliminado desaparece para siempre: un servidor no tiene papelera.

## Permisos

Pide **ssh**: Textus te pregunta una vez por cada servidor antes de que el plugin pueda conectarse a él.

## Cambios

- **0.1.2** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.": the store shows that.
- **0.1.1** - Uses the plugin API as Textus 1.4.6 ships it.
- **0.1.0** - First version. Needs Textus 1.4.6.
