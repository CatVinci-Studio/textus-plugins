# Étiquettes

Liste toutes les étiquettes `#tag` du dossier ouvert dans la barre latérale, avec le nombre de notes qui les utilisent.

- L’onglet **Étiquettes** liste les étiquettes, les plus utilisées d’abord. Les étiquettes imbriquées (`#project/alpha`) forment un arbre, comme dans Obsidian, et le nombre d’une étiquette compte aussi les notes des étiquettes en dessous. Tapez dans le champ de filtre pour réduire la liste.
- Ouvrez une étiquette pour voir ses notes, et cliquez sur l’une d’elles pour l’ouvrir.
- Faites un clic droit sur une étiquette et choisissez **Renommer…** pour la renommer dans toutes les notes, avec les étiquettes imbriquées dedans (`#project/alpha` devient `#new/alpha`). La casse des lettres ne compte pas. Renommez-la en une étiquette que vous avez déjà, et les deux n’en font plus qu’une. Une étiquette est faite de lettres, de chiffres, de `_`, `-` et `/`, et pas seulement de chiffres.
- Les étiquettes du front matter (`tags: [a, b]`, ou une liste sous `tags:`) sont renommées aussi. Le code, le code en ligne, les adresses des liens et les étiquettes plus longues qui commencent pareil (`#drafts` quand vous renommez `#draft`) restent tels quels.

## Autorisations

- Lire des fichiers : pour trouver les étiquettes du dossier.
- Écrire des fichiers : pour renommer une étiquette dans les notes qui l’ont.
- Outils pour Textus AI : pour que Textus AI puisse lister vos étiquettes et les notes qui en portent une.

## Changements

- **0.3.7** - Its page is in every language Textus speaks.
- **0.3.6** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Renaming leaves `[[#Heading]]` links alone, and a ``` line inside a `~~~` block no longer ends the code.
- **0.3.3** - Tags match in any letter case, as their counts do; renaming a tag moves its nested tags too and no longer touches link addresses or front-matter tags like `project-x`; tags like `a/` or `a//b` are refused.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Tags used equally often are listed in natural name order ("Week2" before "Week10").
- **0.3.0** - Nested tags form a tree, each counting the notes of the tags under it; Textus AI finds a tag's nested tags too.
- **0.2.0** - Textus AI can list your tags and the notes with a tag (`list_tags`, `notes_with_tag`).
- **0.1.0-0.1.1** - First versions: tags with their counts, a tag's notes, renaming and merging in every note; runs on desktop and iOS.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_tags`: Liste tous les #tags des documents du dossier ouvert avec le nombre de documents qui les utilisent, les plus utilisés d'abord.
- `notes_with_tag`: Liste les documents du dossier ouvert qui portent un #tag, chacun avec son titre, son chemin et ses tags.
<!-- /ai-tools -->
