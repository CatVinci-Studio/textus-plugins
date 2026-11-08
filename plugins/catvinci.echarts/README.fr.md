# ECharts

Dessine un graphique dans votre document à partir d’une option ECharts écrite dans un bloc de code.

Écrivez un bloc de code avec le langage `echarts` et mettez-y une option ECharts. Le graphique est dessiné sous le bloc ; cliquez dans le bloc pour revoir et modifier sa source.

- L’option est du JSON, que l’on peut écrire librement : clés sans guillemets, apostrophes, virgules finales et commentaires sont acceptés. Les fonctions (une fonction `formatter`, par exemple) ne le sont pas, car rien dans le bloc n’est exécuté.
- Barres, courbes, camemberts, nuages de points, radars, jauges, entonnoirs, arbres, treemaps, sunbursts, diagrammes de Sankey, cartes de chaleur, chandeliers et les autres séries ECharts sont dessinés. Les séries de carte ne le sont pas : elles demandent des données cartographiques qu’un bloc ne peut pas charger.
- Écrivez `height=400` après le langage pour fixer la hauteur du graphique en pixels (320 par défaut).
- Le graphique prend les couleurs de votre thème et se redessine quand vous changez de thème.
- Si l’option ne peut pas être dessinée, le bloc indique ce qui ne va pas.
- Un export en HTML, PDF ou Word contient le graphique sous forme d’image.

Le plugin demande une seule permission, pour donner à Textus AI l’outil `check_echarts` listé plus bas : il vérifie un bloc avant que Textus AI ne l’écrive dans un document. Il fonctionne sur ordinateur, iPhone et iPad.

## Exemple

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

## Changements

- **0.3.0** - Textus AI peut vérifier un bloc `echarts` avant de l’écrire.
- **0.2.0** - Les couleurs des séries viennent des tons du thème. Nécessite Textus 1.3.2.
- **0.1.3** - Utilise la couleur du texte du document et la taille des notes de bas de page du thème sous leurs noms de Textus 1.3.
- **0.1.0-0.1.2** - Premières versions : blocs `echarts` dessinés dans le document, `height=` et export en image.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_echarts`: Vérifie la source d'un bloc ```echarts - une option ECharts en JSON : des séries avec leur type, et les axes ou composants où elles se dessinent - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
