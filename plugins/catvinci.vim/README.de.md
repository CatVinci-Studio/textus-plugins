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

Das Plugin fragt nach der Berechtigung, Tasten im Editor anzunehmen (um Vims Tasten auszuführen), und Dateien zu lesen (nur um `.obsidian.vimrc` zu lesen). Es läuft auf dem Desktop sowie auf iPhone und iPad.

## Änderungen

- **0.2.7** - Der Modus in der Statusleiste öffnet ein Menü, das Vim ausschaltet; `.obsidian.vimrc` wird neu gelesen, wenn Sie zu Textus zurückkehren; **:** verlässt den visuellen Modus immer.
- **0.2.6** - Kürzere Hilfe- und Leertexte.
- **0.2.5** - Sein Code ist nach Aufgaben in kleinere Dateien aufgeteilt; in der Nutzung ändert sich nichts.
- **0.2.4** - Seine Seite sagt jetzt in einem Satz, was es tut, was es kann und was sich in jeder Version geändert hat.
- **0.2.3** - Liest die `.obsidian.vimrc` eines Obsidian-Vaults; dieselben Tasten noch einmal zu belegen ersetzt die frühere Belegung.
- **0.2.2** - **zz**, **zt** und **zb** holen die Zeile mit dem Cursor in die Mitte, nach oben oder nach unten im Fenster.
- **0.2.1** - Nennt, wo es läuft: Desktop, iPhone und iPad.
- **0.2.0** - **:** öffnet die Befehlspalette mit Vims Befehlen zuerst; Flash zeigt seine Labels nach einem Buchstaben; der Normal-Modus tippt auf dem Mac lateinisch.
- **0.1.0-0.1.1** - Erste Versionen: Modi, Bewegungen, Operatoren, Zähler, Punkt-Wiederholung, Flash mit **ds**, **cs** und **ys**, die Befehlszeile (**:w**, **:q**, **:wq**, **:12**), Tastenbelegungen wie in einer vimrc und die Tasten für Groß- und Kleinschreibung.
