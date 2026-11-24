# Schreibstatistik

Zeigt Wortzahlen, Lesezeit und ein tägliches Schreibziel in der Seitenleiste.

Öffnen Sie den Tab **Schreibstatistik** in der Seitenleiste:

- **Dieses Dokument**: Wörter, Zeichen und Lesezeit.
- **Auswahl**: Wörter und Zeichen dessen, was Sie markiert haben.
- **Heute**: die Wörter, die Sie heute hinzugefügt haben, über alle Dokumente, gemessen an einem Tagesziel, und die Tage in Folge, an denen Sie es erreicht haben. Legen Sie das Ziel in den Einstellungen des Plugins unter **Tagesziel** fest: 500, wenn Sie es nicht ändern, 0 für keins.
- **Ganzer Ordner**: Klappen Sie ihn auf, um Wörter, Zeichen und Dokumente im ganzen geöffneten Ordner zu zählen.

Chinesisch, Japanisch und Koreanisch werden nach Zeichen gezählt, andere Schriften nach Wörtern. Die Zeichen von Markdown selbst – `#`, `*`, Linkadressen, Front Matter – zählen nicht. Die Lesezeit geht von 230 Wörtern oder 400 CJK-Zeichen pro Minute aus.

Es braucht Textus 1.4.3 oder neuer. Es fragt danach, den Editor und die Dateien des geöffneten Ordners zu lesen, um sie zu zählen, und gibt Textus AI das Werkzeug unten.

## Änderungen

- **0.2.8** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.2.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.2.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.2.5** - Words and characters are counted as the status bar counts them (from Textus 1.4.3), and a Windows file's front matter is left out of the count.
- **0.2.4** - The store description now opens with what the plugin does.
- **0.2.3** - Today now counts only the words you type yourself, not changes from sync or AI, and stays quick in large folders. A negative daily goal is no longer shown as met.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - Updated shared path code.
- **0.2.0** - Textus AI can count the words of a document or a folder.
- **0.1.1** - Says where it runs: desktop and iPhone.
- **0.1.0** - First version: the document, the selection, today against a goal, the streak and the whole folder.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `count_words`: Zählt Wörter, Zeichen und Leseminuten eines Dokuments, aller Dokumente eines Ordners oder des vorderen Dokuments - ein chinesisches, japanisches oder koreanisches Zeichen zählt als Wort, Markdown-Zeichen nicht.
<!-- /ai-tools -->
