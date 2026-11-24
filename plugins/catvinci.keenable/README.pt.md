# Pesquisa Keenable

Deixe o Textus AI pesquisar na web com o [Keenable](https://keenable.ai).

- O Textus AI o usa numa conversa quando você pede o Keenable, ou quando a pesquisa na web dele não está configurada. Ele recebe 5 resultados por padrão (até 10), cada um com título, endereço, um texto curto e data.
- Funciona sem chave, pela pesquisa pública do Keenable. Para a pesquisa completa do Keenable, clique em **Definir chave de API…** na página dele nos Ajustes do Textus (ou execute **Keenable: definir chave de API…** na paleta de comandos) e cole a sua chave. Faça isso de novo deixando o campo vazio para remover a chave e voltar à pesquisa pública. A chave fica guardada no armazenamento seguro do Textus neste aparelho.
- O que você pergunta só é enviado ao Keenable quando o Textus AI usa esta ferramenta numa conversa.

O plugin pede duas permissões: ferramentas de IA, para dar ao Textus AI a ferramenta de pesquisa abaixo, e acesso à rede só para `api.keenable.ai`, para fazer as pesquisas.

## Alterações

- **0.1.3** - Set the API key with a button on its page in Settings: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.1.2** - Removing the API key really removes it, so search goes back to the public search; an unreadable answer gets a plain message.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - First version: web search for Textus AI through Keenable, with or without an API key.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `keenable_search`: Pesquisa na web com o Keenable e devolve de cada resultado o título, o URL, um texto curto e a data. Use quando o utilizador pedir o Keenable, ou quando a pesquisa web do próprio Textus AI não estiver configurada.
<!-- /ai-tools -->
