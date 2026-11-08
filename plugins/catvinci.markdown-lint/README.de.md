# Aufräumen

Räumt Text und Markdown an einem Ort auf, wie der Linter von Obsidian. Jede Änderung lässt sich in einem Schritt rückgängig machen.

## Markdown

- Was gegen eine gängige Markdown-Regel verstößt, wird unterstrichen; lassen Sie den Zeiger darauf ruhen, um Regel und Grund zu sehen.
- **Markdown korrigieren** (Rechtsklick oder das Plugins-Menü) behebt, was sich beheben lässt.

## Text

Jeder Befehl wirkt auf die Auswahl oder, nach einer Rückfrage, auf das ganze Dokument. Zu finden im Menü „Plugins“ und in der Befehlspalette.

- **Leerzeilen entfernen**: leere Absätze verschwinden; in einer Auswahl alle Leerzeilen.
- **Leerzeichen am Zeilenende entfernen**: Leerzeichen und Tabs am Zeilenende; die zwei Leerzeichen eines Zeilenumbruchs bleiben.
- **Chinesische Satzzeichen in chinesischem Text**: 你好,世界? wird zu 你好，世界？. Zahlen wie 1.3.8 und englische Sätze bleiben.
- **Englische Satzzeichen in englischem Text**: Hello，world！ wird zu Hello, world!; Zeichen neben Chinesisch bleiben.
- **Vollbreite Buchstaben und Ziffern in ASCII**: ＡＢＣ１２３ wird zu ABC123.
- **Ausgewählte Zeilen zusammenfügen** (auch per Rechtsklick): die ausgewählten Zeilen werden eine, ohne Leerzeichen zwischen Chinesisch und mit einem zwischen Wörtern.

## Einstellungen

- **Markdown unterstreichen, das eine Regel verletzt**: ausgeschaltet wird nichts unterstrichen; Markdown korrigieren funktioniert weiter.
- **Ausgelassene Regeln**: Regeln von markdownlint, eine pro Zeile (MD009 oder no-trailing-spaces), weder unterstrichen noch korrigiert.

## Was bleibt, wie es ist

Code, Formeln, Front Matter, Links, #Tags, Erinnerungen (@…), %%-Kommentare, HTML und Referenzdefinitionen ([d]: url) werden nie markiert oder geändert – ebenso wenig, was Obsidian schreibt: Block-IDs (^1a2b3c), Dataview-Felder (key:: value, [key:: value]), ==Hervorhebungen== und die Felder von Obsidian Tasks (📅 2026-11-07, 🔁 every week, 🆔 abc123). Beim Zusammenfügen bleibt ein Feld auf einer eigenen Zeile. Klammern ändern sich paarweise: 价格(USD) wird 价格（USD）.

CJK-Abstände, das Plugin für Leerzeichen zwischen chinesischem und lateinischem Text, lässt all das ebenfalls unverändert.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `lint_markdown`: Prüft Markdown - übergeben oder das vordere Dokument - mit den Regeln von markdownlint, wie der Editor sie unterstreicht: Zeile, Regel, Beschreibung und Behebbarkeit jedes Problems; mit fix auch den korrigierten Text. Ändert selbst nichts.
<!-- /ai-tools -->
