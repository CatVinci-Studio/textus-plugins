# Zotero

書きながら Zotero ライブラリから引用できます。

## 準備

同じコンピュータで Zotero 7 以降（Zotero 10 も可）を起動し、Zotero の **設定 › 詳細** で「このコンピュータ上の他のアプリケーションが Zotero と通信することを許可する」をオンにしておきます。プラグインが通信するのはこのコンピュータの Zotero だけで、データが外に出ることはありません。

## 引用する

- **Ctrl+Alt+R**（Mac では **⌘⌥R**）を押すか、右クリックメニューの **Zotero から引用を挿入…**、または **プラグイン › Zotero から引用を挿入…** を選びます。最近引用した文献が先に並び、その後でライブラリ全体を検索できます。
- 文字を選択していると、その文字で検索します。
- 項目を選ぶと、カーソルの位置に引用が入ります。
- 引用や Zotero の項目へのリンクにポインタを置くと、著者、年、掲載先、要旨の冒頭が表示されます。
- **プラグイン › 参考文献リストを挿入** で、文書が引用しているすべての文献を第一著者と年の順に並べた **参考文献** の節を末尾に追加します。もう一度実行すると、二重に追加せずリストを置き換えます。

## 引用の書き方

プラグインの設定の **引用の書き方** で選びます：

- **Pandoc キー：[@key]**（既定）。**設定 › 編集と外観 › 書き出す** で参考文献ファイル（.bib）を選んでおくと、Pandoc で書き出したときに整形された参考文献になります。
- **著者と年：(著者, 2024)**。
- **Obsidian のノートリンク：[[@key]]**。その項目の文献ノートへのリンクです。ノートがまだなければ、作成するか尋ねます。
- **Zotero を開くリンク**。

引用キーは項目の Citation Key フィールド（または Better BibTeX が書く、Extra 内の `Citation Key:` の行）から取ります。

## 文献ノート

- **プラグイン › Zotero から文献ノートを作成…** で `@citekey.md` を作ります（既にあれば開きます）。項目のタイトル、著者、年、要旨、DOI または URL、Zotero でのハイライトとメモが入ります。
- ノートは開いているフォルダの **References** に作られます。**文献ノートのフォルダ** で変更できます。
- **文献ノートのテンプレート** には、フォルダ内の Markdown ファイル（`Templates/Literature.md` など）を指定できます。`{{title}}`、`{{authors}}`、`{{year}}`、`{{abstract}}`、`{{citekey}}`、`{{DOI}}`、`{{URL}}`、`{{highlights}}`、`{{notes}}`、`{{date:YYYY-MM-DD}}` が使えます。空なら、front matter 付きのシンプルなノートになります。
- Obsidian の保管庫では、Zotero Integration や Citations プラグインで設定したフォルダとテンプレートに従います。ほかのテンプレート言語で書かれたテンプレートは、シンプルなノートで代用します。

## 権限

- **ネットワーク（localhost:23119 のみ）**：このコンピュータの Zotero のローカル API に接続するため。
- **文書の読み取りと編集**：引用と参考文献リストを挿入し、選択した文字で検索するため。
- **開いているフォルダのファイルの読み書き**：テンプレートと保管庫の Zotero 設定を読み、文献ノートを作るため。
- **Textus AI のツール**：Textus AI がライブラリを検索できるようにするため。

## 更新履歴

- **0.4.6** - A simpler icon, drawn in the text colour.
- **0.4.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.4.4** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. Needs Textus 1.4.3.
- **0.4.3** - A citation now replaces the selected words; the References list no longer says Zotero is unreachable when it answers, and hover previews show up more reliably.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its code is split into smaller files by what each part does; nothing changes in use.
- **0.4.0** - literature note templates are filled by Textus's own template engine; needs Textus 1.3.10
- **0.3.0** - literature notes from Zotero, with a template and an Obsidian vault's settings; citations as `[[@citekey]]`
- **0.2.1** - the shortcut moves from Ctrl+Alt+C to Ctrl+Alt+R
- **0.2.0** - a tool for Textus AI, `search_library`
- **0.1.3** - listed for the desktop only
- **0.1.2** - works with Zotero 10's local API; the references list is replaced when made again, and code is never read for citations
- **0.1.0-0.1.1** - first versions: citing with recent works first, hover cards for citations, the references list, four citation styles

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `search_library`：このコンピュータにあるユーザーの Zotero ライブラリを検索します（Zotero 7 以降が起動している必要があります）。各アイテムのキー・タイトル・著者・年・種類・掲載先・引用キーと、ユーザーが選んだ形式で挿入する引用を返します。Zotero に接続できないときは、どうすればよいかを添えて失敗します。
<!-- /ai-tools -->
