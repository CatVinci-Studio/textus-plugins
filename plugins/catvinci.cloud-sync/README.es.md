# Sincronización en la nube

Mantén una carpeta igual en todos tus equipos a través de tu propio almacenamiento compatible con S3, WebDAV o Nutstore, con las versiones anteriores guardadas en la nube y, si quieres, cifrada antes de salir de cada dispositivo.

Con el cifrado de extremo a extremo activado, el servicio de almacenamiento no ve ni el contenido de tus archivos ni sus nombres.
Sincronización en la nube necesita Textus 1.4.1 o posterior.

## Primeros pasos

1. Abre en Textus la carpeta que quieres sincronizar y elige **Complementos › Sincronización en la nube**
   (o **Ajustes de conexión…** en su pestaña de la barra lateral).
2. Elige el servicio de almacenamiento y escribe la dirección de su servidor y tus datos de acceso. Nutstore
   solo necesita tu correo y una contraseña de aplicación de Account › Security.
3. Para cifrar, activa **Cifrado de extremo a extremo** y pon una **contraseña de sincronización**
   de al menos 12 caracteres; guárdala en tu gestor de contraseñas: no se puede
   restablecer. Decídelo una vez por carpeta remota: cambiarlo después requiere una carpeta nueva
   y vacía.
4. Elige **Guardar conexión** y luego **Sincronizar ahora**.

En otro dispositivo, abre la carpeta correspondiente y escribe el mismo servicio y
la misma carpeta remota (y, si está cifrada, la misma contraseña de sincronización). Activa **Sincronizar automáticamente**
(mientras Textus está abierto): entonces sincroniza unos segundos después de guardar o renombrar un
archivo, y además cada 5 minutos por si nada lo ha activado (**Intervalo de sincronización**: de 5 a
60 minutos). Un archivo que eliminas se va con la siguiente sincronización. **Complementos › Sincronizar
ahora** sincroniza en cualquier momento.

Una vez guardada una conexión, la barra de estado muestra cómo va la sincronización: **Sincronizado ·
hace 2 min**, **Sincronizando…**, **Conflicto de sincronización** o **Error de sincronización**. Haz clic para
abrir el panel.

Cuando los dos dispositivos cambiaron el mismo archivo, se quedan las dos versiones: la tuya en su sitio,
la del otro dispositivo en `Sync conflicts/`.

## Historial en la nube

Cada vez que una sincronización reemplaza o elimina un archivo, su contenido anterior se queda en la
carpeta remota. Haz clic derecho en un archivo y elige **Historial en la nube…** para ver sus
versiones (cuándo, desde qué dispositivo, qué tamaño), leer una y elegir **Restaurar esta
versión**: pasa a ser el archivo actual y se sincroniza, y la versión que reemplaza
se queda en el historial. Si el archivo tiene cambios aún sin sincronizar, o está abierto,
la versión se escribe a su lado (`Note (3f2a9c1b).md`). **Complementos › Historial en la nube…** muestra los archivos eliminados de
la carpeta; abre uno para recuperarlo.

**Conservar historial en la nube** fija cuánto tiempo, contado desde que se reemplazó una versión:
30, 90 (por defecto) o 365 días, o siempre. Un solo ajuste vale para
la carpeta: el último sincronizado desde cualquier dispositivo, que los demás muestran después.
Durante el primer día se guarda una versión por hora, luego una al día, como mucho 200 por
archivo; si el historial supera 8 MB de registros, se van primero las versiones más antiguas.
Cada sincronización que cambia algo, y si no una vez al día, deja ir las versiones
caducadas y borra los bloques que solo usaban ellas. El espacio ocupado antes de la 0.5
(instantáneas antiguas) no se recupera. Actualiza todos los dispositivos a la 0.5: lo que cambia un dispositivo con la 0.4
solo entra en el historial en la siguiente sincronización con la 0.5, y sus propias
eliminaciones no aparecen hasta entonces.

