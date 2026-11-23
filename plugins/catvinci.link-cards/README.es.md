# Tarjetas de enlace

Muestra un enlace como una tarjeta con el título, la descripción y la imagen de su página, o reproduce ahí mismo un vídeo de Bilibili.

## Crear una tarjeta

- Escribe `/` y elige **Insertar tarjeta de enlace…**, y luego pega un enlace. O selecciona un enlace en el texto, haz clic derecho y elige **Insertar tarjeta de enlace…** para convertirlo en tarjeta.
- La tarjeta muestra el título, la descripción, la imagen y el nombre del sitio de la página. Haz clic en ella para abrir la página en tu navegador.
- Un enlace de Bilibili reproduce su vídeo en la tarjeta. Un enlace de YouTube se muestra como una tarjeta con una imagen fija del vídeo y se abre en tu navegador.
- Si la página no se puede leer (sin conexión, o no es una página web), la tarjeta guarda solo la dirección.

## Qué se guarda

La tarjeta es un bloque `card` con lo que decía la página, así que se muestra sin red y se lee como texto en cualquier app de Markdown:

````markdown
```card
url: https://textus.md
title: Textus
description: A Markdown editor with AI that writes with you.
image: https://textus.md/og.png
```
````

- **Volver a obtener**, en el menú contextual de una tarjeta, trae el título y la imagen más recientes de la página.
- Las tarjetas de Obsidian también se muestran: los bloques `cardlink` de Auto Card Link y los bloques `embed` de Link Embed se dibujan como tarjetas y se quedan tal como están escritos.

## Permisos

- **Red, cualquier dirección**: para leer las páginas de las que haces tarjetas. Solo obtiene esos enlaces.
- **Leer y editar el documento**: para leer el enlace seleccionado e insertar la tarjeta.
- **Herramientas para Textus AI**: para que Textus AI pueda crear una tarjeta para un enlace.

## Cambios

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it. Its page receives Textus's messages by the API's current name.
- **0.5.0** - Right-click a selected web address for Turn into a Link Card; the item no longer shows for other selections. Needs Textus 1.4.4.
- **0.4.3** - Pictures and site icons show again; titles with an apostrophe are kept whole; **Fetch again** moved into the card's right-click menu; YouTube links show as cards with the video's still.
- **0.4.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - Obsidian's `cardlink` (Auto Card Link) and `embed` (Link Embed) blocks are drawn as cards
- **0.3.1** - the README's example links to textus.md
- **0.3.0** - a tool for Textus AI, `fetch_link_card`
- **0.2.0** - Textus's own buttons and colors (Textus 1.3.2)
- **0.1.0-0.1.1** - first versions: link cards kept in a `card` block, video players, **Fetch again**

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `fetch_link_card`: Obtiene el título, la descripción, la imagen y el nombre del sitio de una página web, y los devuelve con un bloque ```card que muestra el enlace como tarjeta, para insertarlo donde el usuario quiera.
<!-- /ai-tools -->
