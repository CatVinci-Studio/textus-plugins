# Nettoyage du texte

Nettoie le texte en une étape. Chaque commande agit sur la sélection, ou sur tout le document si rien n’est sélectionné, et s’annule d’un coup. Elles sont dans le menu Plugins et la palette de commandes.

Sans sélection, il demande avant de nettoyer tout le document.

- **Supprimer les lignes vides** : les paragraphes vides disparaissent ; dans une sélection, toutes les lignes vides.
- **Supprimer les espaces en fin de ligne** : espaces et tabulations en fin de ligne ; les deux espaces d’un saut de ligne restent.
- **Ponctuation chinoise dans le texte chinois** : 你好,世界? devient 你好，世界？. Les nombres comme 1.3.8 et les phrases anglaises ne changent pas.
- **Ponctuation anglaise dans le texte anglais** : Hello，world！ devient Hello, world! ; les signes collés au chinois ne changent pas.
- **Lettres et chiffres pleine chasse en ASCII** : ＡＢＣ１２３ devient ABC123.
- **Réunir les lignes sélectionnées** (aussi au clic droit) : les lignes sélectionnées n’en font plus qu’une, sans espace entre caractères chinois et avec une espace entre les mots.

Le code, les formules, les liens, les #tags, les rappels (@…), les commentaires %%, le HTML et le front matter restent tels quels. Les parenthèses changent par paires : 价格(USD) devient 价格（USD）.
