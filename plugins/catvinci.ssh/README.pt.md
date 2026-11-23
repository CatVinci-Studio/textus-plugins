# Pastas SSH

Abra uma pasta num servidor pelo seu próprio ssh e escreva lá como numa pasta deste computador: os documentos em abas, os arquivos na barra lateral.

## O que ele faz

- **Plugins › Abrir pasta remota…** lista os servidores do seu `~/.ssh/config` (ou aceita um que você digitar, como `eu@servidor`) e depois a pasta a abrir, começando pela sua pasta pessoal lá.
- A pasta abre na barra lateral. Os documentos abrem, salvam, mudam de nome, são movidos e pesquisados como em qualquer pasta; um documento ou pasta novos são criados no servidor.
- É o seu próprio `ssh` que faz a conexão, com a sua configuração, chaves, agente e hosts conhecidos. Só é pedida a transferência de arquivos (SFTP): nada de shell nem de comandos.
- Uma conexão que cai é refeita na próxima vez que um arquivo é lido ou salvo.

## Limites

- Só entra com chave ou agente. Um servidor que pede senha é recusado; adicione uma chave para ele antes.
- Um servidor que o ssh ainda não conhece é recusado, nunca aceito por você: conecte-se uma vez com `ssh` num terminal e aceite a chave dele lá.
- Ainda não dá para colar imagens num documento de um servidor, e um arquivo excluído some de vez: um servidor não tem lixeira.

## Permissões

Pede **ssh**: o Textus pergunta a você uma vez para cada servidor antes que o plugin possa se conectar a ele.

## Alterações

- **0.1.2** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.": the store shows that.
- **0.1.1** - Uses the plugin API as Textus 1.4.6 ships it.
- **0.1.0** - First version. Needs Textus 1.4.6.
