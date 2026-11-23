# Emacs

Damit bewegen Sie sich im Editor mit Emacs-Tasten, setzen die Marke, schneiden aus (kill) und fügen ein (yank).

Die Tasten wirken, sobald das Plugin installiert ist. **Plugins › Emacs-Tasten ein- oder ausschalten** schaltet sie, ebenso ein Klick auf **Emacs** in der Statusleiste. Dort steht auch **Marke**, solange die Marke gesetzt ist, und **C-x-**, solange C-x auf die zweite Taste wartet. Nur die Tasten unten werden übernommen; das Tippen bleibt Sache des Editors. In einem Markdown-Dokument ist eine „Zeile“ ein Absatz, eine Überschrift, ein Listenpunkt oder eine Zeile eines Codeblocks.

- **Bewegen**: **C-f C-b C-n C-p**, **C-a C-e**, **M-f M-b**, **M-< M->**, **M-{ M-}** absatzweise, **C-v M-v** um zwanzig Zeilen.
- **Marke und Region**: **C-SPC** setzt die Marke, danach erweitern Bewegungen (auch die Pfeiltasten) die Region; **C-g** hebt sie auf; **C-x h** markiert das ganze Dokument.
- **Kill-Ring**: **C-k** schneidet bis zum Zeilenende aus (am Zeilenende verbindet es mit der nächsten Zeile), **C-w** schneidet die Region aus, **M-w** kopiert sie, **M-d** und **M-DEL** schneiden ein Wort vorwärts oder rückwärts aus. Mehrere Kills hintereinander werden zu einem. **C-y** fügt den neuesten ein, **M-y** direkt danach tauscht ihn gegen ältere. **C-d** löscht ein Zeichen, ohne den Kill-Ring zu berühren.
- **Groß und klein**: **M-u**, **M-l** und **M-c** schreiben das nächste Wort groß, klein oder mit großem Anfangsbuchstaben.
- **Rückgängig und Speichern**: **C-/**, **C-_** oder **C-x u** machen rückgängig; **C-x C-s** speichert.

Auf dem Mac liegen die Kürzel von Textus auf ⌘, daher gehören alle Ctrl-Tasten Emacs. Unter Windows und Linux gehören Strg-Tasten Textus und dem System (Kopieren, Einfügen, Ausschneiden, Alles auswählen, Fett, Suchen); deshalb gehören nur die M-Tasten, C-SPC und C-g Emacs, bis Sie **Auch die Strg-Tasten der App übernehmen** in den Einstellungen des Plugins einschalten.

Auf einem Tablet funktioniert es mit angeschlossener Tastatur. Es fragt nach einer einzigen Berechtigung, Editortasten, um diese Tasten im Editor zu übernehmen.

## Änderungen

- **0.1.7** - Its page says that on a tablet it needs a keyboard, instead of which devices it runs on. It hears keys by the API's current name, and the old one on an older Textus.
- **0.1.6** - C-x C-s and C-x C-g work again on Windows and Linux. The status bar shows Emacs only while it really has the keys.
- **0.1.5** - Shorter help and empty-state text.
- **0.1.4** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.3** - Says where it runs: desktop and iPhone.
- **0.1.2** - C-x no longer sticks; C-d and C-y leave the clipboard and the region alone.
- **0.1.0-0.1.1** - First versions: moves, the mark and region, a kill ring with C-y and M-y, M-u M-l M-c, undo and C-x keys; store page and icon.
