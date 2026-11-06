# Image Folder per Document

Keeps each document's pictures beside it, in a folder named after it, as Typora and VS Code do: the pictures of `Note.md` go in `Note.assets/`.

- Paste or drop a picture into a saved document: Textus saves it, then this plugin moves it into the document's folder and changes the link to `Note.assets/picture.png`. A name already there gets a number; nothing is written over.
- Rename a document in its folder and its picture folder is renamed with it, links included - unless another document links into that folder too, in which case both stay as they are.
- Pictures already in your documents are left where they are.
