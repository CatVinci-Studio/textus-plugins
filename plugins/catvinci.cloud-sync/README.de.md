# Cloud-Sync

Halten Sie einen Ordner auf Ihren Computern gleich, über Ihren eigenen S3-kompatiblen Speicher, WebDAV oder Nutstore, mit älteren Versionen in der Cloud und, wenn Sie möchten, verschlüsselt, bevor er ein Gerät verlässt.

Mit eingeschalteter Ende-zu-Ende-Verschlüsselung sieht der Speicherdienst weder den Inhalt Ihrer Dateien noch ihre Namen.
Cloud-Sync braucht Textus 1.4.1 oder neuer.

## Erste Schritte

1. Öffnen Sie in Textus den Ordner, der synchronisiert werden soll, und wählen Sie dann **Plugins › Cloud-Sync**
   (oder **Verbindung einrichten…** in seinem Tab in der Seitenleiste).
2. Wählen Sie den Speicherdienst und geben Sie seine Serveradresse und Anmeldung ein. Nutstore
   braucht nur Ihre E-Mail und ein App-Passwort aus Account › Security.
3. Zum Verschlüsseln schalten Sie **Ende-zu-Ende-Verschlüsselung** ein und legen ein **Sync-Passwort**
   mit mindestens 12 Zeichen fest; bewahren Sie es in Ihrem Passwortmanager auf: Es lässt sich nicht
   zurücksetzen. Entscheiden Sie das einmal pro Cloud-Ordner: Ein späterer Wechsel braucht einen neuen,
   leeren Ordner.
4. Wählen Sie **Verbindung speichern** und dann **Jetzt synchronisieren**.

Öffnen Sie auf einem anderen Gerät den passenden Ordner und geben Sie denselben Dienst und
denselben Cloud-Ordner ein (und, bei einem verschlüsselten, dasselbe Sync-Passwort). Schalten Sie **Automatisch synchronisieren** ein
(solange Textus offen ist): Dann wird ein paar Sekunden nach dem Speichern oder Umbenennen einer
Datei synchronisiert, und zusätzlich alle 5 Minuten, falls nichts den Abgleich ausgelöst hat (**Synchronisierungsintervall**: 5 bis
60 Minuten). Eine Datei, die Sie löschen, wird mit der nächsten Synchronisierung auch in der Cloud gelöscht. **Plugins › Jetzt
synchronisieren** startet jederzeit eine Synchronisierung.

Sobald eine Verbindung gespeichert ist, zeigt die Statusleiste den Stand: **Synchronisiert ·
vor 2 Min.**, **Wird synchronisiert…**, **Sync-Konflikt** oder **Sync-Fehler**. Ein Klick darauf
öffnet den Bereich.

Haben beide Geräte dieselbe Datei geändert, bleiben beide Versionen: Ihre an ihrem Platz,
die des anderen Geräts in `Sync conflicts/`.

## Cloud-Verlauf

Jedes Mal, wenn eine Synchronisierung eine Datei ersetzt oder löscht, bleibt ihr früherer Inhalt im
Cloud-Ordner. Klicken Sie mit der rechten Maustaste auf eine Datei und wählen Sie **Cloud-Verlauf…**, um ihre
Versionen zu sehen (wann, von welchem Gerät, wie groß), eine zu lesen und **Diese Version
wiederherstellen** zu wählen: Sie wird zur aktuellen Datei und wird synchronisiert, und die Version, die sie ersetzt,
bleibt im Verlauf. Hat die Datei dort noch nicht synchronisierte Änderungen oder ist sie offen,
wird die Version stattdessen daneben geschrieben (`Note (3f2a9c1b).md`). **Plugins › Cloud-Verlauf…** listet die aus
dem Ordner gelöschten Dateien; öffnen Sie eine, um sie zurückzuholen.

