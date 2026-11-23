# Synchro cloud

Gardez un dossier identique sur vos ordinateurs grâce à votre propre stockage compatible S3, WebDAV ou Nutstore, avec les versions précédentes gardées dans le cloud et, si vous le choisissez, un chiffrement avant que rien ne quitte chaque appareil.

Avec le chiffrement de bout en bout activé, le service de stockage ne voit ni le contenu de vos fichiers ni leurs noms.
Synchro cloud demande Textus 1.4.1 ou plus récent.

## Pour commencer

1. Ouvrez dans Textus le dossier à synchroniser, puis choisissez **Extensions › Synchro cloud**
   (ou **Réglages de connexion…** dans son onglet de la barre latérale).
2. Choisissez le service de stockage et saisissez l’adresse de son serveur et vos identifiants. Nutstore
   ne demande que votre e-mail et un mot de passe d’application, créé dans Account › Security.
3. Pour chiffrer, activez **Chiffrement de bout en bout** et définissez un **mot de passe de synchro**
   d’au moins 12 caractères ; gardez-le dans votre gestionnaire de mots de passe : il ne peut pas
   être réinitialisé. Décidez-le une fois par dossier distant : changer plus tard demande un nouveau
   dossier, vide.
4. Choisissez **Enregistrer la connexion**, puis **Synchroniser maintenant**.

Sur un autre appareil, ouvrez le dossier correspondant et saisissez le même service et
le même dossier distant (et, pour un dossier chiffré, le même mot de passe de synchro). Activez **Synchroniser automatiquement**
(tant que Textus est ouvert) : la synchro se fait alors quelques secondes après que vous enregistrez ou renommez un
fichier, et aussi toutes les 5 minutes au cas où rien ne l’aurait déclenchée (**Intervalle de synchronisation** : de 5 à
60 minutes). Un fichier que vous supprimez part à la synchro suivante. **Extensions › Synchroniser
maintenant** lance une synchro à tout moment.

Une fois une connexion enregistrée, la barre d’état montre où en est la synchro : **Synchronisé ·
il y a 2 min**, **Synchronisation…**, **Conflit de synchronisation** ou **Erreur de synchronisation**. Cliquez dessus pour
ouvrir le panneau.

Quand les deux appareils ont modifié le même fichier, les deux versions restent :
la vôtre à sa place, celle de l’autre appareil dans `Sync conflicts/`.

## Historique dans le cloud

Chaque fois qu’une synchro remplace ou supprime un fichier, son contenu précédent reste dans le
dossier distant. Faites un clic droit sur un fichier et choisissez **Historique dans le cloud…** pour voir ses
versions (quand, depuis quel appareil, quelle taille), en lire une et **Restaurer cette
version** : elle devient le fichier actuel et se synchronise, et la version qu’elle remplace
reste dans l’historique. Si le fichier a des modifications pas encore synchronisées, ou s’il est ouvert,
la version est écrite à côté (`Note (3f2a9c1b).md`). **Extensions › Historique dans le cloud…** liste les fichiers supprimés
du dossier ; ouvrez-en un pour le récupérer.

**Conserver l'historique dans le cloud** fixe combien de temps, compté depuis le remplacement d’une version :
30, 90 (par défaut) ou 365 jours, ou toujours. Un seul réglage vaut pour
le dossier : le dernier synchronisé depuis n’importe quel appareil, que les autres affichent ensuite.
Le premier jour, une version par heure est gardée, puis une par jour, au plus 200 par
fichier ; si l’historique dépasse 8 Mo d’enregistrements, les versions les plus anciennes partent d’abord.
Chaque synchro qui change quelque chose, et sinon une fois par jour, laisse partir les
versions expirées et supprime les blocs qu’elles seules utilisaient. L’espace pris avant la 0.5
(anciens instantanés) n’est pas récupéré. Mettez chaque appareil à jour en 0.5 : ce qu’un appareil en 0.4
change n’entre dans l’historique qu’à la synchro 0.5 suivante, et ses propres
suppressions ne sont pas listées d’ici là.

