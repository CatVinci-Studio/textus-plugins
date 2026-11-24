# Keenable-Suche

Lassen Sie Textus AI mit [Keenable](https://keenable.ai) im Web suchen.

- Textus AI nutzt es im Gespräch, wenn Sie nach Keenable fragen oder seine eigene Websuche nicht eingerichtet ist. Standardmäßig bekommt es 5 Treffer (bis zu 10), jeden mit Titel, Adresse, kurzem Text und Datum.
- Es funktioniert ohne Schlüssel, über die öffentliche Suche von Keenable. Für die volle Suche von Keenable klicken Sie auf seiner Seite in den Einstellungen von Textus auf **API-Schlüssel festlegen…** (oder führen Sie **Keenable: API-Schlüssel festlegen…** aus der Befehlspalette aus) und fügen Ihren Schlüssel ein. Tun Sie es noch einmal und lassen Sie das Feld leer, um den Schlüssel zu entfernen und zur öffentlichen Suche zurückzukehren. Der Schlüssel liegt im geschützten Speicher von Textus auf diesem Gerät.
- Was Sie fragen, geht nur an Keenable, wenn Textus AI dieses Werkzeug in einem Gespräch nutzt.

Das Plugin fragt nach zwei Berechtigungen: KI-Werkzeuge, um Textus AI das Suchwerkzeug unten zu geben, und Netzwerkzugriff nur auf `api.keenable.ai`, um die Suchen auszuführen.

## Änderungen

- **0.1.4** - A simpler icon, drawn in the text colour.
- **0.1.3** - Set the API key with a button on its page in Settings: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.1.2** - Removing the API key really removes it, so search goes back to the public search; an unreadable answer gets a plain message.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - First version: web search for Textus AI through Keenable, with or without an API key.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `keenable_search`: Sucht mit Keenable im Web und gibt zu jedem Treffer Titel, URL, einen kurzen Text und das Datum zurück. Nutze es, wenn der Nutzer Keenable möchte oder die eigene Websuche von Textus AI nicht eingerichtet ist.
<!-- /ai-tools -->
