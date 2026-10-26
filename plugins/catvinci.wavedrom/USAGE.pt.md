# WaveDrom

Diagramas de tempo digitais a partir de WaveJSON.

- Escreva um bloco de código em `wavedrom`: ele é desenhado abaixo, e o código volta a aparecer ao clicar nele.
- `height=400` depois da linguagem define a altura do desenho.
- Ao exportar para HTML, PDF ou Word, o desenho vai como imagem.

## Exemplo

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```
