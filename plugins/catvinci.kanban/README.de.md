# Aufgaben-Board

Planen Sie Arbeit als Karten in Listen auf einem Board, das als einfache Markdown-Datei gespeichert wird.

- **Plugins › Neues Aufgaben-Board…** fragt nach einem Namen und legt _Name_.md im geöffneten Ordner an, mit `kanban-plugin: board` im Front Matter und drei Listen: Zu erledigen, In Arbeit und Erledigt. Gibt es schon ein Board mit diesem Namen, öffnet sich dieses.
- Jede .md-Datei mit `kanban-plugin` im Front Matter öffnet sich als Board. So speichert auch Obsidians Kanban-Plugin seine Boards, daher öffnet jede App die Boards der anderen. Ältere Boards namens _Name_.kanban.md öffnen sich weiterhin als Board.
- Jede Liste ist eine Überschrift in der Datei und jede Karte eine Aufgabe darunter, so bleibt das Board überall lesbar.

## Auf dem Board

- **Karte hinzufügen** am Ende einer Liste. Klicken Sie auf den Text einer Karte, um ihn zu bearbeiten, haken Sie ihr Kästchen ab, wenn sie erledigt ist, und entfernen Sie sie mit ihrer ×-Schaltfläche.
- **Liste hinzufügen** legt eine neue Liste an. Ein Klick auf den Titel einer Liste benennt sie um; eine leere Liste lässt sich entfernen.
- Ziehen Sie Karten innerhalb einer Liste oder in eine andere, und eine Liste an ihrem Kopf, um die Reihenfolge zu ändern. Die anderen machen beim Ziehen Platz.
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

- **0.4.5** - Eine gezogene Karte oder Liste bleibt direkt unter dem Zeiger und hebt sich wie alles, was in Textus gezogen wird. Leisten, Listen und Steuerelemente sind jetzt die von Textus, wachsen mit der Oberfläche und folgen jedem Theme; braucht Textus 1.3.12.
- **0.4.4** - Beim Ziehen einer Karte oder Liste wird unterwegs kein Text mehr markiert.
- **0.4.3** - Seine Seite sagt jetzt in einem Satz, was es tut, was es kann und was sich in jeder Version geändert hat.
- **0.4.2** - Karten und Listen folgen beim Ziehen dem Zeiger, die anderen machen Platz. Benötigt Textus 1.3.10.
- **0.4.1** - Behält die Markierung, die Obsidians Kanban an eine Erledigt-Liste setzt.
- **0.4.0** - Heißt jetzt Aufgaben-Board (vorher Kanban). Neue Boards sind einfache .md-Dateien mit `kanban-plugin` im Front Matter, wie Obsidian sie schreibt; .kanban.md-Boards öffnen sich weiterhin.
- **0.3.1** - Textus AI unterscheidet Boards von Aufgaben in Dokumenten.
- **0.3.0** - Textus AI kann Boards auflisten und lesen, Karten hinzufügen und verschieben.
- **0.2.0** - Textus' eigene Bedienelemente und Menüs.
- **0.1.0-0.1.3** - Erste Versionen: Boards als Markdown, Karten zwischen Listen ziehen, Listen am Kopf verschieben, [[Links]], die Notizen öffnen, Als Markdown bearbeiten, Änderungen von anderswo sofort sichtbar, Obsidians Einstellungen bleiben erhalten.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_boards`: Listet die Kanban-Boards (Dateien kanban-plugin .md) im geöffneten Ordner auf, jedes mit seinen Listen und deren Kartenzahl.
- `read_board`: Liest ein Kanban-Board: seine Listen der Reihe nach, jede mit dem Text ihrer Karten und ob sie erledigt sind. Aufgaben in gewöhnlichen Dokumenten: list_tasks.
- `add_card`: Fügt am Ende einer Liste eines Kanban-Boards eine Karte hinzu. Nur für ein Board (kanban-plugin .md); eine Aufgabe in einem Dokument ist add_task.
- `move_card`: Verschiebt eine Karte eines Kanban-Boards in eine andere Liste oder an eine andere Stelle ihrer eigenen.
<!-- /ai-tools -->
