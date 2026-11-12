# Kalender und Tagesnotizen

Legt für jeden Tag eine Notiz in einem Ordner des geöffneten Ordners an, mit einem Kalender in der Seitenleiste, um jede davon zu erreichen.

- Drücken Sie **Ctrl+Alt+J** (**⌘⌥J** auf dem Mac) oder wählen Sie **Plugins › Heutige Notiz öffnen**. Die heutige Notiz öffnet sich; beim ersten Mal wird sie angelegt.
- **Plugins › Vorherigen Tag öffnen** und **Plugins › Nächsten Tag öffnen** wechseln von der gerade geöffneten Tagesnotiz zur benachbarten.
- Der Tab **Kalender** in der Seitenleiste zeigt einen Monat und markiert die Tage mit einer Notiz. Ein Klick auf einen Tag öffnet seine Notiz, **Heute** die von heute. Die Woche beginnt so, wie es in Ihrer Region üblich ist.
- Eine Notiz, die schon da ist, wird nie überschrieben.

## Einstellungen

- **Ordner für Tagesnotizen**: ein Ordner im geöffneten Ordner, standardmäßig `Daily`.
- **Die Notiz eines neuen Tages**: der Text, mit dem eine neue Notiz beginnt, standardmäßig `# {{date}}`. Er kann `{{date}}`, `{{weekday}}`, `{{yesterday}}` und `{{tomorrow}}` (für Links wie `[[{{yesterday}}]]`), `{{time}}`, `{{title}}`, `{{date:FORMAT}}` und `{{date+1d}}` enthalten; `\n` beginnt eine neue Zeile. Er kann auch der Name einer Vorlage im Ordner Templates sein, etwa `Daily`.
- **Wochennotizen** und **Monatsnotizen**: standardmäßig aus. Eingeschaltet öffnen **Plugins › Notiz dieser Woche öffnen** und **Notiz dieses Monats öffnen** sie, ebenso die Wochennummern und der Monatsname im Kalender. Jede hat ihren Ordner (`Weekly`, `Monthly`), ihr Namensformat (`gggg-[W]ww` ergibt `2026-W45`, `YYYY-MM` ergibt `2026-11`) und ihre Vorlage. Eine Wochenvorlage kann `{{monday:YYYY-MM-DD}}` … `{{sunday}}` für die Tage der Woche enthalten.

## Obsidian-Vaults

In einem Obsidian-Vault gelten stattdessen seine eigenen Einstellungen für Tagesnotizen: Ordner, Namensformat (etwa `YYYY/MM/YYYY-MM-DD` oder `MMMM Do, YYYY`) und Vorlage. Textus ändert sie nie. Ein Vault ohne solche Einstellungen legt seine Notizen ganz oben ab, wie Obsidian. `{{date}}`, `{{yesterday}}` und `{{tomorrow}}` werden im Namensformat der Notizen geschrieben. In einem Vault mit dem Plugin Periodic Notes gelten dessen Einstellungen für Wochen und Monate.

## Berechtigungen

Das Plugin liest und schreibt Dateien im geöffneten Ordner, um die Notizen zu finden und anzulegen, und liest, welches Dokument gerade offen ist, um den Tag davor und danach zu kennen. Außerdem gibt es Textus AI die beiden Werkzeuge unten. Es läuft auf dem Desktop und auf dem iPhone und braucht Textus 1.3.10 oder neuer.

## Änderungen

- **0.7.3** - Unmögliche Daten wie der 30. Februar werden abgelehnt, der Kalender bleibt in breiten Bereichen angenehm schmal und zeichnet sich neu, wenn sich Ordnereinstellungen ändern, und Wochen- und Monatseinstellungen erscheinen nur, wenn diese Notizen an sind.
- **0.7.2** - Kürzere Hilfe- und Leertexte.
- **0.7.1** - Leisten, Listen und Steuerelemente sind jetzt die von Textus, wachsen mit der Oberfläche und folgen jedem Theme; braucht Textus 1.3.12.
- **0.7.0** - Daten und Vorlagen füllt Textus selbst aus, genauso wie im Vorlagen-Plugin; braucht Textus 1.3.10.
- **0.6.0** - Wochen- und Monatsnotizen mit eigenen Einstellungen, Wochennummern und Monatsname im Kalender und den Periodic-Notes-Einstellungen eines Vaults.
- **0.5.0** - Ein Vault ohne Einstellungen für Tagesnotizen legt sie ganz oben ab; `{{date}}`, `{{yesterday}}` und `{{tomorrow}}` folgen dem Namensformat, auch `MMMM Do, YYYY`.
- **0.4.0** - Folgt den Tagesnotiz-Einstellungen eines Obsidian-Vaults; der Anfangstext kann eine Vorlage im Ordner Templates nennen; `{{date:FORMAT}}` und `{{title}}`.
- **0.3.0** - Textus AI kann die Notiz eines Tages lesen und ergänzen.
- **0.2.0** - Der Kalender nutzt die Bedienelemente von Textus und folgt der Sprache der Oberfläche, wenn sie wechselt; braucht Textus 1.3.2.
- **0.1.3** - Farben und Schrift von Textus 1.3.
- **0.1.2** - Die Woche beginnt wie in Ihrer Region; die Notiz eines Tages wird nie überschrieben.
- **0.1.0-0.1.1** - Erste Versionen: heutige Notiz per Tastenkürzel, der Kalender, Tag davor und danach, `{{weekday}}`, `{{yesterday}}`, `{{tomorrow}}` und `{{time}}` in der Vorlage.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `read_daily_note`: Liest die Tagesnotiz eines Tages - heute, wenn kein Datum angegeben ist - aus dem Ordner der Tagesnotizen: ihren Pfad, ob es sie gibt, und ihren Text.
- `append_to_daily_note`: Fügt Markdown am Ende der Tagesnotiz eines Tages an - heute, wenn kein Datum angegeben ist - und legt die Notiz vorher aus ihrer Vorlage an, falls es sie nicht gibt. Eine Notiz für später in der Seitenleiste ist add_note; eine Aufgabe mit Datum add_task.
<!-- /ai-tools -->
