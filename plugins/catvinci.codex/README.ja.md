# Codex

Textus AI で Codex と話せます。開いているフォルダを読み、ノートを書いて直し、変更の前には毎回確認します。Textus がしようとしていることを示し、あなたが許可するかどうかを決めます。変えたところは文書に印が付き、一度の取り消しで戻せます。

1. このコンピュータに [Node.js](https://nodejs.org) がなければ入れます。
2. 初回はブラウザが開き、ChatGPT でサインインします。ターミナルで一度サインインしても構いません：`npx -y @agentclientprotocol/codex-acp@2.6.0 cli login`。
3. ウインドウ右上、Textus AI のボタンの隣にある Codex のボタンをクリックするか、Textus AI のモデルメニューで **Codex** を選びます。

Textus は OpenAI の Codex を、Agent Client Protocol のアダプター `@agentclientprotocol/codex-acp` を通して `npx` で起動します。アカウントと利用量は Codex のもので、Textus はそのためのキーを保存しません。

最初は **Read-only** で始まります。編集やコマンドの前に毎回確認するモードです。別のモードはモデルの隣のメニューで選べます。

Textus 1.4.3 以降が必要です。求める権限は一つだけで、このコンピュータでこのエージェントを起動するためのものです。

## 更新履歴

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Signs in with ChatGPT in the browser (before, it tried an API key and stopped there), and starts in Read-only. Needs Textus 1.4.3, which also marks the changes Codex writes itself.
- **0.1.2** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Codex answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Codex in Textus AI.
