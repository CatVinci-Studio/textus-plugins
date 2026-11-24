# ブックマーク

文章の一部をブックマークし、サイドバーからいつでもそこへ戻れます。どの文書でも使えます。

語句を選択して **選択範囲をブックマーク** を選びます。選択範囲を右クリックするか、**プラグイン › 選択範囲をブックマーク** から実行します。ブックマークはファイルを指すので、先に文書を保存してください。

サイドバーの **ブックマーク** タブに、文書ごとにブックマークが並びます。クリックすると文書が開き、その語句の位置に移動します。削除するには、ブックマークを右クリックして **ブックマークを削除** を選びます。文書の名前を変えたり移動したりしても、ブックマークは付いていきます。

## Obsidian の保管庫

開いているフォルダが Obsidian の保管庫（`.obsidian` フォルダがある）の場合：

- Obsidian 自身のブックマーク（`.obsidian/bookmarks.json`）もこのタブに **Obsidian のブックマーク** として、Obsidian のグループのまま表示されます。ノート、見出し、ブロックのブックマークが対象で、検索やフォルダなどは表示しません。

## 権限

- 文書の読み取り：選択範囲を読むため。
- ファイルの読み取り：Obsidian の `bookmarks.json` のため。
- Textus AI のツール：Textus AI がブックマークを一覧にできるように。

## 更新履歴

- **0.4.6** - Its page shows its list of changes in English in every language.
- **0.4.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.4** - Obsidian's bookmarks are listed as before but no longer written: Textus 1.4 keeps plugins out of `.obsidian`. Needs Textus 1.4.0.
- **0.4.3** - Rows are grouped by the document's path in the folder, one group per document; long passages end at a word with "…"; a failed block-id edit in a vault keeps the bookmark.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - In an Obsidian vault, new bookmarks are written to Obsidian's `bookmarks.json` too, and removed and renamed there.
- **0.3.0** - Lists the vault's own Obsidian bookmarks of notes, headings and blocks.
- **0.2.1** - Paths handled by code shared with other plugins; nothing changes in use.
- **0.2.0** - Textus AI can list your bookmarks (`list_bookmarks`).
- **0.1.0-0.1.2** - First versions: bookmark a selection, the sidebar list by document, bookmarks that follow renames; store page and icon; runs on desktop and iOS.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `list_bookmarks`：ユーザーのブックマークを一覧にします。各文書でブックマークした語句と、開いているフォルダでのその文書のパスです。
<!-- /ai-tools -->
