# バージョン履歴

文書を保存するたびにその内容をバージョンとして残し、何が変わったかを見たり、古い版に戻したりできます。

- 保存するたびに、文書のテキストがバージョンとして残ります。間を置かない保存（数秒ごとの自動保存など）は 1 つにまとめ、新しいバージョンは最短でも 15 分ごとです。直近 1 日分はすべて、1 週間までは 1 時間に 1 つ、3 か月までは 1 日に 1 つ、それより前は 1 週間に 1 つ残します。
- サイドバーの **履歴** タブに、開いている文書のバージョンが新しい順に、日ごとにまとめて並びます（今日、昨日、そのあとは日付）。
- バージョンを選ぶと、それ以降の変更を行単位で表示します。
- 今の文書やほかの任意の版と比べられ、変わった語句に印が付きます。変更の横の「戻す」はその変更だけを戻します。「その他」から版に名前を付けたりピン留めしたり（以後ずっと残ります）、新しい文書として開いたりできます。Textus の外での変更（ほかのアプリ、同期、git）も前後の版が残ります。
- **戻す** は古い内容を文書への編集として提案し、ほかの編集と同じように承認または却下できます。**新しい文書として開く** なら隣に開きます。
- バージョンはフォルダではなく Textus の中に保存されます。2 MB を超える文書は残さず、保存領域がいっぱいになると古いバージョンから消えます。

## 権限

- ファイルと文書の読み取り：保存した版を残し、今の内容と比べるため。
- 編集の提案：古い版を、承認か却下を選べる編集として戻すため。
- Textus AI のツール：Textus AI が文書のバージョンを一覧にして比べられるように。

## 更新履歴

- **0.5.0** - From Textus 1.4.4 the versions other plugins keep of a document - Cloud Sync's - are listed too, each under its source's name, to compare and restore like the rest.
- **0.4.1** - Restore is one word, so its button fits a narrow sidebar in every language.
- **0.4.0** - Versions thin out with age instead of the last 50 going; each text is stored once; a deleted document's versions go a month later. Compare any two versions, word by word; take back one change; name and pin versions; changes made outside Textus are kept. Versions from 0.3 move over by themselves. Needs Textus 1.4.3. In a Git folder on the desktop, the document's commits show under its versions.
- **0.3.8** - The text from before the first save is no longer lost when that save comes right as the document opens.
- **0.3.7** - The text a document had before its first save is kept as a version too, and a document's versions follow it when it is renamed or moved.
- **0.3.6** - Autosave while you type writes only the newest version, not every version of the document, so long documents save with much less work.
- **0.3.5** - An open version stays open while autosave updates it, and Restore always finds it. When storage is full, older versions of other documents make room, and the panel says when a save couldn't be kept. Rows work from the keyboard; buttons wrap in a narrow sidebar.
- **0.3.4** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Only the path code shared with other plugins changed; nothing changes in use.
- **0.3.0** - Textus AI can list a document's versions and compare them (`list_versions`, `diff_versions`).
- **0.2.0** - Textus's own controls. Needs Textus 1.3.2.
- **0.1.0-0.1.3** - First versions: a version on each save, what changed since, restore as an edit to accept or reject, open as a new document, saves close together kept as one, versions grouped by day, the oldest dropped when storage is full.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `list_versions`：ある文書（パスがなければ前面の文書）の保存された版を新しい順に 1 から番号を付けて、保存日時と大きさとともに一覧にします。
- `diff_versions`：文書の二つの版の間、またはある版と今の文書の間の変更を行ごとに示します。+ は追加、- は削除で、前後の行を少し添えます。
<!-- /ai-tools -->
