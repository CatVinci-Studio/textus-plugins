# Tracé de fonctions

Des courbes de fonctions, une par ligne : sin(x), x^2 - 1.

- Écrivez un bloc de code en `function-plot` : il est dessiné en dessous, et sa source réapparaît quand vous cliquez dedans.
- `height=400` après le langage fixe la hauteur du dessin.
- À l’export en HTML, PDF ou Word, le dessin devient une image.
- `xmin=-5 xmax=5` (et `ymin`, `ymax`) après le langage fixent l’intervalle ; il connaît + - * / ^, x, pi, e et sin, cos, tan, exp, ln, log, sqrt, abs.

## Exemple

```function-plot
sin(x)
x^2 / 4 - 1
```

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_function_plot`: Vérifie la source d'un bloc ```function-plot - des fonctions de x, une par ligne, avec + - * / ^, parenthèses, pi, e et les fonctions usuelles - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
