# LaTeX Completion

Suggests LaTeX commands while you type a formula.

- In a formula - between `$ … $` or in a math block - type a backslash and the start of a command, such as `\fr` or `\alp`. A lone backslash lists the common ones.
- The list shows the matching commands, each with what it draws: over 200 of them, from `\frac` to `\begin{pmatrix}`. Commands that begin with what you typed come first, then ones that contain it, ignoring case.
- Letters in order find a command too: `\rarr` is `\rightarrow`, `\lra` is `\leftrightarrow`.
- **Enter** or **Tab** writes the one picked, with the caret inside its braces; **Esc** closes the list. `\left(`, `\left[` and `\left\{` come with their `\right` partner.

It works on desktop and iPhone and needs Textus 1.3.0 or later. It asks for one permission, to read the editor, so it can see what you type in the formula.

## Changes

- **0.1.5** - The store description now opens with what the plugin does.
- **0.1.4** - A command typed out whole comes first, so Enter keeps it (\in stays \in); a command without braces is written with a space after it; with Textus 1.3.13 the list closes once a command is written.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Says where it runs: desktop and iPhone.
- **0.1.0-0.1.1** - First versions: over 200 commands with what each draws, letters in order, braces and caret in place, growing bracket pairs; store page and icon.
