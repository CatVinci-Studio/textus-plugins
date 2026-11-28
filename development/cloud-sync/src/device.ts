/** What differs between the devices a folder syncs on. */
export interface Device {
  /** Syncs on opening and on coming back to Textus, never in the
   *  background (lifecycle.ts). */
  phone: boolean;
  /** The most transfers at once a new connection starts with. */
  parallel: number;
  /** A new connection's largest file, in MiB: larger ones stay out. */
  maxFileMiB: number;
  /** The part of a folder's path that changes when the app is updated,
   *  and what stands for it in the keys the folder's settings are under. */
  container?: [RegExp, string];
  /** Where a file deleted elsewhere goes when the system has no Trash: a
   *  folder in the synced one that isn't synced. */
  ownTrash?: string;
  /** A folder the system already syncs (iCloud Drive): said, not refused. */
  synced?: RegExp;
  /** A folder that can't be synced, and the page's words for why. */
  unsupported?: [RegExp, string];
}

const DESKTOP: Device = { phone: false, parallel: 32, maxFileMiB: 128 };
const DEVICES: Record<string, Device> = {
  ios: {
    phone: true,
    parallel: 2,
    maxFileMiB: 32,
    // The app's Documents, on a device and in the simulator.
    container: [
      /^.*\/Containers\/Data\/Application\/[0-9a-f-]{36}\/Documents(?=\/|$)/i,
      "documents:",
    ],
    synced: /\/Mobile Documents\//,
  },
  android: {
    phone: true,
    parallel: 2,
    maxFileMiB: 32,
    ownTrash: "Sync trash",
    // Opened without access to all files: no binary writes, no Trash.
    unsupported: [/^content:\/\//, "contentFolder"],
  },
};

export const deviceOf = (platform?: string): Device =>
  (platform && Object.hasOwn(DEVICES, platform) && DEVICES[platform]) ||
  DESKTOP;

/** The folder as its saved settings know it: the same across updates of
 *  the app, which move its Documents on iOS. */
export function folderKey(root: string, platform?: string) {
  const container = deviceOf(platform).container;
  return container ? root.replace(container[0], container[1]) : root;
}

/** The plugin API a phone's Textus answers from 1.4.7 (1.10): its app
 *  state (lifecycle.ts) and its Trash are real there. */
const PHONE_API = [1, 10];

function older(version: string | undefined, than: number[]) {
  const parts = (version ?? "0").split(".").map(Number);
  for (let i = 0; i < than.length; i++) {
    const n = parts[i] || 0;
    if (n !== than[i]) return n < than[i];
  }
  return false;
}

/** Why the folder `root` can't sync on this device, as the page's words'
 *  key; null where it can. */
export function blockedHere(
  device: Device,
  root: string,
  apiVersion: string | undefined,
): string | null {
  if (device.phone && older(apiVersion, PHONE_API)) return "needsNewerTextus";
  if (device.unsupported?.[0].test(root)) return device.unsupported[1];
  return null;
}
