# Espacement CJK

Met une espace entre le texte chinois ou japonais et les lettres latines ou les chiffres.

## Espacer un document

- Choisissez **Plugins › Ajouter des espaces entre CJK et latin**, ou la même entrée du menu contextuel. 用Textus写作 devient 用 Textus 写作. Tout le document change en une seule étape d’annulation, et un message indique combien de blocs ont changé.
- Activez **Aussi à l’enregistrement** dans les réglages du plugin pour espacer chaque document quand il est enregistré. Seuls les paragraphes, titres, listes et autres textes changent.
- Le coréen n’est pas touché : il sépare déjà ses mots par des espaces.

## Ce qui reste tel quel

- Le code, les formules, les liens et liens wiki, les notes de bas de page, les #tags, les rappels (@…), les commentaires %%, le HTML et le front matter, à l’enregistrement aussi.
- Ce qu’écrit Obsidian : identifiants de bloc (^1a2b3c), champs Dataview (key:: value), ==surlignages== et champs d’Obsidian Tasks (📅 2026-11-07).

## Autorisations

- **Lire et modifier le document** : pour espacer le document ouvert.
- **Écrire des fichiers** : pour espacer un document à l’enregistrement, quand **Aussi à l’enregistrement** est activé.
- **Outils pour Textus AI** : pour que Textus AI puisse espacer un texte pour vous.

## Changements

- **0.3.1** - Its page shows its list of changes in English in every language.
- **0.3.0** - From Textus 1.4.4, a paragraph missing a space between CJK and Latin text is underlined; its card adds the spaces. Turn it off in the plugin's settings.
- **0.2.4** - A code block inside a longer fence (```` holding ```) is left alone.
- **0.2.3** - Its Textus AI tool says what it does: Chinese and Japanese, not Korean.
- **0.2.2** - leaves Obsidian's block ids, Dataview fields, highlights and Tasks fields as written
- **0.2.1** - leaves #tags, reminders and %% comments alone; on save only prose blocks change
- **0.2.0** - a tool for Textus AI, `fix_cjk_spacing`
- **0.1.3** - runs on the desktop and on iOS
- **0.1.2** - leaves links, wiki links, footnotes, tags and front matter alone
- **0.1.0-0.1.1** - first versions: the command in the right-click and Plugins menus, and spacing on save

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `fix_cjk_spacing`: Met une espace entre les caractères chinois ou japonais et les lettres latines ou les chiffres d'un Markdown, sans toucher au code ni aux liens, comme la commande de l'extension. Renvoie le texte espacé ; n'écrit rien.
<!-- /ai-tools -->
