# Importar do Notion

Traz uma exportação do Notion para o Textus como arquivos Markdown comuns: páginas e subpáginas, imagens e anexos, os links entre elas e os bancos de dados.

1. No Notion, escolha **Configurações › Exportar todo o conteúdo do espaço de trabalho**, com **Markdown e CSV** e incluindo subpáginas. Coloque o .zip obtido (ou a pasta descompactada) na pasta aberta no Textus.
2. Escolha **Plugins › Importar do Notion…** (ou clique com o botão direito no .zip na barra lateral) e selecione a exportação. Uma exportação grande dividida em Part-1.zip, Part-2.zip… dentro de um zip é aberta como uma só. Um .zip com mais de 256 MB é grande demais para ser lido de uma vez: descompacte-o, com os Part zip que houver dentro, em uma única pasta dentro da pasta aberta e escolha essa pasta.
3. Tudo vai para uma pasta nova, **Importação do Notion** e a data; nada do que já existe é alterado. No fim abre-se uma página de relatório.

No que se transforma:

- **Páginas**: `Planos 1a2b….md` e sua pasta viram `Planos.md` e `Planos/`, a estrutura que o plugin Páginas mostra como árvore. Duas páginas com o mesmo nome recebem " 2".
- **Links** entre páginas, para imagens e anexos seguem os nomes novos. Links para páginas que não foram exportadas ficam como estavam e aparecem no relatório.
- **Propriedades** sob o título da página de uma linha de banco de dados vão para o front matter; em outras páginas essas linhas ficam como texto.
- **Bancos de dados**: cada linha vira um documento numa pasta, com as propriedades no front matter: datas como 2026-01-04 (formatos inglês, chinês, japonês, coreano, alemão, francês, espanhol, português e ISO), caixas de seleção como true/false, números, seleções múltiplas como listas e relações como links para as linhas. Ao lado, uma página mostra o banco como tabela, mais um quadro se houver um status e um calendário se houver datas.
- **Destaques** (callouts) viram notas (`> [!NOTE]`), mantendo o emoji. Blocos recolhíveis continuam como `<details>`.

O que não vem junto: a exportação do Notion não tem ícones nem capas de página, comentários ou as visualizações salvas dos bancos (filtros, ordenações), então eles não vêm. Propriedades de fórmula e rollup mantêm o valor que tinham, as colunas ficam uma após a outra, um banco de dados incorporado vira um link para a página dele, e menções de pessoas e datas viram texto simples.

O relatório conta o que foi importado, lista os links não encontrados e os blocos alterados, e sugere os plugins que ajudam com o que você trouxe: Páginas para subpáginas, Visualizações de banco de dados para bancos, Links bidirecionais e Prévia rápida para páginas ligadas, e assim por diante. **Plugins › Plugins que ajudam após importar do Notion…** oferece instalar um; o Textus pergunta antes. Nada é instalado sozinho.

Tudo acontece no seu computador: o plugin só lê e grava arquivos na pasta aberta e nunca usa a rede.
