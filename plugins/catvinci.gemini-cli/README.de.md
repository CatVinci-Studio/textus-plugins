# Gemini CLI

Sprechen Sie in Textus AI mit Gemini CLI, mit den Gemini-Modellen von Google. Der Agent liest den geöffneten Ordner, schreibt und überarbeitet Ihre Notizen und fragt vor jeder Änderung: Textus zeigt, was er tun möchte, und Sie erlauben es oder nicht. Was er geändert hat, ist im Dokument markiert und lässt sich mit einem Rückgängig zurücknehmen. Sein Modus (erst fragen, Bearbeitungen annehmen, alles annehmen, planen) und sein Modell stehen im Menü neben dem Modellmenü von Textus AI.

1. Installieren Sie [Node.js](https://nodejs.org), falls es auf diesem Computer fehlt.
2. Klicken Sie oben rechts im Fenster, neben der Schaltfläche von Textus AI, auf die Schaltfläche von Gemini CLI. Beim ersten Mal öffnet sich ein Browser zur Anmeldung mit Ihrem Google-Konto. Für einen Gemini-API-Schlüssel oder Vertex AI führen Sie einmal `npx @google/gemini-cli` im Terminal aus und wählen ihn mit `/auth` (ein aus dem Dock geöffnetes Textus sieht keine Variablen, die in einem Terminal gesetzt wurden).

Textus startet [Gemini CLI](https://github.com/google-gemini/gemini-cli) mit `gemini --acp`, seinem Agent-Client-Protocol-Server, ausgeführt mit `npx`. Ihr Konto und seine Nutzung gehören zu Google; Textus speichert dafür keinen Schlüssel.

„Bearbeitungen annehmen“ und „alles annehmen“ funktionieren nur in Ordnern, denen Sie in Gemini CLI selbst vertraut haben; anderswo bleibt es bei „erst fragen“.

Es braucht Textus 1.4.3 oder neuer. Es fragt nach einer einzigen Berechtigung: diesen Agenten auf diesem Computer zu starten.

## Änderungen

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Gemini CLI in Textus AI.
