# Mapa mental

Dibuja un esquema en Markdown (títulos y listas) como mapa mental.

- Escribe un bloque de código en `markmap`: se dibuja debajo, y su código vuelve a verse al hacer clic en él.
- `height=400` tras el lenguaje fija la altura del dibujo.
- Al exportar a HTML, PDF o Word, el dibujo va como imagen.

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

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_markmap`: Revisa el código de un bloque ```markmap - un esquema en Markdown cuyos encabezados y elementos de lista son las ramas del mapa mental - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->
