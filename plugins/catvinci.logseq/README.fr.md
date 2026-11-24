# Dossiers Logseq

Ouvre un graphe Logseq comme Logseq l’écrit : liens par nom de page, images dans assets, journaux dans leur dossier et leur format de date.

## Ce qu’il fait

- Quand le dossier que vous ouvrez, ou un dossier au-dessus, est un graphe Logseq enregistré en fichiers (il contient `logseq/config.edn`), Textus écrit les liens par nom de page (`[[Page]]`), place les pages créées depuis un lien dans `pages/` (ou votre `:pages-directory`), et Calendrier et notes du jour garde les journaux dans `journals/`, nommés selon votre `:journal/file-name-format`.
- Le dossier d’images de Logseq, `assets/`, vous est proposé une fois sur une carte dans le coin. Acceptez-le, et il est gardé dans le `.textus/settings.json` du dossier ; gardez le vôtre, et Textus ne demandera plus.
- Les liens wiki du graphe sont trouvés depuis le dossier du graphe, même sans ce plugin.

## Autorisations

Il demande seulement à **lire les fichiers du dossier ouvert** : Textus lui transmet `logseq/config.edn` et il dit ce que signifie le fichier. Il ne change rien.

## Changements

- **0.1.2** - A simpler icon, drawn in the text colour.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it.
- **0.1.0** - First version: Logseq's settings offered when a Logseq graph is opened. Needs Textus 1.4.6.
