# Mise au propre

Met au propre texte et Markdown en un seul endroit, comme le Linter d’Obsidian. Chaque changement s’annule d’un coup.

## Markdown

- Ce qui enfreint une règle Markdown courante est souligné ; laissez le pointeur dessus pour voir quelle règle et pourquoi.
- **Corriger le Markdown** (clic droit ou le menu Plugins) corrige ce qui peut l’être.

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

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `lint_markdown`: Vérifie du Markdown - fourni, ou le document au premier plan - avec les règles de markdownlint, comme l'éditeur les souligne : ligne, règle, description de chaque problème et s'il se corrige ; avec fix, aussi le texte corrigé. Ne modifie rien lui-même.
<!-- /ai-tools -->
