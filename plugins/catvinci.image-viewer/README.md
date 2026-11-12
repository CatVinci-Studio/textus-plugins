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

- **0.2.4** - A turned and zoomed picture now scrolls to every edge, and a sideways picture fits the window. Zoom and turn are kept when the panel moves, a fourth turn no longer spins back, and the bar fits a narrow panel.
- **0.2.3** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the picture, not the document behind it. Its bar keeps Textus's one order: what it shows, then find and zoom.
- **0.2.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - Textus's own buttons and tab bar; labels follow the interface language when it changes
- **0.1.3** - colors from Textus 1.3's themes
- **0.1.2** - the percentage switches between fit and actual size
- **0.1.0-0.1.1** - first versions: zoom, fit, drag, rotate, keys, an SVG's source, and a message for a file that can't be opened
