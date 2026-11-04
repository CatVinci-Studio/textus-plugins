// Desk Pet: a chibi companion in a floating view. Textus-chan, or the
// LLM-chan of the model Textus AI is using while it works; she writes as you
// type, daydreams and dozes when you stop, is pleased when you save, leans
// in when Textus AI is at work, answers a poke and sleeps while Textus is
// away. She hears only that something happened - never a word of the
// document or the chat. What each one says, in her own voice, is in
// lines/<language>.json.

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


/** Every pose is drawn looking right: on the right she turns to look in. */
const turned = () => side === "right";

/** After this long without typing she daydreams, then dozes. */
const DAYDREAM_MS = 60 * 1000;
const DOZE_MS = 4 * 60 * 1000;
/** A guest stays this long after Textus AI is done. */
const GUEST_MS = 90 * 1000;
/** Typing this long without a long pause, and she cheers you on; this
 *  much longer, and she asks you to rest. */
const FLOW_MS = 10 * 60 * 1000;
const REST_MS = 50 * 60 * 1000;
/** Away this long, and she welcomes you back. */
const BACK_MS = 30 * 60 * 1000;

let webview = null;
let shownFor = null;
let pose = "daydream";
/** The half of the window or screen she sits in: she faces the middle. */
let side = "right";
let guest = null;
let aiBusy = false;
let away = false;
let flowSince = null;
let lastTyped = 0;
let awaySince = 0;
/** False while folded to a dot. */
let visible = true;
/** Whether Textus AI proposed an edit in the request under way. */
let proposed = false;
let lines = null;
/** activate's context: the plugin's own files and storage. */
let context = null;
const timers = {};
const said = {};
const lastLine = {};

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
  .stage { position: absolute; inset: var(--space-6) 0 0; }
  img { position: absolute; bottom: 0; left: 0; max-width: 100%; max-height: 100%; opacity: 0; transform-origin: 50% 100%;
    transition: opacity var(--dur-fast) var(--ease-standard); pointer-events: none; }
  img.on { opacity: 1; animation: breathe 3.6s ease-in-out infinite; }
  img.hop { animation: hop 0.5s var(--ease-spring-bouncy, ease-out), breathe 3.6s ease-in-out 0.5s infinite; }
  @keyframes breathe { 0%, 100% { transform: scale(1, 1); } 50% { transform: scale(1.012, 1.02); } }
  @keyframes hop { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } }
  body.paused img { animation-play-state: paused; }
  .stage.turned img { left: auto; right: 0; scale: -1 1; }
  .bubble { position: absolute; top: 0; left: 50%; max-width: 92%; transform: translateX(-50%);
    padding: var(--space-1) var(--space-2); border: 1px solid var(--ui-border); border-radius: var(--shape-m);
    background: var(--ui-surface); color: var(--ui-text); font-size: var(--text-secondary); line-height: 1.4; text-align: center;
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
    if (typeof m.turned === "boolean") document.querySelector(".stage").classList.toggle("turned", m.turned);
    if (m.say) {
      bubble.textContent = m.say;
      bubble.classList.add("on");
      clearTimeout(hide);
      hide = setTimeout(() => bubble.classList.remove("on"), 4000);
    }
  });
  show(${JSON.stringify(pose)}, false);
  document.querySelector(".stage").classList.toggle("turned", ${JSON.stringify(turned())});
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

/** Still while folded or while Textus is away: nothing to draw for. */
function stillness() {
  webview?.postMessage({ paused: !visible || away, turned: turned() });
}

function set(next, options = {}) {
  pose = next;
  webview?.postMessage({ pose: next, hop: !!options.hop });
}

/** The lines in the UI's language, else English. */
async function loadLines() {
  const language = textus.env.language || "en";
  for (const name of [language, language.split("-")[0], "en"]) {
    try {
      lines = JSON.parse(await context.plugin.readText(`lines/${name}.json`));
      return;
    } catch {
      // No lines in that language: the next one.
    }
  }
}

