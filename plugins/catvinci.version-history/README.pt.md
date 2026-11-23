# Histórico de versões

Guarda cada salvamento de um documento como uma versão, para ver o que mudou e recuperar uma antiga.

- Cada vez que você salva, o texto do documento fica guardado como uma versão. Salvamentos muito próximos (o salvamento automático a cada poucos segundos) contam como um, com uma versão nova no máximo a cada 15 minutos. Fica tudo do último dia, depois uma por hora durante uma semana, uma por dia durante três meses e uma por semana antes disso.
- A aba **Histórico** da barra lateral lista as versões do documento aberto, a mais recente no topo, agrupadas por dia: Hoje, Ontem e depois a data.
- Escolha uma para ver, linha por linha, o que mudou desde então.
- Compare-a com o documento agora ou com qualquer outra versão, com as palavras alteradas marcadas. **Repor** junto a uma alteração recupera só essa alteração; **Mais** dá nome ou fixa uma versão, que fica então guardada para sempre, ou abre-a como novo documento. As alterações feitas fora do Textus (outra app, uma sincronização, git) também ficam: o texto de antes e o de depois.
- **Restaurar** oferece o texto antigo como uma edição do documento, que você aceita ou recusa como qualquer outra. **Abrir como novo documento** a abre ao lado.
- As versões ficam dentro do Textus, não na sua pasta. Documentos com mais de 2 MB não são guardados, e quando o armazenamento enche, as versões mais antigas saem primeiro.

## Permissões

- Ler arquivos e o documento: para guardar cada versão e compará-la com o texto atual.
- Propor edições: para trazer uma versão antiga de volta como uma edição que você aceita ou recusa.
- Ferramentas para o Textus AI: para o Textus AI listar as versões de um documento e compará-las.

## Alterações

- **0.5.0** - From Textus 1.4.4 the versions other plugins keep of a document - Cloud Sync's - are listed too, each under its source's name, to compare and restore like the rest.
- **0.4.1** - Restore is one word, so its button fits a narrow sidebar in every language.
- **0.4.0** - Versions thin out with age instead of the last 50 going; each text is stored once; a deleted document's versions go a month later. Compare any two versions, word by word; take back one change; name and pin versions; changes made outside Textus are kept. Versions from 0.3 move over by themselves. Needs Textus 1.4.3. In a Git folder on the desktop, the document's commits show under its versions.
- **0.3.8** - The text from before the first save is no longer lost when that save comes right as the document opens.
- **0.3.7** - The text a document had before its first save is kept as a version too, and a document's versions follow it when it is renamed or moved.
- **0.3.6** - Autosave while you type writes only the newest version, not every version of the document, so long documents save with much less work.
- **0.3.5** - An open version stays open while autosave updates it, and Restore always finds it. When storage is full, older versions of other documents make room, and the panel says when a save couldn't be kept. Rows work from the keyboard; buttons wrap in a narrow sidebar.
- **0.3.4** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Only the path code shared with other plugins changed; nothing changes in use.
- **0.3.0** - Textus AI can list a document's versions and compare them (`list_versions`, `diff_versions`).
- **0.2.0** - Textus's own controls. Needs Textus 1.3.2.
- **0.1.0-0.1.3** - First versions: a version on each save, what changed since, restore as an edit to accept or reject, open as a new document, saves close together kept as one, versions grouped by day, the oldest dropped when storage is full.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_versions`: Lista as versões guardadas de um documento - o que está em primeiro plano se não for dado caminho -, a mais recente primeiro, numeradas a partir de 1, cada uma com quando foi guardada e o tamanho.
- `diff_versions`: Mostra, linha a linha, o que mudou entre duas versões de um documento, ou entre uma versão e o documento como está: + adicionado, - removido, com algum contexto.
<!-- /ai-tools -->
