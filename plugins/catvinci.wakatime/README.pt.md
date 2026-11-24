# WakaTime

Envia o tempo que você passa escrevendo no Textus para a sua conta do [WakaTime](https://wakatime.com), para que ele apareça no seu painel ao lado do tempo programando.

1. Copie a sua chave de API em [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key).
2. Clique em **Definir chave de API…** na página do WakaTime nos Ajustes do Textus e cole a chave. Ela fica guardada no armazenamento seguro do Textus.

O menu Plugins e a paleta de comandos têm **WakaTime: definir chave de API…**, **WakaTime: tempo de escrita de hoje**, que mostra o total de hoje como o WakaTime o conta, e **WakaTime: abrir o painel**.

## O que conta e o que é enviado

- Só conta o seu próprio trabalho numa janela do Textus em primeiro plano: digitar, mover o cursor, trocar de documento e salvar. O tempo com o Textus em segundo plano e as mudanças feitas no disco ou por um plugin não contam. O que você escreve com o Textus AI conta como programação com IA.
- Para cada momento de trabalho, ele informa ao WakaTime o caminho do documento, a linguagem (Markdown), o número de linhas, o projeto e o branch do Git. O projeto é a primeira linha de um arquivo `.wakatime-project` na pasta aberta; senão, o nome da pasta aberta.
- Ele envia no máximo uma vez a cada dois minutos para o mesmo documento, e sempre ao salvar, como fazem os plugins do próprio WakaTime.
- Sem internet, o tempo espera numa fila e vai depois, em lotes.
- Nada é enviado antes de a chave ser definida, e um documento não salvo nunca é enviado. Para parar, defina a chave como vazia.

Precisa do Textus 1.3.0 ou mais recente. Pede para ler o editor e os arquivos da pasta aberta (para o documento, as linhas dele, o `.wakatime-project` e o `.git/HEAD`) e para acessar `api.wakatime.com`, e nada mais na rede.

## Alterações

- **0.2.5** - Set the API key with a button on its page in Settings, and find its commands in the Plugins menu: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.2.4** - Leaving the key empty now really turns it off; a garbled reply to Today's Writing Time shows the usual message.
- **0.2.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.2** - Finds `.wakatime-project` and the Git branch the same way on every system.
- **0.2.1** - Says where it runs: desktop and iPhone.
- **0.2.0** - Only your own work in a window in front counts; an offline queue sent in batches; project, branch and lines; Today's Writing Time.
- **0.1.0** - First version: writing time in Textus on your WakaTime dashboard.
