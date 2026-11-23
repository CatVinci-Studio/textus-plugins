# Visualizador de imagens

Abre imagens e arquivos SVG numa aba, onde você pode dar zoom, girá-los e ler o código de um SVG.

## Ver uma imagem

- Abra um arquivo PNG, JPEG, GIF, WebP, AVIF, BMP, ICO ou SVG pela barra lateral, ou arraste-o para a janela. Ele abre numa aba própria, ajustado a ela.
- A barra mostra as dimensões da imagem em pixels e o tamanho do arquivo.
- Dê zoom com os botões **−** e **+** ou com **Ctrl+rolagem** (**⌘+rolagem** no Mac). Clique na porcentagem para alternar entre ajustada e tamanho real.
- Com zoom, arraste a imagem para percorrê-la. Um clique duplo alterna entre ajustada e tamanho real, no ponto clicado.
- O botão **Girar** gira um quarto de volta por vez. Só a visualização gira; o arquivo não muda.
- Teclas: **+** e **-** dão zoom, **0** mostra o tamanho real, **F** ajusta e **R** gira.
- Num SVG, **Código** mostra a marcação para ler ou copiar, e **Imagem** volta. O SVG é mostrado como imagem, então seus scripts nunca rodam.
- Se o arquivo não existe ou não é uma imagem, isso é dito no lugar de uma aba vazia.

## Permissões

Não pede nenhuma. Só lê o arquivo que você abre, no computador e no iOS.

## Alterações

- **0.2.5** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.2.4** - A turned and zoomed picture now scrolls to every edge, and a sideways picture fits the window. Zoom and turn are kept when the panel moves, a fourth turn no longer spins back, and the bar fits a narrow panel.
- **0.2.3** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the picture, not the document behind it. Its bar keeps Textus's one order: what it shows, then find and zoom.
- **0.2.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - Textus's own buttons and tab bar; labels follow the interface language when it changes
- **0.1.3** - colors from Textus 1.3's themes
- **0.1.2** - the percentage switches between fit and actual size
- **0.1.0-0.1.1** - first versions: zoom, fit, drag, rotate, keys, an SVG's source, and a message for a file that can't be opened
