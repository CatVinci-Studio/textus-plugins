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

Solo pide **Herramientas para Textus AI**, para que Textus AI pueda revisar un bloque antes de escribirlo. WaveDrom viene con el plugin: no lee archivos y lo dibuja todo en tu equipo, en escritorio y en iOS.

## Cambios

- **0.3.2** - Los diagramas usan la fuente y el color de línea del tema, crecen con el zoom del documento, y `height=` ahora cambia el tamaño del propio diagrama.
- **0.3.1** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.3.0** - una herramienta para Textus AI, `check_wavedrom`
- **0.2.0** - se vuelve a dibujar al cambiar de tema, con la página de gráficos de Textus 1.3.2
- **0.1.3** - el texto con los colores del tema en Textus 1.3
- **0.1.2** - las exportaciones llevan el diagrama con los colores de la exportación
- **0.1.0-0.1.1** - primeras versiones: WaveJSON dibujado con WaveDrom, aspecto oscuro, altura ajustable, imágenes al exportar

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_wavedrom`: Revisa el código de un bloque ```wavedrom - WaveJSON: carriles de señal con sus cadenas wave y data, o los campos de un registro - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->
