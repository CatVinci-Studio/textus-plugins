# Modelos

Novos documentos e trechos a partir dos seus modelos, com data, hora e título preenchidos.

- Os modelos são arquivos Markdown na pasta **Templates** da pasta aberta (num cofre do Obsidian, a pasta indicada nos ajustes de modelos), então vão aonde suas notas forem. Os que uma versão anterior guardava são movidos para lá uma vez; um nome já usado ganha um número e nada é sobrescrito. `{{date:YYYY-MM-DD}}` e `{{time:HH:mm}}` aceitam um formato, como no Obsidian.
- **Novo a partir de modelo…** cria um documento na pasta aberta; **Inserir modelo…** (ou `/` no texto) o coloca no cursor.
- **Salvar como modelo…** guarda o documento aberto como modelo.
- Num modelo, `{{date}}`, `{{time}}` e `{{title}}` são preenchidos ao usar. Para começar, há um modelo de Notas de reunião.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_templates`: Lista os modelos de documento do utilizador, cada um com o nome e o Markdown, onde {{date}}, {{time}} e {{title}} são preenchidos ao usá-lo.
- `create_from_template`: Cria um novo documento na pasta aberta a partir de um modelo do utilizador, com {{date}}, {{time}} e {{title}} preenchidos. Devolve o caminho.
<!-- /ai-tools -->
