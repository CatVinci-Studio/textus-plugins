# Chart.js

Dessine des graphiques simples (courbes, barres, secteurs et autres) à partir d'une configuration Chart.js écrite dans un bloc de code.

Écrivez un bloc de code avec le langage `chartjs` qui contient une configuration Chart.js 4 : `type`, `data` avec `labels` et `datasets`, et `options` si besoin. Le graphique est dessiné juste en dessous, et un clic dans le bloc affiche de nouveau la source pour la modifier.

- Types de graphique : `line`, `bar`, `pie`, `doughnut`, `polarArea`, `radar`, `scatter` et `bubble`.
- La configuration est du JSON, mais les formes écrites à la main passent aussi : clés sans guillemets, apostrophes, virgules finales et commentaires. Les fonctions ne sont pas exécutées.
- Les séries sans couleurs propres prennent les couleurs du thème dans l'ordre, et le graphique est redessiné quand vous passez du clair au sombre.
- Écrivez `height=400` après `chartjs` sur la première ligne pour fixer la hauteur en pixels (300 par défaut).
- Si la configuration contient une erreur, une ligne sous le bloc dit ce qui ne va pas.
- Les exports HTML, PDF et Word contiennent le graphique sous forme d'image.

Il fonctionne sur ordinateur et sur iPhone et demande Textus 1.3.2 ou plus récent. Il demande une seule permission, les outils de Textus AI, pour que Textus AI puisse vérifier un bloc `chartjs` avant de l'écrire dans un document.

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

- **0.3.1** - Sa page dit maintenant en une phrase ce qu'il fait, ce qu'il permet et ce qui a changé à chaque version.
- **0.3.0** - Textus AI peut vérifier un bloc `chartjs` avant de l'écrire (`check_chartjs`).
- **0.2.0** - Les séries prennent les couleurs du thème ; demande Textus 1.3.2.
- **0.1.3** - Utilise les couleurs du document sous leurs nouveaux noms dans Textus.
- **0.1.2** - Pendant la saisie, le graphique montre toujours le texte le plus récent.
- **0.1.0-0.1.1** - Premières versions : blocs `chartjs` dessinés sous leur source, `height=`, images à l'export ; page dans la boutique et icône.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_chartjs`: Vérifie la source d'un bloc ```chartjs - une configuration Chart.js 4 en JSON : type, data avec labels et datasets, options - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
