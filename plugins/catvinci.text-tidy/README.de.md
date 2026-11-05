# Text aufräumen

Räumt Text in einem Schritt auf. Jeder Befehl wirkt auf die Auswahl, ohne Auswahl auf das ganze Dokument, und lässt sich in einem Schritt rückgängig machen. Zu finden im Menü „Plugins“ und in der Befehlspalette.

Ohne Auswahl fragt es, bevor es das ganze Dokument aufräumt.

- **Leerzeilen entfernen**: leere Absätze verschwinden; in einer Auswahl alle Leerzeilen.
- **Leerzeichen am Zeilenende entfernen**: Leerzeichen und Tabs am Zeilenende; die zwei Leerzeichen eines Zeilenumbruchs bleiben.
- **Chinesische Satzzeichen in chinesischem Text**: 你好,世界? wird zu 你好，世界？. Zahlen wie 1.3.8 und englische Sätze bleiben.
- **Englische Satzzeichen in englischem Text**: Hello，world！ wird zu Hello, world!; Zeichen neben Chinesisch bleiben.
- **Vollbreite Buchstaben und Ziffern in ASCII**: ＡＢＣ１２３ wird zu ABC123.
- **Ausgewählte Zeilen zusammenfügen** (auch per Rechtsklick): die ausgewählten Zeilen werden eine, ohne Leerzeichen zwischen Chinesisch und mit einem zwischen Wörtern.

Code, Formeln, Linkadressen, HTML und Front Matter bleiben, wie sie sind.
