# PDF ビューア

ノートの隣のタブで PDF を開き、読んだり検索したり文字をコピーしたりできます。

- サイドバーから PDF を開くか、ウインドウにドラッグします。PDF の特定のページへのリンクは、そのページで開きます。
- スクロールでページを送るか、矢印ボタンで前後のページへ移動します。
- ボタン、**Ctrl+スクロール**（Mac では **⌘+スクロール**）、ピンチでズームします。ページはポインタを中心にすぐ拡大縮小し、止まるとくっきり描き直されます。
- PDF はウインドウの幅に合わせて開き、ウインドウの大きさを変えても合わせ続けます。パーセント表示をクリックすると、幅に合わせる表示と実際のサイズを切り替えます。
- テキストを選択してノートにコピーできます。
- **Ctrl+F**（Mac では **⌘F**）または虫めがねで PDF 内の語句を検索し、印を付けます。**Enter** で次にその語句があるページへ、**Shift+Enter** で前へ、**Esc** で閉じます。
- PDF をもう一度開くと、前回のページとズームに戻ります。最近の 200 個の PDF を覚えています。
- フォントが埋め込まれていない中国語・日本語・韓国語の PDF も文字を表示し、スキャンしたページは画像を表示します。開けないファイルは理由を示します。

権限は必要ありません。開いた PDF は Textus がこのプラグインに渡します。

## 更新履歴

- **0.2.8** - Its package lists the libraries it carries, with their licenses.
- **0.2.7** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.2.6** - Zoom buttons and keys step by 1.25×, as the other viewers do.
- **0.2.5** - A long PDF scrolled end to end holds far less memory: pages out of sight let go of their pictures too.
- **0.2.4** - Its bar wraps in a narrow panel, and find no longer mixes in results for an earlier word.
- **0.2.3** - Its bar keeps Textus's one order: what it shows, then find and zoom.
- **0.2.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - Textus's own controls. Needs Textus 1.3.2.
- **0.1.3** - Textus 1.3's look; the buttons follow the interface language when it changes.
- **0.1.2** - Scanned pages show their images, links to a page work, pages out of sight free their memory, unreadable files say so; opens at the window's width; zoom stretches around the pointer and then turns sharp.
- **0.1.0-0.1.1** - First versions: pages, zoom, text to select and copy, find, reopening where you left off, Chinese, Japanese and Korean text without embedded fonts.
