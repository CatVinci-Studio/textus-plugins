# Qwen Code

Разговаривайте с Qwen Code в Textus AI, с моделями Qwen от Alibaba. Он читает открытую папку, пишет и правит ваши заметки и спрашивает перед каждым изменением: Textus показывает, что он хочет сделать, а вы разрешаете или нет. Всё, что он изменил, отмечено в документе и отменяется одним действием. Его режим (сначала спрашивать, принимать правки, решать самому, принимать всё, план), модель и размышление находятся в меню рядом с меню моделей Textus AI.

1. Установите [Node.js](https://nodejs.org) 22 или новее, если его нет на этом компьютере.
2. Один раз дайте ему ключ API: укажите `OPENAI_API_KEY`, `OPENAI_BASE_URL` и `OPENAI_MODEL` в `~/.qwen/.env` (для OpenRouter базовый адрес — `https://openrouter.ai/api/v1`) или выполните в терминале `npx @qwen-code/qwen-code` и воспользуйтесь `/auth` (Alibaba Cloud Model Studio или любой сервис, совместимый с OpenAI).
3. Нажмите кнопку Qwen Code в правом верхнем углу окна, рядом с кнопкой Textus AI.

Textus запускает [Qwen Code](https://github.com/QwenLM/qwen-code) командой `qwen --acp` — это его сервер Agent Client Protocol — с помощью `npx`. Ключ и расход относятся к вашему провайдеру; Textus не хранит для него ключ.

Он начинает в режиме «сначала спрашивать». Выбор «Always allow» для команд Qwen Code сохраняет навсегда — в проекте или для вас.

Нужен Textus 1.4.3 или новее. Плагин просит одно разрешение — запускать этого агента на этом компьютере.

## Изменения

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Qwen Code in Textus AI.
