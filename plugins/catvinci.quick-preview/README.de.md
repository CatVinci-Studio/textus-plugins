# Schnellvorschau

Lesen Sie, wohin ein Link führt, ohne ihn zu öffnen: Ruht der Zeiger auf einem Link zu einem anderen Dokument, zeigt eine Karte dessen Text.

- Lassen Sie den Zeiger auf einem Link zu einem anderen Dokument ruhen, einem Markdown-Link oder einem [[Wiki-Link]].
- Eine Karte daneben zeigt den Anfang des Dokuments, ohne seine Eigenschaften. Bei einem Link auf eine Überschrift (`#Überschrift`) zeigt sie diesen Abschnitt, bei einem Link auf einen Block (`#^id`) diesen Block.
- Die Karte zeigt bis zu etwa 1.500 Zeichen, am Ende eines Absatzes abgeschnitten. **Öffnen** geht zum Dokument; **Anheften** hält die Karte offen, während Sie schreiben.
- Nur Dokumente im geöffneten Ordner werden angezeigt.

Das Plugin fragt nach Lesezugriff auf den Editor (um zu sehen, auf welchen Link Sie zeigen) und auf Dateien (um das verlinkte Dokument zu zeigen). Es ändert nie eine Datei. Es läuft auf dem Desktop sowie auf iPhone und iPad.

## Änderungen

- **0.2.2** - Ein Link auf eine verschachtelte Überschrift (`[[Notiz#A#B]]`) zeigt deren Abschnitt, denselben, den ein Klick öffnet. Benötigt Textus 1.4.0.
- **0.2.1** - Seine Seite sagt jetzt in einem Satz, was es tut, was es kann und was sich in jeder Version geändert hat.
- **0.2.0** - Ein Link auf einen Block (`#^id`) zeigt diesen Block. Benötigt Textus 1.3.9.
- **0.1.3** - Nennt, wo es läuft: Desktop, iPhone und iPad.
- **0.1.2** - Die Länge der Karte ist fest statt einer Einstellung.
- **0.1.0-0.1.1** - Erste Versionen: eine Karte für Links zu Dokumenten, mit dem Anfang des Dokuments oder dem Abschnitt, den der Link nennt, dazu Öffnen und Anheften.