**Autorisations :** lire et écrire le dossier ouvert (pour le parcourir et appliquer ce qui
descend), et joindre n’importe quel site (seulement le serveur HTTPS que vous saisissez). Aucune
télémétrie, statistique d’usage, code distant ni mise à jour automatique.

## Détails

S3 accepte un endpoint personnalisé (vide pour AWS), une région, un bucket, un adressage
de type chemin ou par hôte virtuel et un jeton de session facultatif sous **Plus d'options**.
Le dossier distant contient le format de stockage du plugin, pas un simple miroir des fichiers ;
utilisez-en un différent pour chaque espace de travail.

Les identifiants sont stockés par `ctx.secrets`, séparément de l’état de synchro.
Ils ne sont jamais renvoyés à la page de réglages ni copiés dans le manifeste
distant. Des champs d’identifiants vides gardent ceux d’une connexion existante.
Changer d’endpoint, de dossier distant ou de compte demande les identifiants correspondants.
Le mot de passe de synchro est aussi enregistré localement par `ctx.secrets` pour la synchro automatique,
jamais renvoyé à la page de réglages ni envoyé au service de stockage. Des champs de mot de passe
vides le gardent. Saisir ici un autre mot de passe ne rechiffre pas un dépôt
existant : il doit correspondre au mot de passe utilisé pour initialiser ce dossier distant.

## Ce qui est synchronisé

- Les documents `.md`, `.markdown`, `.mdown`, `.mkd`, `.txt` et `.csv` enregistrés, ainsi que
  les bases (`.base`) et canevas (`.canvas`) d’Obsidian.
- Les images, PDF, fichiers Office/OpenDocument, l’audio et la vidéo. La liste exacte
  se trouve dans `development/cloud-sync/src/config.ts` du dépôt du plugin.
- Les données de projet de Textus : `.textus/agent.md`, `style.md`, `style.previous.md`,
  et le Markdown sous `.textus/library/`, `memory/` et `skills/`.

Les réglages globaux, l’historique des conversations, les brouillons, les modifications non enregistrées, les identifiants, les
données des autres plugins, les fichiers cachés quelconques et les dossiers de build ou de dépendances sont exclus.
Seuls les fichiers à l’intérieur de l’espace de travail ouvert sont accessibles. Les fichiers en dehors,
y compris les pièces jointes liées hors du dossier, ne sont pas envoyés.

Dans les réglages, vous pouvez exclure davantage : une règle par ligne, écrite comme dans un
`.gitignore` (`drafts/`, `*.pdf`, `!keep.pdf`). Un interrupteur applique aussi le
`.gitignore` du dossier. Les fichiers exclus restent tels quels sur chaque appareil :
rien n’est envoyé, téléchargé ou supprimé pour eux. Un autre interrupteur emporte
les réglages partagés d’Obsidian (`.obsidian/app.json`, `appearance.json`,
`hotkeys.json`, `bookmarks.json`, `graph.json`, `core-plugins.json`,
`types.json`) ; ses fichiers propres à chaque appareil, comme `workspace.json`, restent locaux.

Les limites actuelles sont de 128 Mio par fichier, 20 000 fichiers ou dossiers parcourus,
48 niveaux de dossiers et un manifeste de 8 Mio. Les dossiers vides ne sont pas synchronisés.
Les chemins non sûrs sur les plateformes prises en charge, ou qui ne diffèrent que par la casse ou la
normalisation Unicode, arrêtent la synchro au lieu d’être renommés en silence.

## Changements et conflits

Les empreintes SHA-256 et la dernière synchro réussie déterminent quel côté a changé.
Seul le contenu modifié est transféré. Les fichiers sont stockés en blocs de 2 Mio et
les blocs communs sont réutilisés ; les ETags ne sont pas pris pour des empreintes de contenu.

- Les modifications indépendantes sont copiées sur l’autre appareil.
- Les modifications simultanées gardent le fichier local et enregistrent la version distante dans
  `Sync conflicts/`. Les deux versions sont publiées pour les autres appareils.
