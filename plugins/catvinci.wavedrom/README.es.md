# WaveDrom

Dibuja diagramas de tiempos digitales y campos de registros a partir de WaveJSON.

## Dibujar un diagrama

- Escribe un bloque de código en `wavedrom` con WaveJSON. El diagrama se dibuja debajo, y el código vuelve a verse al hacer clic en el bloque.
- `signal` contiene las señales: cada una con `name`, una cadena `wave` (`p n h l 0 1 x z . |` y `= 2-9` para valores) y `data` para las etiquetas de los valores. Una lista que empieza por una etiqueta agrupa señales; `{}` deja un hueco.
- `reg` dibuja en cambio los campos de un registro: `{ reg: [{ bits: 8, name: "data" }] }`.
- Sirve el JSON escrito a mano: claves sin comillas, comillas simples, comas finales y comentarios `//`.
- Un error en el código se indica debajo del bloque.
- `height=400` tras el lenguaje fija la altura del dibujo.
- Con un tema oscuro usa el aspecto oscuro de WaveDrom. Al exportar a HTML, PDF o Word, el diagrama va como imagen, dibujado con los colores de la exportación.

## Ejemplo

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```

## Permisos

Solo pide **Herramientas para Textus AI**, para que Textus AI pueda revisar un bloque antes de escribirlo. WaveDrom viene con el plugin: no lee archivos y lo dibuja todo en tu equipo.

## Cambios

- **0.3.6** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.5** - Its package lists the libraries it carries, with their licenses.
- **0.3.4** - A very long diagram shrinks only as far as its labels stay readable, then scrolls sideways (a phone).
- **0.3.3** - Readable in dark mode: the lines and text take the theme's colours on the page's own background; a diagram drawn while its block was folded fits once it opens. A long diagram shrinks to the column instead of being cut off.
- **0.3.2** - Diagrams take the theme's font and line colour, grow with the document's zoom, and `height=` now resizes the diagram itself.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_wavedrom`
- **0.2.0** - drawn again when the theme changes, with the chart page of Textus 1.3.2
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - exports carry the diagram in the export's colors
- **0.1.0-0.1.1** - first versions: WaveJSON drawn with WaveDrom, dark skin, a height setting, pictures in exports

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_wavedrom`: Revisa el código de un bloque ```wavedrom - WaveJSON: carriles de señal con sus cadenas wave y data, o los campos de un registro - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->
