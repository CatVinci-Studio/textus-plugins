# Cartões de link

Mostra um link como um cartão com o título, a descrição e a imagem da página, ou toca um vídeo do Bilibili ali mesmo.

## Criar um cartão

- Digite `/` e escolha **Inserir cartão de link…**, depois cole um link. Ou selecione um link no texto, clique nele com o botão direito e escolha **Inserir cartão de link…** para transformá-lo em cartão.
- O cartão mostra o título, a descrição, a imagem e o nome do site da página. Clique nele para abrir a página no navegador.
- Um link do Bilibili toca o vídeo no próprio cartão. Um link do YouTube aparece como cartão com a imagem do vídeo e abre no navegador.
- Se a página não puder ser lida (sem internet, ou se não for uma página web), o cartão fica só com o endereço.

## O que é salvo

O cartão é um bloco `card` com o que a página dizia, então aparece sem rede e se lê como texto em qualquer app de Markdown:

````markdown
```card
url: https://textus.md
title: Textus
description: A Markdown editor with AI that writes with you.
image: https://textus.md/og.png
```
````

- **Obter de novo**, no menu do botão direito de um cartão, traz o título e a imagem mais recentes da página.
- Os cartões do Obsidian também aparecem: os blocos `cardlink` do Auto Card Link e os blocos `embed` do Link Embed são desenhados como cartões e ficam como foram escritos.

## Permissões

- **Rede, qualquer endereço**: para ler as páginas de que você faz cartões. Só busca esses links.
- **Ler e editar o documento**: para ler o link selecionado e inserir o cartão.
- **Ferramentas para o Textus AI**: para que o Textus AI possa fazer um cartão para um link.

## Alterações

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it. Its page receives Textus's messages by the API's current name.
- **0.5.0** - Right-click a selected web address for Turn into a Link Card; the item no longer shows for other selections. Needs Textus 1.4.4.
- **0.4.3** - Pictures and site icons show again; titles with an apostrophe are kept whole; **Fetch again** moved into the card's right-click menu; YouTube links show as cards with the video's still.
- **0.4.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - Obsidian's `cardlink` (Auto Card Link) and `embed` (Link Embed) blocks are drawn as cards
- **0.3.1** - the README's example links to textus.md
- **0.3.0** - a tool for Textus AI, `fetch_link_card`
- **0.2.0** - Textus's own buttons and colors (Textus 1.3.2)
- **0.1.0-0.1.1** - first versions: link cards kept in a `card` block, video players, **Fetch again**

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `fetch_link_card`: Obtém o título, a descrição, a imagem e o nome do site de uma página web e os retorna com um bloco ```card que mostra o link como cartão - para inserir onde o usuário quiser.
<!-- /ai-tools -->
