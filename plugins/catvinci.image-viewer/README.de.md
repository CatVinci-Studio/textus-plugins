# Bildbetrachter

Öffnet Bilder und SVG-Dateien in einem Tab, wo du zoomen, sie drehen und den Quelltext eines SVG lesen kannst.

## Ein Bild ansehen

- Öffne eine PNG-, JPEG-, GIF-, WebP-, AVIF-, BMP-, ICO- oder SVG-Datei aus der Seitenleiste oder ziehe sie ins Fenster. Sie öffnet sich in einem eigenen Tab, eingepasst.
- Die Leiste zeigt die Bildgröße in Pixeln und die Dateigröße.
- Zoome mit den Schaltflächen **−** und **+** oder mit **Ctrl+Scrollen** (**⌘+Scrollen** auf dem Mac). Ein Klick auf die Prozentzahl wechselt zwischen eingepasst und Originalgröße.
- Vergrößert kannst du das Bild ziehen, um dich umzusehen. Ein Doppelklick wechselt zwischen eingepasst und Originalgröße an der geklickten Stelle.
- Die Schaltfläche **Drehen** dreht es jeweils um eine Vierteldrehung. Nur die Ansicht dreht sich, die Datei bleibt, wie sie ist.
- Tasten: **+** und **-** zoomen, **0** zeigt die Originalgröße, **F** passt ein, **R** dreht.
- Bei einem SVG zeigt **Quelltext** das Markup zum Lesen oder Kopieren, **Bild** führt zurück. Ein SVG wird als Bild gezeigt, seine Skripte laufen also nie.
- Fehlt die Datei oder ist sie kein Bild, steht das da, statt eines leeren Tabs.

## Berechtigungen

Keine. Es liest nur die Datei, die du öffnest.

## Änderungen

- **0.2.6** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.2.5** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.2.4** - A turned and zoomed picture now scrolls to every edge, and a sideways picture fits the window. Zoom and turn are kept when the panel moves, a fourth turn no longer spins back, and the bar fits a narrow panel.
- **0.2.3** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the picture, not the document behind it. Its bar keeps Textus's one order: what it shows, then find and zoom.
- **0.2.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - Textus's own buttons and tab bar; labels follow the interface language when it changes
- **0.1.3** - colors from Textus 1.3's themes
- **0.1.2** - the percentage switches between fit and actual size
- **0.1.0-0.1.1** - first versions: zoom, fit, drag, rotate, keys, an SVG's source, and a message for a file that can't be opened
