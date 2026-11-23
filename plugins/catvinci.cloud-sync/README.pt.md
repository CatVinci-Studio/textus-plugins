# Sincronização na nuvem

Mantenha uma pasta igual nos seus computadores pelo seu próprio armazenamento compatível com S3, WebDAV ou Nutstore, com as versões anteriores guardadas na nuvem e, se você quiser, criptografada antes de sair de cada aparelho.

Com a criptografia de ponta a ponta ligada, o serviço de armazenamento não vê nem o conteúdo dos seus arquivos nem os nomes deles.
A Sincronização na nuvem precisa do Textus 1.4.1 ou mais recente.

## Primeiros passos

1. Abra no Textus a pasta a sincronizar e escolha **Plugins › Sincronização na nuvem**
   (ou **Configurar conexão…** na aba dela na barra lateral).
2. Escolha o serviço de armazenamento e informe o endereço do servidor e o login. O Nutstore
   só precisa do seu e-mail e de uma senha de aplicativo, criada em Conta › Segurança.
3. Para criptografar, ligue **Criptografia de ponta a ponta** e defina uma **senha de sincronização**
   de pelo menos 12 caracteres; guarde-a no seu gerenciador de senhas: ela não pode ser
   redefinida. Decida isso uma vez por pasta remota: mudar depois exige uma pasta nova
   e vazia.
4. Escolha **Salvar conexão** e depois **Sincronizar agora**.

Em outro aparelho, abra a pasta correspondente e informe o mesmo serviço e
a mesma pasta remota (e, se ela for criptografada, a mesma senha de sincronização). Ligue **Sincronizar automaticamente**
(enquanto o Textus estiver aberto): a partir daí ele sincroniza alguns segundos depois que você salva ou renomeia um
arquivo, e também a cada 5 minutos, caso nada tenha disparado a sincronização (**Intervalo de sincronização**: de 5 a
60 minutos). Um arquivo que você exclui sai na próxima sincronização. **Plugins › Sincronizar
agora** sincroniza a qualquer momento.

Depois que uma conexão é salva, a barra de status mostra como está a sincronização: **Sincronizado ·
há 2 min**, **Sincronizando…**, **Conflito de sincronização** ou **Erro de sincronização**. Clique nela para
abrir o painel.

Quando os dois aparelhos alteraram o mesmo arquivo, as duas versões ficam: a sua no lugar,
a do outro aparelho em `Sync conflicts/`.

## Histórico na nuvem

Cada vez que uma sincronização substitui ou exclui um arquivo, o conteúdo anterior fica na
pasta remota. Clique com o botão direito num arquivo e escolha **Histórico na nuvem…** para ver as
versões dele (quando, de qual aparelho, de que tamanho), ler uma e escolher **Restaurar esta
versão**: ela vira o arquivo atual e é sincronizada, e a versão que ela substitui
fica no histórico. Se o arquivo ali tiver edições ainda não sincronizadas, ou estiver aberto,
a versão é escrita ao lado dele (`Note (3f2a9c1b).md`). **Plugins › Histórico na nuvem…** lista os arquivos excluídos
da pasta; abra um para trazê-lo de volta.

**Manter histórico na nuvem** define por quanto tempo, contado a partir de quando uma versão foi
substituída: 30, 90 (o padrão) ou 365 dias, ou sempre. Um único ajuste vale para
a pasta: o último sincronizado a partir de qualquer aparelho, que os outros passam então a mostrar.
No primeiro dia é guardada uma versão por hora, depois uma por dia, no máximo 200 por
arquivo; se o histórico passar de 8 MB de registros, as versões mais antigas saem primeiro.
Cada sincronização que muda algo, e senão uma vez por dia, descarta as versões
expiradas e exclui os blocos que só elas usavam. O espaço ocupado antes da 0.5
(snapshots antigos) não é recuperado. Atualize todos os aparelhos para a 0.5: o que um aparelho com a 0.4
altera só entra no histórico na próxima sincronização de um com a 0.5, e as exclusões
dele só são listadas a partir daí.

**Permissões:** ler e gravar a pasta aberta (para examiná-la e aplicar o que
chega), e acessar qualquer site (só o servidor HTTPS que você informar). Sem
telemetria, análises, código remoto nem atualizações automáticas.

## Detalhes

O S3 aceita um endpoint personalizado (vazio significa AWS), região, bucket, endereçamento no estilo caminho ou
virtual-host e um token de sessão opcional em **Mais opções**.
A pasta remota guarda o formato de armazenamento do plugin, não um espelho simples dos arquivos;
use uma diferente para cada espaço de trabalho.

