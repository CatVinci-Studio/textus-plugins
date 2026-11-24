# Marp

文書を [Marp](https://marp.app) の書き方でスライドにして発表します。

## スライドを作る

- `---` ごとに新しいスライドが始まります。
- **プラグイン › スライドで発表** で、文書の隣のタブにスライドが表示され、書くそばから更新されます。← →（または ↑ ↓、Page Up と Page Down）と Space でスライドを移動し、**全画面**（または F）で発表します。発表中は、スライドの左 3 分の 1 をタップかクリックすると前へ、それ以外の場所なら次へ進み、スワイプでも同じです。スライドに触れるかポインターを動かすと **発表を終了** が出ます。Esc でも終われます。
- テーマやレイアウトは Marp のディレクティブで選びます。たとえば先頭に：

```markdown
---
theme: gaia
paginate: true
---
```

- 画像もスライドに表示され、Obsidian の `![[photo.png]]` も使えます。`![[photo.png|300]]` で幅を指定します（`300x200` なら幅と高さ）。

## スライドを保存する

**プラグイン › スライドを HTML に書き出す**（またはスライドの **HTML を保存**）で、文書の隣に `name.slides.html` を保存します。どのブラウザでも同じキーで発表できる 1 つのファイルです。画像は文書のフォルダからリンクするので、ファイルは画像の隣に置いておきます。先に文書を保存しておく必要があります。

[Marp Core](https://github.com/marp-team/marp-core)（MIT）を使っています。テーマ（default、gaia、uncover）、数式、コードの色分けは Marp Core によるもので、そのためこのプラグインは約 4 MB あります。

## 権限

- **文書の読み取り**：書くそばからスライドを描くため。
- **ファイルの読み書き**：表示する画像を探し、HTML のスライドを文書の隣に保存するため。
- **Textus AI のツール**：Textus AI がスライドを保存できるようにするため。

## 更新履歴

- **0.3.14** - Its icon is Marp's own logo.
- **0.3.13** - The deck no longer stays blank when no document is in front - in Source Mode or Source and Preview, or presented from the plugin's page: it shows the document open in another tab, as last saved, or says to click one. Slides scale to their frame on a Mac, iPhone and iPad, in the tab and in a saved deck opened in Safari.
- **0.3.12** - Presenting on a phone or tablet: tap or swipe to move between slides, and Exit to stop - no keyboard needed. A click moves on in full screen too, as in a saved deck. In a narrow tab, Save HTML goes into the ⋯ menu instead of pushing Full Screen onto a second row. Its page is in every language Textus speaks.
- **0.3.11** - Its package lists the libraries it carries, with their licenses.
- **0.3.10** - Code kept for Textus versions it no longer runs on is gone. From Textus 1.4.4 the deck is also in File › Export, as Slides (HTML).
- **0.3.9** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.3.8** - Present as Slides draws the deck on a phone, where its tab comes to the front alone.
- **0.3.7** - Formulas use KaTeX's own fonts from Textus 1.4.2 on, in the tab and in a saved HTML file; earlier versions keep the system's fonts.
- **0.3.6** - A deck needs nothing from the web: emoji show as text instead of pictures from a CDN, formulas use the system's fonts, and the Gaia theme no longer loads a web font, in the tab and in a saved HTML file.
- **0.3.5** - Writing a deck with many pictures is lighter: the slides are made again only when the text changed, and pictures it no longer shows are let go.
- **0.3.4** - Full Screen works in the tab (presenting in place where the window can't go full screen); the deck renders only while its tab is open; shortcuts leave Cmd/Ctrl/Alt keys alone.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - pictures in the deck, including Obsidian's `![[picture]]` embeds with a width
- **0.3.0** - a tool for Textus AI, `export_slides`
- **0.2.0** - named Marp in every language; Textus's own buttons and colors; labels follow the interface language
- **0.1.0-0.1.1** - first versions: a live deck beside the document, full screen, and a self-presenting HTML file

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `export_slides`：前面の文書を Marp のスライド（--- の行ごとに一枚）として、隣に一つの HTML ファイル（name.slides.html）に保存します。どのブラウザでも発表できます。パスとスライドの枚数を返します。
<!-- /ai-tools -->