**Cloud-Verlauf aufbewahren** legt fest, wie lange, gezählt ab dem Zeitpunkt, an dem eine Version
ersetzt wurde: 30, 90 (Standard) oder 365 Tage, oder immer. Eine Einstellung gilt für den ganzen
Ordner: die zuletzt von irgendeinem Gerät synchronisierte, die die anderen dann anzeigen.
Am ersten Tag wird eine Version pro Stunde behalten, danach eine pro Tag, höchstens 200 pro
Datei; wächst der Verlauf über 8 MB an Einträgen hinaus, gehen die ältesten Versionen zuerst.
Jede Synchronisierung, die etwas ändert, und sonst einmal am Tag, entfernt abgelaufene
Versionen und löscht die Blöcke, die nur sie genutzt haben. Platz, der vor 0.5 belegt wurde
(ältere Snapshots), wird nicht freigegeben. Aktualisieren Sie jedes Gerät auf 0.5: Was ein Gerät mit 0.4
ändert, kommt erst bei der nächsten Synchronisierung mit 0.5 in den Verlauf, und seine eigenen
Löschungen erscheinen bis dahin nicht in der Liste.

**Berechtigungen:** den geöffneten Ordner lesen und schreiben (um ihn zu durchsuchen und anzuwenden, was
herunterkommt) und jede Website erreichen (nur den HTTPS-Server, den Sie eingeben). Keine
Telemetrie, Analyse, kein Code aus dem Netz und keine Selbstaktualisierung.

## Details

S3 nimmt einen eigenen Endpunkt (leer heißt AWS), Region, Bucket, Pfad- oder
Virtual-Host-Adressierung und optional ein Sitzungstoken unter **Weitere Optionen**.
Der Cloud-Ordner enthält das Speicherformat des Plugins, keine einfache Dateikopie;
nutzen Sie für jeden Arbeitsbereich einen eigenen.

Zugangsdaten werden über `ctx.secrets` gespeichert, getrennt vom Sync-Zustand.
Sie werden nie an die Einstellungsseite zurückgegeben oder ins Manifest in der Cloud
kopiert. Leere Felder für Zugangsdaten behalten die Zugangsdaten einer bestehenden Verbindung.
Endpunkt, Cloud-Ordner oder Konto zu ändern, verlangt passende Zugangsdaten.
Das Sync-Passwort wird für die automatische Synchronisierung ebenfalls lokal über `ctx.secrets` gespeichert,
nie an die Einstellungsseite zurückgegeben oder an den Speicherdienst geschickt. Leere Passwortfelder
behalten es. Ein anderes Passwort hier einzugeben, verschlüsselt ein bestehendes Repository nicht
neu: Es muss zu dem Passwort passen, mit dem dieser Cloud-Ordner eingerichtet wurde.

## Was synchronisiert wird

- Gespeicherte `.md`-, `.markdown`-, `.mdown`-, `.mkd`-, `.txt`- und `.csv`-Dokumente sowie
  Obsidians Bases (`.base`) und Canvases (`.canvas`).
- Bilder, PDF, Office-/OpenDocument-Dateien, Audio und Video. Die genaue Liste der erlaubten Dateien
  steht in `development/cloud-sync/src/config.ts` im Repository des Plugins.
- Projektdaten von Textus: `.textus/agent.md`, `style.md`, `style.previous.md`
  und Markdown unter `.textus/library/`, `memory/` und `skills/`.

Globale Einstellungen, Chatverlauf, Entwürfe, ungespeicherte Änderungen, Zugangsdaten, Daten anderer
Plugins, beliebige Punktdateien und Build-/Abhängigkeitsordner sind ausgenommen.
Nur Dateien im geöffneten Arbeitsbereich sind erreichbar. Dateien außerhalb davon,
auch verlinkte Anhänge außerhalb des Ordners, werden nicht hochgeladen.

In den Einstellungen können Sie mehr auslassen: eine Regel pro Zeile, geschrieben wie in einer
`.gitignore` (`drafts/`, `*.pdf`, `!keep.pdf`). Ein Schalter wendet zusätzlich die eigene
`.gitignore` des Ordners an. Ausgelassene Dateien bleiben auf jedem Gerät, wie sie sind:
Für sie wird nichts hochgeladen, heruntergeladen oder gelöscht. Ein weiterer Schalter überträgt
die gemeinsamen Einstellungen von Obsidian (`.obsidian/app.json`, `appearance.json`,
`hotkeys.json`, `bookmarks.json`, `graph.json`, `core-plugins.json`,
`types.json`); seine gerätebezogenen Dateien wie `workspace.json` bleiben lokal.

