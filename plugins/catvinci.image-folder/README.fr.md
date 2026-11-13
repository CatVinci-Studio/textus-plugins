# Images avec le document

Range les images de chaque document dans un dossier à côté de lui, à son nom, comme le font Typora et VS Code : les images de `Note.md` vont dans `Note.assets/`.

Rien à activer ni à régler : elle fonctionne seule une fois installée.

- Collez ou déposez une image dans un document enregistré. Textus enregistre d'abord l'image, puis cette extension la déplace dans le dossier du document et change le lien en `Note.assets/image.png`. Un nom déjà pris reçoit un numéro ; rien n'est écrasé. Si le lien ne peut pas être changé, l'image revient à sa place.
- Renommez un document dans son dossier, et son dossier d'images est renommé avec lui, liens compris - sauf si un autre document pointe aussi vers ce dossier ; dans ce cas, les deux restent tels quels.
- Les images déjà présentes dans vos documents restent où elles sont.
- Dans un coffre Obsidian qui définit un dossier de pièces jointes, et dans un graphe Logseq, les images restent là où cette application les met.

Elle prend en charge les images PNG, JPEG, GIF, WebP, AVIF, BMP, SVG, ICO, HEIC et TIFF. Elle fonctionne sur ordinateur et demande Textus 1.3.0 ou plus récent. Elle demande à lire et écrire des fichiers, pour déplacer les images et renommer leurs dossiers, et à lire et modifier le document affiché, pour changer le lien vers une image déplacée.

## Changements

- **0.1.7** - La description de la boutique commence désormais par ce que fait le plugin.
- **0.1.6** - Ajouter beaucoup d’images d’un coup (une synchronisation, un dossier copié) ne relit plus sans cesse le document ouvert.
- **0.1.5** - Dans un coffre Obsidian, les images restent de nouveau là où le réglage des pièces jointes du coffre les place : le réglage est lu par Textus.
- **0.1.4** - Laisse les images là où les met le réglage de dossier d'images Typora d'un document, et ne déplace plus un dossier tant que des liens vers lui peuvent rester non vérifiés.
- **0.1.3** - Sa page dit maintenant en une phrase ce qu'il fait, ce qu'il permet et ce qui a changé à chaque version.
- **0.1.2** - Laisse les images là où les met le dossier de pièces jointes d'un coffre Obsidian ou un graphe Logseq.
- **0.1.1** - Un nom plus court : Images avec le document.
- **0.1.0** - Première version : les images collées et déposées vont dans `Note.assets/`, et le dossier suit le document renommé.
