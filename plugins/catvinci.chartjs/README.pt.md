# Chart.js

Desenha gráficos simples (de linhas, barras, setores e outros) a partir de uma configuração do Chart.js num bloco de código.

Escreva um bloco de código com a linguagem `chartjs` que contenha uma configuração do Chart.js 4: `type`, `data` com `labels` e `datasets`, e `options` se precisar. O gráfico aparece logo abaixo, e um clique no bloco volta a mostrar o código para editar.

- Tipos de gráfico: `line`, `bar`, `pie`, `doughnut`, `polarArea`, `radar`, `scatter` e `bubble`.
- A configuração é JSON, mas também aceita o que se escreve à mão: chaves sem aspas, aspas simples, vírgulas no fim e comentários. Funções não são executadas.
- As séries sem cores próprias recebem as cores do tema por ordem, e o gráfico é desenhado de novo ao alternar entre claro e escuro.
- Escreva `height=400` depois de `chartjs` na primeira linha para definir a altura em píxeis (300 por omissão).
- Se a configuração tiver um erro, uma linha sob o bloco diz o que está mal.
- Ao exportar para HTML, PDF ou Word, o gráfico vai como imagem.

Precisa do Textus 1.3.2 ou mais recente. Pede uma única permissão, ferramentas do Textus AI, para que o Textus AI possa verificar um bloco `chartjs` antes de o escrever num documento.

## Exemplo

```chartjs
{
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [{ label: "Words", data: [1200, 1900, 3000] }]
  }
}
```

## Alterações

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
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_chartjs`: Verifica o código de um bloco ```chartjs - uma configuração do Chart.js 4 em JSON: type, data com labels e datasets, options - antes de entrar num documento, sem o desenhar. Devolve ok, ou os problemas a corrigir primeiro. Passe o código sem a cerca.
<!-- /ai-tools -->
