# Rappels

Vous rappelle une ligne à l’heure que vous y écrivez, comme `(@2026-11-02 09:00)`, par une notification du système.

Écrivez la marque dans n’importe quelle ligne - une tâche, un titre, n’importe quelle ligne. À cette heure-là, une notification montre le texte de la ligne et son document ; cliquez dessus et la ligne s’ouvre.

- `(@2026-11-02)` seul vous le rappelle à 9 h ce matin-là.
- **Extensions › Me rappeler…**, ou **Me rappeler…** dans le menu /, insère la marque au curseur pour vous : dans une heure, ce soir à 20 h, demain à 9 h, lundi prochain à 9 h, ou une date et une heure que vous tapez.
- Une tâche cochée (`- [x] …`) est faite : pas de rappel.
- L’onglet **Rappels** de la barre latérale liste ceux à venir, le plus proche d’abord ; cliquez sur l’un d’eux pour ouvrir sa ligne.
- Textus garde les rappels lui-même : ils arrivent tant qu’une fenêtre est ouverte, et même toutes fenêtres fermées quand **Rester ouvert en arrière-plan** est activé (**Réglages › Général**). Un rappel manqué pendant que Textus ne tournait pas arrive au prochain démarrage.

Les marques s’écrivent comme les écrit le plugin Reminder d’Obsidian : les mêmes notes vous rappellent aussi les choses là-bas.

Il demande Textus 1.4.3 ou plus récent. Il demande à lire les fichiers du dossier ouvert, pour trouver les marques ; à écrire dans l’éditeur, pour insérer une marque ; à afficher des notifications ; et à donner à Textus AI les deux outils ci-dessous.

## Changements

- **0.3.6** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Opening a folder reads only the documents Textus finds a reminder mark in, not every document.
- **0.3.3** - The store description now opens with what the plugin does.
- **0.3.2** - Two open windows no longer clear each other's reminders, and the list empties when you close the folder. A mistyped time is refused instead of inserting a broken mark.
- **0.3.1** - Shorter help and empty-state text.
- **0.3.0** - Marks written with Textus's own dates; needs Textus 1.3.10.
- **0.2.2-0.2.3** - Updated shared date code.
- **0.2.1** - Textus AI is told when a due date belongs in Tasks instead.
- **0.2.0** - Textus AI can list the coming reminders and add one.
- **0.1.1** - Desktop only, since it runs in the background.
- **0.1.0** - First version: `(@date time)` marks as notifications Textus keeps, even in the background; Remind Me… and the sidebar list.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_reminders`: Liste les rappels à venir - les marques (@2026-11-02 09:00) des documents du dossier ouvert -, le plus proche d'abord, chacun avec son heure, son texte, le chemin du document et la ligne. Les tâches par échéance, c’est list_tasks.
- `add_reminder`: Ajoute un rappel sous forme de ligne de tâche avec son heure, - [ ] texte (@2026-11-02 09:00), à la fin du document au premier plan ; une notification arrive alors. À utiliser quand l’utilisateur veut être prévenu à une heure ; une tâche avec seulement une échéance, c’est add_task.
<!-- /ai-tools -->
