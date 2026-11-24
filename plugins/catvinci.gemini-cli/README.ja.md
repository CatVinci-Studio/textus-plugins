# Gemini CLI

Textus AI で Gemini CLI と話せます。使うのは Google の Gemini モデルです。開いているフォルダを読み、ノートを書いて直し、変更の前には毎回確認します。Textus がしようとしていることを示し、あなたが許可するかどうかを決めます。変えたところは文書に印が付き、一度の取り消しで戻せます。モード（先に確認、編集を承認、すべて承認、計画）とモデルは、Textus AI のモデルメニューの隣のメニューにあります。

1. このコンピュータに [Node.js](https://nodejs.org) がなければ入れます。
2. ウインドウ右上、Textus AI のボタンの隣にある Gemini CLI のボタンをクリックします。初回はブラウザが開き、Google アカウントでサインインします。Gemini API キーや Vertex AI を使う場合は、ターミナルで一度 `npx @google/gemini-cli` を実行し、`/auth` で選びます（Dock から開いた Textus には、ターミナルで設定した変数が見えません）。

Textus は [Gemini CLI](https://github.com/google-gemini/gemini-cli) を、その Agent Client Protocol サーバーである `gemini --acp` で、`npx` を使って起動します。アカウントと利用量は Google のもので、Textus はそのためのキーを保存しません。

編集を承認とすべて承認は、Gemini CLI 自身で信頼したフォルダでだけ使えます。それ以外では先に確認のままです。

Textus 1.4.3 以降が必要です。求める権限は一つだけで、このコンピュータでこのエージェントを起動するためのものです。

## 更新履歴

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Gemini CLI in Textus AI.