Die aktuellen Grenzen sind 128 MiB pro Datei, 20.000 besuchte Dateien/Ordner,
48 Verzeichnisebenen und ein Manifest von 8 MiB. Leere Verzeichnisse werden nicht synchronisiert.
Pfade, die auf unterstützten Plattformen unsicher sind oder sich nur in Groß-/Kleinschreibung oder
Unicode-Normalisierung unterscheiden, halten den Lauf an, statt stillschweigend umbenannt zu werden.

## Änderungen und Konflikte

SHA-256-Hashes und die letzte erfolgreiche Synchronisierung bestimmen, welche Seite sich geändert hat.
Nur geänderter Inhalt wird übertragen. Dateien werden in Blöcken von 2 MiB gespeichert, und
gemeinsame Blöcke werden wiederverwendet; ETags gelten nicht als Inhalts-Hashes.

- Unabhängige Änderungen werden auf das andere Gerät kopiert.
- Bei gleichzeitigen Änderungen bleibt die lokale Datei, und die Version aus der Cloud wird unter
  `Sync conflicts/` gespeichert. Beide Versionen werden für andere Geräte veröffentlicht.
- Offene Zieldateien werden zurückgestellt; speichern und schließen Sie sie und synchronisieren Sie erneut.
- Bestehende Textdateien werden über die versionsgeprüfte API `files.process` von Textus
  aktualisiert. Bestehende Binärdateien werden nie überschrieben: Bei abweichenden
  Anhängen bleiben beide Versionen, auch wenn sich nur eine Seite geändert hat. Die aktuelle
  Plugin-API hat keine bedingte Ersetzung für Binärdateien.
- Eine auf einem Gerät gelöschte Datei wird auf den anderen bei ihrer nächsten Synchronisierung gelöscht,
  und die anderen Geräte legen sie in den Papierkorb des Systems, wo Sie sie wiederherstellen können.
  Die gelöschte Datei bleibt im Cloud-Verlauf, solange dieser Versionen
  aufbewahrt. Eine Umbenennung kommt bei den anderen Geräten als Umbenennung an.
- Inhalt verlässt den Server erst, wenn der Verlauf ihn freigibt: Bis dahin kann eine
  gelöschte Datei von jedem gelesen werden, der den Cloud-Ordner lesen kann (und, wenn
  er verschlüsselt ist, das Sync-Passwort kennt). Um Inhalt endgültig zu entfernen, nutzen Sie
  einen neuen Cloud-Ordner für einen bereinigten Arbeitsbereich.
- Eine Änderung gewinnt gegen eine Löschung: Hat ein Gerät eine Datei gelöscht, die das andere
  seit ihrer letzten Synchronisierung bearbeitet hat, kommt die bearbeitete Datei überall zurück.
- Ein Gerät, das einen Ordner zum ersten Mal synchronisiert, löscht nie etwas; eine Datei,
  die nur eine Seite hat, wird auf die andere kopiert.
- Eine Synchronisierung, die viele Dateien aus der Cloud löschen würde (mehr als zehn und mehr
  als 30 % der synchronisierten Dateien), hält vor jeder Löschung an und fragt nach; eine automatisch
  gestartete fragt einmal, und **Jetzt synchronisieren** fragt erneut. Umbenannte oder verschobene Dateien
  zählen nicht. Ein Ordner, in dem nichts gefunden wird, obwohl viele Dateien von dort
  synchronisiert wurden, gilt als unlesbar (Zugriff verloren, Dateien nicht heruntergeladen), und
  die Synchronisierung hält an, ohne etwas zu löschen.
- Lehnt der Papierkorb des Systems eine anderswo gelöschte Datei ab, bleibt sie an ihrem Platz,
  steht in der Liste im Bereich, und die nächste Synchronisierung versucht es erneut;
  der Rest der Synchronisierung läuft weiter.
