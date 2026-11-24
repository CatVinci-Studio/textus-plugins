# Erinnerungen

Erinnert Sie zu der Zeit, die Sie in eine Zeile schreiben, etwa `(@2026-11-02 09:00)`, mit einer Systemmitteilung an diese Zeile.

Schreiben Sie die Marke in eine beliebige Zeile – eine Aufgabe, eine Überschrift, jede Zeile. Zu dieser Zeit zeigt eine Mitteilung den Text der Zeile und ihr Dokument; ein Klick darauf öffnet die Zeile.

- `(@2026-11-02)` allein erinnert Sie an diesem Morgen um neun.
- **Plugins › Erinnere mich …** oder **Erinnere mich …** im /-Menü setzt die Marke für Sie an der Einfügemarke ein: in einer Stunde, heute um 20 Uhr, morgen um 9 Uhr, nächsten Montag um 9 Uhr oder ein Datum mit Uhrzeit, das Sie eingeben.
- Eine abgehakte Aufgabe (`- [x] …`) ist erledigt: keine Erinnerung.
- Der Tab **Erinnerungen** in der Seitenleiste listet die kommenden, die nächste zuerst; ein Klick öffnet ihre Zeile.
- Textus verwaltet die Erinnerungen selbst: Sie kommen, solange ein Fenster offen ist, und auch bei geschlossenen Fenstern, wenn **Im Hintergrund weiterlaufen** an ist (**Einstellungen › Allgemein**). Eine, die verpasst wurde, während Textus nicht lief, kommt beim nächsten Start.

Die Marken werden so geschrieben, wie das Reminder-Plugin von Obsidian sie schreibt, daher erinnern dieselben Notizen Sie auch dort.

Es braucht Textus 1.4.3 oder neuer. Es fragt danach, die Dateien des geöffneten Ordners zu lesen, um die Marken zu finden; im Editor zu schreiben, um eine Marke einzusetzen; Mitteilungen zu zeigen; und Textus AI die beiden Werkzeuge unten zu geben.

## Änderungen

- **0.3.6** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Opening a folder reads only the documents Textus finds a reminder mark in, not every document.
- **0.3.3** - The store description now opens with what the plugin does.
- **0.3.2** - Two open windows no longer clear each other's reminders, and the list empties when you close the folder. A mistyped time is refused instead of inserting a broken mark.
- **0.3.1** - Shorter help and empty-state text.
- **0.3.0** - Marks written with Textus's own dates; needs Textus 1.3.10.
- **0.2.2-0.2.3** - Updated shared date code.
- **0.2.1** - Textus AI is told when a due date belongs in Tasks instead.
- **0.2.0** - Textus AI can list the coming reminders and add one.
- **0.1.1** - Desktop only, since it runs in the background.
- **0.1.0** - First version: `(@date time)` marks as notifications Textus keeps, even in the background; Remind Me… and the sidebar list.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_reminders`: Listet die kommenden Erinnerungen - (@2026-11-02 09:00)-Marken in den Dokumenten des geöffneten Ordners - auf, die nächste zuerst, jede mit Zeit, Text, Dokumentpfad und Zeile. Aufgaben nach Fälligkeit: list_tasks.
- `add_reminder`: Fügt am Ende des vorderen Dokuments eine Erinnerung als Aufgabenzeile mit Zeit hinzu, - [ ] Text (@2026-11-02 09:00); dann kommt eine Mitteilung. Wenn der Nutzer zu einer Uhrzeit erinnert werden will; eine Aufgabe nur mit Fälligkeitsdatum ist add_task.
<!-- /ai-tools -->