As credenciais são guardadas pelo `ctx.secrets`, separadas do estado da sincronização.
Nunca são devolvidas à página de ajustes nem copiadas para o manifesto
remoto. Campos de credenciais em branco mantêm as credenciais de uma conexão existente.
Mudar o endpoint, a pasta remota ou a conta exige as credenciais correspondentes.
A senha de sincronização também é salva localmente pelo `ctx.secrets` para a sincronização automática,
nunca devolvida à página de ajustes nem enviada ao serviço de armazenamento. Campos de senha
em branco a mantêm. Digitar uma senha diferente aqui não recriptografa um repositório
existente: ela precisa ser a mesma usada para inicializar essa pasta remota.

## O que é sincronizado

- Documentos `.md`, `.markdown`, `.mdown`, `.mkd`, `.txt` e `.csv` salvos, e
  as bases (`.base`) e os canvas (`.canvas`) do Obsidian.
- Imagens, PDF, arquivos do Office/OpenDocument, áudio e vídeo. A lista exata
  está em `development/cloud-sync/src/config.ts` no repositório do plugin.
- Dados de projeto do Textus: `.textus/agent.md`, `style.md`, `style.previous.md`
  e o Markdown em `.textus/library/`, `memory/` e `skills/`.

Os ajustes globais, o histórico de conversas, os rascunhos, as edições não salvas, as credenciais, os dados de outros
plugins, arquivos ocultos quaisquer e as pastas de build/dependências ficam de fora.
Só os arquivos dentro do espaço de trabalho aberto podem ser acessados. Os arquivos fora dele,
inclusive anexos com link que estão fora da pasta, não são enviados.

Nos Ajustes você pode deixar mais coisas de fora: uma regra por linha, escrita como num
`.gitignore` (`drafts/`, `*.pdf`, `!keep.pdf`). Uma opção aplica também o `.gitignore`
da própria pasta. Os arquivos deixados de fora ficam como estão em cada aparelho:
nada é enviado, baixado ou excluído para eles. Outra opção leva junto
os ajustes compartilhados do Obsidian (`.obsidian/app.json`, `appearance.json`,
`hotkeys.json`, `bookmarks.json`, `graph.json`, `core-plugins.json`,
`types.json`); os arquivos dele que são de cada aparelho, como `workspace.json`, ficam locais.

Os limites atuais são 128 MiB por arquivo, 20.000 arquivos/pastas percorridos,
48 níveis de pastas e um manifesto de 8 MiB. Pastas vazias não são sincronizadas.
Caminhos inseguros nas plataformas suportadas, ou que só diferem em maiúsculas/minúsculas ou na
normalização Unicode, interrompem a execução em vez de serem renomeados em silêncio.

## Alterações e conflitos

Os hashes SHA-256 e a última sincronização bem-sucedida determinam qual lado mudou.
Só o conteúdo alterado é transferido. Os arquivos são guardados em blocos de 2 MiB, e
os blocos compartilhados são reaproveitados; os ETags não são tratados como hashes de conteúdo.

- Edições independentes são copiadas para o outro aparelho.
- Edições simultâneas mantêm o arquivo local e salvam a versão remota em
  `Sync conflicts/`. As duas versões são publicadas para os outros aparelhos.
- Arquivos de destino abertos ficam para depois; salve-os e feche-os, e sincronize de novo.
- Os arquivos de texto existentes são atualizados pela API `files.process` do Textus,
  que verifica a versão. Os arquivos binários existentes nunca são sobrescritos: anexos
  diferentes mantêm as duas versões, mesmo quando só um lado mudou. A API atual de
  plugins não tem uma operação de substituição condicional de binários.
- Um arquivo excluído num aparelho é excluído nos outros na próxima sincronização deles,
  e os outros aparelhos o movem para a lixeira do sistema, de onde você pode restaurá-lo.
  O arquivo excluído fica no histórico na nuvem enquanto ele guardar
  versões. Uma renomeação chega aos outros aparelhos como renomeação.
- O conteúdo só sai do servidor quando o histórico o descarta: até lá, um
  arquivo excluído pode ser lido por qualquer pessoa que consiga ler a pasta remota (e, se
  ela for criptografada, saiba a senha de sincronização). Para remover um conteúdo de vez, use
  uma pasta remota nova para um espaço de trabalho limpo.
