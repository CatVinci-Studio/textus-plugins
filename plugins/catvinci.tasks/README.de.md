# Aufgaben

Alle Aufgaben deines Ordners in einer Liste.

- Schreibe irgendwo eine Aufgabe als `- [ ] etwas zu erledigen`.
- Der Tab **Aufgaben** in der Seitenleiste listet die Aufgaben aller Dokumente im geöffneten Ordner.
- Hake dort eine ab oder klicke darauf, um zu ihr in ihrem Dokument zu springen.
- Ob erledigte Aufgaben erscheinen, steht in den Einstellungen des Plugins.
- Gib einer Aufgabe ein Datum (`📅 2026-11-01` oder `due:2026-11-01`), dann erscheint es als Badge; überfällige Aufgaben und solche, die innerhalb einer Woche fällig sind, stehen zuerst, unter **Bald fällig**.
- Das Feld oben filtert die Liste nach Wörtern, nach dem Namen des Dokuments oder nach seiner Überschrift.
- Karten eines Kanban-Boards (`name.kanban.md`) gehören zum Board und werden nicht aufgeführt.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_tasks`: Listet die Markdown-Aufgaben (- [ ] ...) in den Dokumenten des geöffneten Ordners auf - standardmäßig nur offene -, jede mit Text, Fälligkeit, Dokumentpfad und Zeile. Filtert nach Status, Dokument, Tag, Fälligkeit und Wörtern. Ohne Kanban-Karten (read_board) und Erinnerungen mit Uhrzeit (list_reminders).
- `add_task`: Fügt einem Dokument im geöffneten Ordner eine Aufgabe (- [ ] ...) hinzu: am Ende oder am Ende des Abschnitts unter einer Überschrift, mit Fälligkeit, falls angegeben. Legt das Dokument an, wenn es fehlt. Gibt zurück, wo sie steht. Für etwas, das zu einer Uhrzeit melden soll, add_reminder; eine Board-Karte ist add_card, eine Datenbankzeile add_row, eine Zeile im heutigen Journal append_to_daily_note.
- `complete_task`: Hakt eine Aufgabe ab (- [x]) - oder öffnet sie mit done false wieder - anhand von Dokumentpfad und Zeile, wie list_tasks sie liefert.
<!-- /ai-tools -->
