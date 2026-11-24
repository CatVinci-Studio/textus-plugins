# OpenCode

Sprechen Sie in Textus AI mit OpenCode, mit dem Modell, das Sie dort eingerichtet haben. Der Agent liest den geöffneten Ordner, schreibt und überarbeitet Ihre Notizen und fragt vor jeder Änderung: Textus zeigt, was er tun möchte, und Sie erlauben es oder nicht. Was er geändert hat, ist im Dokument markiert und lässt sich mit einem Rückgängig zurücknehmen. Damit er ohne Nachfrage arbeitet, wählen Sie Allow all im Menü neben dem Modell (Textus 1.4.3 oder neuer).

1. Installieren Sie [Node.js](https://nodejs.org), falls es auf diesem Computer fehlt.
2. Mit den kostenlosen Modellen von OpenCode läuft er sofort. Für einen eigenen Anbieter (etwa OpenRouter) melden Sie sich einmal im Terminal an: `npx -y opencode-ai@1.19.5 auth login`.
3. Klicken Sie oben rechts im Fenster, neben der Schaltfläche von Textus AI, auf die Schaltfläche von OpenCode.

Textus startet [OpenCode](https://opencode.ai) mit `opencode acp`, seinem Agent-Client-Protocol-Server, ausgeführt mit `npx`. Ihre Konten und ihre Nutzung gehören zu OpenCode; Textus speichert dafür keinen Schlüssel.

Er fragt vor Bearbeitungen, Befehlen und Abrufen aus dem Web; im Planmodus bearbeitet er nichts. Seine Sub-Agenten sind vorerst aus: OpenCode gibt deren Fragen nicht weiter, sodass eine Runde ewig warten würde.

Es braucht Textus 1.4.3 oder neuer. Es fragt nach einer einzigen Berechtigung: diesen Agenten auf diesem Computer zu starten.

## Änderungen

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Asks before web fetches too, plan mode no longer edits, and sub-agents are off (their questions never arrived, so a turn hung). Needs Textus 1.4.3.
- **0.1.2** - Asks before each edit and command, as it says: OpenCode on its own allowed them unasked.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: OpenCode in Textus AI.
