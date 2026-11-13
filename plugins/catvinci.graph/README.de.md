# Graphansicht

Zeichnet Ihre Notizen und die Links zwischen ihnen als Graph, für den ganzen Ordner oder rund um das geöffnete Dokument.

- **Strg+Alt+G** (**⌘⌥G** auf dem Mac) oder **Plugins › Graphansicht öffnen** zeigt den ganzen Ordner in einem Tab. **Einpassen** holt alles ins Bild.
- Der Reiter **Graph** in der Seitenleiste zeigt die Notizen rund um das geöffnete Dokument. Die Schaltfläche oben im Graph-Bereich der Seitenleiste öffnet den ganzen Ordner.
- [[Wiki-Links]] und Links auf andere Dokumente zählen beide; zwei Notizen, die aufeinander verlinken, teilen sich eine Linie. Ein [[Link]] auf eine noch nicht geschriebene Notiz erscheint als eigene Notiz.
- Ein Klick öffnet eine Notiz. Ziehen Sie eine Notiz, um sie zu platzieren, den Hintergrund, um sich zu bewegen, und zoomen Sie mit dem Mausrad oder per Zwei-Finger-Geste. Zeigen Sie auf eine Notiz, um ihre Links hervorzuheben.
- Der Graph passt sich selbst an: Namen erscheinen beim Hineinzoomen, Pfeile zeigen die Richtung der Links, wenn es wenige genug sind, und Notizen mit mehr Links sind größer. Ohne Farbgruppen bekommt jede Notiz die Farbe ihres Ordners.
- Ändern sich Dokumente im Ordner, wird der Graph neu gezeichnet.

## Einstellungen

Die Schieberegler-Schaltfläche oben im ganzen Graphen öffnet seine Einstellungen; der Graph in der Seitenleiste hat keine.

- **Filter**: eine Suche (`path:ideas`, `file:draft`, `tag:#todo`, ein `-` davor schließt aus); **Tags** zeigt #Tags als Knoten; **Nur vorhandene Dateien** blendet noch nicht geschriebene Notizen aus; **Verwaiste Notizen** (ganzer Graph) zeigt Notizen ohne Links.
- **Gruppen**: färben die Notizen, die eine Suche findet. **Neue Gruppe** fügt eine hinzu; **Standard wiederherstellen** nimmt Ihre Änderungen zurück.

In einem Obsidian-Vault färben auch die in Obsidians `graph.json` gespeicherten Farbgruppen die Notizen, nach Ihren eigenen.

## Berechtigungen

- Dateien und Dokument lesen: um die Notizen und Links des Ordners und Obsidians `graph.json` zu finden.
- Werkzeuge für Textus AI: damit Textus AI die Notizen rund um ein Dokument sehen kann.

## Änderungen

- **0.5.6** - Zahlen und Schaltflächen oben im Graph-Tab bleiben sichtbar: Scrollen oder Zoomen über dem Graphen schiebt sie nicht mehr nach oben unter den Tab. Beschriftungen stapeln sich nicht mehr: Die am stärksten verlinkten Notizen behalten ihre, die übrigen erscheinen beim Hineinzoomen. Ein großer Ordner öffnet sich bereits angeordnet, statt sich zu entfalten, und Bilder und andere Anhänge, auf die eine Notiz verlinkt, bleiben außerhalb des Graphen, bis du in den Einstellungen Anhänge einschaltest. Beim Wechsel des Dokuments oder beim Speichern gerät nicht mehr der ganze Graph in Bewegung.
- **0.5.5** - Normale Markdown-Links auf noch nicht geschriebene Notizen landen dort, wo Textus sie anlegt, und fallen mit [[Links]] auf dieselbe Notiz zusammen. Strg/Cmd-Klick öffnet eine Notiz neben der vorderen. Beschriftungen folgen der Textgröße der Oberfläche, Ordnerfarben dem Theme. Der Graph in der Seitenleiste hat keine eigenen Einstellungen mehr.
- **0.5.4** - Ein Trackpad-Pinch zoomt fließend, im Takt der Geste; mit Textus 1.3.13 zoomt ein Pinch auf dem Mac den Graphen, nicht das Dokument dahinter. Kürzere Hilfe- und Leertexte. Seitenleiste und Seite folgen dem Layout von Textus 1.3.13.
- **0.5.3** - Leisten, Listen und Steuerelemente sind jetzt die von Textus, wachsen mit der Oberfläche und folgen jedem Theme; braucht Textus 1.3.12.
- **0.5.2** - Obsidians Farbgruppen kommen aus dem nächstgelegenen Vault, auch wenn er über dem geöffneten Ordner liegt. Benötigt Textus 1.3.10.
- **0.5.1** - In einem Obsidian-Vault färben auch die Farbgruppen aus `.obsidian/graph.json` die Notizen.
- **0.5.0** - [[Links]] werden Notizen so zugeordnet wie beim Anklicken in Textus.
- **0.4.0** - Textus AI kann die Notizen rund um ein Dokument sehen (`list_neighbours`).
- **0.3.0** - Textus' eigene Bedienelemente und Menüs; Farben aus dem Theme.
- **0.2.0-0.2.1** - Ein Einstellungsfeld mit Filtern, Suche und Farbgruppen; Tags als Knoten; Pfeile für die Linkrichtung; Tiefe des Seitenleisten-Graphen.
- **0.1.0-0.1.1** - Erste Versionen: der ganze Ordner in einem Tab und die Notizen rund um das geöffnete Dokument in der Seitenleiste, nach Ordner gefärbt, flüssig auch mit Tausenden Notizen.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_neighbours`: Die Umgebung eines Dokuments im Notizgraphen - des vorderen, wenn kein Pfad angegeben ist: die Notizen wenige Links entfernt, in beide Richtungen, jede mit ihrem Abstand, und die Links zwischen ihnen. Ein [[Link]] ins Leere hat die Art missing.
<!-- /ai-tools -->
