# Liens bidirectionnels

Liez des notes, des titres et des blocs en tapant `[[`, intégrez-les avec `![[` et voyez dans la barre latérale ce qui lie le document ouvert.

Les liens comme `[[Note]]` sont intégrés à Textus : vous pouvez les écrire et les suivre sans plugin. Ce plugin vous aide à les écrire, affiche sur place ce vers quoi ils pointent et rassemble les liens autour du document que vous lisez.

## Lier en écrivant

- Tapez `[[` et choisissez une note dans le panneau qui s’ouvre : par son nom de fichier, son premier titre ou une entrée `aliases` de son front matter. Un alias s’écrit `[[Note|alias]]`.
- Après `#`, les titres de la note : `[[Note#Titre]]`. `[[#` liste ceux du document lui-même.
- Après `#^`, ses blocs : paragraphes, éléments de liste, tableaux, citations. Un bloc sans id en reçoit un à sa fin dans cette note (`^1a2b3c`), comme Obsidian les écrit.
- Sélectionnez quelques mots et tapez `[[` pour en faire un lien.
- Les liens s’écrivent comme le dossier les écrit : son propre choix, ou le format de liens d’un coffre Obsidian ; sinon comme la note lie déjà ; sinon un lien standard, `[Nov 8](Week45/Nov%208.md)`, qui s’ouvre dans n’importe quelle app. Un [[lien]] qui a besoin d’un chemin affiche le nom de la note.

## Intégrations

- `![[Note]]` affiche la note sur place, `![[Note#Titre]]` cette section et `![[Note#^id]]` ce bloc. Elles sont en lecture seule et se mettent à jour quand la note change.
- Placez le curseur sur la ligne pour modifier le lien lui-même.

## Les liens dans la barre latérale

L’onglet **Liens bidirectionnels** de la barre latérale montre ce qui lie le document ouvert, et vers où il pointe.

- **Mentions liées** : les lignes d’autres notes qui pointent ici, par des [[liens wiki]] ou des liens vers ce fichier. Cliquez sur l’une pour y aller.
- **Mentions non liées** : les lignes qui nomment cette note (par son nom de fichier, son premier titre ou ses `aliases`) sans lien. Faites un clic droit et choisissez **Lier** pour en faire un lien. Si la ligne emploie un alias, l’alias reste le texte du lien.
- **Liens sortants** : les notes vers lesquelles celle-ci pointe, y compris celles qui n’existent pas encore.
- Le champ du haut filtre la liste.

## Liens standard ou [[liens wiki]]

- **Extensions › Nouveaux liens : standard ou [[wiki]]…** choisit comment s’écrivent les nouveaux liens du dossier ouvert. Le choix est gardé dans le `.textus/settings.json` du dossier, et Textus comme les autres modules le suivent.
- **Extensions › Convertir les liens en liens standard…** et **Convertir les liens en [[liens wiki]]…** réécrivent les liens du document au premier plan ou de toutes les notes du dossier. Ils disent d’abord combien changeront ; chacun mène toujours au même endroit. Le code, le front matter et un lien dont la note est introuvable restent tels quels ; les images et autres fichiers restent des liens standard.

## Autorisations

- **Lire et modifier le document** : pour compléter les liens pendant la frappe et transformer une sélection en lien.
- **Lire et écrire les fichiers du dossier ouvert** : pour trouver les liens et les mentions, lier une mention non liée et donner à un bloc son `^id`.
- **Outils pour Textus AI** : pour que Textus AI puisse lister les liens d’un document.

## Changements

- **0.4.8** - Its page no longer says which devices it runs on: the store shows that.
- **0.4.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.4.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.5** - Unlinked mentions open on the right line, and Link Style is set by Textus itself (Textus 1.4.3).
- **0.4.4** - The Convert Links commands leave links inside a code block alone and convert the ones after it, and Unlinked mentions no longer lists or links names in front matter or code.
- **0.4.3** - Standard links to notes that don't exist yet now show under Outgoing links, a note's links to its own headings no longer list the note itself, and dragging a divider no longer redraws the panel.
- **0.4.2** - Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.1** - In a note with no links yet, [[ writes a standard link: the [[ being typed was taken for a wiki link the note already had.
- **0.4.0** - New Links: Standard or [[Wiki]]… chooses how the folder writes new links, and Convert Links turns a note's or the whole folder's links from one way into the other; [[ writes the folder's way, a standard link where nothing says otherwise.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - `[[` completion for notes, headings and blocks; `![[` embeds; renamed from Backlinks to Two-way Links
- **0.2.1** - the description says "two-way links", so a store search finds it
- **0.2.0** - a tool for Textus AI, `list_backlinks`
- **0.1.0-0.1.1** - first versions: linked and unlinked mentions with **Link**, outgoing links and a filter; suggested for documents with wiki links

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_backlinks`: Pour un document - celui au premier plan si aucun chemin n'est donné - liste les notes qui y renvoient (chemin, ligne, texte de la ligne), les lignes qui le nomment sans lien, et les notes vers lesquelles il renvoie.
<!-- /ai-tools -->
