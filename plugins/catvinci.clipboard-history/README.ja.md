# クリップボード履歴

文書でコピーや切り取りをした内容をサイドバーに残し、あとでもう一度入れられます。

文書でテキストをコピーまたは切り取ると、サイドバーの **クリップボード履歴** タブに新しい順で表示されます。最新の 30 件を保存し、Textus を再起動しても残ります。同じテキストをもう一度コピーすると先頭に戻ります。とても長い内容（50,000 文字を超えるもの）は記録しません。

- 項目をクリックすると、カーソル位置に挿入します。
- 項目を右クリックすると、もう一度 **コピー** したり **削除** したりできます。
- **クリップボード履歴を消去**（項目を右クリック、または **プラグイン › クリップボード履歴を消去**）で一覧を空にします。

記録するのは文書でコピーしたものだけで、設定画面やほかのアプリでコピーしたものは記録しません。一覧は Textus の中だけに保存されます。

## 権限

- クリップボード：文書でコピーした内容を知り、項目をもう一度コピーするため。
- 文書の編集：カーソル位置に項目を挿入するため。

## 更新履歴

- **0.1.4** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.1.3** - Each clip shows when it was copied, with a line between clips.
- **0.1.2** - The panel's Clear button is back: one click empties the history. Shorter help and empty-state text.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - First version: the last 30 copies in the sidebar, put in with a click, copied again or removed with a right-click. Needs Textus 1.3.10.
