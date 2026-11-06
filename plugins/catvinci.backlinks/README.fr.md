# Liens bidirectionnels

> Les liens comme `[[Note]]` sont intégrés à Textus : vous les écrivez et les suivez sans aucun plugin. Ce plugin vous aide à les écrire, montre sur place ce qu’ils désignent et liste qui renvoie au document ouvert.

## Lier en écrivant

- Tapez `[[` et choisissez une note dans le panneau qui s’ouvre : par son nom, son premier titre ou un `aliases` de son front matter. Un alias s’écrit `[[Note|alias]]`.
- Après `#`, les titres de la note : `[[Note#Titre]]`. `[[#` liste ceux du document lui-même.
- Après `#^`, ses blocs : paragraphes, éléments de liste, tableaux, citations. Un bloc sans id en reçoit un à sa fin dans cette note (`^1a2b3c`), comme Obsidian les écrit.
- Sélectionnez quelques mots et tapez `[[` pour en faire un lien.
- Les liens sont écrits comme le dossier les écrit : dans un coffre Obsidian, au format de lien du coffre.

## Intégrations

- `![[Note]]` affiche la note sur place, `![[Note#Titre]]` cette section et `![[Note#^id]]` ce bloc – en lecture seule, et à jour quand la note change.
- Placez le curseur sur la ligne pour modifier le lien lui-même.

## Rétroliens dans la barre latérale

Ce qui pointe vers le document ouvert, et ce vers quoi il pointe, dans l’onglet **Liens bidirectionnels** de la barre latérale.

- **Mentions liées** : les lignes d’autres notes qui pointent ici, par des [[liens wiki]] ou des liens vers ce fichier. Cliquez sur l’une d’elles pour y aller.
- **Mentions non liées** : les lignes qui nomment cette note – par son nom de fichier, son premier titre ou les `aliases` de son front matter – sans lien. Clic droit, puis **Lier**, pour en faire un [[lien]].
- **Liens sortants** : les notes vers lesquelles celle-ci pointe, y compris celles qui n’existent pas encore.
- Le champ du haut filtre la liste.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_backlinks`: Pour un document - celui au premier plan si aucun chemin n'est donné - liste les notes qui y renvoient (chemin, ligne, texte de la ligne), les lignes qui le nomment sans lien, et les notes vers lesquelles il renvoie.
<!-- /ai-tools -->
