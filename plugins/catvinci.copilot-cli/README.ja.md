# GitHub Copilot CLI

Textus AI で GitHub Copilot CLI と話せます。使うのは Copilot プランのモデルです。開いているフォルダを読み、ノートを書いて直し、変更の前には毎回確認します。Textus がしようとしていることを示し、あなたが許可するかどうかを決めます。変えたところは文書に印が付き、一度の取り消しで戻せます。モード（agent、plan、autopilot）、モデル、「allow all」スイッチは、Textus AI のモデルメニューの隣のメニューにあります。「allow all」は最初はオフです。

1. このコンピュータに [Node.js](https://nodejs.org) がなければ入れます。GitHub Copilot のプランが必要です。
2. ターミナルで一度：`npx @github/copilot login`。
3. ウインドウ右上、Textus AI のボタンの隣にある GitHub Copilot CLI のボタンをクリックします。

Textus は [GitHub Copilot CLI](https://github.com/github/copilot-cli) を、その Agent Client Protocol サーバーである `copilot --acp` で、`npx` を使って起動します。Copilot CLI は GitHub 自身のソフトウェアで、独自のライセンスに従います。アカウントと利用量は GitHub のもので、Textus はそのためのトークンを保存しません。

Autopilot は自分で作業を進め続けるので、プレミアムリクエストを多く使います。Textus は起動するバージョンを固定しています。ここでは Copilot は自分で更新しません。

Textus 1.4.3 以降が必要です。求める権限は一つだけで、このコンピュータでこのエージェントを起動するためのものです。

## 更新履歴

- **0.1.2** - A simpler icon, drawn in the text colour.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: GitHub Copilot CLI in Textus AI.
