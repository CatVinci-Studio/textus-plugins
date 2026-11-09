# Vue en graphe

Dessine vos notes et les liens entre elles sous forme de graphe, pour tout le dossier ou autour du document ouvert.

- **Ctrl+Alt+G** (**⌘⌥G** sur Mac), ou **Plugins › Ouvrir la vue en graphe**, montre tout le dossier dans un onglet. **Ajuster** fait tout tenir à l’écran.
- L’onglet **Graphe** de la barre latérale montre les notes autour du document ouvert. **Graphe complet** ouvre tout le dossier.
- Les [[liens wiki]] comme les liens vers d’autres documents comptent ; deux notes liées l’une à l’autre partagent un seul trait. Un [[lien]] vers une note pas encore écrite apparaît comme une note à part entière.
- Cliquez sur une note pour l’ouvrir. Faites glisser une note pour la placer, le fond pour vous déplacer, et zoomez à la molette ou en pinçant. Survolez une note pour mettre ses liens en évidence.
- Le graphe s’adapte tout seul : les noms apparaissent quand vous zoomez, des flèches montrent le sens des liens quand ils sont assez peu nombreux, et une note très liée est plus grande. Sans groupes de couleur, chaque note prend la couleur de son dossier.
- Quand les documents du dossier changent, le graphe est redessiné.

## Réglages

Le bouton à curseurs en haut ouvre les réglages du graphe. Le graphe complet et celui de la barre latérale ont chacun les leurs.

- **Filtres** : une recherche (`path:ideas`, `file:draft`, `tag:#todo`, un `-` devant pour exclure) ; **Tags** affiche les #tags comme nœuds ; **Fichiers existants uniquement** masque les notes pas encore écrites ; **Orphelines** (graphe complet) montre les notes sans lien. Dans la barre latérale, **Profondeur** règle jusqu’à combien de liens il va, de 1 à 5.
- **Groupes** : colorez les notes qu’une recherche trouve. **Nouveau groupe** en ajoute un ; **Rétablir les valeurs par défaut** annule vos changements.

Dans un coffre Obsidian, les groupes de couleur enregistrés dans le `graph.json` d’Obsidian colorent aussi les notes, après les vôtres.

## Autorisations

- Lire les fichiers et le document : pour trouver les notes et les liens du dossier, et le `graph.json` d’Obsidian.
- Outils pour Textus AI : pour que Textus AI voie les notes autour d’un document.

## Changements

- **0.5.4** - Un pincement sur le trackpad zoome en douceur, au rythme du geste ; avec Textus 1.3.13, un pincement sur Mac zoome le graphe, pas le document derrière.
- **0.5.3** - Ses barres, listes et contrôles sont désormais ceux de Textus, grandissent avec l’interface et suivent chaque thème ; nécessite Textus 1.3.12.
- **0.5.2** - Les groupes de couleur d’Obsidian sont lus dans le coffre le plus proche, même au-dessus du dossier ouvert. Nécessite Textus 1.3.10.
- **0.5.1** - Dans un coffre Obsidian, les groupes de couleur de `.obsidian/graph.json` colorent aussi les notes.
- **0.5.0** - Les [[liens]] sont rattachés aux notes de la même façon que lorsqu’on clique dessus dans Textus.
- **0.4.0** - Textus AI peut voir les notes autour d’un document (`list_neighbours`).
- **0.3.0** - Contrôles et menus propres à Textus ; couleurs du thème.
- **0.2.0-0.2.1** - Panneau de réglages avec filtres, recherche et groupes de couleur ; tags comme nœuds ; flèches pour le sens des liens ; profondeur du graphe latéral.
- **0.1.0-0.1.1** - Premières versions : tout le dossier dans un onglet et les notes autour du document ouvert dans la barre latérale, colorées par dossier, fluides même avec des milliers de notes.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_neighbours`: Le voisinage d'un document dans le graphe des notes - celui au premier plan si aucun chemin n'est donné : les notes à quelques liens, dans un sens ou l'autre, chacune avec sa distance en liens, et les liens entre elles. Un [[lien]] vers une note inexistante a le type missing.
<!-- /ai-tools -->
