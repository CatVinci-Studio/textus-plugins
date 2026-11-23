# Codex

Sprechen Sie in Textus AI mit Codex. Der Agent liest den geöffneten Ordner, schreibt und überarbeitet Ihre Notizen und fragt vor jeder Änderung: Textus zeigt, was er tun möchte, und Sie erlauben es oder nicht. Was er geändert hat, ist im Dokument markiert und lässt sich mit einem Rückgängig zurücknehmen.

1. Installieren Sie [Node.js](https://nodejs.org), falls es auf diesem Computer fehlt.
2. Beim ersten Mal öffnet sich ein Browser zur Anmeldung mit ChatGPT; oder melden Sie sich einmal im Terminal an: `npx -y @agentclientprotocol/codex-acp@2.6.0 cli login`.
3. Klicken Sie oben rechts im Fenster, neben der Schaltfläche von Textus AI, auf die Schaltfläche von Codex, oder wählen Sie **Codex** im Modellmenü von Textus AI.

Textus startet Codex von OpenAI über den Agent-Client-Protocol-Adapter `@agentclientprotocol/codex-acp`, ausgeführt mit `npx`. Ihr Konto und seine Nutzung gehören zu Codex; Textus speichert dafür keinen Schlüssel.

Er startet in **Read-only**, dem Modus, der vor jeder Bearbeitung und jedem Befehl fragt; einen anderen wählen Sie im Menü neben dem Modell.

Es braucht Textus 1.4.3 oder neuer. Es fragt nach einer einzigen Berechtigung: diesen Agenten auf diesem Computer zu starten.

## Änderungen

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Signs in with ChatGPT in the browser (before, it tried an API key and stopped there), and starts in Read-only. Needs Textus 1.4.3, which also marks the changes Codex writes itself.
- **0.1.2** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Codex answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Codex in Textus AI.
