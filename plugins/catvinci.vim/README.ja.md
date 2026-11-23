# Vim

Textus のエディタで Vim のモードとキーを使えます。

- **プラグイン › Vim キーのオン・オフ** で切り替えます。オンのあいだはステータスバーにモード（NORMAL、INSERT、VISUAL、V-LINE）が出て、そのメニューから Vim をオフにできます。
- ノーマル・挿入・ビジュアル・ビジュアル行の各モード。モーション（**h j k l**、**w b e**、**0 ^ $**、**gg G**、**f t F T** と **;**・**,**、**Ctrl+D** と **Ctrl+U**）、オペレータ（**d c y**、**dd**、**x**、**p P**、**r**、**iw**／**aw**）、カウント、レジスタ、**u** と **Ctrl+R** で取り消しとやり直し、**.** で繰り返し。
- 1 行とは段落・見出し・リスト項目、またはコードブロックの 1 行のことです。**j** と **k** でそのすべてを移動し、**}** と **{** でブロック単位に移動します。**zz**・**zt**・**zb** でカーソル行をウィンドウの中央・上端・下端に移します。
- **~** でカーソル位置の大文字・小文字を切り替えます。ビジュアルモードでは **~**・**U**・**u** で選択範囲を切り替え・大文字化・小文字化します。
- **s** と一文字、続けてラベルを押すと、画面のどこへでも移動できます（flash）。近い場所ほど先にラベルが付きます。**s** の前に **d**・**c**・**y** を押すと、そこまでを削除・変更・コピーします。
- **:** でコマンドパレットが開き、Vim のコマンドが先頭に並びます。**:w** で保存、**:q** でタブを閉じる、**:wq** で両方、**:12** で 12 行目へ、**:u** と **:redo** で取り消しとやり直し。Textus のほかのコマンドもここで探せます。
- Mac ではノーマルモードのあいだ英字入力になるので、日本語入力などの入力方式がキーを横取りしません。挿入モードに戻ると元の入力方式に戻ります。

設定は **設定 › 拡張機能 › プラグイン › Vim** にあります：

- **s でジャンプ（flash）**：既定でオン。オフにすると、**s** は Vim 本来の動作（1 文字消して挿入）になります。
- **挿入モードを抜けるキー**：挿入モードで素早く続けて打つと Escape になる 2 文字（例：`jk`）。空なら Escape と **Ctrl+[** だけです。
- **キーマッピング**：vimrc と同じ書き方で 1 行ずつ（`map`、`noremap`、`nnoremap`、`inoremap`、`vnoremap`、`let mapleader`）。例：`inoremap jj <Esc>`、`nnoremap <leader>w :w<CR>`。

Obsidian：Obsidian の保管庫では、その `.obsidian.vimrc`（Vimrc Support プラグインのファイル）も、自分の設定の後に読み込みます。ファイルが変われば読み直します。保管庫の中のフォルダではなく、保管庫そのものを開いてください。

このプラグインは、エディタでキーを受け取る権限（Vim のキーを動かすため）と、ファイルを読む権限（`.obsidian.vimrc` を読むためだけ）を求めます。デスクトップで使えます。

## 更新履歴

- **0.2.10** - Its page no longer says which devices it runs on: the store shows that.
- **0.2.9** - Needs Textus 1.3.0-beta.8 or later, the first with everything it uses.
- **0.2.8** - Desktop only: a phone's on-screen keyboard types its letters into the text instead of running them as Vim keys.
- **0.2.7** - The status bar's mode opens a menu that turns Vim off; `.obsidian.vimrc` is read again when you come back to Textus; leaving visual mode with **:** always works.
- **0.2.6** - Shorter help and empty-state text.
- **0.2.5** - Its code is split into smaller files by what each part does; nothing changes in use.
- **0.2.4** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.3** - Reads an Obsidian vault's `.obsidian.vimrc`; mapping the same keys again replaces the earlier mapping.
- **0.2.2** - **zz**, **zt** and **zb** bring the caret's line to the middle, top or bottom of the window.
- **0.2.1** - Says where it runs: the desktop, iPhone and iPad.
- **0.2.0** - **:** opens the command palette with Vim's commands first; flash shows its labels after one letter; normal mode types Roman on a Mac.
- **0.1.0-0.1.1** - First versions: modes, motions, operators, counts, dot repeat, flash with **ds**, **cs** and **ys**, the command line (**:w**, **:q**, **:wq**, **:12**), vimrc key mappings and the case keys.
