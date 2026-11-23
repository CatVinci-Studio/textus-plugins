# Chart.js

Dessine des graphiques simples (courbes, barres, secteurs et autres) à partir d'une configuration Chart.js écrite dans un bloc de code.

Écrivez un bloc de code avec le langage `chartjs` qui contient une configuration Chart.js 4 : `type`, `data` avec `labels` et `datasets`, et `options` si besoin. Le graphique est dessiné juste en dessous, et un clic dans le bloc affiche de nouveau la source pour la modifier.

- Types de graphique : `line`, `bar`, `pie`, `doughnut`, `polarArea`, `radar`, `scatter` et `bubble`.
- La configuration est du JSON, mais les formes écrites à la main passent aussi : clés sans guillemets, apostrophes, virgules finales et commentaires. Les fonctions ne sont pas exécutées.
- Les séries sans couleurs propres prennent les couleurs du thème dans l'ordre, et le graphique est redessiné quand vous passez du clair au sombre.
- Écrivez `height=400` après `chartjs` sur la première ligne pour fixer la hauteur en pixels (300 par défaut).
- Si la configuration contient une erreur, une ligne sous le bloc dit ce qui ne va pas.
- Les exports HTML, PDF et Word contiennent le graphique sous forme d'image.

Il demande Textus 1.3.2 ou plus récent. Il demande une seule permission, les outils de Textus AI, pour que Textus AI puisse vérifier un bloc `chartjs` avant de l'écrire dans un document.

## Exemple

```chartjs
{
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [{ label: "Words", data: [1200, 1900, 3000] }]
  }
}
```

## Changements

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Charts redraw to fit a narrower or wider panel, labels follow the theme's font and text size, and the error line is red again.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check a `chartjs` block before writing it (`check_chartjs`).
- **0.2.0** - Series take the theme's colors; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - While you type, the chart always shows the latest text.
- **0.1.0-0.1.1** - First versions: `chartjs` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_chartjs`: Vérifie la source d'un bloc ```chartjs - une configuration Chart.js 4 en JSON : type, data avec labels et datasets, options - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