- Uma edição ganha de uma exclusão: se um aparelho excluiu um arquivo que o outro editou
  desde a última vez que sincronizaram, o arquivo editado volta em todos.
- Um aparelho que sincroniza uma pasta pela primeira vez nunca exclui nada; um arquivo
  que só um lado tem é copiado para o outro.
- Uma sincronização que excluiria muitos arquivos da nuvem (mais de dez, e mais
  de 30% dos arquivos sincronizados) para antes de excluir qualquer um e pergunta; uma que começou
  sozinha pergunta uma vez, e **Sincronizar agora** pergunta de novo. Arquivos renomeados ou movidos
  não contam. Uma pasta em que nada é encontrado, embora muitos arquivos tenham sido sincronizados
  a partir dela, é considerada ilegível (acesso perdido, arquivos não baixados), e
  a sincronização para sem excluir nada.
- Quando a lixeira do sistema recusa um arquivo excluído em outro aparelho, ele fica no lugar,
  aparece listado no painel, e a próxima sincronização tenta de novo;
  o resto da sincronização continua.
- Os arquivos abertos numa aba não são removidos nem renomeados; feche-os e sincronize de novo.
- Atualize todos os aparelhos para a 0.4 antes de contar com as exclusões: um aparelho mais antigo
  devolve um arquivo excluído em outro lugar.

Com a **Criptografia de ponta a ponta** ligada, o conteúdo e os nomes de arquivo são criptografados antes do envio; de
qualquer forma, tudo trafega por HTTPS.
Use um bucket S3 ou uma pasta WebDAV privados. A conta do serviço
precisa de permissão de leitura, gravação e exclusão na pasta remota dedicada
(a exclusão é necessária para objetos temporários e bloqueios).

## Solicitações por sincronização

Medidas pelos testes por HTTP para um documento pequeno, depois da primeira
sincronização da sessão (a primeira também verifica as gravações exclusivas do servidor: 4 solicitações
a mais no S3):

| Sincronização                         | S3  | WebDAV / Nutstore |
| ------------------------------------- | --- | ----------------- |
| Nada mudou                            | 3   | 3                 |
| Um documento editado (um bloco de 2 MiB) | 18  | 20                |
| Um arquivo excluído                   | 20  | 22                |

Sem nada alterado em nenhum dos lados, uma sincronização só lê a revisão atual da pasta
e não pega bloqueio. Cada bloco alterado a mais acrescenta 1 solicitação: um bloco
é enviado uma vez, sem perguntar antes se ele já está lá nem lê-lo de volta
(os blocos recebem o nome pelo conteúdo; cada download verifica cada um). No
WebDAV, um bloco que vai para uma pasta que ainda não existe custa mais 2, o
envio recusado e a pasta; pegar o bloqueio custa um envio e um `MOVE`. As sincronizações depois de salvar esperam o salvamento se assentar (5 s) e depois o **Atraso
de sincronização** (de nenhum a 10 minutos): 3 para uma conexão nova do Nutstore, já que o Nutstore
limita as solicitações por conta, e 0 para S3 e WebDAV. A resposta de um servidor ocupado
(429, 503) pausa todas as solicitações; quando ele pede uma espera, o status mostra
"Aguardando o servidor" com os segundos, até 60 s. Se ele pedir mais tempo, essa
sincronização para e diz para tentar mais tarde; o que ela enviou fica guardado para a próxima.

## Criptografia de ponta a ponta

Com a **Criptografia de ponta a ponta** ligada, o conteúdo dos arquivos, os caminhos, os hashes de conteúdo e os snapshots são autenticados e criptografados
com AES-256-GCM pelo Web Crypto. Cada criptografia usa um nonce novo de 96 bits e
uma tag de 128 bits. A autenticação vincula o cabeçalho de criptografia do repositório e a
chave lógica do objeto, impedindo a troca entre blocos, manifestos e snapshots.

Uma raiz de 256 bits é derivada localmente com PBKDF2-HMAC-SHA-256, 600.000 iterações e
um salt aleatório de 256 bits do repositório. O HKDF-SHA-256 deriva chaves separadas para o AES e
para a nomeação de objetos com HMAC-SHA-256. Os nomes dos blocos de conteúdo são HMACs com chave, não hashes
públicos do texto simples. Blocos iguais são reaproveitados dentro de um repositório; repositórios sem relação
usam salts e chaves diferentes. A descriptografia autentica os bytes antes de aplicar os arquivos.

