// An inline field's keys and blur, for every plugin page that edits text in
// place: Enter keeps (in a multiline field ⌘/Ctrl+Enter), Esc drops, leaving
// keeps. An input method's Enter picks its words and doesn't end the edit,
// and the blur while Textus's text menu is open over it (data-menu-open)
// doesn't either. Each plugin using it lists this as lib/inline-field.js.
(function (root) {
  "use strict";

  /** Calls `finish(true)` to keep, `finish(false)` to drop. */
  function inlineField(field, finish, multiline) {
    field.addEventListener("keydown", function (e) {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === "Escape") finish(false);
      if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        finish(true);
      }
    });
    field.addEventListener("blur", function () {
      if (!field.hasAttribute("data-menu-open")) finish(true);
    });
  }

  root.inlineField = inlineField;
})(globalThis);
