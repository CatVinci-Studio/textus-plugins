# Text Tidy

Tidies text in one step. Every command works on the selection, or on the whole document when nothing is selected, as one undo step. Find them in the Plugins menu or the command palette.

With nothing selected, it asks before tidying the whole document.

- **Remove Blank Lines**: empty paragraphs go; in a selection, every blank line goes.
- **Remove Trailing Spaces**: the spaces and tabs at the ends of lines; a line break's two spaces stay.
- **Chinese Punctuation in Chinese Text**: 你好,世界? becomes 你好，世界？. Decimals like 1.3.8 and English sentences are left alone.
- **English Punctuation in English Text**: Hello，world！ becomes Hello, world!; marks next to Chinese stay.
- **Full-Width Letters and Digits to ASCII**: ＡＢＣ１２３ becomes ABC123.
- **Join Selected Lines** (also on right-click): the selected lines become one, with no space between Chinese and one between words.

Code, formulas, links, #tags, reminders (@…), %% comments, HTML and front matter are left as they are. Brackets change in pairs: 价格(USD) becomes 价格（USD）.
