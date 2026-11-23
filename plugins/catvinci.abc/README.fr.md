# Partitions (ABC)

Dessine des partitions à partir de la notation ABC écrite dans un bloc de code.

Écrivez un bloc de code avec le langage `abc`. La musique est gravée juste en dessous, et un clic dans le bloc affiche de nouveau la source pour la modifier.

- Les mesures passent à la ligne pour tenir dans la colonne, et les notes restent lisibles dans un panneau étroit.
- Les notes prennent la couleur du texte du thème et sont redessinées quand vous passez du clair au sombre.
- Les exports HTML, PDF et Word contiennent la musique sous forme d'image.

Il demande Textus 1.3.2 ou plus récent. Il demande une seule permission, les outils de Textus AI, pour que Textus AI puisse vérifier un bloc `abc` avant de l'écrire dans un document.

## Exemple

```abc
X:1
T:Scale
M:4/4
L:1/4
K:C
C D E F | G A B c |
```

## Changements

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Bars wrap to the column instead of the whole score shrinking; clicking a note no longer turns it red; `check_abc` accepts full mode names, any note length, `+:` lines, `` ` `` and `$`; `height=` is gone.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check an `abc` block before writing it (`check_abc`).
- **0.2.0** - The notes follow the theme's text color; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - Exported pictures keep the music's width and height.
- **0.1.0-0.1.1** - First versions: `abc` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_abc`: Vérifie la source d'un bloc ```abc - la notation musicale ABC : un en-tête de champs qui finit par K:, puis les notes - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