**Permisos:** leer y escribir en la carpeta abierta (para revisarla y aplicar lo que
llega), y conectarse a cualquier sitio web (solo al servidor HTTPS que escribas). Sin
telemetría, analíticas, código remoto ni actualizaciones propias.

## Detalles

S3 admite un endpoint personalizado (vacío significa AWS), región, bucket, direcciones de estilo ruta o
de host virtual y un token de sesión opcional en **Más opciones**.
La carpeta remota guarda el formato de almacenamiento del plugin, no una copia simple de los archivos;
usa una distinta para cada espacio de trabajo.

Las credenciales se guardan mediante `ctx.secrets`, aparte del estado de sincronización.
Nunca se devuelven a la página de ajustes ni se copian al manifiesto
remoto. Los campos de credenciales vacíos conservan las credenciales de una conexión existente.
Cambiar el endpoint, la carpeta remota o la cuenta requiere las credenciales correspondientes.
La contraseña de sincronización también se guarda localmente mediante `ctx.secrets` para la sincronización automática,
y nunca se devuelve a la página de ajustes ni se envía al servicio de almacenamiento. Los campos de contraseña
vacíos la conservan. Escribir aquí otra contraseña no vuelve a cifrar un repositorio
existente: debe coincidir con la contraseña con la que se inicializó esa carpeta remota.

## Qué se sincroniza

- Los documentos `.md`, `.markdown`, `.mdown`, `.mkd`, `.txt` y `.csv` guardados, y
  las bases (`.base`) y los lienzos (`.canvas`) de Obsidian.
- Imágenes, PDF, archivos de Office/OpenDocument, audio y vídeo. La lista exacta
  está en `development/cloud-sync/src/config.ts`, en el repositorio del plugin.
- Los datos de proyecto de Textus: `.textus/agent.md`, `style.md`, `style.previous.md`,
  y el Markdown de `.textus/library/`, `memory/` y `skills/`.

Se excluyen los ajustes globales, el historial de chat, los borradores, los cambios sin guardar, las credenciales, los datos de otros
plugins, los archivos ocultos cualesquiera y las carpetas de compilación y dependencias.
Solo se puede acceder a los archivos dentro del espacio de trabajo abierto. Los de fuera,
incluidos los adjuntos enlazados que están fuera de la carpeta, no se suben.

En los Ajustes puedes dejar fuera más cosas: una regla por línea, escrita como en un
`.gitignore` (`drafts/`, `*.pdf`, `!keep.pdf`). Un interruptor aplica también el `.gitignore`
propio de la carpeta. Los archivos que quedan fuera se quedan como están en cada dispositivo:
no se sube, descarga ni elimina nada de ellos. Otro interruptor lleva
los ajustes compartidos de Obsidian (`.obsidian/app.json`, `appearance.json`,
`hotkeys.json`, `bookmarks.json`, `graph.json`, `core-plugins.json`,
`types.json`); sus archivos propios de cada dispositivo, como `workspace.json`, se quedan en local.

Los límites actuales son 128 MiB por archivo, 20.000 archivos o carpetas recorridos,
48 niveles de carpetas y un manifiesto de 8 MiB. Las carpetas vacías no se sincronizan.
Las rutas que no son seguras en las plataformas compatibles, o que solo difieren en mayúsculas o en la
normalización Unicode, detienen la sincronización en vez de renombrarse sin avisar.

## Cambios y conflictos

Los hashes SHA-256 y la última sincronización correcta deciden qué lado cambió.
Solo se transfiere el contenido cambiado. Los archivos se guardan en bloques de 2 MiB y
los bloques compartidos se reutilizan; los ETags no se tratan como hashes del contenido.

- Los cambios independientes se copian al otro dispositivo.
- Si se cambia lo mismo a la vez, se conserva el archivo local y la versión remota se guarda en
  `Sync conflicts/`. Las dos versiones se publican para los demás dispositivos.