- Dateien, die in einem Tab offen sind, werden nicht entfernt oder umbenannt; schließen Sie sie und synchronisieren Sie erneut.
- Aktualisieren Sie jedes Gerät auf 0.4, bevor Sie sich auf Löschungen verlassen: Ein älteres Gerät legt
  eine anderswo gelöschte Datei zurück.

Mit eingeschalteter **Ende-zu-Ende-Verschlüsselung** werden Inhalte und Dateinamen vor dem Hochladen verschlüsselt; so oder
so läuft alles über HTTPS.
Nutzen Sie einen privaten S3-Bucket oder WebDAV-Ordner. Das Dienstkonto
braucht Lese-, Schreib- und Löschrechte im dafür vorgesehenen Cloud-Ordner
(Löschen ist für temporäre Objekte und Sperren nötig).

## Anfragen pro Synchronisierung

Von den Tests über HTTP für ein kleines Dokument gemessen, nach der ersten Synchronisierung
der Sitzung (die erste prüft außerdem die exklusiven Schreibvorgänge des Servers: 4 Anfragen
mehr bei S3):

| Synchronisierung                         | S3  | WebDAV / Nutstore |
| ---------------------------------------- | --- | ----------------- |
| Nichts geändert                          | 3   | 3                 |
| Ein bearbeitetes Dokument (ein Block von 2 MiB) | 18  | 20                |
| Eine gelöschte Datei                     | 20  | 22                |

Hat sich auf keiner Seite etwas geändert, liest eine Synchronisierung nur die aktuelle Revision des Ordners
und nimmt keine Sperre. Jeder weitere geänderte Block kostet 1 Anfrage: Ein Block
wird einmal gesendet, ohne vorher zu fragen, ob er schon da ist, und ohne ihn zurückzulesen
(Blöcke sind nach ihrem Inhalt benannt; jeder Download prüft jeden einzelnen). Bei
WebDAV kostet ein Block, der in einen noch nicht vorhandenen Ordner kommt, 2 mehr: den
abgelehnten Upload und den Ordner; die Sperre zu nehmen kostet einen Upload und ein `MOVE`. Synchronisierungen nach dem Speichern warten, bis das Speichern abgeschlossen ist (5 s), und dann die **Synchronisierungsverzögerung**
(keine bis 10 Minuten): 3 bei einer neuen Nutstore-Verbindung, da Nutstore
die Anfragen pro Konto begrenzt, und 0 bei S3 und WebDAV. Die Antwort eines ausgelasteten Servers
(429, 503) pausiert jede Anfrage; verlangt er eine Wartezeit, zeigt der Status
„Warten auf den Server“ mit den Sekunden, bis zu 60 s. Verlangt er länger, hält diese
Synchronisierung an und sagt, dass Sie es später erneut versuchen sollen; was sie gesendet hat, bleibt für die nächste erhalten.

## Ende-zu-Ende-Verschlüsselung

Mit eingeschalteter **Ende-zu-Ende-Verschlüsselung** werden Dateiinhalte, Pfade, Inhalts-Hashes und Snapshots authentifiziert und verschlüsselt,
mit AES-256-GCM über Web Crypto. Jede Verschlüsselung nutzt eine frische 96-Bit-Nonce und
ein 128-Bit-Tag. Die Authentifizierung bindet den Verschlüsselungs-Header des Repositorys und den
logischen Objektschlüssel, was das Vertauschen von Blöcken, Manifesten und Snapshots verhindert.

Ein 256-Bit-Wurzelschlüssel wird lokal mit PBKDF2-HMAC-SHA-256, 600.000 Iterationen und
einem zufälligen 256-Bit-Salt des Repositorys abgeleitet. HKDF-SHA-256 leitet getrennte Schlüssel für AES und
für die Objektbenennung mit HMAC-SHA-256 ab. Die Namen von Inhaltsblöcken sind geschlüsselte HMACs, keine öffentlichen
Klartext-Hashes. Gleiche Blöcke werden innerhalb eines Repositorys wiederverwendet; voneinander unabhängige Repositorys
nutzen verschiedene Salts und Schlüssel. Die Entschlüsselung authentifiziert die Bytes, bevor Dateien angewendet werden.

