import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:4173" },
  webServer: {
    // This template's `dev` script already bakes in `--port 3000`, so
    // `npm run dev -- --port 4173` would hand marko-run --port twice and
    // crash its port parsing. Call the binary directly instead.
    command: "npx marko-run dev --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: true,
  },
});
