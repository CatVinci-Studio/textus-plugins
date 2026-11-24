# WakaTime

Envoie le temps que vous passez à écrire dans Textus à votre compte [WakaTime](https://wakatime.com), pour qu’il apparaisse dans votre tableau de bord à côté de votre temps de code.

1. Copiez votre clé d’API depuis [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key).
2. Cliquez sur **Définir la clé d’API…** sur la page de WakaTime dans les Réglages de Textus et collez-la. La clé est gardée dans le stockage secret de Textus.

Le menu Extensions et la palette de commandes proposent **WakaTime : définir la clé d’API…**, **WakaTime : temps d’écriture du jour**, qui affiche le total du jour tel que WakaTime le compte, et **WakaTime : ouvrir le tableau de bord**.

## Ce qui compte et ce qui est envoyé

- Seul votre propre travail dans une fenêtre de Textus au premier plan compte : taper, déplacer le curseur, changer de document et enregistrer. Le temps où Textus est en arrière-plan, et les changements faits sur le disque ou par un plugin, ne comptent pas. L’écriture faite avec Textus AI compte comme du code écrit par l’IA.
- Pour chaque moment de travail, il indique à WakaTime le chemin du document, le langage (Markdown), le nombre de lignes, le projet et la branche Git. Le projet est la première ligne d’un fichier `.wakatime-project` dans le dossier ouvert, sinon le nom du dossier ouvert.
- Il envoie au plus une fois toutes les deux minutes pour un même document, et toujours à l’enregistrement, comme le font les plugins de WakaTime.
- Hors ligne, le temps attend dans une file et part plus tard, par lots.
- Rien n’est envoyé avant que la clé soit définie, et un document non enregistré n’est jamais envoyé. Pour arrêter, définissez une clé vide.

Il demande Textus 1.3.0 ou plus récent. Il demande à lire l’éditeur et les fichiers du dossier ouvert (pour le document, ses lignes, `.wakatime-project` et `.git/HEAD`) et à joindre `api.wakatime.com`, et rien d’autre sur le réseau.

## Changements

- **0.2.5** - Set the API key with a button on its page in Settings, and find its commands in the Plugins menu: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.2.4** - Leaving the key empty now really turns it off; a garbled reply to Today's Writing Time shows the usual message.
- **0.2.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.2** - Finds `.wakatime-project` and the Git branch the same way on every system.
- **0.2.1** - Says where it runs: desktop and iPhone.
- **0.2.0** - Only your own work in a window in front counts; an offline queue sent in batches; project, branch and lines; Today's Writing Time.
- **0.1.0** - First version: writing time in Textus on your WakaTime dashboard.
