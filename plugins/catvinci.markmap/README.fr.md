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

- **0.3.8** - The mind map fills its block: a small one grows (up to twice its size) to the block's width and the height you give it, and it follows the note's zoom instead of being cut off on the right. Its page no longer says which devices it runs on: the store shows that.
- **0.3.7** - Its package lists the libraries it carries, with their licenses.
- **0.3.6** - A mind map drawn before its note was laid out no longer shows an error.
- **0.3.5** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.4** - Editing a mind map for a long time no longer makes Textus use more and more memory.
- **0.3.3** - Scrolling over a mind map now scrolls the note; pinch or Ctrl-scroll to zoom. The map uses your theme's font and colors, in dark mode too, and opens fully fitted.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - A mind map scrolled out of sight exports as its picture instead of its source.
- **0.3.0** - Textus AI can check a `markmap` block before it writes one.
- **0.2.0** - Branch colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `markmap` code blocks drawn in the document, `height=`, and exports as a picture in the export's colors.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_markmap`: Vérifie la source d'un bloc ```markmap - un plan Markdown dont les titres et les éléments de liste sont les branches de la carte mentale - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
