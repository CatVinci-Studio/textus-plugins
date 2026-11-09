# Zotero

Cite da sua biblioteca do Zotero enquanto escreve.

## Antes de começar

O Zotero 7 ou mais recente (o Zotero 10 também) precisa estar aberto no mesmo computador, com **Configurações › Avançado › Permitir que outros aplicativos deste computador se comuniquem com o Zotero** ligado. O plugin só conversa com o Zotero do seu computador; nada sai dele. Funciona no computador.

## Citar

- Pressione **Ctrl+Alt+R** (**⌘⌥R** no Mac), escolha **Inserir uma citação do Zotero…** no menu de contexto ou **Plugins › Inserir uma citação do Zotero…**. As obras citadas recentemente vêm primeiro, depois uma busca na sua biblioteca.
- Se houver palavras selecionadas, elas são buscadas.
- Escolha um item e a citação entra no cursor.
- Pare o ponteiro sobre uma citação, ou sobre um link para um item do Zotero, para ver autores, ano, onde foi publicado e o começo do resumo.
- **Plugins › Inserir lista de referências** acrescenta no fim uma seção **Referências** com todas as obras que o documento cita, por primeiro autor e ano. Rodando de novo, a lista é substituída, não duplicada.

## Como a citação é escrita

Escolha nos ajustes do plugin, em **Uma citação é escrita como**:

- **Uma chave do Pandoc: [@key]** (o padrão). Elas viram referências formatadas ao exportar com o Pandoc se você escolher uma bibliografia (.bib) em **Ajustes › Editor e aparência › Exportar**.
- **Autor e ano: (Autor, 2024)**.
- **Um link de nota do Obsidian: [[@key]]**, para a nota de leitura do item. Se a nota ainda não existe, o plugin oferece criá-la.
- **Um link que abre o Zotero**.

A chave de citação vem do campo Citation Key do item (ou de uma linha `Citation Key:` em Extra, como o Better BibTeX escreve).

## Notas de leitura

- **Plugins › Nova nota de leitura do Zotero…** cria `@citekey.md` (ou abre, se já existir) com título, autores, ano, resumo, DOI ou URL do item, e seus destaques e notas do Zotero.
- As notas vão para **References** na pasta aberta; mude em **Pasta das notas de leitura**.
- **Modelo de nota de leitura** pode apontar para um arquivo Markdown da pasta, como `Templates/Literature.md`, com `{{title}}`, `{{authors}}`, `{{year}}`, `{{abstract}}`, `{{citekey}}`, `{{DOI}}`, `{{URL}}`, `{{highlights}}`, `{{notes}}` e `{{date:YYYY-MM-DD}}`. Vazio, cria uma nota simples com front matter.
- Num cofre do Obsidian, a pasta e o modelo dos plugins Zotero Integration ou Citations são seguidos. Um modelo escrito para outra linguagem de modelos é trocado pela nota simples.

## Permissões

- **Rede, só localhost:23119**: para falar com a API local do Zotero neste computador.
- **Ler e editar o documento**: para inserir citações e a lista de referências, e buscar as palavras selecionadas.
- **Ler e gravar arquivos na pasta aberta**: para ler modelos e os ajustes do Zotero de um cofre, e criar notas de leitura.
- **Ferramentas para o Textus AI**: para que o Textus AI possa buscar na sua biblioteca.

## Alterações

- **0.4.1** - Seu código foi dividido em arquivos menores conforme o que cada parte faz; nada muda no uso.
- **0.4.0** - os modelos de notas de leitura são preenchidos pelo mecanismo de modelos do Textus; requer Textus 1.3.10
- **0.3.0** - notas de leitura do Zotero, com modelo e os ajustes de um cofre do Obsidian; citações como `[[@citekey]]`
- **0.2.1** - o atalho muda de Ctrl+Alt+C para Ctrl+Alt+R
- **0.2.0** - uma ferramenta para o Textus AI, `search_library`
- **0.1.3** - oferecido só para computador
- **0.1.2** - funciona com a API local do Zotero 10; a lista de referências é substituída ao refazê-la, e código não é mais lido como citação
- **0.1.0-0.1.1** - primeiras versões: citar com as obras recentes primeiro, cartões ao passar sobre uma citação, lista de referências, quatro formas de citar

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `search_library`: Pesquisa a biblioteca do Zotero do utilizador neste computador (o Zotero 7 ou posterior tem de estar aberto): a chave, o título, os autores, o ano, o tipo, onde saiu e a chave de citação de cada item, e a citação a inserir no estilo escolhido. Falha dizendo o que fazer quando o Zotero não responde.
<!-- /ai-tools -->
