(function () {
  "use strict";
  const api = acquireTextusApi();
  const t = api.t;
  const $ = (id) => document.getElementById(id);
  const md = window.kanbanMarkdown;
  const edit = window.kanbanEdit;
  $("add-list").textContent = t("addList");
  $("markdown").textContent = t("markdown");
  const asMarkdown = () => api.postMessage({ type: "markdown" });
  $("markdown").onclick = asMarkdown;
  // A narrow bar keeps Edit as Markdown in this menu (data-fit-steps).
  $("more").setAttribute("aria-label", t("more"));
  $("more").onclick = async () => {
    if ((await api.menu([{ label: t("markdown"), value: "markdown" }], $("more"))) === "markdown") asMarkdown();
  };

  let board = null;
  // Set while an edit waits out the save delay.
  let timer = 0;
  // What a deletion took, by the id its Undo comes back with.
  const taken = new Map();
  let takenId = 0;
  const cardLists = () => [...document.querySelectorAll(".cards")];
  const cardsOf = (ul) => [...ul.children].filter((n) => n.classList.contains("card"));

  function save() {
    $("state").textContent = t("saving");
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = 0;
      api.postMessage({ type: "save", text: md.serialize(board) });
    }, 300);
  }
  function changed() {
    render();
    save();
  }

  /** An inline field over `node`'s text; `done` gets the new text,
   *  `cancel` (else a redraw) runs when it is left empty or escaped. */
  function editInPlace(node, value, multiline, done, cancel) {
    const field = document.createElement(multiline ? "textarea" : "input");
    field.className = "tx-inline-input inline-field";
    field.value = value;
    node.replaceWith(field);
    field.focus();
    field.select();
    let finished = false;
    const finish = (keep) => {
      if (finished) return;
      finished = true;
      if (keep && field.value.trim()) done(field.value.trim());
      else if (cancel) cancel();
      else render();
    };
    window.inlineField(field, finish, multiline);
  }

  // A card's words with its [[wiki links]] as links to the notes they
  // name: a click on one opens the note, anywhere else edits the card.
  const cardText = (node, value) =>
    window.wikiLinks.draw(node, value, (name) => api.postMessage({ type: "openNote", name: name }));

  /** Gone at once, with Undo on the note that says so. */
  function deleted(what, token) {
    if (!token) return;
    changed();
    taken.set(++takenId, token);
    api.postMessage({ type: "deleted", what: what, id: takenId });
  }

  /** A ⋯ button, and a right-click on `node` outside a field, for `items`. */
  function withMenu(node, items, choose) {
    const b = document.createElement("button");
    b.className = "tx-icon-button more";
    const glyph = document.createElement("span");
    glyph.className = "tx-icon";
    glyph.dataset.icon = "more";
    b.append(glyph);
    b.setAttribute("aria-label", t("more"));
    b.onclick = async (e) => {
      e.stopPropagation();
      choose(await api.menu(items(), b));
    };
    node.addEventListener("contextmenu", async (e) => {
      if (e.target.closest("input, textarea, [contenteditable]")) return;
      e.preventDefault();
      choose(await api.menu(items(), { x: e.clientX, y: e.clientY }));
    });
    return b;
  }

  function cardNode(list, card) {
    const li = document.createElement("li");
    li.className = "tx-card card" + (card.done ? " done" : "");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.className = "ui-check";
    box.checked = card.done;
    box.setAttribute("aria-label", card.text);
    box.onchange = () => {
      card.done = box.checked;
      changed();
    };
    const text = document.createElement("span");
    text.className = "card-text";
    cardText(text, card.text);
    const editText = () =>
      editInPlace(text, card.text, true, (value) => {
        card.text = value;
        changed();
      });
    text.onclick = editText;
    const others = () => board.lists.filter((l) => l !== list);
    const menu = withMenu(
      li,
      () => [
        { label: t("edit"), value: "edit" },
        // Flat, not a submenu: a phone's menu shows no submenu's name.
        ...others().map((l) => ({ label: t("moveTo", l.title), value: "to:" + board.lists.indexOf(l) })),
        "separator",
        { label: t("delete"), value: "delete", danger: true },
      ],
      (choice) => {
        if (choice === "edit") editText();
        else if (choice === "delete") deleted("card", edit.removeCard(board, card));
        else if (/^to:\d+$/.test(choice || "") && edit.moveCard(board, card, board.lists[+choice.slice(3)])) changed();
      },
    );
    li.append(box, text, menu);
    // Dragged into a list, at the place it is let go; by touch, after a
    // hold, and at the screen's edge on a phone the board turns to the next
    // list. Held and let go without moving, it opens the card's menu.
    li.addEventListener("pointerdown", (e) => {
      if (e.target.closest("input, button, textarea, [contenteditable]")) return;
      drag.sortable(e, {
        item: li,
        lists: cardLists,
        itemsOf: cardsOf,
        held: () => menu.click(),
        onDrop: (ul, index) => {
          const to = board.lists[cardLists().indexOf(ul)];
          list.cards.splice(list.cards.indexOf(card), 1);
          to.cards.splice(index, 0, card);
          changed();
        },
      });
    });
    return li;
  }

  function listNode(list) {
    const section = document.createElement("section");
    section.className = "tx-lane list";
    const head = document.createElement("div");
    head.className = "tx-lane-head list-head";
    const title = document.createElement("span");
    title.className = "list-title";
    title.textContent = list.title;
    const rename = () =>
      editInPlace(title, list.title, false, (value) => {
        list.title = value.replace(/\n/g, " ");
        changed();
      });
    title.onclick = rename;
    const count = document.createElement("span");
    count.className = "list-count muted";
    count.textContent = String(list.cards.length);
    head.append(
      title,
      count,
      // Only an empty list goes: its cards are never lost with it.
      withMenu(
        head,
        () => [
          { label: t("rename"), value: "rename" },
          { label: t("delete"), value: "delete", danger: true, disabled: list.cards.length > 0 },
        ],
        (choice) => {
          if (choice === "rename") rename();
          if (choice === "delete" && !list.cards.length) deleted("list", edit.removeList(board, list));
        },
      ),
    );
    const cards = document.createElement("ul");
    cards.className = "cards";
    for (const card of list.cards) cards.append(cardNode(list, card));
    const add = document.createElement("button");
    add.className = "tx-button small add-card";
    const plus = document.createElement("span");
    plus.className = "tx-icon";
    plus.dataset.icon = "plus";
    add.append(plus, t("addCard"));
    add.onclick = () => {
      const card = { text: "", done: false };
      list.cards.push(card);
      render();
      const nodes = document.querySelectorAll(".list");
      const node = nodes[board.lists.indexOf(list)].querySelector(
        ".card:last-child .card-text",
      );
      editInPlace(
        node,
        "",
        true,
        (value) => {
          card.text = value;
          changed();
        },
        // Given up empty: no card.
        () => {
          list.cards.splice(list.cards.indexOf(card), 1);
          render();
        },
      );
    };
    section.append(head, cards, add);
    return section;
  }

  // A list moves by its head, the others making way; not while its title
  // is being written.
  window.textus.drag.reorder($("board"), {
    items: ".list",
    handle: ".list-head:not(:has(input, textarea, [contenteditable]))",
    axis: "x",
    onDrop: (from, to) => {
      board.lists.splice(to, 0, board.lists.splice(from, 1)[0]);
      changed();
    },
  });

  function render() {
    const root = $("board");
    root.textContent = "";
    for (const list of board.lists) root.append(listNode(list));
  }

  // A new list is named at once; left as it is, it keeps "New list".
  $("add-list").onclick = () => {
    const list = { title: t("newList"), cards: [] };
    board.lists.push(list);
    changed();
    const titles = document.querySelectorAll(".list-title");
    const title = titles[titles.length - 1];
    title.scrollIntoView({ inline: "nearest", block: "nearest" });
    editInPlace(title, list.title, false, (value) => {
      list.title = value.replace(/\n/g, " ");
      changed();
    });
  };

  api.onMessage((message) => {
    if (message.type === "file") {
      // Changed elsewhere: what is there now wins over an unsaved move.
      const dropped = timer !== 0;
      clearTimeout(timer);
      timer = 0;
      board = md.parse(message.text);
      taken.clear();
      render();
      $("state").textContent =
        message.refused || dropped ? t("changedElsewhere") : "";
    }
    if (message.type === "undo" && edit.restore(board, taken.get(message.id))) {
      taken.delete(message.id);
      changed();
    }
    if (message.type === "saved") $("state").textContent = t("saved");
    if (message.type === "error") $("state").textContent = message.message;
  });
  api.postMessage({ type: "ready" });
})();
