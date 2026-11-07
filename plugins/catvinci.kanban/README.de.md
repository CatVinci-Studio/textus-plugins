# Aufgaben-Board

Boards aus Karten in Listen, gespeichert als einfache Markdown-Datei.

- **Plugins › Neues Aufgaben-Board…** legt eines an: _Name_.md mit `kanban-plugin: board` im Front Matter, das Format von Obsidians Kanban, sodass beide die Boards des anderen öffnen. Ältere Boards _Name_.kanban.md öffnen sich weiter als Board.
- Jede Liste ist eine Überschrift in der Datei und jede Karte eine Aufgabe darunter, sodass das Board überall lesbar bleibt.
- Füge unten in einer Liste eine Karte hinzu; ziehe Karten zwischen Listen und Listen, um sie umzusortieren. Eine abgehakte Karte ist erledigt.
- Schreibe einen [[Link]] in eine Karte und klicke darauf, um die Notiz zu öffnen.
- **Als Markdown bearbeiten** öffnet die Datei als Text; das Board übernimmt Ihre Änderungen.

```markdown
## Zu erledigen

- [ ] Gliederung schreiben

## Erledigt

- [x] Titel wählen
```

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_boards`: Listet die Kanban-Boards (Dateien kanban-plugin .md) im geöffneten Ordner auf, jedes mit seinen Listen und deren Kartenzahl.
- `read_board`: Liest ein Kanban-Board: seine Listen der Reihe nach, jede mit dem Text ihrer Karten und ob sie erledigt sind. Aufgaben in gewöhnlichen Dokumenten: list_tasks.
- `add_card`: Fügt am Ende einer Liste eines Kanban-Boards eine Karte hinzu. Nur für ein Board (kanban-plugin .md); eine Aufgabe in einem Dokument ist add_task.
- `move_card`: Verschiebt eine Karte eines Kanban-Boards in eine andere Liste oder an eine andere Stelle ihrer eigenen.
<!-- /ai-tools -->
