# WakaTime

Envía el tiempo que pasas escribiendo en Textus a tu cuenta de [WakaTime](https://wakatime.com), para que aparezca en tu panel junto a tu tiempo programando.

1. Copia tu clave de API de [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key).
2. Haz clic en **Configurar clave de API…** en la página de WakaTime de los Ajustes de Textus y pégala. La clave se guarda en el almacén secreto de Textus.

El menú Complementos y la paleta de comandos tienen **WakaTime: configurar clave de API…**, **WakaTime: tiempo de escritura de hoy**, que muestra el total de hoy tal como lo cuenta WakaTime, y **WakaTime: abrir el panel**.

## Qué cuenta y qué se envía

- Solo cuenta tu propio trabajo en una ventana de Textus que esté delante: escribir, mover el cursor, cambiar de documento y guardar. El tiempo con Textus en segundo plano y los cambios hechos en disco o por un plugin no cuentan. Lo escrito con Textus AI cuenta como programación con IA.
- Por cada momento de trabajo le dice a WakaTime la ruta del documento, el lenguaje (Markdown), el número de líneas, el proyecto y la rama de Git. El proyecto es la primera línea de un archivo `.wakatime-project` en la carpeta abierta o, si no, el nombre de la carpeta abierta.
- Envía como mucho una vez cada dos minutos para el mismo documento, y siempre al guardar, como hacen los plugins propios de WakaTime.
- Sin conexión, el tiempo espera en una cola y se envía después, por lotes.
- No se envía nada antes de poner la clave, y un documento sin guardar nunca se envía. Para dejar de enviar, deja la clave vacía.

Necesita Textus 1.3.0 o posterior. Pide leer el editor y los archivos de la carpeta abierta (para el documento, sus líneas, `.wakatime-project` y `.git/HEAD`) y conectarse a `api.wakatime.com`, y a nada más en la red.

## Cambios

- **0.2.6** - Its icon is WakaTime's own logo.
- **0.2.5** - Set the API key with a button on its page in Settings, and find its commands in the Plugins menu: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.2.4** - Leaving the key empty now really turns it off; a garbled reply to Today's Writing Time shows the usual message.
- **0.2.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.2** - Finds `.wakatime-project` and the Git branch the same way on every system.
- **0.2.1** - Says where it runs: desktop and iPhone.
- **0.2.0** - Only your own work in a window in front counts; an offline queue sent in batches; project, branch and lines; Today's Writing Time.
- **0.1.0** - First version: writing time in Textus on your WakaTime dashboard.