- Los archivos de destino abiertos se aplazan; guárdalos y ciérralos, y vuelve a sincronizar.
- Los archivos de texto existentes se actualizan con la API `files.process` de Textus,
  que comprueba la versión. Los archivos binarios existentes nunca se sobrescriben: los
  adjuntos distintos conservan las dos versiones, aunque solo haya cambiado un lado. La API actual
  de plugins no tiene una operación para reemplazar un binario con condición.
- Un archivo eliminado en un dispositivo se elimina en los demás en su siguiente sincronización,
  y los demás dispositivos lo mueven a la papelera del sistema, donde puedes restaurarlo.
  El archivo eliminado se queda en el historial en la nube mientras se conserven sus
  versiones. Un cambio de nombre llega a los demás dispositivos como un cambio de nombre.
- El contenido solo sale del servidor cuando el historial lo deja ir: hasta entonces, un
  archivo eliminado lo puede leer cualquiera que pueda leer la carpeta remota (y, si
  está cifrada, sepa la contraseña de sincronización). Para quitar contenido para siempre, usa
  una carpeta remota nueva para un espacio de trabajo limpio.
- Un cambio gana a una eliminación: si un dispositivo eliminó un archivo que el otro editó
  desde la última vez que sincronizaron, el archivo editado vuelve en todas partes.
- Un dispositivo que sincroniza una carpeta por primera vez nunca elimina nada; un archivo
  que solo tiene un lado se copia al otro.
- Una sincronización que eliminaría muchos archivos de la nube (más de diez, y más
  del 30 % de los archivos sincronizados) se detiene antes de eliminar ninguno y pregunta; una iniciada
  automáticamente pregunta una vez, y **Sincronizar ahora** vuelve a preguntar. Los archivos renombrados o movidos
  no cuentan. Una carpeta en la que no se encuentra nada, aunque se sincronizaron muchos archivos
  desde ella, se considera ilegible (acceso perdido, archivos no descargados), y
  la sincronización se detiene sin eliminar nada.
- Si la papelera del sistema rechaza un archivo eliminado en otro sitio, se queda donde está,
  aparece en el panel, y la siguiente sincronización lo vuelve a intentar;
  el resto de la sincronización sigue.
- Los archivos abiertos en una pestaña no se eliminan ni se renombran; ciérralos y vuelve a sincronizar.
- Actualiza todos los dispositivos a la 0.4 antes de fiarte de las eliminaciones: un dispositivo más antiguo
  vuelve a poner un archivo eliminado en otro sitio.

Con el **Cifrado de extremo a extremo** activado, el contenido y los nombres de archivo se cifran antes de subirse; en
cualquier caso todo viaja por HTTPS.
Usa un bucket de S3 o una carpeta de WebDAV privados. La cuenta del servicio
necesita permiso de lectura, escritura y borrado en la carpeta remota dedicada
(el borrado hace falta para los objetos temporales y los bloqueos).

## Solicitudes por sincronización

Medido por las pruebas sobre HTTP con un documento pequeño, después de la primera
sincronización de la sesión (la primera también comprueba las escrituras exclusivas del servidor: 4 solicitudes
más en S3):

| Sincronización                                | S3  | WebDAV / Nutstore |
| --------------------------------------------- | --- | ----------------- |
| Nada cambiado                                 | 3   | 3                 |
| Un documento editado (un bloque de 2 MiB)     | 18  | 20                |
| Un archivo eliminado                          | 20  | 22                |

