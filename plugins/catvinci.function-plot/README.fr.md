# Tracé de fonctions

Trace des courbes de fonctions de x, une par ligne, comme sin(x) ou x^2 - 1.

## Tracer une courbe

- Écrivez un bloc de code en `function-plot`, une fonction par ligne. La courbe est tracée en dessous, et la source réapparaît quand vous cliquez dans le bloc.
- Une ligne peut commencer par `y =`. `2x` et `3sin(x)` sont des multiplications.
- Il connaît + - * / ^, les parenthèses, x, pi (π), e et sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, exp, ln, log (base 10), sqrt, abs, floor et ceil.
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

Il ne demande que **Outils pour Textus AI**, pour que Textus AI puisse vérifier un bloc avant de l’écrire. Il ne lit aucun fichier et dessine tout sur votre appareil.

## Changements

- **0.3.4** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Steep curves like tan(x) keep their shape and break at asymptotes; a function with nothing to draw says so; π and 2xsin(x) are read; Textus AI's check uses the fence's x range.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_function_plot`
- **0.2.0** - curves and axes in the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - -x^2 reads as -(x^2), and a range that ends at 0 is kept
- **0.1.0-0.1.1** - first versions: functions of x drawn as a picture, height and range settings, pictures in exports

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_function_plot`: Vérifie la source d'un bloc ```function-plot - des fonctions de x, une par ligne, avec + - * / ^, parenthèses, pi, e et les fonctions usuelles - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture, et les mots de la clôture (xmin=0 xmax=100) dans meta.
<!-- /ai-tools -->
