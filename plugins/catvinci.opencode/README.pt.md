# OpenCode

Converse com o OpenCode no Textus AI, com o modelo que você configurou nele. Ele lê a pasta aberta, escreve e edita suas notas e pergunta antes de cada alteração: o Textus mostra o que ele quer fazer, e você permite ou não. O que ele mudou fica marcado no documento, a um Desfazer de distância. Para deixá-lo trabalhar sem perguntar, escolha Allow all no menu ao lado do modelo (Textus 1.4.3 ou mais recente).

1. Instale o [Node.js](https://nodejs.org) se ele não estiver neste computador.
2. Ele funciona logo com os modelos gratuitos do OpenCode. Para o seu próprio provedor (o OpenRouter, por exemplo), entre uma vez num terminal: `npx -y opencode-ai@1.19.5 auth login`.
3. Clique no botão do OpenCode no canto superior direito da janela, ao lado do botão do Textus AI.

O Textus inicia o [OpenCode](https://opencode.ai) com `opencode acp`, o servidor de Agent Client Protocol dele, executado com `npx`. As contas e o uso são do próprio OpenCode; o Textus não guarda nenhuma chave para ele.

Ele pergunta antes de edições, comandos e acessos à web; no modo plan ele não edita. Os subagentes dele estão desligados por enquanto: o OpenCode não repassa as perguntas deles, e uma resposta ficaria esperando para sempre.

Precisa do Textus 1.4.3 ou mais recente. Pede uma única permissão: iniciar este agente neste computador.

## Alterações

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Asks before web fetches too, plan mode no longer edits, and sub-agents are off (their questions never arrived, so a turn hung). Needs Textus 1.4.3.
- **0.1.2** - Asks before each edit and command, as it says: OpenCode on its own allowed them unasked.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: OpenCode in Textus AI.
