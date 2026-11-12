# Imagens junto ao documento

Guarda as imagens de cada documento numa pasta ao lado dele, com o mesmo nome, como fazem o Typora e o VS Code: as imagens de `Note.md` vão para `Note.assets/`.

Não há nada a ligar nem a configurar; funciona sozinho depois de instalado.

- Cole ou largue uma imagem num documento guardado. O Textus guarda primeiro a imagem; depois este plugin move-a para a pasta do documento e muda a ligação para `Note.assets/imagem.png`. Um nome já usado recebe um número; nada é substituído. Se a ligação não puder ser mudada, a imagem volta para onde estava.
- Mude o nome de um documento dentro da pasta dele e a pasta de imagens muda de nome com ele, ligações incluídas - a não ser que outro documento também aponte para essa pasta; nesse caso, ambos ficam como estão.
- As imagens que já estão nos seus documentos ficam onde estão.
- Num cofre do Obsidian com pasta de anexos definida, e num grafo do Logseq, as imagens ficam onde essa app as põe.

Trabalha com imagens PNG, JPEG, GIF, WebP, AVIF, BMP, SVG, ICO, HEIC e TIFF. Funciona no computador e precisa do Textus 1.3.0 ou mais recente. Pede para ler e escrever ficheiros, para mover as imagens e mudar o nome das pastas, e para ler e editar o documento aberto, para mudar a ligação para uma imagem movida.

## Alterações

- **0.1.4** - Deixa as imagens onde a configuração de pasta de imagens do Typora de um documento as põe, e não move mais uma pasta enquanto ainda houver links para ela sem verificar.
- **0.1.3** - Sua página agora diz numa frase o que ele faz, o que pode fazer e o que mudou em cada versão.
- **0.1.2** - Deixa as imagens onde as põe a pasta de anexos de um cofre do Obsidian ou um grafo do Logseq.
- **0.1.1** - Um nome mais curto: Imagens junto ao documento.
- **0.1.0** - Primeira versão: as imagens coladas e largadas vão para `Note.assets/`, e a pasta segue o documento com novo nome.
