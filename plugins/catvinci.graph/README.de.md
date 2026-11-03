# Graphansicht

Deine Notizen und die Links zwischen ihnen als Graph.

- **Strg+Alt+G** (**⌘⌥G** auf dem Mac) oder **Plugins › Graphansicht öffnen** zeigt den ganzen Ordner in einem Tab.
- Der Tab **Graph** in der Seitenleiste zeigt die Notizen rund um das geöffnete Dokument.
- [[Wiki-Links]] und Links auf andere Dokumente zählen. Klicke auf eine Notiz, um sie zu öffnen (mit Strg oder ⌘ in einem neuen Tab); ziehen verschiebt, das Mausrad zoomt.
- Die Schieberegler-Taste oben öffnet die Einstellungen des Graphen:
  - **Filter**: Suche (`path:Ideen`, `file:Entwurf`, `tag:#todo`, ein `-` zum Ausschließen), Tags als Knoten, noch nicht angelegte Notizen, Notizen ohne Links. Der Graph der Seitenleiste legt außerdem fest, wie weit er reicht.
  - **Gruppen**: färbe die Notizen, die eine Suche findet.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_neighbours`: Die Umgebung eines Dokuments im Notizgraphen - des vorderen, wenn kein Pfad angegeben ist: die Notizen wenige Links entfernt, in beide Richtungen, jede mit ihrem Abstand, und die Links zwischen ihnen. Ein [[Link]] ins Leere hat die Art missing.
<!-- /ai-tools -->
