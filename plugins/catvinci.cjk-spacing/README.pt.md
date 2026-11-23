# Espaçamento CJK

Coloca um espaço entre texto chinês ou japonês e letras latinas ou números.

## Espaçar um documento

- Escolha **Plugins › Adicionar espaços entre CJK e latim**, ou o mesmo item do menu de contexto. 用Textus写作 vira 用 Textus 写作. O documento inteiro muda num só passo de desfazer, e um aviso diz quantos blocos mudaram.
- Ative **Também ao salvar** nos ajustes do plugin para espaçar cada documento ao salvá-lo. Só mudam parágrafos, títulos, listas e o resto do texto corrido.
- O coreano fica como está: ele já separa as palavras com espaços.

## O que fica como está

- Código, fórmulas, links e links wiki, notas de rodapé, #tags, lembretes (@…), comentários %%, HTML e front matter, também ao salvar.
- O que o Obsidian escreve: ids de bloco (^1a2b3c), campos do Dataview (key:: value), ==destaques== e os campos do Obsidian Tasks (📅 2026-11-07).

## Permissões

- **Ler e editar o documento**: para espaçar o documento aberto.
- **Gravar arquivos**: para espaçar um documento ao salvar, com **Também ao salvar** ativado.
- **Ferramentas para o Textus AI**: para que o Textus AI possa espaçar um texto para você.

## Alterações

- **0.3.0** - From Textus 1.4.4, a paragraph missing a space between CJK and Latin text is underlined; its card adds the spaces. Turn it off in the plugin's settings.
- **0.2.4** - A code block inside a longer fence (```` holding ```) is left alone.
- **0.2.3** - Its Textus AI tool says what it does: Chinese and Japanese, not Korean.
- **0.2.2** - leaves Obsidian's block ids, Dataview fields, highlights and Tasks fields as written
- **0.2.1** - leaves #tags, reminders and %% comments alone; on save only prose blocks change
- **0.2.0** - a tool for Textus AI, `fix_cjk_spacing`
- **0.1.3** - runs on the desktop and on iOS
- **0.1.2** - leaves links, wiki links, footnotes, tags and front matter alone
- **0.1.0-0.1.1** - first versions: the command in the right-click and Plugins menus, and spacing on save

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `fix_cjk_spacing`: Põe um espaço entre caracteres chineses ou japoneses e letras latinas ou algarismos num Markdown, sem mexer no código nem nos links, como o comando do plugin. Devolve o texto espaçado; não escreve nada.
<!-- /ai-tools -->
