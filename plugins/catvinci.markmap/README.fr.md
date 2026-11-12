# Carte mentale

Dessine un plan Markdown, fait de titres et de listes, en carte mentale dans un bloc de code.

Écrivez un bloc de code avec le langage `markmap` et mettez-y un plan : les titres (`#`, `##`) et les éléments de liste sont les branches de la carte. La carte est dessinée sous le bloc ; cliquez dans le bloc pour revoir et modifier sa source.

- Faites glisser la carte pour la déplacer, et zoomez ou dézoomez. Cliquez sur le point d’une branche pour la replier ou la déplier.
- Écrivez `height=400` après le langage pour fixer la hauteur de la carte en pixels (360 par défaut).
- Les branches prennent les couleurs de votre thème, et la carte se redessine quand vous changez de thème.
- Un export en HTML, PDF ou Word contient la carte sous forme d’image, même si elle est hors de vue.

Le plugin utilise [markmap](https://markmap.js.org). Il demande une seule permission, pour donner à Textus AI l’outil `check_markmap` listé plus bas : il vérifie un bloc avant que Textus AI ne l’écrive dans un document. Il fonctionne sur ordinateur, iPhone et iPad.

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

## Changements

- **0.3.3** - Faire défiler sur une carte mentale fait maintenant défiler la note ; pincez ou utilisez Ctrl et la molette pour zoomer. La carte reprend la police et les couleurs de votre thème, en mode sombre aussi, et s’ouvre entièrement ajustée.
- **0.3.2** - Sa page dit maintenant en une phrase ce qu'il fait, ce qu'il permet et ce qui a changé à chaque version.
- **0.3.1** - Une carte mentale hors de vue s’exporte en image et non plus en source.
- **0.3.0** - Textus AI peut vérifier un bloc `markmap` avant de l’écrire.
- **0.2.0** - Les couleurs des branches viennent des tons du thème. Nécessite Textus 1.3.2.
- **0.1.3** - Utilise la couleur du texte du document et la taille des notes de bas de page du thème sous leurs noms de Textus 1.3.
- **0.1.0-0.1.2** - Premières versions : blocs `markmap` dessinés dans le document, `height=` et export en image aux couleurs de l’export.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_markmap`: Vérifie la source d'un bloc ```markmap - un plan Markdown dont les titres et les éléments de liste sont les branches de la carte mentale - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
