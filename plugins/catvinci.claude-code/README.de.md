# Claude Code

Sprechen Sie in Textus AI mit Claude Code. Der Agent liest den geöffneten Ordner, schreibt und überarbeitet Ihre Notizen und fragt vor jeder Änderung: Textus zeigt, was er tun möchte, und Sie erlauben es oder nicht. Was er geändert hat, ist im Dokument markiert und lässt sich mit einem Rückgängig zurücknehmen.

1. Installieren Sie [Node.js](https://nodejs.org), falls es auf diesem Computer fehlt.
2. Melden Sie sich einmal im Terminal bei Claude Code an: `npx -y @agentclientprotocol/claude-agent-acp@0.107.0 --cli auth login --claudeai` (oder starten Sie `claude`, wenn es installiert ist).
3. Klicken Sie oben rechts im Fenster, neben der Schaltfläche von Textus AI, auf die Schaltfläche von Claude Code, oder wählen Sie **Claude Code** im Modellmenü von Textus AI.

Textus startet Claude Code von Anthropic über den Agent-Client-Protocol-Adapter `@agentclientprotocol/claude-agent-acp`, ausgeführt mit `npx`. Ihr Konto und seine Nutzung gehören zu Claude Code; Textus speichert dafür keinen Schlüssel.

Er startet im Modus **Manual** von Claude Code, der vor jeder Bearbeitung und jedem Befehl fragt; einen anderen Modus wählen Sie im Menü neben dem Modell. Um ihn über OpenRouter laufen zu lassen, tragen Sie `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN` und ein leeres `ANTHROPIC_API_KEY` in den `env`-Block von `~/.claude/settings.json` ein: Ein aus dem Dock geöffnetes Textus sieht keine Variablen, die in einem Terminal gesetzt wurden.

Es braucht Textus 1.4.3 oder neuer. Es fragt nach einer einzigen Berechtigung: diesen Agenten auf diesem Computer zu starten.

## Änderungen

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Starts in Manual mode, named by the plugin; its sign-in command needs no separate Claude Code install. Needs Textus 1.4.3, which also marks the changes Claude Code writes itself.
- **0.1.2** - Uses Claude Code's ACP adapter 0.107.0. Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Claude Code answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Claude Code in Textus AI.
