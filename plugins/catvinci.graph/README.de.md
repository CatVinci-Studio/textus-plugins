# Graphansicht

Zeichnet Ihre Notizen und die Links zwischen ihnen als Graph, für den ganzen Ordner oder rund um das geöffnete Dokument.

- **Strg+Alt+G** (**⌘⌥G** auf dem Mac) oder **Plugins › Graphansicht öffnen** zeigt den ganzen Ordner in einem Tab. **Einpassen** holt alles ins Bild.
- Der Reiter **Graph** in der Seitenleiste zeigt die Notizen rund um das geöffnete Dokument. Die Schaltfläche oben im Graph-Bereich der Seitenleiste öffnet den ganzen Ordner.
- [[Wiki-Links]] und Links auf andere Dokumente zählen beide; zwei Notizen, die aufeinander verlinken, teilen sich eine Linie. Ein [[Link]] auf eine noch nicht geschriebene Notiz erscheint als eigene Notiz.
- Ein Klick öffnet eine Notiz. Ziehen Sie eine Notiz, um sie zu platzieren, den Hintergrund, um sich zu bewegen, und zoomen Sie mit dem Mausrad oder per Zwei-Finger-Geste. Zeigen Sie auf eine Notiz, um ihre Links hervorzuheben. Per Touch hebt ein erstes Tippen auf eine Notiz ihre Links hervor, ein zweites öffnet sie.
- Der Graph passt sich selbst an: Namen erscheinen beim Hineinzoomen, Pfeile zeigen die Richtung der Links, wenn es wenige genug sind, und Notizen mit mehr Links sind größer. Ohne Farbgruppen bekommt jede Notiz die Farbe ihres Ordners.
- Ändern sich Dokumente im Ordner, wird der Graph neu gezeichnet.

## Einstellungen

Die Schieberegler-Schaltfläche oben im ganzen Graphen öffnet seine Einstellungen; der Graph in der Seitenleiste hat keine.

- **Filter**: eine Suche (`path:ideas`, `file:draft`, `tag:#todo`, ein `-` davor schließt aus); **Tags** zeigt #Tags als Knoten; **Nur vorhandene Dateien** blendet noch nicht geschriebene Notizen aus; **Verwaiste Notizen** (ganzer Graph) zeigt Notizen ohne Links.
- **Gruppen**: färben die Notizen, die eine Suche findet. **Neue Gruppe** fügt eine hinzu; **Standard wiederherstellen** nimmt Ihre Änderungen zurück.

In einem Obsidian-Vault färben auch die in Obsidians `graph.json` gespeicherten Farbgruppen die Notizen, nach Ihren eigenen.

## Berechtigungen

- Dateien und Dokument lesen: um die Notizen und Links des Ordners und Obsidians `graph.json` zu finden.
- Werkzeuge für Textus AI: damit Textus AI die Notizen rund um ein Dokument sehen kann.

## Änderungen

- **0.5.10** - By touch, a first tap on a note lights it and its links and a second opens it; notes are easier to hit with a finger, and a second finger zooms instead of also moving the graph. Its settings open in Textus's own popover.
- **0.5.9** - Esc while dragging a note or the view puts it back, and a touch the system cancels no longer leaves a drag stuck.
- **0.5.8** - The graph in the sidebar spreads out to fit its panel, instead of starting as a small clump with labels on top of each other. Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.5.7** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.6** - The counts and buttons at the top of the graph tab stay in view: scrolling or pinching over the graph no longer pushes them up under the tab. Labels no longer pile on top of each other: the most linked notes keep theirs and the rest show as you zoom in. A big folder opens already laid out instead of unfolding, and pictures and other attachments a note links to stay out of the graph unless you turn on Attachments in its settings. Switching documents or saving no longer shakes the whole graph loose to settle again.
- **0.5.5** - Standard Markdown links to notes not written yet are placed as Textus places them, and merge with [[links]] to the same note. Fit spreads a small graph over the whole pane, so names no longer sit on each other. Ctrl/Cmd-click opens a note beside the one in front. Labels follow the interface text size, and folder colours follow the theme. The sidebar graph has no settings of its own any more.
- **0.5.4** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the graph, not the document behind it. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.5.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.2** - Obsidian's colour groups come from the nearest vault, even one above the open folder. Needs Textus 1.3.10.
- **0.5.1** - In an Obsidian vault, the colour groups in `.obsidian/graph.json` colour the notes too.
- **0.5.0** - [[Links]] are matched to notes the same way Textus matches them when you click one.
- **0.4.0** - Textus AI can see the notes around a document (`list_neighbours`).
- **0.3.0** - Textus's own controls and menus; colours from the theme.
- **0.2.0-0.2.1** - A settings panel with filters, search and colour groups; tags as nodes; arrows for link direction; the sidebar graph's depth.
- **0.1.0-0.1.1** - First versions: the whole folder in a tab and the notes around the open document in the sidebar, coloured by folder, smooth with thousands of notes.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_neighbours`: Die Umgebung eines Dokuments im Notizgraphen - des vorderen, wenn kein Pfad angegeben ist: die Notizen wenige Links entfernt, in beide Richtungen, jede mit ihrem Abstand, und die Links zwischen ihnen. Ein [[Link]] ins Leere hat die Art missing.
<!-- /ai-tools -->
