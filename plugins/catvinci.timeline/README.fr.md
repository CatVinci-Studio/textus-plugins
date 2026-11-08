# Chronologie

Dessine des événements en chronologie, un par ligne : quand | quoi | détails.

## Dessiner une chronologie

- Écrivez un bloc de code en `timeline`, un événement par ligne : quand, quoi, et un détail facultatif, séparés par `|`. La chronologie est dessinée en dessous, et la source réapparaît quand vous cliquez dans le bloc.
- Les événements sont dessinés dans l’ordre où vous les écrivez, le long d’une ligne, avec un point pour chacun. « Quand » peut être n’importe quel texte : une date, une année, « Jour 3 ».
- Les lignes vides sont ignorées. Ce qui suit un troisième `|` n’est pas affiché.
- `height=400` après le langage fixe la hauteur du dessin.
- Elle prend les couleurs du thème et est redessinée quand le thème change.
- À l’export en HTML, PDF ou Word, la chronologie devient une image.

## Exemple

```timeline
2024-03 | Premier jet | Le plan et deux chapitres
2024-09 | Relecture | Les notes de trois lecteurs
2025-01 | Publication
```

## Autorisations

Il ne demande que **Outils pour Textus AI**, pour que Textus AI puisse vérifier un bloc avant de l’écrire. Il ne lit aucun fichier et dessine tout sur votre appareil, sur ordinateur comme sur iOS.

## Changements

- **0.3.0** - un outil pour Textus AI, `check_timeline`
- **0.2.0** - les couleurs du thème, redessinée quand le thème change
- **0.1.3** - le texte aux couleurs du thème sous Textus 1.3
- **0.1.2** - suit les modifications rapides : un ancien dessin ne remplace plus un plus récent
- **0.1.0-0.1.1** - premières versions : événements dessinés en chronologie, hauteur réglable, images à l’export

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_timeline`: Vérifie la source d'un bloc ```timeline - un événement par ligne, écrit quand | quoi | plus - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
