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

- **0.2.3** - A ferramenta para o Textus AI diz o que faz: chinês e japonês, não coreano.
- **0.2.2** - deixa como estão os ids de bloco, campos do Dataview, destaques e campos do Tasks do Obsidian
- **0.2.1** - deixa como estão #tags, lembretes e comentários %%; ao salvar, só mudam os blocos de texto
- **0.2.0** - uma ferramenta para o Textus AI, `fix_cjk_spacing`
- **0.1.3** - funciona no computador e no iOS
- **0.1.2** - deixa como estão links, links wiki, notas de rodapé, tags e front matter
- **0.1.0-0.1.1** - primeiras versões: o comando no menu de contexto e no menu Plugins, e o espaçamento ao salvar

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `fix_cjk_spacing`: Põe um espaço entre caracteres chineses ou japoneses e letras latinas ou algarismos num Markdown, sem mexer no código nem nos links, como o comando do plugin. Devolve o texto espaçado; não escreve nada.
<!-- /ai-tools -->
