# Signets

Mettez un signet sur un passage et revenez-y depuis la barre latérale, dans n’importe quel document.

Sélectionnez quelques mots et choisissez **Signet sur la sélection** : clic droit sur la sélection, ou **Plugins › Signet sur la sélection**. Enregistrez d’abord le document, car le signet renvoie à son fichier.

L’onglet **Signets** de la barre latérale les liste par document. Cliquez sur l’un d’eux pour ouvrir le document à ces mots. Pour en supprimer un, faites un clic droit et choisissez **Supprimer le signet**. Un document renommé ou déplacé garde ses signets.

## Coffres Obsidian

Quand le dossier ouvert est un coffre Obsidian (il contient un dossier `.obsidian`) :

- Les signets d’Obsidian, dans `.obsidian/bookmarks.json`, apparaissent aussi dans l’onglet, sous **Signets d’Obsidian**, avec leurs groupes. Ceux des notes, des titres et des blocs sont listés ; recherches, dossiers et autres ne le sont pas.
- Un nouveau signet est aussi écrit dans `bookmarks.json`, pour qu’Obsidian l’ait. Sur un titre, c’est un signet de titre ; ailleurs, un signet de bloc, et le bloc reçoit un identifiant comme `^a1b2c3` (celui qu’il a déjà est repris).
- Supprimer un signet ici, ou renommer son document, modifie aussi `bookmarks.json`. Le reste du fichier ne change pas.

## Autorisations

- Lire et modifier le document : pour lire la sélection et ajouter l’identifiant d’un bloc dans un coffre.
- Lire et écrire des fichiers : pour le `bookmarks.json` d’Obsidian.
- Outils pour Textus AI : pour que Textus AI puisse lister vos signets.

## Changements

- **0.4.3** - La liste est groupée par chemin du document dans le dossier, un groupe par document ; les longs passages s'arrêtent sur un mot avec « … » ; si l'id de bloc échoue dans un coffre, le signet est quand même gardé.
- **0.4.2** - Textes d'aide et d'état vide plus courts.
- **0.4.1** - Sa page dit maintenant en une phrase ce qu'il fait, ce qu'il permet et ce qui a changé à chaque version.
- **0.4.0** - Dans un coffre Obsidian, les nouveaux signets sont aussi écrits dans son `bookmarks.json`, et supprimés et renommés là aussi.
- **0.3.0** - Liste les signets d’Obsidian du coffre : notes, titres et blocs.
- **0.2.1** - Chemins gérés par du code partagé avec d’autres plugins ; rien ne change à l’usage.
- **0.2.0** - Textus AI peut lister vos signets (`list_bookmarks`).
- **0.1.0-0.1.2** - Premières versions : signet sur la sélection, liste par document dans la barre latérale, signets qui suivent les renommages ; page de la boutique et icône ; fonctionne sur ordinateur et iOS.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_bookmarks`: Liste les signets de l'utilisateur : les mots marqués dans chaque document, avec le chemin du document dans le dossier ouvert.
<!-- /ai-tools -->
