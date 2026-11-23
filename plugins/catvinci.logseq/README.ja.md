# Logseq フォルダー

Logseq のグラフを Logseq の書き方で開きます。ページ名でのリンク、assets の画像、日誌のフォルダと日付形式です。

## すること

- 開いたフォルダ、またはその上のフォルダが、ファイルで保存された Logseq のグラフ（`logseq/config.edn` がある）なら、Textus はリンクをページ名で書き（`[[ページ]]`）、リンクから作ったページを `pages/`（または `:pages-directory` で決めた場所）に置きます。デイリーノートは日誌を `journals/` に、`:journal/file-name-format` のとおりの名前で保存します。
- Logseq の画像フォルダ `assets/` は、隅のカードで一度だけ提案されます。受け入れるとフォルダの `.textus/settings.json` に保存されます。今の設定のままにすれば、Textus は二度と尋ねません。
- グラフの中のウィキリンクは、このプラグインがなくてもグラフのフォルダから見つかります。

## 権限

求めるのは **開いているフォルダのファイルの読み取り** だけです。Textus が `logseq/config.edn` を渡し、プラグインはその意味を伝えます。何も変えません。

## 更新履歴

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it.
- **0.1.0** - First version: Logseq's settings offered when a Logseq graph is opened. Needs Textus 1.4.6.
