# Rétroliens

> Les liens bidirectionnels comme `[[Note]]` sont intégrés à Textus : on les écrit et on les suit sans aucun plugin. Ce plugin ajoute l'autre moitié : qui renvoie vers le document ouvert.

Ce qui pointe vers le document ouvert, et ce vers quoi il pointe, dans l’onglet **Rétroliens** de la barre latérale.

- **Mentions liées** : les lignes d’autres notes qui pointent ici, par des [[liens wiki]] ou des liens vers ce fichier. Cliquez sur l’une d’elles pour y aller.
- **Mentions non liées** : les lignes qui nomment cette note – par son nom de fichier, son premier titre ou les `aliases` de son front matter – sans lien. Clic droit, puis **Lier**, pour en faire un [[lien]].
- **Liens sortants** : les notes vers lesquelles celle-ci pointe, y compris celles qui n’existent pas encore.
- Le champ du haut filtre la liste.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_backlinks`: Pour un document - celui au premier plan si aucun chemin n'est donné - liste les notes qui y renvoient (chemin, ligne, texte de la ligne), les lignes qui le nomment sans lien, et les notes vers lesquelles il renvoie.
<!-- /ai-tools -->
