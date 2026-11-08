# Numeração de títulos

Mostra números antes dos seus títulos enquanto você escreve (1, 1.1, 1.2) sem mudar o texto.

- Cada título mostra o seu número à frente enquanto você escreve: 1, 1.1, 1.2, 2… Os números são só desenhados; o texto do documento fica como está.
- A numeração começa no nível de título mais alto do documento, ou no nível abaixo quando esse nível tem só o título principal.
- Um documento que já numera os títulos à mão não recebe números a mais. É o caso quando a maioria dos títulos de primeiro nível começa com um número como `1.`, `1.2`, `一、`, `第一章` ou `(一)`.
- Obsidian: `number headings: off` nas propriedades de um documento (a configuração do plugin Number Headings do Obsidian) desliga os números nesse documento.
- **Números nas exportações** (**Ajustes › Extensões › Plugins › Numeração de títulos**, ligado por padrão): as exportações em HTML e PDF mostram os mesmos números.

O plugin lê os títulos do documento aberto (permissão para ler o editor) e dá ao Textus AI a ferramenta `number_headings` abaixo (permissão de ferramentas de IA). A ferramenta devolve o texto com os números escritos ou retirados; não muda nenhum arquivo. Funciona no computador, no iPhone e no iPad.

## Alterações

- **0.2.1** - Sem números num documento numerado à mão, nem num com `number headings: off` nas propriedades.
- **0.2.0** - O Textus AI pode escrever números nos títulos de um Markdown, ou retirá-los.
- **0.1.3** - Diz onde funciona: computador, iPhone e iPad.
- **0.1.2** - A numeração começa no nível de título mais alto do próprio documento em vez de uma configuração.
- **0.1.0-0.1.1** - Primeiras versões: números antes dos títulos ao escrever e nas exportações em HTML e PDF.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `number_headings`: Escreve números nos títulos de um Markdown - 1, 1.1, 1.2 -, contados como o editor os mostra (um título único não é numerado), substituindo os que já existam; com remove, retira-os. Devolve o texto; não escreve nada.
<!-- /ai-tools -->
