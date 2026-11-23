# Aufgaben

Sammelt alle Aufgaben Ihres Ordners in einer Liste, zum Abhaken an Ort und Stelle und für Abfragen wie in Obsidian Tasks.

- Schreiben Sie eine Aufgabe irgendwo als `- [ ] etwas zu tun`.
- Der Tab **Aufgaben** in der Seitenleiste listet die Aufgaben aller Dokumente im geöffneten Ordner, nach Dokument und unter der Überschrift, unter der jede steht.
- Haken Sie eine dort ab, oder klicken Sie darauf, um im Dokument zu ihr zu springen.
- Geben Sie einer Aufgabe ein Datum (`📅 2026-11-01`, `due:2026-11-01` oder `[due:: 2026-11-01]`), und es erscheint als Abzeichen. Überfällige oder innerhalb einer Woche fällige Aufgaben stehen oben unter **Bald fällig**.
- Das Feld oben filtert die Liste nach Wörtern, dem Namen des Dokuments oder seiner Überschrift.
- Erledigte Aufgaben sind ausgeblendet, außer Sie schalten **Erledigte Aufgaben zeigen** unter **Einstellungen › Erweiterungen › Plugins › Aufgaben** ein.
- Karten auf einem Kanban-Board (ein Dokument mit `kanban-plugin` in den Eigenschaften oder `name.kanban.md`) gehören zum Board und stehen weder in der Seitenleiste noch in Aufgabenabfragen.

## Aufgaben aus Obsidian

Aufgaben, die mit dem Obsidian-Plugin Tasks geschrieben wurden, funktionieren hier genauso:

- `[/]` ist in Arbeit und noch offen; `[-]` ist abgebrochen und damit erledigt.
- Die Felder am Ende einer Aufgabe (📅 fällig, ⏳ geplant, 🛫 Beginn, ➕ erstellt, ✅ erledigt, ❌ abgebrochen, eine Priorität 🔺 ⏫ 🔼 🔽 ⏬ und 🔁 eine Wiederholung) bleiben in der Datei und erscheinen nicht in der Liste.
- Abhaken schreibt ✅ und den Tag; Zurücknehmen entfernt das Erledigt- oder Abbruchdatum.
- Wer eine sich wiederholende Aufgabe abhakt, bekommt die nächste in der Zeile darüber, mit weitergerückten Daten. Wiederholungen wie `🔁 every day`, `every 2 weeks`, `every weekday`, `every weekend`, `every Monday`, `every month on the 15th`, `every month on the last`, `every year` und `… when done` werden verstanden.

## Aufgabenabfragen

Ein `tasks`-Codeblock listet die gefragten Aufgaben, eine Regel pro Zeile, wie in Obsidian:

````markdown
```tasks
not done
due before next week
path includes Projects
sort by due
```
````

- **Status**: `done`, `not done` und `status.type is` (`todo`, `in_progress`, `done` oder `cancelled`).
- **Daten**: `due`, `scheduled`, `starts`, `done`, `created`, `cancelled` oder `happens` mit `before`, `after`, `on`, `in`, `on or before` oder `on or after` und einem Datum: 2026-11-01, today, tomorrow, yesterday oder this, next bzw. last mit week, month oder year. Dazu `no due date` und `has due date` (ebenso für die anderen Daten).
- **Text**: `path`, `folder`, `filename`, `description` oder `heading` mit `includes` oder `does not include`; `tag includes`, `tag does not include`, `has tags` und `no tags`.
- **Sonstiges**: `priority is` (auch `above`, `below`, `not`), `is recurring` und `is not recurring`.
- **Reihenfolge**: `sort by` und `group by` (status, due, scheduled, start, done, created, priority, path, folder, filename, heading oder description, auf Wunsch mit `reverse`) und `limit`. Ohne `sort by` gilt die Reihenfolge von Obsidian Tasks: Status, Fälligkeit, Priorität, Pfad.

