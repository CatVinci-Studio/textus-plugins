# WakaTime

Sends the time you spend writing in Textus to your [WakaTime](https://wakatime.com) account, so it shows on your dashboard beside your coding.

1. Copy your API key from [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key).
2. Run **WakaTime: Set API Key…** from the command palette and paste it. The key is kept in Textus's secret storage.

The command palette also has **WakaTime: Today's Writing Time**, which shows today's total as WakaTime counts it, and **WakaTime: Open Dashboard**.

## What counts and what is sent

- Only your own work in a Textus window in front counts: typing, moving the caret, switching documents and saving. Time with Textus in the background, and changes made on disk or by a plugin, don't count. Writing done with Textus AI counts as AI coding.
- For each moment of work it tells WakaTime the document's path, the language (Markdown), the number of lines, the project and the Git branch. The project is the first line of a `.wakatime-project` file in the open folder, else the open folder's name.
- It sends at most once every two minutes for the same document, and always on a save, as WakaTime's own plugins do.
- Offline, the time waits in a queue and goes later, in batches.
- Nothing is sent before the key is set, and an unsaved document is never sent. To stop, set the key to nothing.

It works on desktop and iPhone and needs Textus 1.3.0 or later. It asks to read the editor and the open folder's files (for the document, its lines, `.wakatime-project` and `.git/HEAD`) and to reach `api.wakatime.com`, and nothing else on the network.

## Changes

- **0.2.4** - Leaving the key empty now really turns it off; a garbled reply to Today's Writing Time shows the usual message.
- **0.2.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.2** - Finds `.wakatime-project` and the Git branch the same way on every system.
- **0.2.1** - Says where it runs: desktop and iPhone.
- **0.2.0** - Only your own work in a window in front counts; an offline queue sent in batches; project, branch and lines; Today's Writing Time.
- **0.1.0** - First version: writing time in Textus on your WakaTime dashboard.
