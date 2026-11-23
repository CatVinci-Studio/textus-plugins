# Numérotation des titres

Affiche des numéros devant vos titres pendant l’écriture (1, 1.1, 1.2) sans changer le texte.

- Chaque titre affiche son numéro devant lui pendant que vous écrivez : 1, 1.1, 1.2, 2… Les numéros sont seulement dessinés ; le texte du document reste tel quel.
- La numérotation commence au niveau de titre le plus haut du document, ou au niveau suivant quand ce niveau ne contient que le titre principal.
- Un document qui numérote déjà ses titres à la main ne reçoit pas de numéros en plus. C’est le cas quand la plupart des titres de premier niveau commencent par un numéro comme `1.`, `1.2`, `一、`, `第一章` ou `(一)`.
- Obsidian : `number headings: off` dans les propriétés d’un document (le réglage du plugin Number Headings d’Obsidian) retire les numéros de ce document.
- **Numéros dans les exports** (**Réglages › Extensions › Modules › Numérotation des titres**, activé par défaut) : les exports HTML et PDF affichent les mêmes numéros.

Le plugin lit les titres du document ouvert (permission de lire l’éditeur) et donne à Textus AI l’outil `number_headings` ci-dessous (permission des outils d’IA). L’outil renvoie le texte avec les numéros écrits ou retirés ; il ne modifie aucun fichier. Il fonctionne sur ordinateur, iPhone et iPad.

## Changements

- **0.2.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.2.4** - With two documents open side by side, both show their heading numbers, not only the one you are typing in.
- **0.2.3** - Front matter and code blocks no longer get numbers by mistake, and exports number only top-level headings, like the editor.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - No numbers on a document numbered by hand, or one whose front matter says `number headings: off`.
- **0.2.0** - Textus AI can write heading numbers into Markdown, or take them out.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - Numbering starts at the document's own top heading level instead of a setting.
- **0.1.0-0.1.1** - First versions: numbers before headings while writing, and in HTML and PDF exports.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `number_headings`: Écrit des numéros dans les titres d'un Markdown - 1, 1.1, 1.2 -, comptés comme l'éditeur les montre (un titre unique n'est pas numéroté), en remplaçant ceux déjà là ; avec remove, les retire. Renvoie le texte ; n'écrit rien.
<!-- /ai-tools -->
