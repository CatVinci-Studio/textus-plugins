# ECharts

Desenha um gráfico no seu documento a partir de uma opção do ECharts escrita num bloco de código.

Escreva um bloco de código com a linguagem `echarts` e coloque nele uma opção do ECharts. O gráfico é desenhado abaixo do bloco; clique no bloco para ver e editar o código de novo.

- A opção é JSON e pode ser escrita de forma livre: chaves sem aspas, aspas simples, vírgulas no fim e comentários funcionam. Funções (uma função `formatter`, por exemplo) não, porque nada no bloco é executado.
- Barras, linhas, pizza, dispersão, radar, medidores, funis, árvores, treemaps, sunbursts, diagramas de Sankey, mapas de calor, candlesticks e as outras séries do ECharts são desenhados. Séries de mapa não: precisam de dados de mapa que um bloco não consegue carregar.
- Escreva `height=400` depois da linguagem para definir a altura do gráfico em pixels (320 por padrão).
- O gráfico usa as cores do seu tema e é desenhado de novo quando você troca de tema.
- Se a opção não puder ser desenhada, o bloco diz o que deu errado.
- Ao exportar para HTML, PDF ou Word, o gráfico vai como imagem.

O plugin pede uma única permissão, para dar ao Textus AI a ferramenta `check_echarts` listada abaixo: ela verifica um bloco antes de o Textus AI escrevê-lo num documento. Funciona no computador, no iPhone e no iPad.

## Exemplo

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

## Alterações

- **0.3.2** - Os gráficos são redesenhados quando a largura do painel muda, e o texto e a altura padrão seguem o zoom e a fonte do app.
- **0.3.1** - A descrição já não cita mapas, que um bloco não consegue carregar.
- **0.3.0** - O Textus AI pode verificar um bloco `echarts` antes de escrevê-lo.
- **0.2.0** - As cores das séries vêm dos tons do tema. Requer Textus 1.3.2.
- **0.1.3** - Usa a cor do texto do documento e o tamanho das notas de rodapé do tema pelos nomes do Textus 1.3.
- **0.1.0-0.1.2** - Primeiras versões: blocos `echarts` desenhados no documento, `height=` e exportação como imagem.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_echarts`: Verifica o código de um bloco ```echarts - uma opção do ECharts em JSON: séries com os seus tipos, e os eixos ou componentes onde são desenhadas - antes de entrar num documento, sem o desenhar. Devolve ok, ou os problemas a corrigir primeiro. Passe o código sem a cerca.
<!-- /ai-tools -->
