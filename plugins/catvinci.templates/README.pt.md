# Modelos

Cria documentos novos e insere trechos a partir dos seus próprios modelos, com a data, a hora e o título já preenchidos.

Os modelos são ficheiros Markdown na pasta **Templates** da pasta aberta (num cofre do Obsidian, a pasta que os ajustes de Modelos dele indicam), por isso vão para onde forem as suas notas. Se ainda não houver nenhum, é criado um modelo **Notas de reunião** para começar.

- **Plugins › Novo a partir de modelo…** cria um documento na raiz da pasta aberta a partir de um dos seus modelos. Pede o nome e recusa um que já exista.
- **Plugins › Inserir modelo…**, ou **Inserir modelo…** no menu de barra, põe um modelo no cursor.
- **Plugins › Salvar como modelo…** guarda o documento aberto como modelo. Um nome já usado recebe um número; nada é substituído.

## O que é preenchido

- `{{date}}`, `{{time}}` e `{{title}}` são preenchidos ao usar o modelo; `{{date:YYYY-MM-DD}}` e `{{time:HH:mm}}` aceitam um formato, como no Obsidian.
- Num cofre do Obsidian, `{{date}}` e `{{time}}` usam os formatos de data e hora dos ajustes de Modelos dele.
- As etiquetas comuns do Templater também são preenchidas: `<% tp.date.now("YYYY-MM-DD") %>` (com um desvio em dias, como `-1`, ou `"P1W"`), `tp.date.today`, `tomorrow` e `yesterday`, `<% tp.file.title %>`, `tp.file.creation_date()` e `tp.file.folder()`; `<% tp.file.cursor() %>` põe o cursor aí.
- Scripts e outras etiquetas nunca são executados: ficam como estão, e um aviso indica-os.

Funciona no computador e no iPhone e precisa do Textus 1.3.10 ou mais recente. Pede para ler e escrever ficheiros da pasta aberta, para os modelos e os documentos novos; para ler e editar o documento aberto, para inserir um modelo ou guardá-lo como modelo; e dá ao Textus AI as duas ferramentas abaixo.

## Alterações

- **0.5.3** - A descrição da loja agora começa pelo que o plugin faz.
- **0.5.2** - Agora aparecem os modelos de uma pasta de modelos oculta ou em minúsculas, e de suas subpastas. Depois de inserir, o cursor fica logo após o modelo.
- **0.5.1** - **Novo a partir de modelo…** no menu de contexto de um arquivo ou pasta cria o documento nessa pasta.
- **0.5.0** - Os modelos são preenchidos pelo próprio Textus, tal como as notas diárias; precisa do Textus 1.3.10.
- **0.4.1** - Os modelos aparecem por ordem natural: 2 antes de 10.
- **0.4.0** - As etiquetas comuns `tp.date` e `tp.file` do Templater e os formatos de data e hora dos Modelos de um cofre do Obsidian; um aviso indica as etiquetas não executadas.
- **0.3.0** - Os modelos passam a ser ficheiros Markdown na pasta Templates (no Obsidian, a pasta de modelos do cofre), movidos para lá uma vez a partir de onde as versões antigas os guardavam; `{{date:FORMATO}}` e `{{time:FORMATO}}`.
- **0.2.0** - O Textus AI pode listar os seus modelos e criar um documento a partir de um.
- **0.1.3** - Indica onde funciona: computador e iPhone.
- **0.1.2** - Novo a partir de modelo recusa um nome que já existe.
- **0.1.0-0.1.1** - Primeiras versões: documentos novos, trechos inseridos e modelos guardados, com `{{date}}`, `{{time}}` e `{{title}}`; página na loja e ícone.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_templates`: Lista os modelos de documento do utilizador, cada um com o nome e o Markdown, onde {{date}}, {{time}}, {{title}} e as etiquetas tp.date e tp.file do Templater são preenchidos ao usá-lo.
- `create_from_template`: Cria um novo documento na pasta aberta a partir de um modelo do utilizador, com {{date}}, {{time}}, {{title}} e as etiquetas tp.date e tp.file do Templater preenchidos. Devolve o caminho e, em notRun, as etiquetas deixadas como estão.
<!-- /ai-tools -->
