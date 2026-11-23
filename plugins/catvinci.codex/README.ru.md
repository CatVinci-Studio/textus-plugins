# Codex

Разговаривайте с Codex в Textus AI. Он читает открытую папку, пишет и правит ваши заметки и спрашивает перед каждым изменением: Textus показывает, что он хочет сделать, а вы разрешаете или нет. Всё, что он изменил, отмечено в документе и отменяется одним действием.

1. Установите [Node.js](https://nodejs.org), если его нет на этом компьютере.
2. В первый раз откроется браузер для входа через ChatGPT; или войдите один раз в терминале: `npx -y @agentclientprotocol/codex-acp@2.6.0 cli login`.
3. Нажмите кнопку Codex в правом верхнем углу окна, рядом с кнопкой Textus AI, или выберите **Codex** в меню моделей Textus AI.

Textus запускает Codex от OpenAI через адаптер Agent Client Protocol `@agentclientprotocol/codex-acp` с помощью `npx`. Аккаунт и расход — это ваш аккаунт и расход в Codex; Textus не хранит для него ключ.

Он начинает в режиме **Read-only**, который спрашивает перед каждой правкой и командой; другой режим выбирается в меню рядом с моделью.

Нужен Textus 1.4.3 или новее. Плагин просит одно разрешение — запускать этого агента на этом компьютере.

## Изменения

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Signs in with ChatGPT in the browser (before, it tried an API key and stopped there), and starts in Read-only. Needs Textus 1.4.3, which also marks the changes Codex writes itself.
- **0.1.2** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Codex answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Codex in Textus AI.