In der Verschlüsselungsbeschreibung stehen nur öffentliche KDF-Parameter, eine Repository-ID und eine verschlüsselte feste Prüfnachricht.
Ein Gerät merkt sich den Fingerabdruck der Beschreibung nach dem ersten erfolgreichen Entsperren und hält an, wenn er sich ändert oder verschwindet.
Falsche Passwörter, fehlerhafte Beschreibungen und manipulierter Geheimtext halten die Synchronisierung an.

Der Anbieter kann weiterhin den gewählten Cloud-Präfix sehen, Größe und Anzahl der Objekte,
die Wiederverwendung von Blöcken innerhalb eines Repositorys, die Zeitpunkte der Anfragen und den anonymen Inhaber/Zeitpunkt der Sperre.
Das Protokoll garantiert nicht, dass ein böswilliger Server erkannt wird, der einen älteren
gültigen verschlüsselten Zustand wieder einspielt. Starke Passwörter sind wichtig, weil der Geheimtext in der Cloud
Offline-Rateversuche erlaubt; die KDF macht sie teurer, kann ein schwaches Passwort aber nicht
stark machen. Diese Umsetzung hat automatische Tests für Interoperabilität und Manipulation,
wurde aber nicht unabhängig auf Sicherheit geprüft.

Lokale Dateien bleiben lesbar. Das Passwort liegt im lokalen, nutzerbezogenen geschützten Speicher von Textus,
nicht im Repository in der Cloud; das schützt keinen kompromittierten oder entsperrten
Client. Wer das Passwort oder die ursprüngliche Verschlüsselungsbeschreibung verliert, kann die Daten in der Cloud nicht
wiederherstellen. Ein vollständiges Backup muss die Beschreibung und die verschlüsselten Objekte enthalten.

### Format in der Cloud

- `v1/head.json`: die öffentliche Verschlüsselungsbeschreibung (`textus-cloud-sync-e2ee/1`).
  Der alte Pfad ist Absicht: Clients mit v0.1 lehnen dieses Format ab, bevor sie Dateien hochladen.
- `v1/lock.json`: gemeinsamer Ausschluss mit alten und neuen Clients; keine Dokumentdaten.
- `v2/head.bin`: verschlüsseltes aktuelles Manifest.
- `v2/history.bin`: verschlüsselter Verlauf (die älteren Versionen jeder Datei und ihre Herkunft).
- `v2/blocks/<prefix>/<HMAC>`: verschlüsselte Inhaltsblöcke.
- `v2/snapshots/<revision>.bin`: verschlüsselte Manifeste der aktuellen und der
  vorigen Revision.

Ohne Verschlüsselung werden dieselben Objekte als JSON und rohe Blöcke gespeichert:
`v1/head.json`, `v1/history.json`, `v1/blocks/<prefix>/<SHA-256>` und
`v1/snapshots/<revision>.json`. Ein Cloud-Ordner ist entweder verschlüsselt oder nicht;
das Plugin weigert sich, beides zu mischen.

Verschlüsselte Objekte enthalten `TCS2`, eine 12-Byte-Nonce, dann den Geheimtext und sein 16-Byte-
GCM-Tag. AAD ist UTF-8 des kanonischen JSON-Headers (`format`, `repositoryId`, `kdf`,
`iterations`, `salt`, in dieser Reihenfolge), ein Zeilenumbruch und der logische v1-Objektschlüssel. Das
Passwort ist UTF-8 ohne Normalisierung. HKDF nutzt die Repository-ID in UTF-8 als Salt
und `textus-cloud-sync-e2ee/1/content` oder `/names` als Info. Die HMAC-Eingabe für Blöcke ist der
logische Schlüssel `v1/blocks/<hash-prefix>/<SHA-256>` in UTF-8. Der Klartext der Prüfung ist
`Textus encrypted workspace key check`, mit dem logischen Schlüssel `key-check`; sein Umschlag
steht hex-kodiert in `verifier`. Diese Festlegungen werden in Tests gegen die unabhängigen
PBKDF2-, HKDF-, HMAC- und AES-GCM-APIs von Node geprüft.

