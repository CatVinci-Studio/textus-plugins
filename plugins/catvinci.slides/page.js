// The deck the host renders, one slide at a time: ← → Space or the pager
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
  document.getElementById("prev").setAttribute("aria-label", t("previous"));
  document.getElementById("next").setAttribute("aria-label", t("next"));

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
  // Where the frame may not go full screen, the tab presents in place.
  function present() {
    const root = document.documentElement;
    if (document.fullscreenElement) return void document.exitFullscreen().catch(() => {});
    if (root.classList.contains("presenting")) return void root.classList.remove("presenting");
    const inPlace = () => root.classList.add("presenting");
    if (!document.fullscreenEnabled || !root.requestFullscreen) return inPlace();
    Promise.resolve(root.requestFullscreen()).catch(inPlace);
  }
  document.getElementById("full").onclick = present;
  addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "Escape" && document.documentElement.classList.contains("presenting")) present();
    else if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) show(index + 1);
    else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) show(index - 1);
    else if (e.key === "f") present();
    else return;
    e.preventDefault();
  });
  api.postMessage("ready");
})();
