// What the board's menus do to it: move a card to another list, take a card
// or a list away and put it back on Undo. A board read again from the file
// meanwhile is another board, and Undo leaves it alone.
(function (root) {
  "use strict";

  function moveCard(board, card, to) {
    const from = board.lists.find((l) => l.cards.includes(card));
    if (!from || !to || from === to) return false;
    from.cards.splice(from.cards.indexOf(card), 1);
    to.cards.push(card);
    return true;
  }

  /** Takes `card` away; what `restore` needs to put it back. */
  function removeCard(board, card) {
    const list = board.lists.find((l) => l.cards.includes(card));
    if (!list) return null;
    const index = list.cards.indexOf(card);
    list.cards.splice(index, 1);
    return { board: board, list: list, card: card, index: index };
  }

  function removeList(board, list) {
    const index = board.lists.indexOf(list);
    if (index < 0) return null;
    board.lists.splice(index, 1);
    return { board: board, list: list, index: index };
  }

  /** Puts back what was taken, where it was; false when `board` isn't the
   *  one it was taken from, or its list is gone. */
  function restore(board, taken) {
    if (!taken || taken.board !== board) return false;
    if (!taken.card) {
      board.lists.splice(Math.min(taken.index, board.lists.length), 0, taken.list);
      return true;
    }
    if (!board.lists.includes(taken.list)) return false;
    taken.list.cards.splice(Math.min(taken.index, taken.list.cards.length), 0, taken.card);
    return true;
  }

  root.kanbanEdit = { moveCard: moveCard, removeCard: removeCard, removeList: removeList, restore: restore };
})(typeof window !== "undefined" ? window : globalThis);
