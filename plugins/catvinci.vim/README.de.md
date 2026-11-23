# Vim

Nutzen Sie Vims Modi und Tasten im Editor von Textus.

- **Plugins › Vim-Tasten ein- oder ausschalten** schaltet sie um. Solange sie an sind, zeigt die Statusleiste den Modus (NORMAL, INSERT, VISUAL, V-LINE); sein Menü schaltet Vim aus.
- Normal-, Einfüge-, Visuell- und zeilenweiser Visuell-Modus, mit Bewegungen (**h j k l**, **w b e**, **0 ^ $**, **gg G**, **f t F T** mit **;** und **,**, **Strg+D** und **Strg+U**), Operatoren (**d c y**, **dd**, **x**, **p P**, **r** und **iw**/**aw**), Zählern, einem Register, **u** und **Strg+R** für Rückgängig und Wiederholen und **.** zum Wiederholen der letzten Änderung.
- Eine Zeile ist ein Absatz, eine Überschrift, ein Listeneintrag oder eine Zeile eines Codeblocks: **j** und **k** gehen durch alle, **}** und **{** Block für Block. **zz**, **zt** und **zb** holen die Zeile mit dem Cursor in die Mitte, nach oben oder nach unten im Fenster.
- **~** wechselt die Groß- und Kleinschreibung unter dem Cursor; im Visuell-Modus kehren **~**, **U** und **u** die Auswahl um oder setzen sie in Groß- oder Kleinbuchstaben.
- **s** und ein Buchstabe, dann ein Label, springt überall auf dem Bildschirm hin (Flash); die nächsten Stellen bekommen die ersten Labels. **d**, **c** oder **y** vor **s** löscht, ändert oder kopiert bis dorthin.
- **:** öffnet die Befehlspalette mit Vims Befehlen zuerst: **:w** speichert, **:q** schließt den Tab, **:wq** tut beides, **:12** geht zu Zeile 12, **:u** und **:redo** machen rückgängig und wiederholen, und alle Befehle von Textus sind dort auch zu finden.
- Auf dem Mac tippt der Normal-Modus mit einer lateinischen Tastatur, damit eine Eingabemethode wie Pinyin die Tasten nicht abfängt; Ihre eigene kommt im Einfügemodus zurück.

Einstellungen unter **Einstellungen › Erweiterungen › Plugins › Vim**:

- **Mit s springen (Flash)**: standardmäßig an. Aus, macht **s** das, was es in Vim tut (ein Zeichen löschen und einfügen).
- **Einfügemodus verlassen mit**: zwei schnell getippte Buchstaben im Einfügemodus, die wie Escape wirken, etwa `jk`. Leer: nur Escape und **Strg+[**.
- **Tastenbelegungen**: Zeilen wie in einer vimrc (`map`, `noremap`, `nnoremap`, `inoremap`, `vnoremap` und `let mapleader`), etwa `inoremap jj <Esc>` oder `nnoremap <leader>w :w<CR>`.

Obsidian: In einem Obsidian-Vault wird auch dessen `.obsidian.vimrc` (die des Plugins Vimrc Support) gelesen, nach Ihren eigenen Zeilen, und neu gelesen, wenn sie sich ändert. Öffnen Sie den Vault selbst, keinen Ordner darin.

Das Plugin fragt nach der Berechtigung, Tasten im Editor anzunehmen (um Vims Tasten auszuführen), und Dateien zu lesen (nur um `.obsidian.vimrc` zu lesen).

## Änderungen

- **0.2.10** - Its page no longer says which devices it runs on: the store shows that.
- **0.2.9** - Needs Textus 1.3.0-beta.8 or later, the first with everything it uses.
- **0.2.8** - Desktop only: a phone's on-screen keyboard types its letters into the text instead of running them as Vim keys.
- **0.2.7** - The status bar's mode opens a menu that turns Vim off; `.obsidian.vimrc` is read again when you come back to Textus; leaving visual mode with **:** always works.
- **0.2.6** - Shorter help and empty-state text.
- **0.2.5** - Its code is split into smaller files by what each part does; nothing changes in use.
- **0.2.4** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.3** - Reads an Obsidian vault's `.obsidian.vimrc`; mapping the same keys again replaces the earlier mapping.
- **0.2.2** - **zz**, **zt** and **zb** bring the caret's line to the middle, top or bottom of the window.
- **0.2.1** - Says where it runs: the desktop, iPhone and iPad.
- **0.2.0** - **:** opens the command palette with Vim's commands first; flash shows its labels after one letter; normal mode types Roman on a Mac.
- **0.1.0-0.1.1** - First versions: modes, motions, operators, counts, dot repeat, flash with **ds**, **cs** and **ys**, the command line (**:w**, **:q**, **:wq**, **:12**), vimrc key mappings and the case keys.
