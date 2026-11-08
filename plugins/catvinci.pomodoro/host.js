// Pomodoro: a focus timer floating over the window or the desktop (a
// floating view, as Desk Pet's). A click starts or pauses it; its menu
// skips to the next span or starts over; a span's end is a notification.
// The timer is kept in the plugin's storage, so it runs on across a restart.
/* global pomodoro */
const VIEW = "catvinci.pomodoro.timer";
const t = (key, ...args) => textus.l10n.t(key, ...args);
let ctx;
let state = null;
let webview = null;
let timer = 0;

async function minutes() {
  const read = async (key, fallback) => {
    const n = Number(await textus.settings.get(key));
    return n > 0 && n <= 180 ? n : fallback;
  };
  return { focus: await read("focus", 25), rest: await read("rest", 5) };
}

async function load() {
  state =
    (await ctx.storage.global.get("timer")) || pomodoro.fresh(await minutes());
}

function save() {
  return ctx.storage.global.set("timer", state);
}

/** What the page shows: the span, the time left and how much is gone. */
async function show() {
  if (!webview || !state) return;
  const m = await minutes();
  const span = (state.phase === "focus" ? m.focus : m.rest) * 60000;
  const left = pomodoro.left(state, Date.now());
  webview.postMessage({
    phase: state.phase,
    label: t(state.phase),
    clock: pomodoro.clock(left),
    done: 1 - left / span,
    running: state.running,
    hint: t(state.running ? "pause" : "start"),
  });
}

/** Once a second while it runs: the page, and a span's end. */
async function step() {
  const m = await minutes();
  const { state: now, ended } = pomodoro.tick(state, Date.now(), m);
  if (ended) {
    state = now;
    await save();
    await textus.notify
      .show({
        title: t(ended === "focus" ? "focusDone" : "restDone"),
        body: t(ended === "focus" ? "takeRest" : "backToFocus"),
      })
      .catch(() => {});
  }
  await show();
  clearTimeout(timer);
  if (state.running) timer = setTimeout(step, 1000 - (Date.now() % 1000) + 20);
}

async function change(next) {
  state = next;
  await save();
  await step();
}

function page() {
  return `<!doctype html><html><head><style>
  body { margin: 0; height: 100vh; display: grid; place-items: center; overflow: hidden; user-select: none;
    -webkit-user-select: none; font-family: var(--font-sans); color: var(--ui-text); }
  button { all: unset; position: relative; width: 112px; height: 112px; border-radius: 50%; cursor: pointer;
    display: grid; place-items: center; background: var(--ui-surface); box-shadow: var(--shadow-popover); }
  button:focus-visible { outline: 2px solid var(--ui-accent); outline-offset: 2px; }
  svg { position: absolute; inset: 0; transform: rotate(-90deg); }
  circle { fill: none; stroke-width: 6; }
  .track { stroke: var(--ui-border); }
  .done { stroke: var(--ui-accent); stroke-linecap: round; }
  body.rest .done { stroke: var(--tone-green, var(--ui-accent)); }
  .text { position: relative; text-align: center; }
  .clock { font-size: var(--text-title); font-variant-numeric: tabular-nums; }
  .label { font-size: var(--text-caption); color: var(--ui-muted); }
  body.paused .clock { color: var(--ui-muted); }
</style></head><body>
<button id="timer" type="button"><svg viewBox="0 0 112 112"><circle class="track" cx="56" cy="56" r="50"/>
<circle class="done" id="ring" cx="56" cy="56" r="50" stroke-dasharray="314.16" stroke-dashoffset="314.16"/></svg>
<span class="text"><div class="clock" id="clock">--:--</div><div class="label" id="label"></div></span></button>
<script>
  const api = acquireTextusApi();
  const $ = (id) => document.getElementById(id);
  $("timer").onclick = () => api.postMessage({ type: "toggle" });
  api.onMessage((m) => {
    $("clock").textContent = m.clock;
    $("label").textContent = m.label;
    $("ring").setAttribute("stroke-dashoffset", String(314.16 * (1 - Math.min(1, Math.max(0, m.done)))));
    $("timer").setAttribute("aria-label", m.label + " " + m.clock + " - " + m.hint);
    document.body.classList.toggle("rest", m.phase === "rest");
    document.body.classList.toggle("paused", !m.running);
  });
  api.postMessage({ type: "ready" });
</script></body></html>`;
}

exports.activate = function (context) {
  ctx = context;
  context.subscriptions.push(
    textus.views.registerWebview(VIEW, {
      resolve: async (view) => {
        webview = view;
        view.html = page();
        view.onDidReceiveMessage(async (m) => {
          if (!m) return;
          if (m.type === "ready") await step();
          if (m.type === "toggle")
            await change(pomodoro.toggle(state, Date.now()));
        });
        view.onDidDispose(() => {
          if (webview === view) webview = null;
        });
      },
    }),
    textus.commands.register("catvinci.pomodoro.toggle", async () => {
      const open = await textus.layout.floatingViews();
      if (open.some((v) => v.view === VIEW))
        await textus.layout.closeFloating(VIEW);
      else await textus.layout.openFloating(VIEW);
    }),
    textus.commands.register("catvinci.pomodoro.startPause", () =>
      change(pomodoro.toggle(state, Date.now())),
    ),
    textus.commands.register("catvinci.pomodoro.skip", async () =>
      change(pomodoro.next(state, Date.now(), await minutes())),
    ),
    textus.commands.register("catvinci.pomodoro.reset", async () =>
      change(pomodoro.fresh(await minutes())),
    ),
    { dispose: () => clearTimeout(timer) },
  );
  void load().then(step);
};
