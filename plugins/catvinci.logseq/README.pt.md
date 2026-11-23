# Pastas do Logseq

Abre um grafo do Logseq como o Logseq o escreve: links pelo nome da página, imagens em assets, diários na sua pasta e no seu formato de data.

## O que ele faz

- Quando a pasta que você abre, ou uma pasta acima dela, é um grafo do Logseq guardado em arquivos (tem `logseq/config.edn`), o Textus escreve os links pelo nome da página (`[[Página]]`), coloca as páginas criadas a partir de um link em `pages/` (ou no seu `:pages-directory`), e as Notas diárias guardam os diários em `journals/`, com o nome que o seu `:journal/file-name-format` indica.
- A pasta de imagens do Logseq, `assets/`, é oferecida uma vez num cartão no canto. Se aceitar, ela fica guardada no `.textus/settings.json` da pasta; se ficar com a sua, o Textus não pergunta de novo.
- Os links wiki do grafo são encontrados a partir da pasta do grafo mesmo sem este plugin.

## Permissões

Ele só pede para **ler os arquivos da pasta aberta**: o Textus lhe entrega o `logseq/config.edn` e ele diz o que o arquivo significa. Não muda nada.

## Alterações

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it.
- **0.1.0** - First version: Logseq's settings offered when a Logseq graph is opened. Needs Textus 1.4.6.
