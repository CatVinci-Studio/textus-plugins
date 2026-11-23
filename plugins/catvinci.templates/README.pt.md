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

- **0.5.5** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. Needs Textus 1.4.3.
- **0.5.4** - A taken name gets the next free one as the file is written, never a clash (Textus 1.4.3).
- **0.5.3** - The store description now opens with what the plugin does.
- **0.5.2** - Templates in a hidden or lowercase templates folder, and in its subfolders, now show up. After Insert, the caret lands right after the template.
- **0.5.1** - **New from Template…** from a file's or folder's right-click menu makes the document in that folder.
- **0.5.0** - Templates are filled in by Textus itself, the same way as daily notes; needs Textus 1.3.10.
- **0.4.1** - Templates are listed in natural order: 2 before 10.
- **0.4.0** - Templater's common `tp.date` and `tp.file` tags, and an Obsidian vault's Templates date and time formats; tags that aren't run are named in a notice.
- **0.3.0** - Templates are Markdown files in the Templates folder (a vault's own templates folder in Obsidian), moved there once from where older versions kept them; `{{date:FORMAT}}` and `{{time:FORMAT}}`.
- **0.2.0** - Textus AI can list your templates and make a document from one.
- **0.1.3** - Says where it runs: desktop and iPhone.
- **0.1.2** - New from Template refuses a name that is already taken.
- **0.1.0-0.1.1** - First versions: new documents, inserted snippets and saved templates, with `{{date}}`, `{{time}}` and `{{title}}`; store page and icon.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_templates`: Lista os modelos de documento do utilizador, cada um com o nome e o Markdown, onde {{date}}, {{time}}, {{title}} e as etiquetas tp.date e tp.file do Templater são preenchidos ao usá-lo.
- `create_from_template`: Cria um novo documento na pasta aberta a partir de um modelo do utilizador, com {{date}}, {{time}}, {{title}} e as etiquetas tp.date e tp.file do Templater preenchidos. Devolve o caminho e, em notRun, as etiquetas deixadas como estão.
<!-- /ai-tools -->
