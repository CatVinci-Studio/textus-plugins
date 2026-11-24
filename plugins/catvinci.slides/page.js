// The deck the host renders, one slide at a time: ← → Space or the pager
// to move, F or the button for full screen. The slide shown stays when
// the writing changes it. Presenting, a tap or a swipe moves too, and a
// touch or a move shows a button to stop.
(function () {
  "use strict";
  const api = acquireTextusApi();
  const t = api.t;
  const nav = window.slidesPresent;
  const root = document.documentElement;
  const stage = document.getElementById("stage");
  const count = document.getElementById("count");
  const more = document.getElementById("more");
  let index = Number((api.getState() || {}).index) || 0;
  document.getElementById("export").textContent = t("export");
  document.getElementById("full").textContent = t("fullScreen");
  document.getElementById("exit-label").textContent = t("exit");
  document.getElementById("prev").setAttribute("aria-label", t("previous"));
  document.getElementById("next").setAttribute("aria-label", t("next"));
  more.setAttribute("aria-label", t("more"));

  const slides = () => [...stage.querySelectorAll("div.marpit > svg")];
  function show(n) {
    const all = slides();
    index = Math.max(0, Math.min(all.length - 1, n));
    all.forEach((s, i) => s.classList.toggle("on", i === index));
    count.textContent = all.length ? index + 1 + " / " + all.length : "";
    api.setState({ index: index });
  }

  api.onDidReceiveMessage(function (deck) {
    document.getElementById("deck").textContent = deck.css;
    stage.innerHTML = deck.html;
    // No document to show: where to click, in place of the slide.
    if (!deck.html) {
      const hint = stage.appendChild(document.createElement("p"));
      hint.className = "tx-empty";
      hint.textContent = t("empty");
    }
    show(index);
  });
  document.getElementById("prev").onclick = () => show(index - 1);
  document.getElementById("next").onclick = () => show(index + 1);
  const exportHtml = () => api.postMessage("export");
  document.getElementById("export").onclick = exportHtml;
  // A narrow bar keeps Save HTML in this menu (data-fit-steps).
  more.onclick = async () => {
    if ((await api.menu([{ label: t("export"), value: "export" }], more)) === "export") exportHtml();
  };

  const presenting = () => !!document.fullscreenElement || root.classList.contains("presenting");
  let hiding = 0;
  function reveal() {
    root.classList.add("controls");
    clearTimeout(hiding);
    hiding = setTimeout(() => root.classList.remove("controls"), nav.REVEAL_MS);
  }
  // Where the frame may not go full screen, the tab presents in place.
  function present() {
    if (document.fullscreenElement) return void document.exitFullscreen().catch(() => {});
    if (root.classList.contains("presenting")) return void root.classList.remove("presenting", "controls");
    const inPlace = () => {
      root.classList.add("presenting");
      reveal();
    };
    if (!document.fullscreenEnabled || !root.requestFullscreen) return inPlace();
    Promise.resolve(root.requestFullscreen()).then(reveal, inPlace);
  }
  document.getElementById("full").onclick = present;
  document.getElementById("exit").onclick = present;
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) root.classList.remove("controls");
  });

  let press = null;
  let swiped = false;
  stage.addEventListener("pointerdown", (e) => {
    press = { x: e.clientX, y: e.clientY };
    swiped = false;
    if (presenting()) reveal();
  });
  stage.addEventListener("pointermove", (e) => {
    if (e.pointerType === "mouse" && presenting()) reveal();
  });
  stage.addEventListener("pointerup", (e) => {
    const step = press && presenting() ? nav.swipe(e.clientX - press.x, e.clientY - press.y) : 0;
    press = null;
    if (!step) return;
    swiped = true;
    show(index + step);
  });
  stage.addEventListener("click", (e) => {
    if (swiped || !presenting()) return;
    const box = stage.getBoundingClientRect();
    show(index + nav.tap(e.clientX - box.left, box.width));
  });

  addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "Escape" && root.classList.contains("presenting")) present();
    else if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) show(index + 1);
    else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) show(index - 1);
    else if (e.key === "f") present();
    else return;
    e.preventDefault();
  });
  api.postMessage("ready");
})();
