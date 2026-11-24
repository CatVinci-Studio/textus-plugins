# GitHub Copilot CLI

Sprechen Sie in Textus AI mit GitHub Copilot CLI, mit den Modellen Ihres Copilot-Abos. Der Agent liest den geöffneten Ordner, schreibt und überarbeitet Ihre Notizen und fragt vor jeder Änderung: Textus zeigt, was er tun möchte, und Sie erlauben es oder nicht. Was er geändert hat, ist im Dokument markiert und lässt sich mit einem Rückgängig zurücknehmen. Sein Modus (agent, plan, autopilot), sein Modell und der Schalter „allow all“ stehen im Menü neben dem Modellmenü von Textus AI; „allow all“ ist anfangs aus.

1. Installieren Sie [Node.js](https://nodejs.org), falls es auf diesem Computer fehlt. Sie brauchen ein GitHub-Copilot-Abo.
2. Einmal im Terminal: `npx @github/copilot login`.
3. Klicken Sie oben rechts im Fenster, neben der Schaltfläche von Textus AI, auf die Schaltfläche von GitHub Copilot CLI.

Textus startet [GitHub Copilot CLI](https://github.com/github/copilot-cli) mit `copilot --acp`, seinem Agent-Client-Protocol-Server, ausgeführt mit `npx`. Copilot CLI ist GitHubs eigene Software unter eigener Lizenz; Ihr Konto und seine Nutzung gehören zu GitHub, und Textus speichert dafür kein Token.

Autopilot arbeitet von selbst weiter und verbraucht mehr Premium-Anfragen. Textus behält die Version, die es startet: Copilot aktualisiert sich hier nicht selbst.

Es braucht Textus 1.4.3 oder neuer. Es fragt nach einer einzigen Berechtigung: diesen Agenten auf diesem Computer zu starten.

## Änderungen

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: GitHub Copilot CLI in Textus AI.
