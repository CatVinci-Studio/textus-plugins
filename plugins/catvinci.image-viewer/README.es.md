# Visor de imágenes

Abre imágenes y archivos SVG en una pestaña, donde puedes ampliarlos, girarlos y leer el código de un SVG.

## Ver una imagen

- Abre un archivo PNG, JPEG, GIF, WebP, AVIF, BMP, ICO o SVG desde la barra lateral, o arrástralo a la ventana. Se abre en su propia pestaña, ajustado a ella.
- La barra muestra las dimensiones de la imagen en píxeles y el tamaño del archivo.
- Amplía con los botones **−** y **+** o con **Ctrl+rueda** (**⌘+rueda** en Mac). Haz clic en el porcentaje para pasar de ajustada a su tamaño real y al revés.
- Con la imagen ampliada, arrástrala para recorrerla. Un doble clic pasa de ajustada a su tamaño real, en el punto donde hiciste clic, y al revés.
- El botón **Girar** la gira un cuarto de vuelta cada vez. Solo gira la vista; el archivo no se toca.
- Teclas: **+** y **-** hacen zoom, **0** muestra el tamaño real, **F** la ajusta y **R** la gira.
- En un SVG, **Código** muestra su marcado para leerlo o copiarlo, e **Imagen** vuelve atrás. El SVG se muestra como imagen, así que sus scripts nunca se ejecutan.
- Si el archivo falta o no es una imagen, lo dice en lugar de mostrar una pestaña vacía.

## Permisos

No pide ninguno. Solo lee el archivo que abres.

## Cambios

- **0.2.6** - Its page no longer says which devices it runs on: the store shows that.
- **0.2.5** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.2.4** - A turned and zoomed picture now scrolls to every edge, and a sideways picture fits the window. Zoom and turn are kept when the panel moves, a fourth turn no longer spins back, and the bar fits a narrow panel.
- **0.2.3** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the picture, not the document behind it. Its bar keeps Textus's one order: what it shows, then find and zoom.
- **0.2.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - Textus's own buttons and tab bar; labels follow the interface language when it changes
- **0.1.3** - colors from Textus 1.3's themes
- **0.1.2** - the percentage switches between fit and actual size
- **0.1.0-0.1.1** - first versions: zoom, fit, drag, rotate, keys, an SVG's source, and a message for a file that can't be opened
