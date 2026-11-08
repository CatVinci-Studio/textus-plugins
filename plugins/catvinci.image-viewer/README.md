# Image Viewer

Opens pictures and SVG files in a tab, where you can zoom, turn them and read an SVG's source.

## Viewing a picture

- Open a PNG, JPEG, GIF, WebP, AVIF, BMP, ICO or SVG file from the sidebar, or drag one into the window. It opens in a tab of its own, fitted to the tab.
- The bar shows the picture's size in pixels and the file's size.
- Zoom with the **−** and **+** buttons or **Ctrl+scroll** (**⌘+scroll** on a Mac). Click the percentage to switch between fitting the picture and its actual size.
- Zoomed in, drag the picture to look around. Double-click to switch between fitting it and its actual size at the place you clicked.
- The **Rotate** button turns it a quarter at a time. Only the view turns; the file stays as it is.
- Keys: **+** and **-** zoom, **0** is the actual size, **F** fits it, **R** turns it.
- For an SVG, **Source** shows its markup to read or copy, and **Picture** goes back. An SVG is shown as a picture, so its scripts never run.
- A file that is missing or isn't a picture says so instead of showing an empty tab.

## Permissions

It asks for none. It only reads the file you open, on the desktop and on iOS.

## Changes

- **0.2.0** - Textus's own buttons and tab bar; labels follow the interface language when it changes
- **0.1.3** - colors from Textus 1.3's themes
- **0.1.2** - the percentage switches between fit and actual size
- **0.1.0-0.1.1** - first versions: zoom, fit, drag, rotate, keys, an SVG's source, and a message for a file that can't be opened
