// The preview tab: the host sends the drawing (HTML its reader made from
// the document, no script of the document's in it) and the first problem
// MDX finds; while it doesn't read, the last good drawing stays.
(function () {
  "use strict";
  const api = acquireTextusApi();
  const page = document.getElementById("page");
  const problem = document.getElementById("problem");
  const empty = document.getElementById("empty");
  api.onDidReceiveMessage(function (message) {
    problem.hidden = !message.problem;
    problem.textContent = message.problem || "";
    empty.hidden = !!message.html || page.childElementCount > 0;
    empty.textContent = message.empty || "";
    if (message.html) page.innerHTML = message.html;
  });
  api.postMessage("ready");
})();