- Les fichiers de destination ouverts sont mis en attente ; enregistrez-les et fermez-les, puis synchronisez de nouveau.
- Les fichiers texte existants sont mis à jour par l’API `files.process` de Textus, qui vérifie
  la version. Les fichiers binaires existants ne sont jamais écrasés : des pièces jointes
  différentes gardent les deux versions, même quand un seul côté a changé. L’API actuelle
  des plugins n’a pas d’opération de remplacement binaire conditionnel.
- Un fichier supprimé sur un appareil est supprimé sur les autres à leur synchro suivante,
  et les autres appareils le mettent dans la corbeille du système, où vous pouvez le restaurer.
  Le fichier supprimé reste dans l’historique dans le cloud tant que celui-ci garde des
  versions. Un renommage arrive sur les autres appareils comme un renommage.
- Le contenu ne quitte le serveur que lorsque l’historique le laisse partir : jusque-là, un
  fichier supprimé peut être lu par quiconque peut lire le dossier distant (et, s’il
  est chiffré, connaît le mot de passe de synchro). Pour supprimer un contenu pour de bon, utilisez
  un nouveau dossier distant pour un espace de travail nettoyé.
- Une modification l’emporte sur une suppression : si un appareil a supprimé un fichier que l’autre a modifié
  depuis leur dernière synchro, le fichier modifié revient partout.
- Un appareil qui synchronise un dossier pour la première fois ne supprime jamais rien ; un fichier
  que seul un côté possède est copié de l’autre côté.
- Une synchro qui supprimerait beaucoup de fichiers du cloud (plus de dix, et plus
  de 30 % des fichiers synchronisés) s’arrête avant d’en supprimer aucun et demande ; une synchro lancée
  automatiquement demande une fois, et **Synchroniser maintenant** demande de nouveau. Les fichiers renommés ou déplacés
  ne comptent pas. Un dossier où rien n’est trouvé alors que beaucoup de fichiers en ont été
  synchronisés est considéré comme illisible (accès perdu, fichiers non téléchargés), et
  la synchro s’arrête sans rien supprimer.
- Quand la corbeille du système refuse un fichier supprimé ailleurs, il reste en place,
  est listé dans le panneau, et la synchro suivante réessaie ;
  le reste de la synchro continue.
- Les fichiers ouverts dans un onglet ne sont ni retirés ni renommés ; fermez-les et synchronisez de nouveau.
- Mettez chaque appareil à jour en 0.4 avant de compter sur les suppressions : un appareil plus ancien remet
  en place un fichier supprimé ailleurs.

Avec **Chiffrement de bout en bout** activé, le contenu et les noms de fichiers sont chiffrés avant l’envoi ;
dans tous les cas, tout circule en HTTPS.
Utilisez un bucket S3 ou un dossier WebDAV privé. Le compte du service
a besoin des droits de lecture, d’écriture et de suppression dans le dossier distant qui lui est dédié
(la suppression sert aux objets temporaires et aux verrous).

## Requêtes par synchro

Mesurées par les tests en HTTP pour un petit document, après la première synchro
de la session (la première vérifie aussi les écritures exclusives du serveur : 4 requêtes
de plus sur S3) :

| Synchro                                    | S3  | WebDAV / Nutstore |
| ------------------------------------------ | --- | ----------------- |
| Rien de changé                             | 3   | 3                 |
| Un document modifié (un bloc de 2 Mio)     | 18  | 20                |
| Un fichier supprimé                        | 20  | 22                |

