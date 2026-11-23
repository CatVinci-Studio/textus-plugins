# Visão de grafo

Desenha suas notas e os links entre elas como um grafo, da pasta inteira ou em volta do documento aberto.

- **Ctrl+Alt+G** (**⌘⌥G** no Mac), ou **Plugins › Abrir a visão de grafo**, mostra a pasta inteira numa aba. **Ajustar** enquadra tudo.
- A aba **Grafo** da barra lateral mostra as notas em volta do documento aberto. O botão no topo do painel Grafo da barra lateral abre a pasta inteira.
- Contam os [[links wiki]] e os links para outros documentos; duas notas que se ligam uma à outra dividem uma só linha. Um [[link]] para uma nota ainda não escrita aparece como uma nota própria.
- Clique numa nota para abri-la. Arraste uma nota para posicioná-la, arraste o fundo para se mover e use a roda ou o gesto de pinça para o zoom. Passe o ponteiro sobre uma nota para destacar os links dela. No toque, o primeiro toque numa nota destaca os links dela e o segundo a abre.
- O grafo se ajusta sozinho: os nomes aparecem ao aproximar, setas mostram a direção dos links quando são poucos, e uma nota com mais links fica maior. Sem grupos de cor, cada nota fica com a cor da sua pasta.
- Quando os documentos da pasta mudam, o grafo é redesenhado.

## Ajustes

O botão de controles deslizantes no topo do grafo completo abre os ajustes dele; o da barra lateral não tem.

- **Filtros**: uma pesquisa (`path:ideas`, `file:draft`, `tag:#todo`, com `-` na frente para excluir); **Tags** mostra as #tags como nós; **Somente arquivos existentes** esconde notas ainda não escritas; **Órfãs** (grafo completo) mostra notas sem links.
- **Grupos**: colorem as notas que uma pesquisa encontra. **Novo grupo** adiciona um; **Restaurar padrões** desfaz suas mudanças.

Num cofre do Obsidian, os grupos de cor salvos no `graph.json` do Obsidian também colorem as notas, depois dos seus.

## Permissões

- Ler arquivos e o documento: para encontrar as notas e os links da pasta, e o `graph.json` do Obsidian.
- Ferramentas para o Textus AI: para o Textus AI ver as notas em volta de um documento.

## Alterações

- **0.5.10** - By touch, a first tap on a note lights it and its links and a second opens it; notes are easier to hit with a finger, and a second finger zooms instead of also moving the graph. Its settings open in Textus's own popover. Its page receives Textus's messages by the API's current name.
- **0.5.9** - Esc while dragging a note or the view puts it back, and a touch the system cancels no longer leaves a drag stuck.
- **0.5.8** - The graph in the sidebar spreads out to fit its panel, instead of starting as a small clump with labels on top of each other. Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.5.7** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.6** - The counts and buttons at the top of the graph tab stay in view: scrolling or pinching over the graph no longer pushes them up under the tab. Labels no longer pile on top of each other: the most linked notes keep theirs and the rest show as you zoom in. A big folder opens already laid out instead of unfolding, and pictures and other attachments a note links to stay out of the graph unless you turn on Attachments in its settings. Switching documents or saving no longer shakes the whole graph loose to settle again.
- **0.5.5** - Standard Markdown links to notes not written yet are placed as Textus places them, and merge with [[links]] to the same note. Fit spreads a small graph over the whole pane, so names no longer sit on each other. Ctrl/Cmd-click opens a note beside the one in front. Labels follow the interface text size, and folder colours follow the theme. The sidebar graph has no settings of its own any more.
- **0.5.4** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the graph, not the document behind it. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.5.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.2** - Obsidian's colour groups come from the nearest vault, even one above the open folder. Needs Textus 1.3.10.
- **0.5.1** - In an Obsidian vault, the colour groups in `.obsidian/graph.json` colour the notes too.
- **0.5.0** - [[Links]] are matched to notes the same way Textus matches them when you click one.
- **0.4.0** - Textus AI can see the notes around a document (`list_neighbours`).
- **0.3.0** - Textus's own controls and menus; colours from the theme.
- **0.2.0-0.2.1** - A settings panel with filters, search and colour groups; tags as nodes; arrows for link direction; the sidebar graph's depth.
- **0.1.0-0.1.1** - First versions: the whole folder in a tab and the notes around the open document in the sidebar, coloured by folder, smooth with thousands of notes.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_neighbours`: A vizinhança de um documento no grafo de notas - o que está em primeiro plano se não for dado caminho: as notas a poucos links, em qualquer sentido, cada uma com a quantos links está, e os links entre elas. Um [[link]] para uma nota que não existe aparece como kind missing.
<!-- /ai-tools -->
