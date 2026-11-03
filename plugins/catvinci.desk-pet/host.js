// Desk Pet: a chibi companion in a floating view. Textus-chan, or the
// LLM-chan of the model Textus AI is using while it works; she writes as you
// type, daydreams and dozes when you stop, is pleased when you save, leans
// in when Textus AI is at work and sleeps while Textus is away. She hears
// only that something happened - never a word of the document or the chat.

const t = (key, ...args) => textus.l10n.t(key, ...args);
const VIEW = "catvinci.desk-pet.pet";
const POSES = [
  "writing",
  "daydream",
  "dozing",
  "happy",
  "surprised",
  "curious",
  "celebrate",
  "asleep",
];
const CHARACTERS = [
  "textus",
  "claude",
  "gpt",
  "gemini",
  "deepseek",
  "kimi",
  "qwen",
  "doubao",
  "glm",
  "minimax",
  "grok",
  "wenxin",
];
/** The service Textus AI uses, to the LLM-chan who comes with it. */
const BY_PROVIDER = {
  openai: "gpt",
  "openai-codex": "gpt",
  chatgpt: "gpt",
  anthropic: "claude",
  claude: "claude",
  google: "gemini",
  gemini: "gemini",
  vertex: "gemini",
  deepseek: "deepseek",
  moonshot: "kimi",
  kimi: "kimi",
  zhipu: "glm",
  qwen: "qwen",
  dashscope: "qwen",
  doubao: "doubao",
  volcengine: "doubao",
  minimax: "minimax",
  "minimax-intl": "minimax",
  xai: "grok",
};

/** After this long without typing she daydreams, then dozes. */
const DAYDREAM_MS = 60 * 1000;
const DOZE_MS = 4 * 60 * 1000;
/** A guest stays this long after Textus AI is done. */
const GUEST_MS = 90 * 1000;
/** Typing this long without a long pause, and she cheers you on. */
const FLOW_MS = 10 * 60 * 1000;

let webview = null;
let shownFor = null;
let pose = "daydream";
let guest = null;
let aiBusy = false;
let away = false;
let flowSince = null;
let lastTyped = 0;
const timers = {};
const said = {};

function later(name, ms, run) {
  clearTimeout(timers[name]);
  timers[name] = setTimeout(run, ms);
}

async function setting(key) {
  return textus.settings.get(key);
}

/** Who is out: the one chosen, else the guest of Textus AI's model while
 *  it works and a little after, else Textus-chan. */
async function who() {
  const chosen = await setting("character");
  if (chosen && chosen !== "auto" && CHARACTERS.includes(chosen)) return chosen;
  return guest || "textus";
}

function page(character) {
  const imgs = POSES.map(
    (name, i) =>
      `<img data-pose="${name}" alt="" src="textus-resource:pets/${character}/0${i + 1}-${name}.webp">`,
  ).join("");
  return `<!doctype html><html><head><style>
  body { margin: 0; height: 100vh; overflow: hidden; user-select: none; }
  .stage { position: absolute; inset: 22px 0 0; display: flex; align-items: flex-end; justify-content: center; }
  img { position: absolute; bottom: 0; max-width: 100%; max-height: 100%; opacity: 0; transform-origin: 50% 100%;
    transition: opacity var(--dur-fast) var(--ease-standard); pointer-events: none; }
  img.on { opacity: 1; animation: breathe 3.6s ease-in-out infinite; }
  img.hop { animation: hop 0.5s var(--ease-spring-bouncy, ease-out), breathe 3.6s ease-in-out 0.5s infinite; }
  @keyframes breathe { 0%, 100% { transform: scale(1, 1); } 50% { transform: scale(1.012, 1.02); } }
  @keyframes hop { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } }
  body.paused img { animation-play-state: paused; }
  .bubble { position: absolute; top: 24px; left: 50%; max-width: 92%; transform: translateX(-50%);
    padding: 4px 9px; border-radius: 12px; background: var(--ui-bg); color: var(--ui-text);
    box-shadow: var(--shadow-popover); font-size: 12px; line-height: 1.35; text-align: center;
    opacity: 0; transition: opacity var(--dur-normal, 0.2s) var(--ease-standard); pointer-events: none; }
  .bubble.on { opacity: 1; }
  @media (prefers-reduced-motion: reduce) { img.on, img.hop { animation: none; } }
</style></head><body>
<div class="stage">${imgs}</div><div class="bubble" id="bubble"></div>
<script>
  const api = acquireTextusApi();
  const bubble = document.getElementById("bubble");
  let hide = null;
  function show(name, hop) {
    for (const img of document.querySelectorAll("img")) {
      const on = img.dataset.pose === name;
      img.classList.toggle("on", on);
      img.classList.toggle("hop", on && hop);
    }
  }
  api.onMessage((m) => {
    if (m.pose) show(m.pose, m.hop);
    if (typeof m.paused === "boolean") document.body.classList.toggle("paused", m.paused);
    if (m.say) {
      bubble.textContent = m.say;
      bubble.classList.add("on");
      clearTimeout(hide);
      hide = setTimeout(() => bubble.classList.remove("on"), 4000);
    }
  });
  show(${JSON.stringify(pose)}, false);
</script></body></html>`;
}