/** One of her lines for the moment, never the same twice running. */
async function say(moment) {
  if (!webview || !(await setting("bubbles"))) return;
  const choices = lines?.[shownFor]?.[moment] ?? lines?.textus?.[moment];
  if (!choices || choices.length === 0) return;
  const key = `${shownFor}:${moment}`;
  const pick = choices.filter((line) => line !== lastLine[key]);
  const line = (pick.length ? pick : choices)[
    Math.floor(Math.random() * (pick.length || choices.length))
  ];
  lastLine[key] = line;
  webview.postMessage({ say: line });
}

const today = () => new Date().toLocaleDateString("en-CA");

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
  if (now - flowSince > REST_MS && said.rest !== flowSince) {
    said.rest = flowSince;
    void say("rest");
  } else if (now - flowSince > FLOW_MS && said.flow !== flowSince) {
    said.flow = flowSince;
    void say("flow");
  }
  if (isNight() && said.night !== today() && (await setting("night"))) {
    said.night = today();
    void say("late");
  }
  settle();
}

function saved() {
  if (aiBusy) return;
  if (said.firstSave !== today()) {
    said.firstSave = today();
    set("celebrate", { hop: true });
    void say("firstSave");
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
    if (arriving) proposed = false;
    if (state.state === "proposing") proposed = true;
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
  if (state && state.ended === "failed") {
    set("surprised");
    void say("failed");
  } else if (!state || state.ended !== "stopped") {
    set("happy", { hop: true });
    void say(proposed ? "review" : "done");
  } else set("daydream");
  later("guest", GUEST_MS, async () => {
    guest = null;
    await refresh();
  });
  settle();
}

function appChanged(state) {
  const wasAway = away;
  away = state !== "active";
  if (away && !wasAway) awaySince = Date.now();
  stillness();
  if (away) {
    clearTimeout(timers.daydream);
    clearTimeout(timers.doze);
    set("asleep");
  } else {
    set("daydream", { hop: true });
    if (wasAway && Date.now() - awaySince > BACK_MS) void say("back");
    settle();
  }
}

/** A poke surprises her; petting pleases her; being carried off and set
 *  down, she gathers herself. */
function touched(touch) {
  if (touch.view !== VIEW) return;
  clearTimeout(timers.afterTouch);
  if (touch.kind === "pet") {
    set("happy", { hop: true });
    void say("pet");
  } else if (touch.kind === "moved") {
    set("surprised");
    void say("moved");
  } else {
    set(aiBusy ? "curious" : "surprised", { hop: true });
    void say("poke");
  }
  later("afterTouch", 2500, () => {
    if (!away) set(aiBusy ? "curious" : "daydream");
  });
}

exports.activate = function (ctx) {
  context = ctx;
  void loadLines();
  ctx.subscriptions.push(
    textus.views.registerWebview(VIEW, {
      resolve: async (view) => {
        webview = view;
        shownFor = null;
        await refresh();
        view.onDidDispose(() => {
          if (webview === view) webview = null;
        });
        // Hello once a day; after that she just comes back.
        const store = context.storage.global;
        if ((await store.get("hello")) !== today()) {
          await store.set("hello", today());
          void say("hello");
        }
        settle();
      },
    }),
    textus.commands.register("catvinci.desk-pet.toggle", async () => {
      const open = await textus.layout.floatingViews();
      if (open.some((v) => v.view === VIEW)) await textus.layout.closeFloating(VIEW);
      else await textus.layout.openFloating(VIEW);
    }),
    // From her right-click menu: who keeps you company.
    textus.commands.register("catvinci.desk-pet.switch", async () => {
      const now = (await setting("character")) || "auto";
      const picked = await textus.ui.pick(
        ["auto", ...CHARACTERS].map((value) => ({
          label: t(value),
          value,
          description: value === now ? t("current") : undefined,
        })),
        { placeholder: t("character") },
      );
      if (typeof picked === "string") await textus.settings.set("character", picked);
    }),
    textus.layout.onDidChangeFloating((change) => {
      if (change.view !== VIEW) return;
      if (change.side) side = change.side;
      visible = change.visible;
      stillness();
    }),
    textus.app.onDidActivity((activity) => {
      if (activity.kind === "typing") void typed();
      else if (activity.kind === "saved") saved();
    }),
    textus.ai.onDidChangeState((state) => void aiChanged(state)),
    textus.app.onDidChangeState(appChanged),
    textus.layout.onDidTouchFloating(touched),
    textus.env.onDidChangeLanguage(() => void loadLines()),
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
