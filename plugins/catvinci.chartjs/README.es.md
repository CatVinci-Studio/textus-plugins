# Chart.js

Dibuja gráficos sencillos (de líneas, barras, sectores y otros) a partir de una configuración de Chart.js en un bloque de código.

Escribe un bloque de código con el lenguaje `chartjs` que contenga una configuración de Chart.js 4: `type`, `data` con `labels` y `datasets`, y `options` si hace falta. El gráfico aparece justo debajo, y al hacer clic en el bloque vuelves a ver el código para editarlo.

- Tipos de gráfico: `line`, `bar`, `pie`, `doughnut`, `polarArea`, `radar`, `scatter` y `bubble`.
- La configuración es JSON, pero también entiende lo que se escribe a mano: claves sin comillas, comillas simples, comas finales y comentarios. No ejecuta funciones.
- Las series sin colores propios toman los colores del tema en orden, y el gráfico se dibuja de nuevo al cambiar entre claro y oscuro.
- Escribe `height=400` después de `chartjs` en la primera línea para fijar la altura en píxeles (300 por defecto).
- Si la configuración tiene un error, una línea bajo el bloque dice qué está mal.
- Al exportar a HTML, PDF o Word, el gráfico va como imagen.

Funciona en escritorio y en iPhone y necesita Textus 1.3.2 o posterior. Pide un solo permiso, herramientas de Textus AI, para que Textus AI pueda revisar un bloque `chartjs` antes de escribirlo en un documento.

## Ejemplo

```chartjs
{
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [{ label: "Words", data: [1200, 1900, 3000] }]
  }
}
```

## Cambios

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Charts redraw to fit a narrower or wider panel, labels follow the theme's font and text size, and the error line is red again.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check a `chartjs` block before writing it (`check_chartjs`).
- **0.2.0** - Series take the theme's colors; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - While you type, the chart always shows the latest text.
- **0.1.0-0.1.1** - First versions: `chartjs` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_chartjs`: Revisa el código de un bloque ```chartjs - una configuración de Chart.js 4 en JSON: type, data con labels y datasets, options - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->
