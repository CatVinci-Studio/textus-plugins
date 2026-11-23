# 画像を文書のそばに

Typora や VS Code と同じように、各文書の画像をそのそばにある同じ名前のフォルダにまとめます。`Note.md` の画像は `Note.assets/` に入ります。

オンにする操作も設定もなく、入れるだけで動きます。

- 保存済みの文書に画像を貼り付けるかドロップします。Textus がまず画像を保存し、このプラグインがそれを文書の画像フォルダに移して、リンクを `Note.assets/画像.png` に書き換えます。同じ名前がすでにあれば番号を付け、何も上書きしません。リンクを書き換えられなかったときは、画像を元の場所に戻します。
- 文書を同じフォルダの中で名前変更すると、画像フォルダもリンクごと名前が変わります。ただし、ほかの文書もそのフォルダにリンクしているときは、どちらもそのままです。
- すでに文書にある画像は動かしません。
- 添付ファイルのフォルダを設定した Obsidian の保管庫や Logseq のグラフでは、画像はそのアプリが置く場所に残ります。

PNG、JPEG、GIF、WebP、AVIF、BMP、SVG、ICO、HEIC、TIFF の画像を扱います。デスクトップで使え、Textus 1.3.0 以降が必要です。画像を移してフォルダ名を変えるためにファイルの読み書きを、移した画像へのリンクを書き換えるために表示中の文書の読み取りと編集を求めます。

## 更新履歴

- **0.1.7** - The store description now opens with what the plugin does.
- **0.1.6** - Adding many pictures at once (a sync, a folder copied in) no longer reads the open document over and over.
- **0.1.5** - In an Obsidian vault, pictures stay where the vault's attachment setting puts them again: the setting is read through Textus.
- **0.1.4** - Leaves pictures where a document's Typora image folder setting puts them, and no longer moves a folder while some links to it may still be unchecked.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Leaves pictures where an Obsidian vault's attachment folder setting or a Logseq graph puts them.
- **0.1.1** - A shorter name: Images Follow Document.
- **0.1.0** - First version: pasted and dropped pictures move into `Note.assets/`, and the folder follows a renamed document.
