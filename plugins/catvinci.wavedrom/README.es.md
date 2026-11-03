# WaveDrom

Diagramas de tiempos digitales a partir de WaveJSON.

- Escribe un bloque de código en `wavedrom`: se dibuja debajo, y su código vuelve a verse al hacer clic en él.
- `height=400` tras el lenguaje fija la altura del dibujo.
- Al exportar a HTML, PDF o Word, el dibujo va como imagen.

## Ejemplo

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_wavedrom`: Revisa el código de un bloque ```wavedrom - WaveJSON: carriles de señal con sus cadenas wave y data, o los campos de un registro - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->
