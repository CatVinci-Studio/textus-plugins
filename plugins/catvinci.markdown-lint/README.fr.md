# Mise au propre

Souligne le Markdown qui enfreint les règles courantes et le corrige, et met au propre lignes vides, espaces, ponctuation et retours à la ligne.

Il fonctionne comme le Linter d’Obsidian, et chaque changement s’annule d’un coup.

## Markdown

- Ce qui enfreint une règle Markdown courante est souligné ; laissez le pointeur dessus pour voir quelle règle et pourquoi.
- **Corriger le Markdown** (clic droit ou le menu Plugins) corrige ce qui peut l’être.
- Chaque bloc est vérifié à part : les règles qui portent sur le document entier (niveaux de titre, première ligne, lignes vides entre blocs) sont laissées de côté.

## Texte

Chaque commande agit sur la sélection ou, après confirmation, sur tout le document. Elles sont dans le menu Plugins et la palette de commandes.

- **Supprimer les lignes vides** : les paragraphes vides disparaissent ; dans une sélection, toutes les lignes vides.
- **Supprimer les espaces en fin de ligne** : espaces et tabulations en fin de ligne ; les deux espaces d’un saut de ligne restent.
- **Ponctuation chinoise dans le texte chinois** : 你好,世界? devient 你好，世界？. Les nombres comme 1.3.8 et les phrases anglaises ne changent pas.
- **Ponctuation anglaise dans le texte anglais** : Hello，world！ devient Hello, world! ; les signes collés au chinois ne changent pas.
- **Lettres et chiffres pleine chasse en ASCII** : ＡＢＣ１２３ devient ABC123.
- **Réunir les lignes sélectionnées** (aussi au clic droit) : les lignes sélectionnées n’en font plus qu’une, sans espace entre caractères chinois et avec une espace entre les mots.

## Réglages

- **Souligner le Markdown qui enfreint une règle** : désactivé, plus rien n’est souligné ; Corriger le Markdown reste disponible.
- **Règles laissées de côté** : des règles de markdownlint, une par ligne (MD009 ou no-trailing-spaces), ni soulignées ni corrigées.

## Ce qui reste tel quel

Le code, les formules, le front matter, les liens, les #tags, les rappels (@…), les commentaires %%, le HTML et les définitions de référence ([d]: url) ne sont jamais signalés ni modifiés, pas plus que ce qu’écrit Obsidian : identifiants de bloc (^1a2b3c), champs Dataview (key:: value, [key:: value]), ==surlignages== et champs d’Obsidian Tasks (📅 2026-11-07, 🔁 every week, 🆔 abc123). En réunissant des lignes, un champ garde sa propre ligne. Les parenthèses changent par paires : 价格(USD) devient 价格（USD）.

Espacement CJK, l’extension qui met des espaces entre texte chinois et latin, laisse aussi tout cela tel quel.

## Autorisations

- Lire et modifier le document : pour le vérifier et faire les corrections.
- Outils pour Textus AI : pour que Textus AI vérifie du Markdown avec les mêmes règles.

## Changements

- **0.4.1** - Supprimer les lignes vides et changer de liste laissent intact un bloc de code dans une clôture plus longue (```` contenant ```).
- **0.4.0** - Passer les lignes sélectionnées en liste à puces, numérotée ou de tâches (numérotée à partir de 1 à chaque niveau ; une tâche garde sa coche).
- **0.3.2** - Textes d'aide et d'état vide plus courts.
- **0.3.1** - Sa page dit maintenant en une phrase ce qu'il fait, ce qu'il permet et ce qui a changé à chaque version.
- **0.3.0** - Renommé Mise au propre (avant : Vérification Markdown) : les six commandes de texte de « Nettoyage du texte » y sont réunies ; réglages pour couper le soulignement ou certaines règles ; la syntaxe propre à Obsidian reste telle quelle.
- **0.2.1** - Tags, liens, rappels et définitions de référence ne sont jamais signalés : la même liste qu’Espacement CJK laisse intacte.
- **0.2.0** - Textus AI peut vérifier du Markdown (`lint_markdown`).
- **0.1.0-0.1.2** - Premières versions : soulignements qui expliquent la règle, et Corriger le Markdown ; page de la boutique et icône ; fonctionne sur ordinateur et iOS.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `lint_markdown`: Vérifie du Markdown - fourni, ou le document au premier plan - avec les règles de markdownlint, comme l'éditeur les souligne : ligne, règle, description de chaque problème et s'il se corrige ; avec fix, aussi le texte corrigé. Ne modifie rien lui-même.
<!-- /ai-tools -->
