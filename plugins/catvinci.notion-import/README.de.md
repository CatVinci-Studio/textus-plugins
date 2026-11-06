# Notion-Import

Holt einen Notion-Export als normale Markdown-Dateien in Textus: Seiten und Unterseiten, Bilder und Anhänge, die Links dazwischen und Datenbanken.

1. Wählen Sie in Notion **Einstellungen › Alle Workspace-Inhalte exportieren**, mit **Markdown & CSV** und Unterseiten. Legen Sie die erhaltene .zip (oder den entpackten Ordner) in den in Textus geöffneten Ordner.
2. Wählen Sie **Plugins › Aus Notion importieren…** (oder klicken Sie die .zip in der Seitenleiste mit rechts an) und wählen Sie den Export. Ein großer Export, aufgeteilt in Part-1.zip, Part-2.zip… in einer zip, wird als einer geöffnet. Eine .zip über 256 MB ist zu groß, um sie auf einmal zu lesen: Entpacken Sie sie samt den enthaltenen Part-Zips in einen einzigen Ordner im geöffneten Ordner und wählen Sie diesen Ordner.
3. Alles kommt in einen neuen Ordner, **Notion-Import** und das Datum; Vorhandenes bleibt unverändert. Am Ende öffnet sich eine Berichtsseite.

Was daraus wird:

- **Seiten**: `Pläne 1a2b….md` und sein Ordner werden zu `Pläne.md` und `Pläne/`, dem Aufbau, den das Plugin Seiten als Baum zeigt. Zwei Seiten mit gleichem Namen erhalten „ 2“.
- **Links** zwischen Seiten, zu Bildern und Anhängen folgen den neuen Namen. Links zu Seiten, die nicht exportiert wurden, bleiben, wie sie waren, und stehen im Bericht.
- **Eigenschaften** unter dem Titel der Seite einer Datenbankzeile kommen in deren Front Matter; auf anderen Seiten bleiben solche Zeilen Text.
- **Datenbanken**: Jede Zeile wird ein Dokument in einem Ordner, ihre Eigenschaften im Front Matter: Daten als 2026-01-04 (englische, chinesische, japanische, koreanische, deutsche, französische, spanische, portugiesische und ISO-Formate), Kontrollkästchen als true/false, Zahlen, Mehrfachauswahl als Listen, Relationen als Links zu den Zeilen. Daneben zeigt eine Seite die Datenbank als Tabelle, dazu ein Board bei einem Status und einen Kalender bei Daten.
- **Callouts** werden Hinweise (`> [!NOTE]`), ihr Emoji bleibt. Aufklappbare Blöcke bleiben `<details>`.

Was nicht mitkommt: Notions Export enthält keine Seitensymbole, Titelbilder, Kommentare oder gespeicherten Datenbankansichten (Filter, Sortierungen), daher kommen sie nicht mit. Formel- und Rollup-Eigenschaften behalten ihren damaligen Wert, Spalten stehen nacheinander, eine eingebettete Datenbank wird ein Link zu ihrer Seite, und Erwähnungen von Personen und Daten sind einfacher Text.

Der Bericht zählt, was importiert wurde, listet nicht gefundene Links und geänderte Blöcke und schlägt Plugins vor, die beim Mitgebrachten helfen: Seiten für Unterseiten, Datenbankansichten für Datenbanken, Bidirektionale Links und Schnellvorschau für verlinkte Seiten und so weiter. **Plugins › Hilfreiche Plugins nach einem Notion-Import…** bietet an, eines zu installieren; Textus fragt vorher. Nichts wird von selbst installiert.

Alles geschieht auf Ihrem Computer: Das Plugin liest und schreibt nur Dateien im geöffneten Ordner und nutzt nie das Netzwerk.