Si no cambió nada en ningún lado, una sincronización solo lee la revisión actual de la carpeta
y no toma ningún bloqueo. Cada bloque cambiado más añade 1 solicitud: un bloque
se envía una vez, sin preguntar antes si ya está ni volver a leerlo
(los bloques se nombran por su contenido; cada descarga los comprueba uno a uno). En
WebDAV, un bloque que va a una carpeta que aún no existe cuesta 2 más, la
subida rechazada y la carpeta; tomar el bloqueo cuesta una subida y un `MOVE`. Las sincronizaciones tras guardar esperan a que el guardado termine (5 s) y luego el **Retraso
de sincronización** (de ninguno a 10 minutos): 3 para una conexión nueva de Nutstore, porque Nutstore
limita las solicitudes por cuenta, y 0 para S3 y WebDAV. La respuesta de un servidor ocupado
(429, 503) pausa todas las solicitudes; cuando pide esperar, el estado muestra
«Esperando al servidor» con los segundos, hasta 60 s. Si pide más, esa
sincronización se detiene y dice que lo intentes más tarde; lo que envió se guarda para la siguiente.

## Cifrado de extremo a extremo

Con el **Cifrado de extremo a extremo** activado, el contenido de los archivos, las rutas, los hashes del contenido y las instantáneas se autentican y se cifran
con AES-256-GCM mediante Web Crypto. Cada cifrado usa un nonce nuevo de 96 bits y
una etiqueta de 128 bits. La autenticación vincula la cabecera de cifrado del repositorio y la
clave lógica del objeto, lo que impide sustituir unos por otros los bloques, los manifiestos y las instantáneas.

Una raíz de 256 bits se deriva localmente con PBKDF2-HMAC-SHA-256, 600.000 iteraciones y
una sal aleatoria de 256 bits del repositorio. HKDF-SHA-256 deriva claves separadas para AES y
para nombrar los objetos con HMAC-SHA-256. Los nombres de los bloques de contenido son HMAC con clave, no hashes
públicos del texto sin cifrar. Los bloques iguales se reutilizan dentro de un repositorio; los repositorios sin relación
usan sales y claves distintas. El descifrado autentica los bytes antes de aplicar los archivos.

En el descriptor de cifrado solo se guardan los parámetros públicos del KDF, un ID de repositorio y un mensaje fijo
de verificación cifrado. Un dispositivo fija la huella del descriptor
tras su primer desbloqueo correcto y se detiene si cambia o desaparece.
Las contraseñas incorrectas, los descriptores mal formados y el texto cifrado manipulado detienen la sincronización.

El proveedor aún puede ver el prefijo remoto elegido, el tamaño y el número de objetos,
la reutilización de bloques dentro de un repositorio, cuándo se hacen las solicitudes y el dueño y la hora anónimos del bloqueo.
El protocolo no garantiza detectar un servidor malicioso que reproduzca un estado cifrado
válido más antiguo. Las contraseñas fuertes importan porque el texto cifrado remoto permite
adivinar la contraseña sin conexión; el KDF lo hace más costoso, pero no puede volver fuerte una contraseña
débil. Esta implementación tiene pruebas automáticas de interoperabilidad y de manipulación,
pero no ha pasado una auditoría de seguridad independiente.

Los archivos locales siguen siendo legibles. La contraseña vive en el almacén local de secretos de Textus de cada usuario,
no en el repositorio remoto; esto no protege un cliente comprometido o
desbloqueado. Perder la contraseña o el descriptor de cifrado original hace imposible recuperar los datos
remotos. Una copia de seguridad completa debe incluir el descriptor y los objetos cifrados.

### Formato remoto

- `v1/head.json`: el descriptor de cifrado público (`textus-cloud-sync-e2ee/1`).
  La ruta antigua es intencionada: los clientes v0.1 rechazan este formato antes de subir archivos.
- `v1/lock.json`: exclusión compartida con clientes antiguos y nuevos; sin datos de documentos.
- `v2/head.bin`: manifiesto actual cifrado.
- `v2/history.bin`: historial cifrado (las versiones anteriores y el origen de cada archivo).
- `v2/blocks/<prefix>/<HMAC>`: bloques de contenido cifrados.
- `v2/snapshots/<revision>.bin`: manifiestos cifrados de la revisión actual y de la
  anterior.