Quand rien n’a changé d’aucun côté, une synchro lit seulement la révision actuelle du dossier et ne prend
aucun verrou. Chaque bloc modifié en plus ajoute 1 requête : un bloc
est envoyé une fois, sans demander d’abord s’il est déjà là ni le relire ensuite
(les blocs sont nommés d’après leur contenu ; chaque téléchargement vérifie chacun d’eux). Sur
WebDAV, un bloc qui va dans un dossier qui n’existe pas encore coûte 2 requêtes de plus, l’envoi
refusé et le dossier ; prendre le verrou coûte un envoi et un `MOVE`. Les synchros après un enregistrement attendent que l’enregistrement soit terminé (5 s), puis le **Délai
de synchronisation** (de aucun à 10 minutes) : 3 pour une nouvelle connexion Nutstore, puisque Nutstore
limite les requêtes par compte, et 0 pour S3 et WebDAV. La réponse d’un serveur occupé
(429, 503) met toutes les requêtes en pause ; quand il demande d’attendre, l’état affiche
« En attente du serveur » avec les secondes, jusqu’à 60 s. S’il demande plus longtemps, cette
synchro s’arrête et propose de réessayer plus tard ; ce qu’elle a envoyé est gardé pour la suivante.

## Chiffrement de bout en bout

Avec **Chiffrement de bout en bout** activé, le contenu des fichiers, les chemins, les empreintes de contenu et les instantanés sont authentifiés et chiffrés
en AES-256-GCM par Web Crypto. Chaque chiffrement utilise un nonce de 96 bits neuf et
une balise de 128 bits. L’authentification lie l’en-tête de chiffrement du dépôt et la
clé logique de l’objet, ce qui empêche toute substitution entre blocs, manifestes et instantanés.

Une racine de 256 bits est dérivée localement avec PBKDF2-HMAC-SHA-256, 600 000 itérations et
un sel de dépôt aléatoire de 256 bits. HKDF-SHA-256 dérive des clés séparées pour AES et pour
le nommage des objets en HMAC-SHA-256. Les noms des blocs de contenu sont des HMAC à clé, pas des empreintes
publiques du texte en clair. Les blocs identiques sont réutilisés au sein d’un dépôt ; des dépôts sans rapport
utilisent des sels et des clés différents. Le déchiffrement authentifie les octets avant d’appliquer les fichiers.

Le descripteur de chiffrement ne contient que les paramètres publics de dérivation de clé, un identifiant de dépôt et un message
de vérification fixe chiffré. Un appareil retient l’empreinte du descripteur
après son premier déverrouillage réussi et s’arrête si elle change ou disparaît.
Un mauvais mot de passe, un descripteur mal formé ou un texte chiffré altéré arrêtent la synchro.

Le fournisseur peut toujours observer le préfixe distant choisi, la taille et le nombre des objets,
la réutilisation des blocs au sein d’un dépôt, le moment des requêtes et le propriétaire et l’heure anonymes du verrou.
Le protocole ne garantit pas la détection d’un serveur malveillant qui rejouerait un ancien
état chiffré valide. Un mot de passe solide compte, car le texte chiffré distant permet de deviner
le mot de passe hors ligne ; la dérivation de clé en augmente le coût mais ne peut pas rendre un mot de passe faible
solide. Cette implémentation a des tests automatisés d’interopérabilité et d’altération,
mais n’a pas fait l’objet d’un audit de sécurité indépendant.

Les fichiers locaux restent lisibles. Le mot de passe se trouve dans le stockage local des secrets de Textus,
propre à chaque utilisateur, pas dans le dépôt distant ; cela ne protège pas un client compromis ou
déverrouillé. Perdre le mot de passe ou le descripteur de chiffrement d’origine rend la récupération distante
impossible. Une sauvegarde complète doit inclure le descripteur et les objets chiffrés.

### Format distant

- `v1/head.json` : le descripteur de chiffrement public (`textus-cloud-sync-e2ee/1`).
  L’ancien chemin est voulu : les clients v0.1 refusent ce format avant d’envoyer des fichiers.
- `v1/lock.json` : exclusion partagée avec les anciens et les nouveaux clients ; aucune donnée de document.
- `v2/head.bin` : manifeste actuel chiffré.
- `v2/history.bin` : historique chiffré (les versions précédentes de chaque fichier et leurs origines).
- `v2/blocks/<prefix>/<HMAC>` : blocs de contenu chiffrés.
- `v2/snapshots/<revision>.bin` : manifestes chiffrés de la révision actuelle et de la
  précédente.

