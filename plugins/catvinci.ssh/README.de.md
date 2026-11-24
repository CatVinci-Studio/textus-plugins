# SSH-Ordner

Öffnen Sie über Ihr eigenes ssh einen Ordner auf einem Server und schreiben Sie dort wie in einem Ordner auf diesem Computer: seine Dokumente in Tabs, seine Dateien in der Seitenleiste.

## Was es tut

- **Plugins › Entfernten Ordner öffnen…** listet die Server aus Ihrer `~/.ssh/config` (oder nimmt einen, den Sie eingeben, etwa `me@server`) und dann den Ordner, der geöffnet werden soll, beginnend bei Ihrem Home-Verzeichnis dort.
- Der Ordner öffnet sich in der Seitenleiste. Dokumente öffnen, speichern, umbenennen, verschieben und durchsuchen Sie wie in jedem Ordner; ein neues Dokument oder ein neuer Ordner entsteht auf dem Server.
- Ihr eigenes `ssh` stellt die Verbindung her, mit Ihrer Konfiguration, Ihren Schlüsseln, Ihrem Agent und Ihren bekannten Hosts. Verlangt wird nur Dateiübertragung (SFTP): keine Shell, keine Befehle.
- Eine abgebrochene Verbindung wird beim nächsten Lesen oder Speichern einer Datei neu aufgebaut.

## Grenzen

- Anmeldung nur per Schlüssel oder Agent. Ein Server, der nach einem Passwort fragt, wird abgelehnt; richten Sie zuerst einen Schlüssel dafür ein.
- Ein Server, den ssh noch nicht kennt, wird abgelehnt und nie für Sie angenommen: Verbinden Sie sich einmal mit `ssh` im Terminal und nehmen Sie seinen Schlüssel dort an.
- Bilder lassen sich noch nicht in ein Dokument auf einem Server einfügen, und eine gelöschte Datei ist endgültig weg: Ein Server hat keinen Papierkorb.

## Berechtigungen

Es fragt nach **ssh**: Textus fragt Sie für jeden Server einmal, bevor das Plugin sich mit ihm verbinden darf.

## Änderungen

- **0.1.2** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.": the store shows that.
- **0.1.1** - Uses the plugin API as Textus 1.4.6 ships it.
- **0.1.0** - First version. Needs Textus 1.4.6.
