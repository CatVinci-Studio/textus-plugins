import { expect, it } from "vitest";
import { folderKey } from "./device";
import { Workspace } from "./local";
import { bytes, memoryFolder, memoryStorage } from "./test-fixtures";

const simulator = (id: string) =>
  `/Users/me/Library/Developer/CoreSimulator/Devices/0382E831-5C78-4D60-95F2-D18267AAE86A/data/Containers/Data/Application/${id}/Documents`;
const A = "87908D58-57AB-434B-9CF1-80D9BDD2224A",
  B = "C4147BE8-97E4-4D69-862F-188ABE7EF348";

it("gives an iOS folder one key across the app's updates, on a device and in the simulator", () => {
  const device = (id: string) =>
    `/private/var/mobile/Containers/Data/Application/${id}/Documents/Notes`;
  expect(folderKey(device(A), "ios")).toBe("documents:/Notes");
  expect(folderKey(device(B), "ios")).toBe("documents:/Notes");
  expect(folderKey(simulator(A), "ios")).toBe(folderKey(simulator(B), "ios"));
  expect(folderKey(simulator(A), "ios")).toBe("documents:");
  // Another app's folder, or iCloud Drive: as it is.
  const icloud =
    "/private/var/mobile/Library/Mobile Documents/com~apple~CloudDocs/Notes";
  expect(folderKey(icloud, "ios")).toBe(icloud);
});
it("keeps a computer's and an Android folder's path as its key", () => {
  for (const platform of ["macos", "windows", "linux", "android", undefined])
    for (const root of ["/Users/me/Notes", "C:\\Notes", simulator(A)])
      expect(folderKey(root, platform)).toBe(root);
});
it("reads only what changed after an iOS update moved the folder", async () => {
  const storage = memoryStorage();
  const scan = async (id: string) => {
    const root = simulator(id);
    const files = new Map([[`${root}/a.md`, bytes("note")]]);
    const api = memoryFolder(root, files, "ios");
    let reads = 0;
    const read = api.files.read;
    api.files.read = async (p: string) => {
      reads++;
      return read(p);
    };
    await new Workspace(api, root, storage).scan();
    return reads;
  };
  expect(await scan(A)).toBe(1);
  expect(await scan(B)).toBe(0);
});