/** The page again when the one who is out changed. */
async function refresh() {
  if (!webview) return;
  const character = await who();
  if (character === shownFor) return;
  shownFor = character;
  webview.html = page(character);
}

function set(next, options = {}) {
  pose = next;
  webview?.postMessage({ pose: next, hop: !!options.hop });
}

async function say(key) {
  if (!webview || !(await setting("bubbles"))) return;
  webview.postMessage({ say: t(key) });
}

/** What she does once nothing happens: daydream, then doze. */
function settle() {
  if (away || aiBusy) return;
  later("daydream", DAYDREAM_MS, () => {
    if (!away && !aiBusy) set("daydream");
  });
  later("doze", DOZE_MS, () => {
    if (away || aiBusy) return;
    set("dozing");
    void say("stuck");
  });
}

function isNight() {
  const hour = new Date().getHours();
  return hour >= 23 || hour < 5;
}

async function typed() {
  const now = Date.now();
  if (!flowSince || now - lastTyped > DAYDREAM_MS) flowSince = now;
  lastTyped = now;
  if (!aiBusy) set("writing");
  if (now - flowSince > FLOW_MS && said.flow !== flowSince) {
    said.flow = flowSince;
    void say("flow");
  }
  const night = new Date().toLocaleDateString("en-CA");
  if (isNight() && said.night !== night && (await setting("night"))) {
    said.night = night;
    void say("late");
  }
  settle();
}

function saved() {
  if (aiBusy) return;
  const day = new Date().toLocaleDateString("en-CA");
  if (said.first !== day) {
    said.first = day;
    set("celebrate", { hop: true });
    void say("first");
  } else {
    set("happy", { hop: true });
    void say("saved");
  }
  later("afterSave", 2500, () => set(lastTyped && Date.now() - lastTyped < DAYDREAM_MS ? "writing" : "daydream"));
  settle();
}

async function aiChanged(state) {
  const busy = state && state.state !== "idle";
  const provider = state && state.model ? state.model.provider : null;
  if (busy) {
    clearTimeout(timers.guest);
    const arriving = !aiBusy;
    aiBusy = true;
    guest = BY_PROVIDER[provider] || null;
    await refresh();
    set(arriving ? "surprised" : "curious", { hop: arriving });
    if (arriving) {
      void say("guest");
      later("lean", 1500, () => aiBusy && set("curious"));
    }
    return;
  }
  if (!aiBusy) return;
  aiBusy = false;
  set("happy", { hop: true });
  later("guest", GUEST_MS, async () => {
    guest = null;
    await refresh();
  });
  settle();
}

function appChanged(state) {
  away = state !== "active";
  if (away) {
    clearTimeout(timers.daydream);
    clearTimeout(timers.doze);
    set("asleep");
  } else {
    set("daydream", { hop: true });
    settle();
  }
}

exports.activate = function (ctx) {
  ctx.subscriptions.push(
    textus.views.registerWebview(VIEW, {
      resolve: async (view) => {
        webview = view;
        shownFor = null;
        await refresh();
        view.onDidDispose(() => {
          if (webview === view) webview = null;
        });
        void say("start");
        settle();
      },
    }),
    textus.commands.register("catvinci.desk-pet.toggle", async () => {
      const open = await textus.layout.floatingViews();
      if (open.some((v) => v.view === VIEW)) await textus.layout.closeFloating(VIEW);
      else await textus.layout.openFloating(VIEW);
    }),
    textus.layout.onDidChangeFloating((change) => {
      if (change.view === VIEW) webview?.postMessage({ paused: !change.visible });
    }),
    textus.app.onDidActivity((activity) => {
      if (activity.kind === "typing") void typed();
      else if (activity.kind === "saved") saved();
    }),
    textus.ai.onDidChangeState((state) => void aiChanged(state)),
    textus.app.onDidChangeState(appChanged),
    textus.settings.onDidChange(() => void refresh()),
    {
      dispose: () => {
        for (const name of Object.keys(timers)) clearTimeout(timers[name]);
      },
    },
  );
  // The first time she is turned on she shows herself; after that she
  // comes and goes as you leave her.
  const store = ctx.storage.global;
  void store.get("introduced").then((introduced) => {
    if (introduced) return;
    void store.set("introduced", true);
    void textus.layout.openFloating(VIEW);
  });
  void textus.ai.state().then((state) => {
    if (state && state.state !== "idle") void aiChanged(state);
  });
};
