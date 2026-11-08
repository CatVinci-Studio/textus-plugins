# Liens bidirectionnels

Liez des notes, des titres et des blocs en tapant `[[`, intégrez-les avec `![[` et voyez dans la barre latérale ce qui lie le document ouvert.

Les liens comme `[[Note]]` sont intégrés à Textus : vous pouvez les écrire et les suivre sans plugin. Ce plugin vous aide à les écrire, affiche sur place ce vers quoi ils pointent et rassemble les liens autour du document que vous lisez. Il fonctionne sur ordinateur et sur iOS.

## Lier en écrivant

- Tapez `[[` et choisissez une note dans le panneau qui s’ouvre : par son nom de fichier, son premier titre ou une entrée `aliases` de son front matter. Un alias s’écrit `[[Note|alias]]`.
- Après `#`, les titres de la note : `[[Note#Titre]]`. `[[#` liste ceux du document lui-même.
- Après `#^`, ses blocs : paragraphes, éléments de liste, tableaux, citations. Un bloc sans id en reçoit un à sa fin dans cette note (`^1a2b3c`), comme Obsidian les écrit.
- Sélectionnez quelques mots et tapez `[[` pour en faire un lien.
- Les liens s’écrivent comme le dossier les écrit : dans un coffre Obsidian, au format de liens du coffre.

## Intégrations

- `![[Note]]` affiche la note sur place, `![[Note#Titre]]` cette section et `![[Note#^id]]` ce bloc. Elles sont en lecture seule et se mettent à jour quand la note change.
- Placez le curseur sur la ligne pour modifier le lien lui-même.

## Les liens dans la barre latérale

L’onglet **Liens bidirectionnels** de la barre latérale montre ce qui lie le document ouvert, et vers où il pointe.

- **Mentions liées** : les lignes d’autres notes qui pointent ici, par des [[liens wiki]] ou des liens vers ce fichier. Cliquez sur l’une pour y aller.
- **Mentions non liées** : les lignes qui nomment cette note (par son nom de fichier, son premier titre ou ses `aliases`) sans lien. Faites un clic droit et choisissez **Lier** pour en faire un lien. Si la ligne emploie un alias, l’alias reste le texte du lien.
- **Liens sortants** : les notes vers lesquelles celle-ci pointe, y compris celles qui n’existent pas encore.
- Le champ du haut filtre la liste.

## Autorisations

- **Lire et modifier le document** : pour compléter les liens pendant la frappe et transformer une sélection en lien.
- **Lire et écrire les fichiers du dossier ouvert** : pour trouver les liens et les mentions, lier une mention non liée et donner à un bloc son `^id`.
- **Outils pour Textus AI** : pour que Textus AI puisse lister les liens d’un document.

## Changements

- **0.3.1** - Sa page dit maintenant en une phrase ce qu'il fait, ce qu'il permet et ce qui a changé à chaque version.
- **0.3.0** - complétion des notes, titres et blocs avec `[[` ; intégrations avec `![[` ; le nom passe de Rétroliens à Liens bidirectionnels
- **0.2.1** - la description dit « liens bidirectionnels », pour que la recherche de la boutique le trouve
- **0.2.0** - un outil pour Textus AI, `list_backlinks`
- **0.1.0-0.1.1** - premières versions : mentions liées et non liées avec **Lier**, liens sortants et un filtre ; proposé pour les documents qui contiennent des liens wiki

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_backlinks`: Pour un document - celui au premier plan si aucun chemin n'est donné - liste les notes qui y renvoient (chemin, ligne, texte de la ligne), les lignes qui le nomment sans lien, et les notes vers lesquelles il renvoie.
<!-- /ai-tools -->
