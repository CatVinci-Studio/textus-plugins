// Before packing: the examples into the package, so it works outside this
// repository.
import { cpSync, rmSync } from "node:fs";
const to = new URL("./examples", import.meta.url);
rmSync(to, { recursive: true, force: true });
cpSync(new URL("../../examples", import.meta.url), to, { recursive: true });
