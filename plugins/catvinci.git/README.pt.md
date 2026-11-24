# Git

Para uma pasta guardada no Git:

- Os arquivos alterados desde o último commit ficam marcados na barra lateral: **M** alterado, **A** adicionado, **U** novo e ainda fora do Git, **R** renomeado, **!** em conflito.
- Num documento alterado, cada parágrafo, título ou lista com linhas que o último commit não tinha (como salvo) ganha uma marca na margem direita; clicar nela faz o commit (Textus 1.4.4).
- A barra de status mostra o branch, com ↑ os commits a enviar e ↓ os que há para puxar; clicar nele faz o commit.
- **Fazer commit das alterações…** (no menu Plugins, ou no branch) lista os arquivos alterados, com o que está em primeiro plano já marcado; você escreve a mensagem, e o seu próprio Git faz o commit só desses arquivos - os hooks e a assinatura funcionam como sempre. O primeiro commit numa pasta pergunta antes.
- **Enviar (push)** e **Puxar (pull)** (menu Plugins) enviam o branch para o branch remoto dele e trazem os commits do remoto, com o seu próprio Git e as credenciais que ele já guardou - entre uma vez com o Git num terminal se ele pedir. Um branch que ainda não tem branch remoto é enviado para `origin`. Um pull que causaria conflito é desfeito, nada muda, e você é avisado (Textus 1.4.6).
- Com o Histórico de versões 0.4, os commits de um documento aparecem entre as versões dele, comparados e restaurados do mesmo jeito.
- O Textus AI pode ler as alterações, os commits de um arquivo e um arquivo como um commit o tinha - por exemplo, para rascunhar a sua mensagem de commit.

Nada troca de branch. Precisa do Git instalado (no Mac, as Command Line Tools) e do Textus 1.4.6.

## Alterações

- **0.3.2** - Its icon is Git's own logo.
- **0.3.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.", and its tools for Textus AI are described in every language.
- **0.3.0** - Push and Pull, and what waits to be pushed or pulled beside the branch (Textus 1.4.6).
- **0.2.0** - Blocks changed since the last commit are marked in the margin (Textus 1.4.4).
- **0.1.1** - The first-commit confirmation's button reads "Commit".
- **0.1.0** - First version.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `git_changes`: O branch da pasta aberta e os arquivos alterados, com as linhas de cada arquivo de texto alterado em relação ao último commit. Leia antes de escrever uma mensagem de commit.
- `git_history`: Os commits Git de um arquivo, do mais recente ao mais antigo, passando por renomeações: hash, data, autor, assunto.
- `git_file_at`: O texto de um arquivo como um dos seus commits o tinha (hash vindo de git_history).
<!-- /ai-tools -->
