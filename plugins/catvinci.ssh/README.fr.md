# Dossiers SSH

Ouvrez un dossier sur un serveur avec votre propre ssh et écrivez-y comme dans un dossier de cet ordinateur : ses documents en onglets, ses fichiers dans la barre latérale.

## Ce qu’il fait

- **Extensions › Ouvrir un dossier distant…** liste les serveurs de votre `~/.ssh/config` (ou prend celui que vous tapez, comme `me@server`), puis le dossier à ouvrir, en partant de votre dossier personnel sur le serveur.
- Le dossier s’ouvre dans la barre latérale. Les documents s’ouvrent, s’enregistrent, se renomment, se déplacent et se cherchent comme dans n’importe quel dossier ; un nouveau document ou dossier est créé sur le serveur.
- Votre propre `ssh` établit la connexion, avec votre configuration, vos clés, votre agent et vos hôtes connus. Seul le transfert de fichiers (SFTP) est demandé : ni shell, ni commandes.
- Une connexion coupée est rétablie la prochaine fois qu’un fichier est lu ou enregistré.

## Limites

- Connexion par clé ou par agent seulement. Un serveur qui demande un mot de passe est refusé ; ajoutez-lui d’abord une clé.
- Un serveur que ssh ne connaît pas encore est refusé, jamais accepté à votre place : connectez-vous une fois avec `ssh` dans un terminal et acceptez sa clé là.
- On ne peut pas encore coller d’images dans un document sur un serveur, et un fichier supprimé l’est pour de bon : un serveur n’a pas de corbeille.

## Autorisations

Il demande **ssh** : Textus vous demande une fois pour chaque serveur avant que le plugin puisse s’y connecter.

## Changements

- **0.1.2** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.": the store shows that.
- **0.1.1** - Uses the plugin API as Textus 1.4.6 ships it.
- **0.1.0** - First version. Needs Textus 1.4.6.
