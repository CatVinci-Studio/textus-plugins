# Mapa mental

Dibuja un esquema en Markdown, con títulos y listas, como mapa mental dentro de un bloque de código.

Escribe un bloque de código con el lenguaje `markmap` y pon dentro un esquema: los títulos (`#`, `##`) y los elementos de lista son las ramas del mapa. El mapa se dibuja debajo del bloque; haz clic en el bloque para ver y editar de nuevo su código.

- Arrastra el mapa para moverlo y acércalo o aléjalo con el zoom. Haz clic en el punto de una rama para plegarla o desplegarla.
- Escribe `height=400` después del lenguaje para fijar la altura del mapa en píxeles (360 por defecto).
- Las ramas toman los colores de tu tema, y el mapa se vuelve a dibujar al cambiar de tema.
- Al exportar a HTML, PDF o Word, el mapa va como imagen, aunque esté fuera de la vista.

El plugin usa [markmap](https://markmap.js.org). Pide un solo permiso, para dar a Textus AI la herramienta `check_markmap` que aparece abajo: revisa un bloque antes de que Textus AI lo escriba en un documento. Funciona en el escritorio y en iPhone y iPad.

## Ejemplo

```markmap
# Project
## Goals
- Ship 1.3
- Write the guide
## People
- Writers
- Reviewers
```

## Cambios

- **0.3.2** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.3.1** - Un mapa mental fuera de la vista se exporta como imagen y no como código.
- **0.3.0** - Textus AI puede revisar un bloque `markmap` antes de escribirlo.
- **0.2.0** - Los colores de las ramas salen de los tonos del tema. Requiere Textus 1.3.2.
- **0.1.3** - Usa el color del texto del documento y el tamaño de las notas al pie del tema con sus nombres de Textus 1.3.
- **0.1.0-0.1.2** - Primeras versiones: bloques `markmap` dibujados en el documento, `height=` y exportación como imagen con los colores de la exportación.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_markmap`: Revisa el código de un bloque ```markmap - un esquema en Markdown cuyos encabezados y elementos de lista son las ramas del mapa mental - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->
