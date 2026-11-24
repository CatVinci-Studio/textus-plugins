# タスクボード

作業をボード上のリストとカードで整理します。ボードはふつうの Markdown ファイルとして保存されます。

- **プラグイン › 新しいタスクボード…** で名前を入力すると、開いているフォルダに _名前_.md を作ります。front matter には `kanban-plugin: board` が入り、「やること」「進行中」「完了」の 3 つのリストが用意されます。同じ名前のボードがすでにあれば、それを開きます。
- front matter に `kanban-plugin` がある .md ファイルは、どれもボードとして開きます。Obsidian の Kanban プラグインも同じ形でボードを保存するので、互いのボードを開けます。以前の _名前_.kanban.md という名前のボードもそのまま開けます。
- リストはファイル内の見出し、カードはその下のタスクなので、どこで開いても読めます。

## ボードでの操作

- リストの下の **カードを追加** でカードを足します。カードの文字をクリックすると編集、チェックボックスで完了です。カードの ⋯ ボタン（または右クリック）で別のリストへ移動したり削除したりでき、削除後の通知の「元に戻す」で戻せます。
- **リストを追加** で新しいリストを作り、そのまま名前を入力します。リストのタイトルをクリックすると名前を変えられ、空のリストは ⋯ メニューから削除できます。
- スマートフォンでは 1 つのリストが画面いっぱいに表示され、スワイプで次のリストに移ります。
- カードはリスト内でもリスト間でもドラッグでき、リストは見出し部分をドラッグして並べ替えます。ドラッグ中はほかのカードやリストが場所を空けます。タッチ画面ではカードを少し押さえてからドラッグします。スマートフォンで画面の端まで持っていくと、ボードが次のリストへめくれます。押さえたまま動かさずに離すと、カードのメニューが開きます。
- カードに [[リンク]] を書くと、クリックでそのノートを開きます。
- **Markdown として編集** でファイルをテキストとして開きます。そこでの変更もほかの場所での変更も、ボードにすぐ反映されます。
- Obsidian の Kanban がリスト以外にファイルへ書く内容（設定や完了リストの印など）は、そのまま残します。

```markdown
---
kanban-plugin: board
---

## やること

- [ ] 構成を書く

## 完了

- [x] タイトルを決める
```

## 権限

- ファイルの読み書き：ボードを開いて保存するため。
- Textus AI のツール：Textus AI がボードを探して読み、カードを追加・移動できるように。

## 更新履歴

- **0.4.14** - On a phone or tablet, hold a card a moment to drag it within a list or to another; at the screen's edge on a phone the board turns to the next list, and the page no longer scrolls under the card. Held and let go without moving, a card opens its menu. Dragged near the board's edge, the board scrolls, and a card let go below a short list goes into that list.
- **0.4.13** - A card's ⋯ menu (or a right-click) moves it to another list or deletes it, with Undo, instead of an × that deleted at once - always showing on a touch screen. A new list starts with its name being written. On a phone a list fills the screen and a swipe settles on the next; in a narrow tab, Edit as Markdown goes into the ⋯ menu.
- **0.4.12** - Cards and lists make way at the pace of the rest of Textus.
- **0.4.11** - A list dragged by its head lifts and slides along the board as Textus's own tabs do; Esc puts it back.
- **0.4.10** - A card's checkbox sits on the middle of its first line at any text size.
- **0.4.9** - Right-clicking a card or list name while you edit it (to paste) no longer ends the edit, and an input method's Enter on iPhone and iPad picks its words instead of saving. The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.4.8** - A board with Windows (CRLF) line endings keeps them, and a board changed while you edit (saved as Markdown in Textus, or by a plugin) shows that change instead of writing over it, and says so. The store description now opens with what the plugin does.
- **0.4.7** - A blank line inside a card no longer splits it, and Escape no longer leaves an empty card. The AI leaves ordinary notes alone, and the board fits narrow panels.
- **0.4.6** - The board fades at its edges where lists run past the window.
- **0.4.5** - A dragged card or list stays right under the pointer and lifts like everything dragged in Textus. Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.4** - Dragging a card or a list no longer selects text on the way.
- **0.4.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.2** - Cards and lists follow the pointer as you drag, the others making way. Needs Textus 1.3.10.
- **0.4.1** - Keeps the mark Obsidian's Kanban puts on a done list.
- **0.4.0** - Renamed Task Board (was Kanban). New boards are plain .md files with `kanban-plugin` in their front matter, as Obsidian writes them; .kanban.md boards still open.
- **0.3.1** - Textus AI tells boards apart from tasks written in documents.
- **0.3.0** - Textus AI can list and read boards, add cards and move them.
- **0.2.0** - Textus's own controls and menus.
- **0.1.0-0.1.3** - First versions: boards as Markdown, cards dragged between lists, lists moved by their head, [[links]] that open notes, Edit as Markdown, changes made elsewhere shown at once, Obsidian's settings kept.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `list_boards`：開いているフォルダにあるカンバンボード（kanban-plugin .md ファイル）を、それぞれのリストと各リストのカード数とともに一覧にします。
- `read_board`：カンバンボードを読みます。リストを順に、各カードの本文と完了かどうかとともに返します。普通の文書に書かれたタスクは list_tasks です。
- `add_card`：カンバンボードのリストの末尾にカードを追加します。ボード（kanban-plugin .md）専用です。文書の ToDo は add_task です。
- `move_card`：カンバンボードのカードを別のリストへ、または同じリストの別の位置へ移します。
<!-- /ai-tools -->
