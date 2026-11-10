# Aufräumen

Unterstreicht Markdown, das gegen gängige Regeln verstößt, korrigiert es und räumt Leerzeilen, Leerzeichen, Satzzeichen und Zeilenumbrüche auf.

Es arbeitet wie der Linter von Obsidian, und jede Änderung lässt sich in einem Schritt rückgängig machen.

## Markdown

- Was gegen eine gängige Markdown-Regel verstößt, wird unterstrichen; lassen Sie den Zeiger darauf ruhen, um Regel und Grund zu sehen.
- **Markdown korrigieren** (Rechtsklick oder das Plugins-Menü) behebt, was sich beheben lässt.
- Jeder Block wird für sich geprüft, daher entfallen Regeln über das ganze Dokument (Überschriftenebenen, die erste Zeile, Leerzeilen zwischen Blöcken).

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

## Berechtigungen

- Dokument lesen und bearbeiten: um es zu prüfen und zu korrigieren.
- Werkzeuge für Textus AI: damit Textus AI Markdown mit denselben Regeln prüfen kann.

## Änderungen

- **0.3.2** - Kürzere Hilfe- und Leertexte.
- **0.3.1** - Seine Seite sagt jetzt in einem Satz, was es tut, was es kann und was sich in jeder Version geändert hat.
- **0.3.0** - Heißt jetzt Aufräumen (vorher Markdown-Prüfung): die sechs Textbefehle von „Text aufräumen“ sind hier; Einstellungen, um Unterstreichungen oder einzelne Regeln abzuschalten; Obsidians eigene Syntax bleibt, wie sie ist.
- **0.2.1** - Tags, Links, Erinnerungen und Referenzdefinitionen werden nie markiert: dieselbe Liste, die CJK-Abstände unverändert lässt.
- **0.2.0** - Textus AI kann Markdown prüfen (`lint_markdown`).
- **0.1.0-0.1.2** - Erste Versionen: Unterstreichungen, die die Regel erklären, und Markdown korrigieren; Store-Seite und Symbol; läuft auf dem Desktop und unter iOS.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `lint_markdown`: Prüft Markdown - übergeben oder das vordere Dokument - mit den Regeln von markdownlint, wie der Editor sie unterstreicht: Zeile, Regel, Beschreibung und Behebbarkeit jedes Problems; mit fix auch den korrigierten Text. Ändert selbst nichts.
<!-- /ai-tools -->
