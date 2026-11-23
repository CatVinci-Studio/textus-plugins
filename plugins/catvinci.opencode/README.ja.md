# OpenCode

Textus AI で OpenCode と話せます。モデルは OpenCode に設定したものを使います。開いているフォルダを読み、ノートを書いたり直したりし、変更のたびに先に確認します。Textus が何をしようとしているかを見せるので、許可するかどうかを選びます。変更したところは文書に印が付き、一度の取り消しで戻せます。確認なしで作業させるには、モデルの隣のメニューで「すべて許可」を選びます（Textus 1.4.3 以降）。

1. このコンピューターに [Node.js](https://nodejs.org) がなければインストールします。
2. OpenCode の無料モデルならすぐに使えます。自分のプロバイダー（OpenRouter など）を使うには、ターミナルで一度サインインします：`npx -y opencode-ai@1.19.5 auth login`。
3. ウィンドウ右上、Textus AI のボタンの隣にある OpenCode のボタンをクリックします。

Textus は [OpenCode](https://opencode.ai) を、その Agent Client Protocol サーバーである `opencode acp` として `npx` で起動します。アカウントと使用量は OpenCode のもので、Textus はそのためのキーを保存しません。

編集、コマンド、ウェブの取得の前に確認し、プランモードでは編集しません。サブエージェントは今のところオフです。OpenCode がその質問を渡してこないため、やりとりがいつまでも止まってしまうからです。

Textus 1.4.3 以降が必要です。求める権限は 1 つだけで、このコンピューターでこのエージェントを起動するためのものです。

## 更新履歴

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Asks before web fetches too, plan mode no longer edits, and sub-agents are off (their questions never arrived, so a turn hung). Needs Textus 1.4.3.
- **0.1.2** - Asks before each edit and command, as it says: OpenCode on its own allowed them unasked.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: OpenCode in Textus AI.
