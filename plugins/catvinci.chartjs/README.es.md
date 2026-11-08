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

- **0.3.0** - Textus AI puede revisar un bloque `chartjs` antes de escribirlo (`check_chartjs`).
- **0.2.0** - Las series toman los colores del tema; necesita Textus 1.3.2.
- **0.1.3** - Usa los colores del documento con sus nuevos nombres en Textus.
- **0.1.2** - Mientras escribes, el gráfico siempre muestra el texto más reciente.
- **0.1.0-0.1.1** - Primeras versiones: bloques `chartjs` dibujados bajo su código, `height=`, imágenes al exportar; página en la tienda e icono.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_chartjs`: Revisa el código de un bloque ```chartjs - una configuración de Chart.js 4 en JSON: type, data con labels y datasets, options - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->
