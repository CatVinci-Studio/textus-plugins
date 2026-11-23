# Aufgaben-Board

Planen Sie Arbeit als Karten in Listen auf einem Board, das als einfache Markdown-Datei gespeichert wird.

- **Plugins › Neues Aufgaben-Board…** fragt nach einem Namen und legt _Name_.md im geöffneten Ordner an, mit `kanban-plugin: board` im Front Matter und drei Listen: Zu erledigen, In Arbeit und Erledigt. Gibt es schon ein Board mit diesem Namen, öffnet sich dieses.
- Jede .md-Datei mit `kanban-plugin` im Front Matter öffnet sich als Board. So speichert auch Obsidians Kanban-Plugin seine Boards, daher öffnet jede App die Boards der anderen. Ältere Boards namens _Name_.kanban.md öffnen sich weiterhin als Board.
- Jede Liste ist eine Überschrift in der Datei und jede Karte eine Aufgabe darunter, so bleibt das Board überall lesbar.

## Auf dem Board

- **Karte hinzufügen** am Ende einer Liste. Klicken Sie auf den Text einer Karte, um ihn zu bearbeiten, und haken Sie ihr Kästchen ab, wenn sie erledigt ist. Ihre ⋯-Schaltfläche (oder ein Rechtsklick) verschiebt sie in eine andere Liste oder löscht sie; Rückgängig in der folgenden Meldung holt sie zurück.
- **Liste hinzufügen** legt eine neue Liste an, deren Name gleich eingegeben wird. Ein Klick auf den Titel einer Liste benennt sie um; eine leere Liste lässt sich über ihr ⋯-Menü löschen.
- Auf dem Telefon füllt jede Liste den Bildschirm: Wischen Sie zur nächsten.
- Ziehen Sie Karten innerhalb einer Liste oder in eine andere, und eine Liste an ihrem Kopf, um die Reihenfolge zu ändern. Die anderen machen beim Ziehen Platz. Auf einem Touchscreen halten Sie eine Karte kurz fest und ziehen sie dann; am Bildschirmrand eines Telefons blättert das Board zur nächsten Liste. Festgehalten und ohne Bewegung losgelassen, öffnet eine Karte ihr Menü.
- Schreiben Sie einen [[Link]] in eine Karte und klicken Sie darauf, um diese Notiz zu öffnen.
- **Als Markdown bearbeiten** öffnet die Datei als Text. Das Board folgt Änderungen, die dort oder anderswo gemacht werden.
- Was Obsidians Kanban außer den Listen in der Datei ablegt, etwa seine Einstellungen und die Markierung seiner Erledigt-Liste, bleibt, wie es geschrieben ist.

```markdown
---
kanban-plugin: board
---

## Zu erledigen

- [ ] Gliederung schreiben

## Erledigt

- [x] Titel wählen
```

## Berechtigungen

- Dateien lesen und schreiben: um Boards zu öffnen und zu speichern.
- Werkzeuge für Textus AI: damit Textus AI Boards finden und lesen, Karten hinzufügen und verschieben kann.

## Änderungen

- **0.4.14** - On a phone or tablet, hold a card a moment to drag it within a list or to another; at the screen's edge on a phone the board turns to the next list, and the page no longer scrolls under the card. Held and let go without moving, a card opens its menu. Dragged near the board's edge, the board scrolls, and a card let go below a short list goes into that list. Its page receives Textus's messages by the API's current name.
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
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_boards`: Listet die Kanban-Boards (Dateien kanban-plugin .md) im geöffneten Ordner auf, jedes mit seinen Listen und deren Kartenzahl.
- `read_board`: Liest ein Kanban-Board: seine Listen der Reihe nach, jede mit dem Text ihrer Karten und ob sie erledigt sind. Aufgaben in gewöhnlichen Dokumenten: list_tasks.
- `add_card`: Fügt am Ende einer Liste eines Kanban-Boards eine Karte hinzu. Nur für ein Board (kanban-plugin .md); eine Aufgabe in einem Dokument ist add_task.
- `move_card`: Verschiebt eine Karte eines Kanban-Boards in eine andere Liste oder an eine andere Stelle ihrer eigenen.
<!-- /ai-tools -->
