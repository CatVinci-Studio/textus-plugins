# Wiki

Seiten in Seiten und Datenbanken Ihrer Notizen als Tabellen, Boards, Kalender, Galerien und Listen, alles in einfachen Markdown-Dateien.

Datenbanken werden im **Bases-Format von Obsidian** geschrieben (` ```base `-Blöcke und `.base`-Dateien), daher öffnet Obsidian dieselben Datenbanken.

## Seiten

- **Eine Seite mit Unterseiten ist ein Ordner**: `Plans/Plans.md` ist die Seite, und ihre Unterseiten liegen daneben in `Plans/` – wie die Ordnernotizen von Obsidian. Tippen Sie `/` und wählen Sie **Neue Unterseite …**, oder nutzen Sie **Plugins › Neue Unterseite …**. Die erste Unterseite verschiebt `Plans.md` für Sie in ihren Ordner, und Links darauf folgen.
- **Der Tab Seiten** in der Seitenleiste zeigt den Ordner als Seitenbaum. Klicken Sie mit der rechten Maustaste auf eine Seite, um eine Unterseite anzulegen, sie umzubenennen, ihr ein Symbol zu geben oder sie in den Papierkorb zu legen (mit den Seiten darunter, nach Rückfrage). Ziehen Sie eine Seite auf eine andere, um sie zu deren Unterseite zu machen. Links folgen jeder Verschiebung.
- **Seitensymbole**: **Seitensymbol festlegen …** (im Plugins-Menü oder per Rechtsklick auf ein Dokument im Tab Dateien) wählt ein Emoji, gespeichert als `icon` im Front Matter der Seite.
- **Seiten oder Dateien?** Der Tab Seiten zeigt Seiten und was unter ihnen liegt, wie Notion; der Tab Dateien zeigt jede Datei und jeden Ordner so, wie sie auf der Festplatte liegen. Nutzen Sie beide: Es sind dieselben Dateien.
- **Wo Sie sind**: In einer Unterseite zeigt die Statusleiste die Seiten darüber – `Life › 2026 Calendar › Week 1`.
- **Benennen Sie den Ordner einer Seite** im Tab Dateien um, wird die Seite mit umbenannt, damit sie eine Seite mit Unterseiten bleibt.
- **Älteres Format**: `Plans.md` mit seinen Unterseiten in einem Ordner `Plans/` daneben liest sich genauso. **Plugins › Seiten in Ordner einordnen…** verschiebt jede solche Seite auf einmal in ihren Ordner, nachdem es die Liste gezeigt hat.

## Datenbanken

Eine Datenbank ist ein `base`-Block in einer Seite oder eine `.base`-Datei, die in einem Tab geöffnet ist. Ihre Filter wählen Notizen: Jede Notiz ist eine Zeile, und die Eigenschaften in ihrem Front Matter sind die Spalten. Tippen Sie `/` und wählen Sie **Neue Datenbank …** (oder **Plugins › Neue Datenbank …**): Es legt einen Ordner für die Datenbank an, mit einer Seite, die den Block enthält.

````markdown
```base
filters:
  and:
    - file.inFolder(this.file.folder)
    - file.path != this.file.path
views:
  - type: kanban
    name: Board
    groupBy:
      property: status
    groupOrder: [To read, Reading, Read]
  - type: table
    name: Table
    limit: 25
```
````

- **Ansichten** sind Tabs oben im Block: Tabelle, Board, Kalender, Galerie (`cards` in Bases) und Liste. Ein Rechtsklick auf eine Ansicht öffnet ihr Menü: Layout, umbenennen, löschen. **+** fügt eine Ansicht hinzu. Der Kalender ist eine eigene Ansicht von Textus; Obsidian zeigt ihn als Ansicht, die es nicht kennt.
- **Jede Zeile ist eine Notiz.** Klicken Sie in eine Zelle, um sie zu ändern; die Eigenschaft wird ins Front Matter dieser Notiz geschrieben. **Neu** legt eine Notiz im Ordner der Datenbank an. Eine Zeile öffnet sich in einem Tab, wie eine Datei.
- **Spalten**: Klicken Sie auf den Kopf einer Spalte, um nach ihr zu sortieren, sie zu filtern, ihren Typ zu ändern, sie umzubenennen, sie auszublenden oder die Eigenschaft aus jeder Zeile zu löschen; **+** fügt eine Eigenschaft hinzu. Ziehen Sie einen Kopf, um die Spalte zu verschieben, und ziehen Sie ihren rechten Rand, um ihre Breite festzulegen (ein Doppelklick auf den Rand passt sie wieder an). Reihenfolge und Breiten werden in der Datenbank gespeichert, Breiten als `columnSize` von Obsidian.
- **Board**: Ziehen Sie eine Karte in eine andere Liste, um ihren Wert zu ändern. Ziehen Sie eine Liste an ihrem Kopf, um die Listen in die gewünschte Reihenfolge zu bringen (`groupOrder`).
- **Kalender**: Zeilen stehen nach einer Datums-Eigenschaft; ein Klick auf einen Tag legt eine Zeile mit diesem Datum an.
- **Filter**, **Sortieren** und die Spaltenmenüs werden in der Ansicht so gespeichert, wie Bases sie schreibt: `status == "Read"`, `tags.contains("ml")`, `due.isEmpty()`. Filter, die Textus noch nicht lesen kann, bleiben, wie sie sind, und das steht unter der Leiste.
- **Größe in einem Dokument**: Eine Datenbank ist so breit wie der Text (oder der Bereich, mit **Breit anzeigen**) und scrollt seitwärts, wenn ihre Spalten breiter sind; sie ist so hoch wie ihre Zeilen, bis zur Grenze von Textus für einen Block (70 % des Fensters, höchstens 1200 px), und scrollt dann innen, ihr unteres Ende verblasst, solange darunter mehr kommt.
- **Lange Datenbanken** zeigen ihre ersten 25 Zeilen (oder das `limit` der Ansicht); beim Scrollen nach unten lädt der Rest, und der Tabellenkopf bleibt sichtbar. Der Pfeil links an einem Block, beim Darüberfahren, klappt ihn auf eine Zeile zusammen; das Zuklappen und die Ansicht, bei der Sie ihn lassen, werden nur auf diesem Gerät gespeichert.
- **Formeln** (`formulas:` in der Datenbank) werden für jede Zeile berechnet und können Spalten, Filter und Sortierungen sein: `(price / pages).toFixed(2)`. Zusammenfassungen werden noch nicht gezeigt.
- **Eigenschaftstypen** sind die von Obsidian, aus `.obsidian/types.json`, wenn der Ordner ein Vault ist.
- **In einer eingebetteten Notiz** (`![[page]]`) ist eine Datenbank eine Zeile; ein Klick zeichnet sie.
- **Aus Dataview**: Setzen Sie den Cursor in einen ` ```dataview `-Block und führen Sie **Plugins › Dataview-Abfrage in Base umwandeln** aus. `TABLE` und `LIST` mit `FROM`, `WHERE`, `SORT` und `LIMIT` werden an der Stelle des Blocks zur gleichen Datenbank; `TASK`, `GROUP BY`, `FLATTEN` und `dataviewjs` werden mit Begründung abgelehnt, und nichts ändert sich.

Notion-Exporte kommen über das Plugin **Notion-Import** herein, das Seiten und Datenbanken schreibt, die dieses Plugin zeigt.

## Berechtigungen

- **Dateien im geöffneten Ordner lesen und schreiben**: um Notizen und ihre Eigenschaften zu lesen, Seiten und Datenbanken anzulegen, Zelländerungen ins Front Matter zu schreiben und Seiten samt ihren Links zu verschieben oder umzubenennen.
- **Dokument lesen und bearbeiten**: um eine neue Datenbank oder Unterseite und ihren Link einzufügen und einen Dataview-Block in eine Datenbank umzuwandeln.
- **Werkzeuge für Textus AI**: damit Textus AI Datenbanken und Seiten anlegen, Zeilen lesen und hinzufügen kann.

## Änderungen

- **0.8.3** - The bar stays on one line when there is room: in a zoomed block on a Mac it folded the view tabs into one button and put the sorts on a line of their own, and measured itself many times on every click. A block taller than Textus lets it be fades at its foot while more rows are below, instead of looking cut off. By touch, a board card or lane lifts after a short hold, so a swipe scrolls instead of dragging. Its page is in every language Textus speaks. Its tools for Textus AI are described in every language, and in Chinese a database is 数据库 while 知识库 is the plugin's name.
- **0.8.2** - The `file.folder`, `file.path` and `file.mtime` columns show each page's folder, path and when it was last changed (they were empty).
- **0.8.1** - Rows and cards make way at the pace of the rest of Textus.
- **0.8.0** - Other plugins can add views beside the table, board, calendar, gallery and list - the Timeline plugin's timeline, for one - in the view menus. Needs Textus 1.4.6 for those.
- **0.7.16** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. A board's lists move as Textus's own tabs do, and a column's width can also be set with the arrow keys.
- **0.7.15** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.7.14** - A column's grip is placed by Textus's shared rule, the same one as the document's tables. The calendar view and cell editing use Textus's shared page tools. Needs Textus 1.4.3.
- **0.7.13** - A column is pulled by the same grip as the document's tables, and lifts and slides the same way. Needs Textus 1.4.3.
- **0.7.12** - A view tab whose name would be cut short ("Calenda") makes the bar give way a step instead. Menu words match the app's table menu (Title Case; German, Spanish and Portuguese row words).
- **0.7.11** - A filter's verb (is, is not, is empty) is picked from Textus's own menu instead of the system's dropdown, and its option boxes are Textus's own checkboxes.
- **0.7.10** - Renaming a row in a table renames it as the Pages tree does: a page with sub-pages keeps them and stays in its database, and only the page's own title heading changes. An open `.base` file shows changes saved in Textus or written by a plugin, and never writes an older copy over a newer file: a change made meanwhile is refused with a note to make it again. Renaming a property to a name some notes already have asks first and keeps their value.
- **0.7.9** - Tables are denser: every column has one width (the title's wider) and the table scrolls sideways when they don't fit, each row is one line with longer values cut short and shown whole on hover, and rows sit closer. Tags and links no longer run over the next column. A base on screen draws again only when its rows change, not at every save in the folder. A base's bar no longer jumps back and forth between one line and two.
- **0.7.8** - Setting a column's type (number, date, checkbox, list) works again in every folder: the type is kept in the base, and Obsidian's own types are still read. A base in a document draws at the interface's text size, so a wider column shows more of it rather than larger text; Cut, Copy and Paste in a cell's right-click menu work with Textus 1.4.1.
- **0.7.7** - Every button and menu now shows its words in your language, including Japanese, Korean, German, Spanish, French, Portuguese and Russian; a board lane's tooltip no longer shows a raw name. A table now fits its page and wraps long names before it scrolls sideways; a page's icon shows in place of the file icon in the Pages tree. Needs Textus 1.4.0.
- **0.7.6** - In a narrow block the bar keeps to one line: the count goes first, then New's word, then the view tabs fold into a menu; sorts and filters ride in the bar while there's room. A filter on a select, tags or a checkbox is ticked in a list, as in Notion, with Clear selection. A dragged view tab stays where it's let go, and a view wider than the block fades at its edges. With Textus 1.3.13 the block can be shown wide, across the pane, and drawn smaller, from its right-click menu. Shorter help and empty-state text.
- **0.7.5** - A long title or text wraps within a column of a set width instead of stretching the table; a row's right-click menu is laid out as a Markdown table's (insert a row below or a column to the right, then Row and Column); the date month opens and sits under its field in every window, zoomed too; a new row is drafted in the table's own cells; a field's right-click menu is Textus's own; a view's tab can be dragged on a Mac too; needs Textus 1.3.12. Its name is Notion's word for a wiki in each language (Wiki in English); a database is a base, as Obsidian calls it (New Base…).
- **0.7.4** - a table's head stays in view while its rows scroll; more rows load as you scroll down, no Show more; a view's menu is on right-click only; columns start at widths in proportion to the block; the view you leave a block in is kept on this device, not in the note; a block folds with Textus's own caret on its left, no fold arrow of its own; a column is dragged by its head as the sidebar's tabs are, the others sliding aside; a rating column shows the same way all down; a filter added twice is kept once, and one that contradicts another (status is Done, then status is Doing) takes its place; its board, fields and stars are Textus's own controls; a row's right-click menu opens it or moves it to the Trash; view tabs are dragged into a new order; a date is typed or picked from a small month under its field; a new sub-page's link in a page just moved into its folder points from where the page is now; needs Textus 1.3.12
- **0.7.3** - Shares Two-way Links' fix for working out how a note links.
- **0.7.2** - a dragged column stays under the pointer in a zoomed document, and dragging selects no text; a date is edited as it is shown, 2026-11-08, not in the system's order; new pages and databases are linked with standard links, [Week 1](Week%201.md), unless the folder or the page already uses [[wiki links]]
- **0.7.1** - new databases and sub-pages are linked the way the folder writes links; needs Textus 1.3.10
- **0.7.0** - drag column heads to reorder and their edges to resize (`columnSize`); a view's menu on right-click; rows open in a tab; option colors from their words; **Convert Dataview query to base**
- **0.6.0** - databases are Obsidian bases (` ```base ` blocks and `.base` files) with views, filters, sorts, `groupOrder`, `limit`, formulas, folding and **Show more**; the Pages tab can rename, delete to the Trash and drag; page folders follow renames
- **0.5.0** - renamed Workspace: Pages and Notion Import merged in; a page with sub-pages becomes a folder, and **Organize Pages into Folders…** moves older pages
- **0.4.3** - card tags and long values wrap on boards and galleries
- **0.4.1-0.4.2** - Notion dates and relations read better; then the Notion import moves to the Notion Import plugin
- **0.4.0** - tools for Textus AI to read a database's rows and add rows
- **0.3.0** - Textus's own menus for properties, filters and options, and no frame around the block
- **0.2.0** - Notion-style filters and sorts, select options, property types, and columns and pages made in the table
- **0.1.0-0.1.1** - first versions: a folder's documents as a table, board, calendar or gallery, edited in place; a Notion CSV import; a tool for Textus AI to make a database

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `create_database`: Legt eine Datenbank im Bases-Format von Obsidian an: einen Ordner mit Notizen, deren Front Matter ihre Eigenschaften hält, und darin eine Seite mit einem ```base-Block, der sie als Tabelle, Board, Kalender, Galerie oder Liste zeigt. Gibt einen Link auf diese Seite zurück, der dorthin kommt, wo der Nutzer ihn haben will.
- `query_rows`: Liest die Zeilen einer Datenbank - die Notizen, die ihre Base wählt, standardmäßig die in ihrem Ordner -, jede mit Name, Pfad und Eigenschaften, gefiltert und sortiert.
- `add_row`: Fügt einer Datenbank eine Zeile hinzu: ein Dokument in ihrem Ordner, nach der Zeile benannt, mit ihren Eigenschaften im Front Matter. Jeder Block, der den Ordner zeigt, zeigt sie. Nur für den Ordner einer Datenbank (create_database, query_rows); eine einfache Aufgabe ist add_task.
- `create_page`: Legt eine Seite an: ein Dokument mit dem Titel oben im geöffneten Ordner oder eine Unterseite im Ordner neben ihrer übergeordneten Seite, mit Symbol, falls angegeben. Gibt ihren Pfad und den [[Link]] für die übergeordnete Seite zurück.
<!-- /ai-tools -->
