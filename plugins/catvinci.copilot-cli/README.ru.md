# GitHub Copilot CLI

Разговаривайте с GitHub Copilot CLI в Textus AI, с моделями вашей подписки Copilot. Он читает открытую папку, пишет и правит ваши заметки и спрашивает перед каждым изменением: Textus показывает, что он хочет сделать, а вы разрешаете или нет. Всё, что он изменил, отмечено в документе и отменяется одним действием. Его режим (agent, plan, autopilot), модель и переключатель «allow all» находятся в меню рядом с меню моделей Textus AI; «allow all» сначала выключен.

1. Установите [Node.js](https://nodejs.org), если его нет на этом компьютере. Нужна подписка GitHub Copilot.
2. Один раз в терминале: `npx @github/copilot login`.
3. Нажмите кнопку GitHub Copilot CLI в правом верхнем углу окна, рядом с кнопкой Textus AI.

Textus запускает [GitHub Copilot CLI](https://github.com/github/copilot-cli) командой `copilot --acp` — это его сервер Agent Client Protocol — с помощью `npx`. Copilot CLI — собственная программа GitHub со своей лицензией; аккаунт и расход относятся к GitHub, а Textus не хранит для него токен.

Autopilot работает дальше сам и тратит больше премиум-запросов. Textus сохраняет ту версию, которую запускает: здесь Copilot не обновляется сам.

Нужен Textus 1.4.3 или новее. Плагин просит одно разрешение — запускать этого агента на этом компьютере.

## Изменения

- **0.1.2** - A simpler icon, drawn in the text colour.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: GitHub Copilot CLI in Textus AI.