Sin cifrado, los mismos objetos se guardan como JSON y bloques sin procesar:
`v1/head.json`, `v1/history.json`, `v1/blocks/<prefix>/<SHA-256>` y
`v1/snapshots/<revision>.json`. Una carpeta remota está cifrada o no lo está;
el plugin se niega a mezclarlas.

Los objetos cifrados contienen `TCS2`, un nonce de 12 bytes y luego el texto cifrado y su etiqueta
GCM de 16 bytes. El AAD es el UTF-8 de la cabecera JSON canónica (`format`, `repositoryId`, `kdf`,
`iterations`, `salt`, en ese orden), un salto de línea y la clave lógica del objeto v1. La
contraseña es UTF-8 sin normalizar. HKDF usa el ID del repositorio en UTF-8 como sal
y `textus-cloud-sync-e2ee/1/content` o `/names` como info. La entrada del HMAC de un bloque es la
clave lógica `v1/blocks/<hash-prefix>/<SHA-256>` en UTF-8. El texto de verificación es
`Textus encrypted workspace key check`, con la clave lógica `key-check`; su sobre
va codificado en hexadecimal en `verifier`. Estas elecciones se verifican en las pruebas frente a las API
independientes de PBKDF2, HKDF, HMAC y AES-GCM de Node.

### Pasar una carpeta a cifrado

Una carpeta remota no se convierte en su sitio. Primero asegúrate de que un espacio de trabajo local
contiene todos los archivos y copias en conflicto que necesitas; luego elige una **carpeta remota nueva
y vacía**, activa el cifrado y pon una contraseña de sincronización. Sincroniza primero ese
espacio de trabajo completo; después los demás dispositivos pueden unirse con la misma contraseña y la misma carpeta
remota.

Los datos remotos antiguos, incluidos el historial de versiones y las copias de seguridad del propio proveedor,
siguen sin cifrar. Gestiona las copias antiguas con tu proveedor después de comprobar el
espacio de trabajo cifrado. No se puede cambiar la contraseña en su sitio; usa otra
carpeta remota nueva para cambiar de contraseña.

## Sincronización interrumpida

Un bloqueo remoto hace que los dispositivos se turnen. S3 usa `If-None-Match: *`; WebDAV usa una
subida temporal seguida de `MOVE` con `Overwrite: F`, incluida la respuesta 409
de Nutstore cuando el destino ya existe. La prueba de conexión comprueba la exclusión
antes de que una sincronización pueda tocar los datos del espacio de trabajo. No hace falta ninguna API de listado ni
listar carpetas sin límite.

Los bloques cifrados y una instantánea inmutable se escriben antes de publicar
`v2/head.bin`. La base local solo avanza después de que la publicación salga bien.
Los reintentos reutilizan los bloques terminados, también después de reiniciar: los bloques que guardó
una sincronización detenida se recuerdan localmente y no se vuelven a comprobar, siempre que ningún otro
dispositivo haya publicado entretanto. Al cancelar, se detiene después de la solicitud de red
actual y suelta el bloqueo cuando puede. La API de red de Textus limita una
solicitud a 60 segundos; no permite cancelar una solicitud concreta.

Las descargas binarias nuevas reservan una ruta con un marcador único guardado en el almacenamiento local
del plugin. Tras una escritura interrumpida, la siguiente sincronización retoma ese mismo
marcador en vez de subirlo como contenido del archivo. Si otra aplicación cambia
el archivo, su contenido se conserva. Conserva los datos locales del plugin al reintentar.