Zeilen zum Aussehen (`hide …`, `show …`) werden übergangen; jede andere Zeile, die nicht verstanden wird, steht unter der Anzahl. Ein [[Link]] in einer Aufgabe öffnet seine Notiz. Haken Sie dort eine Aufgabe ab, wird sie in ihrer Datei abgehakt; ein Klick springt zu ihr.

## Berechtigungen

Das Plugin liest die Dokumente des Ordners, um ihre Aufgaben zu finden, und schreibt nur in ein Dokument, um eine Aufgabe abzuhaken oder hinzuzufügen. Außerdem gibt es Textus AI die unten aufgeführten Werkzeuge.

## Änderungen

- **0.5.0** - A task query no longer lists a Kanban board's cards, as the sidebar and Textus AI already didn't. Grouped by document, its rows don't repeat the document's name, and a [[link]] in a task opens its note. Its page receives Textus's messages by the API's current name.
- **0.4.7** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.6** - The tasks block keeps a gap inside its frame, as other blocks do.
- **0.4.5** - The AI's new task under a heading never lands inside a code block, and **Move finished tasks to the end of their list** works in Windows (CRLF) notes.
- **0.4.4** - A task query in a document draws at the interface's text size, so a wider column shows more of it rather than larger text (Textus 1.4.1).
- **0.4.3** - Ticking a task with an HTML comment in it now works, and a refused tick tells you why. `group by status` sorts in the right order, task blocks fit narrow panes, due dates look like the sidebar's, and typing stays lighter.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12. A new setting, **Move finished tasks to the end of their list**: a task ticked in a document or in the list goes after the open ones (it asks once to read and edit the document in front).
- **0.4.0** - Uses the dates built into Textus 1.3.10, which it now needs.
- **0.3.1** - Ships the updated shared date code; nothing else changed.
- **0.3.0** - Obsidian Tasks: `[/]` and `[-]`, the task fields, done dates, repeating tasks and `tasks` query blocks; boards marked with `kanban-plugin` are left out of the list.
- **0.2.1** - Cards on a Kanban board (`name.kanban.md`) are no longer listed.
- **0.2.0** - Textus AI can list, add and tick off tasks.
- **0.1.3** - The list follows the interface language when it changes.
- **0.1.2** - Due dates in local time; counts in each language's plural forms.
- **0.1.0-0.1.1** - First versions: every task in the folder in a sidebar list, ticked off or opened from there, with a filter, due dates and Due soon.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_tasks`: Listet die Markdown-Aufgaben (- [ ] ...) in den Dokumenten des geöffneten Ordners auf - standardmäßig nur offene -, jede mit Text, Fälligkeit, Dokumentpfad und Zeile. Filtert nach Status, Dokument, Tag, Fälligkeit und Wörtern. Ohne Kanban-Karten (read_board) und Erinnerungen mit Uhrzeit (list_reminders).
- `add_task`: Fügt einem Dokument im geöffneten Ordner eine Aufgabe (- [ ] ...) hinzu: am Ende oder am Ende des Abschnitts unter einer Überschrift, mit Fälligkeit, falls angegeben. Legt das Dokument an, wenn es fehlt. Gibt zurück, wo sie steht. Für etwas, das zu einer Uhrzeit melden soll, add_reminder; eine Board-Karte ist add_card, eine Datenbankzeile add_row, eine Zeile im heutigen Journal append_to_daily_note.
- `complete_task`: Hakt eine Aufgabe ab (- [x]) - oder öffnet sie mit done false wieder - anhand von Dokumentpfad und Zeile, wie list_tasks sie liefert. Schreibt das Erledigt-Datum (✅ JJJJ-MM-TT) wie Obsidian Tasks und fügt bei einer wiederkehrenden Aufgabe (🔁 every …) die nächste in der Zeile darüber ein.
<!-- /ai-tools -->