### Einen Ordner auf Verschlüsselung umstellen

Ein Cloud-Ordner wird nicht an Ort und Stelle umgewandelt. Stellen Sie zuerst sicher, dass ein lokaler Arbeitsbereich
alle Dateien und Konfliktkopien enthält, die Sie brauchen, wählen Sie dann einen **neuen, leeren
Cloud-Ordner**, schalten Sie die Verschlüsselung ein und legen Sie ein Sync-Passwort fest. Synchronisieren Sie zuerst diesen vollständigen
Arbeitsbereich; danach können andere Geräte mit demselben Passwort und Cloud-Ordner
dazukommen.

Die alten Daten in der Cloud, auch der eigene Versionsverlauf des Anbieters und seine Backups,
bleiben unverschlüsselt. Verwalten Sie alte Kopien über Ihren Anbieter, nachdem Sie den
verschlüsselten Arbeitsbereich geprüft haben. Das Passwort an Ort und Stelle zu wechseln, wird nicht unterstützt; nutzen Sie einen weiteren
neuen Cloud-Ordner, um das Passwort zu ändern.

## Unterbrochene Synchronisierung

Eine Sperre in der Cloud lässt die Geräte nacheinander arbeiten. S3 nutzt `If-None-Match: *`; WebDAV nutzt einen
temporären Upload gefolgt von `MOVE` mit `Overwrite: F`, einschließlich der Antwort 409 von Nutstore
für ein bestehendes Ziel. Der Verbindungstest prüft den Ausschluss,
bevor eine Synchronisierung Daten des Arbeitsbereichs anfassen kann. Weder eine Listing-API noch ein unbegrenztes
Auflisten von Verzeichnissen ist nötig.

Verschlüsselte Blöcke und ein unveränderlicher Snapshot werden geschrieben, bevor `v2/head.bin`
veröffentlicht wird. Der lokale Ausgangsstand rückt erst vor, wenn die Veröffentlichung gelungen ist.
Wiederholungen nutzen fertige Blöcke erneut, auch nach einem Neustart: Blöcke, die eine angehaltene Synchronisierung
gespeichert hat, werden lokal gemerkt und nicht erneut geprüft, solange kein anderes
Gerät inzwischen veröffentlicht hat. Ein Abbruch hält nach der laufenden Netzwerkanfrage
an und gibt die Sperre nach Möglichkeit frei. Die Netzwerk-API von Textus begrenzt eine
Anfrage auf 60 Sekunden; einen Abbruch einzelner Anfragen bietet sie nicht.

Neue Binär-Downloads reservieren einen Pfad mit einer eindeutigen Markierung, die im lokalen
Speicher des Plugins festgehalten wird. Nach einem unterbrochenen Schreiben setzt die nächste Synchronisierung genau diese
Markierung fort, statt sie als Dateiinhalt hochzuladen. Ändert eine andere Anwendung
die Datei, bleibt ihr Inhalt erhalten. Behalten Sie die lokalen Daten des Plugins, wenn Sie es erneut versuchen.

Eine Sperre, die dieses Gerät hinterlassen hat, als Textus mitten in einer Synchronisierung geschlossen oder angehalten wurde, holt
sich seine nächste Synchronisierung ohne Nachfrage zurück. Eine laufende Synchronisierung erneuert alle 10 Sekunden eine Notiz zu ihrer
Sperre; die nächste Synchronisierung holt sich die Sperre zurück, sobald die Notiz 30
Sekunden alt ist, wartet den Rest ab, wenn sie früher beginnt, und lässt sie in Ruhe, wenn
die Notiz inzwischen erneuert wird (eine Synchronisierung, die noch in einem anderen Fenster läuft). Die Sperre eines anderen Geräts wird
nie übernommen: Nach einem Absturz dort entfernt **Wiederherstellung › Veraltete Sperre entfernen**
sie erst nach einer Bestätigung. Prüfen Sie vorher, dass alle anderen Geräte nicht mehr
synchronisieren. Sperren laufen in der Cloud nie ab, sodass ein langsames Gerät seine
Schreibberechtigung nicht verliert, nur weil ein Timer abgelaufen ist.

