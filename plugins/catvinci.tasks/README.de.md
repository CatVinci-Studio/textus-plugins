# Aufgaben

Sammelt alle Aufgaben Ihres Ordners in einer Liste, zum Abhaken an Ort und Stelle und für Abfragen wie in Obsidian Tasks.

- Schreiben Sie eine Aufgabe irgendwo als `- [ ] etwas zu tun`.
- Der Tab **Aufgaben** in der Seitenleiste listet die Aufgaben aller Dokumente im geöffneten Ordner, nach Dokument und unter der Überschrift, unter der jede steht.
- Haken Sie eine dort ab, oder klicken Sie darauf, um im Dokument zu ihr zu springen.
- Geben Sie einer Aufgabe ein Datum (`📅 2026-11-01`, `due:2026-11-01` oder `[due:: 2026-11-01]`), und es erscheint als Abzeichen. Überfällige oder innerhalb einer Woche fällige Aufgaben stehen oben unter **Bald fällig**.
- Das Feld oben filtert die Liste nach Wörtern, dem Namen des Dokuments oder seiner Überschrift.
- Erledigte Aufgaben sind ausgeblendet, außer Sie schalten **Erledigte Aufgaben zeigen** unter **Einstellungen › Erweiterungen › Plugins › Aufgaben** ein.
- Karten auf einem Kanban-Board (ein Dokument mit `kanban-plugin` in den Eigenschaften oder `name.kanban.md`) gehören zum Board und stehen nicht in der Seitenleiste.

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

Zeilen zum Aussehen (`hide …`, `show …`) werden übergangen; jede andere Zeile, die nicht verstanden wird, steht unter der Anzahl. Der Block listet auch die Karten von Boards. Haken Sie dort eine Aufgabe ab, wird sie in ihrer Datei abgehakt; ein Klick springt zu ihr.

## Berechtigungen

Das Plugin liest die Dokumente des Ordners, um ihre Aufgaben zu finden, und schreibt nur in ein Dokument, um eine Aufgabe abzuhaken oder hinzuzufügen. Außerdem gibt es Textus AI die unten aufgeführten Werkzeuge. Es läuft auf dem Desktop sowie auf iPhone und iPad.

## Änderungen

- **0.4.2** - Kürzere Hilfe- und Leertexte.
- **0.4.1** - Leisten, Listen und Steuerelemente sind jetzt die von Textus, wachsen mit der Oberfläche und folgen jedem Theme; braucht Textus 1.3.12. Neue Einstellung **Erledigte Aufgaben ans Ende der Liste**: eine abgehakte Aufgabe rückt hinter die offenen (fragt einmal nach Lesen und Bearbeiten des Dokuments).
- **0.4.0** - Nutzt die in Textus 1.3.10 eingebauten Datumsfunktionen und benötigt deshalb Textus 1.3.10.
- **0.3.1** - Enthält den aktualisierten gemeinsamen Datumscode; sonst keine Änderung.
- **0.3.0** - Obsidian Tasks: `[/]` und `[-]`, die Aufgabenfelder, Erledigt-Daten, Wiederholungen und `tasks`-Abfrageblöcke; mit `kanban-plugin` markierte Boards bleiben aus der Liste.
- **0.2.1** - Karten auf einem Kanban-Board (`name.kanban.md`) werden nicht mehr gelistet.
- **0.2.0** - Textus AI kann Aufgaben auflisten, hinzufügen und abhaken.
- **0.1.3** - Die Liste folgt der Sprache der Oberfläche, wenn diese wechselt.
- **0.1.2** - Fälligkeiten in Ortszeit; Anzahlen in den Pluralformen jeder Sprache.
- **0.1.0-0.1.1** - Erste Versionen: alle Aufgaben des Ordners in einer Liste in der Seitenleiste, dort abzuhaken oder anzuspringen, mit Filter, Fälligkeiten und Bald fällig.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_tasks`: Listet die Markdown-Aufgaben (- [ ] ...) in den Dokumenten des geöffneten Ordners auf - standardmäßig nur offene -, jede mit Text, Fälligkeit, Dokumentpfad und Zeile. Filtert nach Status, Dokument, Tag, Fälligkeit und Wörtern. Ohne Kanban-Karten (read_board) und Erinnerungen mit Uhrzeit (list_reminders).
- `add_task`: Fügt einem Dokument im geöffneten Ordner eine Aufgabe (- [ ] ...) hinzu: am Ende oder am Ende des Abschnitts unter einer Überschrift, mit Fälligkeit, falls angegeben. Legt das Dokument an, wenn es fehlt. Gibt zurück, wo sie steht. Für etwas, das zu einer Uhrzeit melden soll, add_reminder; eine Board-Karte ist add_card, eine Datenbankzeile add_row, eine Zeile im heutigen Journal append_to_daily_note.
- `complete_task`: Hakt eine Aufgabe ab (- [x]) - oder öffnet sie mit done false wieder - anhand von Dokumentpfad und Zeile, wie list_tasks sie liefert. Schreibt das Erledigt-Datum (✅ JJJJ-MM-TT) wie Obsidian Tasks und fügt bei einer wiederkehrenden Aufgabe (🔁 every …) die nächste in der Zeile darüber ein.
<!-- /ai-tools -->