Sans chiffrement, les mêmes objets sont stockés en JSON et en blocs bruts :
`v1/head.json`, `v1/history.json`, `v1/blocks/<prefix>/<SHA-256>` et
`v1/snapshots/<revision>.json`. Un dossier distant est soit chiffré, soit non ;
le plugin refuse de mélanger les deux.

Les objets chiffrés contiennent `TCS2`, un nonce de 12 octets, puis le texte chiffré et sa balise GCM
de 16 octets. L’AAD est l’UTF-8 de l’en-tête JSON canonique (`format`, `repositoryId`, `kdf`,
`iterations`, `salt`, dans cet ordre), un saut de ligne et la clé logique v1 de l’objet. Le
mot de passe est en UTF-8 sans normalisation. HKDF utilise l’identifiant de dépôt en UTF-8 comme sel
et `textus-cloud-sync-e2ee/1/content` ou `/names` comme info. L’entrée HMAC d’un bloc est la
clé logique `v1/blocks/<hash-prefix>/<SHA-256>` en UTF-8. Le texte clair de vérification est
`Textus encrypted workspace key check`, avec la clé logique `key-check` ; son enveloppe
est encodée en hexadécimal dans `verifier`. Ces choix sont vérifiés dans les tests face aux API
indépendantes de Node pour PBKDF2, HKDF, HMAC et AES-GCM.

### Passer un dossier au chiffrement

Un dossier distant n’est pas converti sur place. Assurez-vous d’abord qu’un espace de travail local
contient tous les fichiers et copies en conflit dont vous avez besoin, puis choisissez un **nouveau dossier
distant vide**, activez le chiffrement et définissez un mot de passe de synchro. Synchronisez d’abord cet
espace de travail complet ; les autres appareils peuvent ensuite le rejoindre avec le même mot de passe et le même dossier
distant.

Les anciennes données distantes, y compris l’historique des versions et les sauvegardes du fournisseur,
restent non chiffrées. Gérez les anciennes copies chez votre fournisseur après avoir vérifié
l’espace de travail chiffré. Changer de mot de passe sur place n’est pas possible ; utilisez un autre
nouveau dossier distant pour changer de mot de passe.

## Synchro interrompue

Un verrou distant fait passer les appareils l’un après l’autre. S3 utilise `If-None-Match: *` ; WebDAV utilise un
envoi temporaire suivi d’un `MOVE` avec `Overwrite: F`, y compris la réponse 409 de Nutstore
pour une cible existante. Le test de connexion vérifie l’exclusion
avant qu’une synchro puisse toucher aux données de l’espace de travail. Aucune API de listage ni aucun listage
de dossier sans limite n’est nécessaire.

Les blocs chiffrés et un instantané immuable sont écrits avant que `v2/head.bin` soit
publié. La référence locale n’avance qu’après la réussite de la publication.
Les nouvelles tentatives réutilisent les blocs terminés, même après un redémarrage : les blocs qu’une synchro arrêtée
a stockés sont retenus localement et ne sont pas revérifiés, tant qu’aucun autre
appareil n’a publié entre-temps. L’annulation s’arrête après la requête réseau en cours
et libère le verrou quand c’est possible. L’API réseau de Textus limite une
requête à 60 secondes ; elle ne permet pas d’annuler une requête en particulier.

Les nouveaux téléchargements binaires réservent un chemin avec un marqueur unique noté dans le stockage local
du plugin. Après une écriture interrompue, la synchro suivante reprend exactement ce
marqueur au lieu de l’envoyer comme contenu de fichier. Si une autre application modifie
le fichier, son contenu est préservé. Gardez les données locales du plugin quand vous réessayez.

