# Tags

Listet jeden `#tag` im geöffneten Ordner in der Seitenleiste auf, mit der Zahl der Notizen, die ihn nutzen.

- Der Tab **Tags** listet die Tags, die meistgenutzten zuerst. Verschachtelte Tags (`#project/alpha`) bilden einen Baum, wie in Obsidian, und die Zahl eines Tags umfasst die Notizen der Tags darunter. Tippen Sie ins Filterfeld, um die Liste einzugrenzen.
- Öffnen Sie einen Tag, um seine Notizen zu sehen, und klicken Sie auf eine, um sie zu öffnen.
- Klicken Sie mit der rechten Maustaste auf einen Tag und wählen Sie **Umbenennen…**, um ihn in jeder Notiz umzubenennen, samt den darin verschachtelten Tags (aus `#project/alpha` wird `#new/alpha`). Groß- und Kleinschreibung spielt keine Rolle. Benennen Sie ihn wie einen Tag, den Sie schon haben, werden beide zu einem. Ein Tag besteht aus Buchstaben, Ziffern, `_`, `-` und `/`, und nicht nur aus Ziffern.
- Tags im Front Matter (`tags: [a, b]` oder eine Liste unter `tags:`) werden ebenfalls umbenannt. Code, Inline-Code, Linkadressen und längere Tags mit demselben Anfang (`#drafts`, wenn Sie `#draft` umbenennen) bleiben, wie sie sind.

## Berechtigungen

- Dateien lesen: um die Tags im Ordner zu finden.
- Dateien schreiben: um einen Tag in den Notizen umzubenennen, die ihn haben.
- Werkzeuge für Textus AI: damit Textus AI Ihre Tags und die Notizen mit einem Tag auflisten kann.

## Änderungen

- **0.3.7** - Its page is in every language Textus speaks.
- **0.3.6** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Renaming leaves `[[#Heading]]` links alone, and a ``` line inside a `~~~` block no longer ends the code.
- **0.3.3** - Tags match in any letter case, as their counts do; renaming a tag moves its nested tags too and no longer touches link addresses or front-matter tags like `project-x`; tags like `a/` or `a//b` are refused.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Tags used equally often are listed in natural name order ("Week2" before "Week10").
- **0.3.0** - Nested tags form a tree, each counting the notes of the tags under it; Textus AI finds a tag's nested tags too.
- **0.2.0** - Textus AI can list your tags and the notes with a tag (`list_tags`, `notes_with_tag`).
- **0.1.0-0.1.1** - First versions: tags with their counts, a tag's notes, renaming and merging in every note; runs on desktop and iOS.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_tags`: Listet jeden #Tag in den Dokumenten des geöffneten Ordners auf, mit der Zahl der Dokumente, die ihn nutzen, den häufigsten zuerst.
- `notes_with_tag`: Listet die Dokumente im geöffneten Ordner mit einem #Tag auf, jedes mit Titel, Pfad und Tags.
<!-- /ai-tools -->
