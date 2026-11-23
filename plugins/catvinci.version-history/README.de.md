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

- **0.5.1** - Its page shows its list of changes in English in every language. Its page receives Textus's messages by the API's current name.
- **0.5.0** - From Textus 1.4.4 the versions other plugins keep of a document - Cloud Sync's - are listed too, each under its source's name, to compare and restore like the rest.
- **0.4.1** - Restore is one word, so its button fits a narrow sidebar in every language.
- **0.4.0** - Versions thin out with age instead of the last 50 going; each text is stored once; a deleted document's versions go a month later. Compare any two versions, word by word; take back one change; name and pin versions; changes made outside Textus are kept. Versions from 0.3 move over by themselves. Needs Textus 1.4.3. In a Git folder on the desktop, the document's commits show under its versions.
- **0.3.8** - The text from before the first save is no longer lost when that save comes right as the document opens.
- **0.3.7** - The text a document had before its first save is kept as a version too, and a document's versions follow it when it is renamed or moved.
- **0.3.6** - Autosave while you type writes only the newest version, not every version of the document, so long documents save with much less work.
- **0.3.5** - An open version stays open while autosave updates it, and Restore always finds it. When storage is full, older versions of other documents make room, and the panel says when a save couldn't be kept. Rows work from the keyboard; buttons wrap in a narrow sidebar.
- **0.3.4** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Only the path code shared with other plugins changed; nothing changes in use.
- **0.3.0** - Textus AI can list a document's versions and compare them (`list_versions`, `diff_versions`).
- **0.2.0** - Textus's own controls. Needs Textus 1.3.2.
- **0.1.0-0.1.3** - First versions: a version on each save, what changed since, restore as an edit to accept or reject, open as a new document, saves close together kept as one, versions grouped by day, the oldest dropped when storage is full.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_versions`: Listet die gespeicherten Versionen eines Dokuments auf - des vorderen, wenn kein Pfad angegeben ist -, die neueste zuerst, ab 1 nummeriert, jede mit Speicherzeit und Größe.
- `diff_versions`: Zeigt Zeile für Zeile, was sich zwischen zwei Versionen eines Dokuments geändert hat, oder zwischen einer Version und dem jetzigen Dokument: + hinzugefügt, - entfernt, mit etwas Kontext.
<!-- /ai-tools -->