Un verrou que cet appareil a laissé quand Textus a été fermé ou arrêté en pleine synchro est repris
par sa synchro suivante, sans demander. Une synchro en cours renouvelle une note de son
verrou toutes les 10 secondes ; la synchro suivante reprend le verrou une fois la note vieille de 30
secondes, attend le reste si elle démarre plus tôt, et le laisse tranquille si
la note est renouvelée entre-temps (une synchro qui tourne encore dans une autre fenêtre). Le verrou d’un autre appareil n’est
jamais pris : après un plantage là-bas, **Récupération › Retirer le verrou obsolète** ne le retire
qu’après confirmation. Vérifiez d’abord que tous les autres appareils ont cessé de synchroniser.
Les verrous n’expirent jamais côté distant : un appareil lent ne peut donc pas perdre son
droit d’écriture simplement parce qu’un minuteur a expiré.

Ce qu’une synchro a trouvé dans chaque fichier (taille, heure, empreinte) est gardé localement d’un
lancement à l’autre : la première synchro après un redémarrage ne relit que les fichiers modifiés
entre-temps. Si le descripteur ou le manifeste actuel est
supprimé par erreur, un appareil déjà joint s’arrête. Restaurez une sauvegarde distante
complète avec le descripteur d’origine. Les instantanés chiffrés sont liés à leurs propres
noms d’objet et ne peuvent pas être copiés directement sur `v2/head.bin` ; restaurer un seul
instantané demande de le déchiffrer et de le rechiffrer pour cette clé logique. Il n’existe
pas encore d’interface pour restaurer un seul instantané.
Ne modifiez pas les fichiers distants pendant qu’une synchro tourne.

## Passer du plugin communautaire

Le plugin officiel est `catvinci.cloud-sync`. L’ancien plugin communautaire,
`ciao1019.cloud-sync`, a ses propres réglages locaux, secrets et état de synchro.
Avant de changer, terminez ou récupérez toute synchro interrompue avec l’ancien plugin,
puis désactivez sa synchro automatique et désactivez-le. Gardez une sauvegarde de l’espace de travail.

Installez le plugin officiel et saisissez la même connexion de stockage, exactement le même dossier
distant et le même mot de passe de synchro. Le format distant chiffré n’a pas changé : les données distantes
v0.2/v0.3 existantes se lisent sans être déplacées ni rechiffrées. Les identifiants
locaux, les empreintes de descripteur retenues et les références ne sont pas copiés d’un identifiant de plugin à l’autre ;
la première synchro rejoint le dossier distant existant comme un nouvel appareil et peut garder des
copies en conflit si des fichiers diffèrent. Ne faites jamais tourner la synchro automatique des deux plugins sur le
même espace de travail. Les données v0.1 en clair demandent toujours la procédure de mise à niveau séparée ci-dessus.

## Développement et crédits

