# LaTeX 補完

数式を書いているときに LaTeX のコマンドを候補に出します。

- 数式の中（`$ … $` の間や数式ブロック）で、バックスラッシュとコマンドの書き始めを入力します。たとえば `\fr`、`\alp`。バックスラッシュだけなら、よく使うコマンドが並びます。
- 一覧には合うコマンドが、それぞれの描画結果とともに出ます。`\frac` から `\begin{pmatrix}` まで 200 以上あります。入力した文字で始まるものが先、それを含むものが後で、大文字・小文字は区別しません。
- 文字を順に拾っても見つかります。`\rarr` は `\rightarrow`、`\lra` は `\leftrightarrow` です。
- **Enter** か **Tab** で選んだコマンドを書き、カーソルは波かっこの中に置かれます。**Esc** で一覧を閉じます。`\left(`、`\left[`、`\left\{` は対になる `\right` も一緒に入ります。

Textus 1.3.0 以降が必要です。求める権限は「エディタの読み取り」の一つだけで、数式に入力した文字を見るためのものです。

## 更新履歴

- **0.1.6** - Its page no longer says which devices it runs on: the store shows that.
- **0.1.5** - The store description now opens with what the plugin does.
- **0.1.4** - A command typed out whole comes first, so Enter keeps it (\in stays \in); a command without braces is written with a space after it; with Textus 1.3.13 the list closes once a command is written.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Says where it runs: desktop and iPhone.
- **0.1.0-0.1.1** - First versions: over 200 commands with what each draws, letters in order, braces and caret in place, growing bracket pairs; store page and icon.
