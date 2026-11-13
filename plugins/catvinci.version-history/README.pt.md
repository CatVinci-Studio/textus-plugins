# Histórico de versões

Guarda cada salvamento de um documento como uma versão, para ver o que mudou e recuperar uma antiga.

- Cada vez que você salva, o texto do documento fica guardado como uma versão. Salvamentos muito próximos (o salvamento automático a cada poucos segundos) contam como um, com uma versão nova no máximo a cada 15 minutos. Ficam as últimas 50 versões de cada documento.
- A aba **Histórico** da barra lateral lista as versões do documento aberto, a mais recente no topo, agrupadas por dia: Hoje, Ontem e depois a data.
- Escolha uma para ver, linha por linha, o que mudou desde então.
- **Restaurar esta versão** oferece o texto antigo como uma edição do documento, que você aceita ou recusa como qualquer outra. **Abrir como novo documento** a abre ao lado.
- As versões ficam dentro do Textus, não na sua pasta. Documentos com mais de 2 MB não são guardados, e quando o armazenamento enche, as versões mais antigas saem primeiro.

## Permissões

- Ler arquivos e o documento: para guardar cada versão e compará-la com o texto atual.
- Propor edições: para trazer uma versão antiga de volta como uma edição que você aceita ou recusa.
- Ferramentas para o Textus AI: para o Textus AI listar as versões de um documento e compará-las.

## Alterações

- **0.3.7** - O texto de um documento antes do primeiro salvamento também fica como versão, e as versões acompanham o documento quando ele é renomeado ou movido.
- **0.3.6** - O salvamento automático enquanto você digita grava só a versão mais recente, não todas as versões do documento, então documentos longos salvam com muito menos trabalho.
- **0.3.5** - Uma versão aberta continua aberta quando o salvamento automático a atualiza, e Restaurar sempre a encontra. Com o armazenamento cheio, versões antigas de outros documentos liberam espaço, e o painel avisa quando um salvamento não pôde ser mantido. As linhas funcionam pelo teclado; os botões quebram linha numa barra lateral estreita.
- **0.3.4** - Na barra lateral o painel não mostra mais um título próprio, como as outras abas. Textos de ajuda e de estado vazio mais curtos. O painel lateral e a página seguem o layout do Textus 1.3.13.
- **0.3.3** - Suas barras, listas e controles agora são os do Textus, crescem com a interface e seguem cada tema; requer Textus 1.3.12.
- **0.3.2** - Sua página agora diz numa frase o que ele faz, o que pode fazer e o que mudou em cada versão.
- **0.3.1** - Só mudou o código de caminhos compartilhado com outros plugins; nada muda no uso.
- **0.3.0** - O Textus AI pode listar as versões de um documento e compará-las (`list_versions`, `diff_versions`).
- **0.2.0** - Controles do próprio Textus. Requer Textus 1.3.2.
- **0.1.0-0.1.3** - Primeiras versões: uma versão a cada salvamento, o que mudou desde então, restaurar como edição a aceitar ou recusar, abrir como novo documento, salvamentos próximos como um só, versões agrupadas por dia, as mais antigas saem quando o armazenamento enche.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_versions`: Lista as versões guardadas de um documento - o que está em primeiro plano se não for dado caminho -, a mais recente primeiro, numeradas a partir de 1, cada uma com quando foi guardada e o tamanho.
- `diff_versions`: Mostra, linha a linha, o que mudou entre duas versões de um documento, ou entre uma versão e o documento como está: + adicionado, - removido, com algum contexto.
<!-- /ai-tools -->
