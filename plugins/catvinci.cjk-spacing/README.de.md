# CJK-Abstände

Setzt ein Leerzeichen zwischen chinesischen oder japanischen Text und lateinische Buchstaben oder Ziffern.

## Ein Dokument anpassen

- Wähle **Plugins › Leerzeichen zwischen CJK und Latein einfügen** oder denselben Eintrag im Kontextmenü. Aus 用Textus写作 wird 用 Textus 写作. Das ganze Dokument ändert sich in einem Schritt, der sich rückgängig machen lässt, und ein Hinweis nennt die Zahl der geänderten Blöcke.
- Schalte in den Einstellungen des Plugins **Auch beim Speichern** ein, damit jedes Dokument beim Speichern angepasst wird. Es ändern sich nur Absätze, Überschriften, Listen und anderer Fließtext.
- Koreanisch bleibt unberührt: Es trennt seine Wörter selbst durch Leerzeichen.

## Was bleibt, wie es ist

- Code, Formeln, Links und Wiki-Links, Fußnoten, #Tags, Erinnerungen (@…), %%-Kommentare, HTML und Front Matter – auch beim Speichern.
- Was Obsidian schreibt: Block-IDs (^1a2b3c), Dataview-Felder (key:: value), ==Hervorhebungen== und die Felder von Obsidian Tasks (📅 2026-11-07).

## Berechtigungen

- **Dokument lesen und bearbeiten**: um das geöffnete Dokument anzupassen.
- **Dateien schreiben**: um ein Dokument beim Speichern anzupassen, wenn **Auch beim Speichern** an ist.
- **Werkzeuge für Textus AI**: damit Textus AI einen Text für dich anpassen kann.

## Änderungen

- **0.2.3** - Das Werkzeug für Textus AI sagt, was es tut: Chinesisch und Japanisch, nicht Koreanisch.
- **0.2.2** - lässt Obsidians Block-IDs, Dataview-Felder, Hervorhebungen und Tasks-Felder, wie sie sind
- **0.2.1** - lässt #Tags, Erinnerungen und %%-Kommentare, wie sie sind; beim Speichern ändern sich nur Textblöcke
- **0.2.0** - ein Werkzeug für Textus AI, `fix_cjk_spacing`
- **0.1.3** - läuft auf dem Desktop und unter iOS
- **0.1.2** - lässt Links, Wiki-Links, Fußnoten, Tags und Front Matter, wie sie sind
- **0.1.0-0.1.1** - erste Versionen: der Befehl im Kontextmenü und im Plugins-Menü, und das Anpassen beim Speichern

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `fix_cjk_spacing`: Setzt in Markdown ein Leerzeichen zwischen chinesische oder japanische Zeichen und lateinische Buchstaben oder Ziffern, Code und Links ausgenommen, wie der Befehl des Plugins. Gibt den Text zurück; schreibt nichts.
<!-- /ai-tools -->
