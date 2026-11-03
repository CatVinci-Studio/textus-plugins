# WaveDrom

Des chronogrammes numériques à partir de WaveJSON.

- Écrivez un bloc de code en `wavedrom` : il est dessiné en dessous, et sa source réapparaît quand vous cliquez dedans.
- `height=400` après le langage fixe la hauteur du dessin.
- À l’export en HTML, PDF ou Word, le dessin devient une image.

## Exemple

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_wavedrom`: Vérifie la source d'un bloc ```wavedrom - du WaveJSON : des pistes de signaux avec leurs chaînes wave et data, ou les champs d'un registre - avant qu'il n'entre dans un document, sans le dessiner. Renvoie ok, ou les problèmes à corriger d'abord. Passez la source sans sa clôture.
<!-- /ai-tools -->
