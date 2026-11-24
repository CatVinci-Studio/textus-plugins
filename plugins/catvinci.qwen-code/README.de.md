# Qwen Code

Sprechen Sie in Textus AI mit Qwen Code, mit den Qwen-Modellen von Alibaba. Der Agent liest den geöffneten Ordner, schreibt und überarbeitet Ihre Notizen und fragt vor jeder Änderung: Textus zeigt, was er tun möchte, und Sie erlauben es oder nicht. Was er geändert hat, ist im Dokument markiert und lässt sich mit einem Rückgängig zurücknehmen. Sein Modus (erst fragen, Bearbeitungen annehmen, selbst entscheiden, alles annehmen, planen), sein Modell und das Nachdenken stehen im Menü neben dem Modellmenü von Textus AI.

1. Installieren Sie [Node.js](https://nodejs.org) 22 oder neuer, falls es auf diesem Computer fehlt.
2. Geben Sie ihm einmal einen API-Schlüssel: Tragen Sie `OPENAI_API_KEY`, `OPENAI_BASE_URL` und `OPENAI_MODEL` in `~/.qwen/.env` ein (für OpenRouter ist die Basis-URL `https://openrouter.ai/api/v1`), oder führen Sie `npx @qwen-code/qwen-code` im Terminal aus und nutzen Sie `/auth` (Alibaba Cloud Model Studio oder ein beliebiger OpenAI-kompatibler Dienst).
3. Klicken Sie oben rechts im Fenster, neben der Schaltfläche von Textus AI, auf die Schaltfläche von Qwen Code.

Textus startet [Qwen Code](https://github.com/QwenLM/qwen-code) mit `qwen --acp`, seinem Agent-Client-Protocol-Server, ausgeführt mit `npx`. Ihr Schlüssel und seine Nutzung gehören zu Ihrem Anbieter; Textus speichert dafür keinen Schlüssel.

Er startet in „erst fragen“. Was Sie bei Befehlen mit „Always allow“ erlauben, speichert Qwen Code dauerhaft, im Projekt oder für Sie.

Es braucht Textus 1.4.3 oder neuer. Es fragt nach einer einzigen Berechtigung: diesen Agenten auf diesem Computer zu starten.

## Änderungen

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Qwen Code in Textus AI.