Was eine Synchronisierung in jeder Datei gefunden hat (Größe, Zeit, Hash), wird zwischen den Starts lokal
gespeichert, sodass die erste Synchronisierung nach einem Neustart nur die inzwischen geänderten Dateien
erneut liest. Werden die Beschreibung oder das aktuelle Manifest
versehentlich entfernt, hält ein bereits beigetretenes Gerät an. Stellen Sie ein vollständiges Backup der Cloud
mit der ursprünglichen Beschreibung wieder her. Verschlüsselte Snapshots sind an ihre eigenen
Objektnamen gebunden und können nicht direkt über `v2/head.bin` kopiert werden; um einen einzelnen
Snapshot wiederherzustellen, muss er entschlüsselt und für diesen logischen Schlüssel neu verschlüsselt werden. Eine Oberfläche
zum Wiederherstellen einzelner Snapshots gibt es derzeit nicht.
Ändern Sie die Dateien in der Cloud nicht, während eine Synchronisierung läuft.

## Umstieg vom Community-Plugin

Das offizielle Plugin ist `catvinci.cloud-sync`. Das frühere Community-Plugin,
`ciao1019.cloud-sync`, hat eigene lokale Einstellungen, Geheimnisse und einen eigenen Sync-Zustand.
Schließen Sie vor dem Wechsel jede unterbrochene Synchronisierung mit dem alten Plugin ab oder stellen Sie sie wieder her,
schalten Sie dann seine automatische Synchronisierung aus und deaktivieren Sie es. Behalten Sie ein Backup des Arbeitsbereichs.

Installieren Sie das offizielle Plugin und geben Sie dieselbe Speicherverbindung, genau denselben Cloud-
Ordner und dasselbe Sync-Passwort ein. Das verschlüsselte Format in der Cloud ist unverändert, daher lassen sich bestehende
Daten von v0.2/v0.3 lesen, ohne sie zu verschieben oder neu zu verschlüsseln. Lokale
Zugangsdaten, gemerkte Beschreibungen und Ausgangsstände werden nicht zwischen Plugin-IDs kopiert;
der erste Lauf tritt dem bestehenden Cloud-Ordner als neues Gerät bei und kann
Konfliktkopien behalten, wenn Dateien sich unterscheiden. Lassen Sie nie die automatische Synchronisierung beider Plugins auf
demselben Arbeitsbereich laufen. Unverschlüsselte Daten von v0.1 brauchen weiterhin das eigene Upgrade-Verfahren oben.

## Entwicklung und Danksagung

