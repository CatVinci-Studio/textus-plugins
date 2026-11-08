# Zotero

Zitiere beim Schreiben aus deiner Zotero-Bibliothek.

- Benötigt Zotero 7 oder neuer (auch Zotero 10), das läuft, mit eingeschaltetem **Settings › Advanced › Allow other applications on this computer to communicate with Zotero**.
- **Ctrl+Alt+R** (**⌘⌥R** auf dem Mac), Rechtsklick › **Zitat aus Zotero einfügen…** oder das Plugins-Menü: Zuerst kommen die Werke, die du zuletzt zitiert hast, dann eine Suche in deiner Bibliothek.
- Sind Wörter markiert, wird nach ihnen gesucht.
- Wähle einen Eintrag, und das Zitat wird an der Einfügemarke eingefügt.
- **Plugins › Literaturverzeichnis einfügen** setzt ans Ende des Dokuments eine Liste aller Werke, die es zitiert.
- **Plugins › Neue Literaturnotiz aus Zotero…** legt `@citekey.md` in References an (oder öffnet sie, wenn es sie gibt) – mit Titel, Autoren, Jahr, Abstract, DOI oder URL sowie den Markierungen und Notizen aus Zotero. Eine Vorlagendatei lässt sich festlegen; in einem Obsidian-Vault gelten Ordner und Vorlage von Zotero Integration oder Citations.
- Zitate lassen sich auch wie in Obsidian schreiben, `[[@citekey]]`: ein Link auf diese Literaturnotiz, die beim Zitieren angeboten wird.
- Wie ein Zitat geschrieben wird, steht in den Einstellungen des Plugins.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `search_library`: Durchsucht die Zotero-Bibliothek des Nutzers auf diesem Computer (Zotero 7 oder neuer muss laufen): Schlüssel, Titel, Autoren, Jahr, Art, Erscheinungsort und Zitierschlüssel jedes Eintrags sowie das Zitat zum Einfügen im gewählten Stil. Schlägt mit einem Hinweis fehl, wenn Zotero nicht erreichbar ist.
<!-- /ai-tools -->
