# WakaTime

Sends the time you spend writing in Textus to your [WakaTime](https://wakatime.com) account, so it shows on your dashboard beside your coding.

1. Copy your API key from [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key).
2. Run **WakaTime: Set API Key…** from the command palette and paste it.

While you write, it tells WakaTime which document you are in (its path), the open folder's name as the project, and when you save - at most once every two minutes for the same document, as WakaTime's own plugins do. Nothing is sent before the key is set, and an unsaved document is never sent. To stop, set the key to nothing.
