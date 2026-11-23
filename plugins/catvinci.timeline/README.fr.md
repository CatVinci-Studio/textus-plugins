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

Il ne demande que **Outils pour Textus AI**, pour que Textus AI puisse vérifier un bloc avant de l’écrire. Il ne lit aucun fichier et dessine tout sur votre appareil.

## Changements

- **0.4.1** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.4.0** - A database can be shown as a timeline: pick Timeline among its views, and its dated rows line up in order; a click opens a row. Needs Textus 1.4.6.
- **0.3.3** - A date no longer breaks in the middle ("2024-0" over "3"); a chart drawn while its block was folded fits once it opens.
- **0.3.2** - long notes and dates wrap to fit a narrow island, the timeline uses the document's font, and an empty block says what to write
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_timeline`
- **0.2.0** - the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - keeps up with quick edits: an older drawing never replaces a newer one
- **0.1.0-0.1.1** - first versions: events drawn as a timeline, a height setting, pictures in exports

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_timeline`: Vérifie la source d'un bloc ```timeline - un événement par ligne, écrit quand | quoi | plus - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
