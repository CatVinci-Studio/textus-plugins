# Vue en graphe

Dessine vos notes et les liens entre elles sous forme de graphe, pour tout le dossier ou autour du document ouvert.

- **Ctrl+Alt+G** (**⌘⌥G** sur Mac), ou **Plugins › Ouvrir la vue en graphe**, montre tout le dossier dans un onglet. **Ajuster** fait tout tenir à l’écran.
- L’onglet **Graphe** de la barre latérale montre les notes autour du document ouvert. Le bouton en haut du panneau Graphe de la barre latérale ouvre tout le dossier.
- Les [[liens wiki]] comme les liens vers d’autres documents comptent ; deux notes liées l’une à l’autre partagent un seul trait. Un [[lien]] vers une note pas encore écrite apparaît comme une note à part entière.
- Cliquez sur une note pour l’ouvrir. Faites glisser une note pour la placer, le fond pour vous déplacer, et zoomez à la molette ou en pinçant. Survolez une note pour mettre ses liens en évidence. Au toucher, un premier appui sur une note met ses liens en évidence, un second l’ouvre.
- Le graphe s’adapte tout seul : les noms apparaissent quand vous zoomez, des flèches montrent le sens des liens quand ils sont assez peu nombreux, et une note très liée est plus grande. Sans groupes de couleur, chaque note prend la couleur de son dossier.
- Quand les documents du dossier changent, le graphe est redessiné.

## Réglages

Le bouton à curseurs en haut du graphe complet ouvre ses réglages ; celui de la barre latérale n’en a pas.

- **Filtres** : une recherche (`path:ideas`, `file:draft`, `tag:#todo`, un `-` devant pour exclure) ; **Tags** affiche les #tags comme nœuds ; **Fichiers existants uniquement** masque les notes pas encore écrites ; **Orphelines** (graphe complet) montre les notes sans lien.
- **Groupes** : colorez les notes qu’une recherche trouve. **Nouveau groupe** en ajoute un ; **Rétablir les valeurs par défaut** annule vos changements.

Dans un coffre Obsidian, les groupes de couleur enregistrés dans le `graph.json` d’Obsidian colorent aussi les notes, après les vôtres.

## Autorisations

- Lire les fichiers et le document : pour trouver les notes et les liens du dossier, et le `graph.json` d’Obsidian.
- Outils pour Textus AI : pour que Textus AI voie les notes autour d’un document.

## Changements

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
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_neighbours`: Le voisinage d'un document dans le graphe des notes - celui au premier plan si aucun chemin n'est donné : les notes à quelques liens, dans un sens ou l'autre, chacune avec sa distance en liens, et les liens entre elles. Un [[lien]] vers une note inexistante a le type missing.
<!-- /ai-tools -->
