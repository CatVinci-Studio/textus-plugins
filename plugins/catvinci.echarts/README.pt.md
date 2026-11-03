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

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_echarts`: Verifica o código de um bloco ```echarts - uma opção do ECharts em JSON: séries com os seus tipos, e os eixos ou componentes onde são desenhadas - antes de entrar num documento, sem o desenhar. Devolve ok, ou os problemas a corrigir primeiro. Passe o código sem a cerca.
<!-- /ai-tools -->
