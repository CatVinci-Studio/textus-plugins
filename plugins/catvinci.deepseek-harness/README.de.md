# DeepSeek Harness

Sprechen Sie in Textus AI mit DeepSeek Harness, dem eigenen Agenten von DeepSeek. Er liest den geöffneten Ordner, schreibt und überarbeitet Ihre Notizen und fragt vor jeder Änderung: Textus zeigt, was er tun möchte, und Sie erlauben es oder nicht. Was er geändert hat, ist im Dokument markiert und lässt sich mit einem Rückgängig zurücknehmen.

1. Installieren Sie [Node.js](https://nodejs.org) 24.9 oder neuer, falls es auf diesem Computer fehlt.
2. Geben Sie ihm einmal Ihren DeepSeek-API-Schlüssel: Führen Sie `npx -y @deepseek-ai/dsh@0.2.2-rc.1 web` im Terminal aus und tragen Sie den Schlüssel auf der Seite Models ein.
3. Klicken Sie oben rechts im Fenster, neben der Schaltfläche von Textus AI, auf die Schaltfläche von DeepSeek Harness.

Textus startet [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) mit `dsh --profile acp`, seinem Agent-Client-Protocol-Server, ausgeführt mit `npx`. Ihr Schlüssel und seine Nutzung gehören zu DeepSeek; Textus speichert dafür keinen Schlüssel. DeepSeek Harness ist eine Vorabversion, sein Verhalten kann sich also ändern.

Textus startet ihn in seiner schreibgeschützten Sandbox: Er liest und sucht frei und fragt, bevor er eine Datei schreibt oder einen Befehl ausführt, der etwas ändert.

DeepSeek Harness schickt seine Sitzungsprotokolle standardmäßig an DeepSeek; schalten Sie das in `dsh web` unter Settings › General aus. Textus schaltet seine Nutzungsberichte aus.

Es braucht Textus 1.4.3 oder neuer. Es fragt nach einer einzigen Berechtigung: diesen Agenten auf diesem Computer zu starten.

## Änderungen

- **0.1.3** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.2** - Asks before writing files or running commands that change things (before, it did both without asking). Usage reports off, and the setup names the exact version and Node.js 24.9. Needs Textus 1.4.3.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: DeepSeek Harness in Textus AI.
