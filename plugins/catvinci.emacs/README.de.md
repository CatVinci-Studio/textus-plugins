# Emacs

Damit bewegen Sie sich im Editor mit Emacs-Tasten, setzen die Marke, schneiden aus (kill) und fügen ein (yank).

Die Tasten wirken, sobald das Plugin installiert ist. **Plugins › Emacs-Tasten ein- oder ausschalten** schaltet sie, ebenso ein Klick auf **Emacs** in der Statusleiste. Dort steht auch **Marke**, solange die Marke gesetzt ist, und **C-x-**, solange C-x auf die zweite Taste wartet. Nur die Tasten unten werden übernommen; das Tippen bleibt Sache des Editors. In einem Markdown-Dokument ist eine „Zeile“ ein Absatz, eine Überschrift, ein Listenpunkt oder eine Zeile eines Codeblocks.

- **Bewegen**: **C-f C-b C-n C-p**, **C-a C-e**, **M-f M-b**, **M-< M->**, **M-{ M-}** absatzweise, **C-v M-v** um zwanzig Zeilen.
- **Marke und Region**: **C-SPC** setzt die Marke, danach erweitern Bewegungen (auch die Pfeiltasten) die Region; **C-g** hebt sie auf; **C-x h** markiert das ganze Dokument.
- **Kill-Ring**: **C-k** schneidet bis zum Zeilenende aus (am Zeilenende verbindet es mit der nächsten Zeile), **C-w** schneidet die Region aus, **M-w** kopiert sie, **M-d** und **M-DEL** schneiden ein Wort vorwärts oder rückwärts aus. Mehrere Kills hintereinander werden zu einem. **C-y** fügt den neuesten ein, **M-y** direkt danach tauscht ihn gegen ältere. **C-d** löscht ein Zeichen, ohne den Kill-Ring zu berühren.
- **Groß und klein**: **M-u**, **M-l** und **M-c** schreiben das nächste Wort groß, klein oder mit großem Anfangsbuchstaben.
- **Rückgängig und Speichern**: **C-/**, **C-_** oder **C-x u** machen rückgängig; **C-x C-s** speichert.

Auf dem Mac liegen die Kürzel von Textus auf ⌘, daher gehören alle Ctrl-Tasten Emacs. Unter Windows und Linux gehören Strg-Tasten Textus und dem System (Kopieren, Einfügen, Ausschneiden, Alles auswählen, Fett, Suchen); deshalb gehören nur die M-Tasten, C-SPC und C-g Emacs, bis Sie **Auch die Strg-Tasten der App übernehmen** in den Einstellungen des Plugins einschalten.

Läuft auf dem Desktop und auf dem iPhone. Es fragt nach einer einzigen Berechtigung, Editortasten, um diese Tasten im Editor zu übernehmen.

## Änderungen

- **0.1.6** - C-x C-s und C-x C-g funktionieren unter Windows und Linux wieder. Die Statusleiste zeigt Emacs nur, solange es die Tasten wirklich hat.
- **0.1.5** - Kürzere Hilfe- und Leertexte.
- **0.1.4** - Seine Seite sagt jetzt in einem Satz, was es tut, was es kann und was sich in jeder Version geändert hat.
- **0.1.3** - Nennt, wo es läuft: Desktop und iPhone.
- **0.1.2** - C-x bleibt nicht mehr hängen; C-d und C-y lassen Zwischenablage und Region in Ruhe.
- **0.1.0-0.1.1** - Erste Versionen: Bewegungen, Marke und Region, Kill-Ring mit C-y und M-y, M-u M-l M-c, Rückgängig und C-x-Tasten; Seite im Store und Symbol.
