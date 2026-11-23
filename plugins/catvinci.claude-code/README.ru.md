# Claude Code

Разговаривайте с Claude Code в Textus AI. Он читает открытую папку, пишет и правит ваши заметки и спрашивает перед каждым изменением: Textus показывает, что он хочет сделать, а вы разрешаете или нет. Всё, что он изменил, отмечено в документе и отменяется одним действием.

1. Установите [Node.js](https://nodejs.org), если его нет на этом компьютере.
2. Один раз войдите в Claude Code в терминале: `npx -y @agentclientprotocol/claude-agent-acp@0.107.0 --cli auth login --claudeai` (или запустите `claude`, если он установлен).
3. Нажмите кнопку Claude Code в правом верхнем углу окна, рядом с кнопкой Textus AI, или выберите **Claude Code** в меню моделей Textus AI.

Textus запускает Claude Code от Anthropic через адаптер Agent Client Protocol `@agentclientprotocol/claude-agent-acp` с помощью `npx`. Аккаунт и расход — это ваш аккаунт и расход в Claude Code; Textus не хранит для него ключ.

Он начинает в режиме Claude Code **Manual**, который спрашивает перед каждой правкой и командой; другой режим выбирается в меню рядом с моделью. Чтобы работать через OpenRouter, укажите `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN` и пустой `ANTHROPIC_API_KEY` в блоке `env` файла `~/.claude/settings.json`: Textus, открытый из Dock, не видит переменные, заданные в терминале.

Нужен Textus 1.4.3 или новее. Плагин просит одно разрешение — запускать этого агента на этом компьютере.

## Изменения

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Starts in Manual mode, named by the plugin; its sign-in command needs no separate Claude Code install. Needs Textus 1.4.3, which also marks the changes Claude Code writes itself.
- **0.1.2** - Uses Claude Code's ACP adapter 0.107.0. Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Claude Code answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Claude Code in Textus AI.
