# Дополнение LaTeX

Подсказывает команды LaTeX, пока вы набираете формулу.

- В формуле (между `$ … $` или в блоке формул) наберите обратную косую черту и начало команды, например `\fr` или `\alp`. Одна обратная косая черта покажет самые частые команды.
- Список показывает подходящие команды, каждую с тем, что она рисует: больше 200, от `\frac` до `\begin{pmatrix}`. Сначала идут команды, которые начинаются с набранного, затем те, что его содержат; регистр не важен.
- Команду находят и буквы по порядку: `\rarr` — это `\rightarrow`, `\lra` — `\leftrightarrow`.
- **Enter** или **Tab** вписывает выбранную команду, курсор оказывается в её фигурных скобках; **Esc** закрывает список. `\left(`, `\left[` и `\left\{` вставляются вместе с парным `\right`.

Работает на компьютере и на iPhone, нужен Textus 1.3.0 или новее. Плагин просит одно разрешение — чтение редактора, чтобы видеть, что вы набираете в формуле.

## Изменения

- **0.1.6** - Its page no longer says which devices it runs on: the store shows that.
- **0.1.5** - The store description now opens with what the plugin does.
- **0.1.4** - A command typed out whole comes first, so Enter keeps it (\in stays \in); a command without braces is written with a space after it; with Textus 1.3.13 the list closes once a command is written.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Says where it runs: desktop and iPhone.
- **0.1.0-0.1.1** - First versions: over 200 commands with what each draws, letters in order, braces and caret in place, growing bracket pairs; store page and icon.
