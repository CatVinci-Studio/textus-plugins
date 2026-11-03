# Kalender und Tagesnotizen

Eine Notiz für jeden Tag und ein Kalender, um zu jeder zu gelangen.

- **Ctrl+Alt+D** (**⌘⌥D** auf dem Mac) oder **Plugins › Heutige Notiz öffnen** öffnet die heutige Notiz – beim ersten Mal wird sie angelegt.
- Der Tab **Kalender** in der Seitenleiste zeigt den Monat; Tage mit einer Notiz sind markiert. Ein Klick auf einen Tag öffnet ihn.
- Die Notizen liegen in einem Ordner im geöffneten Ordner. Sein Name und der Anfangstext eines neuen Tages stehen in den Einstellungen des Plugins; die Woche beginnt wie in deiner Region.
- **Plugins › Vorherigen Tag öffnen** und **Nächsten Tag öffnen** wechseln von der Notiz eines Tages zu den benachbarten.
- Die Vorlage kann neben {{date}} auch {{weekday}}, {{yesterday}}, {{tomorrow}} und {{time}} enthalten – zum Beispiel verlinkt `[[{{yesterday}}]]` jeden Tag mit dem davor.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `read_daily_note`: Liest die Tagesnotiz eines Tages - heute, wenn kein Datum angegeben ist - aus dem Ordner der Tagesnotizen: ihren Pfad, ob es sie gibt, und ihren Text.
- `append_to_daily_note`: Fügt Markdown am Ende der Tagesnotiz eines Tages an - heute, wenn kein Datum angegeben ist - und legt die Notiz vorher aus ihrer Vorlage an, falls es sie nicht gibt.
<!-- /ai-tools -->
