# 画像ビューア

画像や SVG ファイルをタブで開き、拡大縮小や回転、SVG のソース表示ができます。

## 画像を見る

- サイドバーから PNG・JPEG・GIF・WebP・AVIF・BMP・ICO・SVG のファイルを開くか、ウインドウにドラッグします。専用のタブで、ウインドウに合わせた大きさで開きます。
- 上のバーに、画像のピクセル数とファイルサイズが表示されます。
- **−**・**+** ボタンか **Ctrl+スクロール**（Mac では **⌘+スクロール**）で拡大・縮小します。パーセント表示をクリックすると、ウインドウに合わせる表示と実際のサイズを切り替えます。
- 拡大中は画像をドラッグして見回せます。ダブルクリックで、ウインドウに合わせる表示と、クリックした位置を中心にした実際のサイズを切り替えます。
- **回転** ボタンで 90 度ずつ回します。回るのは表示だけで、ファイルはそのままです。
- キー：**+** と **-** で拡大・縮小、**0** で実際のサイズ、**F** でウインドウに合わせる、**R** で回転。
- SVG では **ソース** でコードを表示して読んだりコピーしたりでき、**画像** で戻ります。SVG は画像として表示するので、中のスクリプトは動きません。
- ファイルが見つからない、または画像でないときは、空のタブではなくその旨を表示します。

## 権限

権限は求めません。開いたファイルだけを読みます。

## 更新履歴

- **0.2.6** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name. After switching to another tab and back, a picture keeps where it was scrolled as well as its zoom.
- **0.2.5** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.2.4** - A turned and zoomed picture now scrolls to every edge, and a sideways picture fits the window. Zoom and turn are kept when the panel moves, a fourth turn no longer spins back, and the bar fits a narrow panel.
- **0.2.3** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the picture, not the document behind it. Its bar keeps Textus's one order: what it shows, then find and zoom.
- **0.2.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - Textus's own buttons and tab bar; labels follow the interface language when it changes
- **0.1.3** - colors from Textus 1.3's themes
- **0.1.2** - the percentage switches between fit and actual size
- **0.1.0-0.1.1** - first versions: zoom, fit, drag, rotate, keys, an SVG's source, and a message for a file that can't be opened
