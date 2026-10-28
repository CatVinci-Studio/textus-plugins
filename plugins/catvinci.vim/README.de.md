# Vim

Die Modi und Tasten von Vim im Editor.

- **Plugins › Vim-Tasten ein- oder ausschalten** schaltet sie um.
- Normal-, Einfüge- und visueller Modus, mit Bewegungen, Operatoren, Zählern, Registern und **.** zum Wiederholen.
- Eine Zeile ist ein Absatz, eine Überschrift, ein Listeneintrag oder eine Zeile eines Codeblocks: **j** und **k** gehen durch alle, **}** und **{** Block für Block.
- **~** wechselt die Groß-/Kleinschreibung unter der Einfügemarke; im visuellen Modus wechseln **~**, **U** und **u** die Schreibung der Auswahl, machen sie groß oder klein.
- **s** und zwei Buchstaben, dann ein Label, springt an eine beliebige Stelle auf dem Bildschirm (Flash); die nächsten Stellen bekommen die ersten Labels. **d**, **c** oder **y** vor **s** löscht, ändert oder kopiert bis dorthin.
- **:** öffnet die Befehlszeile: **:w** speichert, **:q** schließt den Tab, **:wq** beides, **:12** geht zu Zeile 12.
- **Tastenbelegungen** in den Einstellungen des Plugins nimmt Zeilen wie in einer vimrc, etwa `inoremap jj <Esc>` oder `nnoremap <leader>w :w<CR>`. Dort lässt sich auch Flash ausschalten.
