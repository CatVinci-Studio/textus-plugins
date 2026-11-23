# Imagens junto ao documento

Guarda as imagens de cada documento numa pasta ao lado dele, com o mesmo nome, como fazem o Typora e o VS Code: as imagens de `Note.md` vão para `Note.assets/`.

Não há nada a ligar nem a configurar; funciona sozinho depois de instalado.

- Cole ou largue uma imagem num documento guardado. O Textus guarda primeiro a imagem; depois este plugin move-a para a pasta do documento e muda a ligação para `Note.assets/imagem.png`. Um nome já usado recebe um número; nada é substituído. Se a ligação não puder ser mudada, a imagem volta para onde estava.
- Mude o nome de um documento dentro da pasta dele e a pasta de imagens muda de nome com ele, ligações incluídas - a não ser que outro documento também aponte para essa pasta; nesse caso, ambos ficam como estão.
- As imagens que já estão nos seus documentos ficam onde estão.
- Num cofre do Obsidian com pasta de anexos definida, e num grafo do Logseq, as imagens ficam onde essa app as põe.

Trabalha com imagens PNG, JPEG, GIF, WebP, AVIF, BMP, SVG, ICO, HEIC e TIFF. Precisa do Textus 1.4.0 ou mais recente. Pede para ler e escrever ficheiros, para mover as imagens e mudar o nome das pastas, e para ler e editar o documento aberto, para mudar a ligação para uma imagem movida.

## Alterações

- **0.1.8** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.0.
- **0.1.7** - The store description now opens with what the plugin does.
- **0.1.6** - Adding many pictures at once (a sync, a folder copied in) no longer reads the open document over and over.
- **0.1.5** - In an Obsidian vault, pictures stay where the vault's attachment setting puts them again: the setting is read through Textus.
- **0.1.4** - Leaves pictures where a document's Typora image folder setting puts them, and no longer moves a folder while some links to it may still be unchecked.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Leaves pictures where an Obsidian vault's attachment folder setting or a Logseq graph puts them.
- **0.1.1** - A shorter name: Images Follow Document.
- **0.1.0** - First version: pasted and dropped pictures move into `Note.assets/`, and the folder follows a renamed document.
