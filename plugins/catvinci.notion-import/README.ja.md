# Notion インポート

Notion のエクスポートを、開いているフォルダの普通の Markdown ファイルに変えます。Obsidian でもそのまま読めます。

ページとその中のページ、画像と添付ファイル、ページ同士のリンク、そして Obsidian の Bases 形式にしたデータベースが、すべて移ってきます。

1. Notion で **設定 › ワークスペースのコンテンツをすべてエクスポート** を選び、**Markdown & CSV** とサブページを含めます。できた .zip（または展開したフォルダ）を、Textus で開いているフォルダに入れます。
2. **プラグイン › Notion からインポート…** を選び（またはサイドバーで .zip を右クリックし）、エクスポートを選びます。大きなエクスポートが 1 つの zip の中で Part-1.zip、Part-2.zip… と分かれていても、まとめて 1 つとして開きます。256 MB を超える .zip は一度に読み込めません。開いているフォルダに展開してから、そのフォルダを選んでください。
3. インポート先のフォルダに名前を付けます（入力しなければ **Notion**）。すでにあるものは変更しません。進行中はプログレスバーからキャンセルでき、それまでに書き込んだものは残ります。終わるとレポートのページが開き、**Wiki** を入れていれば、サイドバーにインポートした内容がページのツリーで表示されます。

## インポート後の形

- **ページ**：中にページがあるページは（中にページがあるデータベースの行も）フォルダになり、その中にページ `Plans/Plans.md` が、隣に中のページが入ります。中にページがなければ 1 つのファイル `Plans.md` です。名前から Notion の id は外れます。データベースの行のページは、Notion がファイル名では途中で切ってしまうタイトルを、最後まで名前にします。
- **データベース**：データベースはそれぞれフォルダになり、`base` ブロックを入れたページができます。ビューはクリックで切り替えられ、ステータスがあればボード、表、日付があればカレンダーです。行はそれぞれそのフォルダのノートになり、プロパティは front matter に入ります。日付は 2026-01-04 の形、チェックボックス、数値、リスト、リレーションはリンクになります。別のページにデータベースが表示されていれば、そこにも表示し、エクスポートのとおりに並べます。Notion の中身のない「Untitled」の行やページは省きます。
- **画像と添付ファイル** は、それを表示するページの隣の `assets` フォルダに入ります。貼り付けた画像には、そのページの名前が付きます。
- **リンク**：ページ同士、画像、添付ファイルへのリンクは新しい名前に合わせます。エクスポートされていないページへのリンクはレポートに一覧で出ます。
- **ページ同士のリンク**：最初に書き方を選びます。Notion のエクスポートと同じで、どのアプリでも開ける標準リンク `[Page](Page.md)`（おすすめ）か、Obsidian の書き方の `[[ウィキリンク]]` です。インポートしたフォルダはこの選択を覚えるので、あとでそこに作るページも同じ書き方でリンクします。
- **コールアウト** は注記（`> [!NOTE]`）になり、絵文字も残ります。トグルは `<details>` のままです。

**ページのアイコン**：Notion の Markdown エクスポートには入っていません。同じページを HTML でもエクスポートし、インポート中に聞かれたらそれを選ぶと、ページの絵文字アイコンが移ってきます。

**移らないもの**：Notion のエクスポートにはカバー、コメント、保存したビューのフィルターが入っていないので、これらは移りません。ビューの並べ替えは移ります。数式とロールアップのプロパティはその時点の値が残り、人や日付のメンションは普通のテキストになります。

## レポート

レポートには、取り込んだものの数、見つからなかったリンク、読み書きできなかったファイル、変換したブロックが並び、残りに役立つプラグインをすすめます。ページのツリーとデータベースのための Wiki が最初で、続いて双方向リンク、クイックプレビュー、タスク、リンクカード、PDF ビューア、テンプレートを、インポートした内容に役立つものだけ挙げます。**プラグイン › Notion インポート後のおすすめプラグイン…** でどれかをインストールできます。Textus が先に確認し、勝手にインストールされることはありません。

## 権限

すべてお使いの端末の中で行われます。プラグインは開いているフォルダのファイルだけを読み書きし、ネットワークは使いません。Textus 1.3.10 以降が必要です。

## 更新履歴

- **0.7.13** - A simpler icon, drawn in the text colour.
- **0.7.12** - Its page is in every language Textus speaks. In Chinese, a database is 数据库, and 知识库 is only the Wiki plugin's name. Every language calls the Wiki plugin by its current name.
- **0.7.11** - Its package lists the libraries it carries, with their licenses.
- **0.7.10** - The database code it shares with Database brought up to date (its file columns filled).
- **0.7.9** - Databases it makes keep a view another plugin draws (Textus 1.4.6).
- **0.7.8** - The import report gets a free name as it is written (Textus 1.4.3).
- **0.7.7** - Bundles the Wiki plugin's newer base code; importing works as before.
- **0.7.6** - Importing a database with many rows is quicker.
- **0.7.5** - Page icons now come through from an unzipped HTML export too, and such an export shows up when you pick where the icons come from.
- **0.7.4** - Shares the database's updated filter code: a filter ticking several values reads the same in both. Shorter help and empty-state text.
- **0.7.3** - Once imported, the sidebar goes into the new folder (Textus 1.3.12) and shows its pages tree. Notion's blank rows and pages - no title, nothing written, only the "Not started" status Notion fills in - are left out.
- **0.7.2** - A database that sits under a page (as in Notion) stays a link on that page, no longer also shown there as a table; its own page shows it. Its code is split into smaller files by what each part does.
- **0.7.1** - Shares Two-way Links' fix for working out how a note links.
- **0.7.0** - asks how the pages link: standard links (recommended), as Notion exports them, or [[wiki links]] - a path shown by the page's name; the imported folder keeps the choice for pages made in it later
- **0.6.1** - Calls Workspace by its name in the import report and in the suggested plugins.
- **0.6.0** - Dates written by Textus itself; needs Textus 1.3.10.
- **0.5.0** - Page emoji icons, from Notion's HTML export of the same pages.
- **0.4.0** - Its own plugin again: pages with sub-pages as folders, databases as Obsidian bases, empty "Untitled" pages left out, and the import opened in Workspace's pages tree.
- **0.3.0** - Merged into Workspace for a while; this version only pointed there.
- **0.2.2** - One database block per database, opening on the board when there is a status.
- **0.2.1** - Asks what to name the import's folder; pasted pictures are named after their page.
- **0.2.0** - Reads Notion's newer exports: no doubled pages or rows, rows keep their whole titles, attachments go beside the page that uses them, databases shown on other pages keep their sort.
- **0.1.1** - The report suggests Two-way Links by its new name.
- **0.1.0** - First version: a Notion export (.zip or folder) into a folder of Markdown, ids out of names, links rewritten, databases as notes with front matter, callouts as notes, a report with plugins that help.