Le code source, les tests du protocole et les instructions de build se trouvent dans
[development/cloud-sync](https://github.com/CatVinci-Studio/textus-plugins/tree/main/development/cloud-sync).
Le catalogue empaquette les fichiers lisibles de `plugins/catvinci.cloud-sync/`
sans les compiler. Les versions suivent le processus de publication des plugins officiels de ce dépôt,
avec une étiquette comme `catvinci.cloud-sync-v0.3.0`.

Développé à l’origine par Ciao1019 ; l’interface et les améliorations de configuration de la 0.3.0
sont une contribution de ChengAo Shen. Les mentions MIT sont conservées dans `LICENSE`
et `THIRD_PARTY_NOTICES.md`. La conception du stockage s’est inspirée de
`apps/api/internal/cloudsync/` de Petrichor/Sylva ; aucun code source Go ni format de sauvegarde PostgreSQL n’est copié.

## Changements

- **0.8.0** - Safer when a sync is cut short: a lock this device left (Textus closed or stopped mid-sync) is taken back by its next sync without asking; another device's lock still needs **Recover stale lock**. A sync that would delete many files from the cloud stops and asks first, and a folder where suddenly nothing is found is taken as unreadable, not emptied. A file the system Trash refuses no longer stops the whole sync: it stays in place and is tried again. The first sync after a restart reads only the files changed meanwhile, not the whole folder. Its page is in every language Textus speaks. Its page receives Textus's messages by the API's current name. Its pickers keep Textus's own height.
- **0.7.0** - Faster syncs with fewer requests: with nothing changed, a sync asks the service once instead of 8 to 16 times; a changed file's blocks are sent in one request each, without checking first or reading them back; on WebDAV folders are made only when one is missing. A busy service is waited for (up to a minute, shown in the status) instead of stopping the sync, and requests that got no answer are sent again. The progress counts files that are done. From Textus 1.4.4 the versions it keeps of a document show in Version History too.
- **0.6.1** - A big first sync that stops halfway (cancelled, offline, or slowed by the service) goes on where it stopped next time, instead of checking every file it already sent; on Nutstore that saves most of the requests.
- **0.6.0** - Sync settings rearranged: sync options sit at the top and apply as you pick them, with no Save button. **Sync interval**, **Sync delay**, and **Keep cloud history** are pickers. Files now go up and down several at a time: **Transfers at once** sets how many (S3 8, WebDAV 4, Nutstore 2 to start), and blocks the cloud already holds are no longer checked again. A connected service shows as a card with the account masked and **Test connection**, **Edit** and **Disconnect**; the encryption switch and password are part of the connection. **Test connection** works before saving, and names the missing permission (write, read or delete) when a check fails.
- **0.5.3** - One set of rules for every service: the automatic interval can be 1 to 1,440 minutes, and **After a save, wait** sets how long a sync waits after saving (Nutstore starts at 3 minutes, S3 and WebDAV at 0; WebDAV no longer waits 30 s).
- **0.5.2** - The plugin no longer caps its own requests: a first Nutstore sync of a folder with many files no longer stops at "The service request limit was reached".
- **0.5.1** - A sync interrupted after it wrote the history but before the new state no longer leaves versions in the history that were never synced. Trash and old versions age by the storage server's clock, so a device whose clock is wrong no longer drops what the others keep.
- **0.5.0** - Older versions stay in the cloud: right-click a file › **Cloud History…** to read and restore one, and **Plugins › Cloud History…** brings back deleted files. **Keep cloud history** sets 30, 90 or 365 days, or always, and old versions are cleaned up by themselves. End-to-end encryption is now a switch, off for new connections; connections set up before keep it. Also brings 0.4.7's changes. Needs Textus 1.4.1.
- **0.4.7** - A sync reads again only the files whose size or time changed since the last one, so syncing a big folder while you write takes far less work. Your own rules can leave out more files (written as in a `.gitignore`), the folder's `.gitignore` can count too, and Obsidian's shared settings can sync. A picture or other attachment changed on another device now replaces the one here instead of being kept twice. Needs Textus 1.4.1.
- **0.4.6** - Every language now has the whole page translated, not just a few lines. In a narrow panel the status and the connection hint keep a readable width and the buttons move to their own line.
- **0.4.5** - The sidebar keeps to the sync status and **Sync now**; **Connection settings…** there opens the plugin's own page, where the connection is set up. The sidebar page draws no title of its own, as the sidebar's other tabs. Needs Textus 1.3.13. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.4** - A Cloud Sync tab in the sidebar shows at a glance how sync stands - connected or not, the last sync, any error, which service and remote folder - with the whole connection form below; Settings shows the same page. The service is picked from a dropdown, and a long name, path or error wraps inside the page.
- **0.4.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.1** - Obsidian bases (`.base`) and canvases (`.canvas`) sync too.
- **0.4.0** - Deletions and renames reach your other devices (deleted files go to the system Trash there); automatic sync runs a few seconds after you save; the status bar shows how sync stands; syncs are paced to stay within WebDAV and Nutstore request limits.
- **0.3.1** - Nutstore: a remote folder that already exists no longer stops the sync.
- **0.3.0** - First official version: end-to-end encrypted sync through S3, WebDAV or Nutstore, with conflict copies when both sides changed a file.
