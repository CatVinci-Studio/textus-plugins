# Link-Karten

Zeigt einen Link als Karte mit Titel, Beschreibung und Bild seiner Seite, oder spielt ein Bilibili-Video an Ort und Stelle ab.

## Eine Karte anlegen

- Tippen Sie `/`, wählen Sie **Link-Karte einfügen …** und fügen Sie einen Link ein. Oder markieren Sie einen Link im Text, klicken Sie mit der rechten Maustaste darauf und wählen Sie **Link-Karte einfügen …**, um ihn zur Karte zu machen.
- Die Karte zeigt Titel, Beschreibung, Bild und Namen der Website. Ein Klick öffnet die Seite im Browser.
- Ein Bilibili-Link spielt stattdessen sein Video in der Karte ab. Ein YouTube-Link erscheint als Karte mit einem Standbild des Videos und öffnet sich im Browser.
- Lässt sich die Seite nicht lesen (offline, oder keine Webseite), enthält die Karte nur die Adresse.

## Was gespeichert wird

Die Karte ist ein `card`-Block mit dem, was die Seite angegeben hat, so erscheint sie auch ohne Netzwerk und liest sich in jeder Markdown-App als Text:

````markdown
```card
url: https://textus.md
title: Textus
description: A Markdown editor with AI that writes with you.
image: https://textus.md/og.png
```
````

- **Neu laden** im Rechtsklickmenü einer Karte holt den neuesten Titel und das neueste Bild der Seite.
- Karten aus Obsidian erscheinen ebenfalls: Die `cardlink`-Blöcke von Auto Card Link und die `embed`-Blöcke von Link Embed werden als Karten gezeigt und bleiben, wie sie geschrieben sind.

## Berechtigungen

- **Netzwerk, jede Adresse**: um die Seiten zu lesen, aus denen Sie Karten machen. Es ruft nur diese Links ab.
- **Dokument lesen und bearbeiten**: um den markierten Link zu lesen und die Karte einzufügen.
- **Werkzeuge für Textus AI**: damit Textus AI eine Karte für einen Link anlegen kann.

## Änderungen

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it.
- **0.5.0** - Right-click a selected web address for Turn into a Link Card; the item no longer shows for other selections. Needs Textus 1.4.4.
- **0.4.3** - Pictures and site icons show again; titles with an apostrophe are kept whole; **Fetch again** moved into the card's right-click menu; YouTube links show as cards with the video's still.
- **0.4.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - Obsidian's `cardlink` (Auto Card Link) and `embed` (Link Embed) blocks are drawn as cards
- **0.3.1** - the README's example links to textus.md
- **0.3.0** - a tool for Textus AI, `fetch_link_card`
- **0.2.0** - Textus's own buttons and colors (Textus 1.3.2)
- **0.1.0-0.1.1** - first versions: link cards kept in a `card` block, video players, **Fetch again**

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `fetch_link_card`: Holt Titel, Beschreibung, Bild und Seitennamen einer Webseite und gibt sie mit einem ```card-Block zurück, der den Link als Karte zeigt - zum Einfügen, wo der Nutzer ihn will.
<!-- /ai-tools -->
