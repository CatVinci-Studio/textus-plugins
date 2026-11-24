# DeepSeek Harness

Converse no Textus AI com o DeepSeek Harness, o agente da própria DeepSeek. Ele lê a pasta aberta, escreve e edita suas notas e pergunta antes de cada alteração: o Textus mostra o que ele quer fazer, e você permite ou não. O que ele mudou fica marcado no documento, a um Desfazer de distância.

1. Instale o [Node.js](https://nodejs.org) 24.9 ou mais recente se este computador não o tiver.
2. Dê a ele a sua chave de API da DeepSeek uma vez: execute `npx -y @deepseek-ai/dsh@0.2.2-rc.1 web` num terminal e adicione a chave na página Models dele.
3. Clique no botão do DeepSeek Harness no canto superior direito da janela, ao lado do botão do Textus AI.

O Textus inicia o [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) com `dsh --profile acp`, o servidor de Agent Client Protocol dele, executado com `npx`. A chave e o uso são da DeepSeek; o Textus não guarda nenhuma chave para ele. O DeepSeek Harness é uma versão de prévia, então o comportamento dele pode mudar.

O Textus o inicia no sandbox somente leitura dele: ele lê e pesquisa à vontade, e pergunta antes de gravar um arquivo ou executar um comando que muda algo.

O DeepSeek Harness envia por padrão os registros das sessões para a DeepSeek; desligue isso no `dsh web`, em Settings › General. O Textus desliga os relatórios de uso dele.

Precisa do Textus 1.4.3 ou mais recente. Pede uma única permissão: iniciar este agente neste computador.

## Alterações

- **0.1.3** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.2** - Asks before writing files or running commands that change things (before, it did both without asking). Usage reports off, and the setup names the exact version and Node.js 24.9. Needs Textus 1.4.3.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: DeepSeek Harness in Textus AI.
