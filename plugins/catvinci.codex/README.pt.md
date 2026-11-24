# Codex

Converse com o Codex no Textus AI. Ele lê a pasta aberta, escreve e edita suas notas e pergunta antes de cada alteração: o Textus mostra o que ele quer fazer, e você permite ou não. O que ele mudou fica marcado no documento, a um Desfazer de distância.

1. Instale o [Node.js](https://nodejs.org) se ele não estiver neste computador.
2. Na primeira vez, um navegador se abre para entrar com o ChatGPT; ou entre uma vez num terminal: `npx -y @agentclientprotocol/codex-acp@2.6.0 cli login`.
3. Clique no botão do Codex no canto superior direito da janela, ao lado do botão do Textus AI, ou escolha **Codex** no menu de modelos do Textus AI.

O Textus inicia o Codex da OpenAI pelo adaptador do Agent Client Protocol `@agentclientprotocol/codex-acp`, executado com `npx`. A conta e o uso são do próprio Codex; o Textus não guarda nenhuma chave para ele.

Ele começa em **Read-only**, o modo que pergunta antes de cada edição e de cada comando; escolha outro no menu ao lado do modelo.

Precisa do Textus 1.4.3 ou mais recente. Pede uma única permissão: iniciar este agente neste computador.

## Alterações

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Signs in with ChatGPT in the browser (before, it tried an API key and stopped there), and starts in Read-only. Needs Textus 1.4.3, which also marks the changes Codex writes itself.
- **0.1.2** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Codex answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Codex in Textus AI.
