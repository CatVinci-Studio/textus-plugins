# OpenCode

Разговаривайте с OpenCode в Textus AI, с той моделью, которую вы для него настроили. Он читает открытую папку, пишет и правит ваши заметки и спрашивает перед каждым изменением: Textus показывает, что он хочет сделать, а вы разрешаете или нет. Всё, что он изменил, отмечено в документе и отменяется одним действием. Чтобы он работал, не спрашивая, выберите Allow all в меню рядом с моделью (Textus 1.4.3 или новее).

1. Установите [Node.js](https://nodejs.org), если его нет на этом компьютере.
2. С бесплатными моделями OpenCode он работает сразу. Для своего провайдера (в том числе OpenRouter) один раз войдите в терминале: `npx -y opencode-ai@1.19.5 auth login`.
3. Нажмите кнопку OpenCode в правом верхнем углу окна, рядом с кнопкой Textus AI.

Textus запускает [OpenCode](https://opencode.ai) командой `opencode acp` — это его сервер Agent Client Protocol — с помощью `npx`. Аккаунты и расход — это ваши аккаунты и расход в OpenCode; Textus не хранит для него ключ.

Он спрашивает перед правками, командами и загрузкой веб-страниц; в режиме плана он ничего не правит. Его вспомогательные агенты пока выключены: OpenCode не передаёт их вопросы, и ход ждал бы ответа вечно.

Нужен Textus 1.4.3 или новее. Плагин просит одно разрешение — запускать этого агента на этом компьютере.

## Изменения

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Asks before web fetches too, plan mode no longer edits, and sub-agents are off (their questions never arrived, so a turn hung). Needs Textus 1.4.3.
- **0.1.2** - Asks before each edit and command, as it says: OpenCode on its own allowed them unasked.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: OpenCode in Textus AI.
