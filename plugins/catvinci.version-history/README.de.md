# Versionsverlauf

Jedes Speichern eines Dokuments bleibt erhalten.

- Jedes Mal, wenn du speicherst, wird der Text des Dokuments als Version aufbewahrt.
- Der Tab **Verlauf** in der Seitenleiste listet die Versionen des vorderen Dokuments auf, die neueste zuerst.
- Wähle eine aus, um zu sehen, was sich seitdem geändert hat; **Diese Version wiederherstellen** holt sie zurück, **Als neues Dokument öffnen** öffnet sie daneben.
- Dicht aufeinander folgende Speichervorgänge (automatisches Speichern alle paar Sekunden) sind eine Version, eine neue höchstens alle 15 Minuten; die letzten 50 bleiben erhalten.
- Die Versionen sind nach Tag gruppiert: Heute, Gestern, danach das Datum.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_versions`: Listet die gespeicherten Versionen eines Dokuments auf - des vorderen, wenn kein Pfad angegeben ist -, die neueste zuerst, ab 1 nummeriert, jede mit Speicherzeit und Größe.
- `diff_versions`: Zeigt Zeile für Zeile, was sich zwischen zwei Versionen eines Dokuments geändert hat, oder zwischen einer Version und dem jetzigen Dokument: + hinzugefügt, - entfernt, mit etwas Kontext.
<!-- /ai-tools -->
