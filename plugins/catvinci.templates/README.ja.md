# テンプレート

自分のテンプレートから文書や断片を作ります。日付・時刻・表題は自動で入ります。

- テンプレートは、開いているフォルダの **Templates** フォルダにある Markdown ファイルです（Obsidian の保管庫では、テンプレート設定で指定されたフォルダ）。ノートと一緒に持ち運べます。以前のバージョンが保存していたものは一度だけそこへ移します。同じ名前があれば番号を付け、何も上書きしません。`{{date:YYYY-MM-DD}}` や `{{time:HH:mm}}` で書式を指定できます（Obsidian と同じ）。
- **テンプレートから新規作成…** で開いているフォルダにテンプレートから文書を作り、**テンプレートを挿入…**（本文で `/` も可）でカーソル位置に入れます。
- **テンプレートとして保存…** で前面の文書をテンプレートにします。
- テンプレート中の `{{date}}`・`{{time}}`・`{{title}}` は使うときに埋められます。最初は「議事録」テンプレートがあります。
- Obsidian の保管庫では、`{{date}}`・`{{time}}` はテンプレート設定の日付・時刻の書式で書かれます。Templater のよく使うタグも埋められます：`<% tp.date.now("YYYY-MM-DD") %>`（日数のずれ `-1` や `"P1W"` も可）、`tp.date.today`・`tomorrow`・`yesterday`、`<% tp.file.title %>`、`tp.file.creation_date()`、`tp.file.folder()`。`<% tp.file.cursor() %>` の位置にカーソルを置きます。スクリプトやほかのタグは実行せず、そのまま残して通知で知らせます。

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `list_templates`：ユーザーの文書テンプレートを、名前と Markdown とともに一覧にします。使うときに {{date}}・{{time}}・{{title}} と Templater の tp.date・tp.file タグが埋められます。
- `create_from_template`：ユーザーのテンプレートから、開いているフォルダに新しい文書を作り、{{date}}・{{time}}・{{title}} と Templater の tp.date・tp.file タグを埋めます。パスと、そのまま残したタグ（notRun）を返します。
<!-- /ai-tools -->
