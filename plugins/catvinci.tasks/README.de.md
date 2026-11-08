# Aufgaben

Alle Aufgaben deines Ordners in einer Liste.

- Schreibe irgendwo eine Aufgabe als `- [ ] etwas zu erledigen`.
- Der Tab **Aufgaben** in der Seitenleiste listet die Aufgaben aller Dokumente im geöffneten Ordner.
- Hake dort eine ab oder klicke darauf, um zu ihr in ihrem Dokument zu springen.
- Ob erledigte Aufgaben erscheinen, steht in den Einstellungen des Plugins.
- Gib einer Aufgabe ein Datum (`📅 2026-11-01` oder `due:2026-11-01`), dann erscheint es als Badge; überfällige Aufgaben und solche, die innerhalb einer Woche fällig sind, stehen zuerst, unter **Bald fällig**.
- Das Feld oben filtert die Liste nach Wörtern, nach dem Namen des Dokuments oder nach seiner Überschrift.
- Karten eines Kanban-Boards (ein Dokument mit `kanban-plugin` im Front Matter oder `name.kanban.md`) gehören zum Board und werden nicht aufgeführt.

## In Obsidian geschriebene Aufgaben

Aufgaben, die das Tasks-Plugin von Obsidian schreibt, funktionieren hier genauso:

- `[/]` ist in Arbeit und noch offen; `[-]` ist abgebrochen und zählt als erledigt.
- Die Felder am Ende einer Aufgabe (📅 fällig, ⏳ geplant, 🛫 Beginn, ➕ erstellt, ✅ erledigt, ❌ abgebrochen, eine Priorität 🔺 ⏫ 🔼 🔽 ⏬ und 🔁 eine Wiederholung) bleiben in der Datei und erscheinen nicht in der Liste.
- Abhaken schreibt ✅ und das heutige Datum; Zurücknehmen entfernt beides.
- Wer eine wiederkehrende Aufgabe abhakt (`🔁 every day`, `every 2 weeks`, `every weekday`, `every Monday`, `every month on the 15th`, `every year`, `… when done`), bekommt die nächste in der Zeile darüber, mit weitergerückten Daten.

## Aufgabenabfragen

Ein Codeblock `tasks` listet die Aufgaben, nach denen er fragt, eine Regel pro Zeile, wie in Obsidian:

````markdown
```tasks
not done
due before next week
path includes Projects
sort by due
```
````

Er versteht `not done` und `done`; `due`, `scheduled`, `starts`, `done` oder `created` mit `before`, `after`, `on`, `on or before` oder `on or after` und einem Datum (2026-11-01, today, tomorrow, yesterday, this, next oder last week, month oder year); `no due date` und `has due date`; `path`, `filename`, `description` oder `heading` mit `includes` oder `does not include`; `tag includes`; `priority is`; `is recurring`; `sort by`, `group by` (path, folder, filename, heading, due, priority, status) und `limit`. Zeilen zur Darstellung (`hide …`, `show …`) werden übergangen; jede andere, die er nicht versteht, wird unter der Anzahl genannt. Hake dort eine Aufgabe ab, um sie in ihrer Datei abzuhaken; ein Klick springt zu ihr.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_tasks`: Listet die Markdown-Aufgaben (- [ ] ...) in den Dokumenten des geöffneten Ordners auf - standardmäßig nur offene -, jede mit Text, Fälligkeit, Dokumentpfad und Zeile. Filtert nach Status, Dokument, Tag, Fälligkeit und Wörtern. Ohne Kanban-Karten (read_board) und Erinnerungen mit Uhrzeit (list_reminders).
- `add_task`: Fügt einem Dokument im geöffneten Ordner eine Aufgabe (- [ ] ...) hinzu: am Ende oder am Ende des Abschnitts unter einer Überschrift, mit Fälligkeit, falls angegeben. Legt das Dokument an, wenn es fehlt. Gibt zurück, wo sie steht. Für etwas, das zu einer Uhrzeit melden soll, add_reminder; eine Board-Karte ist add_card, eine Datenbankzeile add_row, eine Zeile im heutigen Journal append_to_daily_note.
- `complete_task`: Hakt eine Aufgabe ab (- [x]) - oder öffnet sie mit done false wieder - anhand von Dokumentpfad und Zeile, wie list_tasks sie liefert. Schreibt das Erledigt-Datum (✅ JJJJ-MM-TT) wie Obsidian Tasks und fügt bei einer wiederkehrenden Aufgabe (🔁 every …) die nächste in der Zeile darüber ein.
<!-- /ai-tools -->
