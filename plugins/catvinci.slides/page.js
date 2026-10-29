// The deck the host renders, one slide at a time: ← → Space and a click
// to move, F or the button for full screen. The slide shown stays when
// the writing changes it.
(function () {
  "use strict";
  const api = acquireTextusApi();
  const t = api.t;
  const stage = document.getElementById("stage");
  const count = document.getElementById("count");
  let index = Number((api.getState() || {}).index) || 0;
  document.getElementById("export").textContent = t("export");
  document.getElementById("full").textContent = t("fullScreen");

  const slides = () => [...stage.querySelectorAll("div.marpit > svg")];
  function show(n) {
    const all = slides();
    index = Math.max(0, Math.min(all.length - 1, n));
    all.forEach((s, i) => s.classList.toggle("on", i === index));
    count.textContent = all.length ? index + 1 + " / " + all.length : t("empty");
    api.setState({ index: index });
  }

  api.onMessage(function (deck) {
    document.getElementById("deck").textContent = deck.css;
    stage.innerHTML = deck.html;
    show(index);
  });
  document.getElementById("prev").onclick = () => show(index - 1);
  document.getElementById("next").onclick = () => show(index + 1);
  document.getElementById("export").onclick = () => api.postMessage("export");
  document.getElementById("full").onclick = () => document.documentElement.requestFullscreen();
  addEventListener("keydown", function (e) {
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) show(index + 1);
    else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) show(index - 1);
    else if (e.key === "f") document.documentElement.requestFullscreen();
    else return;
    e.preventDefault();
  });
  api.postMessage("ready");
})();
