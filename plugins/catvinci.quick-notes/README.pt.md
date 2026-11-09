# Notas rápidas

Anote algo sem sair do documento; a nota vai para o arquivo de caixa de entrada da sua pasta ou para a nota diária de hoje.

- **Ctrl+Alt+N** (**⌘⌥N** no Mac), ou **Plugins › Nova nota rápida…**, pede uma nota e a salva.
- **Nova nota rápida…** também fica no ícone da bandeja ou da barra de menus. O plugin pede ao Textus para continuar rodando em segundo plano, então ela está lá mesmo com todas as janelas fechadas.
- A aba **Notas rápidas** da barra lateral lista as notas, a mais recente no topo. Clique em **Nova** para escrever uma ali, ou edite uma nota direto na lista.
- O menu de ações de cada nota (o botão de mais opções, ou clique direito) tem **Inserir** (no cursor do documento), **Abrir** e **Excluir**. Uma nota guardada num documento abre lá, na linha dela.
- Excluiu sem querer? **Desfazer**, embaixo, traz a nota de volta por alguns segundos. Uma nota nova deixada vazia some sozinha.
- Com seis notas ou mais, aparece um campo de busca no topo.

## Onde as notas ficam

As notas ficam num documento da pasta aberta, então o Obsidian e o Cloud Sync as veem. Escolha onde em **Guardar notas em**, nos ajustes do plugin:

- **Arquivo de caixa de entrada** (padrão): `Inbox.md` na raiz da pasta, ou outro documento definido em **Arquivo de caixa de entrada**. Cada nota é adicionada ao fim como item de lista com data e hora, por exemplo `- 2026-11-08 14:05 Ligar para a Ana`.
- **Nota diária de hoje**: sob um título `## Notas rápidas` (no idioma da interface), criado se faltar. Cada nota tem a hora, por exemplo `- 14:05 Ligar para a Ana`. A pasta, o nome e o modelo da nota diária seguem os ajustes de notas diárias da pasta, como os do Obsidian; sem eles, é `Daily/YYYY-MM-DD.md`.

Edite o arquivo e a barra lateral acompanha. As notas de versões antigas vão para ele uma vez, da mais antiga à mais nova. Sem pasta aberta, as notas ficam dentro do Textus.

Funciona no desktop.

## Permissões

- Ler e gravar arquivos: para o arquivo de caixa de entrada ou a nota diária.
- Editar o documento: para inserir uma nota no cursor.
- Ferramentas para o Textus AI: para o Textus AI poder adicionar uma nota rápida.

## Alterações

- **0.5.1** - Suas barras, listas e controles agora são os do Textus, crescem com a interface e seguem cada tema; requer Textus 1.3.12.
- **0.5.0** - As datas e o modelo da nota diária são preenchidos pelo próprio Textus, do mesmo jeito que no Calendário e notas diárias e em Modelos. Requer Textus 1.3.10.
- **0.4.0** - As notas ficam num documento da pasta: `Inbox.md` ou a nota diária de hoje. As de versões antigas vão para lá uma vez.
- **0.3.1** - O Textus AI distingue notas rápidas do diário e das tarefas.
- **0.3.0** - O Textus AI pode adicionar uma nota rápida (`add_note`).
- **0.2.0** - Controles do próprio Textus e um menu de ações para cada nota.
- **0.1.0-0.1.4** - Primeiras versões: o atalho e a bandeja, a lista lateral, inserir, abrir, excluir com Desfazer, busca quando há muitas, datas numa linha própria; só desktop.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `add_note`: Adiciona uma nota rápida no topo da lista de Notas rápidas da barra lateral, para inserir depois num documento ou abrir como um. O diário de hoje é append_to_daily_note; uma tarefa, add_task.
<!-- /ai-tools -->