Quellcode, Protokolltests und Build-Anleitung liegen in
[development/cloud-sync](https://github.com/CatVinci-Studio/textus-plugins/tree/main/development/cloud-sync).
Der Katalog packt die lesbaren Dateien in `plugins/catvinci.cloud-sync/`,
ohne sie zu kompilieren. Releases folgen dem offiziellen Plugin-Ablauf dieses Repositorys,
mit einem Tag wie `catvinci.cloud-sync-v0.3.0`.

Ursprünglich von Ciao1019 entwickelt; die Oberfläche und die Verbesserungen bei der Einrichtung in 0.3.0
stammen von ChengAo Shen. Die MIT-Hinweise sind in `LICENSE`
und `THIRD_PARTY_NOTICES.md` erhalten. Das Speicherdesign wurde von `apps/api/internal/cloudsync/`
aus Petrichor/Sylva angeregt; weder Go-Quellcode noch das PostgreSQL-Backup-Format wurden kopiert.

## Änderungen

- **0.8.0** - Safer when a sync is cut short: a lock this device left (Textus closed or stopped mid-sync) is taken back by its next sync without asking; another device's lock still needs **Recover stale lock**. A sync that would delete many files from the cloud stops and asks first, and a folder where suddenly nothing is found is taken as unreadable, not emptied. A file the system Trash refuses no longer stops the whole sync: it stays in place and is tried again. The first sync after a restart reads only the files changed meanwhile, not the whole folder. Its page is in every language Textus speaks. Its page receives Textus's messages by the API's current name. Its pickers keep Textus's own height.
- **0.7.0** - Faster syncs with fewer requests: with nothing changed, a sync asks the service once instead of 8 to 16 times; a changed file's blocks are sent in one request each, without checking first or reading them back; on WebDAV folders are made only when one is missing. A busy service is waited for (up to a minute, shown in the status) instead of stopping the sync, and requests that got no answer are sent again. The progress counts files that are done. From Textus 1.4.4 the versions it keeps of a document show in Version History too.
- **0.6.1** - A big first sync that stops halfway (cancelled, offline, or slowed by the service) goes on where it stopped next time, instead of checking every file it already sent; on Nutstore that saves most of the requests.
- **0.6.0** - Sync settings rearranged: sync options sit at the top and apply as you pick them, with no Save button. **Sync interval**, **Sync delay**, and **Keep cloud history** are pickers. Files now go up and down several at a time: **Transfers at once** sets how many (S3 8, WebDAV 4, Nutstore 2 to start), and blocks the cloud already holds are no longer checked again. A connected service shows as a card with the account masked and **Test connection**, **Edit** and **Disconnect**; the encryption switch and password are part of the connection. **Test connection** works before saving, and names the missing permission (write, read or delete) when a check fails.
- **0.5.3** - One set of rules for every service: the automatic interval can be 1 to 1,440 minutes, and **After a save, wait** sets how long a sync waits after saving (Nutstore starts at 3 minutes, S3 and WebDAV at 0; WebDAV no longer waits 30 s).
- **0.5.2** - The plugin no longer caps its own requests: a first Nutstore sync of a folder with many files no longer stops at "The service request limit was reached".
- **0.5.1** - A sync interrupted after it wrote the history but before the new state no longer leaves versions in the history that were never synced. Trash and old versions age by the storage server's clock, so a device whose clock is wrong no longer drops what the others keep.
- **0.5.0** - Older versions stay in the cloud: right-click a file › **Cloud History…** to read and restore one, and **Plugins › Cloud History…** brings back deleted files. **Keep cloud history** sets 30, 90 or 365 days, or always, and old versions are cleaned up by themselves. End-to-end encryption is now a switch, off for new connections; connections set up before keep it. Also brings 0.4.7's changes. Needs Textus 1.4.1.
- **0.4.7** - A sync reads again only the files whose size or time changed since the last one, so syncing a big folder while you write takes far less work. Your own rules can leave out more files (written as in a `.gitignore`), the folder's `.gitignore` can count too, and Obsidian's shared settings can sync. A picture or other attachment changed on another device now replaces the one here instead of being kept twice. Needs Textus 1.4.1.
- **0.4.6** - Every language now has the whole page translated, not just a few lines. In a narrow panel the status and the connection hint keep a readable width and the buttons move to their own line.
- **0.4.5** - The sidebar keeps to the sync status and **Sync now**; **Connection settings…** there opens the plugin's own page, where the connection is set up. The sidebar page draws no title of its own, as the sidebar's other tabs. Needs Textus 1.3.13. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.4** - A Cloud Sync tab in the sidebar shows at a glance how sync stands - connected or not, the last sync, any error, which service and remote folder - with the whole connection form below; Settings shows the same page. The service is picked from a dropdown, and a long name, path or error wraps inside the page.
- **0.4.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.1** - Obsidian bases (`.base`) and canvases (`.canvas`) sync too.
- **0.4.0** - Deletions and renames reach your other devices (deleted files go to the system Trash there); automatic sync runs a few seconds after you save; the status bar shows how sync stands; syncs are paced to stay within WebDAV and Nutstore request limits.
- **0.3.1** - Nutstore: a remote folder that already exists no longer stops the sync.
- **0.3.0** - First official version: end-to-end encrypted sync through S3, WebDAV or Nutstore, with conflict copies when both sides changed a file.
