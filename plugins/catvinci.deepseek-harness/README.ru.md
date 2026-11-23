# DeepSeek Harness

Разговаривайте в Textus AI с DeepSeek Harness, собственным агентом DeepSeek. Он читает открытую папку, пишет и правит ваши заметки и спрашивает перед каждым изменением: Textus показывает, что он хочет сделать, а вы разрешаете или нет. Всё, что он изменил, отмечено в документе и отменяется одним действием.

1. Установите [Node.js](https://nodejs.org) 24.9 или новее, если его нет на этом компьютере.
2. Один раз дайте ему ваш ключ DeepSeek API: выполните в терминале `npx -y @deepseek-ai/dsh@0.2.2-rc.1 web` и добавьте ключ на его странице Models.
3. Нажмите кнопку DeepSeek Harness в правом верхнем углу окна, рядом с кнопкой Textus AI.

Textus запускает [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) командой `dsh --profile acp` — это его сервер Agent Client Protocol — с помощью `npx`. Ключ и расход относятся к DeepSeek; Textus не хранит для него ключ. DeepSeek Harness — предварительная версия, и его поведение может меняться.

Textus запускает его в песочнице только для чтения: он свободно читает и ищет, а перед тем как записать файл или выполнить команду, которая что-то меняет, спрашивает.

По умолчанию DeepSeek Harness отправляет журналы сеансов в DeepSeek; это выключается в `dsh web`, в Settings › General. Отчёты об использовании Textus выключает сам.

Нужен Textus 1.4.3 или новее. Плагин просит одно разрешение — запускать этого агента на этом компьютере.

## Изменения

- **0.1.3** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.2** - Asks before writing files or running commands that change things (before, it did both without asking). Usage reports off, and the setup names the exact version and Node.js 24.9. Needs Textus 1.4.3.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: DeepSeek Harness in Textus AI.
