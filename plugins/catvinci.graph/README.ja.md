# グラフビュー

ノートとそのあいだのリンクをグラフで表示します。フォルダ全体も、開いている文書の周りだけも見られます。

- **Ctrl+Alt+G**（Mac では **⌘⌥G**）または **プラグイン › グラフビューを開く** で、フォルダ全体をタブに表示します。**全体を表示** でグラフ全体が収まります。
- サイドバーの **グラフ** タブには、開いている文書の周りのノートが出ます。サイドバーのグラフパネル上部のボタンでフォルダ全体を開きます。
- [[ウィキリンク]] もほかの文書へのリンクも数えます。互いにリンクし合う 2 つのノートは 1 本の線で結びます。まだないノートへの [[リンク]] も 1 つのノートとして表示します。
- ノートをクリックすると開きます。ノートをドラッグして配置し、背景をドラッグして移動、スクロールやピンチでズームします。ノートにポインタを置くと、そのリンクが強調されます。タッチ操作では、ノートを 1 回タップするとリンクが強調され、もう 1 回で開きます。
- グラフは自動で調整されます。ズームインすると名前が出て、リンクが少なければ向きを矢印で示し、リンクの多いノートほど大きく描きます。カラーグループがなければ、ノートはフォルダごとの色になります。
- フォルダの文書が変わると、グラフを描き直します。

## 設定

全体のグラフ上部のスライダーボタンで設定を開きます。サイドバーのグラフに設定はありません。

- **フィルター**：検索（`path:ideas`、`file:draft`、`tag:#todo`、先頭に `-` で除外）。**タグ** で #タグ もノードとして表示。**存在するファイルのみ** でまだないノートを隠す。**孤立したノート**（全体のグラフ）でリンクのないノートを表示。
- **グループ**：検索に合うノートに色を付けます。**新しいグループ** で追加し、**デフォルトに戻す** で変更を取り消します。

Obsidian の保管庫では、Obsidian の `graph.json` に保存されたカラーグループも、自分のグループのあとに使われます。

## 権限

- ファイルと文書の読み取り：フォルダのノートとリンク、Obsidian の `graph.json` を読むため。
- Textus AI のツール：Textus AI が文書の周りのノートを見られるように。

## 更新履歴

- **0.5.10** - By touch, a first tap on a note lights it and its links and a second opens it; notes are easier to hit with a finger, and a second finger zooms instead of also moving the graph. Its settings open in Textus's own popover.
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
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `list_neighbours`：ある文書（パスがなければ前面の文書）のノートのグラフでの近傍を返します。向きを問わず数リンク以内のノートと、それぞれ何リンク離れているか、その間のリンクです。存在しないノートへの [[リンク]] は kind が missing になります。
<!-- /ai-tools -->
