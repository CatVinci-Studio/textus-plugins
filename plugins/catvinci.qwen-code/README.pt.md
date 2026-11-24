# Qwen Code

Converse com o Qwen Code no Textus AI, com os modelos Qwen da Alibaba. Ele lê a pasta aberta, escreve e edita suas notas e pergunta antes de cada alteração: o Textus mostra o que ele quer fazer, e você permite ou não. O que ele mudou fica marcado no documento, a um Desfazer de distância. O modo (perguntar antes, aceitar edições, decidir sozinho, aceitar tudo, planejar), o modelo e o raciocínio ficam no menu ao lado do menu de modelos do Textus AI.

1. Instale o [Node.js](https://nodejs.org) 22 ou mais recente se ele não estiver neste computador.
2. Dê a ele uma chave de API uma vez: coloque `OPENAI_API_KEY`, `OPENAI_BASE_URL` e `OPENAI_MODEL` em `~/.qwen/.env` (para o OpenRouter, a URL base é `https://openrouter.ai/api/v1`), ou execute `npx @qwen-code/qwen-code` num terminal e use `/auth` (Alibaba Cloud Model Studio ou qualquer serviço compatível com a OpenAI).
3. Clique no botão do Qwen Code no canto superior direito da janela, ao lado do botão do Textus AI.

O Textus inicia o [Qwen Code](https://github.com/QwenLM/qwen-code) com `qwen --acp`, o servidor de Agent Client Protocol dele, executado com `npx`. A chave e o uso são do seu provedor; o Textus não guarda nenhuma chave para ele.

Ele começa em perguntar antes. As escolhas "Always allow" para comandos ficam salvas pelo Qwen Code de vez, no projeto ou para você.

Precisa do Textus 1.4.3 ou mais recente. Pede uma única permissão: iniciar este agente neste computador.

## Alterações

- **0.1.2** - Its icon is Qwen Code's own logo.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Qwen Code in Textus AI.
