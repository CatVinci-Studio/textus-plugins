# WaveDrom

Desenha diagramas de tempo digitais e campos de registradores a partir de WaveJSON.

## Desenhar um diagrama

- Escreva um bloco de código em `wavedrom` com WaveJSON. O diagrama é desenhado abaixo, e o código volta a aparecer ao clicar no bloco.
- `signal` traz os sinais: cada um com `name`, uma string `wave` (`p n h l 0 1 x z . |` e `= 2-9` para valores) e `data` com os rótulos dos valores. Uma lista que começa com um rótulo agrupa sinais; `{}` deixa um espaço.
- `reg` desenha os campos de um registrador: `{ reg: [{ bits: 8, name: "data" }] }`.
- JSON escrito à mão funciona: chaves sem aspas, aspas simples, vírgulas no fim e comentários `//`.
- Um erro no código é indicado abaixo do bloco.
- `height=400` depois da linguagem define a altura do desenho.
- Em um tema escuro, usa a aparência escura do WaveDrom. Ao exportar para HTML, PDF ou Word, o diagrama vai como imagem, desenhado nas cores da exportação.

## Exemplo

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```

## Permissões

Pede apenas **Ferramentas para o Textus AI**, para que o Textus AI possa verificar um bloco antes de escrevê-lo. O WaveDrom vem com o plugin: não lê arquivos e desenha tudo no seu aparelho, no computador e no iOS.

## Alterações

- **0.3.6** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.5** - Its package lists the libraries it carries, with their licenses.
- **0.3.4** - A very long diagram shrinks only as far as its labels stay readable, then scrolls sideways (a phone).
- **0.3.3** - Readable in dark mode: the lines and text take the theme's colours on the page's own background; a diagram drawn while its block was folded fits once it opens. A long diagram shrinks to the column instead of being cut off.
- **0.3.2** - Diagrams take the theme's font and line colour, grow with the document's zoom, and `height=` now resizes the diagram itself.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_wavedrom`
- **0.2.0** - drawn again when the theme changes, with the chart page of Textus 1.3.2
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - exports carry the diagram in the export's colors
- **0.1.0-0.1.1** - first versions: WaveJSON drawn with WaveDrom, dark skin, a height setting, pictures in exports

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_wavedrom`: Verifica o código de um bloco ```wavedrom - WaveJSON: faixas de sinal com suas strings wave e data, ou os campos de um registro - antes de entrar num documento, sem desenhá-lo. Retorna ok, ou os problemas a corrigir primeiro. Passe o código sem a cerca.
<!-- /ai-tools -->
