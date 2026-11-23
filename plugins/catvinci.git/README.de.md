# Git

Für einen Ordner, der in Git liegt:

- Dateien, die sich seit dem letzten Commit geändert haben, sind in der Seitenleiste markiert: **M** geändert, **A** hinzugefügt, **U** neu und noch nicht in Git, **R** umbenannt, **!** im Konflikt.
- In einem geänderten Dokument hat jeder Absatz, jede Überschrift und jede Liste mit Zeilen, die der letzte Commit nicht hatte (wie gespeichert), eine Markierung am rechten Rand; ein Klick darauf committet (Textus 1.4.4).
- Die Statusleiste zeigt den Branch, mit ↑ den Commits zum Pushen und ↓ denen zum Pullen; ein Klick darauf committet.
- **Änderungen committen…** (Plugins-Menü oder der Branch) listet die geänderten Dateien, die vordere ausgewählt; Sie schreiben die Nachricht, und Ihr eigenes Git committet nur diese Dateien – seine Hooks und Signierung laufen wie gewohnt. Der erste Commit in einem Ordner fragt vorher nach.
- **Pushen** und **Pullen** (Plugins-Menü) schicken den Branch an seinen Remote-Branch und holen die Commits des Remotes, mit Ihrem eigenen Git und den Zugangsdaten, die es gespeichert hat – melden Sie sich einmal im Terminal bei Git an, wenn es danach fragt. Ein Branch ohne Remote-Branch wird nach `origin` gepusht. Ein Pull, der einen Konflikt ergäbe, wird zurückgenommen, nichts ist geändert, und Sie erfahren es (Textus 1.4.6).
- Mit Versionsverlauf 0.4 erscheinen die Commits eines Dokuments unter seinen Versionen und lassen sich ebenso vergleichen und wiederherstellen.
- Textus AI kann die Änderungen lesen, die Commits einer Datei und eine Datei so, wie ein Commit sie hatte – etwa um Ihre Commit-Nachricht zu entwerfen.

Nichts wechselt den Branch. Braucht ein installiertes Git (auf dem Mac die Command Line Tools) und Textus 1.4.6.

## Änderungen

- **0.3.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.", and its tools for Textus AI are described in every language.
- **0.3.0** - Push and Pull, and what waits to be pushed or pulled beside the branch (Textus 1.4.6).
- **0.2.0** - Blocks changed since the last commit are marked in the margin (Textus 1.4.4).
- **0.1.1** - The first-commit confirmation's button reads "Commit".
- **0.1.0** - First version.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `git_changes`: Der Branch des geöffneten Ordners und die geänderten Dateien, bei jeder geänderten Textdatei die Zeilen gegenüber ihrem letzten Commit. Vor dem Schreiben einer Commit-Nachricht lesen.
- `git_history`: Die Git-Commits einer Datei, neueste zuerst, auch über Umbenennungen hinweg: Hash, Datum, Autor, Betreff.
- `git_file_at`: Der Text einer Datei, wie einer ihrer Commits ihn hatte (Hash aus git_history).
<!-- /ai-tools -->
