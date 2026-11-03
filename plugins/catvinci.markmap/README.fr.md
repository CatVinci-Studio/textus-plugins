# Carte mentale

Dessine un plan Markdown (titres et listes) en carte mentale.

- Écrivez un bloc de code en `markmap` : il est dessiné en dessous, et sa source réapparaît quand vous cliquez dedans.
- `height=400` après le langage fixe la hauteur du dessin.
- À l’export en HTML, PDF ou Word, le dessin devient une image.

## Exemple

```markmap
# Project
## Goals
- Ship 1.3
- Write the guide
## People
- Writers
- Reviewers
```

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_markmap`: Vérifie la source d'un bloc ```markmap - un plan Markdown dont les titres et les éléments de liste sont les branches de la carte mentale - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
