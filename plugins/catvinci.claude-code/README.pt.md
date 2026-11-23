# Claude Code

Converse com o Claude Code no Textus AI. Ele lê a pasta aberta, escreve e edita suas notas e pergunta antes de cada alteração: o Textus mostra o que ele quer fazer, e você permite ou não. O que ele mudou fica marcado no documento, a um Desfazer de distância.

1. Instale o [Node.js](https://nodejs.org) se ele não estiver neste computador.
2. Entre no Claude Code uma vez, num terminal: `npx -y @agentclientprotocol/claude-agent-acp@0.107.0 --cli auth login --claudeai` (ou execute `claude`, se estiver instalado).
3. Clique no botão do Claude Code no canto superior direito da janela, ao lado do botão do Textus AI, ou escolha **Claude Code** no menu de modelos do Textus AI.

O Textus inicia o Claude Code da Anthropic pelo adaptador do Agent Client Protocol `@agentclientprotocol/claude-agent-acp`, executado com `npx`. A conta e o uso são do próprio Claude Code; o Textus não guarda nenhuma chave para ele.

Ele começa no modo **Manual** do Claude Code, que pergunta antes de cada edição e de cada comando; escolha outro modo no menu ao lado do modelo. Para usá-lo pelo OpenRouter, coloque `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN` e um `ANTHROPIC_API_KEY` vazio no bloco `env` de `~/.claude/settings.json`: o Textus aberto pelo Dock não vê variáveis definidas num terminal.

Precisa do Textus 1.4.3 ou mais recente. Pede uma única permissão: iniciar este agente neste computador.

## Alterações

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Starts in Manual mode, named by the plugin; its sign-in command needs no separate Claude Code install. Needs Textus 1.4.3, which also marks the changes Claude Code writes itself.
- **0.1.2** - Uses Claude Code's ACP adapter 0.107.0. Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Claude Code answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Claude Code in Textus AI.
