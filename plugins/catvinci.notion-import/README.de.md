# Notion-Import

Macht aus einem Notion-Export einfache Markdown-Dateien im geöffneten Ordner, die auch Obsidian liest.

Seiten und Unterseiten, Bilder und Anhänge, die Links dazwischen und Datenbanken im Bases-Format von Obsidian kommen alle mit.

1. Wählen Sie in Notion **Settings › Export all workspace content**, mit **Markdown & CSV** und eingeschlossenen Unterseiten. Legen Sie die .zip, die Sie bekommen (oder den Ordner, zu dem sie sich entpackt), in den Ordner, der in Textus geöffnet ist.
2. Wählen Sie **Plugins › Aus Notion importieren…** (oder klicken Sie in der Seitenleiste mit der rechten Maustaste auf die .zip) und wählen Sie den Export. Ein großer Export, der in einer zip in Part-1.zip, Part-2.zip… aufgeteilt ist, wird als einer geöffnet. Eine .zip über 256 MB ist zu groß, um sie auf einmal zu lesen: Entpacken Sie sie in den geöffneten Ordner und wählen Sie diesen Ordner.
3. Benennen Sie den Ordner, in den der Import kommt (**Notion**, wenn Sie nichts anderes eingeben); was dort schon liegt, wird nicht geändert. Ein Fortschrittsbalken lässt Sie abbrechen; was bis dahin geschrieben wurde, bleibt. Am Ende öffnet sich eine Berichtsseite, und ist **Wiki** installiert, zeigt die Seitenleiste den Import als Seitenbaum.

## Was daraus wird

- **Seiten**: Eine Seite mit Unterseiten – auch eine Datenbankzeile mit Unterseiten – wird zu einem Ordner mit der Seite darin, `Plans/Plans.md`, ihre Unterseiten daneben; eine Seite ohne wird zu einer Datei, `Plans.md`. Die IDs von Notion verschwinden aus den Namen; die Seite einer Datenbankzeile bekommt ihren ganzen Titel, den Notion in Dateinamen kürzt.
- **Datenbanken**: Jede Datenbank wird zu einem Ordner mit einer Seite, die einen `base`-Block enthält, die Ansichten einen Klick voneinander entfernt – ihr Board, wenn sie einen Status hat, ihre Tabelle und ihr Kalender, wenn sie Daten hat. Jede Zeile ist eine Notiz in diesem Ordner, ihre Eigenschaften im Front Matter: Daten als 2026-01-04, Kontrollkästchen, Zahlen, Listen, Relationen als Links. Wo eine andere Seite eine Datenbank zeigt, zeigt sie sie auch dort, sortiert, wie der Export es angibt. Die leeren „Untitled“-Zeilen und -Seiten von Notion werden weggelassen.
- **Bilder und Anhänge** kommen in einen Ordner `assets` neben der Seite, die sie zeigt; eingefügte Bilder bekommen den Namen ihrer Seite.
- **Links** zwischen Seiten, zu Bildern und zu Anhängen folgen den neuen Namen. Links zu Seiten, die nicht exportiert wurden, stehen im Bericht.
- **Links zwischen Seiten**: wird zu Beginn gefragt: Standardlinks (empfohlen), `[Page](Page.md)`, wie Notion sie exportiert und jede App sie öffnet, oder `[[Wikilinks]]`, wie Obsidian sie schreibt. Der importierte Ordner behält die Wahl, sodass eine später darin angelegte Seite genauso verlinkt.
- **Callouts** werden zu Hinweisen (`> [!NOTE]`), ihr Emoji bleibt. Aufklappbare Blöcke bleiben `<details>`.

**Seitensymbole**: Der Markdown-Export von Notion lässt sie weg. Exportieren Sie dieselben Seiten zusätzlich als HTML und wählen Sie diesen Export, wenn der Import danach fragt: Die Emoji-Symbole der Seiten kommen mit.

