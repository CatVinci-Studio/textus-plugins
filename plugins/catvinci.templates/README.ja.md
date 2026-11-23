# テンプレート

自分のテンプレートから文書を作ったり断片を挿入したりします。日付・時刻・表題は自動で入ります。

テンプレートは、開いているフォルダの **Templates** フォルダにある Markdown ファイルです（Obsidian の保管庫では、テンプレート設定で指定されたフォルダ）。ノートと一緒に持ち運べます。まだ一つもないときは、最初に **議事録** テンプレートを作ります。

- **プラグイン › テンプレートから新規作成…** で、テンプレートから開いているフォルダの一番上に文書を作ります。名前を尋ね、同じ名前の文書がすでにあれば作りません。
- **プラグイン › テンプレートを挿入…**、またはスラッシュメニューの **テンプレートを挿入…** で、カーソル位置にテンプレートを入れます。
- **プラグイン › テンプレートとして保存…** で、表示中の文書をテンプレートとして保存します。同じ名前があれば番号を付け、何も上書きしません。

## 自動で入るもの

- テンプレートを使うときに `{{date}}`、`{{time}}`、`{{title}}` が入ります。`{{date:YYYY-MM-DD}}` や `{{time:HH:mm}}` で書式を指定できます（Obsidian と同じ）。
- Obsidian の保管庫では、`{{date}}` と `{{time}}` は保管庫のテンプレート設定の日付・時刻の書式に従います。
- Templater のよく使うタグも入ります：`<% tp.date.now("YYYY-MM-DD") %>`（`-1` のような日数や `"P1W"` でずらせます）、`tp.date.today`、`tomorrow`、`yesterday`、`<% tp.file.title %>`、`tp.file.creation_date()`、`tp.file.folder()`。`<% tp.file.cursor() %>` の位置にカーソルを置きます。
- スクリプトやほかのタグは実行しません。書いたまま残し、通知でその名前を示します。

デスクトップと iPhone で使え、Textus 1.3.10 以降が必要です。テンプレートと新しい文書のために開いているフォルダのファイルの読み書きを、挿入や保存のために表示中の文書の読み取りと編集を求めます。また、Textus AI に下の二つのツールを渡します。

## 更新履歴

- **0.5.6** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3.
- **0.5.5** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. Needs Textus 1.4.3.
- **0.5.4** - A taken name gets the next free one as the file is written, never a clash (Textus 1.4.3).
- **0.5.3** - The store description now opens with what the plugin does.
- **0.5.2** - Templates in a hidden or lowercase templates folder, and in its subfolders, now show up. After Insert, the caret lands right after the template.
- **0.5.1** - **New from Template…** from a file's or folder's right-click menu makes the document in that folder.
- **0.5.0** - Templates are filled in by Textus itself, the same way as daily notes; needs Textus 1.3.10.
- **0.4.1** - Templates are listed in natural order: 2 before 10.
- **0.4.0** - Templater's common `tp.date` and `tp.file` tags, and an Obsidian vault's Templates date and time formats; tags that aren't run are named in a notice.
- **0.3.0** - Templates are Markdown files in the Templates folder (a vault's own templates folder in Obsidian), moved there once from where older versions kept them; `{{date:FORMAT}}` and `{{time:FORMAT}}`.
- **0.2.0** - Textus AI can list your templates and make a document from one.
- **0.1.3** - Says where it runs: desktop and iPhone.
- **0.1.2** - New from Template refuses a name that is already taken.
- **0.1.0-0.1.1** - First versions: new documents, inserted snippets and saved templates, with `{{date}}`, `{{time}}` and `{{title}}`; store page and icon.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `list_templates`：ユーザーの文書テンプレートを、名前と Markdown とともに一覧にします。使うときに {{date}}・{{time}}・{{title}} と Templater の tp.date・tp.file タグが埋められます。
- `create_from_template`：ユーザーのテンプレートから、開いているフォルダに新しい文書を作り、{{date}}・{{time}}・{{title}} と Templater の tp.date・tp.file タグを埋めます。パスと、そのまま残したタグ（notRun）を返します。
<!-- /ai-tools -->
