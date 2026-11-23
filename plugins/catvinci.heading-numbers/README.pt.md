# Numeração de títulos

Mostra números antes dos seus títulos enquanto você escreve (1, 1.1, 1.2) sem mudar o texto.

- Cada título mostra o seu número à frente enquanto você escreve: 1, 1.1, 1.2, 2… Os números são só desenhados; o texto do documento fica como está.
- A numeração começa no nível de título mais alto do documento, ou no nível abaixo quando esse nível tem só o título principal.
- Um documento que já numera os títulos à mão não recebe números a mais. É o caso quando a maioria dos títulos de primeiro nível começa com um número como `1.`, `1.2`, `一、`, `第一章` ou `(一)`.
- Obsidian: `number headings: off` nas propriedades de um documento (a configuração do plugin Number Headings do Obsidian) desliga os números nesse documento.
- **Números nas exportações** (**Ajustes › Extensões › Plugins › Numeração de títulos**, ligado por padrão): as exportações em HTML e PDF mostram os mesmos números.

O plugin lê os títulos do documento aberto (permissão para ler o editor) e dá ao Textus AI a ferramenta `number_headings` abaixo (permissão de ferramentas de IA). A ferramenta devolve o texto com os números escritos ou retirados; não muda nenhum arquivo. Funciona no computador, no iPhone e no iPad.

## Alterações

- **0.2.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.2.4** - With two documents open side by side, both show their heading numbers, not only the one you are typing in.
- **0.2.3** - Front matter and code blocks no longer get numbers by mistake, and exports number only top-level headings, like the editor.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - No numbers on a document numbered by hand, or one whose front matter says `number headings: off`.
- **0.2.0** - Textus AI can write heading numbers into Markdown, or take them out.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - Numbering starts at the document's own top heading level instead of a setting.
- **0.1.0-0.1.1** - First versions: numbers before headings while writing, and in HTML and PDF exports.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `number_headings`: Escreve números nos títulos de um Markdown - 1, 1.1, 1.2 -, contados como o editor os mostra (um título único não é numerado), substituindo os que já existam; com remove, retira-os. Devolve o texto; não escreve nada.
<!-- /ai-tools -->