Só os parâmetros públicos do KDF, um ID do repositório e uma mensagem fixa de verificação criptografada
ficam guardados no descritor de criptografia. Um aparelho fixa a impressão digital do descritor
depois do primeiro desbloqueio bem-sucedido e para se ela mudar ou desaparecer.
Senhas erradas, descritores malformados e texto cifrado adulterado interrompem a sincronização.

O provedor ainda pode observar o prefixo remoto escolhido, o tamanho e a quantidade de objetos,
o reaproveitamento de blocos dentro de um repositório, o momento das solicitações e o dono/horário anônimo do bloqueio.
O protocolo não garante detectar um servidor malicioso que reapresente um estado criptografado
válido mais antigo. Senhas fortes importam porque o texto cifrado remoto permite
tentar adivinhar a senha offline; o KDF aumenta o custo disso, mas não torna forte uma senha
fraca. Esta implementação tem testes automatizados de interoperabilidade e de adulteração,
mas não passou por uma auditoria de segurança independente.

Os arquivos locais continuam legíveis. A senha fica no armazenamento local de segredos do Textus, por usuário,
não no repositório remoto; isso não protege um cliente comprometido ou
desbloqueado. Perder a senha ou o descritor de criptografia original torna a recuperação remota
impossível. Um backup completo precisa incluir o descritor e os objetos criptografados.

### Formato remoto

- `v1/head.json`: o descritor público de criptografia (`textus-cloud-sync-e2ee/1`).
  O caminho antigo é intencional: os clientes v0.1 rejeitam este formato antes de enviar arquivos.
- `v1/lock.json`: exclusão compartilhada com clientes antigos e novos; nenhum dado de documento.
- `v2/head.bin`: manifesto atual criptografado.
- `v2/history.bin`: histórico criptografado (as versões anteriores e as origens de cada arquivo).
- `v2/blocks/<prefix>/<HMAC>`: blocos de conteúdo criptografados.
- `v2/snapshots/<revision>.bin`: manifestos criptografados da revisão atual e da
  anterior.

Sem criptografia, os mesmos objetos são guardados como JSON e blocos brutos:
`v1/head.json`, `v1/history.json`, `v1/blocks/<prefix>/<SHA-256>` e
`v1/snapshots/<revision>.json`. Uma pasta remota é criptografada ou não;
o plugin se recusa a misturar as duas coisas.

Os objetos criptografados contêm `TCS2`, um nonce de 12 bytes, depois o texto cifrado e a tag
GCM de 16 bytes. O AAD é o UTF-8 do cabeçalho JSON canônico (`format`, `repositoryId`, `kdf`,
`iterations`, `salt`, nessa ordem), uma quebra de linha e a chave lógica v1 do objeto. A
senha é UTF-8 sem normalização. O HKDF usa o ID do repositório em UTF-8 como salt
e `textus-cloud-sync-e2ee/1/content` ou `/names` como info. A entrada do HMAC de um bloco é a
chave lógica `v1/blocks/<hash-prefix>/<SHA-256>` em UTF-8. O texto simples de verificação é
`Textus encrypted workspace key check`, com a chave lógica `key-check`; o envelope dele
fica em hexadecimal em `verifier`. Essas escolhas são verificadas nos testes contra as APIs independentes
de PBKDF2, HKDF, HMAC e AES-GCM do Node.

### Passar uma pasta para a criptografia

Uma pasta remota não é convertida no lugar. Primeiro garanta que um espaço de trabalho local
contenha todos os arquivos e cópias de conflito de que você precisa, depois escolha uma **pasta remota nova
e vazia**, ligue a criptografia e defina uma senha de sincronização. Sincronize primeiro esse espaço
de trabalho completo; os outros aparelhos podem então entrar com a mesma senha e a mesma pasta
remota.

Os dados remotos antigos, incluindo o histórico de versões e os backups do próprio provedor,
continuam sem criptografia. Cuide das cópias antigas pelo seu provedor depois de verificar o
espaço de trabalho criptografado. Trocar a senha no lugar não é possível; use outra
pasta remota nova para mudar de senha.

## Sincronização interrompida

Um bloqueio remoto faz os aparelhos sincronizarem um de cada vez. O S3 usa `If-None-Match: *`; o WebDAV usa um
envio temporário seguido de `MOVE` com `Overwrite: F`, incluindo a resposta
409 do Nutstore para um destino existente. O teste de conexão verifica a exclusão
antes que uma sincronização possa tocar nos dados do espaço de trabalho. Não é preciso nenhuma API de listagem nem uma listagem
ilimitada de pastas.

