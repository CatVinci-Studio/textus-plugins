# ECharts

Gráficos a partir de uma opção do ECharts: barras, linhas, pizza e mais.

- Escreva um bloco de código em `echarts`: ele é desenhado abaixo, e o código volta a aparecer ao clicar nele.
- `height=400` depois da linguagem define a altura do desenho.
- Ao exportar para HTML, PDF ou Word, o desenho vai como imagem.

## Exemplo

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```
