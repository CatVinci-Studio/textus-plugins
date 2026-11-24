# Marp

Präsentiert ein Dokument als Folien, geschrieben nach Art von [Marp](https://marp.app).

## Folien schreiben

- Bei jedem `---` beginnt eine neue Folie.
- **Plugins › Als Folien präsentieren** zeigt den Foliensatz in einem Tab neben dem Dokument, der Ihrem Schreiben folgt. ← → (oder ↑ ↓, Bild auf und Bild ab) und die Leertaste wechseln zwischen den Folien; **Vollbild** (oder F) startet die Präsentation. Beim Präsentieren geht ein Tippen oder Klicken auf das linke Drittel der Folie zurück und überall sonst weiter, ebenso ein Wischen; berühren Sie die Folie oder bewegen Sie den Zeiger für **Beenden**, oder drücken Sie Esc.
- Die Direktiven von Marp wählen Theme und Layout, zum Beispiel ganz oben:

```markdown
---
theme: gaia
paginate: true
---
```

- Bilder erscheinen im Foliensatz, auch Obsidians `![[photo.png]]`; `![[photo.png|300]]` legt die Breite fest (`300x200` beide Maße).

## Einen Foliensatz speichern

**Plugins › Folien als HTML exportieren** (oder **HTML speichern** im Foliensatz) speichert `name.slides.html` neben dem Dokument: eine Datei, die sich in jedem Browser selbst vorführt, mit denselben Tasten. Bilder werden aus dem Ordner des Dokuments verlinkt, lassen Sie die Datei also neben ihnen liegen. Das Dokument muss zuerst gespeichert sein.

Gebaut auf [Marp Core](https://github.com/marp-team/marp-core) (MIT), das seine Themes (default, gaia, uncover), Formeln und Code-Hervorhebung mitbringt – und dieses Plugin etwa 4 MB groß macht.

## Berechtigungen

- **Dokument lesen**: um seine Folien beim Schreiben zu zeichnen.
- **Dateien lesen und schreiben**: um die Bilder zu finden, die es zeigt, und den HTML-Foliensatz neben dem Dokument zu speichern.
- **Werkzeuge für Textus AI**: damit Textus AI den Foliensatz für Sie speichern kann.

## Änderungen

- **0.3.14** - Its icon is Marp's own logo.
- **0.3.13** - The deck no longer stays blank when no document is in front - in Source Mode or Source and Preview, or presented from the plugin's page: it shows the document open in another tab, as last saved, or says to click one. Slides scale to their frame on a Mac, iPhone and iPad, in the tab and in a saved deck opened in Safari.
- **0.3.12** - Presenting on a phone or tablet: tap or swipe to move between slides, and Exit to stop - no keyboard needed. A click moves on in full screen too, as in a saved deck. In a narrow tab, Save HTML goes into the ⋯ menu instead of pushing Full Screen onto a second row. Its page is in every language Textus speaks.
- **0.3.11** - Its package lists the libraries it carries, with their licenses.
- **0.3.10** - Code kept for Textus versions it no longer runs on is gone. From Textus 1.4.4 the deck is also in File › Export, as Slides (HTML).
- **0.3.9** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.3.8** - Present as Slides draws the deck on a phone, where its tab comes to the front alone.
- **0.3.7** - Formulas use KaTeX's own fonts from Textus 1.4.2 on, in the tab and in a saved HTML file; earlier versions keep the system's fonts.
- **0.3.6** - A deck needs nothing from the web: emoji show as text instead of pictures from a CDN, formulas use the system's fonts, and the Gaia theme no longer loads a web font, in the tab and in a saved HTML file.
- **0.3.5** - Writing a deck with many pictures is lighter: the slides are made again only when the text changed, and pictures it no longer shows are let go.
- **0.3.4** - Full Screen works in the tab (presenting in place where the window can't go full screen); the deck renders only while its tab is open; shortcuts leave Cmd/Ctrl/Alt keys alone.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - pictures in the deck, including Obsidian's `![[picture]]` embeds with a width
- **0.3.0** - a tool for Textus AI, `export_slides`
- **0.2.0** - named Marp in every language; Textus's own buttons and colors; labels follow the interface language
- **0.1.0-0.1.1** - first versions: a live deck beside the document, full screen, and a self-presenting HTML file

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `export_slides`: Speichert das vordere Dokument als Marp-Foliensatz - eine Folie je ---Zeile - in einer HTML-Datei daneben (name.slides.html), die sich in jedem Browser selbst vorführt. Gibt ihren Pfad und die Folienzahl zurück.
<!-- /ai-tools -->
