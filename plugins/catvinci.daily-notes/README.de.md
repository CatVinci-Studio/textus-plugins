# Kalender und Tagesnotizen

Legt für jeden Tag eine Notiz in einem Ordner des geöffneten Ordners an, mit einem Kalender in der Seitenleiste, um jede davon zu erreichen.

- Drücken Sie **Ctrl+Alt+J** (**⌘⌥J** auf dem Mac) oder wählen Sie **Plugins › Heutige Notiz öffnen**. Die heutige Notiz öffnet sich; beim ersten Mal wird sie angelegt.
- **Plugins › Vorherigen Tag öffnen** und **Plugins › Nächsten Tag öffnen** wechseln von der gerade geöffneten Tagesnotiz zur benachbarten.
- Der Tab **Kalender** in der Seitenleiste zeigt einen Monat und markiert die Tage mit einer Notiz. Ein Klick auf einen Tag öffnet seine Notiz, **Heute** die von heute. Die Woche beginnt so, wie es in der Sprache von Textus üblich ist, passend zu den Wochennummern.
- Eine Notiz, die schon da ist, wird nie überschrieben.

## Einstellungen

- **Ordner für Tagesnotizen**: ein Ordner im geöffneten Ordner, standardmäßig `Daily`.
- **Die Notiz eines neuen Tages**: der Text, mit dem eine neue Notiz beginnt, standardmäßig `# {{date}}`. Er kann `{{date}}`, `{{weekday}}`, `{{yesterday}}` und `{{tomorrow}}` (für Links wie `[[{{yesterday}}]]`), `{{time}}`, `{{title}}`, `{{date:FORMAT}}` und `{{date+1d}}` enthalten; `\n` beginnt eine neue Zeile. Er kann auch der Name einer Vorlage im Ordner Templates sein, etwa `Daily`.
- **Wochennotizen** und **Monatsnotizen**: standardmäßig aus. Eingeschaltet öffnen **Plugins › Notiz dieser Woche öffnen** und **Notiz dieses Monats öffnen** sie, ebenso die Wochennummern und der Monatsname im Kalender. Jede hat ihren Ordner (`Weekly`, `Monthly`), ihr Namensformat (`gggg-[W]ww` ergibt `2026-W45`, `YYYY-MM` ergibt `2026-11`) und ihre Vorlage. Eine Wochenvorlage kann `{{monday:YYYY-MM-DD}}` … `{{sunday}}` für die Tage der Woche enthalten.

## Obsidian-Vaults

In einem Obsidian-Vault gelten stattdessen seine eigenen Einstellungen für Tagesnotizen: Ordner, Namensformat (etwa `YYYY/MM/YYYY-MM-DD` oder `MMMM Do, YYYY`) und Vorlage. Textus ändert sie nie. Ein Vault ohne solche Einstellungen legt seine Notizen ganz oben ab, wie Obsidian. `{{date}}`, `{{yesterday}}` und `{{tomorrow}}` werden im Namensformat der Notizen geschrieben. In einem Vault mit dem Plugin Periodic Notes gelten dessen Einstellungen für Wochen und Monate.

## Berechtigungen

Das Plugin liest und schreibt Dateien im geöffneten Ordner, um die Notizen zu finden und anzulegen, und liest, welches Dokument gerade offen ist, um den Tag davor und danach zu kennen. Außerdem gibt es Textus AI die beiden Werkzeuge unten. Es braucht Textus 1.4.3 oder neuer.

## Änderungen

- **0.7.9** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3. Its page receives Textus's messages by the API's current name.
- **0.7.8** - Where the bar is too narrow for even the short month name (a phone's sidebar), the month goes on a row of its own above the buttons instead of losing its year. The calendar writes dates with Textus's own, so the package is smaller.
- **0.7.7** - Weeks start as Textus's language has them, not the device's region, so they agree with the week numbers.
- **0.7.6** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.7.5** - The Calendar's month title starts at the left and ends in an ellipsis in a narrow sidebar, instead of being cut at both ends.
- **0.7.4** - In a narrow panel, such as on a phone, the calendar shows the month's short name instead of cutting the long one off.
- **0.7.3** - Impossible dates such as February 30 are refused, the calendar stays a comfortable width in wide panels and redraws when folder settings change, and weekly and monthly settings show only when those notes are on.
- **0.7.2** - Shorter help and empty-state text.
- **0.7.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.7.0** - Dates and templates are filled in by Textus itself, the same way as in the Templates plugin; needs Textus 1.3.10.
- **0.6.0** - Weekly and monthly notes, with their own settings, the calendar's week numbers and month name, and a vault's Periodic Notes settings.
- **0.5.0** - A vault without daily notes settings keeps its notes at its top; `{{date}}`, `{{yesterday}}` and `{{tomorrow}}` follow the notes' name format, `MMMM Do, YYYY` included.
- **0.4.0** - Follows an Obsidian vault's daily notes settings; the starting text can name a template in the Templates folder; `{{date:FORMAT}}` and `{{title}}`.
- **0.3.0** - Textus AI can read a day's note and add to it.
- **0.2.0** - The calendar uses Textus's own controls and follows the interface language when it changes; needs Textus 1.3.2.
- **0.1.3** - Textus 1.3's colors and type.
- **0.1.2** - Weeks start as your region has them; a day's note is never written over.
- **0.1.0-0.1.1** - First versions: today's note with a shortcut, the calendar, the day before and after, `{{weekday}}`, `{{yesterday}}`, `{{tomorrow}}` and `{{time}}` in the template.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `read_daily_note`: Liest die Tagesnotiz eines Tages - heute, wenn kein Datum angegeben ist - aus dem Ordner der Tagesnotizen: ihren Pfad, ob es sie gibt, und ihren Text.
- `append_to_daily_note`: Fügt Markdown am Ende der Tagesnotiz eines Tages an - heute, wenn kein Datum angegeben ist - und legt die Notiz vorher aus ihrer Vorlage an, falls es sie nicht gibt. Eine Notiz für später in der Seitenleiste ist add_note; eine Aufgabe mit Datum add_task.
<!-- /ai-tools -->
