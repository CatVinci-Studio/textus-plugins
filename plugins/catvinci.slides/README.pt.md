# Marp

Apresenta um documento como slides, escritos do jeito do [Marp](https://marp.app).

## Criar slides

- Um slide novo começa a cada `---`.
- **Plugins › Apresentar como slides** mostra a apresentação numa aba ao lado do documento, acompanhando o que você escreve. ← → (ou ↑ ↓, Page Up e Page Down) e Espaço passam de um slide a outro; **Tela cheia** (ou F) apresenta. Durante a apresentação, um toque ou clique no terço esquerdo do slide volta e em qualquer outro lugar avança, assim como deslizar o dedo; toque no slide ou mova o ponteiro para ver **Sair**, ou pressione Esc.
- As diretivas do Marp escolhem o tema e o layout, por exemplo no topo:

```markdown
---
theme: gaia
paginate: true
---
```

- As imagens aparecem na apresentação, inclusive o `![[photo.png]]` do Obsidian; `![[photo.png|300]]` define a largura (`300x200` as duas medidas).

## Salvar uma apresentação

**Plugins › Exportar slides como HTML** (ou **Salvar HTML** na apresentação) salva `name.slides.html` ao lado do documento: um único arquivo que se apresenta sozinho em qualquer navegador, com as mesmas teclas. As imagens são ligadas a partir da pasta do documento, então mantenha o arquivo ao lado delas. O documento precisa ser salvo antes.

Feito com o [Marp Core](https://github.com/marp-team/marp-core) (MIT), que traz os temas dele (default, gaia, uncover), fórmulas e destaque de código - e faz este plugin ter cerca de 4 MB.

## Permissões

- **Ler o documento**: para desenhar os slides enquanto você escreve.
- **Ler e gravar arquivos**: para encontrar as imagens que ele mostra e salvar a apresentação em HTML ao lado do documento.
- **Ferramentas para o Textus AI**: para que o Textus AI possa salvar a apresentação para você.

## Alterações

- **0.3.13** - The deck no longer stays blank when no document is in front - in Source Mode or Source and Preview, or presented from the plugin's page: it shows the document open in another tab, as last saved, or says to click one. Slides scale to their frame on a Mac, iPhone and iPad, in the tab and in a saved deck opened in Safari.
- **0.3.12** - Presenting on a phone or tablet: tap or swipe to move between slides, and Exit to stop - no keyboard needed. A click moves on in full screen too, as in a saved deck. In a narrow tab, Save HTML goes into the ⋯ menu instead of pushing Full Screen onto a second row. Its page is in every language Textus speaks.
- **0.3.11** - Its package lists the libraries it carries, with their licenses.
- **0.3.10** - Code kept for Textus versions it no longer runs on is gone. From Textus 1.4.4 the deck is also in File › Export, as Slides (HTML).
- **0.3.9** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.3.8** - Present as Slides draws the deck on a phone, where its tab comes to the front alone.
- **0.3.7** - Formulas use KaTeX's own fonts from Textus 1.4.2 on, in the tab and in a saved HTML file; earlier versions keep the system's fonts.
- **0.3.6** - A deck needs nothing from the web: emoji show as text instead of pictures from a CDN, formulas use the system's fonts, and the Gaia theme no longer loads a web font, in the tab and in a saved HTML file.
- **0.3.5** - Writing a deck with many pictures is lighter: the slides are made again only when the text changed, and pictures it no longer shows are let go.
- **0.3.4** - Full Screen works in the tab (presenting in place where the window can't go full screen); the deck renders only while its tab is open; shortcuts leave Cmd/Ctrl/Alt keys alone.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - pictures in the deck, including Obsidian's `![[picture]]` embeds with a width
- **0.3.0** - a tool for Textus AI, `export_slides`
- **0.2.0** - named Marp in every language; Textus's own buttons and colors; labels follow the interface language
- **0.1.0-0.1.1** - first versions: a live deck beside the document, full screen, and a self-presenting HTML file

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `export_slides`: Salva o documento em primeiro plano como uma apresentação Marp - um slide por linha --- - num arquivo HTML ao lado (name.slides.html) que se apresenta em qualquer navegador. Retorna o caminho e quantos slides tem.
<!-- /ai-tools -->
