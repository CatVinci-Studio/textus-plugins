import { expect, it } from "vitest";
import { loadPlugin, memoryStorage } from "./plugin-host";

/** Quick Notes' tool for Textus AI (plugins/catvinci.quick-notes/host.js). */
it("adds a note to the top of the list", async () => {
  const storage = memoryStorage();
  await storage.set("notes", [{ id: "a", text: "Older", at: 1 }]);
  const { tools } = loadPlugin("catvinci.quick-notes", {}, storage);
  expect(await tools.get("add_note")!({ text: "  Buy milk " })).toEqual({ added: "Buy milk", notes: 2 });
  expect(((await storage.get("notes")) as { text: string }[]).map((n) => n.text)).toEqual(["Buy milk", "Older"]);
  expect(await tools.get("add_note")!({ text: " " })).toHaveProperty("error");
});