Os blocos criptografados e um snapshot imutável são gravados antes de o `v2/head.bin` ser
publicado. A base local só avança depois que a publicação dá certo.
As novas tentativas reaproveitam os blocos concluídos, também depois de reiniciar: os blocos que uma sincronização interrompida
guardou ficam registrados localmente e não são verificados de novo, desde que nenhum outro
aparelho tenha publicado nesse meio-tempo. O cancelamento para depois da solicitação de rede
atual e libera o bloqueio quando possível. A API de rede do Textus limita uma
solicitação a 60 segundos; ela não oferece cancelamento por solicitação.

Os novos downloads binários reservam um caminho com um marcador único registrado no armazenamento local
do plugin. Depois de uma gravação interrompida, a próxima sincronização retoma exatamente esse
marcador em vez de enviá-lo como conteúdo do arquivo. Se outro aplicativo alterar
o arquivo, o conteúdo dele é preservado. Mantenha os dados locais do plugin ao tentar de novo.

Um bloqueio que este aparelho deixou quando o Textus foi fechado ou parou no meio de uma sincronização é
retomado pela próxima sincronização dele, sem perguntar. Uma sincronização em andamento renova um registro do seu
bloqueio a cada 10 segundos; a próxima sincronização retoma o bloqueio quando o registro tem 30
segundos, esperando o restante se começar antes, e o deixa em paz se
o registro for renovado nesse meio-tempo (uma sincronização ainda rodando em outra janela). O bloqueio de outro aparelho
nunca é tomado: depois de uma falha lá, **Recuperação › Remover bloqueio antigo** o remove
só depois de confirmar. Verifique antes que todos os outros aparelhos pararam de
sincronizar. Os bloqueios nunca expiram no remoto, então um aparelho lento não perde o direito
de gravar só porque um temporizador expirou.

O que uma sincronização encontrou em cada arquivo (tamanho, horário, hash) fica guardado localmente entre
uma abertura e outra, então a primeira sincronização depois de reiniciar só lê de novo os arquivos alterados
nesse meio-tempo. Se o descritor ou o manifesto atual for
removido por acidente, um aparelho que já tinha entrado para. Restaure um backup remoto
completo com o descritor original. Os snapshots criptografados ficam vinculados aos próprios
nomes de objeto e não podem ser copiados diretamente sobre `v2/head.bin`; restaurar um único
snapshot exige descriptografá-lo e criptografá-lo de novo para essa chave lógica. Ainda não
há uma interface para restaurar um único snapshot.
Não altere os arquivos remotos enquanto uma sincronização estiver em andamento.

## Vindo do plugin da comunidade

O plugin oficial é `catvinci.cloud-sync`. O plugin da comunidade anterior,
`ciao1019.cloud-sync`, tem ajustes locais, segredos e estado de sincronização separados.
Antes de trocar, termine ou recupere qualquer sincronização interrompida com o plugin antigo,
depois desligue a sincronização automática dele e desative-o. Guarde um backup do espaço de trabalho.

Instale o plugin oficial e informe a mesma conexão de armazenamento, exatamente a mesma pasta
remota e a mesma senha de sincronização. O formato remoto criptografado não mudou, então os dados remotos
existentes da v0.2/v0.3 podem ser lidos sem movê-los nem recriptografá-los. As credenciais
locais, as impressões digitais fixadas do descritor e as bases não são copiadas entre IDs de plugin;
a primeira execução entra no remoto existente como um aparelho novo e pode manter
cópias de conflito se os arquivos forem diferentes. Nunca rode a sincronização automática dos dois plugins no
mesmo espaço de trabalho. Os dados v0.1 em texto simples ainda precisam do procedimento de atualização separado descrito acima.

## Desenvolvimento e créditos

