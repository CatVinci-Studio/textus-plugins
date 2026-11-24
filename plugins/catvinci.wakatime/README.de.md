# WakaTime

Sendet die Zeit, die Sie in Textus schreiben, an Ihr [WakaTime](https://wakatime.com)-Konto, damit sie im Dashboard neben Ihrer Programmierzeit erscheint.

1. Kopieren Sie Ihren API-Schlüssel von [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key).
2. Klicken Sie auf der Seite von WakaTime in den Einstellungen von Textus auf **API-Schlüssel festlegen…** und fügen Sie ihn ein. Der Schlüssel liegt im geschützten Speicher von Textus.

Im Plugins-Menü und in der Befehlspalette stehen **WakaTime: API-Schlüssel festlegen…**, **WakaTime: Heutige Schreibzeit**, das die heutige Summe so zeigt, wie WakaTime sie zählt, und **WakaTime: Dashboard öffnen**.

## Was zählt und was gesendet wird

- Es zählt nur Ihre eigene Arbeit in einem Fenster von Textus, das vorne ist: Tippen, die Einfügemarke bewegen, Dokumente wechseln und speichern. Zeit, in der Textus im Hintergrund ist, und Änderungen auf der Festplatte oder durch ein Plugin zählen nicht. Was Sie mit Textus AI schreiben, zählt als KI-Programmierung.
- Für jeden Moment der Arbeit teilt es WakaTime den Pfad des Dokuments mit, die Sprache (Markdown), die Zahl der Zeilen, das Projekt und den Git-Branch. Das Projekt ist die erste Zeile einer Datei `.wakatime-project` im geöffneten Ordner, sonst der Name des geöffneten Ordners.
- Es sendet für dasselbe Dokument höchstens alle zwei Minuten und immer beim Speichern, wie die Plugins von WakaTime selbst.
- Offline wartet die Zeit in einer Warteschlange und geht später gesammelt hinaus.
- Bevor der Schlüssel festgelegt ist, wird nichts gesendet, und ein ungespeichertes Dokument wird nie gesendet. Um aufzuhören, legen Sie einen leeren Schlüssel fest.

Es braucht Textus 1.3.0 oder neuer. Es fragt danach, den Editor und die Dateien des geöffneten Ordners zu lesen (für das Dokument, seine Zeilen, `.wakatime-project` und `.git/HEAD`) und `api.wakatime.com` zu erreichen, und nichts anderes im Netzwerk.

## Änderungen

- **0.2.5** - Set the API key with a button on its page in Settings, and find its commands in the Plugins menu: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.2.4** - Leaving the key empty now really turns it off; a garbled reply to Today's Writing Time shows the usual message.
- **0.2.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.2** - Finds `.wakatime-project` and the Git branch the same way on every system.
- **0.2.1** - Says where it runs: desktop and iPhone.
- **0.2.0** - Only your own work in a window in front counts; an offline queue sent in batches; project, branch and lines; Today's Writing Time.
- **0.1.0** - First version: writing time in Textus on your WakaTime dashboard.
