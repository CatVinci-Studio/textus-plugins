# Vue en graphe

Vos notes et les liens entre elles, sous forme de graphe.

- **Ctrl+Alt+G** (**⌘⌥G** sur Mac), ou **Extensions › Ouvrir la vue en graphe**, montre tout le dossier dans un onglet.
- L’onglet **Graphe** de la barre latérale montre les notes autour du document ouvert.
- Les [[liens wiki]] comme les liens vers d’autres documents comptent. Cliquez sur une note pour l’ouvrir (avec Ctrl ou ⌘, dans un nouvel onglet) ; faites glisser pour vous déplacer, la molette pour zoomer.
- Le bouton à curseurs en haut ouvre les réglages du graphe :
  - **Filtres** : recherche (`path:idées`, `file:brouillon`, `tag:#àfaire`, un `-` pour exclure), tags comme nœuds, notes pas encore créées, notes sans liens. Le graphe latéral règle aussi jusqu’où il va.
  - **Groupes** : colorez les notes qu’une recherche trouve.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_neighbours`: Le voisinage d'un document dans le graphe des notes - celui au premier plan si aucun chemin n'est donné : les notes à quelques liens, dans un sens ou l'autre, chacune avec sa distance en liens, et les liens entre elles. Un [[lien]] vers une note inexistante a le type missing.
<!-- /ai-tools -->
