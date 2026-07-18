import { defineConfig } from "vitest/config";
import marko from "@marko/vite";

export default defineConfig({
  // The Marko plugin is what lets vitest read .marko files at all.
  // `linked: false` turns off the asset-orchestration machinery, which
  // exists to wire scripts and styles into a served page — tests don't
  // serve pages.
  plugins: [marko({ linked: false })],
  test: {
    // A DOM in Node, so tests can click things and read the screen.
    environment: "jsdom",
    // Unmounts what a test rendered before the next one runs.
    setupFiles: ["./vitest.setup.ts"],
  },
});