Un bloqueo que este dispositivo dejó cuando Textus se cerró o se detuvo a mitad de una sincronización lo
recupera su siguiente sincronización, sin preguntar. Una sincronización en marcha renueva una nota de su
bloqueo cada 10 segundos; la siguiente sincronización recupera el bloqueo cuando la nota tiene 30
segundos, espera lo que falte si empieza antes, y lo deja en paz si
la nota se renueva entretanto (una sincronización que sigue en marcha en otra ventana). El bloqueo de otro dispositivo
nunca se toma: tras un fallo allí, **Recuperación › Quitar bloqueo obsoleto** lo quita
solo después de confirmar. Comprueba antes que todos los demás dispositivos han dejado de
sincronizar. Los bloqueos nunca caducan en el remoto, así que un dispositivo lento no puede perder su
derecho a escribir solo porque se acabó un temporizador.

Lo que una sincronización encontró en cada archivo (tamaño, hora, hash) se guarda localmente entre
arranques, así que la primera sincronización tras reiniciar solo vuelve a leer los archivos cambiados
entretanto. Si el descriptor o el manifiesto actual se
eliminan por accidente, un dispositivo que ya se había unido se detiene. Restaura una copia de seguridad remota
completa con el descriptor original. Las instantáneas cifradas van ligadas a sus propios
nombres de objeto y no se pueden copiar directamente sobre `v2/head.bin`; restaurar una sola
instantánea requiere descifrarla y volver a cifrarla para esa clave lógica. Por ahora
no hay una forma en la interfaz de restaurar una sola instantánea.
No cambies los archivos remotos mientras haya una sincronización en marcha.

## Pasar desde el plugin de la comunidad

El plugin oficial es `catvinci.cloud-sync`. El plugin de la comunidad anterior,
`ciao1019.cloud-sync`, tiene sus propios ajustes locales, secretos y estado de sincronización.
Antes de cambiar, termina o recupera con el plugin antiguo cualquier sincronización interrumpida,
y luego desactiva su sincronización automática y desactívalo. Guarda una copia de seguridad del espacio de trabajo.

Instala el plugin oficial y escribe la misma conexión de almacenamiento, exactamente la misma carpeta
remota y la misma contraseña de sincronización. El formato remoto cifrado no cambia, así que los datos remotos
existentes de v0.2/v0.3 se pueden leer sin moverlos ni volver a cifrarlos. Las credenciales
locales, las huellas fijadas del descriptor y las bases no se copian entre IDs de plugin;
la primera sincronización se une al remoto existente como un dispositivo nuevo y puede conservar
copias en conflicto si los archivos difieren. Nunca uses la sincronización automática de los dos plugins en el
mismo espacio de trabajo. Los datos v0.1 sin cifrar siguen necesitando el procedimiento de actualización aparte descrito arriba.

## Desarrollo y créditos

