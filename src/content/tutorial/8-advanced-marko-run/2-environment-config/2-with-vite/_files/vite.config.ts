import { defineConfig, loadEnv } from "vite";
import marko from "@marko/run/vite";

export default defineConfig(({ mode }) => {
  // Read the .env file(s) for this mode (no prefix filter → all keys).
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [marko()],
    // Replace these references with the .env values at build time.
    define: {
      "process.env.SITE_NAME": JSON.stringify(env.SITE_NAME),
      "process.env.SUPPORT_EMAIL": JSON.stringify(env.SUPPORT_EMAIL),
    },
    server: {
      allowedHosts: true, // accept the WebContainer preview host
    },
  };
});
