# クイックプレビュー

リンク先を開かずに読めます。別の文書へのリンクにポインタを置くと、その本文がカードに表示されます。

- 別の文書へのリンク（Markdown のリンクや [[ウィキリンク]]）にポインタを置きます。
- 横にカードが現れ、その文書の冒頭をフロントマターを除いて表示します。見出しへのリンク（`#見出し`）ならその節を、ブロックへのリンク（`#^id`）ならそのブロックを表示します。
- カードに表示するのは約 1,500 文字までで、段落の終わりで区切ります。**開く** でその文書へ移動し、**固定** で書いているあいだもカードを開いたままにできます。
- プレビューできるのは、開いているフォルダの中の文書だけです。

このプラグインは、エディターを読む権限（どのリンクを指しているかを知るため）とファイルを読む権限（リンク先の文書を表示するため）を求めます。ファイルを変えることはありません。タブレットでは、マウスかトラックパッドをつなげば使えます。

## 更新履歴

- **0.2.4** - Its page says that on a tablet it needs a mouse or trackpad, instead of which devices it runs on.
- **0.2.3** - The store description now opens with what the plugin does.
- **0.2.2** - A link to a nested heading (`[[Note#A#B]]`) shows that heading's section, as a click opens it. Needs Textus 1.4.0.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - A link to a block (`#^id`) shows that block. Needs Textus 1.3.9.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - The card's length is fixed instead of a setting.
- **0.1.0-0.1.1** - First versions: a card for links to documents, with the document's opening or the section the link names, and Open and Pin.
