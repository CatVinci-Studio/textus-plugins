# GitHub Copilot CLI

Converse com o GitHub Copilot CLI no Textus AI, com os modelos do seu plano Copilot. Ele lê a pasta aberta, escreve e edita suas notas e pergunta antes de cada alteração: o Textus mostra o que ele quer fazer, e você permite ou não. O que ele mudou fica marcado no documento, a um Desfazer de distância. O modo (agent, plan, autopilot), o modelo e a opção "allow all" ficam no menu ao lado do menu de modelos do Textus AI; "allow all" começa desligada.

1. Instale o [Node.js](https://nodejs.org) se ele não estiver neste computador. Você precisa de um plano GitHub Copilot.
2. Uma vez, num terminal: `npx @github/copilot login`.
3. Clique no botão do GitHub Copilot CLI no canto superior direito da janela, ao lado do botão do Textus AI.

O Textus inicia o [GitHub Copilot CLI](https://github.com/github/copilot-cli) com `copilot --acp`, o servidor de Agent Client Protocol dele, executado com `npx`. O Copilot CLI é um software do próprio GitHub, com licença própria; a conta e o uso são do GitHub, e o Textus não guarda nenhum token para ele.

O autopilot segue sozinho e gasta mais solicitações premium. O Textus mantém a versão que inicia: aqui o Copilot não se atualiza sozinho.

Precisa do Textus 1.4.3 ou mais recente. Pede uma única permissão: iniciar este agente neste computador.

## Alterações

- **0.1.2** - A simpler icon, drawn in the text colour.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: GitHub Copilot CLI in Textus AI.
