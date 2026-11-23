# MDX

Para documentos MDX - o Markdown com componentes que o Docusaurus, o Nextra
e outras ferramentas de sites usam. O Textus abre arquivos `.mdx` sozinho e
mantém os imports, as `{expressões}` e os componentes exatamente como foram
escritos; este plugin acrescenta:

- **Problemas sublinhados.** O próprio compilador do MDX verifica o documento
  enquanto você escreve, e o primeiro problema que encontra fica sublinhado
  onde está, com a linha e o que está errado.
- **Pré-visualizar MDX.** O documento desenhado ao lado: abas, destaques
  (`<Callout>`, `<Admonition>`, `:::tip`) e `<details>` com a aparência do
  Textus, e qualquer outro componente como um cartão com o nome e os atributos.
  Nada do código do documento é executado.
- **Guardar como Markdown / Guardar como MDX.** Uma cópia ao lado do documento:
  os destaques viram alertas do GitHub, as abas viram partes com título, e um
  componente sem nada dentro fica como comentário; no sentido inverso, as chaves
  e o `<` são escapados, e os comentários e o `<br>` são escritos como o MDX quer.

Encontre isso no menu Plugins, ou clique com o botão direito num documento `.mdx`.

## Permissões

- **Ler o documento**: para verificá-lo e desenhá-lo enquanto você escreve.
- **Ler e gravar arquivos**: para verificar um arquivo .mdx que o Textus AI indicar, e para salvar a cópia convertida ao lado do documento.
- **Ferramentas para o Textus AI**: para que o Textus AI possa verificar o MDX que escreve.

## Alterações

- **0.1.3** - Its page is in every language Textus speaks. Its page receives Textus's messages by the API's current name.
- **0.1.2** - Its package lists the libraries it carries, with their licenses.
- **0.1.1** - Preview MDX on a phone, where the preview shows alone, draws the document it was opened from instead of an empty page.
- **0.1.0** - First version: problems underlined by MDX's compiler, Preview MDX, Save as Markdown and Save as MDX, and check_mdx for Textus AI.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_mdx`: Verifica MDX com o compilador oficial do MDX e dá o primeiro problema com a sua linha e coluna. Use-a depois de escrever ou alterar um documento .mdx, antes de dizer que funciona.
<!-- /ai-tools -->
