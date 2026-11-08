# Partitions (ABC)

Dessine des partitions à partir de la notation ABC écrite dans un bloc de code.

Écrivez un bloc de code avec le langage `abc`. La musique est gravée juste en dessous, et un clic dans le bloc affiche de nouveau la source pour la modifier.

- Écrivez `height=400` après `abc` sur la première ligne pour fixer la hauteur du dessin en pixels.
- Les notes prennent la couleur du texte du thème et sont redessinées quand vous passez du clair au sombre.
- Les exports HTML, PDF et Word contiennent la musique sous forme d'image.

Il fonctionne sur ordinateur et sur iPhone et demande Textus 1.3.2 ou plus récent. Il demande une seule permission, les outils de Textus AI, pour que Textus AI puisse vérifier un bloc `abc` avant de l'écrire dans un document.

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

- **0.3.0** - Textus AI peut vérifier un bloc `abc` avant de l'écrire (`check_abc`).
- **0.2.0** - Les notes suivent la couleur du texte du thème ; demande Textus 1.3.2.
- **0.1.3** - Utilise les couleurs du document sous leurs nouveaux noms dans Textus.
- **0.1.2** - Les images exportées gardent la largeur et la hauteur de la musique.
- **0.1.0-0.1.1** - Premières versions : blocs `abc` dessinés sous leur source, `height=`, images à l'export ; page dans la boutique et icône.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_abc`: Vérifie la source d'un bloc ```abc - la notation musicale ABC : un en-tête de champs qui finit par K:, puis les notes - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
