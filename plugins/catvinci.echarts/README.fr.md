# ECharts

Dessine un graphique dans votre document à partir d’une option ECharts écrite dans un bloc de code.

Écrivez un bloc de code avec le langage `echarts` et mettez-y une option ECharts. Le graphique est dessiné sous le bloc ; cliquez dans le bloc pour revoir et modifier sa source.

- L’option est du JSON, que l’on peut écrire librement : clés sans guillemets, apostrophes, virgules finales et commentaires sont acceptés. Les fonctions (une fonction `formatter`, par exemple) ne le sont pas, car rien dans le bloc n’est exécuté.
- Barres, courbes, camemberts, nuages de points, radars, jauges, entonnoirs, arbres, treemaps, sunbursts, diagrammes de Sankey, cartes de chaleur, chandeliers et les autres séries ECharts sont dessinés. Les séries de carte ne le sont pas : elles demandent des données cartographiques qu’un bloc ne peut pas charger.
- Écrivez `height=400` après le langage pour fixer la hauteur du graphique en pixels (320 par défaut).
- Le graphique prend les couleurs de votre thème et se redessine quand vous changez de thème.
- Si l’option ne peut pas être dessinée, le bloc indique ce qui ne va pas.
- Un export en HTML, PDF ou Word contient le graphique sous forme d’image.

Le plugin demande une seule permission, pour donner à Textus AI l’outil `check_echarts` listé plus bas : il vérifie un bloc avant que Textus AI ne l’écrive dans un document.

## Exemple

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

## Changements

- **0.3.6** - A simpler icon, drawn in the text colour.
- **0.3.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Charts redraw when the panel width changes, and their text and default height follow the app's zoom and font.
- **0.3.1** - Its description no longer lists maps, which a block can't load.
- **0.3.0** - Textus AI can check an `echarts` block before it writes one.
- **0.2.0** - Series colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `echarts` code blocks drawn in the document, `height=`, and exports as a picture.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_echarts`: Vérifie la source d'un bloc ```echarts - une option ECharts en JSON : des séries avec leur type, et les axes ou composants où elles se dessinent - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
