# WaveDrom

Dessine des chronogrammes numériques et des champs de registres à partir de WaveJSON.

## Dessiner un chronogramme

- Écrivez un bloc de code en `wavedrom` contenant du WaveJSON. Le chronogramme est dessiné en dessous, et la source réapparaît quand vous cliquez dans le bloc.
- `signal` contient les signaux : chacun a un `name`, une chaîne `wave` (`p n h l 0 1 x z . |` et `= 2-9` pour les valeurs) et `data` pour les étiquettes des valeurs. Une liste qui commence par une étiquette regroupe des signaux ; `{}` laisse un espace.
- `reg` dessine plutôt les champs d’un registre : `{ reg: [{ bits: 8, name: "data" }] }`.
- Le JSON écrit à la main passe : clés sans guillemets, apostrophes, virgules finales et commentaires `//`.
- Une erreur dans la source est signalée sous le bloc.
- `height=400` après le langage fixe la hauteur du dessin.
- Avec un thème sombre, il utilise l’apparence sombre de WaveDrom. À l’export en HTML, PDF ou Word, le chronogramme devient une image, dessinée aux couleurs de l’export.

## Exemple

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```

## Autorisations

Il ne demande que **Outils pour Textus AI**, pour que Textus AI puisse vérifier un bloc avant de l’écrire. WaveDrom est fourni avec le plugin : il ne lit aucun fichier et dessine tout sur votre appareil, sur ordinateur comme sur iOS.

## Changements

- **0.3.0** - un outil pour Textus AI, `check_wavedrom`
- **0.2.0** - redessiné quand le thème change, avec la page de graphiques de Textus 1.3.2
- **0.1.3** - le texte aux couleurs du thème sous Textus 1.3
- **0.1.2** - les exports contiennent le chronogramme aux couleurs de l’export
- **0.1.0-0.1.1** - premières versions : WaveJSON dessiné avec WaveDrom, apparence sombre, hauteur réglable, images à l’export

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_wavedrom`: Vérifie la source d'un bloc ```wavedrom - du WaveJSON : des pistes de signaux avec leurs chaînes wave et data, ou les champs d'un registre - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
