import { defineConfig } from "vitest/config";

// Only this checkout's tests: not the other branches' worktrees under .claude/.
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts", "development/**/*.test.ts"],
  },
});
