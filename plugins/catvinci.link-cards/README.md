# Link Cards

Shows a link as a card with its page's title, description and picture, or plays a YouTube or Bilibili video in place.

## Making a card

- Type `/` and choose **Insert Link Card…**, then paste a link. Or select a link in the text, right-click it and choose **Insert Link Card…** to turn it into a card.
- The card shows the page's title, description, picture and site name. Click it to open the page in your browser.
- A YouTube or Bilibili link plays its video in the card instead.
- If the page can't be read (offline, or not a web page), the card holds the address alone.

## What is saved

The card is a `card` block holding what the page said, so it shows without the network and reads as text in any Markdown app:

````markdown
```card
url: https://textus.md
title: Textus
description: A Markdown editor with AI that writes with you.
image: https://textus.md/og.png
```
````

- **Fetch again** under a card brings the page's latest title and picture.
- Cards from Obsidian show too: the `cardlink` blocks of Auto Card Link and the `embed` blocks of Link Embed are drawn as cards, and left as they are written.

## Permissions

- **Network, any address**: to read the pages you make cards of. It fetches only those links.
- **Read and edit the document**: to read the selected link and insert the card.
- **Tools for Textus AI**: so Textus AI can make a card for a link.

It runs on the desktop and on iOS.

## Changes

- **0.4.0** - Obsidian's `cardlink` (Auto Card Link) and `embed` (Link Embed) blocks are drawn as cards
- **0.3.1** - the README's example links to textus.md
- **0.3.0** - a tool for Textus AI, `fetch_link_card`
- **0.2.0** - Textus's own buttons and colors (Textus 1.3.2)
- **0.1.0-0.1.1** - first versions: link cards kept in a `card` block, video players, **Fetch again**

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `fetch_link_card`: Fetches a web page's title, description, picture and site name, and returns them with a ```card block that shows the link as a card - to insert where the user wants it.
<!-- /ai-tools -->
