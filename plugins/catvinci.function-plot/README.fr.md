# Tracé de fonctions

Trace des courbes de fonctions de x, une par ligne, comme sin(x) ou x^2 - 1.

## Tracer une courbe

- Écrivez un bloc de code en `function-plot`, une fonction par ligne. La courbe est tracée en dessous, et la source réapparaît quand vous cliquez dans le bloc.
- Une ligne peut commencer par `y =`. `2x` et `3sin(x)` sont des multiplications.
- Il connaît + - * / ^, les parenthèses, x, pi, e et sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, exp, ln, log (base 10), sqrt, abs, floor et ceil.
- x va de -10 à 10. Écrivez `xmin=-5 xmax=5` après le langage pour changer cela ; `ymin` et `ymax` fixent l’intervalle de y, qui sinon s’adapte aux courbes.
- `height=400` après le langage fixe la hauteur du dessin.
- Une ligne illisible est signalée sous le bloc, avec ce qui ne va pas.
- Chaque courbe prend une couleur du thème, et le tracé est refait quand le thème change.
- À l’export en HTML, PDF ou Word, le tracé devient une image.

## Exemple

```function-plot xmin=-5 xmax=5
sin(x)
x^2 / 4 - 1
```

## Autorisations

Il ne demande que **Outils pour Textus AI**, pour que Textus AI puisse vérifier un bloc avant de l’écrire. Il ne lit aucun fichier et dessine tout sur votre appareil, sur ordinateur comme sur iOS.

## Changements

- **0.3.1** - Sa page dit maintenant en une phrase ce qu'il fait, ce qu'il permet et ce qui a changé à chaque version.
- **0.3.0** - un outil pour Textus AI, `check_function_plot`
- **0.2.0** - courbes et axes aux couleurs du thème, redessinés quand le thème change
- **0.1.3** - le texte aux couleurs du thème sous Textus 1.3
- **0.1.2** - -x^2 se lit -(x^2), et un intervalle qui se termine à 0 est respecté
- **0.1.0-0.1.1** - premières versions : fonctions de x dessinées en image, hauteur et intervalle réglables, images à l’export

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_function_plot`: Vérifie la source d'un bloc ```function-plot - des fonctions de x, une par ligne, avec + - * / ^, parenthèses, pi, e et les fonctions usuelles - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
