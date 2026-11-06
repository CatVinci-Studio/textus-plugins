import { expect, it } from "vitest";
import { openEncryptedStore } from "./encrypted-store";
import { MemoryLocal, MemoryStore, bytes } from "./test-fixtures";

// On S3 each store call is one HTTP request; README's request table follows this.
class Counting extends MemoryStore {
  calls: string[] = [];
  async get(key: string) {
    this.calls.push(`GET ${key}`);
    return super.get(key);
  }
  async has(key: string) {
    this.calls.push(`HEAD ${key}`);
    return super.has(key);
  }
  async put(key: string, value: Uint8Array) {
    this.calls.push(`PUT ${key}`);
    return super.put(key, value);
  }
  async create(key: string, value: Uint8Array) {
    this.calls.push(`PUT-IF-NONE-MATCH ${key}`);
    return super.create(key, value);
  }
  async remove(key: string) {
    this.calls.push(`DELETE ${key}`);
    return super.remove(key);
  }
}

it("counts the S3 requests of an idle sync, a saved edit and a deletion", async () => {
  const raw = new Counting();
  const password = "test-only long sync passphrase";
  const a = new MemoryLocal({ "a.md": "one", "b.md": "two" });
  await a.sync(await openEncryptedStore(raw, password));
  const measure = async () => {
    raw.calls = [];
    await a.sync(await openEncryptedStore(raw, password));
    return raw.calls.length;
  };
  expect(await measure()).toBe(8);
  a.files.set("a.md", bytes("edited"));
  expect(await measure()).toBe(17);
  a.files.delete("b.md");
  expect(await measure()).toBe(14);
});
