# Картинки рядом с документом

Складывает картинки каждого документа в папку рядом с ним, названную так же, как это делают Typora и VS Code: картинки `Note.md` лежат в `Note.assets/`.

Включать и настраивать ничего не нужно: после установки всё работает само.

- Вставьте или перетащите картинку в сохранённый документ. Textus сначала сохраняет картинку, затем плагин переносит её в папку документа и меняет ссылку на `Note.assets/картинка.png`. Если имя уже занято, к нему добавляется номер; ничего не перезаписывается. Если ссылку изменить не удалось, картинка возвращается на место.
- Переименуйте документ в его папке — папка с картинками переименуется вместе с ним, со ссылками. Исключение: если в эту папку ссылается ещё какой-то документ, обе остаются как были.
- Картинки, которые уже есть в документах, остаются на своих местах.
- В хранилище Obsidian с заданной папкой для вложений и в графе Logseq картинки остаются там, куда их кладёт это приложение.

Работает с картинками PNG, JPEG, GIF, WebP, AVIF, BMP, SVG, ICO, HEIC и TIFF. Работает на компьютере, нужен Textus 1.3.0 или новее. Плагин просит доступ на чтение и запись файлов, чтобы переносить картинки и переименовывать папки, и на чтение и правку открытого документа, чтобы менять ссылку на перенесённую картинку.

## Изменения

- **0.1.8** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.0.
- **0.1.7** - The store description now opens with what the plugin does.
- **0.1.6** - Adding many pictures at once (a sync, a folder copied in) no longer reads the open document over and over.
- **0.1.5** - In an Obsidian vault, pictures stay where the vault's attachment setting puts them again: the setting is read through Textus.
- **0.1.4** - Leaves pictures where a document's Typora image folder setting puts them, and no longer moves a folder while some links to it may still be unchecked.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Leaves pictures where an Obsidian vault's attachment folder setting or a Logseq graph puts them.
- **0.1.1** - A shorter name: Images Follow Document.
- **0.1.0** - First version: pasted and dropped pictures move into `Note.assets/`, and the folder follows a renamed document.
