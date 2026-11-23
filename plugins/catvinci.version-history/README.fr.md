# Historique des versions

Garde chaque enregistrement d’un document comme une version, pour voir ce qui a changé et revenir à une ancienne.

- À chaque enregistrement, le texte du document est gardé comme version. Des enregistrements rapprochés (l’enregistrement automatique toutes les quelques secondes) comptent pour un, avec au plus une nouvelle version toutes les 15 minutes. Tout le dernier jour est gardé, puis une par heure pendant une semaine, une par jour pendant trois mois, et une par semaine avant.
- L’onglet **Historique** de la barre latérale liste les versions du document ouvert, la plus récente en haut, groupées par jour : Aujourd’hui, Hier, puis la date.
- Choisissez-en une pour voir, ligne par ligne, ce qui a changé depuis.
- Comparez-la au document actuel ou à n’importe quelle autre version, les mots modifiés étant marqués. **Rétablir** à côté d’une modification ne reprend que celle-ci ; **Plus** nomme ou épingle une version, alors gardée pour de bon, ou l’ouvre comme nouveau document. Les modifications faites hors de Textus (une autre app, une synchronisation, git) sont gardées aussi : le texte d’avant et celui d’après.
- **Restaurer** propose l’ancien texte comme une modification du document, que vous acceptez ou refusez comme les autres. **Ouvrir comme nouveau document** l’ouvre à côté.
- Les versions sont gardées dans Textus, pas dans votre dossier. Les documents de plus de 2 Mo ne sont pas gardés, et quand le stockage est plein, les plus anciennes versions partent d’abord.

## Autorisations

- Lire les fichiers et le document : pour garder chaque version et la comparer au texte actuel.
- Proposer des modifications : pour ramener une ancienne version comme une modification à accepter ou refuser.
- Outils pour Textus AI : pour que Textus AI puisse lister les versions d’un document et les comparer.

## Changements

- **0.5.0** - From Textus 1.4.4 the versions other plugins keep of a document - Cloud Sync's - are listed too, each under its source's name, to compare and restore like the rest.
- **0.4.1** - Restore is one word, so its button fits a narrow sidebar in every language.
- **0.4.0** - Versions thin out with age instead of the last 50 going; each text is stored once; a deleted document's versions go a month later. Compare any two versions, word by word; take back one change; name and pin versions; changes made outside Textus are kept. Versions from 0.3 move over by themselves. Needs Textus 1.4.3. In a Git folder on the desktop, the document's commits show under its versions.
- **0.3.8** - The text from before the first save is no longer lost when that save comes right as the document opens.
- **0.3.7** - The text a document had before its first save is kept as a version too, and a document's versions follow it when it is renamed or moved.
- **0.3.6** - Autosave while you type writes only the newest version, not every version of the document, so long documents save with much less work.
- **0.3.5** - An open version stays open while autosave updates it, and Restore always finds it. When storage is full, older versions of other documents make room, and the panel says when a save couldn't be kept. Rows work from the keyboard; buttons wrap in a narrow sidebar.
- **0.3.4** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Only the path code shared with other plugins changed; nothing changes in use.
- **0.3.0** - Textus AI can list a document's versions and compare them (`list_versions`, `diff_versions`).
- **0.2.0** - Textus's own controls. Needs Textus 1.3.2.
- **0.1.0-0.1.3** - First versions: a version on each save, what changed since, restore as an edit to accept or reject, open as a new document, saves close together kept as one, versions grouped by day, the oldest dropped when storage is full.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_versions`: Liste les versions enregistrées d'un document - celui au premier plan si aucun chemin n'est donné -, la plus récente d'abord, numérotées à partir de 1, chacune avec sa date d'enregistrement et sa taille.
- `diff_versions`: Montre, ligne par ligne, ce qui a changé entre deux versions d'un document, ou entre une version et le document tel qu'il est : + ajouté, - retiré, avec un peu de contexte.
<!-- /ai-tools -->