**Was zurückbleibt**: Der Export von Notion enthält keine Titelbilder, Kommentare oder Filter gespeicherter Ansichten, daher kommen sie nicht mit; die Sortierung einer Ansicht schon. Formel- und Rollup-Eigenschaften behalten ihren damaligen Wert, und Erwähnungen von Personen und Daten werden zu einfachem Text.

## Der Bericht

Der Bericht zählt, was hereinkam, listet die Links, die er nicht finden konnte, die Dateien, die er nicht lesen oder schreiben konnte, und die Blöcke, die er geändert hat, und schlägt die Plugins vor, die beim Rest helfen – zuerst Wiki, für den Seitenbaum und die Datenbanken; dann Bidirektionale Links, Schnellvorschau, Aufgaben, Link-Karten, PDF-Betrachter und Vorlagen, jedes nur, wenn der Import enthält, wobei es hilft. **Plugins › Hilfreiche Plugins nach einem Notion-Import…** bietet an, eines zu installieren; Textus fragt vorher, und nichts wird von selbst installiert.

## Berechtigungen

Alles geschieht auf Ihrem Gerät: Das Plugin liest und schreibt nur Dateien im geöffneten Ordner und nutzt nie das Netzwerk. Es braucht Textus 1.3.10 oder neuer.

## Änderungen

- **0.7.12** - Its page is in every language Textus speaks. In Chinese, a database is 数据库, and 知识库 is only the Wiki plugin's name. Every language calls the Wiki plugin by its current name.
- **0.7.11** - Its package lists the libraries it carries, with their licenses.
- **0.7.10** - The database code it shares with Database brought up to date (its file columns filled).
- **0.7.9** - Databases it makes keep a view another plugin draws (Textus 1.4.6).
- **0.7.8** - The import report gets a free name as it is written (Textus 1.4.3).
- **0.7.7** - Bundles the Wiki plugin's newer base code; importing works as before.
- **0.7.6** - Importing a database with many rows is quicker.
- **0.7.5** - Page icons now come through from an unzipped HTML export too, and such an export shows up when you pick where the icons come from.
- **0.7.4** - Shares the database's updated filter code: a filter ticking several values reads the same in both. Shorter help and empty-state text.
- **0.7.3** - Once imported, the sidebar goes into the new folder (Textus 1.3.12) and shows its pages tree. Notion's blank rows and pages - no title, nothing written, only the "Not started" status Notion fills in - are left out.
- **0.7.2** - A database that sits under a page (as in Notion) stays a link on that page, no longer also shown there as a table; its own page shows it. Its code is split into smaller files by what each part does.
- **0.7.1** - Shares Two-way Links' fix for working out how a note links.
- **0.7.0** - asks how the pages link: standard links (recommended), as Notion exports them, or [[wiki links]] - a path shown by the page's name; the imported folder keeps the choice for pages made in it later
- **0.6.1** - Calls Workspace by its name in the import report and in the suggested plugins.
- **0.6.0** - Dates written by Textus itself; needs Textus 1.3.10.
- **0.5.0** - Page emoji icons, from Notion's HTML export of the same pages.
- **0.4.0** - Its own plugin again: pages with sub-pages as folders, databases as Obsidian bases, empty "Untitled" pages left out, and the import opened in Workspace's pages tree.
- **0.3.0** - Merged into Workspace for a while; this version only pointed there.
- **0.2.2** - One database block per database, opening on the board when there is a status.
- **0.2.1** - Asks what to name the import's folder; pasted pictures are named after their page.
- **0.2.0** - Reads Notion's newer exports: no doubled pages or rows, rows keep their whole titles, attachments go beside the page that uses them, databases shown on other pages keep their sort.
- **0.1.1** - The report suggests Two-way Links by its new name.
- **0.1.0** - First version: a Notion export (.zip or folder) into a folder of Markdown, ids out of names, links rewritten, databases as notes with front matter, callouts as notes, a report with plugins that help.
