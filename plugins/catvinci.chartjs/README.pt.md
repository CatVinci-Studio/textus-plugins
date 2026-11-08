# Chart.js

Desenha gráficos simples (de linhas, barras, setores e outros) a partir de uma configuração do Chart.js num bloco de código.

Escreva um bloco de código com a linguagem `chartjs` que contenha uma configuração do Chart.js 4: `type`, `data` com `labels` e `datasets`, e `options` se precisar. O gráfico aparece logo abaixo, e um clique no bloco volta a mostrar o código para editar.

- Tipos de gráfico: `line`, `bar`, `pie`, `doughnut`, `polarArea`, `radar`, `scatter` e `bubble`.
- A configuração é JSON, mas também aceita o que se escreve à mão: chaves sem aspas, aspas simples, vírgulas no fim e comentários. Funções não são executadas.
- As séries sem cores próprias recebem as cores do tema por ordem, e o gráfico é desenhado de novo ao alternar entre claro e escuro.
- Escreva `height=400` depois de `chartjs` na primeira linha para definir a altura em píxeis (300 por omissão).
- Se a configuração tiver um erro, uma linha sob o bloco diz o que está mal.
- Ao exportar para HTML, PDF ou Word, o gráfico vai como imagem.

Funciona no computador e no iPhone e precisa do Textus 1.3.2 ou mais recente. Pede uma única permissão, ferramentas do Textus AI, para que o Textus AI possa verificar um bloco `chartjs` antes de o escrever num documento.

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

- **0.3.0** - O Textus AI pode verificar um bloco `chartjs` antes de o escrever (`check_chartjs`).
- **0.2.0** - As séries recebem as cores do tema; precisa do Textus 1.3.2.
- **0.1.3** - Usa as cores do documento com os novos nomes do Textus.
- **0.1.2** - Enquanto escreve, o gráfico mostra sempre o texto mais recente.
- **0.1.0-0.1.1** - Primeiras versões: blocos `chartjs` desenhados sob o código, `height=`, imagens ao exportar; página na loja e ícone.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_chartjs`: Verifica o código de um bloco ```chartjs - uma configuração do Chart.js 4 em JSON: type, data com labels e datasets, options - antes de entrar num documento, sem o desenhar. Devolve ok, ou os problemas a corrigir primeiro. Passe o código sem a cerca.
<!-- /ai-tools -->
