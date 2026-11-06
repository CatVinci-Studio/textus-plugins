# Calendrier et notes du jour

Une note par jour, et un calendrier pour accéder à chacune.

- **Ctrl+Alt+J** (**⌘⌥J** sur Mac), ou **Extensions › Ouvrir la note du jour**, ouvre la note d’aujourd’hui ; elle est créée la première fois.
- L’onglet **Calendrier** de la barre latérale affiche le mois ; les jours qui ont une note sont marqués. Cliquez sur un jour pour l’ouvrir.
- Les notes sont rangées dans un dossier du dossier ouvert. Son nom et le texte de départ d’un nouveau jour se règlent dans les réglages de l’extension ; la semaine commence comme dans votre région.
- **Extensions › Ouvrir la veille** et **Ouvrir le lendemain** passent de la note d’un jour à ses voisines.
- Le modèle accepte {{weekday}}, {{yesterday}}, {{tomorrow}} et {{time}} en plus de {{date}} ; par exemple, `[[{{yesterday}}]]` relie chaque jour à la veille.
- Le texte de départ peut aussi être le nom d’un modèle du dossier Templates (celui de l’extension Modèles), comme `Daily`. Dans un coffre Obsidian, ses propres réglages de notes du jour sont suivis : dossier, format du nom comme `YYYY/MM/YYYY-MM-DD` et modèle ; Textus ne les modifie jamais.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `read_daily_note`: Lit la note quotidienne d'un jour - celle d'aujourd'hui si aucune date n'est donnée - dans le dossier des notes quotidiennes : son chemin, si elle existe, et son texte.
- `append_to_daily_note`: Ajoute du Markdown à la fin de la note quotidienne d'un jour - celle d'aujourd'hui si aucune date n'est donnée -, en la créant d'abord depuis son modèle si elle n'existe pas. Une note à garder pour plus tard dans la barre latérale, c’est add_note ; une tâche datée, add_task.
<!-- /ai-tools -->
