# Arrumar

Sublinha o Markdown que quebra regras comuns e o corrige, e arruma linhas em branco, espaços, pontuação e quebras de linha.

Funciona como o Linter do Obsidian, e cada mudança se desfaz de uma vez.

## Markdown

- O que quebra uma regra comum de Markdown fica sublinhado; pare o ponteiro em cima para ver qual regra e por quê.
- **Corrigir Markdown** (clique direito ou o menu Plugins) corrige o que for possível.
- Cada bloco é verificado separadamente, então as regras sobre o documento inteiro (níveis de título, a primeira linha, linhas em branco entre blocos) ficam de fora.

## Texto

Cada comando age na seleção ou, depois de perguntar, no documento inteiro. Estão no menu Plugins e na paleta de comandos.

- **Remover linhas em branco**: parágrafos vazios saem; numa seleção, todas as linhas em branco.
- **Remover espaços no fim das linhas**: espaços e tabulações no fim das linhas; os dois espaços de uma quebra de linha ficam.
- **Pontuação chinesa em texto chinês**: 你好,世界? vira 你好，世界？. Números como 1.3.8 e frases em inglês não mudam.
- **Pontuação inglesa em texto inglês**: Hello，world！ vira Hello, world!; sinais junto a texto chinês não mudam.
- **Letras e dígitos de largura total em ASCII**: ＡＢＣ１２３ vira ABC123.
- **Juntar linhas selecionadas** (também no clique direito): as linhas selecionadas viram uma só, sem espaço entre chinês e com um entre palavras.

## Configurações

- **Sublinhar o Markdown que quebra uma regra**: desligado, nada é sublinhado; Corrigir Markdown continua a funcionar.
- **Regras deixadas de lado**: regras do markdownlint, uma por linha (MD009 ou no-trailing-spaces), nem sublinhadas nem corrigidas.

## O que fica como está

Código, fórmulas, front matter, links, #tags, lembretes (@…), comentários %%, HTML e definições de referência ([d]: url) nunca são marcados nem alterados, e o mesmo vale para o que o Obsidian escreve: ids de bloco (^1a2b3c), campos do Dataview (key:: value, [key:: value]), ==destaques== e os campos do Obsidian Tasks (📅 2026-11-07, 🔁 every week, 🆔 abc123). Ao juntar linhas, um campo continua na sua própria linha. Os parênteses mudam aos pares: 价格(USD) vira 价格（USD）.

Espaçamento CJK, o plugin que põe espaços entre texto chinês e latino, também deixa tudo isso como está.

## Permissões

- Ler e editar o documento: para verificá-lo e fazer as correções.
- Ferramentas para o Textus AI: para o Textus AI verificar Markdown com as mesmas regras.

## Alterações

- **0.3.2** - Textos de ajuda e de estado vazio mais curtos.
- **0.3.1** - Sua página agora diz numa frase o que ele faz, o que pode fazer e o que mudou em cada versão.
- **0.3.0** - Agora se chama Arrumar (antes Verificação de Markdown): os seis comandos de texto do “Arrumar texto” vieram para cá; ajustes para desligar o sublinhado ou regras específicas; a sintaxe própria do Obsidian fica como está.
- **0.2.1** - Tags, links, lembretes e definições de referência nunca são marcados: a mesma lista que o Espaçamento CJK deixa em paz.
- **0.2.0** - O Textus AI pode verificar Markdown (`lint_markdown`).
- **0.1.0-0.1.2** - Primeiras versões: sublinhados que explicam a regra, e Corrigir Markdown; página na loja e ícone; funciona no desktop e no iOS.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `lint_markdown`: Verifica Markdown - dado, ou o documento em primeiro plano - com as regras do markdownlint, como o editor as sublinha: a linha, a regra, a descrição de cada problema e se se corrige; com fix, também o texto corrigido. Não altera nada por si.
<!-- /ai-tools -->
