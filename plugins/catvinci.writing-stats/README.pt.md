# Estatísticas de escrita

Mostra na barra lateral a contagem de palavras, o tempo de leitura e uma meta diária de escrita.

Abra a aba **Estatísticas de escrita** na barra lateral:

- **Este documento**: palavras, caracteres e tempo de leitura.
- **Seleção**: palavras e caracteres do que você selecionou.
- **Hoje**: as palavras que você acrescentou hoje, em todos os documentos, comparadas com uma meta diária, e os dias seguidos em que a cumpriu. Defina a meta nos ajustes do plugin, em **Meta diária**: 500 se você não mudar, 0 para nenhuma.
- **Pasta toda**: expanda para contar palavras, caracteres e documentos de toda a pasta aberta.

Chinês, japonês e coreano são contados por caractere; as outras escritas, por palavra. As marcas do próprio Markdown - `#`, `*`, endereços de links, front matter - não contam. O tempo de leitura considera 230 palavras ou 400 caracteres CJK por minuto.

Precisa do Textus 1.4.3 ou mais recente. Pede para ler o editor e os arquivos da pasta aberta, para contá-los, e dá ao Textus AI a ferramenta abaixo.

## Alterações

- **0.2.8** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.2.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.2.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.2.5** - Words and characters are counted as the status bar counts them (from Textus 1.4.3), and a Windows file's front matter is left out of the count.
- **0.2.4** - The store description now opens with what the plugin does.
- **0.2.3** - Today now counts only the words you type yourself, not changes from sync or AI, and stays quick in large folders. A negative daily goal is no longer shown as met.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - Updated shared path code.
- **0.2.0** - Textus AI can count the words of a document or a folder.
- **0.1.1** - Says where it runs: desktop and iPhone.
- **0.1.0** - First version: the document, the selection, today against a goal, the streak and the whole folder.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `count_words`: Conta palavras, caracteres e minutos de leitura de um documento, de todos os documentos de uma pasta ou do documento em primeiro plano; um carácter chinês, japonês ou coreano conta como palavra e as marcas de Markdown não contam.
<!-- /ai-tools -->
