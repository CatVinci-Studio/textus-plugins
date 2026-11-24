# Папки Logseq

Открывает граф Logseq так, как его пишет Logseq: ссылки по имени страницы, картинки в assets, журналы в своей папке и в своём формате даты.

## Что он делает

- Если открытая папка или папка выше неё — граф Logseq, который хранится в файлах (в нём есть `logseq/config.edn`), Textus пишет ссылки по имени страницы (`[[Page]]`), кладёт страницы, созданные из ссылки, в `pages/` (или в ваш `:pages-directory`), а Календарь и ежедневные заметки хранит журналы в `journals/` с именами по вашему `:journal/file-name-format`.
- Папку для картинок Logseq, `assets/`, предложат один раз на карточке в углу. Согласитесь — и выбор сохранится в `.textus/settings.json` папки; оставьте свою — и Textus больше не спросит.
- Вики-ссылки в графе находятся от папки графа и без этого плагина.

## Разрешения

Плагин просит только **чтение файлов открытой папки**: Textus передаёт ему `logseq/config.edn`, а он объясняет, что значит этот файл. Он ничего не меняет.

## Изменения

- **0.1.2** - A simpler icon, drawn in the text colour.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it.
- **0.1.0** - First version: Logseq's settings offered when a Logseq graph is opened. Needs Textus 1.4.6.
