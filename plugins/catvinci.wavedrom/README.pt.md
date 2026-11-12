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

- **0.3.2** - Os diagramas usam a fonte e a cor de linha do tema, acompanham o zoom do documento, e `height=` agora muda o tamanho do próprio diagrama.
- **0.3.1** - Sua página agora diz em uma frase o que ele faz, o que pode fazer e o que mudou em cada versão.
- **0.3.0** - uma ferramenta para o Textus AI, `check_wavedrom`
- **0.2.0** - redesenhado quando o tema muda, com a página de gráficos do Textus 1.3.2
- **0.1.3** - texto nas cores do tema no Textus 1.3
- **0.1.2** - as exportações trazem o diagrama nas cores da exportação
- **0.1.0-0.1.1** - primeiras versões: WaveJSON desenhado com o WaveDrom, aparência escura, altura ajustável, imagens na exportação

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_wavedrom`: Verifica o código de um bloco ```wavedrom - WaveJSON: faixas de sinal com suas strings wave e data, ou os campos de um registro - antes de entrar num documento, sem desenhá-lo. Retorna ok, ou os problemas a corrigir primeiro. Passe o código sem a cerca.
<!-- /ai-tools -->
