# Gemini CLI

Converse com o Gemini CLI no Textus AI, com os modelos Gemini do Google. Ele lê a pasta aberta, escreve e edita suas notas e pergunta antes de cada alteração: o Textus mostra o que ele quer fazer, e você permite ou não. O que ele mudou fica marcado no documento, a um Desfazer de distância. O modo (perguntar antes, aceitar edições, aceitar tudo, planejar) e o modelo ficam no menu ao lado do menu de modelos do Textus AI.

1. Instale o [Node.js](https://nodejs.org) se ele não estiver neste computador.
2. Clique no botão do Gemini CLI no canto superior direito da janela, ao lado do botão do Textus AI. Na primeira vez, um navegador se abre para entrar com a sua conta Google. Para uma chave da API Gemini ou para o Vertex AI, execute `npx @google/gemini-cli` uma vez num terminal e escolha-a com `/auth` (o Textus aberto pelo Dock não vê variáveis definidas num terminal).

O Textus inicia o [Gemini CLI](https://github.com/google-gemini/gemini-cli) com `gemini --acp`, o servidor de Agent Client Protocol dele, executado com `npx`. A conta e o uso são do Google; o Textus não guarda nenhuma chave para ele.

Aceitar edições e aceitar tudo só funcionam em pastas que você marcou como confiáveis no próprio Gemini CLI; nas outras, ele fica em perguntar antes.

Precisa do Textus 1.4.3 ou mais recente. Pede uma única permissão: iniciar este agente neste computador.

## Alterações

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Gemini CLI in Textus AI.
