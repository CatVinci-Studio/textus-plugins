import { ID, type ViewState } from "./model";
import { statusText } from "./status";

type T = (key: string, ...args: unknown[]) => string;

/** The status bar's item: how sync stands, its age kept current; none
 *  while sync isn't set up or the plugin has stopped (a null state). */
export class StatusBar {
  private item?: Textus.StatusItemHandle;
  private shown: string | null = null;
  private clock: ReturnType<typeof setInterval>;
  constructor(
    private api: Textus.Api,
    private t: T,
    private state: () => ViewState | null,
  ) {
    this.clock = setInterval(() => this.show(), 30_000);
  }
  show() {
    const state = this.state();
    const text = state
      ? statusText(state, Date.now(), this.t, this.api.env.language)
      : null;
    if (!text) {
      this.item?.dispose();
      this.item = undefined;
    } else if (!this.item)
      this.item = this.api.ui.statusItem("status", {
        text,
        tooltip: state!.message,
        command: `${ID}.open`,
      });
    else if (text !== this.shown)
      this.item.update({ text, tooltip: state!.message });
    this.shown = text;
  }
  stop() {
    clearInterval(this.clock);
    this.show();
  }
}
