# Versionsverlauf

Behält jedes Speichern eines Dokuments als Version, damit Sie sehen, was sich geändert hat, und eine alte zurückholen können.

- Bei jedem Speichern wird der Text des Dokuments als Version behalten. Kurz aufeinanderfolgende Speichervorgänge (das automatische Speichern alle paar Sekunden) zählen als eine, mit höchstens alle 15 Minuten einer neuen Version. Der letzte Tag bleibt ganz, danach eine pro Stunde für eine Woche, eine pro Tag für drei Monate und davor eine pro Woche.
- Der Reiter **Verlauf** in der Seitenleiste listet die Versionen des geöffneten Dokuments, die neueste oben, nach Tagen gruppiert: Heute, Gestern, dann das Datum.
- Wählen Sie eine, um Zeile für Zeile zu sehen, was sich seitdem geändert hat.
- Vergleiche sie mit dem Dokument jetzt oder mit jeder anderen Version, die geänderten Wörter markiert. **Wiederherstellen** neben einer Änderung holt nur diese zurück; **Mehr** benennt oder heftet eine Version an, die dann immer bleibt, oder öffnet sie als neues Dokument. Auch Änderungen außerhalb von Textus (eine andere App, eine Synchronisierung, git) bleiben: der Text davor und danach.
- **Wiederherstellen** bietet den alten Text als Änderung am Dokument an, die Sie wie jede andere annehmen oder ablehnen. **Als neues Dokument öffnen** öffnet sie stattdessen daneben.
- Die Versionen liegen in Textus, nicht in Ihrem Ordner. Dokumente über 2 MB werden nicht behalten, und ist der Speicher voll, gehen die ältesten Versionen zuerst.

## Berechtigungen

- Dateien und Dokument lesen: um jede Version zu behalten und mit dem jetzigen Text zu vergleichen.
- Änderungen vorschlagen: um eine alte Version als Änderung zurückzubringen, die Sie annehmen oder ablehnen.
- Werkzeuge für Textus AI: damit Textus AI die Versionen eines Dokuments auflisten und vergleichen kann.

## Änderungen

- **0.4.1** - Wiederherstellen ist ein Wort, damit die Schaltfläche in jeder Sprache in eine schmale Seitenleiste passt.
- **0.4.0** - Versionen werden mit dem Alter lichter, statt nur die letzten 50 zu behalten; jeder Text wird einmal gespeichert; die Versionen eines gelöschten Dokuments gehen nach einem Monat. Zwei beliebige Versionen Wort für Wort vergleichen, eine einzelne Änderung zurückholen, Versionen benennen und anheften; Änderungen außerhalb von Textus bleiben. Versionen aus 0.3 ziehen von selbst um. Braucht Textus 1.4.3. In einem Git-Ordner auf dem Desktop stehen die Commits des Dokuments unter seinen Versionen.
- **0.3.8** - Der Text vor dem ersten Speichern geht nicht mehr verloren, wenn dieses Speichern direkt beim Öffnen kommt.
- **0.3.7** - Der Text eines Dokuments vor dem ersten Speichern bleibt ebenfalls als Version erhalten, und die Versionen folgen einem Dokument, wenn es umbenannt oder verschoben wird.
- **0.3.6** - Das automatische Speichern beim Schreiben schreibt nur die neueste Version, nicht jede Version des Dokuments, sodass lange Dokumente mit viel weniger Aufwand speichern.
- **0.3.5** - Eine geöffnete Version bleibt offen, wenn das automatische Speichern sie aktualisiert, und Wiederherstellen findet sie immer. Ist der Speicher voll, machen ältere Versionen anderer Dokumente Platz, und das Feld sagt, wenn ein Speichern nicht behalten werden konnte. Zeilen gehen per Tastatur; Schaltflächen brechen in einer schmalen Seitenleiste um.
- **0.3.4** - In der Seitenleiste zeigt das Feld keinen eigenen Titel mehr, wie die anderen Tabs dort. Kürzere Hilfe- und Leertexte. Seitenleiste und Seite folgen dem Layout von Textus 1.3.13.
- **0.3.3** - Leisten, Listen und Steuerelemente sind jetzt die von Textus, wachsen mit der Oberfläche und folgen jedem Theme; braucht Textus 1.3.12.
- **0.3.2** - Seine Seite sagt jetzt in einem Satz, was es tut, was es kann und was sich in jeder Version geändert hat.
- **0.3.1** - Nur der mit anderen Plugins geteilte Pfad-Code hat sich geändert; in der Bedienung ändert sich nichts.
- **0.3.0** - Textus AI kann die Versionen eines Dokuments auflisten und vergleichen (`list_versions`, `diff_versions`).
- **0.2.0** - Textus' eigene Bedienelemente. Benötigt Textus 1.3.2.
- **0.1.0-0.1.3** - Erste Versionen: eine Version bei jedem Speichern, was sich seitdem geändert hat, Wiederherstellen als Änderung zum Annehmen oder Ablehnen, Öffnen als neues Dokument, kurz aufeinanderfolgendes Speichern als eine Version, Gruppen nach Tagen, älteste Versionen gehen bei vollem Speicher.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_versions`: Listet die gespeicherten Versionen eines Dokuments auf - des vorderen, wenn kein Pfad angegeben ist -, die neueste zuerst, ab 1 nummeriert, jede mit Speicherzeit und Größe.
- `diff_versions`: Zeigt Zeile für Zeile, was sich zwischen zwei Versionen eines Dokuments geändert hat, oder zwischen einer Version und dem jetzigen Dokument: + hinzugefügt, - entfernt, mit etwas Kontext.
<!-- /ai-tools -->
