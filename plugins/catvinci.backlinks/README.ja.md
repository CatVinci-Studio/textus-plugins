# 双方向リンク

`[[` と入力してノート・見出し・ブロックにリンクし、`![[` で埋め込み、開いている文書へのリンクをサイドバーで確認できます。

`[[ノート]]` のようなリンクは Textus に標準で入っていて、プラグインなしで書いて開けます。このプラグインはリンクを書く手助けをし、リンク先をその場に表示し、開いている文書のまわりのリンクを一覧にします。

## 書きながらリンクする

- `[[` と入力し、開いたパネルからノートを選びます。ファイル名、最初の見出し、front matter の `aliases` のどれでも探せます。別名を選ぶと `[[ノート|別名]]` と書かれます。
- `#` の後はそのノートの見出し：`[[ノート#見出し]]`。`[[#` で今の文書自身の見出しが出ます。
- `#^` の後はそのブロック：段落、リストの項目、表、引用。id のないブロックを選ぶと、そのノートのブロック末尾に id（`^1a2b3c` など）を Obsidian と同じ形で付けます。
- 言葉を選択してから `[[` と入力すると、リンクになります。
- リンクはフォルダの書き方で書きます。フォルダで選んだ書き方か Obsidian 保管庫のリンク形式、なければそのノートにすでにあるリンクに合わせ、それもなければどのアプリでも開ける標準リンク `[Nov 8](Week45/Nov%208.md)` にします。パスが必要なウィキリンクはノート名だけを表示します。

## 埋め込み

- `![[ノート]]` はノート全体を、`![[ノート#見出し]]` はその節を、`![[ノート#^id]]` はそのブロックをその場に表示します。埋め込みは読み取り専用で、元のノートが変わると追従します。
- その行にカーソルを置くと、リンクそのものを編集できます。

## サイドバーのリンク

サイドバーの **双方向リンク** タブに、開いている文書にリンクしているノートと、この文書のリンク先が表示されます。

- **リンクされた言及**：[[ウィキリンク]] やこのファイルへのリンクでここを指している、他のノートの行です。クリックするとその場所へ移動します。
- **リンクされていない言及**：このノートの名前（ファイル名、最初の見出し、`aliases`）を出しているのにリンクになっていない行です。右クリックして **リンクにする** を選ぶとリンクになります。その行が別名を使っていれば、別名がリンクの表示テキストとして残ります。
- **発リンク**：このノートのリンク先です。まだ作られていないノートも含みます。
- 上部の入力欄で一覧を絞り込めます。

## 標準リンクかウィキリンクか

- **プラグイン › 新しいリンクの書き方：標準かウィキリンクか…** で、開いているフォルダの新しいリンクの書き方を選びます。選択はフォルダの `.textus/settings.json` に保存され、Textus もほかのプラグインもそれに従います。
- **プラグイン › リンクを標準リンクに変換…** と **リンクをウィキリンクに変換…** は、表示中の書類かフォルダのすべてのノートのリンクを書き換えます。先に変わるリンクの数を示し、どのリンクもリンク先は変わりません。コード、冒頭のプロパティ、リンク先が見つからないリンクはそのまま。画像やほかのファイルは標準リンクのままです。

## 権限

- **文書の読み取りと編集**：入力中のリンク補完と、選択した言葉のリンク化のため。
- **開いているフォルダのファイルの読み書き**：リンクと言及を探し、リンクされていない言及にリンクを付け、ブロックに `^id` を付けるため。
- **Textus AI のツール**：Textus AI が文書のリンクを一覧できるようにするため。

## 更新履歴

- **0.4.8** - Its page no longer says which devices it runs on: the store shows that.
- **0.4.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.4.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.5** - Unlinked mentions open on the right line, and Link Style is set by Textus itself (Textus 1.4.3).
- **0.4.4** - The Convert Links commands leave links inside a code block alone and convert the ones after it, and Unlinked mentions no longer lists or links names in front matter or code.
- **0.4.3** - Standard links to notes that don't exist yet now show under Outgoing links, a note's links to its own headings no longer list the note itself, and dragging a divider no longer redraws the panel.
- **0.4.2** - Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.1** - In a note with no links yet, [[ writes a standard link: the [[ being typed was taken for a wiki link the note already had.
- **0.4.0** - New Links: Standard or [[Wiki]]… chooses how the folder writes new links, and Convert Links turns a note's or the whole folder's links from one way into the other; [[ writes the folder's way, a standard link where nothing says otherwise.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - `[[` completion for notes, headings and blocks; `![[` embeds; renamed from Backlinks to Two-way Links
- **0.2.1** - the description says "two-way links", so a store search finds it
- **0.2.0** - a tool for Textus AI, `list_backlinks`
- **0.1.0-0.1.1** - first versions: linked and unlinked mentions with **Link**, outgoing links and a filter; suggested for documents with wiki links

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `list_backlinks`：ある文書（パスがなければ前面の文書）について、そこへリンクしているノート（パス・行番号・その行の本文）、リンクせずに名前を挙げている行、その文書からのリンク先を一覧にします。
<!-- /ai-tools -->
