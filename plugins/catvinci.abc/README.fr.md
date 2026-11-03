# Partitions (ABC)

Des partitions à partir de la notation ABC.

- Écrivez un bloc de code en `abc` : il est dessiné en dessous, et sa source réapparaît quand vous cliquez dedans.
- `height=400` après le langage fixe la hauteur du dessin.
- À l’export en HTML, PDF ou Word, le dessin devient une image.

## Exemple

```abc
X:1
T:Scale
M:4/4
L:1/4
K:C
C D E F | G A B c |
```

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_abc`: Vérifie la source d'un bloc ```abc - la notation musicale ABC : un en-tête de champs qui finit par K:, puis les notes - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