O código-fonte, os testes de protocolo e as instruções de build estão em
[development/cloud-sync](https://github.com/CatVinci-Studio/textus-plugins/tree/main/development/cloud-sync).
O catálogo empacota os arquivos legíveis em `plugins/catvinci.cloud-sync/`
sem compilá-los. As versões seguem o fluxo oficial de plugins deste
repositório, com uma tag como `catvinci.cloud-sync-v0.3.0`.

Desenvolvido originalmente por Ciao1019; as melhorias de interface e de configuração da 0.3.0
foram contribuídas por ChengAo Shen. Os avisos MIT estão preservados em `LICENSE`
e `THIRD_PARTY_NOTICES.md`. O design do armazenamento se inspirou em `apps/api/internal/cloudsync/`
do Petrichor/Sylva; nenhum código Go nem formato de backup PostgreSQL foi copiado.

## Alterações

- **0.8.0** - Safer when a sync is cut short: a lock this device left (Textus closed or stopped mid-sync) is taken back by its next sync without asking; another device's lock still needs **Recover stale lock**. A sync that would delete many files from the cloud stops and asks first, and a folder where suddenly nothing is found is taken as unreadable, not emptied. A file the system Trash refuses no longer stops the whole sync: it stays in place and is tried again. The first sync after a restart reads only the files changed meanwhile, not the whole folder. Its page is in every language Textus speaks. Its page receives Textus's messages by the API's current name. Its pickers keep Textus's own height.
- **0.7.0** - Faster syncs with fewer requests: with nothing changed, a sync asks the service once instead of 8 to 16 times; a changed file's blocks are sent in one request each, without checking first or reading them back; on WebDAV folders are made only when one is missing. A busy service is waited for (up to a minute, shown in the status) instead of stopping the sync, and requests that got no answer are sent again. The progress counts files that are done. From Textus 1.4.4 the versions it keeps of a document show in Version History too.
- **0.6.1** - A big first sync that stops halfway (cancelled, offline, or slowed by the service) goes on where it stopped next time, instead of checking every file it already sent; on Nutstore that saves most of the requests.
- **0.6.0** - Sync settings rearranged: sync options sit at the top and apply as you pick them, with no Save button. **Sync interval**, **Sync delay**, and **Keep cloud history** are pickers. Files now go up and down several at a time: **Transfers at once** sets how many (S3 8, WebDAV 4, Nutstore 2 to start), and blocks the cloud already holds are no longer checked again. A connected service shows as a card with the account masked and **Test connection**, **Edit** and **Disconnect**; the encryption switch and password are part of the connection. **Test connection** works before saving, and names the missing permission (write, read or delete) when a check fails.
- **0.5.3** - One set of rules for every service: the automatic interval can be 1 to 1,440 minutes, and **After a save, wait** sets how long a sync waits after saving (Nutstore starts at 3 minutes, S3 and WebDAV at 0; WebDAV no longer waits 30 s).
- **0.5.2** - The plugin no longer caps its own requests: a first Nutstore sync of a folder with many files no longer stops at "The service request limit was reached".
- **0.5.1** - A sync interrupted after it wrote the history but before the new state no longer leaves versions in the history that were never synced. Trash and old versions age by the storage server's clock, so a device whose clock is wrong no longer drops what the others keep.
- **0.5.0** - Older versions stay in the cloud: right-click a file › **Cloud History…** to read and restore one, and **Plugins › Cloud History…** brings back deleted files. **Keep cloud history** sets 30, 90 or 365 days, or always, and old versions are cleaned up by themselves. End-to-end encryption is now a switch, off for new connections; connections set up before keep it. Also brings 0.4.7's changes. Needs Textus 1.4.1.
- **0.4.7** - A sync reads again only the files whose size or time changed since the last one, so syncing a big folder while you write takes far less work. Your own rules can leave out more files (written as in a `.gitignore`), the folder's `.gitignore` can count too, and Obsidian's shared settings can sync. A picture or other attachment changed on another device now replaces the one here instead of being kept twice. Needs Textus 1.4.1.
- **0.4.6** - Every language now has the whole page translated, not just a few lines. In a narrow panel the status and the connection hint keep a readable width and the buttons move to their own line.
- **0.4.5** - The sidebar keeps to the sync status and **Sync now**; **Connection settings…** there opens the plugin's own page, where the connection is set up. The sidebar page draws no title of its own, as the sidebar's other tabs. Needs Textus 1.3.13. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.4** - A Cloud Sync tab in the sidebar shows at a glance how sync stands - connected or not, the last sync, any error, which service and remote folder - with the whole connection form below; Settings shows the same page. The service is picked from a dropdown, and a long name, path or error wraps inside the page.
- **0.4.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.1** - Obsidian bases (`.base`) and canvases (`.canvas`) sync too.
- **0.4.0** - Deletions and renames reach your other devices (deleted files go to the system Trash there); automatic sync runs a few seconds after you save; the status bar shows how sync stands; syncs are paced to stay within WebDAV and Nutstore request limits.
- **0.3.1** - Nutstore: a remote folder that already exists no longer stops the sync.
- **0.3.0** - First official version: end-to-end encrypted sync through S3, WebDAV or Nutstore, with conflict copies when both sides changed a file.
