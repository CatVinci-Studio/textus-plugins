# Visão de grafo

Desenha suas notas e os links entre elas como um grafo, da pasta inteira ou em volta do documento aberto.

- **Ctrl+Alt+G** (**⌘⌥G** no Mac), ou **Plugins › Abrir a visão de grafo**, mostra a pasta inteira numa aba. **Ajustar** enquadra tudo.
- A aba **Grafo** da barra lateral mostra as notas em volta do documento aberto. O botão no topo do painel Grafo da barra lateral abre a pasta inteira.
- Contam os [[links wiki]] e os links para outros documentos; duas notas que se ligam uma à outra dividem uma só linha. Um [[link]] para uma nota ainda não escrita aparece como uma nota própria.
- Clique numa nota para abri-la. Arraste uma nota para posicioná-la, arraste o fundo para se mover e use a roda ou o gesto de pinça para o zoom. Passe o ponteiro sobre uma nota para destacar os links dela.
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

- **0.5.5** - Links Markdown padrão para notas ainda não escritas ficam onde o Textus as cria e se juntam aos [[links]] para a mesma nota. Ctrl/Cmd-clique abre a nota ao lado da que está na frente. Os rótulos seguem o tamanho do texto da interface, e as cores das pastas seguem o tema. O grafo da barra lateral não tem mais ajustes próprios.
- **0.5.4** - Um movimento de pinça no trackpad faz zoom suavemente, acompanhando o gesto; com o Textus 1.3.13, no Mac a pinça amplia o grafo, não o documento por trás. Textos de ajuda e de estado vazio mais curtos. O painel lateral e a página seguem o layout do Textus 1.3.13.
- **0.5.3** - Suas barras, listas e controles agora são os do Textus, crescem com a interface e seguem cada tema; requer Textus 1.3.12.
- **0.5.2** - Os grupos de cor do Obsidian vêm do cofre mais próximo, mesmo acima da pasta aberta. Requer Textus 1.3.10.
- **0.5.1** - Num cofre do Obsidian, os grupos de cor de `.obsidian/graph.json` também colorem as notas.
- **0.5.0** - Os [[links]] são ligados às notas do mesmo jeito que ao clicar neles no Textus.
- **0.4.0** - O Textus AI pode ver as notas em volta de um documento (`list_neighbours`).
- **0.3.0** - Controles e menus do próprio Textus; cores do tema.
- **0.2.0-0.2.1** - Painel de ajustes com filtros, pesquisa e grupos de cor; tags como nós; setas para a direção dos links; profundidade do grafo lateral.
- **0.1.0-0.1.1** - Primeiras versões: a pasta inteira numa aba e as notas em volta do documento aberto na barra lateral, coloridas por pasta, fluidas mesmo com milhares de notas.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_neighbours`: A vizinhança de um documento no grafo de notas - o que está em primeiro plano se não for dado caminho: as notas a poucos links, em qualquer sentido, cada uma com a quantos links está, e os links entre elas. Um [[link]] para uma nota que não existe aparece como kind missing.
<!-- /ai-tools -->
