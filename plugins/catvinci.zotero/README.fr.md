# Zotero

Citez depuis votre bibliothèque Zotero en écrivant.

## Avant de commencer

Zotero 7 ou plus récent (Zotero 10 aussi) doit être ouvert sur le même ordinateur, avec **Paramètres › Avancé › Autoriser les autres applications de cet ordinateur à communiquer avec Zotero** activé. Le plugin ne parle qu’au Zotero de votre ordinateur ; rien n’en sort. Il fonctionne sur ordinateur.

## Citer

- Appuyez sur **Ctrl+Alt+R** (**⌘⌥R** sur Mac), choisissez **Insérer une citation depuis Zotero…** dans le menu contextuel, ou **Plugins › Insérer une citation depuis Zotero…**. Les ouvrages cités récemment viennent en premier, puis une recherche dans votre bibliothèque.
- Si des mots sont sélectionnés, ce sont eux qui sont cherchés.
- Choisissez un élément : la citation s’insère au curseur.
- Laissez le pointeur sur une citation, ou sur un lien vers un élément Zotero, pour voir ses auteurs, l’année, où il a paru et le début du résumé.
- **Plugins › Insérer la liste des références** ajoute à la fin une section **Références** avec tous les ouvrages cités dans le document, triés par premier auteur et année. Relancée, la commande remplace la liste au lieu de l’ajouter une seconde fois.

## Comment une citation s’écrit

Choisissez-le dans les réglages du plugin, sous **Une citation s’écrit** :

- **Une clé Pandoc : [@key]** (par défaut). Elles deviennent des références mises en forme à l’export avec Pandoc si vous choisissez une bibliographie (.bib) dans **Réglages › Éditeur et apparence › Exporter**.
- **Auteur et année : (Auteur, 2024)**.
- **Un lien de note Obsidian : [[@key]]**, vers la note de lecture de l’élément. Si la note n’existe pas encore, le plugin propose de la créer.
- **Un lien qui ouvre Zotero**.

La clé de citation vient du champ Citation Key de l’élément (ou d’une ligne `Citation Key:` dans Extra, comme l’écrit Better BibTeX).

## Notes de lecture

- **Plugins › Nouvelle note de lecture depuis Zotero…** crée `@citekey.md` (ou l’ouvre s’il existe) avec le titre, les auteurs, l’année, le résumé, le DOI ou l’URL de l’élément, et ses surlignages et notes dans Zotero.
- Les notes vont dans **References** dans le dossier ouvert ; changez-le avec **Dossier des notes de lecture**.
- **Modèle de note de lecture** peut désigner un fichier Markdown du dossier, comme `Templates/Literature.md`, avec `{{title}}`, `{{authors}}`, `{{year}}`, `{{abstract}}`, `{{citekey}}`, `{{DOI}}`, `{{URL}}`, `{{highlights}}`, `{{notes}}` et `{{date:YYYY-MM-DD}}`. Vide, il crée une note simple avec front matter.
- Dans un coffre Obsidian, le dossier et le modèle réglés dans les plugins Zotero Integration ou Citations sont suivis. Un modèle écrit pour un autre langage de modèles est remplacé par la note simple.

## Autorisations

- **Réseau, localhost:23119 seulement** : pour joindre l’API locale de Zotero sur cet ordinateur.
- **Lire et modifier le document** : pour insérer les citations et la liste des références, et chercher les mots sélectionnés.
- **Lire et écrire les fichiers du dossier ouvert** : pour lire les modèles et les réglages Zotero d’un coffre, et créer les notes de lecture.
- **Outils pour Textus AI** : pour que Textus AI puisse chercher dans votre bibliothèque.

## Changements

- **0.4.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.4.4** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. Needs Textus 1.4.3.
- **0.4.3** - A citation now replaces the selected words; the References list no longer says Zotero is unreachable when it answers, and hover previews show up more reliably.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its code is split into smaller files by what each part does; nothing changes in use.
- **0.4.0** - literature note templates are filled by Textus's own template engine; needs Textus 1.3.10
- **0.3.0** - literature notes from Zotero, with a template and an Obsidian vault's settings; citations as `[[@citekey]]`
- **0.2.1** - the shortcut moves from Ctrl+Alt+C to Ctrl+Alt+R
- **0.2.0** - a tool for Textus AI, `search_library`
- **0.1.3** - listed for the desktop only
- **0.1.2** - works with Zotero 10's local API; the references list is replaced when made again, and code is never read for citations
- **0.1.0-0.1.1** - first versions: citing with recent works first, hover cards for citations, the references list, four citation styles

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `search_library`: Cherche dans la bibliothèque Zotero de l'utilisateur sur cet ordinateur (Zotero 7 ou plus récent doit être ouvert) : la clé, le titre, les auteurs, l'année, le type, la source et la clé de citation de chaque élément, et la citation à insérer dans le style choisi. Échoue en disant quoi faire quand Zotero est injoignable.
<!-- /ai-tools -->