El código fuente, las pruebas del protocolo y las instrucciones de compilación están en
[development/cloud-sync](https://github.com/CatVinci-Studio/textus-plugins/tree/main/development/cloud-sync).
El catálogo empaqueta los archivos legibles de `plugins/catvinci.cloud-sync/`
sin compilarlos. Las versiones siguen el flujo oficial de plugins de este
repositorio, con una etiqueta como `catvinci.cloud-sync-v0.3.0`.

Desarrollado originalmente por Ciao1019; las mejoras de interfaz y configuración de la 0.3.0
las aportó ChengAo Shen. Los avisos MIT se conservan en `LICENSE`
y `THIRD_PARTY_NOTICES.md`. El diseño del almacenamiento se inspiró en
`apps/api/internal/cloudsync/` de Petrichor/Sylva; no se copia código Go ni el formato de copia de seguridad de PostgreSQL.

## Cambios

- **0.8.0** - Safer when a sync is cut short: a lock this device left (Textus closed or stopped mid-sync) is taken back by its next sync without asking; another device's lock still needs **Recover stale lock**. A sync that would delete many files from the cloud stops and asks first, and a folder where suddenly nothing is found is taken as unreadable, not emptied. A file the system Trash refuses no longer stops the whole sync: it stays in place and is tried again. The first sync after a restart reads only the files changed meanwhile, not the whole folder. Its page is in every language Textus speaks. Its page receives Textus's messages by the API's current name.
- **0.7.0** - Faster syncs with fewer requests: with nothing changed, a sync asks the service once instead of 8 to 16 times; a changed file's blocks are sent in one request each, without checking first or reading them back; on WebDAV folders are made only when one is missing. A busy service is waited for (up to a minute, shown in the status) instead of stopping the sync, and requests that got no answer are sent again. The progress counts files that are done. From Textus 1.4.4 the versions it keeps of a document show in Version History too.
- **0.6.1** - A big first sync that stops halfway (cancelled, offline, or slowed by the service) goes on where it stopped next time, instead of checking every file it already sent; on Nutstore that saves most of the requests.
- **0.6.0** - Sync settings rearranged: sync options sit at the top and apply as you pick them, with no Save button. **Sync interval**, **Sync delay**, and **Keep cloud history** are pickers. Files now go up and down several at a time: **Transfers at once** sets how many (S3 8, WebDAV 4, Nutstore 2 to start), and blocks the cloud already holds are no longer checked again. A connected service shows as a card with the account masked and **Test connection**, **Edit** and **Disconnect**; the encryption switch and password are part of the connection. **Test connection** works before saving, and names the missing permission (write, read or delete) when a check fails.
- **0.5.3** - One set of rules for every service: the automatic interval can be 1 to 1,440 minutes, and **After a save, wait** sets how long a sync waits after saving (Nutstore starts at 3 minutes, S3 and WebDAV at 0; WebDAV no longer waits 30 s).
- **0.5.2** - The plugin no longer caps its own requests: a first Nutstore sync of a folder with many files no longer stops at "The service request limit was reached".
- **0.5.1** - A sync interrupted after it wrote the history but before the new state no longer leaves versions in the history that were never synced. Trash and old versions age by the storage server's clock, so a device whose clock is wrong no longer drops what the others keep.
- **0.5.0** - Older versions stay in the cloud: right-click a file › **Cloud History…** to read and restore one, and **Plugins › Cloud History…** brings back deleted files. **Keep cloud history** sets 30, 90 or 365 days, or always, and old versions are cleaned up by themselves. End-to-end encryption is now a switch, off for new connections; connections set up before keep it. Also brings 0.4.7's changes. Needs Textus 1.4.1.
- **0.4.7** - A sync reads again only the files whose size or time changed since the last one, so syncing a big folder while you write takes far less work. Your own rules can leave out more files (written as in a `.gitignore`), the folder's `.gitignore` can count too, and Obsidian's shared settings can sync. A picture or other attachment changed on another device now replaces the one here instead of being kept twice. Needs Textus 1.4.1.
- **0.4.6** - Every language now has the whole page translated, not just a few lines. In a narrow panel the status and the connection hint keep a readable width and the buttons move to their own line.
- **0.4.5** - The sidebar keeps to the sync status and **Sync now**; **Connection settings…** there opens the plugin's own page, where the connection is set up. The sidebar page draws no title of its own, as the sidebar's other tabs. Needs Textus 1.3.13. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.4** - A Cloud Sync tab in the sidebar shows at a glance how sync stands - connected or not, the last sync, any error, which service and remote folder - with the whole connection form below; Settings shows the same page. The service is picked from a dropdown, and a long name, path or error wraps inside the page.
- **0.4.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.1** - Obsidian bases (`.base`) and canvases (`.canvas`) sync too.
- **0.4.0** - Deletions and renames reach your other devices (deleted files go to the system Trash there); automatic sync runs a few seconds after you save; the status bar shows how sync stands; syncs are paced to stay within WebDAV and Nutstore request limits.
- **0.3.1** - Nutstore: a remote folder that already exists no longer stops the sync.
- **0.3.0** - First official version: end-to-end encrypted sync through S3, WebDAV or Nutstore, with conflict copies when both sides changed a file.
